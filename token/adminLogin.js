var express = require('express');
var jwt = require('express-jwt');
var app = express();
 
//SECRET_KEY 要与生成 Token 时保持一致 
const SECRET_KEY = 'jarry' 
 

app.use(jwt({ secret: SECRET_KEY, algorithms: ['HS256']})
.unless({path: ['/auth/adminLogin',/^\/public\/.*/]}));


app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send("干嘛呢？你想硬闯？！")
    }
})
  
app.get("/test", 
jwt({ secret: SECRET_KEY, algorithms: ['HS256']}),
function(req,res){
    //do something...
})

app.listen(801);