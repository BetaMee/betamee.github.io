---
title: JavaScript 设计模式总结（六）
date: 2020-03-08 14:03:35
category: WebFrontEnd
tags: JS_Deep 设计模式 读书笔记
openreward: true
---

## 目录

<!-- toc -->

- [架构型设计模式](#架构型设计模式)
  * [1. 同步模块模式（Synchronous Module Definition）](#1-同步模块模式（Synchronous-Module-Definition）)
  * [2. 异步模块模式（Asynchronous Module Definition）](#2-异步模块模式（Asynchronous-Module-Definition）)
  * [3. Widget 模式](#3-Widget-模式)
  * [4. MVC 模式](#4-MVC-模式)
  * [5. MVP 模式](#5-MVP-模式)
  * [6. MVVM 模式](#6-MVVM-模式)

<!-- tocstop -->

## 架构型设计模式

架构型设计模式是一类框架结构，通过提供一些子系统，指定它们的职责，并将它们条理清晰地组织在一起。

### 1. 同步模块模式（Synchronous Module Definition）

同步模块模式：请求发出后，无论模块是否存在，立即执行后续的逻辑，实现模块开发中对模块的立即引用。

```js
// 定义模块化管理工具
const F = F || {}

F.define = function(str, fn) {
    // 解析路由模块
    let parts = str.split('.')
    let old = this
    let parent = this
    // 如果第一个模式是模块管理器单体对象，则移除
    if (parts[0] === 'F') {
        parts = parts.slice(1)
    }
    //  屏蔽对 define 与 module 模块方法的重写
    if (parts[0] === 'define' || parts[0] === 'module') {
        return
    }
    // 遍历路由模块并定义每层模块
    for (let i = 0; i < parts.length; i++) {
        // 如果父元素中不存在当前模块
        if (typeof parent[parts[i]] === 'undefined') {
            parent[parts[i]] = {} // 声明当前模块
        }
        // 缓存下一层级的祖父模块
        old = parent
        // 缓存下一层级父模块
        parent = parent[parts[i]]
    }
    // 如果给定模块方法则定义该模块方法
    if (fn) {
        old[parts[parts.length - 1]] = fn()
    }
    // 返回单体对象
    return this
}

// 使用
// F.string: {}
F.define('string', function() {
    // 接口方法
    return {
        trim(str) {
            // ...
        }
    }
})

// F.dom.format: () => {}
F.define('dom.format', function() {
    // 接口方法
    return function () {
        // ...
    }
})


// 模块调用方法
F.module = function(...args) {
    // 获取回调执行函数
    const callback = args.pop()
    // 获取依赖模块
    const parts = args[0] && args[0] instanceof Array ? args[0] : args
    // 依赖模块列表
    const modules = []
    // 模块路由
    let modIDs= []

    let i = 0
    let parent
    // 遍历依赖模块
    while(i < parts.length) {
        if (typeof parts[i] === 'string') {
            // 设置当前模块父对象 F
            parent = this
            // 解析模块路由，并屏蔽掉父对象
            modIDs = parts[i].replace(/^F\./, '').split('.')
            // 遍历模块层级
            for (j = 0; j < modIDs.length; j ++) {
                // 重置父模块
                parent = parent[modIDs[j]] || false
            }
            // 将模块添加到依赖模块列表中
            modules.push(parent)
        } else {
            // 如果是模块对象，直接添加到依赖
            modules.push(parts[i])
        }
        // 取下一个模块
        i ++
    }
    // 执行回调函数
    callback.apply(null, modules)
}

// 使用
F.module(['dom', 'document'], function(dom, doc) {
    // ....
})

F.module('dom', 'string.trim', function(dom, trim) {
    // ....
})
```

### 2. 异步模块模式（Asynchronous Module Definition）

异步调用模块：请求发出后，继续其他业务逻辑，知道模块加载完成执行后续的逻辑，实现模块开发中对模块加载完成后的引用。

```js
(function(F) {
    const moduleCache = {}

    const getUrl = function(moduleName) {
        // 'lib/ajax' => lib/ajax.js
        return String(moduleName).replace(/\.js$/g, '') + '.js'
    }

    const loadScript = function(src) {
        const _script = document.createElement('script')
        _script.type = 'text/JavaScript'
        _script.charset = 'utf-8'
        _script.async = true
        _script.src = src
        document.getElementsByTagName('head')[0].appendChild(_script )
    }

    const setModule = function(moduleName, params, callback) {
        let _module
        let fn
        if (moduleCache[moduleName]) {
            _module = moduleCache[moduleName]
            _module.status = 'loaded'
            _module.exports = callback ? callback.apply(_module, params): null

            while(fn = _module.onload.shift()) {
                fn(_module.exports)
            }
        } else {
            // 模块不存在（匿名函数），直接执行
            callback && callback.apply(null, params)
        }
    }
    const loadModule = function(moduleName, callback) {
        // 依赖模块
        let _module
        // 如果依赖模块被加载过
        if (moduleCache[moduleName]) {
            _module = moduleCache[moduleName]

            if (_module.status === 'loaded') {
                setTimeout(callback(_module.exports), 0)
            } else {
                _module.onload.push(callback)
            }
        } else {
            // 模块第一次被使用
            moduleCache[moduleName] = {
                moduleName: moduleName, // 模块id
                status: 'loading', // 模块状态
                exports: null, // 模块接口
                onload: [callback] // 回调函数
            }
            // 加载模块对应的文件
            loadScript(getUrl(moduleName))
        }
    }

    F.module = function(...args) {
        const callback = args.pop() // 这里已经移除了callbcak
        const deps = (args.length && args[args.length - 1] instanceof Array) ? args.pop() : []
        const url = args.length ? args.pop() : null

        // 依赖模块序列
        const params = []
        // 未加载的依赖模块数量统计
        let depsCount = 0
        let i = 0
        if (deps.length) {
            // 遍历依赖模块
            while(i < deps.length) {
                // 闭包保存 i
                (function(i) {
                    depsCount ++
                    loadModule(deps[i], function(mod) {
                        params[i] = mod
                        // 依赖模块加载完成，统计减一
                        depsCount --
                        // 如果依赖模块全部加载完成
                        if (depsCount === 0) {
                            // 在模块缓存器中校正该模块，并执行构造函数
                            setModule(url, params, callback)
                        }
                    })
                })(i)
            }
        } else {
            setModule(url, [], callback)
        }
    }
})(function() {
    return window.F = {}
}())


// 定义
F.module('lib/dom', function() {
    return {
        g() {},
        html() {}
    }
})

 // 定义
F.module('lib/event', ['lib/dom'], function() {
    return {
        on() {}
    }
})

//  在 index.html 页面中
F.module(['lib/dom','lib/event'] function(dom, events) {
    // ...
})
```

### 3. Widget 模式

略

### 4. MVC 模式

MVC 即模型（Model）、视图（View）、控制器（Controller），用一种将业务逻辑、数据、视图分离的方式组织架构代码。

```js
const MVC = {}

// 数据模型层
MVC.model = (function() {
    // 内部数据对象
    const M = {}
    // 服务端获取的数据源，这里为了简化，直接作同步数据源
    M.data = {}
    // 配置数据
    M.conf = {}
    // 返回操作方法
    return {
        // 获取服务端方法
        getData(m) {
            return M.data[m]
        },
        // 获取配置方法
        getConf(c) {
            return M.conf[c]
        },
        // 更新服务端数据
        setData(m, v) {
            M.data[m] = v
            return this
        },
        // 更新配置信息
        setConf(c, v) {
            M.conf[c] = v
            return this
        }
    }
})()
// 视图层
MVC.view = (function() {
    // 引用数据层方法
    const M = MVC.model
    // 内部视图创建对象
    const V = {}

    return function(v) {
        V[v]()
    }
})()
// 控制层
MVC.ctrl = (function() {
    // 引用数据层
    const M = MVC.model
    // 引用视图层
    const V = MVC.view
    // 控制器创建方法
    const C = {}
})()
```

### 5. MVP 模式

MVP 模型即模型（Model）、视图（View）、管理器（Presenter），View 层不直接引用 Model 层内的数据，而是通过 Presenter 层实现对 Model 层内的数据访问。即所有层次的交互都发生在 Presenter 层中。

```js
const MVC = {}

// 数据模型层
MVC.model = (function() {
    // 内部数据对象
    const M = {}
    // 服务端获取的数据源，这里为了简化，直接作同步数据源
    M.data = {}
    // 配置数据
    M.conf = {}
    // 返回操作方法
    return {
        // 获取服务端方法
        getData(m) {
            return M.data[m]
        },
        // 获取配置方法
        getConf(c) {
            return M.conf[c]
        },
        // 更新服务端数据
        setData(m, v) {
            M.data[m] = v
            return this
        },
        // 更新配置信息
        setConf(c, v) {
            M.conf[c] = v
            return this
        }
    }
})()
// 视图层
MVC.view = (function() {
    return function(str) {
        // 将参数字符串转换成期望模版
        return html
    }
})()
// 控制层
MVC.presenter = (function() {
    // 引用数据层
    const M = MVC.model
    // 引用视图层
    const V = MVC.view
    // 控制器创建方法
    const C = {}

    return {
        init() {
            for(let i in C) {
                C[i] && C[i](M, V, i)
            }
        }
    }
})()

MVC.init = function() {
    this.presenter.init()
}

// 使用
window.onload = function() {
    MVC.init()
}
```

### 6. MVVM 模式

MVVM 模式：模型（Model）、视图（View）、视图模型（ViewModel），为视图层（View）量身定做一套视图模型（ViewModel），并在视图模型（ViewModel）中创建属性和方法，为视图层（View）绑定数据（Model）并实现交互。

```js
// 略
```
