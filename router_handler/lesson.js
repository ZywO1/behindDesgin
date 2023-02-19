//引入数据库模块
const db = require('../db/index')

exports.getLessonType = (req, res) => {
    const sqlStr = 'select * from lessontype'
    db.query(sqlStr, (err, results) => {
        if (err) return res.send({ status: 0, message: err.message })
        return res.send({ status: 1, data: results, message: '获取成功' })
    })
}

exports.createLesson = (req, res) => {
    const lessonInfo = req.body
    const sql = 'insert into lessonlist set ?'
    db.query(sql, { ...lessonInfo }, (err, results) => {
        if (err) return res.send({ status: 0, message: err.message })
        if (results.affectedRows !== 1) {
            return res.send({ status: 0, message: '发布失败，请稍后尝试' })
        } else
            return res.send({ status: 1, message: '发布成功' })
    })
}