---
title: JS数据结构和算法笔记|1.数组
date: 2017-03-29 23:49:41
categories: Algorithms
---

# 2.1 创建和初始化数组
```js
//使用对象方式
var Arr=new Array();
var Arr=new Array(7);//指定长度
var Arr=new Array("Monday","Tuesday");
//简单方式
var Arr=[];
```
# 2.2 添加和删除元素
```js
var numbers=[1,2,3,4,5,6];
//push（）方法，在数组最后添加元素
numbers.push(11);//=>[1,2,3,4,5,6,11]
numbers.push(12,13);//=>[1,2,3,4,5,6,11,12,13]
//pop()方法，在数组最后删除元素，可模拟堆栈
numbers.pop();//=>[1,2,3,4,5,6,11,12]

//unshift()方法，可将元素添加到数组首位
numbers.unshift(-1);//=>[-1,1,2,3,4,5,6,11,12]
numbers.unshift(-2,-3);//=>[-2,-3,-1,1,2,3,4,5,6,11,12]
//shift()方法，删除数组首位元素
numbers.shift();//=>[-3,-1,1,2,3,4,5,6,11,12]


//在任意位置添加删除元素，splice()方法
numbers.splice(5,3);//=>[-3,-1,1,2,3,11,12]，从索引为5的元素开始删除三个元素
numbers.splice(5,0,2,3,4);//=>[-3,-1,1,2,3,2,3,4,11,12],从索引5的位置开始插入3个，
                          //第一个参数表示索引，第二个表示删除的个数，0为不删除，
                          //后面的为添加的元素
numbers.splice(5,3,111,111,111);//=>[-3,-1,1,2,3,111,111,111,11,12]，
                                //从索引5开始替换3个
```

# 2.3 数组元素合并

```js
//数组合并
var zero=0;
var positiveNumbers=[1,2,3];
var negativeNumbers=[-3,-2,-1];
var numbers=negativeNumbers.concat(zero,positiveNumbers);//=>[-3,-2,-1,0,1,2,3]
```


# 2.4 数组元素过滤器
```js
//迭代器函数
var isEven=function(x){
    return (x%2==0);
}
var numbers=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

//every()方法，迭代每一个元素，直到返回false
numbers.every(isEven);
//some()方法，迭代每一个元素，直到返回true
numbers.some(isEven);
//forEach()方法，迭代整个数组
numbers.forEach(function(x){
     console.log(x);
});
//map()方法,迭代整个数组，且会返回一个新数组
var newArr=numbers.map(function(x){
    return (x%2==0)
});//=>[false,true,false,........]
//filter()方法，遍历数组，由使函数返回为true的元素构成
var newArr=numbers.filter(function(x){
    return(x%2==0);//是否为偶数，若为偶数则这个偶数被返回
});//=>[2,4,6,8,10,12,14]
```

# 2.5 数组元素排序
```js
//排序
var numbers=[2,4,10,7,1,5,6,9,8];
//reverse()方法，将数组反转
numbers.reverse();//=>[8,9,6,5,1,7,10,4,2]
//sort()排序，这个要传个判断函数进去，否则不起左右
function compare(a,b){
     if(a<b){
         return 1;//当a<b返回1时要反转元素，由大到小，-1则由小到大
     }
     if(a>b){
         return -1;
     }
         return 0;
}
numbers.sort(compare);//=>[10,9,8,7,6,5,4,2,1]，由大到小
```

# 2.6 数组元素搜索
```js
//搜索
var numbers=[2,4,10,7,1,5,6,8,8];
//indexOf()返回与参数匹配的第一个元素的索引，若不匹配则返回-1
console.log(numbers.indexOf(8));//7
//lastIndexOf()返回与参数匹配的最后一个元素的索引，若不匹配则返回-1
console.log(numbers.lastIndexOf(8));//8
```