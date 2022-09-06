//代码来源 https://github.com/bda-research/node-crawler
// https://blog.csdn.net/wealth_123450/article/details/111572719
// 使用参考:https://www.programminghunter.com/article/4836319049/

const Crawler = require('crawler');
const cra = require("./lib_crawler.js")
const fs = require('fs')
const path = require('path')

let stderr = fs.createWriteStream('./mylog.log', {flags: 'w',  encoding: 'utf8', });//日志
let logger = new console.Console(stderr);
var idx =0;
// var doneX = 0

// '{"url":"","deep":"yes"}',
// '{"url":"","deep":"yes"}',
// '{"url":"","deep":"yes"}',
// '{"url":"","deep":"yes"}',
// '{"url":"","deep":"yes"}',
// '{"url":"","deep":"yes"}',
// '{"url":"","deep":"yes"}'
var array_1 = [
    {"url":"http://www.swmzt.com/si/wamei/20210809/106315.html","deep":"yes"},
    {"url":"http://www.swmzt.com/si/wamei/20210806/106110.html","deep":"yes"}
];



let Is重复 = (array,str)=>{
    for (let index = 0; index < array.length; index++) {
        const item = array[index];
        if(item.url==str){
            return item;
        }else{
            return null;
        }
    }
}


var arrRemove = function (arr, attr, value) {
    let newArr = arr.filter(function (item, index) {
        return item[attr] != value
    })
    return newArr
}



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
var Url_wait_set = [];//等待队列
var Url_done_set = [];//已完队列
var idy =0;
// 简单方式处理
let getHref = (res__) => {
    var $ = res__.$;
    let sURL = res__.options.url;
    if(Is重复(Url_done_set,sURL)!=null) return;//如果当前页面地址在历史集合中存在,则跳过
    if(Is重复(Url_wait_set,sURL)==null) return
    logger.log( (idy++) + "当前页面地址 :: " + sURL);

    if (1==1) {
        getPic(res__,idy);
        let obj = Is重复(Url_wait_set,sURL);
        if(obj !=null) Url_done_set.push(obj) //加入历史
        if(obj.deep=="yes") {
            const dataList = $("div.pagelist > p > b > a");
            dataList.each((index, dataItem) => {
                // if(index >2) return false; 
                let dataRes = {};
                //此处加函数处理a
                const href = dataItem.attribs["href"];
                var _newHref_ = res__.options.url.substring(0, res__.options.url.lastIndexOf("/")) + "/" + href;

                if(Is重复(Url_done_set,_newHref_)==null && res__.options.url != _newHref_) //A和B可能都含有相同的html的href 如果在历史数组中未曾出现,在加入待处理GetArr2(rt)
                {
                    let obj__ = {"url":_newHref_,"deep":"no"};
                    idx++;
                    // logger.log(idx + " - 加入等候::" + rt);
                    console.log(idx + " - 加入等候::" + _newHref_)
                    Url_wait_set.push(obj__);
                }
            });
        }
        Url_wait_set = arrRemove(Url_wait_set,"url",sURL) //剔除等待
    }
};
let getPic = (__res,idx) => {
    var $ = __res.$;
    const dataList = $("div#picg > p > a > img");
    dataList.each((index, dataItem) => {
        let href = dataItem.attribs["src"];
        href =  href + ',' + $("title").text() //添加路径
        img_wait_set.add(href);
        img_wait_Array.push(href);
        logger.log("图片加队列::" + href);
        console.log("图片加队列::" + href);
    });
};
//1. 循环页面数组
let downImg = ()=>{
    let ImgSet = new Set(img_wait_Array);
    logger.log("图片总数 :: "+ [...ImgSet].length);
    console.log("图片总数 :: "+ img_wait_Array.length);
    [...ImgSet].forEach((el__,index_) =>{
        let el = el__.split(',')[0];
        let _dir_ = el__.split(',')[1]
        logger.log("下载... :: "+ el);console.log("下载... :: "+ el)
        let _FileName = el.substr(el.lastIndexOf('/')+1); //取文件名
        let FArr = _FileName.split('.');
        let _NFName = FArr[0] + index_ + '.' +  FArr[1] 
        _FileName = _dir_ + "/" + _FileName; //增加目录
        let fileDir1 = path.resolve(__dirname, './temp/'+_dir_);
        if (fs.existsSync(fileDir1)) {
            // console.log(fileDir1 + '该路径已存在');
        }else{
            fs.mkdir(fileDir1, err => {
                // if (err) throw err
                // console.log('创建成功')
            })
        }
 
        
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
        Url_wait_set.push(obj);
        logger.log("入口加入 :: "+ obj.url);
    });
    let _RWDL = "";
    var fortime = "null";
    fortime = setInterval(function() {
        let workArr =  Url_wait_set;
        let RWDL = "队列任务数：" + workArr.length
        if(_RWDL != RWDL){ //防止重复显示
            logger.log(RWDL);console.log(RWDL)
            _RWDL = RWDL;
            workArr.forEach(el => {
                c.queue({ url:el.url , headers: { 'User-Agent': 'requests' }});
            });
        }else{
            if(workArr.length == 0){
                downImg();
                // let ImgSet = new Set(img_wait_Array);
                // msg = [...ImgSet] ;
                // console.log(msg);logger.log(msg);
                clearInterval(fortime);
            }
        }
    },1000);
}
For2While();



















// c.queue({
//     uri:"https://news-bos.cdn.bcebos.com/mvideo/log-news.png",
//     filename:"log-news.png"
// });
