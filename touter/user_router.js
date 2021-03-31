const express = require('express')
const touter = express.Router()
const conn = require('../utils/sql.js')
const jwt = require('jsonwebtoken')
touter.use(express.urlencoded())

const multer = require('multer')
// const upload = multer({ dest: 'uploads' })
// 精细化去设置，如何去报存文件
const storage = multer.diskStorage({
    // 保存在哪里
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    // 保存时，文件名叫什么
    filename: function (req, file, cb) {
        console.log('file', file)
        // 目标： 新名字是时间戳+后缀名
        const filenameArr = file.originalname.split('.');
        // filenameArr.length-1是找到最后一个元素的下标
        const fileName = Date.now() + "." + filenameArr[filenameArr.length - 1]
        cb(null, fileName) //
    }
})
const upload = multer({ storage })



// 获取用户的基本信息
touter.get('/userinfo', (req, res) => {
    // 获取去参数是：
    console.log('获取去参数是：', req.query);
    const { username } = req.query

    // 拼接sql 
    const sqlStr = `select * from users where username="${username}"`
    // 执行sql 操作数据库
    conn.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.send({ status: 1, message: "用户名不存在" })
            return
        }
        res.send({ status: 1, message: "恭喜您,获取用户信息成功！", data: result })
    })

})

// 更新用户的基本信息
touter.post('/userinfo', (req, res) => {
    // 获取参数
    console.log('获取参数', req.body);

    const { id, nickname, email, userPic } = req.body
    // 定义一个数组接收要修改的参数
    let conition = [];
    if (nickname) {
        conition.push(`nickname="${nickname}"`)
    }
    if (email) {
        conition.push(`email="${email}"`)
    }
    if (userPic) {
        conition.push(`userPic="${userPic}"`)
    }
    const conStr = conition.join()
    console.log(conStr);
    // 2.拼接sql
    const sqlStr = `update users set ${conStr} where id=${id}`

    //3. 执行sql ，操作数据库
    conn.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 1, message: '修改用户名失败' })
            return
        }
        res.json({ status: 0, message: '恭喜您，修改用户信息成功' })
    })

})
// 上传用户头像

touter.post('/uploadPic', upload.single('file_data'), (req, res) => {
    // 如果文件上传成功
    console.log('本次上传的文件是', req.file);
    // 前端再做：错误处理
    res.json({
        status: 0,
        message: 'http://127.0.0.1:3000/uploads/' + req.file.filename,
    })


})

// 重置密码
touter.post('/updatepwd', (req, res) => {
    // 获取参数
    console.log('获取参数是：', req.body);
    const { oldPwd, newPwd, id } = req.body

    // 查询之前的旧密码进行判断
    let sqlStrSelect = `select * from users where id=${id}`
    conn.query(sqlStrSelect, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 500, message: "服务器错误！" })
            return
        }
        if (result[0].password !== oldPwd) {
            res.json({ status: 1, message: "旧密码不正确！" })
            return
        }
        const sqlStr = `update users set password="${newPwd}" where id=${id}`
        conn.query(sqlStr, (err, result) => {
            if (err) {
                console.log(err);
                res.json({ status: 0, message: "服务器错误" })
                return
            }
            res.json({ status: 0, message: "恭喜您，重置密码成功！" })
        })
    })

})

// 导出
module.exports = touter