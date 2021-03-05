---
title: 语义版本知识
date: 2019-09-24 14:52:29
category: WebFrontEnd
tags: Web_Deep 工程化 npm
openreward: true
uninqueid: 6563f9a389ca5c81b8c8baa2cc58680d
---

## 目录

<!-- toc -->

- [1. 引言](#1-引言)
- [2. 版本的划分](#2-版本的划分)
- [3. 先行版本](#3-先行版本)
- [4. 版本发布准则](#4-版本发布准则)
- [5. 版本前缀](#5-版本前缀)
- [参考](#参考)

<!-- tocstop -->


## 1. 引言

软件开发中，为了合理地管理软件版本，我们需要一定的约束，以避免软件版本的“依赖地狱”问题。为此 Github 起草了一个具有指导意义的，统一的版本号表示规则，称为 Semantic Versioning(语义化版本表示)。该规则规定了版本号如何表示，如何增加，如何进行比较，不同的版本号意味着什么。

## 2. 版本的划分

该规则指定了一个软件版本的基本格式：`major.minor.patch`:

* 主版本号(major)：当你做了不兼容的 API 修改
* 次版本号(minor)：当你做了向下兼容的功能性新增，可以理解为Feature版本
* 修订号(patch)：当你做了向下兼容的问题修正，可以理解为Bug fix版本

先行版本号及版本编译信息可以加到“主版本号.次版本号.修订号”的后面，作为延伸。

## 3. 先行版本

有些软件在正式发布前会有一些先行测试版，这个时候可以在版本后缀加上特定的修饰，主要有三种：`alpha`、`beta`、`rc`，完整格式：`major.minor.patch-alpha`。其具体的含义：

* alpha: 内部版本
* beta: 公测版本
* rc: 即Release candiate，正式版本的候选版本

也可以在修饰版本后加上数字后缀，表示先行版的继续划分：`major.minor.patch-alpha.0`、`major.minor.patch-rc.1`。

## 4. 版本发布准则

* 版本发布必须以`major.minor.patch`格式，并且每一位数字不能为负，也不能在数字前方补零，并且版本号也是递增的。
* 某个软件版本发行后，任何修改都必须以新版本发行。
* `1.0.0` 为界定的公共版本，之前的版本如 `0.x.x` 为开发版，升级到 `1.x.x` 及以上则表示软件版本正式推出可用，开发者需要对此负责。
* 在比较不同的版本号时，必须把版本依序拆分为主版本号、次版本号、修订号及先行版本号后进行比较。

## 5. 版本前缀

前面提到的是关于 Semantic Versioning 的规则知识，这里补充一个知识点，是关于版本前缀的。在使用 npm 的时候，我们经常能看到安装的包长这样：

```json
{
  "name": "betamee.github.io",
  "description": "blog site repo",
  "version": "1.0.2",
  "author": "BetaMee <gongxq95@gmail.com>",
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "dependencies": {
    "gatsby": "~2.15.3",
    "node-sass": "~4.12.0",
    "react": "^16.9.0",
    "react-dom": "^16.9.0",
    "ts-node": "^8.3.0",
    "typescript": "*"
  }
}
```

这里的 `^`、`~`、`*` 的作用是指：

* `~` 会匹配最新的小版本依赖包，比如 `~1.2.3` 会匹配所有 `1.2.x` 版本，但是不包括 `1.3.0`
* `^` 会匹配最新的大版本依赖包，比如 `^1.2.3` 会匹配所有 `1.x.x` 的包，包括 `1.3.0`，但是不包括 `2.0.0`
* `*` 会安装最新版本的依赖包

`^`、`*` 可能会引起版本不兼容，这里需要注意，建议使用`~`来标记版本号。


## 参考

* [Semver(语义化版本号)扫盲 - 掘金](https://juejin.im/post/5ad413ba6fb9a028b5485866)
* [语义化版本 2.0.0 \| Semantic Versioning](https://semver.org/lang/zh-CN/)
