const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
app.use(fileUpload({createParentPath: true}));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev'));
var MyLib = require("../../public/_LibNode"); 
var path = require('path');
const sleep = (tim) => new Promise((res, rej) => setTimeout(res, tim));
var gUID = "BF4E3603-135C-48F1-9DBB-479A6FD5BBF8";


app.post('/ocr' ,async (req, res) => {
    if(gUID == req.query.UID ){
        let leftName ='./temp_pic/' + Math.floor(Date.now() / 1000)+ "_" + parseInt((Math.random() * 100000000000), 10);
        let rt = await MyLib.upFile(req,leftName);
        if(rt.status){
            console.log(rt);
            await sleep(500); //如果文件很大，可能要很长的时间
            let code = await MyLib.OCR(rt.filePath);
            rt.ocr_words = code.words_result;
            res.send(rt);
        }else{
            res.send(rt);
        }
    } else{
        res.send('{status:false,message:"UID错误"}'); 
    }
});
console.log("http://121.4.43.207:3002/ocr?UID=xxxxxxxxxxx\nlistening......");
app.use(express.static(".")).listen(3002);

