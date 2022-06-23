var rpc = require('./rpc_main.js');
var add = "localhost";  //add = "121.4.43.207"; //add = "localhost";
rpc.connect(5556, add, function(remote, conn){
    remote.ocr(3000,  function(){
        console.log("1::")
        // var a = await res;
        
    });
});