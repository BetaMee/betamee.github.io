---
title: JS数据结构和算法笔记|3.链表
date: 2017-03-29 23:55:52
categories: Algorithms
---

# 1.链表的创建

```js
        function LinkedList(){
            var Node=function(element){
                this.element=element;
                this.next=null;
            }

            var length=0;
            var head=null;

            this.append=function(element){
                var node=new Node(element);
                var current;

                if(head==null){
                    head=node;
                }else{
                    current=node;
                    //列表循环，直到找到最后一项
                    while(current.next){
                        current=current.next;
                    }
                    //找到最后一项，将其next赋给node，建立连接
                    current.next=node;
                }
                length++;//更新列表长度
            };

            this.insert=function(position,element){//在任意位置插入元素
                if(position>=0 && position<=length){

                    var node=new Node(element);
                    var current=head;
                    var previous;
                    var index=0;

                    if(position===0){
                        node.next=current;
                        head=node;
                    }else{
                        while(index++ < position){
                            previous=current;
                            current=current.next;
                        }
                        node.next=current;
                        previous.next=node;
                    }

                    length++;
                    return true;
                }else{
                    return false;
                }
                
            };
            this.removeAt=function(position){
                //检查越界值
                if(position>-1 && postion<length){
                    var current=head;
                    var previous;
                    var index=0;
                    //移除第一项
                    if(position===0){
                        head=current.next;
                    }else{
                         while(index++ < position){
                             previous=current;
                             current=current.next;
                         }
                         //将previous与current的下一项连接起来;跳过current，从而移除它
                         previous.next=current.next;
                    }
                    length--;

                    return current.element;
                }else{
                    return null;
                }
            };
            this.remove=function(element){
                var index=this.indexOf(element);
                return this.removeAt(index);
            };
            this.indexOf=function(element){
                var current=head;
                var index=-1;

                while(current){
                    if(element===current.element){
                        return index;
                    }
                    index++;
                    current=current.next;
                }
                return -1;
            };
            this.isEmpty=function(){
                return length===0;
            };
            this.size=function(){
                return length;
            };
            this.toString=function(){
                var current=head;
                var string='';

                while(current){
                    string=current.element;
                    current=current.next;
                }
                return string;
            };
            this.getHead=function(){//得到链表首部信息
                 return head;
            };
        }

        var list=new LinkedList();
        list.append(5);
        list.append(10);
        list.append(120);
        list.append(110);
```

# 2.双向链表
```js
function DoublyLinkedList(){
    var Node=function(element){
        this.element=element;
        this.next=null;
        this.prev=null;//新增的
    };
    
    var length=0;
    var head=null;
    var tail=null;//新增的
    
    this.insert=function(position,element){
        if(position>=0 && position<=length){
            var node=new Node(element);
            var current=head;
            var previous;
            var index=0;
            
            if(position===0){
                if(!head){
                    head=node;
                    tail=node;
                }else{
                    node.next=current;
                    current.prev=node;
                    head=node;
                }
            }else if(position===length){
                current=tail;
                current.next=node;
                node.prev=current;
                tail=node;
            }else{
                while(index++ < position){
                    previous=current;
                    current=current.next;
                }
                node.next=current;
                previous.next=node;
                
                current.prev=node;//新增的
                node.prev=previous;//新增的
            }
            
            length++;
            
            return true;
        }else{
            return false;
        }
    };
    
    //从任意位置移除元素
    this.removeAt=function(position){
        if(position>-1 && position<length){
            var current=head;
            var previous;
            var index=0;
            
            if(position===0){
                head=current.next;
                
                //如果只有一项，更新tail
                if(length===1){
                    tail=null;
                }else{
                    head.prev=null;
                }
            }else if(position===length-1){//最后一项
                current=tail;
                tail=current.prev;
                tail.next=null;
            }else{
                while(index++ <position){
                    previous=current;
                    current=current.next;
                }
                //将previous与current的下一项连接起来，跳过current
                previous.next=current.next;
                current=current.next;
            }
            length--;
            
            return current.element;
        }else{
            return null;
        }
    };
        
}
```
