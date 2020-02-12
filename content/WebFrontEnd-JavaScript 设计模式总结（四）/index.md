---
title: JavaScript 设计模式总结（四）
date: 2019-12-15 12:42:23
category: WebFrontEnd
tags: JS_Deep 设计模式 读书笔记
openreward: true
---

## 行为型设计模式

行为姓设计模式用于不同对象之间职责划分或者算法抽象，行为型设计及模式不仅仅设计类和对象，还涉及类或者对象之间的交流模式并加以实现。

### 1.模版方法模式（Template Method）

父类定义一组操作算法骨架，而将一些实现步骤延迟到子类中，使得子类可以不改变父类的算法结构的同时可重新定义算法中某些实现步骤。

模版方法的核心在于对方法的重用，它将核心方法封装在基类中，让子类继承基类的方法，实现基类方法的共享，达到方法共用。这种设计模式也将导致基类控制子类必须遵循某些规则，这是一种行为的约束。

子类继承的方法亦是可以拓展的，这就要求对基类继承的方法进行重写。需要在拓展和约束之间达成一个平衡。

```js
// 模版基类 基础提示框
const Alert = function(data) {
  if (!data) {
    return;
  }
  // 内容
  this.content = data.content
  // 提示框面板
  this.panel = document.createElement('div')
  // 提示内容组件
  this.contentNode = document.createElement('p')
  // 确定按钮组件
  this.confirmBtn = document.createElement('span')
  // 关闭按钮组件
  this.closeBtn = document.createElement('b')
  // 提示框面板添加类
  this.pannel.className = 'alert'
  // 关闭按钮添加类
  this.closeBtn.className = 'a-close'
  // 确定按钮添加类
  this.confirmBtn.className = 'a-confirm'
  // 确定按钮的文案
  this.confirmBtn.innnerHTML = data.confirm || '确认'
  // 提示内容添加文本
  this.contentNode.innnerHTML = this.content
  // 确定按钮
  this.success = data.success || function() {}
  // 关闭按钮执行方法
  this.fail = data.fail || function() {}
}

// 提示框原型方法
Alert.ptototype = {
  init() {},
  bindEvent() {}
  hide() {},
  show() {}
}

// 子类继承 标题提示框
const TitleAlert = function(data) {
  // 继承父类
  Alert.call(this, data)
  // 设置标题内容
  this.title = data.title
  // 创建标题组件
  this.titleNode = document.createElement('h3')
  // 组件中的标题内容
  this.titleNode.innerHTML = this.title
}
// 继承基本提示框方法
TitleAlert.prototype = new Alert()
// 对基本方法的拓展
TitleAlert.prototype.init = function() {}
```

### 2.观察者模式（Observer）

观察者模式，又称为发布-订阅模式或者消息机制，定义了一种依赖关系，解决了主体对象与观察者之间功能的耦合。

观察者最重要的作用是解决了类或对象之间的耦合，解耦两个相互依赖的对象，使其依赖于观察者的消息机制。这样对于任意一个订阅者对象来说，其他订阅者对象的改变不会影响到自身。对于每一个订阅者来说，其自身既可以是消息的发出者也可以是执行者，这都依赖于调用观察者对象的三种中的哪一种。

```js
const Observer = (function() {
  // 消息容器
  const __messages = {}
  return {
    // 注册信息接口
    regist(type, fn) {
      // 如果此消息不存在则应该创建一个该消息类型
      if (typeof __messages[type] === 'undefined') {
        __messages[type] = [fn]
      } else {
        // 将该方法推入此消息队列中
        __messages[type].push(fn)
      }
    },
    // 发布信息接口
    fire(type, args) {
      if (!__messages[type]) {
        return
      }
      // 定义消息信息
      const events = {
        type: type,
        args: args || {}
      }
      for (let i = 0; i < __messages[type].length; i++) {
        __messages[type][i].call(this, events)
      }
    },
    // 移除信息接口
    remove(type, fn) {
      // 如果消息队列存在
      if (__messages[type] instanceof Array) {
        // 从最后一个消息遍历
        for (let i = __messages[type].length - 1; i >= 0; i--) {
          // 如果存在则移除相应的方法
          __messages[type][i] === fn && __messages[type].splice(i, 1)
        }
      }
    }
  }
})()

// 测试
Observer.regist('test', function(e) {
  console.log(e.type, e.args.msg)
})

Observer.fire('test', {
  msg: '传递参数'
})
```

### 3.状态模式（State）

当一个对象的内部状态发生改变时，会导致其行为的改变，这看起来像是改变了对象。

状态模式用于解决程序中臃肿的分支判断语句问题，将每一个分支转化为一种状态独立出来，方便每种状态的管理又不至于每次执行遍历所有分支。

```js
// 定义一个状态
const MarryState = function() {
  // 内部状态私有变量
  let _currentState = {}
  // 动作与状态方法映射
  const state = {
    jump() {},
    move() {},
    shoot() {},
    squat() {}
  }
  // 动作控制类
  const Action = {
    // 改变状态方法
    changeState() {
      const arg = arguments
      // 重置内部状态
      _currentState = {}
      if (arg.length) {
        for (let i = 0; i < arg.length; i++) {
          // 向内部状态中添加动作
          _currentState[arg[i]] = true
        }
      }
      // 返回控制类
      return this
    },
    // 执行动作
    goes() {
      for (let i in _currentState) {
        state[i] && state[i]()
      }
      return this
    }
  }
  return {
    change: Action.changeState,
    goes: Action.goes
  }
}

//使用
MarryState()
  .change('jump', 'shoot')
  .goes()
  .goes()
  .change('shoot')
  .goes()
```

### 4.策略模式（Strategy）

策略模式将定义的一组算法封装起来，使其相互之间可以替换。封装的算法具有一定独立性，不会随着客户端变化而变化。

策略模式使得算法脱离模块逻辑而独立管理，使我们可以专心研发算法，而不必受模块逻辑所约束。

```js
// 价格策略对象
const PriceStrategy = function() {
  // 内部算法对象
  const strategy = {
    // 返30
    return30(price) {},
    // 返50
    return50(price) {},
    // 返60
    return60(price) {},
    // 返70
    return70(price) {},
  }

  return {
    useStrategy(algorithm, price) {
      return strategy[algorithm] && strategy[algorithm](price)
    },
    addStragtegy(type, fn) {
      strategy[type] = fn
    }
  }
}
```

### 5.职责链模式（Chain of Responsiblity）

职责链模式解决请求的发送者与请求的接受者之间的耦合，通过职责链上的多个对象对分解请求流程，实现请求在多个对象之间的传递，直到最后一个对象完成请求的处理。

职责链模式定义了请求的传递方向，通过多个对象对请求的传递，实现一个复杂的逻辑操作。因此职责链模式将负责的需求颗粒化，逐一实现每个对象分内的需求，并将请求顺序地传递。对于职责链上的每一个对象，它既可能是请求的发起者也可能是请求的接收者。不仅解决了原请求的发起者与原请求的接收者之间的耦合，也方便单元测试。

```js
// 案例一：同步职责链
function order500(orderType,isPay,count){
    if(orderType == 1 && isPay == true)    {
        console.log('亲爱的用户，您中奖了100元红包了')
    }else {
        //我不知道下一个节点是谁,反正把请求往后面传递
        return 'nextSuccessor'
    }
}
function order200(orderType,isPay,count) {
    if(orderType == 2 && isPay == true) {
        console.log('亲爱的用户，您中奖了20元红包了')
    }else {
        //我不知道下一个节点是谁,反正把请求往后面传递
        return 'nextSuccessor'
    }
}
function orderNormal(orderType,isPay,count){
    // 普通用户来处理中奖信息
    if(count > 0) {
        console.log("亲爱的用户，您已抽到10元优惠卷");
    }else {
        console.log("亲爱的用户，请再接再厉哦");
    }
}
const Chain = function(fn){
    this.fn = fn
    this.successor = null
}
Chain.prototype.setNextSuccessor = function(successor){
    return this.successor = successor
}
// 把请求往下传递
Chain.prototype.passRequest = function(){
    const ret = this.fn.apply(this, arguments)
    if(ret === 'nextSuccessor') {
        return this.successor && this.successor.passRequest.apply(this.successor,arguments)
    }
    return ret
}


// 把3个函数分别包装成职责链节点：
const chainOrder500 = new Chain(order500)
const chainOrder200 = new Chain(order200)
const chainOrderNormal = new Chain(orderNormal)
// 然后指定节点在职责链中的顺序
chainOrder500.setNextSuccessor(chainOrder200)
chainOrder200.setNextSuccessor(chainOrderNormal)

//最后把请求传递给第一个节点：
chainOrder500.passRequest(1,true,500)  // 亲爱的用户，您中奖了100元红包了
chainOrder500.passRequest(2,true,500)  // 亲爱的用户，您中奖了20元红包了
chainOrder500.passRequest(3,true,500)  // 亲爱的用户，您已抽到10元优惠卷
chainOrder500.passRequest(1,false,0)   // 亲爱的用户，请再接再厉哦

// 案例二：异步职责链
function Fn1() {
    console.log(1)
    return "nextSuccessor"
}
function Fn2() {
    console.log(2)
    const self = this
    setTimeout(function(){
        self.next()
    },1000)
}
function Fn3() {
    console.log(3)
}
// 下面需要编写职责链模式的封装构造函数方法
const Chain = function(fn){
    this.fn = fn;
    this.successor = null
};
Chain.prototype.setNextSuccessor = function(successor){
    return this.successor = successor
}
// 把请求往下传递
Chain.prototype.passRequest = function(){
    var ret = this.fn.apply(this,arguments)
    if(ret === 'nextSuccessor') {
        return this.successor && this.successor.passRequest.apply(this.successor,arguments)
    }
    return ret
}
Chain.prototype.next = function(){
    return this.successor && this.successor.passRequest.apply(this.successor,arguments)
}

// 把3个函数分别包装成职责链节点：
var chainFn1 = new Chain(Fn1)
var chainFn2 = new Chain(Fn2)
var chainFn3 = new Chain(Fn3)

// 然后指定节点在职责链中的顺序
chainFn1.setNextSuccessor(chainFn2)
chainFn2.setNextSuccessor(chainFn3)

chainFn1.passRequest()  // 打印出1，2 过1秒后 会打印出3
```

### 6.命令模式（Command）

命令模式将请求与实现解耦并封装成独立对象，从而使不同的请求对客户端的实现参数化。

命令模式是将执行的命令封装，解决命令的发起者与命令的执行者之间的耦合。每一条命令实质上是一个操作。命令的使用者无须了解命令的接口是如何实现、如何执行的。新的命令也可以很容易添加进去，供使用者使用。

```js
const CanvasCommand = (function() {
  // 获取 canvas
  const canvas = document.getElementById('canvas')
  // 获取上下文引用
  const ctx = canvas.getContext('2d')
  // 内部对象方法
  const Action = {
    // 填充色彩
    fillStyle(c) {
      ctx.fillStyle = c
    }
    // 填充矩形
    fillRect(x, y, width, height) {
      ctx.fillRect(x, y, width, height)
    }
  }
  return {
    // 命令接口
    excute(msg) {
      if (!msg) {
        return;
      }
      if (msg.length) {
        for (let i = 0; i < msg.length; i++) {
          arguments.callee(msg[i])
        } else {
          // 如果不是数组，则转换成数组，apply 第二个参数要求是数组
          msg.param = Object.prototype.toString.call(msg.param) === '[object Arrary]'
            ? msg.param
            : [msg.param]
          Action[msg.command].apply(Action, msg.param)
        }
      }
    }
  }
})()

```

### 7.访问者模式（Visitor）

访问者模式针对于对象结构中的元素，定义在不改变该对象的前提下访问结构中元素的新方法。

访问者模式解决数据与数据的操作方法之间的耦合，将数据的操作方法独立于数据，使其可以自由化演变。因此访问者更适合那些数据稳定，但是数据的操作方法易变的环境下。因此当操作环境改变时，可以自由修改操作方法以适应操作环境，而不用修改原数据，实现操作方法的拓展。同时对于同一个数据，它可以被多个访问对象所访问，极大增加了操作数据的灵活性。

```js
const Vistor = (function() {
  return {
    // 截取方法
    splice() {
      // splice 方法参数，从原参数的第二个参数开始算起
      const args = Array.prototype.splice.call(arguments, 1)
      // 对第一个参数对象执行 splice 方法
      return Array.prototype.splice.apply(arguments[0], args)
    },
    // 追加数据方法
    push() {
      // 强化类数组对象，使其拥有 length 属性
      const len = arguments[0].length || 0
      // 添加的数据从原参数的第二个参数算起
      const args = this.splice(arguments, 1)
      // 校正 length 属性
      arguments[0].length = len + arguments.length - 1
      // 对第一个参数对象执行 push 方法
      return Array.prototype.push.apply(arguments[0], args)
    },
    pop() {
      // 对第一个参数对象执行 pop 方法
      return Array.prototype.pop.apply(arguments[0])
    }
  }
})()

// 实例
const a = new Object()
console.log(a.length) // undefined
Vistor.push(a, 1,2,3,4)
console.log(a.length) // 4
console.log(a) // Object { 0: 1, 1: 2, 2: 3, 3: 4, length: 4 }
```

### 8.中介者模式（Mediator）

中介者模式：通过中介者对象封装一系列对象之间的交互，使对象之间不再相互引用，降低耦合。

同观察者模式一样，中介者模式的主要业务也是通过模块间的复杂通信，来解决模块间的耦合。对于中介者对象的本质是分装多个对象的交互，并且这些对象的交互一般都是在中介者内部实现。

与外观模式的封装特性相比，中介者模式对多个对象交互地封装，且这些对象一般处于同一层面上，并且封装的交互在中介者内部，而外观模式封装的目的是为了提供更简单的易用接口，而不会添加其它功能。

与观察者模式相比，虽然两种模式都是通过消息传递实现对象间或模块间的解耦。观察者模式中的订阅者是双向的，既可以是消息的发布者，也可以是消息的订阅者。而在中介者模式中，订阅者是单向的，只能是消息的订阅者。而消息统一由中介者对象发布，所有的订阅者对象间接地被中介者管理。

```js
const Mediator = function() {
  // 消息信息
  const _msg = {}
  return {
    register(type, action) {
      if (_msg[type]) {
        _msg[type].push(action)
      } else {
        _msg[type] = []
        _msg[type].push(action)
      }
    },
    send(type) {
      if (_msg[type]) {
        for (let i = 0; i < _msg[type].length; i++) {
          _msg[type][i] && _msg[type][i]()
        }
      }
    }
  }
}

// 注册使用
// 举例：用户收藏导航模块
(function() {
  // ...其他交互逻辑
  Mediator.register('hideAllNavNum', () => {
    showHideNavWight()
  })
  Mediator.register('hideAllNavUrl', () => {
    showHideNavWight()
  })
})()

// 设置模块
(function() {
  const hideNum = document.getElementById('hide_num')

  hideNum.onchange = () => {
    Mediator.send('hideAllNavNum')
  }
})()
```

### 9.备忘录模式（Memento）

备忘录模式：在不破坏对象的封装性的前提下，在对象之外捕获并保存该对象内部的状态以便日后对象使用或者对象恢复到以前的某个状态。

备忘录模式主要是对现有的数据进行缓存，避免了某些场景反复请求服务端同样的数据。

```js
// Page 备忘录类
const Page = function() {
  // 缓存对象
  const cache = {}

  return function(page, fn) {
    if (cache[page]) {
      showPage(page, cache[page])
      fn && fn()
    } else {
      $.post('/data', (res) => {
        showPage(page, res.data)
        // 缓存
        cache[page] = res.data
        // 执行回调
        fn && fn()
      })
    }
  }
}()
```

### 10.迭代器模式（Iterator）

迭代器模式：在不暴露对象内部结构的同时，可以顺序地访问聚合对象内部的元素。

通过迭代器，可以顺序地访问一个聚合对象中的每一个元素，可以极大简化代码中的循环语句。这些简化的循环语句实质上隐形地移动到了迭代器中。

```js
// 案例一：迭代获取元素
const Iterator = function(items, container) {
  const container = container && document.getElementById(container) || document
  const items = container.getElementByTagName(items)
  return {
    first() {},
    second() {},
    pre() {},
    next() {},
    dealEach() {},
    dealItem() {},
    exclusive() {}
  }
}

// 案例二：数组迭代器
const eachArray = function(arr, fn) {
  for (let i; i < arr.length; i++) {
    // 遍历数组
    if (fn.call(arr[i], i, arr[i]) === false) {
      break
    }
  }
}

// 案例三：对象迭代器
const eachObject = function(obj, fn) {
  for (var i in obj) {
    // 遍历数组
    if (fn.call(obj[i], i, obj[i]) === false) {
      break
    }
  }
}
```

### 11.解释器模式（Interpreter）

解释器模式：对于一种语言，给出其文法表示形式，并定义一种解释器，通过使用这种解释器来解释语言中定义的句子。

解释器即是对客户提出的需求，经过解析而形成的一个抽象解释程序。而是否可以应用解释器模式的一条重要准则是能否根据需求解析出一套完成的语法规则，无论该语法规则简单或是复杂都是必须。因为解释器要按照这套规则才能实现相应的功能。
