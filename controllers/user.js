const db = require('../models')
const bcrypt = require("bcrypt");

module.exports = {
    getUser: async (req, res, next) => {
        try {
            let id = req.params.id
            let user = await db.users.findOne({ where: { id: id }, attributes: { exclude: ['password'] }, })

            if (user == null) {
                res.status(404).json({ message: "User not found" })
            }

            res.json({ user })
        } catch (error) {
            next(error)
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const salt = await bcrypt.genSalt(10);
            let updateUser = {
                email: req.body.email,
                name: req.body.name,
                password: await bcrypt.hash(req.body.password, salt)
            }
            let id = req.params.id
            const count = await db.users.update(updateUser, { where: { id: id } })

            if (count == 0) {
                res.status(404).json({ message: "User not found" })
            }

            res.json({ message: 'User has been updated correctly' })
        } catch (error) {
            next(error)
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            let id = req.params.id
            const user = await db.users.destroy({ where: { id: id } })

            if (user == null) {
                res.status(404).json({ message: "User not found" })
            }

            res.json({ message: 'User has been deleted correctly' })
        } catch (error) {
            next(error)
        }
    },
}