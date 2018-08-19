---
title: 使用CSS布局的基础知识
date: 2017-01-29 17:25:29
categories: CSSTricks
---


 display属性
------------------
基础的display有三种值：
**block**、**inline**、**none**，
大多数默认值为block和inline。

#### block
有：p、form、div，块级元素会重新开始一行并且尽可能撑满容器。

#### inline
有：span、a元素

#### none
通常用于在不删除元素的情况下隐藏元素，和`visibility:hidden`相比，它不会占据空间。

inline-block
-------------------
`display:inline-block`可以将块级元素布局成行内元素一样，可用于创造网格网格铺满浏览器。

几点记住：

- vertical-align 属性会影响到 inline-block 元素，你可能会把它的值设置为 top 。

- 你需要设置每一列的宽度

- 如果HTML源代码中元素之间有空格，那么列与列之间会产生空隙

其他还有：flex、inline-block
盒模型
------------
传统的盒模型有一定缺陷，比如设置`width:100px`，其实是设置元素宽度，不包括padding、border和margin，带来的问题是设置同样width值的两个元素大小不一，所以使用新的CSS属性：`box-sizing:border-box`，这个的用法本质是将width限定范围为border内，，包括了border和padding，同样一个width值，不同的border和padding带来不同的元素宽度值，但外观上就是一致的，这就带来一致的设计体验。

position定位
------------------
主要有四种：**static**、**relative**、**fixed**、**absolute**。

#### static
默认值，表示不会被“positioned”。

#### relative
relative的表现和static一致，除非添加额外的属性，这额外的属性有`top、right、bottom、left`，是相对于她之前的位置发生偏移，且空间不会发生压缩。

#### fixed
也有`top`、`right` 、`bottom`、`left` 四种属性，只是这里的元素相对于视窗而言，且脱离文档流。

#### absolute
相对于最近的被*positioned* 的祖先元素（不是static元素），如果没有，则是body元素，并且随着页面滚动。脱离文档流的哦。

### float
float是浮动定位，它会脱离标准文档流。
网上找到这篇讲得非常好。[CSS浮动(float,clear)通俗讲解](http://www.cnblogs.com/iyangyuan/archive/2013/03/27/2983813.html)

具体来说，就是使用float的元素会脱离文档流，进入一个新的“流层”，但是要注意的一个浮动的元素会“顶在”未浮动（还在标准文档流里）的元素下部，当几个元素都浮动了，则会排列起来，形成“横向效果”。
第二，clear必须用在要清除的元素的上，比如两个div元素从左到右float，对第二个div元素使用`clear:left`，那么表明这个元素左边必须没有浮动元素，则这个元素会往下一列，顶在边缘，上面是第一个浮动的元素。

我试了下，使用clear清除的是自身受浮动的影响，比如一个元素div1和div2正常排列，div1左浮动，div2正常，则div1会“覆盖”div2，那么div2受到了影响，则使用clear清除左浮动则又会正常排列，但div1仍然是浮动的，只是不影响div2。

还有一个是清除浮动（clearfix hack），对受浮动影响的元素加入`overflow:auto` ，这个有点解释的不清，具体看[清除浮动（clearfix hack）](http://zh.learnlayout.com/clearfix.html)。

百分比宽度
----------------
使用`width：50%` 之类，可以做自适应的元素。适合搭配媒体查询


媒体查询
---------------
```CSS
@madia screen and(min-mwidth:600px){
	/*
	这里填写的是大于600px的布局。
	*/	
} 
```

flexbox
-----------
可看阮一峰的教程。
[Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
[Flex 布局教程：实例篇](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)

有空把flexbox的各种属性用法列出来。

