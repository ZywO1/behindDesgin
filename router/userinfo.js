const express = require('express')
const router = express.Router()
//引入处理函数
const userMethod = require('../router_handler/userinfo')
//导入验证数据中间件
const expressJoi = require('@escook/express-joi')
//导入验证规则对象
const { update_password_schema } = require('../schema/login')

//获取个人信息
router.get('/detailInfo',userMethod.detailInfo)

//修改密码
router.post('/updatepwd', expressJoi(update_password_schema), userMethod.updatePwd)

//发布公告
router.post('/publishReport',userMethod.publishReport)

//获取公告信息
router.post('/getReport',userMethod.getReport)

//获取用户信息
router.post('/getUserList',userMethod.getUserList)

module.exports = router