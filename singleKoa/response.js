// 获取get请求中的参数
module.exports = {
    get body(){
        return this._body
    },
    set body(data){
        this._body = data
    },
    get status(){
        return this.res.statusCode
    },
    set status(statusCode) {
        if(typeof statusCode !== 'number') {
            throw new Error('statusCode must be a number!')
        }
        this.res.statusCode = statusCode
    }
}

/**
 * status读写方法分别设置或读取this.res.statusCode。同样的，这个this.res是挂载的node原生response对象。
 * 而body读写方法分别设置、读取一个名为this._body的属性。这里设置body的时候并没有直接调用this.res.end来返回信息，
 * 这是考虑到koa当中我们可能会多次调用response的body方法覆盖性设置数据。真正的返回消息操作会在application.js中存在。
 */