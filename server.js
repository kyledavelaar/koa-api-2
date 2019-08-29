const Koa = require('koa');
const Logger = require('koa-logger');
const mongoose = require('mongoose');
const Cors = require('@koa/cors')
const BodyParser = require('koa-bodyparser')
const respond = require('koa-respond')

const Router = require('koa-router')
const router = new Router()

const app = new Koa()

/////////////////////////////////////////////////
// DB
/////////////////////////////////////////////////
const mongooseOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
}
// const database = 'mongodb://localhost/koa-api';
const database = 'mongodb://database:27017/koa-api';
mongoose.connect(database);
// mongoose.connect(database, mongooseOptions, (err, db) => {
//   if (err) console.log('err', err)
//   else { console.log(` connected to ${database}`)}
// });

/////////////////////////////////////////////////
// MIDDLEWARE
/////////////////////////////////////////////////
app.use(Cors())
app.use(BodyParser({
  enableTypes: ['json'],
  jsonLimit: '5mb',
  strict: true,
  onerror: function (err, ctx) {
    ctx.throw('body parse error', 422)
  }
}))
app.use(respond())
app.use(Logger())

require('./routes')(router)
app.use(router.routes())
app.use(router.allowedMethods())

/////////////////////////////////////////////////
// SERVER
/////////////////////////////////////////////////
const HOST = '0.0.0.0';
const port = process.env.PORT || 5000
const server = app.listen(port, HOST, () => console.log(`API server started on ${port}`))
module.exports = server;