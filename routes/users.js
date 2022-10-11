const userController = require('../controllers/user')
const auth = require('../middlewares/auth')

const router = require('express').Router()

router.use(auth)

router.get('/:id', userController.getUser)
router.put('/:id', userController.updateUser)
router.delete('/:id', userController.deleteUser)

module.exports = router