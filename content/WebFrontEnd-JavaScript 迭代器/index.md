---
title: JavaScript 迭代器
date: 2021-02-15 23:33:42
category: WebFrontEnd
tags: JavaScript 语言特性
openreward: true
uninqueid: 48c963a56c1a5933b11cddc0a777a3c8
---

## 目录

<!-- toc -->

- [迭代器模式](#迭代器模式)
- [实现 Iterable 接口](#实现-Iterable-接口)
- [支持迭代的语言特性](#支持迭代的语言特性)
- [显式调用迭代器](#显式调用迭代器)
- [可迭代（iterable）和类数组（array-like）](#可迭代（iterable）和类数组（array-like）)
- [参考](#参考)

<!-- tocstop -->

## 迭代器模式

迭代器模式描述了一个方案，即可以把有些结构称为“**可迭代对象**”(iterable object)，因为它们实现了正式的 Iterable 接口，而且可以通过迭代器 Iterator 消费。

**可迭代对象**是一个抽象的说法，基本上，可以把可迭代对象理解成数组或集合这样的集合类型的对象。但不仅仅是数组，很多其他内建对象也都是可迭代的，比如字符串。

直观来说，可以在 for...of... 结构（还有其他的语法支持可迭代）中使用的，都是 JavaScript 原生可迭代的内建对象，这些对象内置了Iterable 接口:

+ 字符串
+ 数组
+ 映射
+ 集合
+ arguments 对象
+ NodeList 等 DOM 集合类型

```js
let num = 1;
let obj = {};

// 这两种类型没有实现迭代器工厂函数
console.log(num[Symbol.iterator]); // undefined
console.log(obj[Symbol.iterator]); // undefined

let str = 'abc';
let arr = ['a', 'b', 'c'];
let map = new Map().set('a', 1).set('b', 2).set('c', 3);
let set = new Set().add('a').add('b').add('c');
let els = document.querySelectorAll('div');

// 这些类型都实现了迭代器工厂函数
console.log(str[Symbol.iterator]); // f values() { [native code] }
console.log(arr[Symbol.iterator]); // f values() { [native code] }
console.log(map[Symbol.iterator]); // f values() { [native code] }
console.log(set[Symbol.iterator]); // f values() { [native code] }
console.log(els[Symbol.iterator]); // f values() { [native code] }

// 调用这个工厂函数会生成一个迭代器
console.log(str[Symbol.iterator]()); // StringIterator {}
console.log(arr[Symbol.iterator]()); // ArrayIterator {}
console.log(map[Symbol.iterator]()); // MapIterator {}
console.log(set[Symbol.iterator]()); // SetIterator {}
```

## 实现 Iterable 接口

那么如何对一个数据结构部署 Iterable 接口（也可以称为可迭代协议）呢？

在 JavaScript 中，这个数据结构必须暴露一个使用 Symbol.iterator 为键名的迭代器工厂函数。调用
这个函数会返回一个带有 next 方法的对象，即**迭代器（iterator）**。

以下面的例子为例讲解：

```js
let range = {
  from: 1,
  to: 5
};

// 我们希望 for..of 这样运行：
// for(let num of range) ... num=1,2,3,4,5
```

为了让 range 对象可迭代（也就让 for..of 可以运行），需要为这个对象添加一个名为 Symbol.iterator 的方法（一个专门用于使对象可迭代的内置 symbol）。

+ 当 for..of 循环启动时，它会调用这个方法（如果没找到，就会报错）。这个方法返回一个有 next 方法的迭代器对象（iterator）。
+ 从此开始，for..of 仅适用于这个被返回的对象。
+ 当 for..of 循环希望取得下一个数值，它就调用这个对象的 next() 方法。
+ next() 方法返回的结果的格式必须是 {done: Boolean, value: any}，当 done=true 时，表示迭代结束，否则 value 是下一个值。

```js
let range = {
  from: 1,
  to: 5
};

// 1. for..of 调用首先会调用这个：
range[Symbol.iterator] = function() {

  // ……它返回迭代器对象（iterator object）：
  // 2. 接下来，for..of 仅与此迭代器一起工作，要求它提供下一个值
  return {
    current: this.from,
    last: this.to,

    // 3. next() 在 for..of 的每一轮循环迭代中被调用
    next() {
      // 4. 它将会返回 {done:.., value :...} 格式的对象
      if (this.current <= this.last) {
        return { done: false, value: this.current++ };
      } else {
        return { done: true };
      }
    }
  };
};

// 现在它可以运行了！
for (let num of range) {
  alert(num); // 1, 然后是 2, 3, 4, 5
}
```

在这里要注意可迭代对象的核心特点：关注点分离。

range 对象自身没有 next() 方法，它是通过调用 range\[Symbol.iterator\]() 创建了另一个对象，即所谓的“迭代器”对象(iterator)，并且它的 next 会为迭代生成值。

迭代器是按需创建的一次性对象，每个迭代器都会关联一个可迭代对象，迭代器对象和与其进行迭代的对象是分开的。迭代器无须了解与其关联的可迭代对象的结构，只需要知道如何取得连续的值。这种概念上的分离正是 Iterable 和 Iterator 的强大之处。

总之，任何实现 Iterable 接口的数据结构都可以被迭代器（iterator）“消费”(consume)。

## 支持迭代的语言特性

以下语言特性支持可迭代协议：

+ for...of...
+ 数组解构
+ Array.from()
+ 展开运算符（ ... ）
+ Maps 和 Sets 的构造器
+ Promise.all()，Promise.race()
+ yield*

```js
let arr = ['foo', 'bar', 'baz'];

// for-of 循环
for (let el of arr) {
  console.log(el); // foo bar baz
}

// 数组解构
let [a, b, c] = arr;
console.log(a, b, c); // foo bar baz

// 扩展操作符
let arr2 = [...arr];
console.log(arr2); // ['foo', 'bar', 'baz']

// Array.from()
let arr3 = Array.from(arr);
console.log(arr3); // ['foo', 'bar', 'baz']

// Set 构造函数
let set = new Set(arr);
console.log(set); // Set(3) {'foo', 'bar', 'baz'}

// Map 构造函数
let pairs = arr.map((x, i) => [x, i]);
console.log(pairs); // [['foo', 0], ['bar', 1], ['baz', 2]]
let map = new Map(pairs);
console.log(map); // Map(3) { 'foo'=>0, 'bar'=>1, 'baz'=>2 }
```

如果对象原型链上的父类实现了 Iterable 接口，那这个对象也就实现了这个接口:

```js
class FooArray extends Array {}

let fooArr = new FooArray('foo', 'bar', 'baz');

for (let el of fooArr) {
  console.log(el);
}
// foo
// bar
// baz
```

## 显式调用迭代器

有的时候，也可以显式调用迭代器，来“手动”从中获取值。甚至可以拆分迭代过程：迭代一部分，然后停止，做一些其他处理，然后再恢复迭代。

```js
let str = "Hello";

// 和 for..of 做相同的事
// for (let char of str) alert(char);

let iterator = str[Symbol.iterator]();

while (true) {
  let result = iterator.next();
  if (result.done) break;
  alert(result.value); // 一个接一个地输出字符
}
```

## 可迭代（iterable）和类数组（array-like）

这里区分两个正式术语，以免混淆：

+ Iterable 是实现了 Symbol.iterator 方法的对象
+ Array-like 是有索引和 length 属性的对象，所以它们看起来很像数组

在 JavaScript 中，可能会遇到可迭代对象或类数组对象，或两者兼有。比如字符串既是 Iterable 又是 Array-like。

但是一个可迭代对象也许不是类数组对象。反之亦然，类数组对象可能不可迭代。

全局方法 Array.from 可以接受一个可迭代或类数组的值，并从中获取一个“真正的”数组。

```js
let arrayLike = {
  0: "Hello",
  1: "World",
  length: 2
};

let arr = Array.from(arrayLike); // ['Hello', 'World']

let iterable = {
  from: 1,
  to: 5,
  Symbol.iterator: function() {
    // ... 见上文 range 案例
  }
}
let arr = Array.from(iterable); // [1, 2, 3, 4, 5]
```

## 参考

+ [Iterable object（可迭代对象）](https://zh.javascript.info/iterable)
+ [Iterables和迭代器](https://juejin.cn/post/6844903725320896526)
+ 《JavaScript 高级程序设计第四版》- 第七章.迭代器与生成器
