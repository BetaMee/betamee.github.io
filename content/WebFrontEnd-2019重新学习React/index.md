---
title: 2019年重新学习React
date: 2019-06-11 22:41:00
category: WebFrontEnd
tags: config tag test
---

## 前言

从去年六月毕业上班后，大半年就没怎么跟进React最新的进展，一方面是刚毕业，上班做业务以及生活上杂七杂八的事，没有花多少时间在技术上，另一方面以前的老电脑性能老化，跑不动代码了。现在更新了新的Macbook Pro，可以集中精力去追踪和研究新技术了。就先从熟悉的React开始吧。

重新通读了一下React的官方文档，官方团队真的是太细致，对于不同群体的开发者，用不同的方式细致入微地介绍每一个概念，生怕你们不懂。这种精神还是很值得学习的。我从2015年听说这个框架，2016年开始用，最早的版本还是0.14，到现在v16，怎么说也算半个老用户了（逃）。

本文是一个复习、重温的总结文，旨在总结自己的疑惑点和一些没有观察到的角度。好文档总是常读常新，这也为后续深入源码打下一个基础吧。

## 总阅读目录

本次复习，除开非常基础的介绍，其他地方都仔细地读了一下，具体地阅读目录见下：

#### 1. MAIN CONCEPTS

- 1.[Hello World – React](https://reactjs.org/docs/hello-world.html)
- 2.[Introducing JSX – React](https://reactjs.org/docs/introducing-jsx.html)
- 3.[Rendering Elements – React](https://reactjs.org/docs/rendering-elements.html)
- 4.[Components and Props – React](https://reactjs.org/docs/components-and-props.html)
- 5.[State and Lifecycle – React](https://reactjs.org/docs/state-and-lifecycle.html)
- 6.[Handling Events – React](https://reactjs.org/docs/handling-events.html)
- 7.[Conditional Rendering – React](https://reactjs.org/docs/conditional-rendering.html)
- 8.[Lists and Keys – React](https://reactjs.org/docs/lists-and-keys.html)
- 9.[Forms – React](https://reactjs.org/docs/forms.html)
- 10.[Lifting State Up – React](https://reactjs.org/docs/lifting-state-up.html)
- 11.[Composition vs Inheritance – React](https://reactjs.org/docs/composition-vs-inheritance.html)
- 12.[Thinking in React – React](https://reactjs.org/docs/thinking-in-react.html)

#### 2. ADVANCED GUIDES

- 1.[Accessibility – React](https://reactjs.org/docs/accessibility.html)
- 2.[Code-Splitting – React](https://reactjs.org/docs/code-splitting.html)
- 3.[Context – React](https://reactjs.org/docs/context.html)
- 4.[Error Boundaries – React](https://reactjs.org/docs/error-boundaries.html)
- 5.[Forwarding Refs – React](https://reactjs.org/docs/forwarding-refs.html)
- 6.[Fragments – React](https://reactjs.org/docs/fragments.html)
- 7.[Higher-Order Components – React](https://reactjs.org/docs/higher-order-components.html)
- 8.[Integrating with Other Libraries – React](https://reactjs.org/docs/integrating-with-other-libraries.html)
- 9.[JSX In Depth – React](https://reactjs.org/docs/jsx-in-depth.html)
- 10.[Optimizing Performance – React](https://reactjs.org/docs/optimizing-performance.html)
- 11.[Portals – React](https://reactjs.org/docs/portals.html)
- 12.[React Without ES6 – React](https://reactjs.org/docs/react-without-es6.html)
- 13.[React Without JSX – React](https://reactjs.org/docs/react-without-jsx.html)
- 14.[Reconciliation – React](https://reactjs.org/docs/reconciliation.html)
- 15.[Refs and the DOM – React](https://reactjs.org/docs/refs-and-the-dom.html)
- 16.[Render Props – React](https://reactjs.org/docs/render-props.html)
- 17.[Static Type Checking – React](https://reactjs.org/docs/static-type-checking.html)
- 18.[Strict Mode – React](https://reactjs.org/docs/strict-mode.html)
- 19.[Typechecking With PropTypes – React](https://reactjs.org/docs/typechecking-with-proptypes.html)
- 20.[Uncontrolled Components – React](https://reactjs.org/docs/uncontrolled-components.html)
- 21.[Web Components – React](https://reactjs.org/docs/web-components.html)

#### 3. API REFERENCE

- 1.[React Top-Level API – React](https://reactjs.org/docs/react-api.html)
- 2.[React.Component – React](https://reactjs.org/docs/react-component.html)
- 3.[ReactDOM – React](https://reactjs.org/docs/react-dom.html)
- 4.[ReactDOMServer – React](https://reactjs.org/docs/react-dom-server.html)
- 5.[DOM Elements – React](https://reactjs.org/docs/dom-elements.html)
- 6.[SyntheticEvent – React](https://reactjs.org/docs/events.html)
- 7.[Test Utilities – React](https://reactjs.org/docs/test-utils.html)
- 8.[Shallow Renderer – React](https://reactjs.org/docs/shallow-renderer.html)
- 9.[Test Renderer – React](https://reactjs.org/docs/test-renderer.html)
- 10.[JavaScript Environment Requirements – React](https://reactjs.org/docs/javascript-environment-requirements.html)
- 11.[Glossary of React Terms – React](https://reactjs.org/docs/glossary.html)

#### 4. HOOKS (PREVIEW)

- 1.[Introducing Hooks – React](https://reactjs.org/docs/hooks-intro.html)
- 2.[Hooks at a Glance – React](https://reactjs.org/docs/hooks-overview.html)
- 3.[Using the State Hook – React](https://reactjs.org/docs/hooks-state.html)
- 4.[Using the Effect Hook – React](https://reactjs.org/docs/hooks-effect.html)
- 5.[Rules of Hooks – React](https://reactjs.org/docs/hooks-rules.html)
- 6.[Building Your Own Hooks – React](https://reactjs.org/docs/hooks-custom.html)
- 7.[Hooks API Reference – React](https://reactjs.org/docs/hooks-reference.html?no-cache=1)
- 8.[Hooks FAQ – React](https://reactjs.org/docs/hooks-faq.html)

#### 5. OFFICIAL BLOG

- [React v16.7: No, This Is Not The One With Hooks – React Blog](https://reactjs.org/blog/2018/12/19/react-v-16-7.html)
- [React 16.x Roadmap – React Blog](https://reactjs.org/blog/2018/11/27/react-16-roadmap.html)
- [React Conf recap: Hooks, Suspense, and Concurrent Rendering – React Blog](https://reactjs.org/blog/2018/11/13/react-conf-recap.html)
- [React v16.6.0: lazy, memo and contextType – React Blog](https://reactjs.org/blog/2018/10/23/react-v-16-6.html)
- [Create React App 2.0: Babel 7, Sass, and More – React Blog](https://reactjs.org/blog/2018/10/01/create-react-app-v2.html)
- [Introducing the React Profiler – React Blog](https://reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)
- [React v16.4.2: Server-side vulnerability fix – React Blog](https://reactjs.org/blog/2018/08/01/react-v-16-4-2.html)
- [You Probably Don't Need Derived State – React Blog](https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)
- [React v16.4.0: Pointer Events – React Blog](https://reactjs.org/blog/2018/05/23/react-v-16-4.html)
- [React v16.3.0: New lifecycles and context API – React Blog](https://reactjs.org/blog/2018/03/29/react-v-16-3.html)
- [Update on Async Rendering – React Blog](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html)
- [Sneak Peek: Beyond React 16 – React Blog](https://reactjs.org/blog/2018/03/01/sneak-peek-beyond-react-16.html)
- [Behind the Scenes: Improving the Repository Infrastructure – React Blog](https://reactjs.org/blog/2017/12/15/improving-the-repository-infrastructure.html)
- [Introducing the React RFC Process – React Blog](https://reactjs.org/blog/2017/12/07/introducing-the-react-rfc-process.html)
- [React v16.2.0: Improved Support for Fragments – React Blog](https://reactjs.org/blog/2017/11/28/react-v16.2.0-fragment-support.html)
- [React v16.0 – React Blog](https://reactjs.org/blog/2017/09/26/react-v16.0.html)
- [React v15.6.2 – React Blog](https://reactjs.org/blog/2017/09/25/react-v15.6.2.html)
- [DOM Attributes in React 16 – React Blog](https://reactjs.org/blog/2017/09/08/dom-attributes-in-react-16.html)
- [Error Handling in React 16 – React Blog](https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html)


在整理官方博客地时候，猛然发现自己已经落下这么多post，有种追电视剧断了一整季的感觉哈哈哈。其实从官方博客中，最能看得到这个框架的发展情况，况且每一篇文章的作者都是前端届的大佬，必须好好追着。


## 基本概念解析

元素（Element）、组件（Component）、节点（Node）、实例（Instance）概念解析
TODO

在这一章发现一个有趣的点，以前思考的没那么深：

```js
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(element, document.getElementById('root'));
}

setInterval(tick, 1000);
```


参考：

- [React – A JavaScript library for building user interfaces](https://reactjs.org/)
- [React 深入系列１：React 中的元素、组件、实例和节点 - 掘金](https://juejin.im/post/5ac42e17f265da239e4e491a)


