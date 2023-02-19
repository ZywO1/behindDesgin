const express = require('express')
const router = express.Router()

//引入处理函数
const userMethod = require('../router_handler/login')

//导入验证数据中间件
const expressJoi = require('@escook/express-joi')
//导入验证规则对象
const { register_schema, login_schema } = require('../schema/login')

//注册新学生
router.post('/register', expressJoi(register_schema), userMethod.regUser)

//登录
router.post('/login', expressJoi(login_schema), userMethod.loginUser)

module.exports = router