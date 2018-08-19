---
title: Issues-使用vscode+nodemon调试nodejs（v6.9.0）
date: 2017-07-16 12:16:10
categories: Issues
---

对于使用vscode调试nodejs一直有强烈的愿望，这次在项目中研究了一下，使用nodemon搭配vscode来，寻找一个便捷可靠的方式来调试nodejs。

vscode通过launch.json来配置debugger，内置了很多平台的调试器，有debug for chrome、nodejs、python。这次篇文章重点记录nodejs后端调试。

先给出我的项目结构：

{% asset_img project.png 项目结构 %}


./app/ 是前端源码， ./build/是前端打包编译后的代码，这部分可以不看；./server/是nodejs端代码，是我们要调试的部分，./dist/是nodejs打包后的代码，是线上环境会运行的。我们重点看./server/是，因为这个是我们要调试的。

我们使用nodemon来开启运行环境，这样可以修改服务端代码而不需要重启。由于node端使用了babel-node，所以需要做一些准备。

我们的需求是编写服务端代码，可以方便快捷的调试，也就是说，当我在./server/编写代码，可以靠nodemon自动重启，可以靠babel-node来编译es6代码，靠vscode自带的debugger来帮助我们打断点，单步运行。

## 准备工作

### launch.json

launch.json是vscode调试必须的，在设置里，启用，选择配置。

{% asset_img debugger.png 配置 %}

可以看到nodejs有很多选项，我之前试了一个nodemon启动，不过这个是要靠全局安装，还挺麻烦的，我就放弃了。然后我试了下**Nodejs：附加**选项，生成以下配置：

```js
{
  // Use IntelliSense to learn about possible Node.js debug attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach",
      "port": 5858
    }
  ]
}
```

这里字段的含义是：type表明是node程序，request是attach类型，我的理解是**调试器是附着在现有运行进程上的**，比如你在跑`node index.js`，启动一个node的进程，这个调试程序就会监听这段进程的运行。。name就是调试程序的名字，没什么好说的，port指的是调试程序的端口，要注意的一点是，attach调试分为--debug和--inspect，--debug为5858，--inspect为9229，暂且不表，后文详细说。

最后给出我的配置：

```js
{
  // Use IntelliSense to learn about possible Node.js debug attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
     {
        "type": "node",
        "request": "attach",
        "name": "附加于已启动的 Node 服务器（debug模式）",
        "port": 5858,
        "restart": true
    },
    {
        "type": "node",
        "request": "attach",
        "name": "附加于已启动的 Node 服务器（inspect模式）",
        "port": 9229,
        "restart": true
    }
  ]
}
```

添加一个 restart 参数是为了配合 nodemon 在监听到文件修改时重启服务器。

### npm script

为什么要做这个准备呢？是因为我们启动程序要从npm script启动，而且需要一些配置。先给出我的script：

```js
"scripts": {
    "start": "cross-env NODE_ENV=production node ./dist/server.js ",
    "dev": "cross-env NODE_ENV=development nodemon ./server/server.js --inspect --exec babel-node",
    "buildapp": "webpack --config webpack.config.prod.js",
    "buildnode": "babel server -d dist --source-maps"
  }
```
  start是生产环境下运行，buildapp打包前端代码，跟本文无关，buildnode是最后打包node代码脚本，重点看dev。

  `npm run dev`启动的时候，会这样运行，首先设置node环境为**development**，`cross-env NODE_ENV=development`，然后是nodemon启动./server/server.js脚本，`--exec babel-node`表示没有使用node方式，默认为`node`启动， `--inspect`表示使用inspect方式，对应的事debug方式。

  这里详细说明下上文的port点：

Runtime |	‘Legacy Protocol’ |	‘Inspector Protocol’
--------|-------------------|-------------------
io.js	  |all|	no
node.js |	< 8.x |	>= 6.3 (Windows: >= 6.9)
Electron|	all|	not yet
Chakra	|all|	not yet

通俗来说，旧版 Node (< 6.3) 推荐使用 Legacy Protocol (--debug模式，默认 5858 端口)，而新版的 Node (>= 6.3) 推荐使用 Inspector Protocol (--inspect模式，默认 9229 端口)。

我的node是6.9.0，测试下确实inspect有效，而debug无效。

## 开始调试

直接说明步骤：
1. npm run dev
2. 启动*附加于已启动的 Node 服务器（inspect模式）*
3. 打断dian
4. 测试运行

可以看到，当跑dev命令的时候：

{% asset_img console.png 输出 %}


当启动调试器的时候，会出现：

{% asset_img result.png 连接成功 %}

然后就是打断点，运行啦。愉快玩耍吧~~~~
