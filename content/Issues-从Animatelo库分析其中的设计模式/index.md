---
title: Issue-从Animatelo库分析其中的设计模式
date: 2017-04-07 23:48:14
categories: Issues
---

学习高程的函数表达式这章时，有一部分是关于私有变量和模块模式的部分，其实就是因为JS中没有私有变量和块级作用域这些个概念，导致只能通过一些技术手段来模拟，使用立即执行函数表达式IIFE可做到。

模式如下
```js
(function(){
  //private prop and methods
})()
```

模块化的设计是为了开发大型应用，不必在全局环境中添加过多的属性和函数，便于每个人开发各自的部分，且暴露相应的变量和函数。注意，这个和面向对象的概念有区别。模块化是分而治之，面向对象是封装相应的属性和功能以完成功能和复用。

模块化设计中，我找到了一个简洁完备的JS库作为学习资源，查看别人是怎么开发的。这个库叫Animatelo，是Animate.css的JS版，使用web animate api技术。

好，先fork仓库，下载下来，它的源码在**./src**文件夹里，一个顶层文件`animatelo.js`，和一系列特效文件。`animatelo.js`源码很简单，一百多行，主要是配置一些选择函数和默认option。贴上源码：

```js
/*! Animatelo | The MIT License (MIT) | Copyright (c) 2017 GibboK */
; (function (animatelo) {
    'use strict';
    animatelo.version = '1.0.1';
    //私有方法
    var _defaultOptions = {
        duration: 10000,
        delay: 0,
        iterations: 1,
        direction: 'normal',
        fill: 'both'
    },
    //生成UUID，我的理解是对于每个元素有一个唯一编号吧，但这个意义在哪呢？
        _UUID = function () {
            var d = new Date().getTime(),
                uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
            return uuid;
        },
        //选择DOM元素
        _select = function (selector) {
            var nodeList,
                isNodeList = selector instanceof NodeList,
                isNode = selector instanceof Node,
                isHTMLCollection = selector instanceof HTMLCollection,
                isString = typeof selector === 'string';
            if (isNodeList) {
                nodeList = selector;
            } else if (isNode) {
                nodeList = [selector];
            } else if(isHTMLCollection){
                nodeList = selector;
            } else if (isString) {
                nodeList = document.querySelectorAll(selector)
            } else {
                throw 'selector is invaid';
            }
            return nodeList;
        },
        //验证参数是否有效
        _validate = function (options) {
            var directionValid = [
                'normal',
                'reverse',
                'alternate',
                'alternate-reverse',
                'initial'
            ],
                fillValid = [
                    'none',
                    'forwards',
                    'backwards',
                    'both',
                    'initial'
                ];
            if (typeof options.duration !== 'number') {
                throw 'parameter duration is invalid';
            }
            if (typeof options.delay !== 'number') {
                throw 'parameter delay is invalid';
            }
            if (typeof options.iterations !== 'number') {
                throw 'parameter iterations is invalid';
            }

            if (typeof options.direction !== 'string' ||
                directionValid.indexOf(options.direction) === -1) {
                throw 'parameter direction is invalid';
            }
            if (typeof options.fill !== 'string' ||
                directionValid.indexOf(options.direction) === -1) {
                throw 'parameter fill is invalid';
            }
        };
        //核心方法，被置于animatelo对象上
    animatelo._animate = function (selector, keyframes, optionsArg) {
        var options = {
            duration: optionsArg && 'duration' in optionsArg ? optionsArg.duration : _defaultOptions.duration,
            delay: optionsArg && 'delay' in optionsArg ? optionsArg.delay : _defaultOptions.delay,
            iterations: optionsArg && 'iterations' in optionsArg ? optionsArg.iterations : _defaultOptions.iterations,
            direction: optionsArg && 'direction' in optionsArg ? optionsArg.direction : _defaultOptions.direction,
            fill: optionsArg && 'fill' in optionsArg ? optionsArg.fill : _defaultOptions.fill,
            id: optionsArg && 'id' in optionsArg ? optionsArg.id : _UUID()
        },
            hasUserId = optionsArg && 'id' in optionsArg ? true : false,
            nodeList = _select(selector),
            players = [],
            nodeListArr = [].slice.call(nodeList);//解析出node节点，返回一个数组
        _validate(options);
        nodeListArr.forEach(function (node, index) {
            var player = node.animate(keyframes, options);
            if (hasUserId) {
                player.id = options.id + '-' + index;
            } else {
                player.id = _UUID();
            }
            players.push(player);
        });
        return players;
    };

})(window.animatelo = window.animatelo || {});//全局定义一个animatelo对象

```

可以看到，`_UUID()`和`_select()`和`_defaultOptions`是私有的，而animatelo对象是不加`var`，是要暴露在window对象中的，入口的`window.animatelo = window.animatelo || {}`参数也是说明这一点，这样当引用这一函数库是，直接使用全局对象了，Jquery也是这个思路。

`_animate()`是添加在animatelo对象上的，是供其他特效模块使用，它的参数是`selector`, `keyframes`, `optionsArg`。好，我们再来分析下一个特效函数的源码，以`zoomIn.js`为例：

```js
/*! Animatelo | The MIT License (MIT) | Copyright (c) 2017 GibboK */
; (function (animatelo) {
    console.log(2);
    'use strict';
    animatelo.zoomIn = function (selector, options) {
        var keyframeset = [
            {
                opacity: 0,
                transform: 'scale3d(.3, .3, .3)',
                offset: 0
            },
            {
                opacity: 1,
                transform: 'none',
                offset: 0.5
            },
            {
                opacity: 1,
                transform: 'none',
                offset: 1
            }
        ];
        return animatelo._animate(selector, keyframeset, options);
    }
})(window.animatelo = window.animatelo || {});

```

看，是不是很简单！，一个IIFE的参数是`window.animatelo = window.animatelo || {}`，就是全局对象中的animatelo，在里面，给这个对象添加上zoomIn方法，参数为`selector`, `options`，这是对外暴露的api，在这个函数里面，一个`keyframeset`是实现动效的对象，之后return一个`animatelo._animate(selector, keyframeset, options)`，调用的是顶层的功能函数，这样，无论是什么特效，只要按这种思路来，分而治之，一个有趣的函数库就能搭建起来。使用的时候，是这样的，我单独用源码实验了下：

```html
<body>
  <div id="hello">
   hello
  </div>
  <script src="./src/animatelo.js"></script>
  <script src="./src/zoomingExits/zoomOut.js"></script>
  <script src="./src/zoomingEntrances/zoomIn.js"></script>
  <script>
     window.animatelo.zoomIn('#hello');
  </script>
</body>
```

看！windows对象中的animatelo对象暴露出zoomIn方法，直接传入选择器参数，简洁明了。以前会用，现在也算知道怎么设计了。：）