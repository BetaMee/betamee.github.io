---
title: Babel 社区概览
date: 2019-04-18 21:00:00
category: WebFrontEnd
tags: Web_Deep 工程化 Babel
openreward: false
uninqueid: 1c5c1fded79a5241abd6ccbc1ad8235b
---

> 本文发布于 2019-04-15，总结了 babel 社区的工具使用，以及如何合理地进行配置。如果要看结论的话，直接跳到文章最后一节。

## 目录

<!-- toc -->

- [@babel/preset-env](#babelpreset-env)
    + [介绍](#)
    + [`targets`](#targets)
    + [`spec`](#spec)
    + [`loose`](#loose)
    + [`modules`](#modules)
    + [`debug`](#debug)
    + [`include`](#include)
    + [`exclude`](#exclude)
    + [`useBuiltIns`](#useBuiltIns)
    + [`corejs`](#corejs)
    + [`forceAllTransforms`](#forceAllTransforms)
    + [`configPath`](#configPath)
    + [`ignoreBrowserslistConfig`](#ignoreBrowserslistConfig)
    + [`shippedProposals`](#shippedProposals)
- [@babel/preset-stage-x（废弃）](#babelpreset-stage-x)
- [@babel/polyfill](#babelpolyfill)
    + [介绍](#-1)
    + [副作用](#-2)
- [@babel/runtime](#babelruntime)
    + [介绍](#-3)
    + [使用场景](#-4)
- [@babel/plugin-transform-runtime](#babelplugin-transform-runtime)
    + [介绍](#-5)
    + [Demo](#Demo)
- [babel-register](#babel-register)
- [`babel-node`](#babel-node)
- [一份可用的配置](#-6)
    + [安装对应的包](#-7)
    + [babel.config.js](#babelconfigjs)
- [参考](#-8)
    + [Babel 的使用](#Babel)
    + [Babel 的配置信息](#Babel-1)

<!-- tocstop -->

## @babel/preset-env

#### 介绍

babel-preset-env 是一系列插件的合集，官方已不用再使用 preset-201x 和 preset-latst 之类的包，env 包可以根据配置自动处理兼容代码。

文档：https://babeljs.io/docs/en/babel-preset-env

#### `targets`

`string | Array<string> | { [string]: string }, defaults to {}`

针对你的项目指定生成的代码环境。

可以是字符串：

```js
{
  "targets": "> 0.25%, not dead"
}
```

也可以是对象：

```js
{
  "targets": {
    "chrome": "58",
    "ie": "11"
  }
}
```

默认是`{}`

```js
{
  "targets": {}
}
```

其中的环境值可以参考 [browserslist](https://github.com/browserslist/browserslist) 项目。

**`targets.esmodules`**

`boolean`。

也可以针对那些支持 ES Module 的浏览器而优化。当指定本选项时，browsers 字段会被忽视。你可以和 `<script type="module"></script>` 一起使用，来生成更小的脚本代码。

> 请注意: 当指定 esmodules 选项, browsers targets 会被忽视。

```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "esmodules": true
        }
      }
    ]
  ]
}
```

**`targets.node`**

`string | "current" | true`。

如果要针对当前 node 版本进行编译，可以指定 `"node" ：true` 或 `"node"："current"`，它与 `"node"：process.versions.node` 相同。

**`targets.safari`**

`string | "tp"`。

如果要针对 Safari 的技术预览版进行编译，可以指定“safari”：“tp”。

**`targets.browsers`（废弃）**

`string | Array<string>`。

使用 [browserslist](https://github.com/ai/browserslist) 选择浏览器的查询（例如：`last 2 versions, > 5%, safari tp`）。

注意，browsers 的结果会被 `targets` 中的显式项覆盖。（此特性经过检验已废弃）

> 注意：这将在更高版本中删除，而不是直接将 `targets` 设置为 browserslist 的兼容查询。

```js
{
  "targets": {
    "browsers": {
        "chrome": "58",
        "ie": "11"
    }
  }
}
// 等价于，但最新版已经不能用了
{
  "targets": {
    "chrome": "58",
    "ie": "11"
  }
}
```

#### `spec`

`boolean`， 默认 `false`。

为此预设中支持它们的任何插件启用更符合规范但可能更慢的转换。

#### `loose`

`boolean`， 默认 `false`。

为此预设中允许它们的任何插件启用 "[loose](http://2ality.com/2015/12/babel6-loose-mode.html)" 转换。

#### `modules`

`"amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false, defaults to "auto"`。

启用将 ES6 模块语法转换为其他模块类型。

将此设置为 `false` 将不会转换模块。

也要注意 `cjs` 是 `commonjs` 的别名。

#### `debug`

`boolean`， 默认 `false`。

通过 `console.log` 输出使用的 targets/plugins 和[插件数据](https://github.com/babel/babel/blob/master/packages/babel-preset-env/data/plugins.json)中指定的版本信息。

#### `include`

`Array<string|RegExp>`，默认 `[]`。

一个总是包含的插件数组。

以下是有效的配置：

* [Babel 插件](https://github.com/babel/babel/blob/master/packages/babel-preset-env/data/plugin-features.js)，`@babel/plugin-transform-spread` 和不带前缀的 `plugin-transform-spread` 的写法都支持。
* [内置特性](https://github.com/babel/babel/blob/master/packages/babel-preset-env/data/corejs2-built-in-features.js)，比如 `es6.map`，`es6.set`，或者 `es6.object.assign`。

可以完全或部分指定插件名称（或使用 RegExp ）。

支持的写法：

* 全称（`string`）: "es6.math.sign"
* 部分 (`string`): "es6.math.*" (解析为所有带 `es6.math` 前缀的插件)
* 正则对象: `/^transform-.*$/` 或者 `new RegExp("^transform-modules-.*")`

注意，上面的正则对象中的 `.` 意思是匹配任何字符，而不是实际的 `.` 字符。 另请注意，匹配任何字符。`.*` 是在正则中使用，不同于 `*` 在 `glob`格式中使用。

此选项主要针对于原生增强代码中的 BUG，或者一系列没有起作用的不受支持的功能特性。

例如，node 4 支持原生 `class` 但不支持 `spread`。如果 `super` 需要 `spread` 特性，那么需要包含 `@babel/plugin-transform-classes` 插件。

> 注意：`include` 和 `exclude` 选项仅适用于此预设中[包含的插件](https://github.com/babel/babel/blob/master/packages/babel-preset-env/data/plugin-features.js); 因此，在选项中包含 `@babel/plugin-proposal-do-expressions` 排除或 `@babel/plugin-proposal-function-bind` 会抛出错误（因为此预设没有这些项目）。要使用此预设中未包含的插件，请直接将其添加到 `plugin` 选项中。

#### `exclude`

`Array<string|RegExp>`，默认 `[]`。

一个总是排除/移除的插件数组。

配置选项与 `include` 相同。

如果您不想使用 generators 并且不想包含 `regeneratorRuntime`（使用 `useBuiltIns` 时），或者使用了其他插件（如 [fast-async](https://github.com/MatAtBread/fast-async)）而不是 [Babel's async-to-gen](https://babeljs.io/docs/en/babel-plugin-proposal-async-generator-functions)，则此选项可以将 `@babel/plugin-transform-regenerator` 等转换禁用。

#### `useBuiltIns`

`"usage" | "entry" | false`， 默认是 `false`。

> 此选项将 core-js 模块直接引用为裸导入。因此，core-js 将相对于文件本身进行解析，并且是可被访问的。如果没有 core-js 依赖项或者有多个版本，您可能需要将 core-js@2 指定为应用程序中的顶级依赖项。

这个选项配置了 `@babel/preset-env` 如何处理 polyfills。

**`useBuiltIns: 'entry'`**

> 注意：只需要在你整个 app 中使用 `require("@babel/polyfill");` 一次。多次对 `@babel/polyfill` 的导入会导致全局冲突和其他很难跟踪的错误。我们推荐创建一个单独的文件处理 `require` 语句。

这个选项会启用一个新的插件，将 `import "@babel/polyfill"` 或者 `require("@babel/polyfill")` 替换为 `@babel/polyfill` 下的各个基于不同环境的单独项导入。

```sh
npm install @babel/polyfill --save
```

输入

```js
import "@babel/polyfill";
```
输出（不同的配置环境下有所区别）

```js
import "core-js/modules/es7.string.pad-start";
import "core-js/modules/es7.string.pad-end";
```

也可以直接导入 `core-js`（`import "core-js";` or `require('core-js');`）

**`useBuiltIns: 'usage'`（实验性）**

在每个文件中使用 polyfill 时，为 polyfill 添加特定导入。我们利用 bundler 只加载一次相同的 polyfill。

输入

a.js

```js
var a = new Promise();
```

b.js

```js
var b = new Map();
```

输出（如果当前配置环境不支持此特性）

```js
import "core-js/modules/es6.promise";
var a = new Promise();
```

```js
import "core-js/modules/es6.map";
var b = new Map();
```

输出（如果当前配置环境支持此特性）

```js
var a = new Promise();
```

```js
var b = new Map();
```

**`useBuiltIns: false`**

既不会在每个文件中自动添加 polyfill，也不会将 "@babel/polyfill" 导入为单个 polyfill。

**简单总结**

`'usage'` 和 `'entry'` 的区别：

* `'usage'` 无需在头部引入 `import '@babel/polyfill'`，它会自动根据当前的代码引入对应特性，并且只引用**代码中用到的**特性（browserslist 配置 + 代码用到）
* `'entry'` 需要在头部引入 `'@babel/polyfill'`，并且是根据配置环境引入对应的特性。代码中没有用到，但环境中会缺失，也会引入。（只根据 browserslist 配置）

> `usage` 风险项：由于我们通常会使用很多 npm 的 dependencies 包来进行业务开发，babel 默认是不会检测 依赖包的代码的。
> 也就是说，如果某个 依赖包使用了 `Array.from`， 但是自己的业务代码没有使用到该API，构建出来的 polyfill 也不会有 `Array.from`， 如此一来，可能会在某些使用低版本浏览器的用户出现 BUG。
> 所以避免这种情况发生，一般开源的第三方库发布上线的时候都是转换成 ES5 的。

#### `corejs`

`corejs` 配置项是决定当前 Babel 使用的版本，有 `2` 和 `3` 选项。

升级文档中已经说明了，最新版的 Babel7 `@babel/polyfill` 移除了 polyfill proposals，所以 `@babel/polyfill` 仅仅是 core-js v2 的别名。

所以这里就需要注意的一点，如果使用 `corejs: 2` + `useBuiltIns: 'entry'` 的话，就会报警告：

```sh
`@babel/polyfill` is deprecated. Please, use required parts of `core-js` and `regenerator-runtime/runtime` separately
```

这里需要使用的是 `corejs: 3` + `useBuiltIns: 'entry'`，才不会出错。

#### `forceAllTransforms`

`boolean`， 默认 `false`。

由于有了 Babel7 [Javascipt config file](https://babeljs.io/docs/en/config-files#javascript) 的支持，你可以根据是否设置了 `production` 来控制转换。

```js
module.exports = function(api) {
  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            chrome: 59,
            edge: 13,
            firefox: 50,
          },
          // for uglifyjs...
          forceAllTransforms: api.env("production"),
        },
      ],
    ],
  };
};
```

> 注意： `targets.uglify` 已被废弃，并且在下一个版本中被移除。

默认情况下，此预设将运行目标环境所需的所有变换。如果你要强制运行*所有*转换，则启用此选项可以在需要用到 UglifyJS 或仅支持 ES5 语法的某些场景下会很有用。

#### `configPath`

`string`， 默认是 `process.cwd()`

决定配置 browserslist 搜索的起点，一直往上到系统根目录，直到找到。

#### `ignoreBrowserslistConfig`

`boolean`， 默认是 `false`

切换是否使用 [browserslist 配置源](https://github.com/browserslist/browserslist#queries)，包括搜索任何 browserslist 文件或引用package.json 中的 `browserslist` 键。这对于那些不走 Babel 编译，但使用 browserslist 配置的项目非常有用。

#### `shippedProposals`

`boolean`， 默认是 `false`

切换启用对浏览器中提供的内置特性的支持。如果你的目标环境对某一个特性提案（proposal）具有原生支持，则会启用与其匹配的解析器语法插件，而不是执行任何转换。请注意，这不会启用与 `@babel/preset-stage-3` 相同的转换，因为这些提案可能在正式落地浏览器之前会有变更。

目前支持以下内容：

内置：

* [es7.array.flat-map](https://github.com/tc39/proposal-flatMap)

特性：

* 无

## @babel/preset-stage-x（废弃） 

在 babel7 中，官方已经宣布废弃 babel stage preset 包，大概是考虑到广泛使用的 stage-x 不适合社区的发展，具体原因见[官方博客](https://babeljs.io/blog/2018/07/27/removing-babels-stage-presets)

在新版的 babel 配置需要根据自己的需要下载对应的 proposal 插件，因为 stage-x 本身也是这些插件的集合，但不包含在 env 包中，比如安装：`@babel/plugin-proposal-function-bind`，使用这些还没正式进标准但社区已经广为使用的语言特性。

具体使用的话，以前的各个 stage 等同于下面的各个插件的集合：

```js
{
  "plugins": [
    // Stage 0
    "@babel/plugin-proposal-function-bind",

    // Stage 1
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-proposal-logical-assignment-operators",
    ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
    ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
    ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
    "@babel/plugin-proposal-do-expressions",

    // Stage 2
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    "@babel/plugin-proposal-function-sent",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-numeric-separator",
    "@babel/plugin-proposal-throw-expressions",

    // Stage 3
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-import-meta",
    ["@babel/plugin-proposal-class-properties", { "loose": false }],
    "@babel/plugin-proposal-json-strings"
  ]
}
```

## @babel/polyfill

#### 介绍

文档：https://babeljs.io/docs/en/next/babel-polyfill.html

>  官网信息：从 Babel 7.4.0 开始，这个包已经被废弃了，以支持直接导入 `core-js/stable`（polyfill ECMAScript 特性）和 `regenerator-runtime/runtime`（需要使用转换后的 generator 函数）

babel-polyfill 的存在意义是给浏览器“打补丁”，比如浏览器没有 `Object.assign` 这个特性，它会针对这个环境创建这个特性。Babel 自身是只转换语法，不添加丢失的特性，polyfill 的存在就是弥补浏览器这部分缺失的特性（比如某些 ie）。

babel-polyfill 等同于 `regenerator runtime` + `core-js`。

* regenerator：提供对 generator 支持，如果应用代码中用到generator、async函数的话。
* core-js：提供 es 新的特性。

最新版的具体用法，见 `@babel/preset-env` 的 `useBuiltIns` 特性。

经过我的简单实验，其实可以不用专门安装这个包，而且新的 corejs v3 和 corejs v2 还不太一样（令人困惑）。使用 useBuiltIns` 就好。

#### 副作用

引入 babel-polyfill 也会有一定副作用，比如：

* 引入了新的全局对象，比如Promise、WeakMap等。
* 修改现有的全局对象：比如修改了Array、String的原型链等。

在应用开发中，上述行为问题不大，基本可控。但如果在库、工具的开发中引入 babel-polyfill，则会带来潜在的问题。

举个例子，在项目中定义了跟规范不一致的Array.from()函数，同时引入了一个库（依赖 babel-polyfill），此时，这个库可能覆盖了自定义的Array.from()函数，导致出错。

这就是 babel-runtime 存在的原因。它将开发者依赖的全局内置对象等，抽取成单独的模块，并通过模块导入的方式引入，避免了对全局作用域的修改（污染）。

因此，如果是开发库、工具，可以考虑使用 babel-runtime。

## @babel/runtime

#### 介绍

`@babel/runtime` 是一个包含 Babel modular runtime helpers 和 一系列 regenerator-runtime 的库。

文档：https://babeljs.io/docs/en/babel-runtime

#### 使用场景

babel-runtime 一般用于两种场景：

* 开发库/工具
* 移除冗余工具函数(helper function)。

与 babel-polyfill 的区别在于：

* babel-polyfill 会修改（覆盖）实例方法，这在业务层很有用，但某些场景，比如引用外在的技术库，不希望这里的的 polyfill 覆盖业务代码中的方法。
* babel-runtime 不会修改实例方法，它只是引入一些 helper 函数，创造对应的方法。

使用 babel-runtime 一般会搭配 babel-plugin-transform-runtime 使用。babel-plugin-transform-runtime 用于构建过程的代码转换，而 babel-runtime 是实际导入项目代码的功能模块。

## @babel/plugin-transform-runtime

#### 介绍

文档：https://babeljs.io/docs/en/babel-plugin-transform-runtime

babel 在每个需要的文件的顶部都会插入一些 helpers 内联代码，这可能会导致多个文件都会有重复的 helpers 代码。`@babel/plugin-transform-runtime` 的 helpers 选项就可以把这些模块抽离出来。

`@babel/plugin-transform-runtime` 主要做了三件事情：core-js aliasing、helper aliasing、egenerator aliasing。

* core-js aliasing：自动导入babel-runtime/core-js，并将全局静态方法、全局内置对象 映射到对应的模块。

* helper aliasing：将内联的工具函数移除，改成通过babel-runtime/helpers模块进行导入，比如_classCallCheck工具函数。

* regenerator aliasing：如果你使用了 async/generator 函数，则自动导入 babel-runtime/regenerator模块。

#### Demo

```js
module.exports = {
    "plugins": [
        [
            "@babel/plugin-transform-runtime",
            {
                "corejs": false, // boolean 或者 number, 默认 false，指定是否需要 runtime 的 corejs aliasing，如果使用 env 的 useBuiltIns + polyfill，使用 false。
                "helpers": true, // boolean, 默认 true，指定是否内联 babel 的 helper 代码 (比如 classCallCheck, extends) 
                "regenerator": false, // 通过 preset-env 已经使用了全局的 regeneratorRuntime, 不再需要 transform-runtime 提供的 不污染全局的 regeneratorRuntime
                "useESModules": true, // boolean, 默认 false，使用 es modules helpers, 减少 commonJS 语法代码
                "absoluteRuntime": false // boolean, 默认 false，是否目录引用 runtime 包（有些项目会引用当前项目之外的代码，编译时会找不到 runtime 包）
            }
        ]
    ]
}
```

添加新配置前编译出来的代码

```js
import "core-js/modules/es6.promise";
import "regenerator-runtime/runtime";

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
```

添加新配置后编译出来的代码

```js
import "core-js/modules/es6.promise";
import "regenerator-runtime/runtime";
import _asyncToGenerator from "@babel/runtime/helpers/esm/asyncToGenerator";
```

## babel-register

`babel-register` 则提供了动态编译。换句话说，我们的源代码能够真正运行在生产环境下，不需要 babel 编译这一环节。

我们先在项目下安装 `babel-register`：

```sh
$ npm install --save-dev @babel/register
```

然后在入口文件中 `require`：

```sh
require('@babel/register')
require('./app')
```

在入口文件头部引入 `@babel/register` 后，我们的 app 文件中即可使用任意 es2015 的特性。

当然，坏处是动态编译，导致程序在速度、性能上有所损耗。所以这一项基本不用在正式的生产环境中使用。

## babel-node

上面所说，`babel-register` 提供动态编译，能够让我们的源代码真正运行在生产环境下 - 但其实不然，我们仍需要做部分调整，比如新增一个入口文件，并在该文件中 `require('@babel/register')`。而 babel-node 能真正做到一行源代码都不需要调整：

```sh
$ npm install --save-dev @babel/core @babel/node
$ npx babel-node app.js
```

只是，请不要在生产环境中使用 babel-node，因为它是动态编译源代码，应用启动速度非常慢。

## 一份可用的配置

#### 安装对应的包

依赖：

* `@babel/core`（核心包）
* `@babel/preset-env`（预设）
* `@babel/polyfill`（v7.4.0似乎被废弃，可以不用安装）
* `core-js`（最新版本v3，在配置版本corejs:3的情况下，这个包是用于替代 polyfill 的）
* `@babel/runtime`（开发业务代码基本只用到helper配置，开发技术库可以深入使用）
* `@babel/plugin-transform-runtime`（合并重复的 helper 函数）
* `@babel/plugin-proposal-function-bind`（没有 stage-x 后，需要安装单独的插件，支持对应的 proposal 特性）

> 注意：这里 `@babel/polyfill` 可装可不装，不装似乎也不影响没有影响，但不确定正式允运行的时候会不会报错。看了下源码，其实很简单，就是引用到 core-js v2 的特性。官方文档介绍已经被废弃了。

#### babel.config.js

```js
const presets = [
    [
      "@babel/env",
      {
        targets: {
          edge: "17",
          firefox: "60",
          chrome: "67",
          safari: "11.1",
          ie: '8'
        },
        useBuiltIns: 'usage',
        // Babel7 需要指定引入corejs的版本，最好使用3
        corejs: 3,
        modules: 'amd', // 需要转换成什么样的模块系统
      },
    ],
  ];
  
const plugins = [
    // 帮助减少 helper 函数
    [
      "@babel/plugin-transform-runtime",
      {
          "corejs": false, // 默认值，可以不写
          "helpers": true, // 默认，可以不写
          "regenerator": false, // 通过 preset-env 已经使用了全局的 regeneratorRuntime, 不再需要 transform-runtime 提供的 不污染全局的 regeneratorRuntime
          "useESModules": true, // 使用 es modules helpers, 减少 commonJS 语法代码
      }
    ],
    // 由于没有了 stage-x，需要单独导入需要的插件
    [
        '@babel/plugin-proposal-function-bind'
    ]
]
module.exports = { presets, plugins };
```

## 参考

#### Babel 的使用

- https://juejin.im/post/5c03a4d0f265da615e053612
- https://github.com/Weiyu-Chen/blog/issues/4
- https://blog.zfanw.com/babel-js/
- https://juejin.im/entry/5b108f4c6fb9a01e5868ba3d

#### Babel 的配置信息

- http://2ality.com/2015/12/babel6-loose-mode.html
