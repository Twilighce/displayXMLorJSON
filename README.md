# displayXMLorJSON

## 项目背景

在我的项目中，需要展示的文件作为 Clob 存储在 DB 中，可能为 XML 格式，也可能为 Json 格式，

用户在前端 click 'view XML' button 时，后端使用 getCharacterStream() 方法读取大字段 Clob，并将其转化为 String 类型传至前端；

(关于后端如何从 DB 读取 Clob 的请看这里： [enter link description here](https://gist.github.com/Twilighce/8e2ad27ea12e590db07987ab521002d6)

## 需求

这时，需要解决的问题就是：

如何将后端传来的这一 String 以其合适的格式（XML or Json）展示在页面上？

其中， 需要展示为 Json 格式的字符串，可直接使用 JSON.parse(str) 方法转换格式。

那么需要展示为 XML 格式的字符串该如何处理呢？

## 一些弯路

google了这个问题，“display xml on browser” 的需求确实很常见，

给出的处理方法，多是将需要展示的xmlString 先转化为 xml document，然后通过操作DOM方法来展示xml document，

但在我的项目中，不同的订单中，XML 各不相同，甚至差别很大，没有统一的标签，且订单数量庞大，显然无法针对每个XML编写具体的DOM 操作函数，

于是自己编写通用方法，来将 无格式的String 转换为 XML 格式，

同时注意编写 escapeHTML 函数进行转义。
