
const userService = require('../services/user.service')
const authService = require('../services/auth.service')

exports.findAll = async (req, res) => {
    console.log('a')
    userService.findAll(res)
}

exports.findOne = async (req, res) => {
    userService.findOne(req, res)
}

exports.register = async (req, res) => {
    userService.register(req, res)
}

exports.register = async (req, res) => {
    userService.register(req, res)
}

exports.login = async (req, res) => {
    userService.login(req, res)
}


