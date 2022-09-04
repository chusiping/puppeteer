//代码来源 https://github.com/bda-research/node-crawler
// https://blog.csdn.net/wealth_123450/article/details/111572719
// 使用参考:https://www.programminghunter.com/article/4836319049/

const Crawler = require('crawler');
const cra = require("./lib_crawler.js")
const fs = require('fs')

let stderr = fs.createWriteStream('./mylog.log', {flags: 'w',  encoding: 'utf8', });//日志
let logger = new console.Console(stderr);
var idx =0;
// var doneX = 0

var img_wait_set = new Set();
var img_wait_Array = [];

const c =  new Crawler({
    maxConnections : 2, // 最大并发数默认为10
    rateLimit: 1000,
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            getHref(res);
        }
        done();
    }
});

const dl = new Crawler({
    encoding:null,
    jQuery:false,// set false to suppress warning message.
    callback:function(err, res, done){
        if(err){
            console.error(err.stack);
        }else{
            fs.createWriteStream( "./temp/" +res.options.filename).write(res.body);
        }
        done();
    }
});


var array_1 = [
    // '{"url":"http://www.gqnmt.com/sipai/mztphoto/20230703/150990.html","deep":"yes"}',
    '{"url":"http://www.gqnmt.com/sipai/mztphoto/20230703/150990.html","deep":"yes"}',
];
var Url_wait_set = new Set();//等待队列
var Url_done_set = new Set();//已完队列


var idy =0;
// 简单方式处理
let getHref = (res__) => {
    var $ = res__.$;
    let sURL = res__.options.url;
    logger.log( (idy++) + "当前页面地址 :: " + sURL);
    const dataList = $("div.pagelist > p > b > a");
    let star = false;
    var obj = null;

    let newArr =  [...Url_wait_set];//???
    for (let x = 0; x < newArr.length; x++) {
        const str = newArr[x];
        obj = JSON.parse(str);
        if (JSON.stringify(obj) == str) {
            star =true;  //如果等地队列中有当前url则进入分析,否则跳过
            break;
        }
    }
    if (star) {
        getPic(res__,idy);
        Url_wait_set.delete(JSON.stringify(obj));
        Url_done_set.add(JSON.stringify(obj));
        if(obj.deep=="yes") {
            dataList.each((index, dataItem) => {
                let dataRes = {};
                //此处加函数处理a
                const href = dataItem.attribs["href"];
                var rt = res__.options.url.substring(0, res__.options.url.lastIndexOf("/")) + "/" + href;
                let hisArr = [...Url_done_set];
                if (!hisArr.includes(rt) && res__.options.url != rt) {  //A和B可能都含有相同的html的href 如果在历史数组中未曾出现,在加入待处理GetArr2(rt)
                    //如果没有在历史数组中出现过 //加入待处理
                    let objstr = '{"url":"'+ rt +'","deep":"no"}';
                    idx++;
                    logger.log(idx + " - 加入等候::" + rt);console.log(idx + " - 加入等候::" + rt)
                    Url_wait_set.add(objstr);
                }
            });
        }
    }
};




let getPic = (__res,idx) => {
    var $ = __res.$;
    const dataList = $("div#picg > p > a > img");
    dataList.each((index, dataItem) => {
        const href = dataItem.attribs["src"];
        img_wait_set.add(href);
        img_wait_Array.push(href);
        logger.log("\t图片 ::\n\t" + href);
    });
};


//1. 循环页面数组

let downImg = ()=>{
    let ImgSet = new Set(img_wait_Array);
    logger.log("总数 :: "+ [...ImgSet].length);
    [...ImgSet].forEach((el,index_) =>{
        logger.log("下载... :: "+ el);console.log("下载... :: "+ el)
        let _FileName = el.substr(el.lastIndexOf('/')+1); //取文件名
        let FArr = _FileName.split('.');
        let _NFName = FArr[0] + index_ + '.' +  FArr[1] 
        dl.queue({
            uri: el,
            filename: _FileName,
            headers: { 'User-Agent': 'requests' }
        });
    } );
    console.log("结束")
    return;
}

let For2While  =() =>{
    array_1.forEach(obj => {
        Url_wait_set.add(obj);
        logger.log("入口加入 :: "+ obj);
    });
    let _RWDL = "";
    var fortime = "null";
    fortime = setInterval(function() {
        let workArr =  [...Url_wait_set];
        let RWDL = "队列任务数：" + workArr.length
        if(_RWDL != RWDL){ //防止重复显示
            logger.log(RWDL);console.log(RWDL)
            _RWDL = RWDL;
            workArr.forEach(el => {
                let obj = JSON.parse(el)
                c.queue({ url:obj.url , headers: { 'User-Agent': 'requests' }});
            });
        }else{
            if(workArr.length == 0){
                downImg();
                clearInterval(fortime);
            }
        }
    },300);
}
For2While();



















// c.queue({
//     uri:"https://news-bos.cdn.bcebos.com/mvideo/log-news.png",
//     filename:"log-news.png"
// });
