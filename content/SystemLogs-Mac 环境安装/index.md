---
title: Mac 环境安装
date: 2019-01-06 14:10:00
category: SystemLogs
tags: Config
openreward: false
uninqueid: 5625d128e7c85c16a5e15215ce98d357
---

> 版本： 10.14.2

## 目录

<!-- toc -->

- [1. 安装 node](#1-node)
    + [参考](#)
- [2. 安装 python](#2-python)
    + [使用工具](#-1)
    + [官方链接](#-2)
    + [python 优先级](#python)
    + [安装 pyenv 和 pyenv-virtualenv](#-pyenv-pyenv-virtualenv)
    + [pyenv 常用命令](#pyenv)
  * [pyenv-virtualenv 常用命令](#pyenv-virtualenv)
    + [参考](#-3)
    + [注意](#-4)
- [3. zsh](#3-zsh)
    + [安装 zsh 的参考](#-zsh)
    + [本机安装插件：](#-5)
    + [安装过程](#-6)
- [4.值得付费应用收集](#4)
- [5. 设置Automaker](#5-Automaker)
- [6. 在Finder中开启新建终端](#6-Finder)

<!-- tocstop -->

## 1. 安装 node

一开始使用 HomeBrew 安装，后来是网上说这个在 MacOS v10.14上有问题，就用 curl 安装，见下面的参考文章。

#### 参考

- [解決 nvm is not compatible with the npm config “prefix” option: currently set to “/usr/local” 問題](https://medium.com/@mvpdw06/%E8%A7%A3%E6%B1%BA-nvm-is-not-compatible-with-the-npm-config-prefix-option-currently-set-to-usr-local-%E5%95%8F%E9%A1%8C-cb1f3462ef40)

## 2. 安装 python

#### 使用工具
 - pyenv
 - pyenv-virtualenv

#### 官方链接

- [GitHub - pyenv/pyenv: Simple Python version management](https://github.com/pyenv/pyenv)
- [GitHub - pyenv/pyenv-virtualenv: a pyenv plugin to manage virtualenv (a.k.a. python-virtualenv)](https://github.com/pyenv/pyenv-virtualenv)

#### python 优先级

shell > local > global

#### 安装 pyenv 和 pyenv-virtualenv

`brew install pyenv pyenv-virtualenv`

#### pyenv 常用命令

- 查看系统里的所有的python版本 `pyenv versions`
- 查看当前的python版本： `pyenv version`
- 查看可以下载的python版本： `pyenv install -l`

### pyenv-virtualenv 常用命令

- 设置虚拟环境：`pyenv virtualenv <version> <virtualenv>`
- 列出当前所有的虚拟环境：`pyenv virtualenvs`
- 切换虚拟环境：`pyenv activate <virtualenv>`
- 退出虚拟环境：`pyenv deactivate`
- 删除虚拟环境：`pyenv virtualenv-delete <virtualenv>` or `pyenv uninstall <virtualenv>`

#### 参考

- [Python版本管理：pyenv和pyenv-virtualenv(MAC、Linux)、vi... - 简书](https://www.jianshu.com/p/60f361822a7e)
- [Mac端pycharm平台下pyenv和pyenv-virtualenv管理python版本的安装和简单实用 - lilihan12358的博客 - CSDN博客](https://blog.csdn.net/lilihan12358/article/details/78636742)
- [Mac OS下使用pyenv管理Python版本 - 简书](https://www.jianshu.com/p/2b0b652eaa50)
- [Mac下 Pyenv 的安装使用 - 简书](https://www.jianshu.com/p/cea9259d87df)

#### 注意

所谓的虚拟环境，举个例子来说：pyenv 安装某一个版本环境，但有多个项目都用到这个版本，问题是，这些项目的**第三方依赖**不尽相同，所以呢，为了免除这个冲突，就设置虚拟环境，项目在这个环境下，都是唯一干净的，也维护了全局整体的那个版本的干净。

在使用中呢，我的理解是，比如在一个项目目录中，先生成一个环境：`pyenv virtualenv <version> <virtualenv>`，再使用 `pyenv local <virtualenv>`，这样就在当前目录下有了一个虚拟环境，注意，`pyenv activate <virtualenv>` 虽然也能达到效果，但这是手动激活，一般把 terminal 关了，就又失效了。

## 3. zsh

#### 安装 zsh 的参考

- [最简单 oh-my-zsh mac版基本插件安装-菜鸟实操整理 - 简书](https://www.jianshu.com/p/59a3f1601cfc)
- [oh-my-zsh 安装配置提高 shell 逼格 - 简书](https://www.jianshu.com/p/307668dc5b10)
- [oh-my-zsh小记 - 一个撸代码的 - SegmentFault 思否](https://segmentfault.com/a/1190000004695131)
- [安装zsh命令行自动完成插件](https://www.myfreax.com/the-zsh-command-completes-automatically/)
- [终极终端 zsh+autojump \| Laravel China 社区 - 高品质的 Laravel 和 PHP 开发者社区](https://laravel-china.org/topics/5790/ultimate-terminal-zshautojump)

注：看 [zsh-users · GitHub](https://github.com/zsh-users) 这个组织，很多插件

#### 本机安装插件：

- autojump
- zsh-syntax-highlighting
- zsh-autosuggestion
- zsh-completions

#### 安装过程

zsh的插件安装：进入到 `~/.oh-my-zsh/custom/plugind` 目录中，然后使用git克隆官方地址：

- `git clone https://github.com/zsh-users/zsh-syntax-highlighting.git`

- `git clone https://github.com/zsh-users/zsh-autosuggestions`

- `git clone https://github.com/zsh-users/zsh-completions`

然后配置.zshrc文件:

```sh
plugins=(git autojump zsh-autosuggestions zsh-completions zsh-syntax-highlighting)
autoload -U compinit && compinit #这是zsh-completions需要加的配置
```

至于 autojump，只能通过 brew 安装： `brew install autojump`，

然后添加一行配置：

```sh
# autojump plugin config 2019-1-2
[[ -s $(brew --prefix)/etc/profile.d/autojump.sh ]] && . $(brew --prefix)/etc/profile.d/autojump.sh
```

最后更新下配置 `source ~/.zshrc`。

到此就全部安装完成了。

PS:官网有个 antigen 工具，可以管理 zsh 配置，不过先不折腾了，熟悉好当前的工具再说。。

## 4.值得付费应用收集

- Proxifier (已安装)
- iStats-menu 50元（已购买）
- Alfred 200元
- NewFileMenu 12元（已安装）
- ClearMyMac 99元
- DayOne 订阅制，可考虑168/year

## 5. 设置Automaker

[Mac Finder 显示路径和复制路径 - 简书](https://www.jianshu.com/p/757f9ffc5acf)

## 6. 在Finder中开启新建终端

[在Finder中打开终端 - 简书](https://www.jianshu.com/p/eb48b4b10f04)

