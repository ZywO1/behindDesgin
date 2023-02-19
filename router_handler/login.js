//引入数据库模块
const db = require('../db/index')
//引入加密
const bcrypt = require('bcryptjs')
//引入jstoken
const jwt = require('jsonwebtoken')
const config = require('../config')
const { expireIn } = require('../config')

exports.regUser = (req, res) => {
    const userinfo = req.body
    // if (!userinfo.username || !userinfo.password || !userinfo.name) {
    //     return res.send({ status: 0, message: '内容不合法' })
    // }
    const sqlStr = 'select * from userlist where username=?'

    db.query(sqlStr, userinfo.username, (error, results) => {
        if (error) {
            return res.send({ status: 0, message: error.message })
        }

        if (results.length > 0) {
            return res.send({ status: 0, message: '账号重复' })
        }

        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        const sql = 'insert into userlist set ?'
        db.query(sql, { ...userinfo }, (err, results) => {
            if (err) return res.send({ status: 0, message: err.message })
            if (results.affectedRows !== 1) {
                return res.send({ status: 0, message: '添加失败，请稍后尝试' })
            } else
                return res.send({ status: 1, message: '添加成功' })
        })
    })

}

exports.loginUser = (req, res) => {
    const userinfo = req.body
    const sqlStr = 'select * from userlist where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        if (err) return res.send({ status: 0, message: err.message })
        //判断账号密码
        const flag = (results.length > 0) && bcrypt.compareSync(userinfo.password, results[0].password)
        if (!flag) return res.send({ status: 0, message: '账号密码错误' })
        //成功后
        const user = { ...results[0], password: '' }
        const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expireIn })
        res.send({ status: 1, message: '登录成功', data: { token: 'Bearer ' + tokenStr } })

    })

}