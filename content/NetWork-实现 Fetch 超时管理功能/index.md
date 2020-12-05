---
title: 实现 Fetch 超时管理功能
date: 2020-12-05 23:56:50
category: NetWork
tags: Net_Basic Request
openreward: true
---

## 目录

<!-- toc -->

- [前言](#前言)
- [实现](#实现)

<!-- tocstop -->

## 前言

在[对比 Ajax 和 Fetch](https://betamee.github.io/content/NetWork-%E5%AF%B9%E6%AF%94%20Ajax%20%E5%92%8C%20Fetch/)一文中提到，Fetch API 是没有内置的 timeout 超时管理功能的，但现实项目中如果需要这个功能，该怎么实现呢？

## 实现

Fetch API 自身是基于 Promise 模型的，所以可以从 Promise 上着手。

在 Promise 中，有一个 [*Promise.race(iterable)*](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/race) 方法，一旦迭代器中的某个 promise 解决或拒绝，返回的 promise 就会解决或拒绝：

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(resolve, 500, 'one');
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'two');
});

Promise.race([promise1, promise2]).then((value) => {
  console.log(value);
  // Both resolve, but promise2 is faster
});
```

以此为基础，则可以给 Fetch 搭配一个新的定时 promise 和 AbortController，用于在超时的时候取消请求并切换整个流程：

```js
function fetchWithTimeout(url, param, timeout) {
  // abortcontroller
  const controller = new AbortController()
  // 超时 promise
  const timeoutPromise = (timeout) => new Promise((resolve, reject) => {
    setTimeout(() => {
      // 超时响应信息
      const response = new Response(
        JSON.stringify({
          code: 1,
          msg: `timeout ${timer}s`
        })
      );
      reslove(response); //  reslove 流程
      controller.abort(); // 发送终止信号
    }, timeout)
  })
  // 请求 promsie
  const fetchPromise = fetch(url, {
    signal: signal //设置信号
    ...prama
  })
  // 返回一个 Promise.race
  return Promise.race([
    timeoutPromise(timeout),
    fetchPromise
  ])
}
```
