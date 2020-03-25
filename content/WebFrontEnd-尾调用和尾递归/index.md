---
title: 尾调用和尾递归
date: 2020-03-15 17:34:50
category: WebFrontEnd
tags: JS_Basic 基础
openreward: true
---

## 目录

<!-- toc -->

- [1. 什么是尾调用（Tail Call）](#1-什么是尾调用（Tail-Call）)
- [2. 尾调用优化](#2-尾调用优化)
- [3. 尾递归](#3-尾递归)
- [4. 递归函数的改写](#4-递归函数的改写)
- [参考](#参考)

<!-- tocstop -->

## 1. 什么是尾调用（Tail Call）

尾调用的概念很简单，一句话解释就是在一个函数**最后一步**的时候调用另一个函数。

```js
// 是尾调用
function f(x){
  return g(x);
}
// 不是尾调用
function f(x){
  let y = g(x);
  return y;
}

// 不是尾调用
function f(x){
  return g(x) + 1;
}
```

## 2. 尾调用优化

尾调用之所以与众不同，在于它特殊的调用位置。

代码执行的时候，函数调用会形成一个“调用记录”，又称为“调用帧”，保存调用位置和内部变量等信息。如果在函数A的内部调用函数B，那么在A的调用记录上方，还会形成一个B的调用记录。等到B运行结束，将结果返回到A，B的调用记录才会消失。如果函数B内部还调用函数C，那就还有一个C的调用记录栈，以此类推。所有的调用记录，就形成一个"调用栈"（call stack）。

尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用记录，因为调用位置、内部变量等信息都不会再用到了，只要直接用内层函数的调用记录，取代外层函数的调用记录就可以了。

```js
function f() {
  let m = 1;
  let n = 2;
  return g(m + n);
}
f();

// 等同于
function f() {
  return g(3);
}
f();

// 等同于
g(3);
```

上面代码中，如果函数 g 不是尾调用，函数f就需要保存内部变量 m 和 n 的值、g 的调用位置等信息。但由于调用g之后，函数f就结束了，所以执行到最后一步，完全可以删除 `f()`的调用记录，只保留 `g(3)` 的调用记录。

这就叫做"尾调用优化"（Tail call optimization），即只保留内层函数的调用记录。如果所有函数都是尾调用，那么完全可以做到每次执行时，调用记录只有一项，这将大大节省内存。这就是"尾调用优化"的意义。

## 3. 尾递归

函数调用自身，称为递归。如果尾调用自身，就称为尾递归。

递归非常耗费内存，因为需要同时保存成千上百个调用记录，很容易发生"栈溢出"错误（stack overflow）。但对于尾递归来说，由于只存在一个调用记录，所以永远不会发生"栈溢出"错误。

```js
// 非尾递归应用，最多需要保存n个调用记录，复杂度 O(n) 。
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}

factorial(5) // 120

// 尾递归应用，只保留一个调用记录，复杂度 O(1) 。
function factorial(n, total) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}

factorial(5, 1) // 120
```

由此可见，"尾调用优化"对递归操作意义重大，所以一些函数式编程语言将其写入了语言规格。ES6也是如此，第一次明确规定，所有 ECMAScript 的实现，都必须部署"尾调用优化"。这就是说，在 ES6 中，只要使用尾递归，就不会发生栈溢出，相对节省内存。


## 4. 递归函数的改写

尾递归的实现，往往需要改写递归函数，确保最后一步只调用自身。做到这一点的方法，就是把所有用到的内部变量改写成函数的参数。上面的尾递归的例子有一个问题，`factorial(5, 1)` 的调用方法直观上很容易对参数迷惑，为什么要加第二个参数 1 ？

两个方法可以解决这个问题。方法一是在尾递归函数之外，再提供一个正常形式的函数。

```js
function tailFactorial(n, total) {
  if (n === 1) return total;
  return tailFactorial(n - 1, n * total);
}

function factorial(n) {
  return tailFactorial(n, 1);
}

factorial(5) // 120
```

方法二可以利用函数的柯里化，将多参数的函数转换成单参数的形式。

```js
function currying(fn, n) {
  return function (m) {
    return fn.call(this, m, n);
  };
}

function tailFactorial(n, total) {
  if (n === 1) return total;
  return tailFactorial(n - 1, n * total);
}

const factorial = currying(tailFactorial, 1);

factorial(5) // 120
```

以上的思路也可以用于尾递归函数的改造，有助于提高代码质量。

总结一下，递归本质上是一种循环操作。纯粹的函数式编程语言没有循环操作命令，所有的循环都用递归实现，这就是为什么尾递归对这些语言极其重要。对于其他支持"尾调用优化"的语言（比如Lua，ES6），只需要知道循环可以用递归代替，而一旦使用递归，就最好使用尾递归。

## 参考

* [尾调用优化](https://www.ruanyifeng.com/blog/2015/04/tail-call.html)
