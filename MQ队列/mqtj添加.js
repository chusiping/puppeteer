const lib = require('../public/_LibNode');
const redis = require('../public/lib_redisList');
(async()=>{
    var mq = new redis.MQ();  
    await mq.init('tm1');
    for (let i = 0; i < 1000; i++) {
        msg = {"name" : "jarry"+i, "age" : i}
        mq.setData(JSON.stringify(msg));
        console.log(JSON.stringify(msg));
        await lib.sleep(10);
    }
})()

