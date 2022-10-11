const db = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt");

module.exports = {
    register: async (req, res, next) => {
        try {
            const salt = await bcrypt.genSalt(10);
            let newUser = {
                email: req.body.email,
                name: req.body.name,
                password: await bcrypt.hash(req.body.password, salt)
            }
            let user = await db.users.create(newUser)
            res.json({ message: 'User has been created correctly', user })
        } catch (error) {
            next(error)
        }
    },

    login: async (req, res) => {
        try {
            let { email, password } = req.body
            let user = await db.users.findOne({ where: { email } })
            if (user == null) {
                res.status(404).json({ message: "User not found" })
            } else {
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    let token = jwt.sign(JSON.stringify(user), process.env.JWT_TOKEN_SECRET)
                    res.json({ token })
                } else {
                    res.status(401).json({ message: "Incorrect password" })
                }
            }
        } catch (error) {
            next(error)
        }
    },
}