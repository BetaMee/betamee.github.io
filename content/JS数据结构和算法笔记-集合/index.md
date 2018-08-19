---
title: JS数据结构和算法笔记|5.集合
date: 2017-03-29 23:57:00
categories: Algorithms
---

# 1.集合的实现
```js
function Set(){//模拟与ES6实现相同的Set类
    var items={};//使用对象而不是数组来表示集合
    
    this.has=function(value){
        //return value in items;//方法一，使用in操作符
        return items.hasOwnProperty(value);//返回一个表明对象是否具有特定属性值
    };
    
    this.add=function(value){
        if(!this.has(value)){
            items[value]=value;//同时作为键值保存
            return true;
        }
        return false;
    };
    this.remove=function(value){
        if(this.has(value)){
            delete items[value];/此处使用简单的delete来从对象中移除属性
            return true;
        }
        return false;
    };
    this.clear=function(){
        items={};
    };
    this.size=function(){
        return Object.keys(items).length;//静态方法，返回一个给定对象所有属性的数组
    };
    
    this.values=function(){
        return Object.keys(items);
    };
}
```
# 2.集合操作
## 并集
```js
this.union=function(otherSet){
    var unionSet=new Set();
    
    var values=this.values();
    for(var i=0;i<values.length;i++){
        unionSet.add(values[i]);
    }
    
    values=otherSet.values();
    for(var i=0;i<values.length;i++){
        unionSet.add(values[i]);
    }
    
    return unionSet;
};
```

## 交集
```js
this.intersection=function(otherSet){
    var intersectionSet=new Set();
    
    var values=this.values();
    for(var i=0;i<values.length;i++){
        if(otherSet.has(values[i])){
            intersectionSet.add(values[i]);
        }
    }
    return intersectionSet;
};
```
## 差集
```js
this.difference=function(otherSet){
    var differenceSet=new Set();
    
    var values=this.values();
    for(var i=0;i<values.length;i++){
        if(!otherSet.has(valus[i])){
            differenceSet.add(values[i]);
        }
    }
    return differenceSet;
};
```

## 子集
```js
this.subset=function(otherSet){
    if(this.size()>otherSet.size()){
        return false;
    }else{
        var values=this.values();
        for(var i=0;i<values.length;i++){
            if(!otherSet.has(values[i])){
                return false;
            }
        }
        return true;
    }
};
```
