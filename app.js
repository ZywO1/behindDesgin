const express = require('express')

const app = express()
const joi = require('joi')

//导入cors中间件
const cors = require('cors')
app.use(cors())

//导入解析表单数据中间件
app.use(express.urlencoded({ extended: false }))

//解析token
var { expressjwt: jwt } = require("express-jwt")
const config = require('./config')

app.use(jwt({ secret: config.jwtSecretKey, algorithms: ['HS256'] }).unless({path:[/^\/api/]}))

//导入登录模块
const loginRouter = require('./router/login')
app.use('/api', loginRouter)

//导入关于用户模块
const userRouter = require('./router/userinfo')
app.use('/user', userRouter)

//导入课程模块
const lessonRouter = require('./router/lesson')
app.use('/lesson', lessonRouter)

//配置表单校验错误处理（后端）
app.use((err, req, res, next) => {
    if (err instanceof joi.ValidationError) {
        return res.send({ status: 3, message: '用户输入不合法' })
    }
    if(err.name=='UnauthorizedError') return res.send({ status: 4, message: '用户未登录' })
    return res.send({ status: 0, message: err })
})


app.listen(3007, () => {
    console.log('running server at 3007')
})