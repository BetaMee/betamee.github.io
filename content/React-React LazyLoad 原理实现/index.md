---
title: React LazyLoad 原理实现
date: 2021-05-24 22:49:41
category: React
tags: React
openreward: true
uninqueid: ebe26fc89d35543dbefdcddb4104701e
---

## 目录

<!-- toc -->

- [前言](#前言)
- [用法](#用法)
- [思路的实现](#思路的实现)
- [实践中的使用](#实践中的使用)
- [参考](#参考)

<!-- tocstop -->

## 前言

前端组件的滚动懒加载是一个很有用的功能。这里的懒加载概念不是路由分割拆包那种，那是以文件资源为单位进行拆分，一般需要 Webpack 支持，常用的有 @loadable/component 这样的第三方库。

本文讲解的 Lazy Load 是面向页面组件级别的，是为了解决这类问题：

+ 列表渲染：长列表渲染，一次性加载带来性能问题。
+ 图片渲染：很多图片并不在视口范围之内，需要在进到视口时才加载

这种**滚动到视口范围内才进行加载**的思路，某些场景可以极大的提高页面性能，特别是对长列表和图片，可以提高首屏加载速度，避免过度渲染。

当然，这种思路在很早以前的 jQuery 时代就有了。本文讲解 React 社区的 [React Lazy Load](https://github.com/twobin/react-lazyload) 库的实现思路，以供参考。

## 用法

React Lazy Load 用法很简单，只要包裹一下你需要懒加载的组件，这样它只会在视口中 render：

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import LazyLoad from 'react-lazyload';
import MyComponent from './MyComponent';

const App = () => {
  return (
    <div className="list">
      <LazyLoad height={200}>
        <img src="tiger.jpg" /> /*
                                  Lazy loading images is supported out of box,
                                  no extra config needed, set `height` for better
                                  experience
                                 */
      </LazyLoad>
      <LazyLoad height={200} once >
                                /* Once this component is loaded, LazyLoad will
                                 not care about it anymore, set this to `true`
                                 if you're concerned about improving performance */
        <MyComponent />
      </LazyLoad>
      <LazyLoad height={200} offset={100}>
                              /* This component will be loaded when it's top
                                 edge is 100px from viewport. It's useful to
                                 make user ignorant about lazy load effect. */
        <MyComponent />
      </LazyLoad>
      <LazyLoad>
        <MyComponent />
      </LazyLoad>
    </div>
  );
};

ReactDOM.render(<App />, document.body);
```

## 思路的实现

React Lazy Load 本身就是一个 React 组件，参考它的源码，我们来捋一下它的思路：

```jsx
import React from 'react'

const listeners = []
let finalLazyLoadHandler = null

function lazyLoadHandler() {
    // 对每一个组件进行监听
    for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i]
        checkVisible(listener)
    }
}

function checkVisible(component) {
    let visible = false
    // 对 component 是否出现在视口里进行判断
    // 可以利用 component.ref 来检测

    // 如果可见了，则更新
    if (visible) {
        component.visible = true
        component.forceUpdate()
    }
}

class LazyLoad extends React.Component {
    constructor(props) {
        this.visible = false
        this.ref = React.createRef()
    }
    componentDidMount() {
        // 设立滚动元素
        const scrollport = window
        // 确定滚动事件，使用 debounce 来优化性能
        if (!finalLazyLoadHandler) {
            finalLazyLoadHandler = debounce(lazyLoadHandler)
        }
        // 绑定滚动事件，只在 listeners 为空的时候绑定
        if (listeners.length === 0) {
            on(scrollport, 'scroll', finalLazyLoadHandler, passiveEvent)
            on(scrollport, 'resize', finalLazyLoadHandler, passiveEvent)
        }
        // 放入 listener 监听器中
        listeners.push(this)
        // 检查是否可见
        checkVisible(this);
    }
    componentWillUnmount() {
        // 卸载组件和事件
        const index = listeners.indexOf(this)
        if (index !== -1) {
            listeners.splice(index, 1)
        }

        if (listeners.length === 0) {
            off(window, 'scroll', finalLazyLoadHandler, passiveEvent)
            off(window, 'resize', finalLazyLoadHandler, passiveEvent)
        }
    }
    render() {
        const {
            visible,
            placeholder,
            height,
            children
        } = this.props;
        return (
            <div ref={this.ref} className="lazyload-wrapper">
                {
                    visible
                    ? children
                    : (
                        placeholder
                        ? placeholder
                        : <div className="placeholder" style={{height: height}}></div>
                    )
                }
            </div>
        );
    }
}
```

这是实现的“伪代码”，它的流程是这样的：

+ 设立一个 visible 变量，初始值为 false
+ 在 componentDidMount 阶段
  + 监听 scroll 和 resize 事件
  + 将当前组件放在 listeners 中
  + checkVisible 确定当前组件是否可见
    + true: 可见，则 forceUpdate 当前组件
    + false: 不可见，保持现状
+ 然后滚动的时候，不停地调用 lazyLoadHandler
  + 对 listeners 所有的组件进行 checkVisible 检查
  + 如果可见，则渲染，不可见，则不渲染

至于如何判断当前组件是否“可见”，涉及到利用 React ref 和 DOM 结构的判定，可以参考[checkNormalVisible](https://github.com/twobin/react-lazyload/blob/055405125d0313014f0951cffc78345297f10a08/src/index.jsx#L114)，这里就不啰嗦了。

## 实践中的使用

在项目中，我们可以结合 @loadable/component 来使用：

```jsx
import React from 'react'
import loadable from '@loadable/component'
import LazyLoad from 'react-lazyload'

const LazyComponent = loadable(() => import(/* webpackChunkName: 'Component' */ './Component'))

class App extends React.Component {
  render() {
    <LazyLoad>
        <LazyComponent />
    </LazyLoad>
  }
}
```

组件懒加载和资源懒加载的优势相结合，可以将页面性能优化到极致。

## 参考

+ [GitHub - twobin/react-lazyload: Lazy load your component, image or anything matters the performance.](https://github.com/twobin/react-lazyload)
