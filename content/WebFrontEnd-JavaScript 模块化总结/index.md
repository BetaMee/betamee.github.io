---
title: JavaScript 模块化总结
date: 2019-04-18 21:00:00
category: WebFrontEnd
tags: JS_Basic 模块化
openreward: false
uninqueid: e967a8717f145933ac2e7c6ea8aa5b01
---

> 规范JavaScript的模块定义和加载机制，降低学习和使用各种框架的门槛，能够以一种统一的方式去定义和使用模块，提高开发效率，降低了应用维护成本。

**关键词**： AMD、CMD、UMD、CommonJS、ES Module

## 目录

<!-- toc -->

- [模块化的历史](#)
    + [刀耕火种的原始时代（1999 - 2009）](#1999---2009)
    + [大步踏进工业化 （2009 - 至今）](#-2009)
- [各种模块化方案出现的时间线](#-1)
- [CommonJS](#CommonJS)
    + [介绍](#-2)
    + [特点](#-3)
    + [module 对象](#module)
    + [目录的加载规则](#-4)
    + [模块的缓存](#-5)
    + [模块的加载机制](#-6)
- [AMD](#AMD)
    + [介绍](#-7)
    + [规范介绍](#-8)
    + [RequireJS 的介绍](#RequireJS)
- [CMD](#CMD)
    + [介绍](#-9)
    + [规范介绍](#-10)
    + [1. define `Function`](#1-define-Function)
    + [2. require `Function`](#2-require-Function)
    + [3. exports `Object`](#3-exports-Object)
    + [4. module `Object`](#4-module-Object)
    + [SeaJS 的介绍](#SeaJS)
- [UMD](#UMD)
- [ES Module](#ES-Module)
  * [介绍](#-11)
  * [特点](#-12)
  * [样例](#-13)
- [比较](#-14)
    + [AMD 和 CMD 的区别](#AMD-CMD)
    + [CommonJS 和 ES Module 的区别](#CommonJS-ES-Module)
- [参考](#-15)
    + [CommonJS 知识](#CommonJS-1)
    + [AMD 模块相关](#AMD-1)
    + [CMD 模块相关](#CMD-1)
    + [ES Module 模块相关](#ES-Module-1)
    + [各个规范之间的比较](#-16)
    + [模块化历史](#-17)

<!-- tocstop -->

## 模块化的历史

想当初，Brendan Eich 只用了十天就创造了 JavaScript 这门语言，谁曾想这门一直被看作玩具性质的语言在近几年获得了爆发性地发展，从浏览器端扩展到服务器，再到 native 端，变得越来越火热。而这门语言创造当初的诸多限制也在前端工程化的今天被放大，社区也在积极推动其变革。实现模块化的开发正是其中最大的需求，本文梳理 JavaScript 模块化开发的历史和未来，以作学习之用。

JavaScript 模块化的发展历程，是以 2009 年 CommonJS 的出现为分水岭，这一规范极大地推动前端发展。在1999年至2009年期间，模块化探索都是**基于语言层面**的优化，2009 年后前端开始大量使用预编译。

#### 刀耕火种的原始时代（1999 - 2009）

在 1999 年的时候，那会还没有全职的前端工程师，写 JS 是直接将变量定义在全局，做的好一些的或许会做一些文件目录规划，将资源归类整理，这种方式被称为**直接定义依赖**，举个例子：

```js
// greeting.js
var helloInLang = {
  en: 'Hello world!',
  es: '¡Hola mundo!',
  ru: 'Привет мир!'
};
function writeHello(lang) {
  document.write(helloInLang[lang]);
}

// third_party_script.js
function writeHello() {
  document.write('The script is broken');
}
```

```html
// index.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Basic example</title>
  <script src="./greeting.js"></script>
  <script src="./third_party_script.js"></script>
</head>
```

但是，即使有规范的目录结构，也不能避免由此而产生的大量全局变量，这就导致了一不小心就会有变量冲突的问题，就好比上面这个例子中的 `writeHello`。

于是在 2002 年左右，有人提出了命名空间模式的思路，用于解决遍地的全局变量，将需要定义的部分归属到一个对象的属性上，简单修改上面的例子，就能实现这种模式：

```js
// greeting.js
var app = {};
app.helloInLang = {
  en: 'Hello world!',
  es: '¡Hola mundo!',
  ru: 'Привет мир!'
};
app.writeHello = function (lang) {
  document.write(helloInLang[lang]);
}

// third_party_script.js
function writeHello() {
  document.write('The script is broken');
}
```

不过这种方式，毫无隐私可言，本质上就是全局对象，谁都可以来访问并且操作，一点都不安全。

2003 年左右就有人提出利用 IIFE 结合 Closures 特性，以此解决私有变量的问题，这种模式被称为闭包模块化模式：

```js
// greeting.js
var greeting = (function() {
  var module = {};
  var helloInLang = {
    en: 'Hello world!',
    es: '¡Hola mundo!',
    ru: 'Привет мир!',
  };

  module.getHello = function(lang) {
    return helloInLang[lang];
  };

  module.writeHello = function(lang) {
    document.write(module.getHello(lang));
  };

  return module;
})();
```

IIFE 可以形成一个独立的作用域，其中声明的变量，仅在该作用域下，从而达到实现私有变量的目的，就如上面例子中的 `helloInLang`，在该 IIFE 外是不能直接访问和操作的，可以通过暴露一些方法来访问和操作，比如说上面例子里面的 `getHello` 和 `writeHello2` 个方法，这就是所谓的 Closures。

同时，不同模块之间的引用也可以通过参数的形式来传递：

```js
// x.js
// @require greeting.js
var x = (function(greeting) {
  var module = {};

  module.writeHello = function(lang) {
    document.write(greeting.getHello(lang));
  };

  return module;
})(greeting);
```

此外使用 IIFE，还有2个好处：

1. 提高性能：通过 IIFE 的参数传递常用全局对象 window、document，在作用域内引用这些全局对象。JavaScript 解释器首先在作用域内查找属性，然后一直沿着链向上查找，直到全局范围，因此将全局对象放在 IIFE 作用域内可以提升js解释器的查找速度和性能；
2. 压缩空间：通过参数传递全局对象，压缩时可以将这些全局对象匿名为一个更加精简的变量名；

除了这些方式，还有其他的如**模版依赖定义**、**注释依赖定义**、**外部依赖定义**，不是很常见，但其本质都是想在语言层面解决模块化的问题。

不过，这些方案，虽然解决了依赖关系的问题，但是没有解决如何管理这些模块，或者说在使用时清晰描述出依赖关系，这点还是没有被解决，可以说是少了一个管理者。

没有管理者的时候，在实际项目中，得手动管理第三方的库和项目封装的模块，就像下面这样把所有需要的 JS 文件一个个按照依赖的顺序加载进来：

```html
<script src="zepto.js"></script>
<script src="jhash.js"></script>
<script src="fastClick.js"></script>
<script src="iScroll.js"></script>
<script src="underscore.js"></script>
<script src="handlebar.js"></script>
<script src="datacenter.js"></script>
<script src="deferred.js"></script>
<script src="util/wxbridge.js"></script>
<script src="util/login.js"></script>
<script src="util/base.js"></script>
<script src="util/city.js"></script>
```

对于这个问题，社区出现了新的工具，如 LABjs、YUI。YUI 作为昔日前端领域的佼佼者，很好的糅合了**命名空间模式**及**沙箱模式**，如以下的例子：

```js
// YUI - 编写模块
YUI.add('dom', function(Y) {
  Y.DOM = { ... }
})

// YUI - 使用模块
YUI().use('dom', function(Y) {
  Y.DOM.doSomeThing();
  // use some methods DOM attach to Y
})

// hello.js
YUI.add('hello', function(Y){
    Y.sayHello = function(msg){
        Y.DOM.set(el, 'innerHTML', 'Hello!');
    }
},'3.0.0',{
    requires:['dom']
})

// main.js
YUI().use('hello', function(Y){
    Y.sayHello("hey yui loader");
})
```

YUI 团队还提供的一系列用于 JS 压缩、混淆、请求合并（合并资源需要 server 端配合）等性能优化的工具，说其是现有 JS 模块化的鼻祖一点都不过分。

不过随着 Node.js 的到来，新出的 CommonJS 规范的落地，以及各种前端工具、解决方案的出现，才真正使得前端开发大放光芒。

#### 大步踏进工业化 （2009 - 至今）

CommonJS 的出现真正使得前端进入工业化时代。前面说了，2009 年以前的各种模块化方案虽然始终停留在语言层面上，虽然也有 YUI 这样的工具，但还不足以成为引领潮流的工具。究其原因，还是因为前端工程复杂度还没积累到一定程度，随着 Node.js 的出现，JS 涉足的领域转向后端，加上 Web app 变得越来越复杂，**工程发展到一定阶段，要出现的必然会出现。**

CommonJS 是一套同步的方案，它考虑的是在服务端运行的Node.js，主要是通过 `require` 来加载依赖项，通过 `exports` 或者 `module.exports` 来暴露接口或者数据的方式。

由于在服务端可以直接读取磁盘上的文件，所以能做到同步加载资源，但在浏览器上是通过 HTTP 方式获取资源，复杂的网络情况下无法做到同步，这就导致必须使用异步加载机制。这里发展出两个有影响力的方案：

* 基于 AMD 的 RequireJS
* 基于 CMD 的 SeaJS

它们分别在浏览器实现了`define`、`require`及`module`的核心功能，虽然两者的目标是一致的，但是实现的方式或者说是思路，还是有些区别的，AMD 偏向于依赖前置，CMD 偏向于用到时才运行的思路，从而导致了依赖项的加载和运行时间点会不同。

```js
// CMD
define(function (require) {
    var a = require('./a'); // <- 运行到此处才开始加载并运行模块a
    var b = require('./b'); // <- 运行到此处才开始加载并运行模块b
    // more code ..
})
```

```js
// AMD
define(
    ['./a', './b'], // <- 前置声明，也就是在主体运行前就已经加载并运行了模块a和模块b
    function (a, b) {
        // more code ..
    }
)
```

这里也有不少争议的地方，在于 CommonJS 社区认为 AMD 模式破坏了规范，反观 CMD 模式，简单的去除 `define` 的外包装，这就是标准的 CommonJS 实现，所以说 CMD 是最贴近 CommonJS 的异步模块化方案。不过 AMD 的社区资源比 CMD 更丰富，这也是 AMD 更加流行的一个原因。

此外同一时期还出现了一个 UMD 的方案，其实它就是 AMD 与 CommonJS 的集合体，通过 IIFE 的前置条件判断，使一个模块既可以在浏览器运行，也可以在 Node.js 中运行，举个例子：

```js
// UMD
(function(define) {
    define(function () {
        var helloInLang = {
            en: 'Hello world!',
            es: '¡Hola mundo!',
            ru: 'Привет мир!'
        };

        return {
            sayHello: function (lang) {
                return helloInLang[lang];
            }
        };
    });
}(
    typeof module === 'object' && module.exports && typeof define !== 'function' ?
    function (factory) { module.exports = factory(); } :
    define
));
```

不过这个用的比较少，仅作了解。

2015年6月，ECMAScript2015 发布了，JavaScript 终于在语言标准的层面上，实现了模块功能，使得在编译时就能确定模块的依赖关系，以及其输入和输出的变量，不像 CommonJS、AMD 之类的需要在运行时才能确定，成为浏览器和服务器通用的模块解决方案。

```js
// lib/greeting.js
const helloInLang = {
    en: 'Hello world!',
    es: '¡Hola mundo!',
    ru: 'Привет мир!'
};

export const getHello = (lang) => (
    helloInLang[lang];
);

export const sayHello = (lang) => {
    console.log(getHello(lang));
};

// hello.js
import { sayHello } from './lib/greeting';

sayHello('ru');
```

与 CommonJS 用 `require()` 方法加载模块不同，在 ES Module 中，`import` 命令可以具体指定加载模块中用 `export` 命令暴露的接口（不指定具体的接口，默认加载 `export default`），没有指定的是不会加载的，因此会在编译时就完成模块的加载，这种加载方式称为**编译时加载**或者**静态加载**。

而 CommonJS 的 `require()` 方法是在运行时才加载的：

```js

// lib/greeting.js
const helloInLang = {
    en: 'Hello world!',
    es: '¡Hola mundo!',
    ru: 'Привет мир!'
};
const getHello = function (lang) {
    return helloInLang[lang];
};

exports.getHello = getHello;
exports.sayHello = function (lang) {
    console.log(getHello(lang))
};

// hello.js
const sayHello = require('./lib/greeting').sayHello;

sayHello('ru');
```

可以看出，CommonJS 中是将整个模块作为一个对象引入，然后再获取这个对象上的某个属性。

因此 ES Module 的编译时加载，在效率上面会提高不少，此外，还会带来一些其它的好处，比如引入宏（macro）和类型检验（type system）这些只能靠静态分析实现的功能。

不过由于 ES Module 在低版本的 Node.js 和浏览器上支持度有待加强，所以一般还是通过 Babel 进行转换成 es5 的语法，兼容更多的平台。

## 各种模块化方案出现的时间线

- 1999: 直接定义依赖
- 2002: 命名空间模式
- 2003: 闭包模块化模式
- 2006: 模版依赖定义
- 2006：注释依赖定义
- 2007：外部依赖定义
- 2009：Sandbox 模式
- 2009：依赖注入
- 2009: 🌟CommonJS 规范
- 2009: 🌟AMD 规范，
- 2009: 🌟CMD 规范，差不多跟 AMD 规范同样时间出现，都是为了解决浏览器端模块化问题，它是由 sea.js 在推广过程中对模块定义的规范化产出。
- 2011: UMD 规范
- 2012: Labeled Modules
- 2013: YModules
- 2015: 🌟ES Module

## CommonJS

#### 介绍

Node 应用由模块组成，采用 CommonJS 模块规范。

每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。


CommonJS 规范规定，每个模块内部，`module` 变量代表当前模块。这个变量是一个对象，它的 `exports` 属性（即 `module.exports` ）是对外的接口。加载某个模块，其实是加载该模块的 `module.exports` 属性。

```js
var x = 5;
var addX = function (value) {
  return value + x;
};
module.exports.x = x;
module.exports.addX = addX;
```

`require`方法用于加载模块。

```js
var example = require('./example.js');

console.log(example.x); // 5
console.log(example.addX(1)); // 6
```

#### 特点

- 所有代码都运行在模块作用域，不会污染全局作用域。
- 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
- 模块加载的顺序，按照其在代码中出现的顺序。

#### module 对象

Node 内部提供一个 `Module` 构建函数。所有模块都是 `Module` 的实例。

```js
function Module(id, parent) {
  this.id = id;
  this.exports = {};
  this.parent = parent;
  // ...
}
```

每个模块内部，都有一个 `module` 对象，代表当前模块。它有以下属性:

- `module.id` 模块的识别符，通常是带有绝对路径的模块文件名。
- `module.filename` 模块的文件名，带有绝对路径。
- `module.loaded` 返回一个布尔值，表示模块是否已经完成加载。
- `module.parent` 返回一个对象，表示调用该模块的模块。
- `module.children` 返回一个数组，表示该模块要用到的其他模块。
- `module.exports` 表示模块对外输出的值

`module.exports` 属性表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取 `module.exports` 变量。

为了方便，Node 为每个模块提供一个 `exports` 变量，指向 `module.exports`。这等同在每个模块头部，有一行这样的命令:

```js
var exports = module.exports;
```

造成的结果是，在对外输出模块接口时，可以向 `exports` 对象添加方法。

```js
exports.area = function (r) {
  return Math.PI * r * r;
};

exports.circumference = function (r) {
  return 2 * Math.PI * r;
};
```

**注意**，不能直接将 `exports` 变量指向一个值，因为这样等于切断了 `exports` 与 `module.exports` 的联系。


```js
// 无效代码
exports.hello = function() {
  return 'hello';
};

module.exports = 'Hello world';
```

上面代码中，`hello` 函数是无法对外输出的，因为 `module.exports` 被重新赋值了。

这意味着，如果一个模块的对外接口，就是一个单一的值，不能使用 `exports` 输出，只能使用 `module.exports` 输出。

```js
module.exports = function (x){ console.log(x);};
```

#### 目录的加载规则

通常，我们会把相关的文件会放在一个目录里面，便于组织。这时，最好为该目录设置一个入口文件，让 `require` 方法可以通过这个入口文件，加载整个目录。

在目录中放置一个 `package.json` 文件，并且将入口文件写入 `main` 字段。下面是一个例子。

```js
// package.json
{ 
  "name" : "some-library",
  "main" : "./lib/some-library.js" 
}
```

`require` 发现参数字符串指向一个目录以后，会自动查看该目录的 `package.json` 文件，然后加载 `main` 字段指定的入口文件。如果 `package.json` 文件没有 `main` 字段，或者根本就没有 `package.json` 文件，则会加载该目录下的 `index.js` 文件或 `index.node` 文件。

#### 模块的缓存

第一次加载某个模块时，Node会缓存该模块。以后再加载该模块，就直接从缓存取出该模块的 `module.exports` 属性。

```js
require('./example.js');
require('./example.js').message = "hello";
require('./example.js').message
// "hello"
```

上面代码中，连续三次使用 `require` 命令，加载同一个模块。第二次加载的时候，为输出的对象添加了一个 `message` 属性。但是第三次加载的时候，这个 `message` 属性依然存在，这就证明 `require` 命令并没有重新加载模块文件，而是输出了缓存。

如果想要多次执行某个模块，可以让该模块输出一个函数，然后每次 `require` 这个模块的时候，重新执行一下输出的函数。

所有缓存的模块保存在 `require.cache` 之中，如果想删除模块的缓存，可以像下面这样写。

```js
// 删除指定模块的缓存
delete require.cache[moduleName];

// 删除所有模块的缓存
Object.keys(require.cache).forEach(function(key) {
  delete require.cache[key];
})
```

注意，缓存是根据绝对路径识别模块的，如果同样的模块名，但是保存在不同的路径，`require` 命令还是会重新加载该模块。

#### 模块的加载机制

CommonJS 模块的加载机制是，输入的是被输出的值的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。请看下面这个例子。

下面是一个模块文件`lib.js`。

```js
// lib.js
var counter = 3;
function incCounter() {
  counter++;
}
module.exports = {
  counter: counter,
  incCounter: incCounter,
};
```

上面代码输出内部变量 `counter` 和改写这个变量的内部方法 `incCounter`。

然后，加载上面的模块。

```js
// main.js
var counter = require('./lib').counter;
var incCounter = require('./lib').incCounter;

console.log(counter);  // 3
incCounter();
console.log(counter); // 3
```

上面代码说明，`counter` 输出以后，`lib.js` 模块内部的变化就影响不到 `counter` 了。


## AMD

#### 介绍

AMD 全称为 Asynchromous Module Definition（异步模块定义）。
AMD 是 RequireJS 在推广过程中对模块定义的规范化产出，它是一个在浏览器端模块化开发的规范。
AMD 模式可以用于浏览器环境并且允许**异步**加载模块，同时又能保证正确的顺序，也可以按需动态加载模块。

#### 规范介绍

模块通过 `define` 函数定义在闭包中，格式如下：

```js
define(id?: String, dependencies?: String[], factory: Function|Object);
```

`id` 是模块的名字，它是可选的参数。

`dependencies` 指定了所要依赖的模块列表，它是一个数组，也是可选的参数，每个依赖的模块的输出将作为参数一次传入 `factory` 中。如果没有指定 `dependencies`，那么它的默认值是 `["require", "exports", "module"]`：

```js
define(function(require, exports, module) {}）
```

`factory` 是最后一个参数，它包裹了模块的具体实现，它是一个函数或者对象。如果是函数，那么它的返回值就是模块的输出接口或值。


**用例：**

定义一个名为 myModule 的模块，它依赖 jQuery 模块：

```js
// 定义
define('myModule', ['jquery'], function($) {
    // $ 是 jquery 模块的输出
    $('body').text('hello world');
});
// 使用
require(['myModule'], function(myModule) {});
```

定义一个没有 id 值的匿名模块，通常作为应用的启动函数：

```js
define(['jquery'], function($) {
    $('body').text('hello world');
});
```

依赖多个模块的定义：

```js
define(['jquery', './math.js'], function($, math) {
    // $ 和 math 一次传入 factory
    $('body').text('hello world');
});
```

模块输出：

```js
define(['jquery'], function($) {

    var HelloWorldize = function(selector){
        $(selector).text('hello world');
    };

    // HelloWorldize 是该模块输出的对外接口
    return HelloWorldize;
});
```

在模块定义内部引用依赖：

```js
define(function(require) {
    var $ = require('jquery');
    $('body').text('hello world');
});
```

#### RequireJS 的介绍

RequireJS 可以看作是对 AMD 规范的具体实现，它的用法和上节所展示的有所区别。

下载地址：http://requirejs.org/docs/download.html

下面简单介绍一下其用法：

1. 在 index.html 中引用 RequireJS:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>requirejs test</title>
  </head>
  <body>
    <div id="messageBox"></div>
    <button id="btn" type="button" name="button">点击</button>
    <script data-main="js/script/main.js" src="js/lib/require.js"></script>
  </body>
</html>
```

这里的 `script` 标签，除了指定 RequireJS 路径外，还有个 `data-main` 属性，这属性指定在加载完 RequireJS 后，就用 RequireJS 加载该属性值指定路径下的 JS 文件并运行，所以一般该 JS 文件称为主 JS 文件（其 .js 后缀可以省略）。

2. main.js

```js
// 配置文件
require.config({
    baseUrl: 'js',
    paths: {
        jquery: 'lib/jquery-1.11.1',
    }
});

// 加载模块
require(['jquery', 'script/hello'],function ($, hello) {
    $("#btn").click(function(){
      hello.showMessage("test");
    });
});
```

3. hello.js

```js
// 定义模块
define(['jquery'],function($){
    //变量定义区
    var moduleName = "hello module";
    var moduleVersion = "1.0";
 
    //函数定义区
    var showMessage = function(name){
        if(undefined === name){
            return;
        }else{
            $('#messageBox').html('欢迎访问 ' + name);
        }
    };
 
    //暴露(返回)本模块API
    return {
        "moduleName":moduleName,
        "version": moduleVersion,
        "showMessage": showMessage
    }
});
```

我们通过 `define` 方法定义一个 js 模块，并通过 `return` 对外暴露出接口（两个属性，一个方法）。同时该模块也是依赖于 jQuery。

RequireJS 支持使用 `require.config` 来配置项目，具体 API 使用方法见官网文档或网上资料，这里只做基本介绍。

## CMD

#### 介绍

在前端的模块化发展上，还有另一种与 AMD 相提并论的规范，这就是 CMD：

CMD 即 Common Module Definition 通用模块定义。
CMD 是 SeaJS 在推广过程中对模块定义的规范化产出。
CMD 规范的前身是 Modules/Wrappings 规范。

#### 规范介绍

在 CMD 规范中，一个模块就是一个文件。代码的书写格式如下：

```js
define(factory);
```

#### 1. define `Function`


define 是一个全局函数，用来定义模块。

**define(factory)**

`define` 接受 `factory` 参数，`factory` 可以是一个函数，也可以是一个对象或字符串。

`factory` 为对象、字符串时，表示模块的接口就是该对象、字符串。比如可以如下定义一个 JSON 数据模块：


```js
define({ "foo": "bar" });
```

也可以通过字符串定义模板模块：

```js
define('I am a template. My name is {{name}}.');
```

`factory` 为函数时，表示是模块的构造方法。执行该构造方法，可以得到模块向外提供的接口。`factory` 方法在执行时，默认会传入三个参数：`require`、`exports` 和 `module`：

```js
define(function(require, exports, module) {
  // 模块代码
});
```

**define(id?, deps?, factory)**

`define` 也可以接受两个以上参数。字符串 `id` 表示模块标识，数组 `deps` 是模块依赖。比如：

```js
define('hello', ['jquery'], function(require, exports, module) {
  // 模块代码
});
```

`id` 和 `deps` 参数可以省略。省略时，可以通过构建工具自动生成。

注意：带 `id` 和 deps 参数的 `define` 用法不属于 CMD 规范，而属于 Modules/Transport 规范。

**define.cmd**

一个空对象，可用来判定当前页面是否有 CMD 模块加载器：

```js
if (typeof define === "function" && define.cmd) {
  // 有 Sea.js 等 CMD 模块加载器存在
}
```

#### 2. require `Function`

`require` 是 `factory` 函数的第一个参数。

**require(id)**

`require` 是一个方法，接受[模块标识](https://github.com/seajs/seajs/issues/258)作为唯一参数，用来获取其他模块提供的接口。

```js
define(function(require, exports) {

  // 获取模块 a 的接口
  var a = require('./a');

  // 调用模块 a 的方法
  a.doSomething();

});
```

**require.async(id, callback?)**

`require.async` 方法用来在模块内部异步加载模块，并在加载完成后执行指定回调。`callback` 参数可选。

```js
define(function(require, exports, module) {

  // 异步加载一个模块，在加载完成时，执行回调
  require.async('./b', function(b) {
    b.doSomething();
  });

  // 异步加载多个模块，在加载完成时，执行回调
  require.async(['./c', './d'], function(c, d) {
    c.doSomething();
    d.doSomething();
  });

});
```

**注意**：`require` 是同步往下执行，`require.async` 则是异步回调执行。`require.async` 一般用来加载可延迟异步加载的模块。


**require.resolve(id)**

使用模块系统内部的路径解析机制来解析并返回模块路径。该函数不会加载模块，只返回解析后的绝对路径。

```js
define(function(require, exports) {

  console.log(require.resolve('./b'));
  // ==> http://example.com/path/to/b.js

});
```

这可以用来获取模块路径，一般用在插件环境或需动态拼接模块路径的场景下。

#### 3. exports `Object`

`exports` 是一个对象，用来向外提供模块接口。

```js
define(function(require, exports) {

  // 对外提供 foo 属性
  exports.foo = 'bar';

  // 对外提供 doSomething 方法
  exports.doSomething = function() {};

});
```

除了给 `exports` 对象增加成员，还可以使用 `return` 直接向外提供接口。

```js
define(function(require) {

  // 通过 return 直接提供接口
  return {
    foo: 'bar',
    doSomething: function() {}
  };

});
```

如果 `return` 语句是模块中的唯一代码，还可简化为：

```js
define({
  foo: 'bar',
  doSomething: function() {}
});
```

`特别注意`：下面这种写法是错误的！

```js
define(function(require, exports) {

  // 错误用法！！!
  exports = {
    foo: 'bar',
    doSomething: function() {}
  };

});
```

正确的写法是用 `return` 或者给 `module.exports` 赋值：

```js
define(function(require, exports, module) {

  // 正确写法
  module.exports = {
    foo: 'bar',
    doSomething: function() {}
  };

});
```

提示：`exports` 仅仅是 `module.exports` 的一个引用。在 `factory` 内部给 `exports` 重新赋值时，并不会改变 `module.exports` 的值。因此给 `exports` 赋值是无效的，不能用来更改模块接口。


#### 4. module `Object`

`module` 是一个对象，上面存储了与当前模块相关联的一些属性和方法。

**module.id `String`**

模块的唯一标识。

```js
define('id', [], function(require, exports, module) {

  // 模块代码

});
```

上面代码中，`define` 的第一个参数就是模块标识。


**module.uri `String`**

根据模块系统的路径解析规则得到的模块绝对路径。

```js
define(function(require, exports, module) {

  console.log(module.uri); 
  // ==> http://example.com/path/to/this/file.js

});
```

一般情况下（没有在 `define` 中手写 `id` 参数时），`module.id` 的值就是 `module.uri`，两者完全相同。

**module.dependencies `Array`**

`dependencies` 是一个数组，表示当前模块的依赖。

**module.exports `Object`**

当前模块对外提供的接口。

传给 `factory` 构造方法的 `exports` 参数是 `module.exports` 对象的一个引用。只通过 `exports` 参数来提供接口，有时无法满足开发者的所有需求。 比如当模块的接口是某个类的实例时，需要通过 `module.exports` 来实现：

```js
define(function(require, exports, module) {

  // exports 是 module.exports 的一个引用
  console.log(module.exports === exports); // true

  // 重新给 module.exports 赋值
  module.exports = new SomeClass();

  // exports 不再等于 module.exports
  console.log(module.exports === exports); // false

});
```

**注意**：对 `module.exports` 的赋值需要同步执行，不能放在回调函数里。下面这样是不行的：

```js
// x.js
define(function(require, exports, module) {

  // 错误用法
  setTimeout(function() {
    module.exports = { a: "hello" };
  }, 0);

});
```

#### SeaJS 的介绍

文档地址：[Sea.js - A Module Loader for the Web](https://seajs.github.io/seajs/docs/)

简单入手：

1. index.html

```html
<!DOCTYPE html>
<html>
    <head>
        <script type="text/javascript" src="sea.js"></script>
        <script type="text/javascript">
          // seajs 的简单配置
          seajs.config({
            base: "../sea-modules/",
            alias: {
              "jquery": "jquery/jquery/1.10.1/jquery.js"
            }
          })

          // 加载入口模块
          seajs.use("../static/hello/src/main")
        </script>
    </head>
    <body>
    </body>
</html>
```

2. main.js

```js
// 所有模块都通过 define 来定义
define(function(require, exports, module) {

  // 通过 require 引入依赖
  var $ = require('jquery');
  var Spinning = require('./spinning');

  // 通过 exports 对外提供接口
  exports.doSomething = ...

  // 或者通过 module.exports 提供整个接口
  module.exports = ...

});
```

## UMD

特点：兼容 AMD 和 CommonJS 规范的同时，还兼容全局引用的方式

常规写法：
```js
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        //AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        //Node, CommonJS之类的
        module.exports = factory(require('jquery'));
    } else {
        //浏览器全局变量(root 即 window)
        root.returnExports = factory(root.jQuery);
    }
}(this, function ($) {
    //方法
    function myFunc(){};
    //暴露公共方法
    return myFunc;
}));
```

## ES Module

### 介绍

在 ES Module 之前，社区制定了一些模块加载方案，最主要的有 CommonJS 和 AMD 两种。前者用于服务器，后者用于浏览器。ES Module 在语言标准的层面上，实现了模块功能，而且实现得相当简单，完全可以取代 CommonJS 和 AMD 规范，成为浏览器和服务器通用的模块解决方案。

ES Module 的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。

CommonJS 和 AMD 模块，其本质是在运行时生成一个**对象**进行导出，称为“运行时加载”，没法进行“编译优化”，而 ES Module 不是对象，而是通过 `export` 命令显式指定输出的代码，再通过 `import` 命令输入。这称为“编译时加载”或者静态加载，即 ES Module 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。当然，这也导致了没法引用 ES Module 模块本身，因为它不是对象。

由于 ES Module 是编译时加载，使得静态分析成为可能。有了它，就能进一步拓宽 JavaScript 的语法，比如引入宏（macro）和类型检验（type system）这些只能靠静态分析实现的功能。

除了静态加载带来的各种好处，ES Module 还有以下好处：

- 不再需要 UMD 模块格式了，将来服务器和浏览器都会支持 ES Module 格式。目前，通过各种工具库，其实已经做到了这一点。
- 将来浏览器的新 API 就能用模块格式提供，不再必须做成全局变量或者 navigator 对象的属性。
- 不再需要对象作为命名空间（比如 Math 对象），未来这些功能可以通过模块提供。

### 特点

- 静态编译
- 输出的值引用，而非值拷贝
- `import` 只能写在顶层，因为是静态语法

### 样例

1. `export` 只支持导出接口，可以看作对象形式，值无法被当成接口，所以是错误的。

```js
/*错误的写法*/
// 写法一
export 1;

// 写法二
var m = 1;
export m;

/*正确的四种写法*/
// 写法一
export var m = 1;

// 写法二
var m = 1;
export {m};

// 写法三
var n = 1;
export {n as m};

// 写法四
var n = 1;
export default n;
```

2. `export default` 命令用于指定模块的默认输出。`export default` 就是输出一个叫做 `default` 的变量或方法，然后系统允许你为它取任意名字

```js
// modules.js
function add(x, y) {
  return x * y;
}
export {add as default};
// 等同于
// export default add;

// app.js
import { default as foo } from 'modules';
// 等同于
// import foo from 'modules';
```

## 比较

JavaScript 模块规范主要有四种：CommonJS、AMD、CMD、ES Module。
CommonJS 用在服务器端，AMD 和CMD 用在浏览器环境，ES Module 是作为终极通用解决方案。


#### AMD 和 CMD 的区别

- 执行时机： AMD 是提前执行，CMD 是延迟执行。
- 对依赖的处理：AMD 推崇依赖前置，CMD 推崇依赖就近。
- API 设计理念：AMD 的 API 默认是一个当多个用，非常灵活，CMD 的 API 严格区分，推崇职责单一。
- 遵循的规范：RequireJS 遵循的是 Modules/AMD 规范，SeaJS 遵循的是 Mdoules/Wrappings 规范的 define 形式。
- 设计理念：SeaJS 设计理念是 focus on web, 努力成为浏览器端的模块加载器，RequireJS 想成为浏览器端的模块加载器，同时也想成为 Rhino / Node 等环境的模块加载器。

#### CommonJS 和 ES Module 的区别

- 加载时机：CommonJS 是运行时加载（动态加载），ES Module 是编译时加载（静态加载）
- 加载模块：CommonJS 模块就是对象，加载的是该对象，ES Module 模块不是对象，加载的不是对象，是接口
- 加载结果：CommonJS 加载的是整个模块，即将所有的接口全部加载进来，ES Module 可以单独加载其中的某个接口（方法）
- 输出：CommonJS 输出值的拷贝，ES Module 输出值的引用
- this: CommonJS 指向当前模块，ES Module 指向 undefined

## 参考

#### CommonJS 知识

- [CommonJS Spec Wiki](http://wiki.commonjs.org/wiki/CommonJS)
- [CommonJS规范 -- JavaScript 标准参考教程（alpha）](http://javascript.ruanyifeng.com/nodejs/module.html)

#### AMD 模块相关

- [AMD (中文版) · amdjs/amdjs-api Wiki · GitHub](https://github.com/amdjs/amdjs-api/wiki/AMD-(%E4%B8%AD%E6%96%87%E7%89%88))
- [AMD 规范 | Webpack 中文指南](https://zhaoda.net/webpack-handbook/amd.html)
- [RequireJS - 入门指南、进阶使用详解（附样例）](http://www.hangge.com/blog/cache/detail_1702.html)
- [Javascript模块化编程（一）：模块的写法 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2012/10/javascript_module.html)
- [Javascript模块化编程（二）：AMD规范 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2012/10/asynchronous_module_definition.html)
- [Javascript模块化编程（三）：require.js的用法 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2012/11/require_js.html)

#### CMD 模块相关

- [CMD 模块定义规范 · Issue #242 · seajs/seajs · GitHub](https://github.com/seajs/seajs/issues/242)

#### ES Module 模块相关

- [ECMAScript 6入门](http://es6.ruanyifeng.com/#docs/module)

#### 各个规范之间的比较

- [AMD 和 CMD 的区别有哪些？ - 知乎](https://www.zhihu.com/question/20351507)
- [JS - CommonJS、ES2015、AMD、CMD模块规范对比与介绍（附样例）](http://www.hangge.com/blog/cache/detail_1686.html)
- [JS模块规范：AMD、UMD、CMD、commonJS、ES6 module - 个人文章 - SegmentFault 思否](https://segmentfault.com/a/1190000012419990)
-[SeaJS 和 RequireJS 的异同 \| 岁月如歌](https://lifesinger.wordpress.com/2011/05/17/the-difference-between-seajs-and-requirejs/)

#### 模块化历史

- [精读 js 模块化发展 - 知乎](https://zhuanlan.zhihu.com/p/26118022)
- [JavaScript模块化编程简史（2009-2016）](https://yuguo.us/weblog/javascript-module-development-history/)
- [JavaScript模块化开发的演进历程 - 个人文章 - SegmentFault 思否](https://segmentfault.com/a/1190000011081338)
- [GitHub - myshov/history-of-javascript: Project "History of JavaScript"](https://github.com/myshov/history-of-javascript)
- [前端模块化开发那点历史 · Issue #588 · seajs/seajs · GitHub](https://github.com/seajs/seajs/issues/588)
- [前端模块化开发的价值 · Issue #547 · seajs/seajs · GitHub](https://github.com/seajs/seajs/issues/547)
