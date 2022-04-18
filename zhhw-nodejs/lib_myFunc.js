/*
    关键字：自定义常用函数
    文件内测试：
    文件外调用: var myFunc = require("./lib_myFunc");
*/
var AipOcrClient = require("baidu-aip-sdk").ocr;
var fs =  require("fs");


//返回mysql的sql数据结果promise对象  调用：lib.query('mysql-slave1', sql).then
const query = (myDBlink,sql,ArrConn) => {
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

//验证码转计算公式
let formatCode = (str)=>{  // formatCode("3+1=")   =>   3+1 
    st = str;
    st = st.replace(/\"/g, '').
    st = st.replace(/=/g,'');  
    st = st.replace(/×/g,'*');  
    st = st.replace(/÷/g,'/');  
    return st;
}

let print = (...obj) =>{        //循环打印 print(a,b.c);
    obj.forEach(el => console.log(el));
} 

async function sleep(time = 3000) {     //调用 await mf.sleep(2000)
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        },time);
    });
}
//检查文件是否存在
async function exists2(path) {
    return new Promise(resolve => {
        fs.stat(path, (err) => {
        resolve(err ? false : true);
        });
    })
}


/*
    关键字：百度ocr,百度文字识别,ocr识别
    功能描述：使用百度api识别登录的验证码
    文件内测试：(async () => { var rt = await OCR('btn3.jpg'); console.log(rt);})();
    文件外调用: var baidu = require("./lib_OCR_baidu");
                (async () => { var rt = await baidu.OCR('btn3.jpg'); console.log(rt);})();
               //打印结果: rt:5+3
*/
let OCR = async (_file) => {
    var APP_ID = "19608996";
    var API_KEY = "GvhzbLmCcr2uDhgzeh5pYuzi";
    var SECRET_KEY = "pL7n4MUtKbWTIwEtyGrHjdAiqGEAKl87";
    var client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);
    var image = fs.readFileSync(_file);
    var base64Img = new Buffer.from(image).toString('base64'); 


    var rt = await client.generalBasic(base64Img);
    var obj = (rt.words_result)[0].words;
    return JSON.stringify(obj)

    // 旧的方式，仅供参考
    // return new Promise(function(resolve, reject){
    //     //做一些异步操作
    //     client.generalBasic(base64Img).then(result=> {  
    //         rt = (result.words_result)[0].words
    //         // console.log(JSON.stringify(rt))
    //         resolve("rt:"+ JSON.stringify(rt));
    //     }); 
    // });
};


//时间格式化 new Date().format("yyyy-MM-dd hh:mm:ss")
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

//handTime(‘3小时前’) 转时间格式
async function handTime(str)
{       
    var reg=/\d+(小时前)|\d+(分钟前)|\d+(天前)|(昨天)|^\d+$|(刚刚)/;
    var reg2 = /\d{4}-\d{1,2}-\d{1,2}$/
    var reg3 = /(\d{4}-\d{1,2}-\d{1,2})( \d{2}:\d{2}:\d{2})/
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
    }
    else
    {
        str_ = new Date().format("yyyy-MM-dd hh:mm:ss");  
        return str_  
    }
}

module.exports.handTime = handTime;
module.exports.OCR = OCR
module.exports.formatCode = formatCode;
module.exports.print = print;
module.exports.sleep = sleep;
module.exports.exists2 = exists2;
module.exports.query = query;


