---
title: 使用 AbortController 实现一个可中断的异步任务
date: 2020-12-06 13:41:20
category: WebFrontEnd
tags: WebAPI AbortController
openreward: true
---

## 目录

<!-- toc -->

- [前言](#前言)
- [介绍](#介绍)
- [实现](#实现)
- [总结](#总结)
- [参考](#参考)

<!-- tocstop -->

## 前言

JavaScript 中存在着很多的异步场景，比如网络的请求、文件的读取，亦或者是自定义的异步任务，在当下前端异步编程模型选项中，Promise 早已深入实践。Promise 及其发展者 await/async，有着优雅又现代化的接口设计，但 Promise 化的异步模型有一个问题，就是没有中断功能，只能等待结果是成是败。

那有没有方法实现一个可中断的异步任务？有，那就是使用 AbortController。

## 介绍

自从 ES2015 引入了  Promise ，开发者有了取消异步任务的需求，随后推出的一些 Web API 也开始支持异步方案，比如 Fetch API。TC39 委员会（就是制定 ECMAScript 标准的组织）最初尝试定义一套通用的解决方案，以便后续作为 ECMAScript 标准。但是后来讨论不出什么结果来，这个问题也就搁置了。鉴于此，WHATWG （HTML 标准制定组织）另起炉灶，自己搞出一套解决方案，直接在 DOM 标准上引入了 AbortController。这种做法的坏处显而易见，因为它不是语言层面的 ECMAScript 标准，因此 Node.js 平台也就不支持  AbortController 。

在 DOM 规范里， AbortController 设计得非常通用，因此事实上可以用在任何异步 API 中。目前在 Fetch API 用得最多，但完全可以用在自己的异步代码里。

## 实现

```js
const controller = new AbortController();
const signal = controller.signal;
// 自定义任务
const selfJob = new Promise((resolve, reject) => {
  // 如果已经触发了 aborted，则直接 reject
  if (signal.aborted) {
    return reject( error );
  }
  // 埋入 abort 事件，如果取消则直接 reject
  signal.addEventListener('abort', reject);
  // 处理异步任务
  setTimeout(() => {
    resolve(data)
  }, 1000)
});

try {
  const data = await selfJob();
} catch(err) {
  if (err.name == 'AbortError') { // handle abort()
    alert("Aborted!");
  } else {
    throw err;
  }
}

// 在其他地方调用，取消请求
controller.abort()
```

## 总结

使用 AbortController 中断异步任务本质上是利用观察者模式（或者称 EventEmitter 模式），在异步任务流程中埋入 abort 的监听事件，一旦外部发起 abort 事件，则在异步任务中触发 reject 流程，这样就能达到中断一个异步任务的目的。

AbortController 就是类似于这样的原生实现。

## 参考

+ [Cancel A Promise Using AbortController from @absolutgenius on @eggheadio](https://egghead.io/lessons/react-cancel-a-promise-using-abortcontroller)
+ [AbortController - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/FetchController)
+ [可中断异步任务的 API 设计 · Issue #9 · LeuisKen/leuisken.github.io · GitHub](https://github.com/LeuisKen/leuisken.github.io/issues/9)
+ [如何优雅地取消 JavaScript 异步任务？](https://juejin.cn/post/6844904098672672782)
