---
title: 对比 Ajax 和 Fetch
date: 2020-12-05 17:23:45
category: NetWork
tags: Net_Basic Request
openreward: true
---

## 目录

<!-- toc -->

- [前言](#前言)
- [Ajax](#Ajax)
  * [使用案例](#使用案例)
  * [xhr.onload](#xhronload)
  * [xhr.onprogress](#xhronprogress)
  * [xhr.abort](#xhrabort)
  * [header](#header)
  * [POST 请求](#POST-请求)
  * [上传进度](#上传进度)
  * [跨域请求](#跨域请求)
- [Fetch](#Fetch)
  * [请求和响应](#请求和响应)
  * [Response header](#Response-header)
  * [Request header](#Request-header)
  * [POST 请求](#POST-请求-1)
  * [进度事件](#进度事件)
  * [中断请求](#中断请求)
  * [跨域请求](#跨域请求-1)
- [Ajax 和 Fetch 对比](#Ajax-和-Fetch-对比)
- [参考](#参考)

<!-- tocstop -->

## 前言

前端领域中网络请求是一个绕不开的话题，目前来说，有两种流行的方式可以做到： Ajax、 Fetch API。

本文将探讨这两种工具各自的特点和区别。

## Ajax

Ajax 是一个成熟但在当下（2020）有些过时的技术，其核心是 XMLHttpRequest 对象。出于理解的需要，对其进行整理。

> *[MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/AJAX) 资源参考：* 
>
> Ajax 全称 Asynchronous JavaScript + XML（异步 JavaScript 和 XML）。其本身不是一种新技术，而是一个在 2005 年被 Jesse James Garrett 提出的新术语，用来描述一种使用现有技术集合的‘新’方法，包括: HTML 或 XHTML, CSS, JavaScript, DOM, XML, XSLT, 以及最重要的 XMLHttpRequest。
> 

XMLHttpRequest 之所以使用“XML”开头，是因为在它诞生之时用于异步数据交换的主要格式便是 XML。不过现在它能传递的数据不只是 XML，还有 JSON 这些格式。

### 使用案例

它的 API 也略显古老，下面是一个例子：

```js
const xhr = new XMLHttpRequest();

// 请求配置
xhr.open('GET', '/example/load');

// 通过网络发送请求
xhr.send(null);

// 响应事件，老版本的 API 可以设置 onreadystatechange 方法
xhr.onload = function() {
  if (xhr.status === 200) {
     // do something....
  }
};

// 进度条事件
xhr.onprogress = function(event) {
 if (event.lengthComputable) {
    alert(`Received ${event.loaded} of ${event.total} bytes`);
  }
};

// 错误事件
xhr.onerror = function() {
  // do somthing...
};
```

### xhr.onload

在 xhr.onload 用于处理请求完成后的逻辑。在 onload 中 可以读到 xhr 对象的属性：

+ xhr.readyState：xhr 自身的状态 
+ xhr.status： http 状态码 200，404 等，如果出现非 http 错误，则为 0
+ xhr.statusText：http 状态消息，状态码 200 对应于 OK，404 对应于 Not Found
+ xhr.response：服务器 response body
+ xhr.responseType: 设置响应格式，默认为字符串 ''

xhr.responseType 可以设置响应格式：

+ ''（默认）—— 响应格式为字符串
+ 'text' —— 响应格式为字符串
+ 'arraybuffer' —— 响应格式为 ArrayBuffer（对于二进制数据，请参见 ArrayBuffer，二进制数组），
+ 'blob' —— 响应格式为 Blob（对于二进制数据，请参见 Blob），
+ 'document' —— 响应格式为 XML document（可以使用 XPath 和其他 XML 方法），
+ 'json' —— 响应格式为 JSON（自动解析数据）。


xhr.readyState 指示 xhr 自身状态的变化： 

+ UNSENT = 0; // 初始状态
+ OPENED = 1; // open 被调用
+ HEADERS_RECEIVED = 2; // 接收到 response header
+ LOADING = 3; // 响应正在被加载（接收到一个数据包）
+ DONE = 4; // 请求完成

XMLHttpRequest 对象以 0 → 1 → 2 → 3 → … → 3 → 4 的顺序在它们之间转变。每当通过网络接收到一个数据包，就会重复一次状态 3。

我们可以使用 readystatechange 事件来跟踪它们：

```js
// 不推荐使用
xhr.onreadystatechange = function() {
  if (xhr.readyState == 3) {
    // 加载中
  }
  if (xhr.readyState == 4) {
    // 请求完成
  }
};
```

> **注意：**
> 在旧的脚本中，可能会看到 xhr.responseText 、 xhr.responseXML、readyState、onreadystatechange 属性的使用，它们是由于历史原因而存在的，现在早就被 xhr.response、onload、onerror 事件监听器替代。
> 

### xhr.onprogress

onprogress 用于指示进度信息。

在浏览器接收数据期间，这个事件会反复触 发。每次触发时，onprogress 事件处理程序都会收到 event 对象。有了这些信息，就可以给用户提供进度条了。

在 onprogress 中 event 主要属性:

+ event.lengthComputable: 表示进度信息是否可用
+ event.loaded: 已经加载的字节数
+ event.total：总共的字节数
+ event.target：当前发送请求的 xhr 对象

### xhr.abort

在 ajax 中，如果需要终止请求，则可以使用：

```js
xhr.abort(); // 终止请求

xhr.onbort = function() {
  // 终止事件的处理
}
```

### header

XMLHttpRequest 允许发送自定义 header，并且可以从响应中读取 header。

header 有三种方法：

1. setRequestHeader()

使用给定的 name 和 value 设置 request header。

```js
xhr.setRequestHeader('Content-Type', 'application/json');
```

2. getResponseHeader()

获取具有给定 name 的 header（Set-Cookie 和 Set-Cookie2 除外）。

```js
xhr.getResponseHeader('Content-Type')
```

3. getAllResponseHeaders()

返回除 Set-Cookie 和 Set-Cookie2 外的所有 response header。

```text
Cache-Control: max-age=31536000
Content-Length: 4260
Content-Type: image/png
Date: Sat, 08 Sep 2012 16:53:16 GMT
```

### POST 请求

要建立一个 POST 请求，我们可以使用内建的 FormData 对象。

```html
<form name="person">
  <input name="name" value="John">
  <input name="surname" value="Smith">
</form>

<script>
  // 从表单预填充 FormData
  let formData = new FormData(document.forms.person);

  // 附加一个字段
  formData.append("middle", "Lee");

  // 将其发送出去
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "/article/xmlhttprequest/post/user");
  xhr.send(formData);

  xhr.onload = () => alert(xhr.response);
</script>
```

这将以 multipart/form-data 编码发送表单。

或者也可以用 json 格式发送：

```js
let xhr = new XMLHttpRequest();

let json = JSON.stringify({
  name: "John",
  surname: "Smith"
});

xhr.open("POST", '/submit')
xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

xhr.send(json);
```

*.send(body)* 方法几乎可以发送任何 body，包括 Blob 和 BufferSource 对象。

### 上传进度

onprogress 事件仅在下载阶段触发，如果我们需要跟踪 POST 上传阶段的进度情况，可以使用 xhr.upload。

它会生成事件，类似于 xhr，但是 xhr.upload 仅在上传时触发它们：

+ onloadstart: 上传开始。
+ onprogress: 上传期间定期触发。
+ onabort: 上传中止。
+ onerror: 非 HTTP 错误。
+ onload: 上传成功完成。
+ ontimeout: 上传超时（如果设置了 timeout 属性）。
+ onloadend: 上传完成，无论成功还是 error。

```js
xhr.upload.onprogress = function(event) {
  alert(`Uploaded ${event.loaded} of ${event.total} bytes`);
};

xhr.upload.onload = function() {
  alert(`Upload finished successfully.`);
};

xhr.upload.onerror = function() {
  alert(`Error during the upload: ${xhr.status}`);
};
```

### 跨域请求

XMLHttpRequest 原生支持 CORS 策略进行跨域请求。

默认情况下，跨域请求不提供凭据(cookie、HTTP 认证和客户端 SSL 证书)。要启用它们，可以将 xhr.withCredentials 设置为 true：

```js
let xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.open('POST', 'http://anywhere.com/request');
...
```

如果服务器允许带凭据的请求，那么可以在响应中包含如下 HTTP 头部: *Access-Control-Allow-Credentials: true*。

如果发送了凭据请求而服务器返回的响应中没有这个头部，则浏览器不会把响应交给 JavaScript (responseText 是空字符串，status 是 0，onerror 被调用)。注意，服务器也可以在预检请求的响应中发送这个 HTTP 头部，以表明这个源允许发送凭据请求。

## Fetch

Fetch API 是新一代的网络请求接口。它能够执行 XMLHttpRequest 对象的所有任务，但更容易使用，基于 Promise 异步风格的接口相比于 XMLHttpRequest 丑陋的 API 设计更加现代化。同时这个 API 能够应用在服务线程 (service worker)中，提供拦截、重定向和修改通过 fetch() 生成的请求接口。

### 请求和响应

Fetch 发送一个请求的基本语法：

```js
let promise = fetch(url, [options])
```

+ url： 要访问的 URL。
+ options： 可选参数：method，header 等

浏览器立即启动请求，并返回一个用来获取结果的 promise 对象。

获取响应主要是通过 promise 对象返回的内建的 response 实例进行解析：

```js
let response = await fetch(url);

if (response.ok) { // 如果 HTTP 状态码为 200-299
  // 获取 response body
  let json = await response.json();
} else {
  alert("HTTP-Error: " + response.status);
}
```

我们可以在 response 的属性检查响应状态：

+ ok: 如果 HTTP 状态码为 200-299，则为 true
+ status：HTTP 状态码
+ statusText: HTTP 状态文本

这里要注意的是，使用 Fetch API，不管网络请求是成功的 2xx 还是失败的 5xx，只要有响应，就会进入到 Promise 的 resovle 流程中，只有在请求失败（服务器没有响应），才会 reject。所以要对于不同的请求失败要有不同的容错处理。

response 提供了多种基于 Promise 的方法，来以不同的格式访问 body 数据：

+ response.text(): 读取 response，并以文本形式返回数据，
+ response.json(): 将 response 解析为 JSON，
+ response.formData(): 以 FormData 对象的形式返回
+ response.blob(): 以 Blob（具有类型的二进制数据）形式返回
+ response.arrayBuffer(): 以 ArrayBuffer（低级别的二进制数据）形式返回

另外，response 自身还有一个 body 属性。它是 ReadableStream 对象，它允许你逐块读取 body。这个在需要对数据进行更细化地操控的时候才用得到，比如读取下载进度（见下文）。

> **注意：**
> 只能选择一种读取 body 的方法。
>
>如果已经使用了 response.text() 方法来获取 response，那么如果再用 response.json()，则不会生效，因为 body 内容已经被处理过了。
>

### Response header

Response header 位于 response.headers 中的一个类似于 Map 的 header 对象。

它不是真正的 Map，但是它具有类似的方法，我们可以按名称（name）获取各个 header，或迭代它们：

```js
let response = await fetch(url);

// 获取一个 header
console.log(response.headers.get('Content-Type')); // application/json; charset=utf-8

// 迭代所有 header
for (let [key, value] of response.headers) {
  console.log(`${key} = ${value}`);
}
```

### Request header

要在 fetch 中设置 request header，可以使用 headers 选项。它有一个带有输出 header 的对象，如下所示：

```js
let response = fetch(protectedUrl, {
  headers: {
    Authentication: 'secret'
  }
});
```
但是有一些无法设置的 header（详见 [forbidden HTTP headers](https://fetch.spec.whatwg.org/#forbidden-header-name)）：

+ Access-Control-Request-Headers
+ Access-Control-Request-Method
+ Cookie
+ Cookie2
+ Host
+ ....

出于安全考虑，这些都是由浏览器控制。

### POST 请求

要创建一个 POST 请求，或者其他方法的请求，需要使用 fetch option 选项：

```js
let user = {
  name: 'John',
  surname: 'Smith'
};

let response = await fetch('/article/fetch/post/user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  body: JSON.stringify(user)
});

let result = await response.json();
alert(result.message);
```

其中 request body 可以是：

+ 字符串（例如 JSON 编码的）
+ FormData 对象，以 form/multipart 形式发送数据
+ Blob/BufferSource 发送二进制数据
+ URLSearchParams，以 x-www-form-urlencoded 编码形式发送数据，很少使用

### 进度事件

Fetch API 允许去跟踪下载进度，但无法跟踪上传进度。如果要用到上传进度，只能使用 XMLHttpRequest 对象。

要跟踪下载进度，我们可以使用 response.body 属性。它是 ReadableStream —— 一个特殊的对象，它可以逐块（chunk）提供 body。在 [Streams API](https://streams.spec.whatwg.org/#rs-class) 规范中有对 ReadableStream 的详细描述。

与 response.text()，response.json() 和其他方法不同，response.body 给予了对进度读取的完全控制，可以随时计算下载了多少。

下面是一个例子：

```js
// Step 1：启动 fetch，并获得一个 reader
let response = await fetch(url);

const reader = response.body.getReader();

// Step 2：获得总长度（length）
const contentLength = +response.headers.get('Content-Length');

// Step 3：读取数据
let receivedLength = 0; // 当前接收到了这么多字节
let chunks = []; // 接收到的二进制块的数组（包括 body）
while(true) {
  const {done, value} = await reader.read();

  if (done) {
    break;
  }

  chunks.push(value);
  receivedLength += value.length;

  console.log(`Received ${receivedLength} of ${contentLength}`)
}

// Step 4：将块连接到单个 Uint8Array
let chunksAll = new Uint8Array(receivedLength); // (4.1)
let position = 0;
for(let chunk of chunks) {
  chunksAll.set(chunk, position); // (4.2)
  position += chunk.length;
}

// Step 5：解码成字符串
let result = new TextDecoder("utf-8").decode(chunksAll);

console.log( JSON.parse(result));
```

### 中断请求

如上所述，fetch() 返回一个 promise。JavaScript 通常并没有“中止” promise 的概念。那么怎样才能取消一个正在执行的 fetch 呢？

为此可以使用一个特殊的内建对象：AbortController，它不仅可以中止 fetch，还可以中止其他异步任务。

```js
// 创建 AbortController 的实例
const controller = new AbortController()
const signal = controller.signal

// 监听 abort 事件，在 controller.abort() 执行后执行回调打印 
// 并且将 signal.aborted 设为 true
signal.addEventListener('abort', () => {
    console.log(signal.aborted) // true
})

// 触发中断
controller.abort()
```

控制器是一个极其简单的对象。

+ 它具有单个方法 abort()
+ 单个属性 signal，可以在这个属性上设置事件监听器。

当 abort() 被调用时：

+ controller.signal 就会触发 abort 事件。
+ controller.signal.aborted 属性变为 true

配合 fetch 使用，当一个 fetch 被中止时，它的 promise 就会给出一个 *error:AbortError* 的 reject，使用：

```js
// 1 秒后中止
let controller = new AbortController();

setTimeout(() => controller.abort(), 1000);

try {
  let response = await fetch('/article/fetch-abort/demo/hang', {
    signal: controller.signal
  });
} catch(err) {
  if (err.name == 'AbortError') { // handle abort()
    alert("Aborted!");
  } else {
    throw err;
  }
}
```

AbortController 还能一次性控制多个 fetch 异步请求，甚至自定义的异步任务：

```js
const controller = new AbortController();
const signal = controller.signal;
// 自定义任务
const selfJob = new Promise((resolve, reject) => {
  ...
  signal.addEventListener('abort', reject);
});
// 多个 fetch 任务
const urls = [...];
const fetchJobs = urls.map(url => fetch(url, {
  signal
}));

// 等待完成我们的任务和所有 fetch
let results = await Promise.all([...fetchJobs, selfJob]);

// 如果 controller.abort() 被从其他地方调用，
// 它将中止所有 fetch 和 selfJob
// controller.abort()
```

### 跨域请求

Fetch API 支持 CORS 跨域策略，可以在配置项目中这样配：

```js
let response = await fetch(url, {
  mode: 'cors'
})
```

mode 有如下选项：

+ same-origin: 任何跨源请求都不允许发送
+ cors: 允许遵守 CORS 协议的跨源请求
+ no-cors: 允许浏览器发送本次跨域请求，但是不能访问响应返回的内容

区别在于，在通过构造函数手动创建 Request 实例时，默认为 cors; 否则默认为 no-cors。

## Ajax 和 Fetch 对比

这里总计一下 Ajax 和 Fetch 之特点和区别：

Ajax:

+ 基于事件回调的异步模型，API 设计老旧
+ 可以追踪上传和下载进度
+ 响应成功（即使是 4xx, 5xx）是 load 事件，请求失败才是 error 事件
+ 支持跨域请求
+ 凭据（cookie）管理
  + 同域请求默认带凭据
  + 跨域请求默认不带凭据，要开启设置 xhr.withCredentials = true 
+ 支持取消请求
+ 支持超时处理

Fetch：

+ 基于 Promise 风格的 API 设计，语法简洁，更加语义化，适合现代前端
+ 支持 async/await
+ 对 Stream API 直接支持
+ 只能追踪下载进度，无法追踪上传进度
+ 只有网络请求失败才会进入 reject 流程，其他响应都是 resolve 流程
+ 支持跨域请求，使用 mode 配置
+ 凭据（cookie）管理，使用 credentials 配置
  + 默认为 same-origin，同源发送凭据
  + 开启跨域需要使用 include 选项
+ 支持取消请求
+ 不支持超时 timeout 处理，需要手动实现，见[实现 Fetch 超时管理](:note:6f0fdc84-28f2-44dc-8f83-606fbc8f788d)一文

这样对比下来，发现除了少数几个功能外，其他的 Fetch API 都能做到。

另外提一点，很多文章说 fetch 请求默认不发送 cookie，但在高级程序第四版上明确说明 credentials 默认为 'same-origin'，也就是同源会发送的，只是跨域默认不发送，这点和 Ajax 其实是一致的。

## 参考

+ [javascript.info - XMLHttpRequest](https://zh.javascript.info/xmlhttprequest)
+ [使用 Fetch - Web API 接口参考-MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)
+ [XMLHttpRequest - Web API 接口参考-MDN ](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)
+ [Ajax - Web 开发者指南 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/AJAX)
