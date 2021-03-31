const express = require('express')

// 1.1创建服务器
const server = express()

// 2.0跨域
const cors = require('cors')
server.use(cors())

// 3.0设置uploads为静态资源目录
server.use('/uploads', express.static('uploads'))

// 4.0 设置jwt
const jwt = require('express-jwt')
// jwt() 用于解析token，并将 token 中保存的数据 赋值给 
// unless() 约定某个接口不需要身份认证
server.use(jwt({
    secret: 'bignews1', // 生成token时的 钥匙，必须统一
    algorithms: ['HS256'] // 必填，加密算法，无需了解
}).unless({
    path: ['/api/login', '/api/register', /^\/uploads\/.*/] // 除了这两个接口，其他都需要认证
}));

const userRouter = require('./touter/user_router.js')
const accountRouter = require('./touter/account_router.js')
const cateRouter = require('./touter/cate_router.js')

server.use('/api', accountRouter)
server.use('/my', userRouter)
server.use('/my/article', cateRouter)


// 6.0 错误处理中间件用来检查token合法性
server.use((err, req, res, next) => {
    console.log('有错误', err)
    if (err.name === 'UnauthorizedError') {
        // res.status(401).send('invalid token...');
        res.status(401).send({ code: 1, message: '身份认证失败！' });
    }
});
// 1.2开启监听
server.listen(3000, () => {
    console.log('3000端口已就绪了');
})