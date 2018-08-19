---
title: Issues-记录一次有趣的爬虫经历
date: 2017-09-13 00:23:39
category: Issues
---

为了一个国创项目，要做爬虫收集留学论坛上的帖子，遂使用NodeJS写了一个爬虫脚本，项目挂在[Github](https://github.com/BetaMee/NodeReptile)上，现在遇到一个有趣的问题。

先上个图：

{% asset_img console.png Terminal上的进度 %}

嗯，这个状态已经持续三天了，第一个和第二个49994是指帖子详情页的链接，给个具体的链接：[录取汇报|一亩三分地论坛](http://www.1point3acres.com/bbs/thread-282922-1-1.html)
第三个49994是指页面处理完后的数据，是一个这样的对象组合而成的数组：

```js
const post = {
   author, // 发帖人
   semester, // 学期
   degree, // 学位
   offer, // offer
   major, // 专业
   admission, // 录取学校
   noticeDate, // 通知时间
   undergraduate, // 本科
   GPA, // GPA
   TOEFL, // TOEFL
   GRE, // GRE
   GRE_SUB, // GRE_SUB
   background, // background
   submitDate, // 提交时间
   result, // 结果学校国家、地区
   searchStatus, // 查到status的方式
 };
```

**excel** 是表明爬虫和页面处理已经完成了，进入到写入excel的阶段，现在这个状态已经持续了两天多了。。。。

上具体的处理代码：

```js
import XLSX from 'xlsx';
import path from 'path';

const exportDataToExcel = (_data) => {
  console.log('excel');
  const _headers = ['author',
    'semester',
    'degree',
    'offer',
    'major',
    'admission',
    'noticeDate',
    'undergraduate',
    'GPA',
    'TOEFL',
    'GRE',
    'GRE_SUB',
    'background',
    'submitDate',
    'result',
    'searchStatus',
  ];
  const headers = _headers
    // 为 _headers 添加对应的单元格位置
    .map((v, i) => Object.assign({}, { v, position: String.fromCharCode(65 + i) + 1 }))
    // 转换成 worksheet 需要的结构
    .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});

  const data = _data
    .map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65 + j) + (i + 2) })))
    // 对刚才的结果进行降维处理（二维数组变成一维数组）
    .reduce((prev, next) => prev.concat(next))
    // 转换成 worksheet 需要的结构
    .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {});

  // 合并 headers 和 data
  const output = Object.assign({}, headers, data);
  // 获取所有单元格的位置
  const outputPos = Object.keys(output);
  // 计算出范围
  const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`;

  // 构建 workbook 对象
  const wb = {
    SheetNames: ['mySheet'],
    Sheets: {
      mySheet: Object.assign({}, output, { '!ref': ref }),
    },
  };

  // 导出 Excel
  XLSX.writeFile(wb, path.resolve(__dirname, '../dist/testN.xlsx'));
};

export default exportDataToExcel;

```

所以我就好奇是不是Nodejs 处理这4w+的数据有问题？整个处理函数用到也就map()函数和Object.assign()函数。
所以一下子处理4w+的数据，对于map或者Object.assign而言有问题？

而且，我还观察到一个有趣的问题，当我开任务管理器，查看程序占用内存，发现是这样子的：

{% asset_img nodestatus1.png 状态1 %}

{% asset_img nodestatus2.png 状态2 %}

{% asset_img nodestatus3.png 状态3 %}

{% asset_img nodestatus4.png 状态4 %}

哦豁，CPU稳定占据30%左右，内存一直是从570多逐渐升到1200多再跌倒500多，循环往复。
这个状态已经持续进行了两天了，有趣。

另外提一下，之前测试小范围数据是成功的，几百条对象的数据都是几分钟就搞定，上次最多的我记得是9k多条数据，花了几个小时也能写入到excel，但现在这样两天持续这样我也是没见识过！

我的电脑是联想Y510，14年买的，配置：

- CPU Core i5-4200M
- 8G内存
- 256G SSD加持

运行环境：

- node v8.4.0

持续两天下来，电脑风扇也是呼呼的，今晚再不行，真要按Ctrl + C取消了！ ==
