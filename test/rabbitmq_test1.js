const amqp = require('amqplib')

async function product(params) {
   //必须要设置http://localhost:15672/的账号和权限才能connect ok
const connection   = await amqp.connect('amqp://test:test@127.0.0.1:5672')
const channel = await connection.createChannel()
channel.assertQueue('team2');
for (let i = 0; i < 1000; i++) {
    mg = `【2021.05.31 09：14】第${i}条消息 1s`
    await channel.sendToQueue('team2', Buffer.from(mg));
    console.log(mg)
}
await channel.close()
}
product() 





// const mongoose = require('mongoose');
// const conn = mongoose.createConnection('mongodb://192.168.1.16:27017/zhhw', { useNewUrlParser: true, useUnifiedTopology: true });
// (async () => {    
//       await conn.on('open', async () => {
//       console.log('打开 mongodb 连接');   
//       // dbo = conn.db("zhhw");
//       // var _collection = dbo.collection('posts');
//       var _collection = (conn).collection('test');
//       _collection.updateOne({test:"t1"},{'$setOnInsert':{test:"t1"}},  {upsert:true});
//       console.log("test555")

//       })
//       await conn.on('err',  async (err) => {
//          console.log('err:' + err);
//       }) 
// })


