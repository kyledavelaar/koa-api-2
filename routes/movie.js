const Router = require('koa-router')
const Ctrl = require('../controller/movie');

const router = new Router()

router.get('/', Ctrl.getMovies)
router.post('/', Ctrl.createMovie)
router.put('/:id', Ctrl.updateMovie)
router.delete('/:id', Ctrl.deleteMovie)

module.exports = router.routes();