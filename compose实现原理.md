## 洋葱模型的由来
    koa2与express最大的区别是：koa2中间件执行机制使用的是洋葱模型；而express框架中，中间件则是线性执行，
    每一个中间件执行完后，要么交给下一个中间件，要么返回response。只要请求离开了，中间件就无法再次获取这个请求及处理。


## 为什么要使用洋葱模型？
    当我们使用koa进行开发的时候，因为读取数据库或是http请求等都是异步请求，
    所以我们为了保证洋葱模型会使用号称异步终极解决方案的async/await。

## 洋葱模型的实现原理
    洋葱模型的灵魂之处在于：Array.prototype.reduce()；如果对reduce不熟悉，可以去mdn回顾一下reduce的使用。
    compose的实现核心是：将各个函数作为前一个function的next参数传递过去

    一、洋葱模型的同步实现：
    
        var app = {
            middlewares: [],
            use(fn){
                app.middlewares.push(fn)
            },
            compose(){
                function dispatch(i){
                    if(i === app.middlewares.length) return
                    const fn = app.middlewares[i]
                    // 将每一个函数作为前一个函数的next参数传递。
                    return fn(() => dispatch(i+1))
                }
                dispatch(0)
            }
        }
        // next是() => dispatch(i+1)的引用
        app.use(next => { 
            console.log('1--before')
            next()
            console.log('1--after')
        })
        app.use(next => {
            console.log('2--before')
            next()
            console.log('2--after')
        })
        app.use(next => {
            console.log('3--before')
            next()
            console.log('3--after')
        })
        app.compose()

    // 运行结果为：
    //     1--before
    //     2--before
    //     3--before
    //     3--after
    //     2--after
    //     1--after
    
    
    
    二、洋葱模型的同步实现：（代码在koa-compose包）
        查看了koa-compose源码，其中compose的源代码只有寥寥几十行，对比同步实现区别在引入了async/await支持。代码实现如下
        
            function compose(middlewares){
                // 容错处理
                if(!Array.isArray(middlewares)) throw new Error('middlewares must be an  array!')
                for(const fn of middlewares) {
                    if(typeof fn !== 'function') {
                        throw new Error('middleware must be a function!')
                    }
                }
                
                return function (context, next){
                    const index = -1
                    return dispatch(0)
                    function dispatch(i) {
                        if(i <= index) return Promise.reject(new Error('next() called multiple times'))
                        index = i
                        
                        const fn = middlewares[i]
                        if(i === middlewares.length) fn = next
                        if(!fn) return Promise.resolve()

                        try{ // 异步
                            return Promise.resolve(fn(context, dispatch.bind(null, i+1)))
                        }catch(err) {
                            return Promise.reject(err)
                        }
                    }
                }
            }
        
    
    三、reduce实现compose
        
        reduce()可以作为一个高阶函数，用于函数的 compose。将后一个函数作为前一个函数的参数传递。

        function add5(x) {
            return x + 5;
        }
        
        function div2(x) {
            return x / 2;
        }
        
        function sub3(x) {
            return x - 3;
        }
        
        const chain = [add5, div2, sub3].reduce((a, b) => (...args) => a(b(...args)))
        chain(1) === 4
