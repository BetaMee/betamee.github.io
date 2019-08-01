---
title: Webpack 4 概述
date: 2019-05-06 10:51:00
category: WebFrontEnd
tags: Web_Basic 工程化 Webpack
---

> 前端的工程化不仅需要 Babel 这样的“语法翻译者”，以抹平不同平台之间的特性差异，还需要可以妥善处理 JavaScript 模块以及各类 HTML、CSS、Image等资源的**构建工具**，Webpack 的出现呼应了这一趋势，极大促进了前端的发展。

## 目录

<!-- toc -->

- [引言](#)
- [与其他构建工具的简单比较](#-1)
    + [Gulp](#Gulp)
    + [Webpack](#Webpack)
- [合理配置](#-2)
- [打包形态](#-3)
- [参考](#-4)

<!-- tocstop -->

## 引言

什么是 Webpack？本质上，Webpack 是一个现代 JavaScript 应用程序的静态模块打包工具。当 Webpack 处理应用程序时，它会在内部构建一个依赖图(dependency graph)，此依赖图会映射项目所需的每个模块，并生成一个或多个 bundle。

## 与其他构建工具的简单比较

什么叫构建工具呢？构建工具是一段自动根据源代码生成可使用文件的程序，构建过程包括打包、编译、压缩、测试等一切需要对源代码进行的相关处理。构建工具的目的是实现构建过程的自动化，使用它可以让咱们避免机械重复的劳动，从而提升效率。

在 Webpack 出现之前，前端社区也出现过很多构建工具，比如流行的 Browserify、Gulp、Grunt，当下也出现了新的工具，如 Rollup。

在这里，简单比较一下 Webpack 和 Gulp 的区别。

#### Gulp

Gulp 是一个任务管理工具，致力于**自动化和优化**工作流。我们在前端开发的过程中，会遇到很多重复性又耗时的工作，比如：

* 用 ES6，TypeScript 编写的脚本文件需要编译成浏览器认识的 JavaScript
* 用 SCSS，LESS 编写的样式文件需要编译成浏览器认识的 css
* 检查代码是否符合书写规范
* 跑单元测试和集成测试
* 开发环境使用 sourceMaps 来调试代码，监听文件变化，自动刷新浏览器
* 生产环境部署代码需要压缩合并静态文件，添加文件 hash 控制缓存
* 清理 dist 文件夹

Glup 基于流（Stream）的工作方式，通过写好的一个个 task 来分解复杂的任务，其优点是简单灵活，搭配插件可以完成常见的前端工作。但缺点在于，不适合复杂的单页应用，并且它无法解决 JS 模块化的问题，没有对于资源进行深度的整合优化（如 tree shaking 之类的技术），这个问题在 Webpack 出现后有了另一种解决思路。

#### Webpack

Webpack 的理念是，一切皆为模块，不管是 ES6 模块、CommonJS 模块，还是 css、fonts、png 等非 JS 资源，只要有依赖关系，就可以构建出它们之间依赖图(dependency graph)，并且通过相应的 Loader 进行精细化的管理。

Webpack 初衷就是“require everything, bundle everything”，刚出来的时候结合着 Gulp 一起配合使用，Gulp 里面有个 gulp-webpack，就是让 Webpack 专门去做 module dependency 的事情, 生成一个 bundle.js 文件，然后再用 gulp 去做一些其他杂七杂八 minify, uglify 的事情。 后来开发者发现 Webpack 有个 plugins 的选项，可以用来进一步处理经过 Loader 生成的 bundle.js，于是社区出现了相应的插件 minify/uglify 之类的插件，可以对 bundle 资源进行进一步细颗粒度的处理，这也进一步取代了 Gulp 的工作。

再后来大家有发现 npm/package.json 里面的 scripts 也很有用，调用任务的时候就直接写一个简单的命令，无需 Gulp 下各种插件的命令。所以现在看到的很多新项目都是 package.json 里面 scripts 命令加上安装 Webpack 一个工具就够了。

Webpack 也不是没有缺点，配置复杂，需要理解的概念很多，上手难度比 Gulp 高上不少，不过这几年的发展下来，Webpack 也在不断地优化，v4 就可以开箱即用。而且 Webpack 已经流行开了，久经考验，社区也默认前端开发人员要有这个配置能力：）。


## 合理配置

首先给出一个比较合适的配置：

适用版本：Webpack 4 +

webpack.config.base.js

```js
const path = require('path');

// 判断环境
const isProduction = process.env.NODE_ENV === 'production';

// 引入配置文件
const config = require('./config');
const alias = require('./alias');

// *入口文件
const entryFileConfig = {};

// *输出文件
const outputFileConfig = {
    path: isProduction ? path.resolve(config.RELEASE_DIR) : path.resolve(config.DEST_DIR),
    filename: '[name].js',
    libraryTarget: 'amd'
    // publicPath: isProduction ? '' : '../static/'
};

module.exports = {
    // 确定脚本模式
    mode: isProduction ? 'production' : 'development',
    // 入口文件
    entry: entryFileConfig,
    // 输出文件
    output: outputFileConfig,
    externals: [],
    resolve: {
        modules: [
            path.resolve('./src'),
            'node_modules'
        ],
        enforceExtension: false,
        extensions: ['.js', '.jsx', '.css', '.scss'],
        alias: alias
    },
    // 打包性能提示（测试环境）
    performance: {
        hints: 'warning',
        maxAssetSize: isProduction ? 500000 : 5000000, // 最大打包字节警告 5000k（测试） 500k（生产）
        maxEntrypointSize: isProduction ? 500000 : 5000000 // 最大入口打包文件 5000k（测试） 500k（生产）
    },
    stats: {
        children: false
    }
};

```

webpack.config.dev.js

```js
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const Terser = require('terser');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// *引入基础的配置
const base = require('./webpack.config.base');

// *引入配置文件
const config = require('./config');

// *定义规则
const rules = [
    { // eslint lint 处理
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
            loader: 'eslint-loader',
            options: {
                emitError: true,
                emitWarning: true
            }
        }
    },
    { // 处理 .js 和 .jsx
        test: /\.jsx?$/,
        exclude: /node_modules/,
        parser: {
            requireJs: false // 禁用 requirejs
        },
        use: 'babel-loader?cacheDirectory'
    },
    { // 处理样式
        test: /\.(scss|css)$/,
        exclude: [
            path.resolve(__dirname, '..', 'node_modules')
        ],
        use: [
            {
                loader: MiniCssExtractPlugin.loader // 生产环境采用此方式解耦CSS文件与js文件
            },
            {
                loader: 'css-loader', // CSS加载器
                options: {
                    modules: true,
                    sourceMap: true,
                    localIdentName: '[name]__[local]___[hash:base64:5]'
                }
            },
            {
                loader: 'postcss-loader'
            },
            {
                loader: 'sass-loader'
            }
        ]
    },
    { // 处理其他文件资源
        test: /\.(png|jpg|jpeg|svg|ttf|eot|woff|woff2)$/,
        use: {
            loader: 'url-loader',
            options: {
                limit: 8192 // 8k
            }
        }
    }
];

// *定义插件
const plugins = [
    // 确定环境
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
    }),
    // 提取样式
    new MiniCssExtractPlugin({
        filename: 'css/[name].min.css'
    }),
    // hot 热加载
    new webpack.HotModuleReplacementPlugin()
];

// *定制化
const optimization = {
    splitChunks: {
        cacheGroups: {
            // 将所有的css组合成一个文件
            styles: {
                name: 'status',
                test: /\.(scss|css)$/,
                chunks: 'all',
                enforce: true,
                priority: 20
            }
        }
    }
};

module.exports = merge(base, {
    // 模块规则
    module: {
        rules: rules
    },
    // source map
    devtool: 'inline-source-map',
    // webpack dev server 配置
    devServer: {
        contentBase: path.resolve(config.DEST_DIR),
        open: false, // 默认打开
        hot: true, // 热加载
        disableHostCheck: true,
        port: 8887, // 端口
        publicPath: '/m/public',
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        stats: {
            children: false,
            chunks: false
        }
    },
    // 插件
    plugins: plugins,
    // 定制化
    optimization: optimization
});

```

webpack.config.pro.js

```js
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const Terser = require('terser');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 引入基础的配置
const base = require('./webpack.config.base');

// 引入配置文件
const config = require('./config');

// *rules 配置
const rules = [
    { // 处理 .js 和 .jsx
        test: /\.jsx?$/,
        exclude: /node_modules/,
        parser: {
            requireJs: false // 禁用 requirejs
        },
        use: 'babel-loader?cacheDirectory'
    },
    { // 处理样式
        test: /\.(scss|css)$/,
        exclude: [
            path.resolve(__dirname, '..', 'node_modules')
        ],
        use: [
            {
                loader: MiniCssExtractPlugin.loader // 生产环境采用此方式解耦CSS文件与js文件
            },
            {
                loader: 'css-loader', // CSS加载器
                options: {
                    modules: true,
                    localIdentName: '[name]__[local]___[hash:base64:5]'
                }
            },
            {
                loader: 'postcss-loader'
            },
            {
                loader: 'sass-loader'
            }
        ]
    },
    { // 处理其他文件资源
        test: /\.(png|jpg|jpeg|svg)$/,
        use: {
            loader: 'url-loader',
            options: {
                limit: 8192 // 8k
            }
        }
    }
];

// *plugin 配置
const plugins = [
    // 确定环境
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
    }),
    // 提取样式
    new MiniCssExtractPlugin({
        filename: 'css/[name].min.css'
    })
    // 分析打包效果
    // new BundleAnalyzerPlugin(
    //     {
    //         analyzerMode: 'server',
    //         analyzerHost: '127.0.0.1',
    //         analyzerPort: 8889,
    //         reportFilename: 'report.html',
    //         defaultSizes: 'parsed',
    //         openAnalyzer: true,
    //         generateStatsFile: false,
    //         statsFilename: 'stats.json',
    //         statsOptions: null,
    //         logLevel: 'info'
    //     }
    // )
];

// *定制化
const optimization = {
    splitChunks: {
        cacheGroups: {
            // 将所有的css组合成一个文件
            styles: {
                name: 'status',
                test: /\.(scss|css)$/,
                chunks: 'all',
                enforce: true,
                priority: 20
            }
        }
    },
    minimizer: [
        // 压缩css
        new OptimizeCssAssetsPlugin({}),
        // 压缩JS
        new TerserPlugin({
            cache: true,
            parallel: true,
            sourceMap: false,
            exclude: /node_modules/,
            terserOptions: {
                output: {
                    comments: false
                }
            }
        })
    ]
};

// *导出配置
module.exports = merge(base, {
    // 模块规则
    module: {
        rules: rules
    },
    // 插件
    plugins: plugins,
    // 定制化
    optimization: optimization
});
```

外加上 babel.config.js

```js
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                modules: false,
                targets: 'Chrome > 70',
                useBuiltIns: 'usage',
                corejs: 3
                // debug: true
            }
        ],
        '@babel/preset-react'
    ],
    plugins: [
        // 减少 babel helper 函数
        [
            '@babel/plugin-transform-runtime',
            {
                'corejs': false, // 默认值，可以不写
                'helpers': true, // 默认，可以不写
                'regenerator': false, // 通过 preset-env 已经使用了全局的 regeneratorRuntime, 不再需要 transform-runtime 提供的 不污染全局的 regeneratorRuntime
                'useESModules': true, // 使用 es modules helpers, 减少 commonJS 语法代码
                'absoluteRuntime': true // 是否跨项目引用 runtime
            }
        ],
        [
            'react-css-modules',
            {
                generateScopedName: '[name]__[local]___[hash:base64:5]',
                filetypes: {
                    '.css': {
                        syntax: 'postcss-scss'
                    },
                    '.scss': {
                        syntax: 'postcss-scss'
                    }
                }
            }
        ],
        [
            '@babel/plugin-proposal-class-properties'
        ],
        [
            '@babel/plugin-proposal-export-default-from'
        ]
    ]
}
```


## 打包形态

通过观察打包生成的源码来看，可以看到 Webpack 对于源码的处理过程：

输入：

index.js

```js
import { Test } from './b'

const testFun = () => {
    console.log(this)
    const test = new Test('fasd')
}
```

b.js

```js
export const Test2 = () => {
    console.log('test2')
}

export class Test {
    constructor(param) {
        this.a = param
    }
    handleSomething = () => {
        console.log('handleSomething')
    }
    render() {
        let a = 'fdsa'
        const b = '89'
        console.log(a + b)
    }
}
```

输出：

```js
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/defineProperty.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _defineProperty; });
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

/***/ }),

/***/ "./src/b.js":
/*!******************!*\
  !*** ./src/b.js ***!
  \******************/
/*! exports provided: Test2, Test */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Test2", function() { return Test2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Test", function() { return Test; });
/* harmony import */ var _Users_gongxiangqian_CtripRepo_demo_webpack_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/defineProperty */ "./node_modules/@babel/runtime/helpers/esm/defineProperty.js");

const Test2 = () => {
  console.log('test2');
};
class Test {
  constructor(param) {
    Object(_Users_gongxiangqian_CtripRepo_demo_webpack_node_modules_babel_runtime_helpers_esm_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "handleSomething", () => {
      console.log('handleSomething');
    });

    this.a = param;
  }

  render() {
    let a = 'fdsa';
    const b = '89';
    console.log(a + b);
  }

}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _b__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./b */ "./src/b.js");


const testFun = () => {
  console.log(undefined);
  const test = new _b__WEBPACK_IMPORTED_MODULE_0__["Test"]('fasd');
};

/***/ })

/******/ });
//# sourceMappingURL=main.js.map
```

可以看作是这样的一个结构：

```js

(function(modules) {
    // webpackBootstrap 代码从这里启动
})({
    "./node_modules/@babel/runtime/helpers/esm/defineProperty.js":
    (function(module, __webpack_exports__, __webpack_require__) {
        // 每个模块的各自源码
    },
    "./src/b.js":
    (function(module, __webpack_exports__, __webpack_require__) {
        // 每个模块的各自源码
    },
    "./src/index.js":
     (function(module, __webpack_exports__, __webpack_require__) {
        // 每个模块的各自源码
    },
})
```

这里，不同的 `devtool` 和 `libraryTarget` 等配置会生成不同形态的打包后的代码，但可以看到 Webpack 并非简单的将模块源码进行揉合在一块，而是分析其依赖关系，重新组织其依赖结果，通过自定义的 `__webpack_exports__` 和 `__webpack_require__` 管理模块化。这篇就不深入探讨其原理了。

## 参考

- [gulp.js - 基于流的自动化构建工具。 \| gulp.js 中文网](https://www.gulpjs.com.cn/)
- [webpack 中文文档(@印记中文) https://docschina.org/](https://webpack.docschina.org/)
- [Gulp和Webpack对比 - 简书](https://www.jianshu.com/p/b1022d224817)
- [Webpack 常用知识点总结 - 个人文章 - SegmentFault 思否](https://segmentfault.com/a/1190000016596781)
- [javascript - gulp和webpack究竟有什么区别？ - SegmentFault 思否](https://segmentfault.com/q/1010000008058766)
- [理解 Gulp 和 Webpack \| 小胡子哥的个人网站](https://www.barretlee.com/blog/2017/04/27/gulp-and-webpack/)
