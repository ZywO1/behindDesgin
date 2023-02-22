const express = require('express')
const router = express.Router()
//引入处理函数
const userMethod = require('../router_handler/lesson')

//获取课程种类
router.get('/getLessonType', userMethod.getLessonType)

//新建课程
router.post('/createLesson', userMethod.createLesson)
//选课
router.post('/chooseLesson', userMethod.chooseLesson)

//获取课程
router.post('/myLesson', userMethod.getStuCourse)

module.exports = router