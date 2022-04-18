var amqp = require('amqplib/callback_api');

amqp.connect('amqp://test:test@127.0.0.1:5672', function(error0, connection) {
    if (error0) { throw error0;}
    connection.createChannel(function(error1, channel) {
        if (error1) { throw error1; }
        var queue = 'hello';
        var msg = 'Hello world';
        channel.assertQueue(queue, {durable: false});


        //批量送票
        // for (let i = 0; i < 5; i++) {            
        //     mg= `第${i}条消息`
        //     channel.sendToQueue(queue, Buffer.from(mg));
        //     console.log("for Sent %s", mg);
        // }
        //送票
        // channel.sendToQueue(queue, Buffer.from(msg));
        // console.log("sigle Sent %s", msg);
        // //取票
        channel.consume('team2', function(_msg) {
  
            console.log("Received %s", _msg.content.toString());
            // channel.ack(_msg)
        })
    });
});