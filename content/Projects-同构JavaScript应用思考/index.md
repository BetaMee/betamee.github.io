---
title: 同构JavaScript应用思考
date: 2017-02-17 00:53:26
categories: ProjectsLogs
---
这两天接触最多的思考的是同构JavaScript，"Universal JavaScript application"。所谓的同构，就是前后端复用一套代码。初始化的时候在服务端渲染好页面和数据，发送到客户端，后期客户端获取数据渲染，并且是无刷新的SPA单页应用。

这样解决了以下的问题：
1. 首屏渲染问题。如果前后端彻底分离，后端只是个发送数据的接口，而初始状态下js文件的加载和获取数据都在客户端上完成，带来的问题是初始加载速度慢，影响性能。
2. 

以React技术栈为主，需要学习React构件界面，React-Router管理路由状态，React-Redux管理state，Immuntable.js优化React数据运算性能，Webpack进行打包，Express作后端框架。

困惑：

1. 如何合理的设计state，来运用redux管理应用的状态
2. 如何合理的管理路由状态，达到前后端一致
3. 前后端数据的交流方式
4. 服务端渲染的过程

