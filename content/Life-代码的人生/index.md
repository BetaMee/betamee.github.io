---
title: Life-代码的人生
date: 2018-08-15 22:50:35
category: LifeLogs
---

最近看王沪宁的《政治的人生》，对94年的社会思潮以及王学者的所思所考走马观花地了解了一下。作者谈他的一生奉献给了政治学，因而取书名政治的人生。想想自己，以后的人生基本上是和代码打交道，一出波澜壮阔的“代码的人生”。

时值八月，刚入职一个半月，对于一个才毕业不久的学生，职业的发展才刚刚开始。。。


`var a = 'ddd'`

```js
exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
  const { createNodeField } = boundActionCreators

  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({
      node,
      getNode,
    })

    createNodeField({
      node,
      name: 'slug',
      value: `/content${slug}`,
    })
  }
}
```

```css
pre[class*="language-"] {
  color: #333;
  background: none;
  font-family: Consolas, "Liberation Mono", Menlo, Courier, monospace;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
  line-height: 1.4;

  -moz-tab-size: 8;
  -o-tab-size: 8;
  tab-size: 8;

  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
}
```

```html
<div>Hello</div>
```

```java
  Obeject a = new Object()
```