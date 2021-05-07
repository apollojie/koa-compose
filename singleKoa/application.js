const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')
class Application{
    constructor(){
        this.middlewares = [];
        this.context = context;
        this.request = request;
        this.response = response;
    }
    /**
     * 挂载回调函数
     * @param {Function} fn 回调处理函数
     */
    use(fn){
        this.middlewares.push(fn)
    }

    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
    callback(){
        const that =this;
        return (req,res) => {
            let ctx = that.createContext(req, res)
            let respond = () => that.responseBody(ctx)
            let fn = this.compose();
            return fn(ctx,Promise.resolve()).then(respond)
            // that.callbackFunc(ctx).then(respond)
        }
    }
    // koa-compose源码：中间件-洋葱模型
    compose(){
        // 容错机制
        if(!Array.isArray(this.middlewares)) { throw new Error('middlewares must be a Array!')}
        for(const fn of this.middlewares) {
            if(typeof fn !== 'function') {
                throw new Error('middleware must be a function!')
            }
        }
        const middlewares = this.middlewares
        return function(context, next){
            let index = -1;
            return dispatch(0)
            function dispatch(i) {
                if(i <= index) return Promise.reject('')
                index = i;

                const fn = middlewares[i]
                if(i === middlewares.length) fn = next
                if(!fn) return Promise.resolve()
                try{
                    return Promise.resolve(fn(context, dispatch.bind(null, i+1)))
                } catch(err) {
                    return Promise.reject(err)
                }
            }
        }
    }
    // compose(){
    //     return async ctx => {
    //         const mw = this.middlewares;
    //         let len = this.middlewares.length;
    //         async function next(){
    //             return Promise.resolve()
    //         }
    //         /**
    //          * 闭包
    //          * @param {*} middleware  
    //          * @param {*} backNextFn 
    //          */
    //         function createNextFn(middleware, backNextFn){
    //             return async function(){
    //                 await middleware(backNextFn)
    //             }
    //         }
    //         for(let i = len-1; i >= 0; i--) {
    //             next = createNextFn(mw[i], next)
    //         }
    //         await next()
    //     }
    // }
    /**
     * 构造ctx
     * 将node服务中的req, res挂载到当前上下文中
     * @param {Object} ctx ctx实例
     */
    createContext(req, res) {
        // 针对每个请求，都要创建ctx对象
        console.log('每个请求都要创建ctx对象')
        /**
         * ctx的扩展
         * @param {Function} ctx 中间件上下文
         * this.context是我们的中间件中上下文ctx对象的原型。
         * 因此在实际开发中，我们可以将一些常用的方法挂载到this.context上面，这样，
         * 在中间件ctx中，我们也可以方便的使用这些方法了
         */
        let ctx = Object.create(this.context)
        ctx.request = Object.create(this.request)
        ctx.response = Object.create(this.response)
        ctx.req = req;
        ctx.request.req = req;
        ctx.res = res;
        ctx.response.res = res;
        return ctx
    }
    /**
     * 对客户端消息进行回复
     * @param {Object} ctx ctx实例
     */
    responseBody(ctx) {
        let context = ctx.body
        if(typeof context === 'string') {
            ctx.res.end(content)
        } else if(typeof content === 'object') {
            ctx.res.end(JSON.stringify(content))
        }
    }
}
module.exports = Application
// const app = new Application()
// app.use(async ({req,res,echoData}) => {
//     echoData()
//     res.writeHead(200);
//     res.end('hello world');
// })
// app.listen(3000, () => {
//     console.log('listening on 3000');
// });

// app.context.echoData = function(){
//     console.log('测试解构与获取原型链方法')
// }