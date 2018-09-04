---
title: 代码的人生
date: 2018-08-15 22:50:35
category: LifeLogs
---

最近看王沪宁的《政治的人生》，对94年的社会思潮以及王学者的所思所考走马观花地了解了一下。作者谈他的一生奉献给了政治学，因而取书名政治的人生。想想自己，以后的人生基本上是和代码打交道，一出波澜壮阔的“代码的人生”。

## 这是一个标题

```js
var a = 'ddd'
```

```js{1,4-6}
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

> 图片

![](./images/vk.jpg)

> 图片