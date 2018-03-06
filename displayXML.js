    event: {
        'click #XML': 'viewXML',
    },

    viewXML: function(e){
        var _this = this;
        this.model.getCallStatus(orderID).done((function(response){                
             
            if(response.response_code==200){
                    _this.xmlOrJson(response.str);
                }else{
                    _this.publishEvent('headerEventHandler:showError',response.response_message);
                }
                  
             }).bind(this)).fail((function(ex,status){
                 _this.publishEvent('headerEventHandler:showError',"Error Happend, please contact administrator!")
             }).bind(this));                   
    },

    // 判断需要以何种格式显示该字符串
    xmlOrJson: function(str) {
        if (str.substring(0,1)=='<' || str.substring(1,2)=='<') {
            this.viewXml(str);
        } else {
            this.viewJson(str);
        }
    },

    // 以 XML 格式展示
    viewXml: function(xmlString) {
        var _this = this;

        var formatted = _this.formatXML(xmlString);
        var escaped = _this.escapeHTML(formatted);

        var newWindow = window.open('',"Request Xml",'');
        newWindow.document.write("<HTML><pre>" + escaped + "</pre></HTML>");
        newWindow.focus();           
    },

    // 以 Json 格式展示
    viewJson: function(jsonString) {

        var _this = this;
        try {
            var json = JSON.parse(jsonString);
        } catch(e) {
            _this.viewXml(jsonString);
        }

        var loadedXml = JSON.stringify(json, null, 4);
        var newWindow = window.open('',"Request Json",'');
        newWindow.document.write("<HTML><pre>" + loadedXml + "</pre></HTML>");
        newWindow.focus();
    },

    // 转义
    escapeHTML: function(str) {

        str = str
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
            //.replace(/&gt;&lt;/g, '&gt;</br></br>&nbsp;&nbsp;&nbsp;&nbsp;&lt;');

        return str;
    },        

    // 将无格式的xmlString 转化为 XML 格式
    formatXML: function(xmlString,indent) {
        var indent = indent || "\t"; //can be specified by second argument of the function

        var tabs = "";  //store the current indentation

        var result = xmlString.replace(
        /\s*<.+?>|\s*[^<]+/g , //pattern to match nodes (angled brackets or text)
        function(m){ 
            m = m.replace(/^\s+|\s+$/g, "");  //trim the match

            if (/^<[?]xml/.test(m))  return m+"\n";  //if the match is a header, ignore it

            if (/^<[/]/.test(m))  //if the match is a closing tag
            {
                tabs = tabs.replace(indent, "");  //remove one indent from the store
                m = tabs + m;  //add the tabs at the beginning of the match
            }
            else if (/<.*[^>]\/>/.test(m))  //if the match contains an entire node
            {
                    //leave the store as is
                m = tabs + m; //add the tabs at the beginning of the match
            }
            else if (/<.*>/.test(m)) //if the match starts with an opening tag and does not contain an entire node
            {
                m = tabs + m;  //add the tabs at the beginning of the match
                tabs += indent;  //and add one indent to the store
            }
            else  //if the match contain a text node
            {
                m = tabs + m;  // add the tabs at the beginning of the match
            }

                  //return m+"\n";
            return "\n"+m; //content has additional space(line) from header
        });

        //Additional fixes
        //result = result.replace(/(<[^\/>]*>)\n\s*(<[\/])/g, "$1$2");  //remove \n between opening and closing tags of the same node if no content is between them
        result = result.replace(/(<[^\/>]*)>\n\s*(<[\/][^>]*>)/g, "$1 />");  //remove \n and join opening with closing tags of the same node to one entire node if no content is between them
        result = result.replace(/(<([a-zA-Z:]+\b)[^>]*>)\n\s*([^<]+)\n\s*(<\/\2>)/g, "$1$3$4"); //remove \n between opening, content and closing tags of the same node (to display in one line)

        return result;
    }
