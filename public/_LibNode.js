var fs = require('fs');
var path = require('path');
var AipOcrClient = require("baidu-aip-sdk").ocr;
var exec = require('child_process'); 

/* ConnRs 是数组,可以链接多个数据库
    var ConnRs = 
    [{charset: 'utf-8',host:'mysql-slave1',  obj: mysql.createConnection({host:'119.23.57.45',  user:'yuefeng_read', password : 'yuefeng!@#100', database : 'yuefeng'})}];
    返回mysql的sql数据结果promise对象  调用：lib.query("mysql-slave1",sql,ConnRs).then
*/
exports.query = (myDBlink,sql,ArrConn) => {
    return new Promise((resolve, reject)=>{
        ArrConn.forEach(conn => {
            if( myDBlink == conn.host ) {
                conn.obj.query(sql,function (err, result) {
                    rt = [];
                    result.forEach(x => { rt.push(x);});
                    resolve(rt);
                    if(err){ reject("error:"+err);}
                });
            };
        });
    })
}; 


//执行cmd命令 var rt = await eCurl(url);
exports.eCurl = function(cmdStr) { //命令行执行curl
    return new Promise((resolve,reject)=>{
        exec.exec(cmdStr, function(err,stdout,stderr){  //命令行执行curl
            if(err) {
                reject('error:'+stderr); 
            } else {   
                // var data = JSON.parse(stdout);  //curl成功返回data
                resolve((stdout));
            }
        });
    });
}

// key:遍历删除文件
// 删除文件清除指定文件夹下所有文件和文件夹 : MyLib.delDir('./temp_pic');
function delDir (path){
    let files = [];
    if(fs.existsSync(path)){
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()){
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
                console.log("删除文件 : "+ curPath)
            }
        });
    }
}


// 上传文件到目录: let rt = await MyLib.upFile(req,'./temp_pic/1655562957_3444134456.png'); 
// 注意文件实际还没有完全传完,需要 await sleep下 , 指定req.files.file,否则出错
exports.upFile = async (req,SetNewName) => {
    return new Promise((resolve, reject) => {
        let fileSize = 1000;
        let msg_empty = { status: false, message: "空文件!" };
        let msg_big = { status: false, message: "文件不能大于 " + fileSize + " k!" };
        let msg_ok = { status: true, message: "上传成功" , filePath :"" , ocr_words : "" };
        let msg_err = { status: false, message: "error!" };
    
        try {
            if(!req.files) { resolve(msg_empty)  } 
            else {
                let avatar = req.files.file;
                if(avatar){
                    let size =  (avatar.size / 1024).toFixed(2); //小数位数
                    if (size > fileSize) { resolve(msg_big)   } else 
                    {
                        let _Path = SetNewName + path.extname(avatar.name);
                        var nonce = parseInt((Math.random() * 100000000000), 10); //sui
                        avatar.mv(_Path);
                        msg_ok.filePath = _Path;
                        resolve(msg_ok) ;
                    }
                }else{ resolve(msg_empty) }
            }
        } catch (err) { reject(msg_err) } //res.status(500).send(err);
    });
} 

// 调用ocr : let code = await MyLib.OCR(rt.filePath);
exports.OCR = async (_file) => {
    var APP_ID = "";
    var API_KEY = "";
    var SECRET_KEY = "";
    var client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);
    var image = await fs.readFileSync(_file);
    var base64Img = new Buffer.from(image).toString('base64'); 
    var rt = await client.generalBasic(base64Img);
    return rt;
    // var obj = (rt.words_result)[0].words;
    // return JSON.stringify(obj)
};


//通过函数: 接受参数执行方法 node addto_JQJK.js 1000  qqq
exports.ExecArg = (func) =>{
    var arg = process.argv.splice(2);
    if(arg.length >0)
    {
        let miao = arg[0];      //参数1 时间轮训间隔
        let cookie = arg[1];    //参数2 cookie 字符串
        func(miao,cookie);
    }else{
        func();
    }
}

//key:自增序号
//在闭包里自增序列号  const IndexA = lib.RowIndex(); //闭包循环累加实例
exports.RowIndex = (content='',isPrint=true) => {
    var num = 0;
    return function (content='') {
    num++;
    if(isPrint) console.log(content + " - " +num);
    }
}


exports.writeFileWithStream = (filePath, jsonstring, cb) => {
    let streamWrite = fs.createWriteStream(filePath);
    streamWrite.write(jsonstring);
    streamWrite.end();
    streamWrite.on('error',(err)=>{
        cb(`写入${filePath}异常：${err}`);
    });
    streamWrite.on('finish',()=>{
        cb();
    });
};


//生成文件
exports.gFile = (htmlcode,fileName)=>{
    var writerStream = fs.createWriteStream(fileName); 
    writerStream.write(htmlcode,'UTF8');    
    writerStream.end();    
};


exports.unique = (arr)=>{
    var top = [];
    for (const item of arr) {
        if(!top.includes(item) )
        top.push(item);
    }
    return top;
}

function readdirPromisify(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, list) => {
            if (err) {
                reject(err);
            }
            resolve(list);
        });
    });
}

//返回文件或路径创状态
function statPromisify(dir) {
    return new Promise((resolve, reject) => {
        fs.stat(dir, (err, stats) => {
            if (err) {
                reject(err);
            }
            resolve(stats);
        });
    });
}
function listDir(dir) {
    return statPromisify(dir).then(stats => {
        if (stats.isDirectory()) {
            return readdirPromisify(dir).then(list => 
                Promise.all(list.map(item => 
                    listDir(path.resolve(dir, item))
                ))
            ).then(subtree => [].concat(...subtree));
        } else {
            return [dir];
        }
    });
}
//路径一维数组转级联数组
//输入: ['a\a1.bmp','a\a2.bmp','b\b1.bmp','b\b2.bmp']
//输出: [{d:'a',f:['a\a1.bmp','a\a2.bmp']} , {d:'b',f:['b\b1.bmp','b\b2.bmp']}]
//调用: var fileArr = await lib.listDir("C:\\Users\\Administrator\\Desktop\\youtube-临时");
//      var a = lib.ReBuildRs(fileArr)
var ReBuildRs = (arr)=>{
    var top = [];
    for (const item of arr) {
        top.push(path.dirname(item));
    }
    var un = this.unique(top);
    var rt = [];
    for (const a of un) {
        var dd = {d:null,f:[]};
        for (const b of arr) {
            if(a==path.dirname(b))
            {
                dd.d= a;
                dd.f.push(b) ;
            }
        }
        rt.push(dd);
    }
    return rt
}


//1.时间格式化
Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}       
//2.时间转义 await lib.handTime(str.trim() | "3小时前" | "3分钟前" | "3天前" | "刚刚" )
function handTime(str)
{       
    var reg=/\d+(小时前)|\d+(分钟前)|\d+(天前)|(昨天)|^\d+$|(刚刚)/;
    var reg2 = /\d{4}-\d{1,2}-\d{1,2}$/
    var reg3 = /(\d{4}-\d{1,2}-\d{1,2})( \d{2}:\d{2}:\d{2})/
    var reg4 = /\d{4}\/\d{1,2}\/\d{1,2}$/
    // if(dd.test(str)) return (new Date().format("yyyy-MM-dd"))
    if(reg.test(str)) 
    {
        var t = new Date();//你已知的时间
        let str_ = ""
        if(str.includes("小时前"))
        {
            str_ = str.replace("小时前", '')  
            str_ =  t.setTime(t.setHours(t.getHours() - parseInt(str_)));
        }
        else if(str.includes("分钟前"))
        {
            str_ = str.replace("分钟前", '')  
            str_ =  t.setTime(t.setMinutes(t.getMinutes() - parseInt(str_)));
        }
        else if(str.includes("天前"))
        {
            str_ = str.replace("天前", '')  
            str_ =  t.setTime(t.setDate(t.getDate() - parseInt(str_)));
        }
        else if(str.includes("昨天"))
        {
            str_ =  t.setTime(t.setDate(t.getDate() -1));
        }
        else if(str.includes("刚刚"))
        {
            return (new Date().format("yyyy-MM-dd hh:mm:ss"))
        }
        else
        {
            return (new Date().format("yyyy-MM-dd hh:mm:ss"))
        }

        // str_ = sd.format(new Date(str_),"yyyy-MM-dd hh:mm:ss");;              // 必须使用插件var sd = require('silly-datetime');
        str_ = new Date(str_).format("yyyy-MM-dd hh:mm:ss");      // 必须使用扩展方法Date.prototype.format = function(fmt) {}
        return str_
    }
    else if(reg2.test(str)) 
    {
        return str + " 00:00:00"
    }
    else if(reg3.test(str)) 
    {
        return str
    }else if(reg4.test(str)) 
    {
        return new Date(str).format("yyyy-MM-dd hh:mm:ss"); 
    }
    else
    {
        str_ = new Date().format("yyyy-MM-dd hh:mm:ss");  
        return str_  
    }
}
//3.线程睡眠间隔3秒 await lib.sleep(30000);
async function sleep(time = 3000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        },time);
    });
}

//4 表达式转为数组 'test_[1-3]_html' => [test_1_html,test_2_html,test_3_html]
var Exp2Array = (page) =>{
    var rt = [];
    reg=/\[\d+\-\d+\]/;
    if(reg.test(page))
    {
        var strMC = page.match(reg)[0]  //取出 [n-m]
        var pageSplit = page.split(strMC); //拆分 url 
        strMC = strMC.replace(/\[/,"").replace(/\]/,"") // [n-m] 变成 n-m
        pageNoSplit = strMC.split('-'); //n-m 变成 [n,m]
        for (let i = pageNoSplit[0]; i <= pageNoSplit[1]; i++) {
            str = pageSplit[0]+ i +pageSplit[1];
            rt.push(str)
        }
    }else{
        rt.push(page)
    }
    return rt;
}
// \n 力帆是怎么.. |||https://donews.com/...|||23小时前' 转为对象
var ClearTitleHtml = (str)=>{
    x_ = str.replace("null","").replace(/\n/g,"").replace(/\t/g,"")
    arr = x_.split("|||");
    var _bj = { site:null, name:arr[0].trim(), href:arr[1], dateTime: arr[2]};
    var rt = { array : arr,obj : _bj };
    return rt;
}


exports.handTime = handTime;
exports.sleep = sleep;
exports.Exp2Array = Exp2Array;
exports.ClearTitleHtml = ClearTitleHtml;
exports.statPromisify = statPromisify 
exports.listDir = listDir
exports.ReBuildRs = ReBuildRs
exports.delDir = delDir