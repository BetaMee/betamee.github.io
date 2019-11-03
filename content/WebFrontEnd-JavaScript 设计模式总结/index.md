---
title: JavaScript 设计模式总结
date: 2019-10-19 14:45:15
category: WebFrontEnd
tags: JS_Deep 设计模式 读书笔记
openreward: true
---

## 目录

## 1. 引言

## 2. 面向对象编程

### 2.1 类的创建

```js
// 1. 构造函数语法
const Book = function (id, bookname, price) {
  this.id = id
  this.bookname = bookname
  this.price = price
}

// prototype 方法一
Book.prototype.display = function () {
  console.log('display')
}

// prototype 方法二，需要修复 constructor 指向
Book.prototype.constructor = Book
Book.prototype = {
  display: function () {
    console.log('display')
  }
}

// 2. class 语法
class Book {
  constructor(id, bookname, price) {
    this.id = id
    this.bookname = bookname
    this.price = price
  }
  display() {
    console.log('display')
  }
}

// 3. 静态属性
Book.isChinese = true
Book.getStaticProp = function () {
  console.log('getStaticProp')
}

// 使用
const book = new Book(1, 'bookname', 100)
// Book {id: 1, bookname: 'bookname', price: 100}
//    bookname: 'bookname'
//    id: 1
//    price: 100
//    __proto__:
//      display: ƒ ()
//      constructor: ƒ (id, bookname, price)
//      __proto__: Object
```

### 2.2 闭包实现私有属性和方法

```js
const Book = (function() {
  // 静态私有属性
  const bookNum = 0
  // 静态私有方法
  const checkBook = function () {}
  // 返回构造函数
  return function(newId, newName, newPrice) {
    // 私有属性
    const name = 0
    // 私有方法
    const checkId = function () {}
    // 公有属性
    this.id = newId
    // 公有方法
    this.copy = function () {}
  }
})()

Book.prototype.constructor = Book
Book.prototype = {
  isDispaly: false,
  display: function () {
    console.log('display')
  }
}
```
### 2.3 创建对象的安全模式

```js
const Book = function (id, bookname, price) {
  // 判断执行过程中 this 是否是当前这个对象（如果是的话说明是用 new 创建的）
  if (this instanceof Book) {
    this.id = id
    this.bookname = bookname
    this.price = price
  } else {
    return new Book(id, bookname, price)
  }
}
```

### 3. 继承

#### 3.1 类式继承

```js
// 父类
function SuperClass(val) {
  this.superValue = val;
}

// 父类的公有方法
SuperClass.prototype.getSuperValue = funtion () {
  return this.superValue;
}

// 子类
function SubClass () {
  this.subValue = '';
}

// 继承父类
SubClass.prototype = new SuperClass('superValue');

// 子类的公有方法
SubClass.prototype.getSubValue = function () {
  return this.subValue;
}

const instance = new SubClass();
console.log(instance instanceof SuperClass); // true
console.log(instance instanceof SubClass); // true
console.log(SubClass instanceof SuperClass); // false
console.log(SubClass.prototype instanceof SuperClass); // true
console.log(instance instanceof Object); // true
```

缺点：

1. 子类通过原型继承父类的公有属性，如果公有属性是引用类型，那么多个实例共享这个引用类型，会互相影响
2. 子类实现的继承是靠其 prototype 对父类的实例化实现的，无法在创建父类的时候向父类传递参数，对父类构造函数内的属性进行初始化
3. 子类不是父类的实例，而是**子类的原型**是父类的实例

#### 3.2 构造函数继承

```js
// 父类
function SuperClass(id) {
  // 引用类型
  this.books = ['JavaScript', 'html', 'css'];
  this.id = id;
}
// 父类公有方法
SuperClass.prototype.showBooks = function() {
  console.log(this.books);
}

// 子类
function SubClass(val, id) {
  // 实例化父类
  SuperClass.call(this, id);
  // 子类的属性
  this.subValue = val;
}

// 子类的公有方法
SubClass.prototype.getSubValue = function () {
  return this.subValue;
}
// 创建第一个实例
const instance1 = new SubCalss(1, 2);
// 创建第二个实例
const instance2 = new SubCalss(3, 4);

instance1.books.push('设计模式');
console.log(instance1.books); // ['JavaScript', 'html', 'css', '设计模式']
console.log(instance1.id); // 2
console.log(instance2.books); // ['JavaScript', 'html', 'css']
console.log(instance2.id); // 4
```

缺点：由于 `SuperClass.call(this, id);` 只涉及父类的构造函数，所以父类原型中的方法不会被继承！

#### 3.3 组合继承

可以这么看待： 组合继承 = 类式继承 + 构造函数继承

```js
// 父类
function SuperClass(name) {
  // 值类型
  this.name = name;
  // 引用类型
  this.books = ['JavaScript', 'html', 'css'];
}

// 父类原型公有方法
SuperClass.prototype.getName = function() {
  console.log(this.name);
}

// 子类
function SubClass(name, time) {
  SuperClass.call(this, name);
  this.time = time;
}

// 子类原型继承父类
SubClass.prototype = new SuperClass();

// 子类原型方法
SubClass.prototype.getTime = function() {
  console.log(this.time);
}

// 创建第一个实例
const instance1 = new SubCalss('js book', 2014);
instance1.books.push('设计模式');
console.log(instance1.books); // ['JavaScript', 'html', 'css', '设计模式']
instance1.getName(); // js book
instance1.getTime(); // 2014

// 创建第二个实例
const instance2 = new SubCalss('css book', 2013);
console.log(instance1.books); // ['JavaScript', 'html', 'css']
instance1.getName(); // css book
instance1.getTime(); // 2013
```

缺点：子类构造函数继承时执行一遍父类的构造函数、子类原型继承的时候又执行了一遍构造函数，这就重复调用父类构造函数两次。

#### 3.4 原型式继承

原型式继承约等于类式继承。

这个方案是道格拉斯.克罗克福在 2006 年的一篇《JavaScript 中原型式继承》提出来的：

```js
// 继承方法
function inheritobject(o) {
  // 声明一个过渡函数对象
  function F() {}
  // 过渡对象的原型继承父对象
  F.prototype = o;
  // 返回过渡对象的一个实例。该实例的原型继承父类对象
  return new F();
}

// 父类实例
const book = {
  name: 'js book',
  alikeBooks: ['css book', 'html book']
};

const newBook = inheritobject(book);
newBook.name = 'ajax book';
newBook.alikeBooks.push('xml book');

const otherBook = inheritobject(book);
otherBook.name = 'flash book';
otherBook.alikeBooks.push('as book');

console.log(newBook.name); // ajax book
console.log(newBook.alikeBooks); // ['css book', 'html book', 'xml book', 'as book']

console.log(otherBook.name); // flash book
console.log(otherBook.alikeBooks); // ['css book', 'html book', 'xml book', 'as book']

console.log(book.name); //js book
console.log(book.alikeBooks); // ['css book', 'html book', 'xml book', 'as book']
```

缺点：跟类式继承有着一样的缺点，继承的时候父类的值属性被复制，而引用类型共享。

这种思想的发展就变成了 `Object.create()` 方法。

#### 3.5 寄生式继承

寄生式继承是在原型式继承的一个加强。

```js
const book = {
  name: 'js book',
  alikeBooks: ['css book', 'html book']
};

function inheritObject(o) {
  // 声明一个过渡函数对象
  function F() {}
  // 过渡对象的原型继承父对象
  F.prototype = o;
  // 返回过渡对象的一个实例。该实例的原型继承父类对象
  return new F();
}

function createbook(obj) {
  // 通过原型继承方式创建新对象
  const o = inheritObject(obj);
  // 扩展新的对象
  o.getName = function() {
    console.log(this.name)
  };

  return o;
}

// 生成子类实例
const newBook = createbook(book);
```

寄生式继承本质是对原型继承的二次封装，并且在二次封装的过程中对继承对象进行了拓展，这样新创建的对象不仅拥有了父类中的属性和方法，也有自己的属性。

#### 3.6 寄生组合式继承

终极方案，结合寄生式继承和组合式继承的优点。

这个方案拆解下来就是，使用**组合式继承中的构造函数继承**优点，将父类属性初始化，同时使用**寄生式继承**方案中，将子类原型导向父类原型，这样就完美达成所有要求了。

```js
function inheritObject(o) {
  // 声明一个过渡函数对象
  function F() {}
  // 过渡对象的原型继承父对象
  F.prototype = o;
  // 返回过渡对象的一个实例。该实例的原型继承父类对象
  return new F();
}

/**
 * 寄生式继承 继承原型
 * subClass 子类
 * superClass 父类
 */
function inheritPrototype(subClass, superClass) {
  // 复制一份父类的原型副本保存在变量中
  const p = inheritObject(superClass.prototype);
  // 修改重写子类导致的 constructor 属性被重写
  p.constructor = subClass;
  // 设置子类的类型
  subClass.prototype = p;
}

// 定义父类
function SuperClass(name) {
  this.name = name;
  this.colors = ['red', 'blue', 'green'];
}

// 定义父类的原型方法
SuperClass.prototype.getName = function() {
  console.log(this.name);
}

// 定义子类
function SubClass(name, time) {
  // 构造函数式继承
  SuperClass.call(this, name);
  this.time = time;
}

// 寄生式继承父类原型
inheritPrototype(SubClass, SuperClass);

// 子类新增新的方法
SubClass.prototype.getTime = function() {
  console.log(this.time);
}

// 创建实例
const instance1 = new SubClass('js book', 2014);
const instance2 = new SubClass('css book', 2015);
```

#### 3.7 多继承：extend 和 mix 的思路

多继承可以用一个 JS 中常见的 `extend` 方法来讲解：

```js
// 流行的浅复制方法
const extend = function(target, source) {
  for (let property in source) {
    // 将源对象中的属性复制到目标对象中
    target[property] = source[property];
  }
  return target;
}
```
但是这个 `extend` 只是浅复制，要实现深复制需要考虑如何处理引用类型了。这个思想发展下来就是 `Object.assgin()`。

至于多继承，也就是要继承多个对象，那么改造一下这个方法的思路即可，也就是 JS 领域中另一个方案：混入（mix）。

```js
const mix = function() {
  let len = arguments.length;
  let target = arguments[0]; // 第一个参数为目标对象
  let arg;
  for (let i = 1; i < len; i++) { // 从第二个参数开始循环
    arg = arguments[i];
    for (let property in arg) {
      // 将源对象中的属性复制到目标对象中
      target[property] = source[property];
    }
  }
  return target;
}
```

#### 3.8 多态：根据 arguments 参数来判断

多态的思路很简单，根据参数多少来判断：

```js
function add() {
  let arg = arguments;
  let len = arguments.length;

  switch(len) {
    case 0: // 没有参数
      return 10;
    case 1: // 1 个参数
      return 10 + arg[0];
    case 2: // 2 个参数
      return arg[0] + arg[1];
    default:
      throw new Error('arguments error!');
      break;
  }
}

// 测试用例
console.log(add()); // 10
console.log(add(5)); // 15
console.log(add(6, 7)) // 13
```

## 4. 设计模式

### 4.1 创建型设计模式

创建型设计模式是一类处理对象创建的设计模式，通过某种方式控制对象的创建来避免基本对象创建时可能导致设计上的问题或者增加设计上的复杂度。

### 简单工厂模式

```js
// 一种是在一个方法里提供多个类实例
const createPop = function(type, text) {
  switch(type) {
    case 'alert':
      return new Alert(text);
    case 'prompt':
      return new Prompt(text);
    case 'confirm':
      return new Confirm(text);
  }
}


// OR 这种抽离共用的属性，再添加独特的自身属性
const createPop = function(type, text){
  const o = new Object();
  o.content = text;
  o.show = function(){
    //显示方法
  };
  if(type == 'alert'){
    //警示框差异部分
  };
  if(type == 'prompt'){
    //提示框差异
  };
  if(type == 'confirm'){
    //确认框差异部分
  }
  return o;
};

//创建警示框
const pop = createPop('alert', '用户只能输入26个以内字母或者数字');
```

缺点：每次新增对象都要改动工厂方法，限制比较大，不够灵活。

### 工厂方法模式

```js
// 安全模式创建的工厂类
const Factory = function (type, content) {
  if (this instanceof Factory) {
    return new this[type](content);
  } else {
    return new Factory(type, content);
  }
}

// 原型工厂原型中设置创建所有类型数据对象的基类
Factory.prototype = {
  Java: function(content) {
    // 具体的实现
  },
  JavaScript: function(content) {
    // 具体的实现
  }
}

// 实例
const data = [
  {
    type: 'JavaScript',
    content: 'JavaScript 哪家强'
  },
  {
    type: 'Java',
    content: 'Java 哪家强'
  }
];

for (let i = 0; i < data.length; i ++) {
  Factory(data[i].type, data[i].content)
}
```

### 抽象工厂模式

```js
const VehicleFactory = function (subType, superType) {
  // 判断抽象工厂中是否有该抽象类
  if (typeof VehicleFactory[superType] === 'function') {
    // 缓存类
    function F() {}
    // 继承父类属性和方法
    F.prototype = new VehicleFactory[superType]()
    // 将子类 constructor 指向子类
    subType.constructor = subType
    // 子类原型继承父类
    subType.prototype = new F()
  } else {
    // 不存在该抽象类抛出错误
    throw new Error('未创建该抽象类')
  }
}
// 小汽车抽象类
VehicleFactory.Car = function () {
  this.type = 'car'
}

VehicleFactory.Car.prototype = {
  getPrice() {
    return new Error('抽象方法不能调用')
  },
  getSpeed() {
    return new Error('抽象方法不能调用')
  }
}
// 公交车抽象类
VehicleFactory.Bus = function () {
  this.type = 'bus'
}

VehicleFactory.Bus.prototype = {
  getPrice() {
    return new Error('抽象方法不能调用')
  },
  getPassengerNum() {
    return new Error('抽象方法不能调用')
  }
}

// 货车抽象类
VehicleFactory.Truck = function () {
  this.type = 'truck'
}

VehicleFactory.Truck.prototype = {
  getPrice() {
    return new Error('抽象方法不能调用')
  },
  getTrainLoad() {
    return new Error('抽象方法不能调用')
  }
}

// 使用

// 宝马汽车子类
const BMW = function(price, speed) {
  this.price = price
  this.speed = speed
}

VehicleFactory(BMW, 'car')

BMW.prototype.getPrice = function() {
  return this.price
}

BMW.prototype.getSpeed = function() {
  return this.speed
}


// 兰博基尼汽车子类
const Lamborghini = function(price, speed) {
  this.price = price
  this.speed = speed
}

VehicleFactory(Lamborghini, 'car')

Lamborghini.prototype.getPrice = function() {
  return this.price
}

Lamborghini.prototype.getSpeed = function() {
  return this.speed
}
```

### 建造者模式

### 原型模式


### 单例模式

### 外观模式

### 适配器模式

### 代理模式

### 装饰者模式

### 桥接模式

### 组合模式

### 享元模式

### 模版方法模式

### 观察者模式

### 状态模式

### 策略模式

### 职责链模式

### 命令模式

### 访问者模式

### 中介者模式

### 备忘录模式

### 迭代器模式

### 解释器模式

### 链模式

### 委托模式

### 数据访问对象模式

### 节流模式

### 简单模式模式

### 惰性模式

### 参与者模式

### 等待者模式

### 同步模块模式

### 异步模块模式

### Widgt 模式

### MVC 模式

### MVP 模式

### MVVM 模式

## 参考

* 《JavaScript 设计模式》 张容铭 2015 人民邮电出版社
