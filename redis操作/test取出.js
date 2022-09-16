var lib = require('../public/lib_redisList.js');
let x = 0;
setInterval(function () {
    lib.list('车架号').then((result)=>{
        console.log(result)
    })
}, 100);