var light_rpc = require('./rpc_main.js');
var port = 5556;
const cl = {
    // ocr: function(a, b, call){call(obj(a,b))}, //正常
    ocr: function(call){call(obj())}, //正常
}
var obj = (a,b)=>{return a+b;}
var obj = ()=>{return x=> { console.log("aa1")}}

var rpc = new light_rpc(cl).listen(port);
// https://blog.51cto.com/u_15060508/4262631

var ac = { a1 :"a ",a2 : obj  }