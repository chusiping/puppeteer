const lib = require('../public/_LibNode');
const redis = require('../public/lib_redisList');
let dodata = async (data) =>{
    setTimeout(() => {
        console.log('取出::' + data);
    }, 100);
} 
(async()=>{
    var mq = new redis.MQ();  
    await mq.init('tm1');
    await mq.getData(dodata,'tm1');
})()
