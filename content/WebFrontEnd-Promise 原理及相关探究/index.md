---
title: Promise 原理及相关探究
date: 2019-11-07 21:07:51
category: WebFrontEnd
tags: JS_Deep 异步
openreward: true
---

## 实现

以下代码为实现一个 Promise/A+ 规范的 polyfill：

```js
// Promise/A+
const STATUS = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected'
}

class MyPromise {
    constructor(executor) {
        this._status = STATUS.PENDING // 初始为 pending 状态
        this._value = undefined // then 的回调
        this._resolveQueue = [] // resolve 时触发的成功队列
        this._rejectQueue = [] // reject 时触发的失败队列

        const resolve = value => {
            const run = () => {
                // Promise/A+ 规范规定的 Promise 状态只能从 pending 触发，变成 fulfilled
                if (this._status === STATUS.PENDING) {
                    this._status = STATUS.FULFILLED
                    this._value = value
                    // 执行 resolve 回调
                    // 这里之所以使用一个队列来储存回调，是为了实现规范要求的 "then 方法可以被同一个 promise 调用多次"
                    // 如果使用一个变量而非队列来储存回调，那么即使多次 p1.then() 也只会执行一次回调
                    while(this._resolveQueue.length) {
                        const callback = this._resolveQueue.shift()
                        callback(value)
                    }
                }
            }
            //把 resolve 执行回调的操作封装成一个函数,放进 setTimeout 里,以实现 promise 异步调用的特性（规范上是微任务，这里是宏任务）
            setTimeout(run)
        }
        // 同 resolve
        const reject = value => {
            const run = () => {
            if (this._status === STATUS.PENDING) {
                this._status = STATUS.REJECTED
                this._value = value

                while (this._rejectQueue.length) {
                    const callback = this._rejectQueue.shift()
                    callback(value)
                }
            }
            }
            setTimeout(run)
        }

        // new Promise() 时立即执行 executor，并传入 resolve 和 reject
        executor(resolve, reject)
    }
    // then 方法,接收一个成功的回调和一个失败的回调
    then(onFulfilled, onRejected) {
        // 根据规范，如果 then 的参数不是 function，则忽略它, 让值继续往下传递，链式调用继续往下执行
        typeof onFulfilled !== 'function' ? onFulfilled = value => value : null
        typeof onRejected !== 'function' ? onRejected = value => value : null

        // then 返回一个新的 promise
        return new MyPromise((resolve, reject) => {
            const resolveFn = value => {
                try {
                    const x = onFulfilled(value)
                    // 分类讨论返回值,如果是 Promise，那么等待 Promise 状态变更,否则直接 resolve
                    x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
                } catch(e) {
                    reject(e)
                }
            }
            const rejectFn = error => {
                try {
                    const x = onRejected(error)
                    x instanceof MyPromise ? x.then(resolve, reject) : reject(x)
                } catch(error) {
                    reject(e)
                }
            }

            switch(this._status) {
                case STATUS.PENDING:
                    this._resolveQueue.push(resolveFn)
                    this._rejectQueue.push(rejectFn)
                    break
                case STATUS.FULFILLED:
                    resolveFn(this._value)
                    break
                case STATUS.REJECTED:
                    rejectFn(this._value)
                    break
            }
        })
    }
    // catch 只是一个 then 的别名
    catch(rejectFn) {
        return this.then(undefined, rejectFn)
    }
    finally(callback) {
        return this.then(
            // MyPromise.resolve 执行回调,并在 then 中 return 结果传递给后面的 Promise
            value => MyPromise.resolve(callback()).then(() => value),
            error => MyPromise.resolve(callback()).then(() => error)
        )
    }
    // 静态方法
    static resolve(value) {
        return value instanceof MyPromise ? value : new MyPromise(resolve => resolve(value))
    }
    static reject(error) {
        return new MyPromise((resolve, reject) => reject(error))
    }
    // 静态all方法
    static all(promiseArr) {
        let count = 0
        let result = []
        return new MyPromise((resolve, reject) => {
            if (!promiseArr.length) {
                return resolve(result)
            }
            promiseArr.forEach((p, i) => {
                MyPromise.resolve(p).then(
                    value => {
                        count++
                        result[i] = value
                        if (count === promiseArr.length) {
                            resolve(result)
                        }
                    },
                    error => {
                        reject(error)
                    }
                )
            })
        })
    }
    // 静态 race 方法，只要有一个成功或者失败，就回调
    static race(promiseArr) {
        return new MyPromise((resolve, reject) => {
            promiseArr.forEach(p => {
                MyPromise.resolve(p).then(value => {
                        resolve(value)
                    }, error => {
                        reject(error)
                    })
            })
        })
    }
}
```

## 参考

+ [JavaScript Promise：简介  \|  Web Fundamentals  |  Google Developers](https://developers.google.com/web/fundamentals/primers/promises)
+ [9k字 \| Promise/async/Generator实现原理解析 - 掘金](https://juejin.im/post/5e3b9ae26fb9a07ca714a5cc)
