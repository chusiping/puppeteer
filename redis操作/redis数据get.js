var express = require('express');
var app = express();
var lib = require('../public/lib_redisList.js');

//车牌号信息全集合
// http://redis.qy:8081/get_carinfo?key=车架号
app.get('/get_carinfo', function (req, res) {
    var params = req.query;
    // res.send(params);
    lib.list(params.key).then((result)=>{
        res.send(result);
    })
})

//搜索车辆信息
app.get('/', function (req, res) {
    res.send('please login in!');
})

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log(`应用实例，访问地址为 http://127.0.0.1:${port}?key=车架号`)
})

