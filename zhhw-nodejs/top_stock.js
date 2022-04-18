//http://win7.qy/vhost/custom/api_stock.php?fcname=get_allkind_increased&code=day5
//http://hqquery.jrj.com.cn/upindex.do?sort=pl&page=1&size=20&order=desc&_dc=1632471364029
const got = require('got');
var iconv = require('iconv-lite');
var fs = require("fs");
var path = require('path');

function 加sz前缀(code)
{
    st = '0';
    if(code.indexOf('6') == 0)st='1';
    return st+code;
}
function 复制文件(string)
{
    var fileName = 'PH.blk';
    var writerStream = fs.createWriteStream(fileName);
    writerStream.write(string,'UTF8');
    writerStream.end();

    var to_path = "F:\\new_tdx\\T0002\\blocknew\\";
    var to_path2 = "E:\\____dropbox__Sync\\Dropbox\\配置文件中转站\\";
    // var fileName = "coverflow-3.0.1.zip";

    var sourceFile = path.join(__dirname, fileName);
    var destPath = path.join(to_path, fileName);
    var destPath2 = path.join(to_path2, fileName);

    var readStream = fs.createReadStream(sourceFile);
    var writeStream = fs.createWriteStream(destPath);
    var writeStream2 = fs.createWriteStream(destPath2);
    readStream.pipe(writeStream);
    readStream.pipe(writeStream2);

    console.log("移动完成 - " + destPath + ' and ' + destPath2 );
}

const hdcode = (async (stock_arr) => { 
    var string = "";
    for (let i = 0; i < 1; i++) {    //循环数组
        try {
            const response = await got('http://win7.qy/vhost/custom/api_stock.php?fcname=get_allkind_increased&code=day5'); 
            var array = eval(response.body);
            for (let i = 0; i < array.length; i++) {
                const el = array[i];
                string += 加sz前缀(el.stkc)+"\r\n";
            }
        } catch (error) {
            console.log('error:', error);
        }
    }
    // console.log(string);
    复制文件(string);
});
hdcode('');

