
const userService = require('../services/user.service')

exports.findAll = async (req, res) => {
    userService.findAll(res)
}

exports.create = async (req, res) => {
    userService.create(req, res)
}