---
title: JavaScript 设计模式总结（三）
date: 2019-12-08 18:31:26
category: WebFrontEnd
tags: JS_Deep 设计模式 读书笔记
openreward: true
uninqueid: 72617ca14fc456b6827b83dc5d1ccbce
---

## 目录

<!-- toc -->

- [结构型设计模式](#结构型设计模式)
  * [1.外观模式（Facade）](#1外观模式（facade）)
  * [2.适配器模式（Adapter）](#2适配器模式（adapter）)
  * [3.代理模式（Proxy）](#3代理模式（proxy）)
  * [4.装饰者模式（Decorator）](#4装饰者模式（decorator）)
  * [5.桥接模式（Bridge）](#5桥接模式（bridge）)
  * [6.组合模式（Composite）](#6组合模式（composite）)
  * [7.享元模式（Flyweight）](#7享元模式（flyweight）)

<!-- tocstop -->

## 结构型设计模式

结构型设计模式关注于如何将类或者对象组合成更大、更复杂的结构，以简化设计。

### 1.外观模式（Facade）

为一组复杂的子系统接口提供一个更高级的统一接口。通过这个接口使得对于子系统接口的访问更加容易。可以理解为一种**对子系统的封装**，用于兼容，或者统一下层接口。

```js
// 案例一： 用于处理 DOM 事件的兼容
function addEvent(dom, type, fn) {
  if (dom.addEventListener) {
    dom.addEventListener(type, fn, false)
  } else if (dom.attachEvent) {
    dom.attachEvent('on' + type, fn)
  } else {
    dom['on' + type] = fn
  }
}


// 案例二：兼容 IE 的 e.preventDefault() 和 e.target
const getEvent = (event) => {
  // 标准浏览器返回 event， IE 返回 window.event
  return event || window.event
}

const getTarget = (event) => {
  const event = getEvent(event)
  return event.target || event.srcElement
}

const preventDefault = (event) => {
  const event = getEvent(event)
  // 标准浏览器
  if (event.preventDefault) {
    event.preventDefault()
  } else {
    event.returnValue = false
  }
}

// 案例三： 代码库中的封装
const A = {
  g(id) {
    return document.getElementById(id)
  },
  css(id, key, value) {
    document.getElementById(id).style[key] = value
  },
  attr(id, key, value) {
    document.getElementById(id)[key] = value
  },
  html(id, html) {
    document.getElementById(id).innerHTML = html
  },
  on(id, type, fn) {
    document.getElementById(id)['on' + type] = fn
  }
}
```

### 2.适配器模式（Adapter）

将一个类（对象）的接口（方法或者属性）转换成另一个接口，使类（对象）之间的不兼容问题通过适配器得以解决。

```js
// 案例一：适配异类框架，比如 A 框架兼容 JQuery
const A = A || {}
A.g = function(id) {
  return $(id).get(0)
}
A.on = function(id, type, fn) {
  const dom = typeof id === 'string' ? $('#' + id) : $(id)
  dom.on(type, fn)
}
// 案例二：参数适配，常用与参数配置
function doSomthing(obj) {
  const _adapter = {
    name: 'name',
    title: '设计模式',
    age: 24,
    color: 'pink',
    size: 100,
    price: 50
  }
  for (let i in _adapter) {
    _adapter[i] = obj[i] || _adapter[i]
  }
  // ...处理更多
}
// 案例三：服务端数据适配，用于适应接口的变化
const ajaxAdapter = (data) => {
  // ...进行数据格式的转换
}
$.ajax({
  url: '',
  success(data) {
    if (data) {
      return ajaxAdapter(data)
    }
  }
})
```

### 3.代理模式（Proxy）

与直接操作对象相比，代理模式为对象增加一个中间控制器，外部访问控制器来操作对象，而控制器则可以进行条件筛选、执行控制等。

```js
// 案例一：图片预加载
(function(win){
  // 直接加载
  const loadImg = (dom, src) => {
    dom.src = src;
  }
  // 代理为预加载
  const proxyLoadImg = (function(){
    const img = new Image;
    return (dom, src) => {
      loadImg(dom, "loading.gif")
      img.src = src;
      img.onload = () => {
        loadImg(dom, this.src);
      }
    }
  })()
  win.loadImg = loadImg
  win.proxyLoadImg = proxyLoadImg
})(window)
// 示例img 元素
const cnt = document.getElementById("img")
proxyLoadImg(cnt, "http://imageurl")
```

### 4.装饰者模式（Decorator）

在不改变原对象的基础上，通过对其进行包装拓展（添加属性或者方法），使原有对象可以满足用户的更复杂需求。

```js
// 案例一：给输入框添加新的事件
const decorator = (input, fn) => {
  // 获取事件源
  const input = document.getElementById(input);
  // 若事件源已经绑定了事件
  if (typeof input.onclick === 'function') {
    // 缓存原有的事件
    const oldClickFn = input.onclick
    // 定义新的事件
    input.onclick = () => {
      // 原有的函数
      oldClickFn()
      // 新的函数
      fn()
    }
  } else {
    // 未绑定事件时，直接添加fn为新的回调函数
    input.onclick = fn
  }
}
```

### 5.桥接模式（Bridge）

在系统沿着多个维度变化的同时，又不增加其复杂度并已达到解耦。

其最主要的特点是将实现层（比如绑定的事件）和抽象层（如修改页面的逻辑）解耦分离，使得两部分独立变化。由此可以看出，桥接模式是对结构之间的解耦，而前一部分创建型设计模式中抽象工厂模式和创建者模式主要关注点在于创建。

```js
// 案例一: 解耦事件和业务
// 抽象
function changeColor(dom, color, bg) {
  dom.style.color = color
  dom.style.background = bg
}
// 业务
const spans = document.getElementByTagName('span')
spans[0].onmouseover = function() {
  changeColor(this, 'red', '#ddd')
}

// 案例二: 多元化对象
// 多维变量类
// 运动单元
function Speed(x, y) {
  this.x = x
  this.y = y
}
Speed.prototype.run = function() {
  console.log('run')
}
// 着色单元
function Color(cl) {
  this.color = cl
}
Color.prototype.draw = function() {
  console.log('draw')
}

// 创建一个类，可以运动，可以着色
function Ball(x,y,c) {
  // 实现运动单元
  this.speed = new Speed(x, y)
  // 实现着色单元
  this.color = new Color(c)
}
Ball.prototype.init = function() {
  // 实现运动
  this.speed.run()
  // 实现着色
  this.color.draw()
}
```

### 6.组合模式（Composite）

又称整体-部分模式，将对象组合成树形结构以表示“部分整体”的层次结构，组合模式使得用户对单个对象和组合对象的使用具有一致性。

组合模式能够给我们提供一个清晰的组成结构。组合对象类通过继承同一个父类使其具有统一的方法，这样也方便了我们统一管理与使用。这也是一种对数据的分级式处理，清晰而又方便我们对数据的管理与使用。

```js
// 案例一：组合对象的新闻类
// 虚拟父类
const News = function() {
  // 子组件容器
  this.children = []
  // 当前组件元素
  this.element = null
}
New.prototype = {
  init() {
    throw new Error('请重写方法')
  },
  add() {
    throw new Error('请重写方法')
  },
  getElement() {
    throw new Error('请重写方法')
  }
}

// 容器类
const Container = function(id, parent) {
  // 构造函数继承父类
  News.call(this)
  // 模块id
  this.id = id
  // 模块的父容器
  this.parent = parent
  // 构建方法
  this.init()
}
// 寄生式继承父类方法
inheritPrototype(Container, News)
//构建方法
Container.prototype.init = function() {}
// 添加子元素方法
Container.prototype.add = function() {}
// 添加获取当前元素方法
Container.prototype.getElement = function() {}
// 显示方法
Container.prototype.show = function() {}

// Item 类
const Item = function(classname) {
  News.call(this)
  this.classname = classname || ''
  this.init()
}
inheritPrototype(Item,News)
Item.prototype.init = function() {}
Item.prototype.add = function() {}
Item.prototype.getElement = function() {}

const NewsGroup = function(classname) {
  News.call(this)
  this.classname = classname || ''
  this.init()
}
inheritPrototype(NewsGroup, News)
NewsGroup.prototype.init = function() {}
NewsGroup.prototype.add = function() {}
NewsGroup.prototype.getElement = function() {}


// 更加底层的类
const ImageNews = function(url, href, classname) {
  News.call(this)
  this.url = url || ''
  this.href = href || ''
  this.classname = classname || ''
  this.init()
}
inheritPrototype(ImageNews, News)
ImageNews.prototype.init = function() {}
ImageNews.prototype.add = function() {}
ImageNews.prototype.getElement = function() {}

const IconNews = function(url, href, classname) {
  News.call(this)
  this.url = url || ''
  this.href = href || ''
  this.classname = classname || ''
  this.init()
}
inheritPrototype(IconNews, News)
IconNews.prototype.init = function() {}
IconNews.prototype.add = function() {}
IconNews.prototype.getElement = function() {}


// 使用的时候通过 add 方法像一棵树一样一层一层创建新闻
const new1 = new Container('new', document.body)
new1
  .add(
    new Item('normal')
      .add(
        new IconNews('梅西不拿金球也伟大', '#', 'video')
      )
  )
  .add(
    new Item('normal')
      .add(
        new IconNews('保护强国强队用意明显', '#', 'life')
      )
  )
  .add(
    new Item('normal')
      .add(
        new NewsGroup('has-img')
          .add(
            new ImageNews('img/1.jpg', '#', 'small')
          )
          .add(
            new ImageNews('img/2.jpg', '#', 'small')
          )
          .add(
            new ImageNews('img/3.jpg', '#', 'small')
          )
      )
  )
```

### 7.享元模式（Flyweight）

运用共享技术有效地支持大量地细粒度地对象，避免对象间拥有相同内容造成多余地开销。

享元模式地应用目的是为了提高程序地执行效率与系统的性能，因此在大型系统开发中应用广泛，百分之一地效率提成有时可以发生质的变化，它可以避免程序中的数据重复，减少内存消耗。

```js
// 案例一： 通过享元模式，缓存5个 dom 元素，避免大量的dom创建过程
const Flyweight = function() {
  // 已创建的元素
  const created = []
  // 创建一个新闻包装类容器
  function create() {
    const dom = document.createElement('div')
    document.getElementById('container').appendChild(dom)
    create.push(dom)
    return dom
  }
  return {
    // 获取创建新闻元素方法
    getDiv() {
      // 如果已经创建的元素小于当前页元素总个数，则创建
      if (created.length < 5) {
        return create()
      } else {
        // 获取第一个元素，并插入最后面
        const div = created.shift()
        created.push(div)
        return div
      }
    }
  }
}
```
