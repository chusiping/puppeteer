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
//3.线程睡眠间隔3秒
async function sleep(time = 3000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        },time);
    });
}


exports.handTime = handTime;
exports.sleep = sleep;