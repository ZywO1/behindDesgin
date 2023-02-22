//引入数据库模块
const db = require('../db/index')
//引入加密
const bcrypt = require('bcryptjs')
//引入jstoken
const jwt = require('jsonwebtoken')

const dayjs = require('dayjs')

//获取个人信息
exports.detailInfo = (req, res) => {
    const sqlStr = 'select * from userlist where id=?'
    db.query(sqlStr, req.auth.id, (err, results) => {
        if (err) return res.send({ status: 0, message: err.message })
        return res.send({ status: 1, data: { ...results[0], password: '' }, message: '获取成功' })
    })
}
//修改密码
exports.updatePwd = (req, res) => {
    const sqlStr = 'select * from userlist where id=?'
    db.query(sqlStr, req.auth.id, (err, results) => {
        if (err) {
            return res.send({ status: 0, message: err.message })
        }
        const flag = bcrypt.compareSync(req.body.oldpwd, results[0].password)
        if (!flag) return res.send({ status: 0, message: '原密码错误' })

        const sql = 'update userlist set password=? where id=?'
        const newpwd = bcrypt.hashSync(req.body.newpwd, 10)
        db.query(sql, [newpwd, req.auth.id], (err, results) => {
            if (err) {
                return res.send({ status: 0, message: err.message })
            }
            return res.send({ status: 1, message: '修改密码成功' })
        })

    })
}
//发布公告
exports.publishReport = (req, res) => {
    const reportInfo = req.body
    const sql = 'insert into reportList set ?'
    reportInfo.time = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
    db.query(sql, { ...reportInfo }, (err, results) => {
        if (err) return res.send({ status: 0, message: err.message })
        if (results.affectedRows !== 1) {
            return res.send({ status: 0, message: '发布失败，请稍后尝试' })
        } else
            return res.send({ status: 1, message: '发布成功' })
    })
}

//获取公告
exports.getReport = (req, res) => {
    const sql = 'select * from reportList order by id desc limit 5'
    db.query(sql, (err, results) => {
        if (err) {
            return res.send({ status: 0, message: err.message })
        }
        return res.send({ status: 1, message: '获取信息成功', data: results })
    })
}

//获取所有用户
exports.getUserList = (req, res) => {
    const searchInfo = req.body
    let { identify, username, name, className, currentPage, pageSize } = searchInfo
    username = username || ""
    name = name || ""
    className = className || ""
    const sqlStr = `select count(*) as total from userlist where identify=${identify} and username like '%${username}%' and name like '%${name}%' and class like '%${className}%'`
    let total
    db.query(sqlStr, (err, results) => {
        if (err) {
            return res.send({ status: 0, message: err.message })
        }
        total = results
        let sql = `select id,name,username,class,identify from userlist where identify=${identify} and username like '%${username}%' and name like '%${name}%' and class like '%${className}%' limit ${pageSize} offset ${(currentPage - 1) * pageSize}`
        db.query(sql, (err, results) => {
            if (err) {
                return res.send({ status: 0, message: err.message })
            }
            return res.send({ status: 1, message: '获取信息成功', data: { total: total[0].total, data: results } })
        })
    })


}