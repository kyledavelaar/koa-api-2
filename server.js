const Koa = require('koa');
const Logger = require('koa-logger');
const mongoose = require('mongoose');
const Cors = require('@koa/cors')
const BodyParser = require('koa-bodyparser')
const respond = require('koa-respond')
const kafka = require("kafka-node")

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
const database = 'mongodb://localhost/koa-api';
// const database = 'mongodb://database:27017/koa-api-2';

mongoose.connect(database, mongooseOptions, (err, db) => {
  if (err) console.log('err', err)
  else { console.log(` connected to ${database}`)}
});

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
// KAFKA
/////////////////////////////////////////////////
const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient('localhost:2181');
const consumer = new Consumer(client, [{ topic: "cat", partition: 0 }], { autoCommit: false });

consumer.on("message", function(message) {
  console.log(message.topic, ' : ', message.value);
  // { topic: 'cat', value: 'I have 385 cats', offset: 412, partition: 0, highWaterOffset: 413, key: null }
});



/////////////////////////////////////////////////
// SERVER
/////////////////////////////////////////////////
const HOST = '0.0.0.0';
const port = process.env.PORT || 5000
const server = app.listen(port, HOST, () => console.log(`API server started on ${port}`))
module.exports = server;