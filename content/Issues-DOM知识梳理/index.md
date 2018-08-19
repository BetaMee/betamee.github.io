---
title: Issue-DOM知识梳理
date: 2017-09-10 16:54:59
category: Issues
---

趁九月在学校有空，对一些基础知识进行梳理一下。这次是DOM相关的知识。

## Node类型（节点类型）

JavaScript中的所有节点类型都是继承自Node类型，因此所有节点类型都共享着相同的基本属性和方法。

每一个节点都有一个nodeType属性，表明节点的类型。节点类型由在Node类型中定义的下列12个数值常量来表示：

- Node.ELEMENT_NODE(1) // 元素节点
- Node.ATTRIBUTE_NODE(2) // 属性节点
- Node.TEXT_NODE(3) // 文本节点
- Node.CDATA_SECTION_NODE(4)
- Node.ENTITY_REFERENCE_NODE(5)
- Node.ENTITY_NODE(6)
- Node.PROCESSING_INSTRUCTION_NODE(7)
- Node.COMMENT_NODE(8) // 注释节点
- Node.DOCUMENT_NODE(9)
- Node.DOCUMENT_TYPE_NODE(10)
- Node.DOCUMENT_FRAGMENT_NODE(11)
- Node.NOTATION_NODE(12)

常用的就是文本、元素、属性节点，其他的就不知道了==

我的理解是，html中的所有节点都有对应的类型，这些节点的继承自Node类型，而后面讲的Document类型，它是继承自Document，最终也还是继承自Node类型，
所以Node类型可以理解为一个大合集，包含元素、文本、文档、注释节点等

### 节点的属性的关系

不废话，上图

[DOM节点关系](DOM节点关系.png)

### 操纵节点的方法


## Document类型

特点：

- nodeType为9
- nodeName的值为"#document"
- nodeValue的值为null
- parentNode的值为null
- ownerDocument的值为null

常用属性

- document.body
- document.title
- document.URL
- document.domain
- document.referrer

常用的方法

- document.getElementById()
- document.getElementsByTagName()
- document.createElement()

## Element类型

如：
```html
<div class="id">
  <p>hh</p>
</div>
```

特点:

- nodeType为1
- nodeName的值为标签名
- nodeValue的值为null
- parentNode的值可能为Document或Element

常用的属性:

- childNodes 子节点
- attributes 属性节点

常用方法：

- getAttribute()
- setAttribute()
- removeAttribute()



## Text类型

- nodeType为3
- nodeName的值为"#text"
- nodeValue的值为包含的文本内容
- parentNode是一个Element
- 没有子节点

常用属性：

- nodeValue为文本内容

常用方法

- 在父元素调用normalize()方法可以将相邻的文本节点进行合并
- splitText()可以将一个文本加点分割


## NodeList及其他

理解NodeList及其近亲NamedNodeMap和HTMLCollection，是从整体上透彻理解DOM的关键。NodeList是
在用到`var div=documen.getElementById('div')`这类操作时获取**动态DOM结构**，类Array结构，
有length，但又不是数组，并且会随着DOM结构变化而变化。
