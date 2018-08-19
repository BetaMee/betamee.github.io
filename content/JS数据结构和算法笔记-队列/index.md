---
title: JS数据结构和算法笔记|4.队列
date: 2017-03-29 23:54:00
categories: Algorithms
---

# 4.1 队列的创建
```js
function Queue(){
    var items=[];
    
    this.enqueue=function(element){
        items.push(element);
    }
    this.dequeue=function(){
        return items.shift();
    }
    this.front=function(){
        return items[0];
    }
    this.isEmpty=function(){
        return items.length==0;
    }
    this.size=function(){
        return items.length;
    }
    this.clear=function(){
        items=[];
    }
    this.print=function(){
        console.log(items.toString());
    }
}
```

# 4.2 队列的其他版本：最小优先队列
```js
function PriorityQueue(){
    var items=[];
    
    function QueueElement(element,priority){
    //队列元素，假设priority越大优先级越低
        this.element=element;
        this.priority=priority;
    }
    
    //由优先级插入元素
    this.enqueue=function(element,priority){
        var queueElement=new QueueElement(element,priority);
        
        if(this.isEmpty()){
            items.push(queueElement);
        }else{
            var added=false;
            for(let i=0;i<items.length;i++){
                if(queueElement.priority<items[i].priority){
                    //当找到一个值更大的，则插入到之前，用splice()方法
                    items.splice(i,0,queueElement);
                    added=true;
                    break;
                }
            }
            if(!added){//否则就插入到后面
                items.push(queueElement);
            }
        }
    };
}
```

# 4.3 循环队列
模拟击鼓传花，围成一圈，花循环传递，某一时刻传花停止，这个时候花在谁手里谁就退出游戏。
```js
function hotPotata(nameList,num){
    var queue=new Queue();
    
    for (let i=;i<nameList.length;i++){
        queue.enqueue(nameList[i]);
    }
    var eliminated='';
    while(queue.size()>1){
        for(let i=0;i<num;i++){
            queue.enqueue(queue.dequeue());
        }
        eliminated=queue.dequeue();
        console.log(eliminated+'在击鼓传花游戏中被淘汰');
    }
    
    return queue.dequeue();
}

var names=['Jhon','Jack','Camlia','Ingrid','Carl'];
var winner=hotPotato(names,7);
console.log('胜利者：'+winner);

```