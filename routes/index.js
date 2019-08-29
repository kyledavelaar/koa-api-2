module.exports = router => {
  router.prefix('/api')
  router.use('/users', require('./user'))
}