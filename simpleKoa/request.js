const url = require('url')
// 获取get请求中的参数
module.exports = {
    query(){
        // 代码中的this.req代表的是node的原生request对象，
        // this.req.url就是node原生request中获取url的方法。
        // 稍后我们修改application.js的时候，会为koa的request对象挂载这个req。
        return url.parse(this.req.url, true).query
    }
}