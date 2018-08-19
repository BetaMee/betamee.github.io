---
title: JS数据结构和算法笔记|6.字典和散列表
date: 2017-03-30 00:06:05
categories: Algorithms
---

# 7.1字典

字典中，存储的是\[key, value\]形式的值，也称为**映射**，与Set类似，ES6中提供的Map类，本字典类以Map为基础实现

## 7.1.1创建一个字典

```js
function Dictionary() {
  var items = {}; // 在一个对象中存储实例

  this.has = function(key) { //检查是否有
    return key in items;
  }
  this.set = function(key,value) { //设置新值
    items[key] = value;
  } 
  this.remove = function(0) { // 删除特定一项
    if(this.has(key)) {
      delete items[key];
      return true;
    }
    return false;
  }
  this.get = function(key) {
    return this.has(key)?items[value]:undefined;
  }

  this.values = function() {
    var values = {};
    for(var k in items) { // 这里使用has()来进行验证是因为Object还包含原型属性，排除
      if(this.has(k)) {
        values.push(items[k]);
      }
    }
    return values;
  }
  // clear() size()  keys() 与Set()类完全一样，butaolun

  this.getItems = function() {
    return items;
}
```

## 7.1.2使用Dictionary类

```js
var dictionary = new Dictionary();
dictionary.set('Gandalf','gandalf@email.com');
dictionary.set('John','john@email.com');
dictionary.set('Tyrion','tyrion@email.com');
```

---

# 7.2散列表

**散列算法**的作用是尽可能快地在数据结构中找到一个值。在之前的各种结构中，要想get\(\)一个值，需要遍历整个数据结构来找到它。如果使用散列函数，就知道值的具体位置，因此能够快速检索到该值。散列函数的作用是给定一个键值，然后返回值在表中的地址。

## 7.2.1创建散列表HashTable

```js
function HashTable() {
    var table = [];
    // loselose散列算法
    var loseloseHashCode = function (key) {
        var hash = 0;//为每个key的每个字符的ASCII码值的和
        for(var i= 0; i<key.length; i++){
            hash += key.charCodeAt(i);
        }
        return hash%37; //除于一个数适当减少值 
    }
    // put() 新增一个项
    this.put = function(key,value) {
        var position = loseloseHashCode(key);
        table[position] = value;
    }

    this.get = function (key) {
        return table[loseloseHashCode(key)];
    }
    //删除只需要将该位置设为undefined就行，因为散列数组是一系列元素分布在整个数组范围内，元素没有任何位置占据时，
    //默认undefined，不能用delete，否则下次寻找就找不到了。
    this.remove = function(key) {
        table[loseloseHashCode(key)]=undefined;
    }
}
```

## 7.2.2使用HashTable类

```js
var hash = new HashTable();
hash.put('Gandalf','gandalf@email.com');
hash.put('John','john@email.com');
hash.put('Tyrion','tyrion@email.com');
```

## 7.2.3散列表和散列集合

散列集合就是由一个集合构成，但是插入、移除、或获取元素的时候，使用的是散列函数。和集合类似，散列集合只存储唯一的不重复值。

## 7.2.4处理散列表中的冲突

当一个散列表中存在重复的散列值，就会出现数据覆盖的情况。这时候需要用几种方法解决这个问题。有：分离链表、线性探查、双散列法。

### 1.分离链接

分离链接法包括为散列表的每一个位置创建一个**链表**并将元素存储在里面，这是解决冲突的最简单的方法，但在HashTable外需要额外的存储空间。

为了实现一个使用了分离链表的HashTable实例，我们需要一个新的辅助类来表示将要加入的LinkedList实例的元素。成为ValuePair类。

```js
var ValuePair = function(key,value) {
    this.key= key;
    this.value = value;
    this.toString = function() {
        return `[${this.key}-${this.value}]`;
    }
}
```

这个类会将key和value存储在一个Object实例中。

#### （1）put方法

```js
this.put = function(key,value) {
    var position = loseloseHashCode(key);

    if(table[position] == undefined) {
        table[position]=new LinkedList();
    }
    table[position].append(new ValuePair(key,value));
}
```

#### \(2\)get方法

```js
this.put = funciton(key,value){
    var position = loseloseHashCode(key);

    if(table[position]!==undefined){
        //遍历栈表来获取键/值
        var current = table[position].getHead();

        while(current.next){
            if(current.element.key===key){
                return current.element.value;
            }
            current = current.next;
        }
    }
    return undefined;
}
```

#### \(3\)remove\(\)方法

```js
this.remove = function(key) {
    var position = loseloseHashCode(key);
    if(table[position]!==undefined){
        var current = table[position].getHead();
        while(current.next){
            if(current.element.key===key){
                table[position].remove(current.element);
                if(table[position].isEmpty()){
                    table[position] = undefined;
                }
                return true;
            }
            current = current.next;
        }
    }
    return false;
}
```

### 2.线性探查

当想在表中某个位置加入一个新元素时，如果索引为index的位置已经被占据了，就尝试index+1的位置。如果index+1的位置也被占据了，就尝试index+2的位置，以此类推。

#### \(1\)put方法

```js
this.put = function(key,value){
    var position = loseloseHashCode(key);

    if(table[position]==undefined){
        table[position]=new ValuePair(key,value);
    }else{
        var index = ++position;
        while(table[index]!=undefined){
            index++;
        }
        table[index] = new ValuePair(key,value);
    }
}
```

#### \(2\)get方法

```js
this.get = function(key){
    var position = loseloseHashCode(key);
    if(table[position].key===key){
        return table[position].value;
    }else{
        var index=++position;
        while(table[index]===undefined || table[index].key!==key){
            index++;
        }

        if(table[index].key ===key){
            return table[index].value;
        }
    }
    return undefined;
}
```

#### \(4\)remove方法

remove和get类似，区别在于将table\[position\]=undefined;就行。

## 7.2.5更好的散列函数

loseloseHashCode并不是一个很好的散列函数，会产生很多冲突，好的要兼顾插入和检索性能。

再写一个散列函数：djb2

```js
var djb2HashCode = function(key) {
    var hash = 5381;
    for(var i = 0; i<key.length;i++){
        hash = hash*33+key.charCodeAt(i);
    }
    return hash%1013;
}
```

