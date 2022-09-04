//代码来源 https://github.com/bda-research/node-crawler
// https://blog.csdn.net/wealth_123450/article/details/111572719
// 使用参考:https://www.programminghunter.com/article/4836319049/

const Crawler = require('crawler');
const cra = require("./lib_crawler.js")
const fs = require('fs')

// 入口数组
var array_0 = [
    // 'http://www.gqnmt.com/sipai/mztphoto/20230315/144704.html'
    'http://www.gqnmt.com/sipai/mztphoto/20230703/150973.html',
    'http://www.gqnmt.com/sipai/mztphoto/20230703/150979.html',
    'http://www.gqnmt.com/sipai/mztphoto/20230703/150913.html'

];



//已完成数组
var array_F_set = new Set();
var img_F_set = new Set();

//待处理数组
var array_B_set = new Set();
var img_B_set = new Set();


const c =  new Crawler({
    maxConnections : 2, // 最大并发数默认为10
    rateLimit: 1000,
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            getPic(res);
            getHtmlHref(res);
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



let getHtmlHref = (res) => {
    var $ = res.$;
    const dataList = $("div.pagelist > p > b > a");
    console.log("准备处理 ::" + res.options.url)
    if ([...array_B_set].includes(res.options.url)) {//待处理队列里有当前的url才处理,完了扔到历史数组
        // console.log("删除前" + [...array_B_set].length);
        array_B_set.delete(res.options.url);
        array_F_set.add(res.options.url);
        dataList.each((index, dataItem) => {
        let dataRes = {};
        //此处加函数处理a
        const href = dataItem.attribs["href"];
      
        var rt = res.options.url.substring(0, res.options.url.lastIndexOf("/")) + "/" + href;

        
        let hisArr = [...array_F_set];
        if (!hisArr.includes(rt) && res.options.url != rt) {  //A和B可能都含有相同的html的href 如果在历史数组中未曾出现,在加入待处理GetArr2(rt)
            //如果没有在历史数组中出现过 //加入待处理
            console.log("加入等候::"+rt)
            array_B_set.add(rt);
        }
    });
    }
};


let getPic = (res) => {
    var $ = res.$;
    const dataList = $("div#picg > p > a > img");
    dataList.each((index, dataItem) => {
        const href = dataItem.attribs["src"];
        console.log("\rurl  ::"+ res.options.url);
        console.log("\timg  ::"+ href);
        img_B_set.add(href);
    });
};


//1. 循环页面数组

let ForWhile  =() =>{
    array_0.forEach(el => {
        array_B_set.add(el);
    });
    var fortime = setInterval(function() { 
        let workArr =  [...array_B_set];
        console.log("队列任务数：" + workArr.length)
        workArr.forEach(el => {
            if(![...array_F_set].includes(el)){ //如果历史数组没有的
                c.queue({ url:el , headers: { 'User-Agent': 'requests' }});
            }
        });
        if(workArr.length == 0){

            clearInterval(fortime);
            [...img_B_set].forEach(el =>{
                console.log("下载 :: "+ el);

                dl.queue({
                    uri: el,
                    filename:el.split('/').pop(), //取url的文件名
                    headers: { 'User-Agent': 'requests' }
                });
            } );
            
            console.log("结束")
            return;
        }
    },500); 
}
ForWhile();


















// c.queue({
//     uri:"https://news-bos.cdn.bcebos.com/mvideo/log-news.png",
//     filename:"log-news.png"
// });
