const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const header = req.headers['authorization']
        const token = header ? header.split(' ')[1] : null 
        
        if (token == null) {
            res.status(401).json({message: "You need to log in to access this resource"})
        }else{
            jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, user) => {
                if (err) {
                    return res.status(403).json({message: "an error ocurred in the authentication"})
                }
                req.user = user
                next()
            })
        }        
    } catch (error) {
        next(error)        
    }
}