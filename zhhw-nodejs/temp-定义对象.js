var AipOcrClient = require("baidu-aip-sdk").ocr;
var fs =  require("fs");


var Baidu = {
    APP_ID: '19608996',
    API_KEY: "GvhzbLmCcr2uDhgzeh5pYuzi",
    SECRET_KEY : 'pL7n4MUtKbWTIwEtyGrHjdAiqGEAKl87',
    client : new AipOcrClient(this.APP_ID, this.API_KEY, this.SECRET_KEY),
    // image : fs.readFileSync('btn3.jpg'),
    base64Img : new Buffer.from(fs.readFileSync('btn3.jpg')).toString('base64'),
    OCR :() => {
        // var APP_ID = "19608996";
        // var API_KEY = "GvhzbLmCcr2uDhgzeh5pYuzi";
        // var SECRET_KEY = "pL7n4MUtKbWTIwEtyGrHjdAiqGEAKl87";
        // var client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);
        // var image = fs.readFileSync('btn3.jpg');
        // var base64Img = new Buffer.from(image).toString('base64'); 
        
        return new Promise(function(resolve, reject){
            //做一些异步操作
            this.client.generalBasic(base64Img).then(result=> {  
                rt = (result.words_result)[0].words
                // console.log(JSON.stringify(rt))
                resolve("rt:"+ JSON.stringify(rt));
            }); 
        });
    }
};
Baidu.OCR().then(rt => { console.log(rt) } );
