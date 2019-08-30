module.exports = router => {
  router.prefix('/api')
  router.use('/movies', require('./movie'))
}