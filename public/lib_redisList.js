const amqp = require('amqplib');
const amqp2 = require('amqplib/callback_api');
var redis = require('redis')
var client = redis.createClient('6379', 'redis.qy');
client.auth('redis@qiaoyin.com!@#');

const list = (key) => {
    return new Promise((resolve, reject)=>{
        var _key = '*';
        if(key == 'all') 
            _key = '*';
        else
            _key =  '*'+ key +'*';
        client.keys('*'+ _key +'*', function(err, keys) {
            rt = [];
            if(keys){
                for(var i=0;i<keys.length;i++){
                    rt.push(keys[i]);
                }
                resolve(rt);
            }
            else{
                reject(new Error('无数据'));
            }
        })
    })
};   
// 队列的插入调用
// (async()=>{
//     var mq = new redis.MQ();  
//     await mq.init('tm1');
//     for (let i = 0; i < 1000; i++) {
//         msg = {"name" : "jarry"+i, "age" : i}
//         mq.setData(JSON.stringify(msg));
//         console.log(JSON.stringify(msg));
//         await lib.sleep(10);
//     }
// })()
// 取出调用
// (async()=>{
//     var mq = new redis.MQ();  
//     await mq.init('tm1');
//     await mq.getData(dodata,'tm1');
// })()
class MQ { //类的写法
    constructor(connect_Str_ = 'amqp://test:test@redis.qy:5672') {
        this.connection = null;
        this.channel = null;
        this.teamName = null;
        this.connect_Str = connect_Str_;
    };
    async init(_teamName) {
        this.connection = await amqp.connect(this.connect_Str)
        this.channel = await this.connection.createChannel();
        this.channel.assertQueue(_teamName);
        this.teamName = _teamName;
    };
    setData(_msg){
        this.channel.sendToQueue(this.teamName, Buffer.from(_msg));
    };
    async getData(callback,team_){
        amqp2.connect(this.connect_Str, function (error0,connection) {
            if (error0) { throw error0; }
            connection.createChannel(function (error1,channel) {
                if (error1) { throw error1; }
                channel.consume(team_, function (_msg) {
                    let _str = _msg.content.toString()
                    callback(_str);
                    // console.log('取出::' + _str);
                    channel.ack(_msg);
                })
            });
        });
    };
}
module.exports.list = list;
module.exports.MQ = MQ;