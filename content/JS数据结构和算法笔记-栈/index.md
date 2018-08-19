---
title: JS数据结构和算法笔记|2.栈
date: 2017-03-29 23:59:35
categories: Algorithms
---
# 3.1 栈的创建

```js
function Stack(){
    var items=[];
    this.push=function(element){//入栈
        items.push(element);
    }
    
    this.pop=function(){//出栈
       return items.pop();
    }
    this.peek=function(){//返回栈顶元素
       return items[items.length-1];     
    }
    this.isEmpty=function(){//判断是否为空
       return items.length == 0;
    }
    this.size=function(){//返回栈的尺寸
       return items.length;
    }
    this.clear=function(){//清除栈
       items=[];
    }
    this.print=function(){//打印栈的内容
       console.log(items.toString());
    }
}
```

# 3.2 栈的使用举例

## 十进制到二进制转换
```js
function divdeBy2(decNumber){
     var remStack=new Stack(),
         rem,
         binaryString="";
     while(decNumber>0){
         rem=Math.floor(decNumber%2);//余数入栈，先入栈的为低位
         remStack.push(rem);
         decNumber=Math.floor(decNumber/2);
     }

     while(!remStack.isEmpty()){
         binaryString+=remStack.pop().toString();
     }

     return binaryString;
}

console.log(divdeBy2(233));//=>11101001
```
## 任意进制
```js
function baseConverter(decNumber,base){
    var remStack=new Stack(),
        baseString='',
        digits='0123456789ABCDEF';
    
    while(decNumber>0){
        rem=Math.floor(decNumber%base);
        remStack.push(rem);
        decNumber=Math.floor(decNumber/base);
    }

    while(!remStack.isEmpty()){
        baseString+=digits[remStack.pop()];
    }  

    return baseString;
}

console.log(baseConverter(15,8));//=>17
console.log(baseConverter(15,16));//=>F
```
