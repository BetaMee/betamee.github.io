---
title: JavaScript 设计模式总结（五）
date: 2020-02-19 00:04:36
category: WebFrontEnd
tags: JS_Deep 设计模式 读书笔记
openreward: true
---

## 目录

<!-- toc -->

- [技巧型模式](#技巧型模式)
  * [1. 链模式（Operate of Responsibility）（N）](#1-链模式（Operate-of-Responsibility）（N）)
  * [2. 委托模式（Entrust）](#2-委托模式（Entrust）)
  * [3. 数据访问对象模式（Data access object-DAO）](#3-数据访问对象模式（Data-access-object-DAO）)
  * [4. 节流模式（Throttler）](#4-节流模式（Throttler）)
  * [5. 简单模版模式（Simple template）](#5-简单模版模式（Simple-template）)
  * [6. 惰性模式（Layier）](#6-惰性模式（Layier）)
  * [7. 参与者模式（Participator）](#7-参与者模式（Participator）)
  * [8. 等待者模式](#8-等待者模式)

<!-- tocstop -->

## 技巧型模式

技巧型设计模式是通过一些特定技巧来解决组件的某些方面的问题，这类技巧一般通过实践经验总结得到。

### 1. 链模式（Operate of Responsibility）（N）

链模式通过在对象方法中将当前对象返回，实现对同一个对象多个方法的链式调用。从而简化对该对象的多个方法的多次调用，对该对象的多次引用。

前端领域非常有名的 JQuery 框架，就是使用链模式实现的。

它的核心思想就是通过在对象中的每个方法调用执行完毕后返回当前对象 this 来实现的。

```js
const A = function(selector) {
  return new A.fn.init(selector)
}

A.fn = A.prototype = {
  constructor: A, // 强化构造器
  init(selector, context) {
    this.length = 0
    context = context || document
    // 如果是id选择符
    if (~selector.indexOf('#')) {
      this[0] = document.getElementById(selector.slice(1))
      this.length = 1
    } else { // 如果是元素名称
      // 从上下文中选择元素
      const doms = context.getElementsByTagName(selector)
      for (let i = 0; i < doms.length; i++) {
        this[i] = doms[i]
      }
      // 校正长度
      this.length = doms.length
    }
    // 保存上下文
    this.context = context
    // 保存选择符
    this.selector = selector
    // 返回对象
    return this
  },
  length: 2,
  size() {
    return this.length
  },
  // 增强数组
  push: [].push,
  sort: [].pop,
  splice: [].splice
}

A.fn.init.prototype = A.fn

// 对象拓展
A.extend = A.fn.extend = function(...args) {
  const target = args[0]
  if (args.length === 1) { // 如果只有一个对象，则定义为对 A.fn 的拓展
    target = this
  }
  for (let i = 0; i < args.length; i++) { // 如果有多个对象，则是对第一个对象的拓展
    for (j in args[i]) {
      target[j] = args[i][j]
    }
  }
  return target
}
```

### 2. 委托模式（Entrust）

委托模式：多个对象接收并处理同一请求，他们将请求委托给另一个对象统一处理。

在 JavaScript 中，委托模式已经得到很广泛的应用，尤其是处理事件上。

```js
ul.onclick = function(e) {
  const e = e || window.event
  const target = e.target || e.srcElement
  if (target.nodeName.toLowerCase() === 'li') {
    target.style.backgroundColor = 'grey'
  }
}

// html 结构
// <ul>
//   <li></li>
//   <li></li>
//   <li></li>
//   <li></li>
//   <li></li>
// </ul>
```

### 3. 数据访问对象模式（Data access object-DAO）

抽象和封装对数据源的访问和存储，DAO 通过对数据源链接的管理方便对数据的访问和存储。

DAO 是对数据库的操作（如简单的CRUD创建，读取，更新，删除）进行封装，提供统一的接口。而且对于后端数据库来说（如 MongoDB），DAO 对象还会保留对数据库的链接，不必每次操作数据库时都发送链接请求。

```js
const BaseLocalStorage = function(preId, timeSign) {
  this.preId = preId
  this.timeSign = timeSign
}

BaseLocalStorage.prototype = {
  status: {
    SUCCESS: 0,
    FAILURE: 1,
    OVERFLOW: 2,
    TIMEOUT: 3
  },
  // 存储本地链接
  storage: localStorage || window.localStorage,
  getKey(key) {},
  set(key, value, callback) {},
  get(key, value, callback) {},
  remove(key, value, callback) {}
}


```

### 4. 节流模式（Throttler）

对重复的业务逻辑进行节流控制，执行最后一次操作并取消其他操作，以提高性能。

节流模式的核心思想是创建计时器，延迟程序的执行。这也使得计时器回调函数的操作异步执行。这带来两个优势：第一是程序能否执行是可控的，执行前的某一时刻是否清除计时器来决定程序是否可以继续执行；第二，程序是异步的，不会影响后面的运行。

```js
// 节流器
const Tnrottle = (...args) => {
  // 第一个参数
  const isClear = args[0]
  let fn
  // 如果第一个参数是 boolean 类型那么第一个参数则表示是否清除计时器
  if (typeof isClear === 'boolean') {
    // 第二个参数为函数
    fn = args[1]
    // 函数的计时器句柄存在，则清除该计时器
    fn._throttleID && clearTimeout(fn._throttleID)
  } else {
    // 第一个参数为函数
    fn = isClear
    // 第二个参数为函数执行时的参数
    param = args[1]

    const p = extend({
      context: null, // 执行函数时的作用域
      args: [], // 执行函数时的相关参数
      time: 300 // 延迟执行时间
    }, param)

    fn._throttleID = setTimeout(() => {
      // 执行函数
      fn.apply(p.context, p.args)
    }, p.time)
  }
}
```

### 5. 简单模版模式（Simple template）

简单模版模式：通过格式化字符串拼凑出视图避免创建视图时大量节点操作，优化内存开销。

### 6. 惰性模式（Layier）

惰性模式：减少每次代码执行时的重复性的分支判断，通过对对象重定义来屏蔽原对象中的分支判断。

惰性模式有两种使用方式，一个是初次加载就执行，第二种是初次使用再执行，两种都在后续的使用中避免了重复判断。

```js
// 案例一： 初次加载就通过闭包执行，后面就不会再作分支判断了
A.on = (function(){
  if (document.addEventListener) {
    return function(dom, type, fn) {
      dom.addEventListener(dom, fn, false)
    }
  } else if (document.attachEvent) {
    return function(dom, type, fn) {
      dom.attachEvent('on' + type, fn)
    }
  } else {
    return function(dom, type, fn) {
      dom['on' + type] = fn
    }
  }
})()


// 案例二：等到使用时再执行
A.on = function(){
  if (document.addEventListener) {
    A.on = function(dom, type, fn) {
      dom.addEventListener(dom, fn, false)
    }
  } else if (document.attachEvent) {
    A.on = function(dom, type, fn) {
      dom.attachEvent('on' + type, fn)
    }
  } else {
    A.on = function(dom, type, fn) {
      dom['on' + type] = fn
    }
  }
}
```

### 7. 参与者模式（Participator）

参与者：在特定的作用域中执行给定的函数，并将参数原封不动地传递。

参与者模式实质上是两种技术的结晶，函数绑定和函数柯里化。

```js
// 案例一：函数柯里化
function curry(fn) {
  const Slice = [].slice
  const args = Slice.call(arguments, 1)
  // 闭包返回新的函数
  return function() {
    // 将参数转化成数组
    const addArgs = Slice.call(arguments)
    // 拼接参数
    const allArgs = args.concat[addArgs]
    // 返回新的函数
    return fn.apply(null, allArgs)
  }
}

// 案例二：函数绑定
function bind(fn, context) {
  // 取出第三个参数
  const Slice = Array.prototype.slice
  const args = Slice.call(arguments, 2)
  // 闭包返回新函数
  return function() {
    const addArgs = Slice.call(arguments)
    const allArgs = addArgs.concat(args)
    return fn.apply(context, allArgs)
  }
}

// 案例三：原生函数绑定
const bindFn = demoFn.bind(Obj, params)
```

### 8. 等待者模式

等待者模式：通过对多个异步进程进行监听，来触发未来发生的动作。这个有点类似于 Promise，可以看作是其原型实现。

```js
const Waiter = function() {
  // 注册了的等待对象容器
  let dfd = []
  // 成功回调方法容器
  let doneArr = []
  // 失败回调方法容器
  let failArr = []
  // 缓存 Array 方法  slice
  const slice = Array.prototype.slice
  // 保存当前等待者对象
  const that = this

  // 监控对象类
  class Primise {
    constructor() {
      this.resolved = false
      this.rejected = false
    }
    resolve() {
      // 设置当前监听对象解决成功
      this.resolved = true
      if (!dfd.length) {
        return
      }
      for (let i = dfd.length - 1; i >= 0; i--) {
        // 如果任意一个监控对象没有被解决或者解决失败则返回
        if (dfd[i] && !dfd[i].resolved || dfd[i].rejected) {
          return
        }
        // 清除监控对象
        dfd.splice(i, 1)
      }
      // 执行解决成功回调方法
      _exec(doneArr)
    },
    reject() {
      this.rejected = true
      if (!dfd.length) {
        return
      }
      // 清除所有监控对象
      dfd.splice(0)
      _exec(failArr)
    }
  }

  // 创建监控对象
  that.Deferred = function() {
    return new Primise()
  }
  // 监控异步方法
  that.when = function() {
    // 设置监听对象
    dfd = dfd.concat(slice.call(arguments))
    // 向前遍历监控对象
    for (let i = dfd.length; i >= 0; i--) {
      // 如果不存在监控对象或者监控对象已经解决或者不是监控对象
      if (
        !dfd[i]
        || dfd[i].resolved
        || dfd[i].rejected
        || !dfd[i] instanceof Primise
      ) {
        // 清理当前监控对象
        dfd.splice(i, 1)
      }
    }
    // 返回等待者对象
    return that
  }
  that.done = function() {
    doneArr = doneArr.concat(slice.call(arguments))
    return that
  }
  that.fail = function() {
    failArr = failArr.concat(slice.call(arguments))
    return that
  }

  // 回调执行方法
  function _exec(arr) {
    for (let i = 0; i < arr.length; i++) {
      try {
        arr[i] && arr[i]()
      } catch(e) {}
    }
  }
}

// 使用
const waiter = new Waiter()
// 创建监听者对象
// 使用两个定时器模拟异步
const FirstPrimise = (function() {
  const dtd = waiter.Deferred()
  setTimeout(() => {
    console.log('first finish')
    // 发布成功解决消息
    dtd.resolve()
  }, 500)
  return dtd
})()

const SecondPrimise = (function() {
  const dtd = waiter.Deferred()
  setTimeout(() => {
    console.log('second finish')
    // 发布成功解决消息
    dtd.resolve()
  }, 1000)
  return dtd
})()

waiter
  .when(FirstPrimise, SecondPrimise) // 监听两个异步处理方法
  .done(
    () => {
      console.log('success')
    },
    () => {
      console.log('success again')
    }
  )
  .fail(() => {
    console.log('fail')
  })

// 输出
// first finish
// second finish
// success
// success again
```
