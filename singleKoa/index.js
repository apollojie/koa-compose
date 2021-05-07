let simpleKoa = require('./application');
// const context = require('./context')
let app = new simpleKoa();

let responseData = {};

app.use(async (ctx, next) => {
    console.log('app.user执行1')
    responseData.name = 'tom';
    await next();
    ctx.body = responseData;
});

app.use(async (ctx, next) => {
    console.log('app.user执行2')
    responseData.age = 16;
    await next();
});

app.use(async ctx => {
    console.log('app.user执行3')
    responseData.sex = 'male';
});

app.listen(3000, () => {
    console.log('listening on 3000');
});