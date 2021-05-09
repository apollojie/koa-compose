// 常用方法的代理
module.exports = {
    // context.query代理 context.request.query
    get query(){
        return this.request.query;
    },
    // context.body代理 context.request.body
    get body(){
        return this.response.body;
    },

    set body(data){
        this.response.body = data
    },
    // context.status代理 context.request.status
    get status(){
        return this.response.status;
    },
    set status(status) {
        this.response.status = status
    }
}

/**
 * 由于context对象定义比较简单并且规范，当实现更多代理方法时候，这样一个一个通过声明的方式显然有点笨，js中，
 * 设置setter/getter，可以通过对象的__defineSetter__和__defineGetter__来实现。为此，我们精简了上面的context.js实现方法，
 * 精简版本如下：
 */