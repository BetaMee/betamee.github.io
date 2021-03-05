---
title: JavaScript 生成器
date: 2021-02-28 00:16:37
category: WebFrontEnd
tags: JavaScript 语言特性
openreward: true
uninqueid: 90f567f116cc51adb5ed23e6583edbd6
---

## 目录

<!-- toc -->

- [前言](#前言)
- [基本概念](#基本概念)
- [使用](#使用)
  * [基本用法](#基本用法)
  * [next 的参数](#next-的参数)
  * [函数中的 return 语句](#函数中的-return-语句)
  * [生成器对象的 return 方法](#生成器对象的-return-方法)
  * [生成器对象的 throw 方法](#生成器对象的-throw-方法)
  * [使用 yield* 表达式](#使用-yield-表达式)
- [生成器和迭代器的关系](#生成器和迭代器的关系)
- [使用生成器进行迭代](#使用生成器进行迭代)
- [实际应用](#实际应用)
- [参考](#参考)

<!-- tocstop -->

## 前言

生成器（Generator）是 ECMAScript 6 中引入的新概念。生成器本身是一个很强大的工具，只不过这个语法理解起来比较难，而且在实际中更多地是在框架和第三方库中，日常开发中使用较少。本文将理清生成器的概念以及具体使用。

## 基本概念

与生成器有关的有两个概念：

+ 生成器函数：用来创建生成器对象的一类特殊函数
+ 生成器对象：生成器函数的具体实例

在 JavaScript 中，开发者是无法控制普通函数的运行的，当调用普通函数的时候，函数会一路执行下去，并把返回值传递给调用者。而对于生成器函数，**由它产生的生成器对象最大特点在于它的执行可以被暂停和继续。**

它还可与可迭代对象（iterable ）完美配合使用，从而轻松地创建数据流。

## 使用

### 基本用法

创建一个生成器函数很简单，只要在 function 关键字旁边加上 * 就可以：

```js
// 生成器函数(generator function)
function* sample() {
  yield 1;
  yield 2;
  yield 3;
}

// 生成器对象(generator object)
let func = sample();
console.log(func)
// -> sample {<suspended>}

func.next();
// -> {value: 1, done: false}
func.next();
// -> {value: 2, done: false}
func.next();
// -> {value: 3, done: false}
func.next();
// -> {value: undefined, done: true}
func.next();
// -> {value: undefined, done: true}
```

值得注意的是，在调用 sample() 生成 func 对象的时候，sample 内部的代码是不会执行的。要想获取内部的值，需要手动执行 next 方法，把里面“yielded”的值给返回出来。返回值是一个包含了两个属性 value 和 done 的对象。属性 value 包含的是 yield 表达式所产生的值，而 done 用来表示是否还有更多值可以被获取。

每个生成器对象都可以被看成是一个状态机。**同一个生成器函数所创建的每个对象都在内部维护自己的状态**，彼此并不会互相影响。调用 next 方法会继续生成器的执行，触发内部的状态转换，运行到下一个 yield 表达式所在的位置。接着执行会被暂停，等待下一次 next 方法的调用。

### next 的参数

生成器对象的强大之处在于，yield 的值传递是双向的：不仅可以向外返回结果，还可以将外部的值传递到 generator 内部：

调用 generator.next(arg)，就能将参数 arg 传递到 generator 内部。这个 arg 参数会**传给上一条执行的 yield语句左边的变量。**

```js
function *doMath() {
  let x = yield 1;
  let y = yield x + 10;
  let z = yield y * 10;
}

let func = doMath();
func.next();
// -> {value: 1, done: false}
func.next(1);
// -> {value: 11, done: false}
func.next(2);
// -> {value: 20, done: false}
func.next(3);
// -> {value: undefined, done: true}
```

### 函数中的 return 语句

在生成器函数中，同样可以使用 return 语句。通过 return 返回的值也会被传递给 next 方法的调用者，同时会结束掉生成器对象的执行，也就是把属性 done 的值设为 true。

```js
function *withReturn() {
  let x = yield 1;
  return x + 2;
}

let func = withReturn();
func.next();
// -> {value: 1, done: false}
func.next(1);
// -> {value: 3, done: true}
func.next();
// -> {value: undefined, done: true}
```

### 生成器对象的 return 方法

生成器对象的 return 方法可以用来返回给定值并提前结束它的执行。其使用效果类似于在生成器函数中使用 return 语句。

```js
function *values() {
  yield 'a';
  yield 'b';
  yield 'c';
}

let func = values();
func.next();
// -> {value: "a", done: false}
func.return('d');
// -> {value: "d", done: true}
func.next();
// -> {value: undefined, done: true}
```

### 生成器对象的 throw 方法

生成器对象的 throw 方法可以用来传入一个值，并使其抛出异常。throw 和 next 都可以传入值到生成器对象中来改变其行为。通过 next 传入的值会作为上一个 yield 表达式的值，而**通过 throw 传入的值则相当于把上一个 yield 语句替换到一个 throw 语句**。如下面的代码，当 func.throw('hello') 被调用时，上一个 yield 表达式 let y = yield x + 1; 被替换成 throw 'hello'。由于抛出的对象没有被处理，会被直接传递到 JavaScript 引擎，导致生成器的执行终止。

```js
function *sample() {
  let x = yield 1;
  let y = yield x + 1;
  yield y * 10;
}

let func = sample();
func.next();
// -> {value: 1, done: false}
func.next(1);
// -> {value: 2, done: false}
func.throw('hello');
// -> 报错：Uncaught hello
func.next();
// -> {value: undefined, done: true}
```

如果需要在生成器函数中捕获错误，可以使用 try...catch... 语句。下面的代码理解，在调用 func.throw(new Error('boom!')) 时，上一个 yield 表达式 yield 2 被替换成了 throw new Error('boom!')。抛出的对象由 try...catch... 进行了处理，因此生成器的执行可以被继续，直到遇到下一个 yield 表达式，并返回出来。

```js
function *sample() {
  yield 1;
  try {
    yield 2;
  } catch (e) {
    console.error(e);
  }
  yield 3;
  yield 4;
}

let func = sample();
func.next();
// -> {value: 1, done: false}
func.next();
// -> {value: 2, done: false}
func.throw(new Error('boom!'));
// -> Error: boom!
// -> {value: 3, done: false}
func.next();
// -> {value: 4, done: false}
```

### 使用 yield* 表达式

生成器对象除了使用 yield 每次只产生一个值，也可以使用 yield* 表达式来生成一个值的序列。当使用 yield* 时，yield* 指令将执行**委托**给另一个 generator。这个术语意味着 yield* gen 在 gen 对象上进行迭代，并将其产出（yield）的值转发到外部。可以用下面代码理解：

```js
function *oneToThree() {
  yield* [1, 2, 3];
}

// 等同于
function *oneToThree() {
  for (let i of [1,2,3]) {
    yield i
  }
}
```

yield* 表达式后面接的必须是**生成器对象**或者**可迭代对象**，这样才能保证得到 yield 的值。

```js
function debug(values) {
  for (let value of values) {
    console.log(value);
  }
}

function *multipleYieldStars() {
  yield* [1, 2, 3];
  yield 'x';
  yield* 'hello';
}

debug(multipleYieldStars());
// -> 输出 1, 2, 3, 'x', 'h', 'e', 'l', 'l', 'o'
```

另外一点，yield\* 表达式也是有值的，**它的值取决于其后面的生成器对象或可迭代对象所产生的最后一个值，也就是属性 done 为 true 时的那个值**。如果 yield\* 后面是可迭代对象，那么 yield\* 表达式的值总是 undefined，这是因为最后一个生成的值总是 { value: undefined, done: true }。如果 yield\* 后面是生成器对象，可以通过在生成器函数中使用 return 来控制最后一个产生的值。

```js
let result;

function loop(iterable) {
  for (let value of iterable) {
    //ignore
  }
}

function *abc() {
  yield* 'abc';
  return 'd';
}

function *generator() {
  result = yield* abc();
}

loop(generator());
console.log(result);
// -> "d"
```

这里要注意的是，通过 yield* gen 委托的时候，只能“获取” gen 对象中 yield 的值，无法获取 return 的值，因为在 return 的时候，gen 对象已经是 done 状态了：

```js
function* abc() {
  yield* 'abc';
  return 'd'
}

function* generator() {
  yield* abc();
}

loop(generator());
// a b c
// 无法“获取” return 的值，只有 yield 的值。
```

表达式 yield 和 yield * 甚至还可以进行嵌套：

```js
// 案例一：
function *manyYields() {
  yield yield yield 1;
}

debug(manyYields());
// 输出 1, undefined, undefined

// 案例二：
function *oneToThree() {
  yield* [1, 2, 3];
}

function *values() {
  yield yield* oneToThree();
}

debug(values());
// -> 输出 1, 2, 3, undefined
```

## 生成器和迭代器的关系

其实上面的代码中，已经隐约能感觉到生成器和迭代器有着一些相似的地方，比如都有 next 方法，都能 在 for-of 中使用。实际上，**生成器对象既是可迭代对象（iterable），也是迭代器对象（iterator）。**

在[JavaScript 迭代器](:note:fbd80b32-bcd7-4e85-b288-fe3e232097ba)文章，对可迭代对象（iterable）进行了一些定义，比如要有 Symbol.iterator 属性。在生成器对象中，同样的也有这个属性，并且生成器对象的迭代器是自引用的：

```js
function* sample() {}

// 生成器对象
let func = sample()
// 生成器对象是自引用
func === func[Symbol.iterator]()
// true
```

因此，可以用 ECMAScript 6 中的其他新特性来遍历其中的值，包括 for-of 循环，spread 操作符和新的集合类型。

```js
for (let value of sample()) {
  console.log(value);
}
// -> 输出 1，2 和 3
['a', ...sample(), 'b']
// -> [ 'a', 1, 2, 3, 'b' ]

let set = new Set(sample())
set.size
// -> 3
```

## 使用生成器进行迭代

既然生成器和迭代器有一些概念相通之处，那么可以使用生成器来部署迭代器：

旧的案例：

```js
let range = {
  from: 1,
  to: 5
};

// 对没有迭代器的普通对象部署迭代器
range[Symbol.iterator] = function() {
  return {
    current: this.from,
    last: this.to,

    next() {
      if (this.current <= this.last) {
        return { done: false, value: this.current++ };
      } else {
        return { done: true };
      }
    }
  };
};

// 1,2,3,4,5
for (let num of range) {
  alert(num);
}
```

使用生成器改造：

```js
let range = {
  from: 1,
  to: 5,

  *[Symbol.iterator]() { // [Symbol.iterator]: function*() 的简写形式
    for(let value = this.from; value <= this.to; value++) {
      yield value;
    }
  }
};

// 1,2,3,4,5
for (let num of range) {
  alert(num);
}
```

## 实际应用

由于生成器强大的功能，可以搭配异步操作，在 async/awit 特性普及之前，是一个不错的异步工具：

```js
function getApi(params) {
  return new Promise((resolve) => {
    // 模拟ajax
    setTimeout(() => {
      resolve('api result: ' + params)
    }, 1000)
  })
}

function* gen(stage0) {
  console.log(stage0)
  let stage1 = yield getApi('startParams')
  console.log('stage1', stage1)
  let stage2 = yield getApi(stage1)
  console.log('stage2', stage2)
  let stage3 = yield getApi(stage2)
  console.log('stage3', stage3)
  return 'all Done!!'
}

function run(generator, v) {
  let { value, done } = generator.next(v)
  if (!done) {
    value.then((res) => {
      run(generator, res)
    })
  } else {
    console.log(value)
  }
}

run(gen('start'))
```

缺点在于生成器没有自动化执行器，都要手动 next 获取下一个的值，所以等到自带执行器和语义更好的 async/await 出来后，学起来头大的生成器马上没了市场。而 async/await 可以理解为生成器 + promise 的语法糖。

当然，社区也出现过自动化执行异步任务的工具，比如：

+ 通过不断进行回调函数的执行，直到全部过程执行完毕，基于这种思路的是 thunkify 模块；
+ 使用 Javascript 原生支持的 Promise 对象，将异步过程扁平化处理，基于这种思路的是 co 模块；

有空可以了解一下源码实现。

生成器一般在实际项目中用得少，在框架和开发工具中用得多，比如在 Babel 项目，由于一些平台不支持 async/await 特性，会将这些异步代码转为使用生成器模拟：

```js
async function foo() {
  await bar();
}
```

转换为：

```js
let foo = (() => {
  var _ref = _asyncToGenerator(function* () {
    yield bar();
  });

  return function foo() {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { ... }
```

asyncToGenerator 是核心函数。具体可以在 Babel 官网试验一下：https://babeljs.io/repl

关于 asyncToGenerator 更多细节分析，可以见[JavaScript 异步编程原理解析]()文章，里面将拆解分析生成器 + 异步的实现。

## 参考

+ [Generator](https://zh.javascript.info/generators)
+ [generator，promise 与 async/await 的关系 - SegmentFault 思否](https://segmentfault.com/a/1190000022270916)
+ [进阶 Javascript 生成器](https://juejin.cn/post/6844903527039533064)
+ [详解 ECMAScript 6 中的生成器（Generator） – IBM Developer](https://developer.ibm.com/zh/technologies/web-development/articles/wa-es6-generator/)
+ [ES2018 新特征之：异步迭代器 for-await-of - SegmentFault 思否](https://segmentfault.com/a/1190000013387616)
+ 《JavaScript 高级程序设计第四版》- 第七章.迭代器与生成器
