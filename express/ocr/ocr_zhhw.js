var baidu = require("../../public/_LibNode"); 
var myOCR = async () => {
    // code = await baidu.OCR('btn3.jpg');
    code = await baidu.OCR('temp_pic/11.png');
    console.log(code);
}
myOCR();
