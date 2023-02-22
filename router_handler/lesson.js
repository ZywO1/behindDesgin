//引入数据库模块
const db = require('../db/index')
//引入加密
const bcrypt = require('bcryptjs')

//创建课程类型
exports.getLessonType = (req, res) => {
    const sqlStr = 'select * from lessontype'
    db.query(sqlStr, (err, results) => {
        if (err) return res.send({ status: 0, message: err.message })
        return res.send({ status: 1, data: results, message: '获取成功' })
    })
}
//教师发布课程
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

//选课
exports.chooseLesson = (req, res) => {
    const info = {}
    info.studentId = req.auth.id
    info.lessonListId = req.body.lessonId
    const sql = 'insert into studentcourse set ?'
    db.query(sql, { ...info }, (err, results) => {
        if (err) return res.send({ status: 0, message: err.message })
        if (results.affectedRows !== 1) {
            return res.send({ status: 0, message: '选课失败，请稍后尝试' })
        } else
            return res.send({ status: 1, message: '选课成功' })
    })
}

//获取学生的课表
exports.getStuCourse = (req, res) => {
    const { pageSize, currentPage } = req.body
    const sqlStr = 'select  count(*) as total from studentcourse where studentId=?'
    let total
    db.query(sqlStr, req.auth.id, (err, results) => {
        if (err) return res.send({ status: 0, message: err.message })
        total = results
        const sql = `select * from studentcourse,lessonlist where studentcourse.studentId=? and studentcourse.lessonLid=lessonlist.lessonLid order by studentcourse.SCid desc limit ${pageSize} offset ${(currentPage - 1) * pageSize}`
        db.query(sql, req.auth.id, (err, results) => {
            if (err) return res.send({ status: 0, message: err.message })
            else
                return res.send({ status: 1, message: '获取信息成功', data: { data: results, total: total[0].total } })
        })
    })


}