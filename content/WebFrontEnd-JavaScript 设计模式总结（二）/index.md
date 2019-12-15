---
title: JavaScript 设计模式总结（二）
date: 2019-12-08 18:06:02
category: WebFrontEnd
tags: JS_Deep 设计模式 读书笔记
openreward: true
---

这是设计模式笔记的第二部分，从这一部分开始按类别整理各类设计模式。

## 目录

<!-- toc -->

- [创建型设计模式](#创建型设计模式)
  * [1. 简单工厂模式（Simple Factory）](#1-简单工厂模式（simple-factory）)
  * [2. 工厂方法模式（Factory Method）](#2-工厂方法模式（factory-method）)
  * [3. 抽象工厂模式（Abstract Factory）](#3-抽象工厂模式（abstract-factory）)
  * [4. 建造者模式（Builder）](#4-建造者模式（builder）)
  * [5. 原型模式（Prototype）](#5-原型模式（prototype）)
  * [6. 单例模式（Singleton）](#6-单例模式（singleton）)

<!-- tocstop -->

## 创建型设计模式

创建型设计模式是一类处理对象创建的设计模式，通过某种方式控制对象的创建来避免基本对象创建时可能导致设计上的问题或者增加设计上的复杂度。

### 1. 简单工厂模式（Simple Factory）

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

### 2. 工厂方法模式（Factory Method）

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

### 3. 抽象工厂模式（Abstract Factory）

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

### 4. 建造者模式（Builder）

与工厂模式相比，工厂模式追求的是创建的结果，而建造者模式不仅仅可以得到创建的结果，还参与了创建的具体过程，对于创建的具体实现的细节也参与了干涉，使得创建的对象更为复杂，或者说**这种模式下创建的对象是一个复合对象**。

```js
// 创建一位人类
const Human = function(param) {
  // 技能
  this.skill = param && param.skill || '保密'
  // 爱好
  this.hobby = param && param.hobby || '保密'
}
// 人类的原型方法
Human.prototype = {
  getSkill() {
    return this.skill
  },
  getHobby() {
    return this.hobby
  }
}

// 实例化姓名类
const Named = function(name) {
  const that = this
  // 构造器解析姓名
  (function(name, that) {
    that.wholeName = name
    if (name.indexOf(' ') > -1) {
      that.FirstName = name.slice(0, name.indexOf(' '))
      that.LastName = name.slice(name.indexOf(' '))
    }
  })(name, that)
}

// 职位类
const Work = function(work) {
  const that = this
  // 构造器
  (function(work, that) {
    switch(work) {
      case 'code':
        that.work = '工程师'
        that.workDescript = '每天沉醉于编程'
        break
      case 'UI':
        that.work = '设计师'
        that.workDescript = '设计更似一种艺术'
        break
      case 'teach':
        that.work = '教师'
        that.workDescript = '分享也是一种快乐'
        break
      default:
        that.work = work
        that.workDescript = '职位不清楚'
    }
  })(work, that)
}

Work.prototype = {
  changeWork(work) {
    this.work = work
  },
  changeWorkDescript(des) {
    this.workDescript = des
  }
}

/**
* 应聘者的建造者方法
* name: 姓名
* work: 职位
**/
const Person = function(name, work) {
  // 创建应聘者缓存对象
  const _person = new Human()
  // 创建应聘者姓名解析函数
  _person.name = new Named(name)
  // 创建应聘者期望职位
  _person.work = new Work(work)
  // 返回
  return _person
}

// 建造者模式下的实例

const person = new Person('xiao ming', 'code')
```

### 5. 原型模式（Prototype）

原型模式可以让多个对象分享同一个原型对象的属性和方法。

```js
const prototypeExtend = function() {
  const F = function() {}
  const args = arguments
  for(let i = 0; i < args.length; i++) {
    for(let j in args[i]) {
      // 将这些属性复制到缓存类中去
      F.prototype[j] = args[i][j]
    }
  }
  return new F()
}

// 使用
const penguin = prototypeExtend(
  {
    speed: 20,
    swim: function() {
      console.log('游泳速度' + this.speed)
    }
  },
  {
    run: function(speed) {
      console.log('奔跑速度' + speed)
    }
  },
  {
    jump: function() {
      console.log('跳跃动作')
    }
  }
)

penguin.swim();
penguin.run(10);
penguin.jump();
```

### 6. 单例模式（Singleton）

单例模式这里介绍命名空间管理、静态变量、惰性单例三种场景。但其实随着 es module 的发展，一个文件就是一个模块，大部分场景可能不再需要单例模式这么冗余的模块设计。

```js
// 命名空间管理
const Module = {
  Util: {
    methodA() {},
    methodB() {}
  },
  Tool: {
    methodA() {},
    methodB() {}
  },
  Ajax: {
    get() {},
    post() {}
  }
}

// 使用
Module.Util.methodA();
Module.Util.methodB();
```

```js
// 无法修改的静态变量
const Conf = (function() {
  const conf = {
    MAX_NUM: 100,
    MIN_NUM: 1,
    COUNT: 1000
  }
  // 返回取值对象
  return {
    get(name) {
      return conf[name] ? conf[name] : null
    }
  }
})()

// 使用
const count = Conf.get('count')
```

```js
// 惰性单例
const LazySingle = (function() {
  const _instance = null
  //单例
  function Single() {
    return {
      pulicMethod() {},
      pulicProperty: 1.0
    }
  }
  // 获取单例对象接口
  return function() {
    if (!_instance) {
      _instance = Single()
    }
    // 返回单例
    return Single
  }
})()

// 使用
LazySingle().pulicProperty // 1.0
```


