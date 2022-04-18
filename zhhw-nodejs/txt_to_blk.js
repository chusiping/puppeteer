var fs = require("fs");
var path = require('path');
var sleep = require('system-sleep');

function 加sz前缀(code)
{
    st = '0';
    if(code.indexOf('6') == 0)st='1';
    return st+code;
}
function 逐行读取(hangshu)
{
    var textcontent = "";
    try {
        const data = fs.readFileSync('shangzhanglv_stock.txt', 'UTF-8');
        const lines = data.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
            if(i==0) continue;
            const el = (lines[i].substring(0,6));
            textcontent += 加sz前缀(el)+"\r\n";
            if(i == hangshu)break;
        }
        console.log(textcontent);
        stringTo生成文件(textcontent,"TOP.blk","F:\\new_tdx\\T0002\\blocknew\\TOP.blk");
        stringTo生成文件(textcontent,"TOP.blk","E:\\____dropbox__Sync\\Dropbox\\配置文件中转站\\TOP.blk");
    } catch (err) {
        console.error(err);
    }
}

//参数1：写入文件的内容  “我是内容”
//参数2：生成文件的全路径 "F:\\new_tdx\\T0002\\blocknew\\TOP.blk";
//参数3：复制生成文件到目标全路径
//调用：stringTo生成文件(textcontent,"TOP.blk","E:\\____dropbox__Sync\\Dropbox\\配置文件中转站\\TOP.blk")
function stringTo生成文件(string,fileName,copydest,bakdest)
{
    var writerStream = fs.createWriteStream(fileName);
    writerStream.write(string,'UTF8');
    writerStream.end();
    writerStream.on('finish', function(){
        var sourceFile = path.join(__dirname, fileName);
        var readStream = fs.createReadStream(sourceFile);
        var writeStream = fs.createWriteStream(copydest);
        readStream.pipe(writeStream);
        console.log("生成完成：" + sourceFile + ' 复制完成：' + copydest + " " + bakdest );
    });
}
逐行读取(100);