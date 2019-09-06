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
// const database = 'mongodb://database:27017/koa-api-2'; // use when in docker

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
const consumer = new Consumer(client, [{ topic: "cat", partition: 0 }], { autoCommit: false, encoding: 'buffer' });

consumer.on("message", function(message) {
  let str = Buffer.from(message.value).toString();
  console.log('string', str)
  // console.log('message', message);
  // console.log(message.topic, ' : ', message.value);
  // { topic: 'cat', value: 'I have 385 cats', offset: 412, partition: 0, highWaterOffset: 413, key: null }
});

//----offset -----------------
offset = new kafka.Offset(client);
offset.fetch([ { topic: 'cat', partition: 0, time: Date.now(), maxNum: 1 }], function (err, data) {
    console.log('offset data', data)
    // { 't': { '0': [999] } }
});

offset.fetchCommitsV1('groupId', [ { topic: 'cat', partition: 0 } ], function (err, data) {
  console.log('fetch commitsV1', data)
});


//------------------
// STREAM
//------------------

const Transform = require('stream').Transform;
const ProducerStream = require('./node_modules/kafka-node/lib/producerStream');
const ConsumerGroupStream = require('./node_modules/kafka-node/lib/consumerGroupStream');
const resultProducer = new ProducerStream();

const consumerOptions = {
  kafkaHost: '127.0.0.1:9092',
  groupId: 'ExampleTestGroup',
  sessionTimeout: 15000,
  protocol: ['roundrobin'],
  asyncPush: false,
  id: 'consumer1',
  fromOffset: 'latest'
};

const consumerGroup = new ConsumerGroupStream(consumerOptions, 'ExampleTopic');

const messageTransform = new Transform({
  objectMode: true,
  decodeStrings: true,
  transform (message, encoding, callback) {
    console.log(`Received message ${message.value} transforming input`);
    callback(null, {
      topic: 'RebalanceTopic',
      messages: `You have been (${message.value}) made an example of`
    });
  }
});

consumerGroup.pipe(messageTransform).pipe(resultProducer);







/////////////////////////////////////////////////
// SERVER
/////////////////////////////////////////////////
const HOST = '0.0.0.0';
const port = process.env.PORT || 5000
const server = app.listen(port, HOST, () => console.log(`API server started on ${port}`))
module.exports = server;