---
title: JS基础-面向对象
date: 2017-04-02 21:02:41
categories: BasisNotes
---


## 思维导图

首先还是先放上《高程》第六章学习过程中记录的思维导图吧




## 创建对象

### Object构造函数

```js
var Person = new Object();
Person.name = "BetaMee";
Person.age = 29;
Person.sayName = function() {
  return this.name;
}
```

### 对象字面量
```js
var Person = {
  name: "BetaMee";
  age: 29;
  sayName: function() {
    return this.name;
  }
};
```
缺点：无法重用

### 工厂模式

```js
  function createPerson(name,age,job){
    var o = new Object();
    o.name=name;
    o.age=age;
    o.sayName=function(){
      return this.name;
    };
    return o;
  }
```

缺点： 无法解决对象识别问题，即无法判别一个实例的类型，因为返回的是object类型。

### 构造函数模式

```js
function Person(name,age,job) {
  this.name=name;
  this.age=age;
  this.job=job;
  this.sayName=function(){
    return this.name;
  }
}

var person1=new Person('BetaMee',20,'stu');
var person2=new Person('Oak',20,'stu');

要验证person1和person2实例的类型，使用instanceof操作符

```
```js
console.log(person1 instanceof Person); //true
console.log(person1 instanceof Object); //true
```

之所以person1对Object是true，因为所有对象都继承自Object。

优点：可以识别实例的类型。

缺点：每个实例都独立，一些方法也被重复创建。


### 原型模式

#### 创建细节

我们创建的每个函数都有一个`prototype`属性，这个属性是个指针，指向一个对象，而这个对象的用途是包含可以被所有实例共享的属性和方法。

```js
function Person(){

}

Person.prototype.name="BetaMee";
Person.prototype.age=29;
Person.prototype.job="stu";
Person.prototype.sayName=function(){
  return this.name;
}

var person1 =new Person();
```

原型对象，是JS中非常重要的一个概念。无论什么时候，只要新建一个函数，就会根据一组特定的规则为该函数创建一个prototype属性，这个属性指向原型对象，而在默认的情况下，所有的原型对象都有一个constructor，指向Person。通过这个构造函数，可以继续为原型对象添加其他属性和方法。

其实打开浏览器，就可以研究一下。在Chrome中，做以下实验：
```js
function Person(age){
  this.age = age;
}
Person.prototype.name="BetaMee";

var person1=new Person();

//接下来使用console.log()方法来测试这些关系。
console.log(person1); //  Person {age: 15}
console.log(person1.__proto__); // Object {name: "BetaMee", constructor: function}
console.log(Person.prototype.isPrototypeOf(person1)); //true
console.log(Person.prototype.constructor); //function Person(age){this.age=age;}
```
这些关系可以用一个图来说明：

{% asset_img 原型对象.png 原型对象关系%}

代码里的`person1.__proto__`指的是person1的原型，因为图中实例属性[[prototype]]是无法访问的，所以各个浏览器通过实现`__proto__`这个属性来解决，非标准。也可以通过Person.prototype.isPrototypeOf(person1)这种方式来判断一个实例是否是一个原型对象的实例。ECMAScript5中新方法：`Object.getPrototypeOf(person1)`可以得到一个实例对象的原型对象。

原型对象的constructor是指向构造函数的，也就是指向函数本身。

#### in操作符和判断属性属于哪一个部分

两种方式使用in操作符：单独使用和for...in循环，单独使用时，in操作符会在通过对象能够访问给定属性时返回true，**无论该属性是否是在实例还是在原型中**，

而`实例.hasOwnProperty()`则判断属性只有在实例中时才返回true。

要想取得对象上所有可枚举的实例属性，使用`Object.keys()`。要想取得所有实例属性，无论是否可枚举，使用   `Object.getOwnPropertyNames()`

#### 更简单的原型语法

```js
function Person(){

}

Person.prototype={
  constructor:Person, //这一点一定要手动添加，因为这个会重写prototype属性
  name:"BetaMee",
  age:25,
  sayName:function() {
    return this.name;
  }
}
```

此时有个问题：这种方式定义下的constructor是可枚举的，而原生是不可枚举的，要想达到原生的效果，使用
```js
Object.defineProperty(Person.prototype,"constructor",{
  enumerable:false,
  value:Person
});
```

### 组合使用构造函数模式和原型模式

```js
function Person(name,age,job){
  this.name=name;
  this.age=age;
  this.job=job;
}

Person.prototype={
  constructor:Person,
  sayName:function(){
    return this.name
  }
}
```

### 动态原型模式

```js
function Person(name,age,job){
  this.name=name;
  this.age=age;
  this.job=job;
  if(typeof this.sayName != "function"){
    Person.prototype.sayName = function(){
      return this.name;
    }
  }
}
```

### 寄生构造函数模式

```js
function SpecialArray(){
  var values = new Array();
  values.push.apply(values,arguments);
  values.toPipedString=function(){
    return this.join("|");
  }
  return values;
}

var colors = new SpecialArray("red","blue","green");
```

特点：返回的对象跟SpecialArray构造函数已经没有任何关系。


### 稳妥构造函数模式

```js
function Person() {
  var o =new Object();
  //这里定义私有变量和函数
  name="hhh";
  o.sayName = function(){
    return name;
  }
  return o;
}
var friend = Person();
```

特点:能隐藏变量，非常安全，外部无法访问name(其实就是闭包，后面详谈)。


## 继承

### 原型链
```js
function SuperType(){
    this.property=true;
    this.colors=['red','blue'];
  }
  SuperType.prototype.getSuperValue=function(){
    return this.property;
  }

  function SubType(){
    this.subproperty=false;
  }

  //继承SuperType
  SubType.prototype=new SuperType();
  SubType.prototype.getSubValue=function(){
    return this.subproperty;
  }

  var instance1 = new SubType();
  // console.log(instance1.constructor);
  instance1.colors.push("yellow");
  console.log(Object.getPrototypeOf(instance1));
  
  var instance2 = new SubType();
  console.log(Object.getPrototypeOf(instance2));
  console.log(instance1 instanceof SuperType);
```

原型继承，可以这么理解，子类的prototype是父类对象的一个实例，通过`SubType.prototype=new SuperType();`来建立，当来带来的问题就是，所有子类的实例都会共享父类实例，就是`SubType.prototype`，这个属性对应父类的一个实例，且共享。


### 借用构造函数

```js
  //父类
  function SuperType(age){
    this.property=age;
    this.colors=['red','blue'];
  }
  SuperType.prototype.getSuperValue=function(){
    return this.property;
  }
  //子类
  function SubType(age){
    //调用父类构造函数
    SuperType.call(this,age);
    this.subproperty=false;
  }
  
  SubType.prototype.getSubValue=function(){
    return this.subproperty;
  }

  var instance1 = new SubType(15);
  instance1.colors.push("yellow");
  console.log(instance1);//SubType {property: 15, colors: Array(3), subproperty: false}
  
  var instance2 = new SubType(16);
  console.log(instance2);//SubType {property: 16, colors: Array(2), subproperty: false}
```

问题在与这样继承下来的子类，是无法使用父类的原型对象中的属性的，意味着所有的方法都要在父类构造函数中定义，因为`SuperType.call(this,age);`这句执行可以看作是运行函数，将当前子类的this传进去，里面运行的是`this.colors=['red','blue'];`这里的colors变量就会赋给子类实例，在浏览器上打印就会发现所有父类构造函数中定义的属性都变成了子类的属性。

```js
Array(3)
property:15
subproperty:false
```

### 组合继承

```js
 //父类
  function SuperType(age){
    this.property=age;
    this.colors=['red','blue'];
  }
  SuperType.prototype.getSuperValue=function(){
    return this.property;
  }
  //子类
  function SubType(age){
    //调用父类构造函数
    SuperType.call(this,age);
    this.subproperty=false;
  }
  SubType.prototype=new SuperType();
  SubType.prototype.constructor = SubType;//指向自身
  SubType.prototype.getSubValue=function(){
    return this.subproperty;
  }

  var instance1 = new SubType(15);
  instance1.colors.push("yellow");
  console.log(instance1);//SubType {property: 15, colors: Array(3), subproperty: false}
  
  var instance2 = new SubType(16);
  console.log(Object.getPrototypeOf(instance2));//SubType {property: 16, colors: Array(2), subproperty: false}
```
来看一下Chrome浏览器下的结果：

{% asset_img 组合继承.PNG 组合继承%}

可以看到SubType的原型对象是指向SuperType的实例，constructor指向SubType自身，有点像原生引用类型。

问题也来了：这里的colors出现了两次，一个是子类SubType实例中，一个是原型中出现。之所以有这样的问题，是因为SuperType构造函数调用了两次，一次是SubType构造函数中，此时只是像单纯执行下SuperType函数，里面的属性会成为子类实例属性。另一次是`new SuperType()`，这里会将父类实例赋给SubType原型对象，但这里的colors等属性会被屏蔽，因为之前一步已经在子类实例化中存在了。

### 原型式继承

```js
 function object(o){
    function F(){};
    F.prototype=o;
    return new F();
  }

  var person = {
    name:"XP",
    colors: ['blue','yellow']
  };

 var anotherPerson = object(person);
 anotherPerson.name = "XQ";
 anotherPerson.colors.push('green');

 var yetAnotherPerson = object(person);
 yetAnotherPerson.name = "LK";
 yetAnotherPerson.colors.push('hhhh');

 console.log(anotherPerson);
 console.log(Object.getPrototypeOf(yetAnotherPerson));
```
{% asset_img 原型式继承.PNG 原型式继承%}

这里，`object()`函数返回的一个新对象，它的原型对象就是要继承的那个对象，这里是person。这种方式意味着person对象和anotherPerson和yetAnotherPerson共享一些应用属性，如colors。

这种方式的用途在于只想单纯的让一个对象与另一个对象保持类似（这句话的含义是，我的理解是，这里的对象都是单实例的，继承下来是共用的），而不用使用构造函数这么麻烦的方式。当然，使用JS原生的方法`Object.create()`也是规范化了这种原型式继承方式。记住，这里的person对象只有一个实例，改变一个**引用类型属性值**，如colors，会影响另外的实例！！

### 寄生式继承
```js
function createAnother(original){
  var clone = object(original);
  clone.sayHi = function() {
    console.log('hi');
  };
  return clone;
}
```


缺点：无法复用函数sayHi,降低效率。

### 强大的寄生组合式继承

所谓的寄生组合式继承，即通过构造函数来继承属性，通过原型链的混成形式来继承方法。

举个例子:
先来个准备
```js
function Object(o){
  function F(){};
  F.prototype=o;
  return new F();
}

function inheritPrototype(subType,superType){
  var prototype=Object(subType.prototype);//创建对象
  prototype.constructor=subType;//增强对象
  subType.prototype=prototype;//指定对象
}

```

```js
//父类
function SuperType(name){
  this.name = name;
  this.colors = ['red','blue','green'];
}

SuperType.prototype.sayName = function() {
  return this.name;
}

//子类
function SubType(name,age){
  SuperType.call(this,name);
  this.age = age;
}

//寄生式组合

inheritPrototype(SubType,SuperType);

//子类添加自己的方法
SubType.prototype.sayAge = function() {
  return this.age;
}

```

运行看结果：

{% asset_img 寄生组合式继承.PNG 寄生组合式继承%}

可以看到父类的属性在子类中实例化了，而父类的方法sayName则被共用。