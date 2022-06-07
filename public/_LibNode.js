var fs = require('fs');
var path = require('path');


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

exports.RowIndex = (content='') => {
    var num = 0;
    return function (content='') {
    num++;
    console.log(content + " - " +num);
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
//2.时间转义
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
//3.线程睡眠间隔3秒
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