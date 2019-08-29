const Router = require('koa-router')
const Ctrl = require('../controller/user');

const router = new Router()

router.get('/', Ctrl.getUsers)
router.post('/', Ctrl.createUser)
router.put('/:id', Ctrl.updateUser)
router.delete('/:id', Ctrl.deleteUser)

module.exports = router.routes();