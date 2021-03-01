---
title: JavaScript 异步迭代器和异步生成器
date: 2021-03-01 23:36:43
category: WebFrontEnd
tags: JavaScript 语言特性
openreward: true
---

# JavaScript 异步迭代器和异步生成器

## 目录

<!-- toc -->

- [前言](#前言)
- [异步迭代器](#异步迭代器)
- [异步生成器](#异步生成器)
- [限制](#限制)
- [应用](#应用)
- [总结](#总结)
- [参考](#参考)

<!-- tocstop -->

## 前言

在[JavaScript 迭代器](https://betamee.github.io/content/WebFrontEnd-JavaScript%20%E8%BF%AD%E4%BB%A3%E5%99%A8/)和[JavaScript 生成器](https://betamee.github.io/content/WebFrontEnd-JavaScript%20%E7%94%9F%E6%88%90%E5%99%A8/)两文中，已经讲清楚迭代器和生成器两个工具概念的来龙去脉。本文将进一步，讲解新的知识：异步迭代器和异步生成器。

之前的知识点中，迭代器和生成器本质都是同步的，返回的是确定的值，而异步的返回值则变成了 Promsie。

## 异步迭代器

异步迭代器（Asynchronous Iterator）是 ES2018(ES9) 中新增的特性。和同步迭代器相比，异步迭代器的 next 方法返回一个 Promise 对象，并且 Promise 对象的值为含有 value 和 done 属性的对象。

```js
const myAsyncIterable = {
  from: 1,
  to: 5,
  [Symbol.asyncIterator]: function() {
     let len = this.to - this.from;
     let pointer = 0;
     return {
        next() {
            const done = pointer >= len;
            const value = !done ? pointer : undefined;
            pointer++;
            // 返回一个 promise
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                   resolve({ value, done })
                }, 1000)
            })
        }
    }
  }
};

(async () => {
    console.log('start');
    // 使用 for-await 消费，每隔一秒输出
    for await (const x of myAsyncIterable) {
        console.log(x);
    }
    console.log('done');
})();
// => start 0 1 2 3 done
```

异步迭代器需要部署 Symbol.asyncIterator 属性才算“可异步迭代”对象（对比“可迭代对象”概念），使用 for-await-of 消费对象中的数据，每隔 1s 输出值，并且 ‘done’ 值在最后输出，整个语义风格是非常同步直观。

## 异步生成器

当然，上面的代码可以使用更为简单的方式创建异步迭代器，这就是使用异步生成器（Async Generator）。

先来定义一个异步生成器:

```js
async function* asyncGenerator() {
    yield await 1;
    yield await 2;
    yield await 3;
}

(async () => {
    console.log('start');
    for await (const x of asyncGenerator()) {
        console.log(x);
    }
    console.log('done');
})();
// => start 1 2 3 done
```

注意这里的 yield await 语法，初看容易迷糊，await 本质上会将后面的表达式变为 Promsie，所以这里的 yield await 1 理解为 yield Promise.resolve(1)，把包装好的 Promise 值“yield 转发”出去。

跟同步生成器类似，它具有 Symbol.asyncIterator 属性：

```js
let func = asyncGenerator();

// 类似于同步生成器，具有 Symbol.asyncIterator 属性
f[Symbol.asyncIterator]
// => ƒ [Symbol.asyncIterator]() { [native code] }

// 生成器的异步迭代器对象也是自引用的
f[Symbol.asyncIterator]() === f
// => true
```

使用异步生成器给普通对象部署 Symbol.asyncIterator，提供更简洁的方式：

```js
const myAsyncIterable = {
  from: 1,
  to: 5
};

myAsyncIterable[Symbol.asyncIterator] = async function*() {
  let len = this.to - this.from;

  for (let i = 0; i < len; i++) {
    // 将 await 的逻辑 yield 出去
    yield await new Promise((resolve, reject) => {
       setTimeout(() => {
          resolve(i)
        }, 1000)
    })
  }
};

(async () => {
    for await (const x of myAsyncIterable) {
        console.log(x);
    }
})();
```

## 限制

使用 Symbol.asyncIterator 也不是没有限制，根据 MDN 官网介绍：

> 目前没有默认设定了 Symbol.asyncIterator 属性的 JavaScript 内建的对象。不过，WHATWG（网页超文本应用技术工作小组）Streams会被设定为第一批异步可迭代对象，Symbol.asyncIterator 最近已在设计规范中落地。

## 应用

在一些涉及到数据流、异步流场景，可以考虑使用 for-await-of 来消费数据。

参考这个例子：[分页的数据](https://zh.javascript.info/async-iterators-generators#shi-ji-de-li-zi-fen-ye-de-shu-ju)。

## 总结

+ 异步迭代器与同步迭代器相同的是，异步迭代器也是一个具有 next 方法的对象
+ 异步迭代器对象的 next 方法返回一个 Promise 对象，Promise 对象的值为 { done, value } 这样的一个对象
+ for-await-of可以遍历具有 Symbol.asyncIterator 方法的数据结构，并且会等待上一个成员状态改变后再继续执行
+ 异步生成器可以用来创建异步迭代器，它是一个 async 类型的 generator 函数，内部可以使用await 表达式等待异步方法的执行完成，可使用 for-await-of遍历

## 参考

+ [Symbol.asyncIterator - JavaScript \| MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator)
+ [ES9中的异步迭代器（Async iterator）和异步生成器（Async generator）](https://juejin.cn/post/6844903735534026765)
+ [ES2018 新特征之：异步迭代器 for-await-of - SegmentFault 思否](https://segmentfault.com/a/1190000013387616)
+ [异步迭代和 generator](https://zh.javascript.info/async-iterators-generators)
