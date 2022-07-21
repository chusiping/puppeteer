var https = require('https');
const express = require('express');
var fs = require('fs');
const app = express();
const Mock = require('mockjs');

app.get("/mock",(req,res)=>{
    res.header('Access-Control-Allow-Origin', '*')  //设置跨域,允许不同域访问
    res.header('Access-Control-Allow-Headers', 'Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method' )
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, PUT, DELETE')
    res.header('Allow', 'GET, POST, PATCH, OPTIONS, PUT, DELETE')
    res.send(id);
});
var Random = Mock.Random;
var zhongxin = ['市场中心一','市场中心二','市场中心三','市场中心四','市场中心五','市场中心六'];
// var zhongxin = ForData('市场中心',7);
Random.extend({ cus1() { return this.pick(zhongxin);}})
var id = Mock.mock({
    zhongxin:Random.pick(zhongxin, 1, 6),
    'list1|1-5': [{
        'name': '@cus1',
        'address'   : '@province' + '@city' + '@county'
    }],
    'list2|1-3': [{
        'id|+1'     : 1001,  //自增ID
        'number|1-10': 7,
        'name'      :'@name'
    }],
})




var key = fs.readFileSync('./crt/server.key');
var cert = fs.readFileSync('./crt/server.crt');
var options = {
    key: key,
    cert: cert
};
var https = require('https');
https.createServer(options, app).listen(3001); 

// app.listen(3001)