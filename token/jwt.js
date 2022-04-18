//原文：http://m.zyiz.net/tech/detail-191300.html
// npm i jsonwebtoken
// npm i express-jwt
var jsonWebToken = require('jsonwebtoken');
 
//密钥，当然实际的项目中密钥应该变态一些
const SECRET_KEY = 'jarry'
 
const token = jsonWebToken.sign({
    exp:Math.floor(Date.now() / 1000) + (60 * 60),
    userId:"1001",
    role:"admin"
},SECRET_KEY,{
    expiresIn:"24h", //token有效期
    // expiresIn: 60 * 60 * 24 * 7,  两种写法
    // algorithm:"HS256"  默认使用 "HS256" 算法
})
 
console.log(token)