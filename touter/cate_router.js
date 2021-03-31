const express = require('express')
const touter = express.Router()
const conn = require('../utils/sql.js')
const jwt = require('jsonwebtoken')
const sql = require('../utils/sql.js')
touter.use(express.urlencoded())

// 获取文章分类列表
touter.get('/cates', (req, res) => {
    // 拼接sql
    const sqlStr = `select * from categories`
    // 操作数据库
    conn.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.send({ status: 0, message: '服务器错误' })
            return
        }
        res.send({ status: 1, message: '获取文章分类列表成功', data: result })
    })
})

// 新增文章分类
touter.post('/addcates', (req, res) => {
    // 获取参数
    console.log('获取参数是：', req.body);
    const { name, slug } = req.body
    const sqlStrselect = `select * from categories where name="${name}"`
    conn.query(sqlStrselect, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 500, message: '服务器错误' })
            return
        }
        if (result.length > 0) {
            res.json({ status: 0, message: '文章分类已存在' })
            return
        }
        // 拼接sql
        const sqlStr = `insert into categories (name,slug) values("${name}","${slug}")`

        // 操作数据库
        conn.query(sqlStr, (err, result) => {
            if (err) {
                console.log(err);
                res.json({ status: 0, message: '服务器错误' })
                return
            }
            res.json({ status: 1, message: '新增文章分类成功' })
        })

    })

})

// 根据 Id 删除文章分类
touter.get('/deletecate', (req, res) => {
    // 获取参数
    console.log('获取参数是：', req.query);
    const { id } = req.query
    // 拼接sql
    const sqlStr = `delete from categories where id=${id}`

    // 操作数据库
    conn.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 500, message: '服务器错误' })
            return
        }
        console.log(result);
        if (result.affectedRows == 0) {
            res.json({ status: 0, message: '删除文章分类失败' })
        }

        res.json({ status: 1, message: '删除文章分类成功' })
    })

})

// 根据 Id 获取文章分类数据
touter.get('/getCatesById', (req, res) => {
    // 获取参数
    console.log('获取参数是：', req.query);
    const { id } = req.query
    // 拼接sql
    const sqlStr = `select * from categories where id=${id}`

    // 操作数据库
    conn.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 500, message: '服务器错误' })
            return
        }
        console.log(result);
        if (result.length == 0) {
            res.json({ status: 1, message: '没有该文章分类，请添加' })
            return
        }

        res.json({ status: 1, message: '获取文章分类数据成功', data: result })
    })

})


// 根据 Id 更新文章分类数据
touter.post('/updatecate', (req, res) => {
    // 获取参数
    console.log('获取参数是：', req.body);
    const { id, name, slug } = req.body
    // 拼接sql
    const sqlStr = `update categories set name="${name}",slug="${slug}" where id = ${id}`

    // 操作数据库
    conn.query(sqlStr, (err, result) => {
        if (err) {
            console.log(err);
            res.json({ status: 0, message: '服务器错误' })
            return
        }
        res.json({ status: 1, message: '更新文章分类数据成功' })
    })

})


// 导出
module.exports = touter