## 源文件结构
koa源码文件中，主要分为如下四个部分：
    
  application.js
  context.js
  request.js
  response.js

  其中context.js、request、response三个文件都是实现常用方法的代理，request是获取get请求中的用户参数，response是设置请求状态码与响应内容。context是常用方法的代理，中间上下文的形式实现拓展

## 实现singleKoa需要做的四条信息
1. 封装node http Server
  node原生提供的http库中createServer与listen实现创建一个服务并监听对应端口。

2. 构造resquest, response, context对象
3. 中间件机制
  koa洋葱模型中，koa2使用了async/await实现异步支持。

  洋葱模型机制对知识的延申：对于多个async函数，如何实现这些函数依次运行呢？
```
async function m1(next) {
    console.log('m1');
    await next();
    console.log('m1--after');
}

async function m2(next) {
    console.log('m2');
    await next();
    console.log('m2--after');
}

async function m3() {
    console.log('m3');
}

let middlewares = [m1,m2,m3];
let len = middlewares.length;

function next(){
    return Promise.resolve()
}
function createNext(middleware, backNext) {
    return async function(){
        await middleware(backNext)
    }
}
for(let i = len - 1; i >= 0; i--) {
    next = createNext(middlewares[i], next)
} 
next()
```

4. 错误处理