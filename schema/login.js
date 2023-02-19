const joi = require('joi')

const username = joi.string().alphanum().required()
const password = joi.string().pattern(/^[\S]{1,20}$/).required()
const name = joi.string().pattern(/^[\S]{1,20}$/).required()

exports.register_schema = {
    body: {
        username,
        password,
        name
    }
}

exports.login_schema = {
    body: {
        username,
        password
    }
}

exports.update_password_schema = {
    body: {
        oldpwd: password,
        newpwd: joi.not(joi.ref('oldpwd')).concat(password)
    }
}