---
title: Node 异步编程探究
date: 2020-03-27 19:14:29
category: Node
tags: Node_Basic 异步模型
openreward: true
---

## 目录

<!-- toc -->

- [Node 的特点](#node-的特点)
- [异步编程](#异步编程)
- [Callback Function](#callback-function)
- [Promise](#promise)
- [Generator Function (co)](#generator-function-co)
- [Async Await Function](#async-await-function)
- [参考](#参考)

<!-- tocstop -->

## Node 的特点

什么是 Node.js 呢？看一下[官网](https://nodejs.org/en/)正式的介绍：

> Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js' package ecosystem, npm, is the largest ecosystem of open source libraries in the world.

从这里可以知道，Node.js 有以下特点：

1. Node.js 不是某种新的语言、不是 JavaScript 框架，也不是 nginx 一样的 Web 服务器。而是一个 JavaScript 运行时环境。跟浏览器类似，可以理解为运行 JavaScript 的一个环境，都是基于 Chrome V8，不同的是 Node.js 可以超越浏览器的限制，有更多的权限，可以干系统层级的活。
2. Node.js 是事件驱动（event-driven）和非阻塞 I/O 模型（non-blocking I/O model），这意味着 Node.js 是以异步的方式处理函数工作流，底层是由 C/C++ 编写的 Libuv 这个库处理 事件循环和I/O 操作，隐藏了非阻塞 I/O 的具体细节，简化并发模型。
3. 使用 npm 作为包管理器，管理应用的依赖。

本文将整理 Node.js 处理异步流程的四个方案：

* 初代光芒-Callback Function
* 中流砥柱-Promise
* 过渡方案-Generator Function (co)
* 终极方案-Async Await Function

其实还有像 Thunk、事件监听、发布/订阅这样的解决思路，但大浪淘沙下来，目前是由 Promise + Async 这两个重要技术挑大梁，是需要重点掌握的。

## 异步编程

什么是异步？

> 所谓"异步"，简单说就是一个任务分成两段，先执行第一段，然后转而执行其他任务，等做好了准备，再回过头执行第二段。
> 这种不连续的执行，就叫做异步。相应地，连续的执行，就叫做同步。

异步编程？

> 如何优雅地处理异步流程，是推动异步编程发展的源动力。
> 异步编程的语法目标，就是怎样让它更像同步编程。

## Callback Function

Callback 也就是所谓的回调函数，这个在 Node.js 刚发布的时候就存在了。它的风格 **Error-First**：

* 当发生错误的时候，回调函数第一个参数为 error 对象
* 当成功响应的时候，回调函数第一个参数为 null，第二个参数为具体的数据

```js
const fs = require('fs');

fs.open('/open/some/file.txt', 'r', (err, fd) => {
  if (err) throw err;
  fs.close(fd, (err) => {
    if (err) throw err;
  });
});
```

Callback style 的 API 虽然可以处理 Node.js 异步流程，但最大的问题在于组合使用出现的**回调地狱**：

```js
step1(function (value1) {
    step2(value1, function(value2) {
        step3(value2, function(value3) {
            step4(value3, function(value4) {
                // Do something with value4
            });
        });
    });
});
```

这不仅丑陋而且项目复杂了非常难以维护。为了解决这个问题，Node.js 社区又推出了 Promise 方案。

## Promise

Promise 最早是在 commonjs 社区提出来的，当时提出了很多规范，比较接受的是promise/A规范。后来社区在这个基础上，提出了promise/A+规范，也就是实际上现在的业内推行的规范。ES6 也是采用的这种规范。

Promise 意味着**许愿/承诺**一个还没有完成的操作，但在未来会完成的。与 Promise 最主要的交互方法是通过将一个函数传入它的`then` 方法从而获取得 Promise `resolved`（成功） 或 `rejected`（失败）的值。要点有三个：

* 递归，每个异步操作返回的都是 Promise 对象
* 状态机：三种状态转换，只在 Promise 对象内部可以控制，外部不能改变状态
* 全局异常处理

```js
const util = require('util');
const fs = require('fs');

const stat = util.promisify(fs.stat);
stat('.').then((stats) => {
  // 使用 `stats`。
}).catch((error) => {
  // 处理错误。
});
```

Promise 的最大优势是标准化，各类异步工具库都按照统一规范实现，即使是 async 函数也可以无缝集成。所以用 Promise 封装 API 通用性强，用起来简单，学习成本低。在 async 函数普及之前，绝大部分应用都是采用Promise来做异步流程控制的。

但 Promise 也不是没有问题，过多的异步流程下， `then` 也会变得繁琐：

```js
doPromise().
  .then(() => {})
  .then(() => {})
  .then(() => {})
  .then(() => {})
  .then(() => {})
```

有没有更像“同步编程”的方案呢？下面介绍的两个方案可以让异步代码更清晰。

## Generator Function (co)

首先简单了解下 Generator 的用法：

```js
// 定义一个 generators
function* foo(){
    yield console.log("bar");
    yield console.log("baz");
}

const g = foo();
g.next(); // prints "bar"
g.next(); // prints "baz"
```

简单来说，Generator 实现了状态暂停/函数暂停 —— 通过 yield 关键字暂停函数，并返回当前函数的状态。

但单独的 Generator 函数需要手动去控制内部的状态，就像是手动挡的汽车，虽然比自行车跑得更快了但依旧繁琐，有没有带自动挡的新型工具呢？

有的，早在 13 年 TJ 大神开发了一个叫 co 的库，实现了 Generator 的 自动执行，使用 co 和 Promise 修改上面的代码：

```js
var co = require('co');

function* foo() {
    yield Promise.resolve(console.log("bar"));
    yield Promise.resolve(console.log("baz"));
}

co(foo);
```

co 有个使用条件：Generator 函数的 yield 命令后面，只能是 Thunk 函数或 Promise 对象。

这样就让 co 变得非常强悍，让我们的代码更上一层楼：


```js
const co = require('co')
const fs = require('fs')

// Promise 化的API
const readFile = util.promisify(fs.readFile);

// 包装执行
co(function* (){
    try {
        const data = yield readFile('./package.json');
        console.log(data)
        const data2 = yield readFile('./file.text');
        console.log(data2)
    }
    catch (e) {
        console.log(e)
    }
})
```

是不是更有“同步代码”的味道了，不用纯 Promise `then` 套 `then` 那种 style 了。

## Async Await Function

Async/Await 是当前 Node.js，也是 JavaScript 领域终极的异步解决方案，它集合了 Promise 和 Generator 的优点，是更高程度的一个抽象。来直接看看它长什么样：

```js
const util = require('util');
const fs = require('fs');

const stat = util.promisify(fs.stat);

async function callStat() {
  try {
    const stats = await stat('.');
    console.log(`该目录归 ${stats.uid} 拥有`)
  } catch(e) {
    console.log(e)
  }
}
```

可以看到这段代码优点像上一节的搭配了 co 的 Generator 用法，非常的同步 style。其实与 Generator 和 Promise 相比，它有很多进步：

* 语义非常好，清晰明了
* 自带执行器，所以无需外部的 co 这类的库
* 可以使用 try/catch 控制错误流程
* await 既可以接 Promise，也可以直接接 co（co 能返回 promise 对象），所以兼容特别好
* await 虽然没有并行机制，但搭配 Promise 的 race 和 all，几乎支持所有的异步场景

综上所述，Async/Await 是 JavaScript 社区的终极利器。 作为前端方向的开发者，Async/Await + Promise 的组合是必须要掌握的！

## 参考

+ [co.js - 让异步代码同步化 - 听·说 - SegmentFault 思否](https://segmentfault.com/a/1190000007057045)
+ [Generator 函数的含义与用法 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2015/04/generator.html)
+ [co 函数库的含义和用法 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2015/05/co.html)
+ [node 异步编程 - 掘金](https://juejin.im/post/5a333fe1f265da431f4b1d5c)
+ [GitHub - i5ting/How-to-learn-node-correctly: [全文]如何正确的学习Node.js](https://github.com/i5ting/How-to-learn-node-correctly#%E7%9F%A5%E4%B9%8Elive%E7%8B%BC%E5%8F%94%E5%A6%82%E4%BD%95%E6%AD%A3%E7%A1%AE%E7%9A%84%E5%AD%A6%E4%B9%A0nodejs)