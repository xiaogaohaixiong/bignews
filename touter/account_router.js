const express = require('express')
const touter = express.Router()
const conn = require('../utils/sql.js')
const jwt = require('jsonwebtoken')
touter.use(express.urlencoded())


// 注册接口
touter.post('/reguser', (req, res) => {
    // 1.获取参数
    console.log('获取到的参数是：', req.body);
    const { username, passwrod } = req.body
    // 2.1先判断注册的用户名是否存在，存在就退出，提示用户名被占用了，不存在就注册
    // 2.1.1 拼接sql语句
    const sqlStr = `SELECT * FROM users where username="${username}"`

    conn.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err)
            res.json({ status: 500, message: "服务器错误" })
            return
        }
        console.log(result);

        if (result.length > 0) {
            res.json({ status: 1, message: "注册失败，名字占用了" })
            return
        }
        const sqlStrReg = `insert into users (username,password) values("${username}","${passwrod}")`
        conn.query(sqlStrReg, (err, result) => {
            if (err) {
                console.log(err)
                res.json({ status: 500, message: "服务器错误" })
                return
            }
            // 5. 根据操作结果，做不同的响应
            res.json({ status: 0, message: '注册成功' })
        })
    })

})

// 登录接口
touter.post('/login', (req, res) => {
    // 获取参数
    console.log('获取参数', req.body);
    const { username, passwrod } = req.body
    console.log(username, passwrod);

    //拼接sql语句
    const sqlStr = `select * from users where username="${username}" and password="${passwrod}"`

    // 执行sql 操作数据库
    conn.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 500, message: "服务器错误" })
        }
        console.log(result);

        if (result.length > 0) {
            const token = 'Bearer ' + jwt.sign(
                { name: username },
                'bignews1',  // 加密的密码，要与express-jwt中的验证密码一致
                { expiresIn: 30 * 60 * 60 } // 过期时间，单位是秒
            )
            res.json({ msg: "登陆成功", status: 0, token })
        } else {
            res.json({ msg: "登陆失败，用户名密码不对", status: 1 })
        }
    })

})


// 导出
module.exports = touter