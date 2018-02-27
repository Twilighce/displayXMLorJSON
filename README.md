# displayXMLorJSON

在我的项目中，需要展示的文件作为 Clob 存储在 DB 中，可能为 XML 格式，也可能为 Json 格式，

用户在前端 click 'view XML' button 时，后端使用 getCharacterStream() 方法读取大字段 Clob，并将其转化为 String 类型传至前端；

这时，需要解决的问题就是：

如何将后端传来的这一 String 以其合适的格式（XML or Json）展示在页面上？
