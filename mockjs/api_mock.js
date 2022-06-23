const express = require('express');
const Mock = require('mockjs');
const app = express();
app.get("/mock",(req,res)=>{
    res.send(id);
});

var Random = Mock.Random;
var zhongxin = ['市场中心一','市场中心二','市场中心三','市场中心四','市场中心五','市场中心六'];
// var zhongxin = ForData('市场中心',7);
Random.extend({ cus1() { return this.pick(zhongxin);}})
let arr = ['a','b','c','d','e']

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
var ForData=(string,ii)=>{
    let rt = [];
    for (let i = 0; i < ii; i++) {
        rt.push(string+i);
    }
    return rt;
}
app.listen(8081)