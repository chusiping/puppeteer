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

    var p = "E:\\____dropbox__Sync\\Dropbox\\配置文件中转站\\";
    // var fileName = "coverflow-3.0.1.zip";

    var sourceFile = path.join(__dirname, fileName);
    var destPath = path.join(p, fileName);

    fs.access(destPath, fs.constants.F_OK, (err) => {
        if(err){
            //不存在
        }
        else{
            //存在读取文件内容
            try {
                const data = fs.readFileSync(destPath, 'utf8')
                array = data.split('\r\n');
                for (let index = 0; index < array.length; index++) {
                    const element = array[index];
                    console.log(element)
                }
                // console.log(data)
            } catch (err) {
                // console.error(err)
            }
        }
    });

    // var readStream = fs.createReadStream(sourceFile);
    // var writeStream = fs.createWriteStream(destPath);
    // readStream.pipe(writeStream);
    console.log("移动完成 - " + destPath );
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

//增加去重累计
//1 判断目标blk在不在
//2 读取blk的代码，加入数组
//3 把爬取的数组也加到总数组中
//4 数组去重
//5 写回blk，复制到目标文件夹
hdcode('');

