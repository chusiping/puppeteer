var redis = require('redis')
var client = redis.createClient('6379', 'redis.qy');
client.auth('redis@qiaoyin.com!@#'); 
var x = 0;
setInterval(function () {
    let tm = "carinfo - "+x;
    console.log(tm)
    client.set(x,tm);
    x++;
}, 500);