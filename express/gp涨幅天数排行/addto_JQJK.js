const sleep = (tim) => new Promise((res, rej) => setTimeout(res, tim));
var exec = require('child_process'); 
var lib = require('../../public/_LibNode'); 
//返回cookie值
var cookie = ()=>{
    // return '__utma=156575163.1268590257.1627262428.1646796534.1646971540.9;__utmc=156575163;__utmz=156575163.1627262428.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none);escapename=chusiping;historystock=002761%7C*%7C600062%7C*%7C600769%7C*%7C600519;Hm_lpvt_78c58f01938e4d85eaf619eae71b4ed1=1654502578;Hm_lvt_78c58f01938e4d85eaf619eae71b4ed1=1654499599;ticket=8e2d1f22c0a8adbd343b9d36e4ec1b2a;u_name=chusiping;user=MDpjaHVzaXBpbmc6Ok5vbmU6NTAwOjg2NzY0MzE0OjcsMTExMTExMTExMTEsNDA7NDQsMTEsNDA7NiwxLDQwOzUsMSw0MDsxLDEwMSw0MDsyLDEsNDA7MywxLDQwOzUsMSw0MDs4LDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxLDQwOzEwMiwxLDQwOjI3Ojo6NzY3NjQzMTQ6MTY1NDQ5ODc2NDo6OjEyNjAyOTE3ODA6MjI2ODM2OjA6MWEzYWNiYjQwM2NkYjlkYzU0OGJjZmUwYjFjYjJjOWZlOmRlZmF1bHRfNDow;user_status=0;userid=76764314;utk=170c2b865cfff8df628d5fafef36b735;v=A4pTWY9U3FiCH1D08RkrJJ5u23svew9PAP2CeRTDNl1oxyQt_Ate5dCP0p7n;Hm_lpvt_da7579fd91e2c6fa5aeb9d1620a9b333=1654502578;Hm_lvt_da7579fd91e2c6fa5aeb9d1620a9b333=1652082554,1654498861;'

    return 'em_hq_fls=js; st_si=42671117262218; qgqp_b_id=0e771b8aa1190285582a8b6ca7938de3; em-quote-version=topspeed; p_origin=https%3A%2F%2Fpassport2.eastmoney.com; login_canskip=true; intellpositionL=1013.49px; yzmkey=92928e5dd2f6496d8c4e0bfd27244fd9; intellpositionT=2055.11px; login_apicontext=rhz3Y1cR5uZ5IpDRpN%2FVmj1YGOmoCLLbecJT8AcRdWX61DjNP4rk%2B3uQUHM%2FVssl912coOF61EmqPYD0TxzOcOCh0NCx6evgBgZIwBhV7aH7i5pHbspEXd09o6fjskxt%2Fe0jaO4N4YDKsFZcWTv7r5vm9dKWkBN5s3FUB1OgCB4%3D; mtp=1; ct=iYyz_fsnhBJb6GTebXeRKIbp3DRCpeodZAja2AJFXE0TRbzaa903yDrnyL9Wsf6TmmjAygqq2kBRulEDF-w3RE_xyPI_yyTqUb0Gtk1hAB6x4KTBbLF_Xgp7oo4n4xusU4qTJY1sqPxSBbWmMUdNWJg2OjGmc7w4xOfh5lF_-yM; ut=FobyicMgeV6W21ICVIh674b-4cT8YBaIDxfxf5hBLhgiiVlkCdk9OEyAaXgBfZQYi7vu62r2eFFB1RiQVSLTvluK0U_DUIOYwG1lUr-h75-z1opMZyrowt3ntpcCpmDBuzkbs-2e0d7G0DJpQDrI3WN51gbJfaxI-2p5AuYnzmBCc3jtHBCxEmSNE-_4zB19iyxCNDTfRDAp9lew4x7rg8K5ctGVmM5DPUmc47u04rAgydxorKLx6iW72zueQCFTp9X5q_Aqkdy9yQtUf2QaWeJe16t_yxOb; pi=3391013824560020%3b%3b%e5%bf%83__%e8%bf%9c%3bFbwEroScrhAnlsmh8HdQLplIvLP6bt9LkoQlyhp%2bSDAbF5FEV9wswCQIAiH8HZuxJgaNAcpIUKZwA8LE7%2b1wAuzndSZSRRyZ%2fdGGljUID0xJFyYrlPI%2fbvpkZgv3Rq0PVumRzY32UtIA3Q2uKO6jbQx0%2bc0o3JNbVMc9RkaFx37l06ky7Qh4OhsPfICbg7ZfQZ1lVoHq%3bCwuhWhkwM5j3ec%2b60V4fY%2fit9Q5J5fXrwZutDuwsqHQFFg1LVpl%2f%2fLa%2fYgIk2eWWl5dXBIYOSFRHrFT2dn%2fmzHxwWtxtZgHHVbkXJYGPVJ9EWis49T9bHXbzxfJeA%2f2BlaYDZZddeLRHGszG0YLHZM3ZKPXPOg%3d%3d; uidal=3391013824560020%e5%bf%83__%e8%bf%9c; sid=8960218; vtpst=|; HAList=a-sh-601975-%u62DB%u5546%u5357%u6CB9%2Ca-sz-000756-%u65B0%u534E%u5236%u836F%2Ca-sz-000957-%u4E2D%u901A%u5BA2%u8F66%2Ca-sz-002761-%u6D59%u6C5F%u5EFA%u6295%2Ca-sh-601066-%u4E2D%u4FE1%u5EFA%u6295%2Ca-sz-000722-%u6E56%u5357%u53D1%u5C55%2Ca-sz-002883-%u4E2D%u8BBE%u80A1%u4EFD%2Cty-90-BK0473-%u8BC1%u5238%2Ca-sz-002670-%u56FD%u76DB%u91D1%u63A7%2Ca-sz-002603-%u4EE5%u5CAD%u836F%u4E1A%2Ca-sz-002424-%u8D35%u5DDE%u767E%u7075%2Ca-sh-600062-%u534E%u6DA6%u53CC%u9E64; st_pvi=18891856310866; st_sp=2021-12-15%2009%3A14%3A12; st_inirUrl=http%3A%2F%2Fquote.eastmoney.com%2Fsz300967.html; st_sn=7084; st_psi=20220607154620191-113200301712-2515579100; st_asi=20220607154620191-113200301712-2515579100-Web_so_ss-3';
}

//获取自选股代码
var getZXG = async()=>
{
    var url = 'curl "http://win7.qy/vhost/custom/api_stock.php?fcname=get_bk2&code=bkzxg_%E8%87%AA%E9%80%89&showtype=1"';
    var rt = await eCurl(url);
    let arrCode = rt.split(',');
    return arrCode;
}

var eCurl = function(cmdStr) { //命令行执行curl
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
//自选股已经存在列表,返回数组
var myStockExist = async function (_cookie) {

    let cook = _cookie == null ? cookie() : _cookie ;
    let mystock = 'curl --cookie "'+ cook +'"  "http://myfavor.eastmoney.com/v4/webouter/ggdefstkindexinfos?appkey=d41d8cd98f00b204e9800998ecf8427e&cb=jQuery331008460323221682065_1654668930577&_=_time_" --referer http://quote.eastmoney.com/';
// console.log(mystock)
    mystock = mystock.replace('_time_', + Math.floor(Date.now() / 1000))
    var rt = await eCurl(mystock);
    var patt = /\$\d{6}\$/g;
    var rt2 = rt.match(patt);
    var rt3 = rt2.map(x=> x.replaceAll("$",""));
    return rt3 ;
}

//循环定时执行
var ForX = async function (miao,_cookie){
    let codeArr = await getZXG();
    let _miao_ = miao == null ? 2000 : miao;
    let cook = _cookie == null ? cookie() : _cookie ;
    let url2 = 'curl --cookie "'+ cook +'" https://t.10jqka.com.cn/newcircle/group/modifySelfStock/?callback=modifyStock&op=add&stockcode=_code_&_=_time_';  //同花顺自选股

    url2 = 'curl --cookie "'+ cook +'" "http://myfavor.eastmoney.com/v4/webouter/as?appkey=d41d8cd98f00b204e9800998ecf8427e&cb=jQuery33103190186058732998_165458125273&g=1&sc=_zero_%24_code_&_=_time_" --referer http://quote.eastmoney.com/';

    let Exsit = await myStockExist();
    for (let i = 0; i < codeArr.length; i++) {
        const el = codeArr[i];
        if(Exsit.includes(el)){
            console.log(el + " - 此自选股已经存在");
            continue;
        } 
        let _zero_ = getZero(el);
        let uurl = url2.replace('_code_',el).replace('_time_', + Math.floor(Date.now() / 1000)).replace('_zero_',_zero_); 
// console.log("1::\t\t"+uurl + "\n"); 
        let rt = await eCurl(uurl);
        let mb =  `${i+1} . 添加${el} : ${rt}`
        console.log(mb); 
        await sleep(_miao_);  
    }
}
var getZero = (code)=>{
    let rt = "0";
    if(code.substring(0,1) == "6") rt = "1";
    return rt;
}

lib.ExecArg(ForX);

//调用方式 : node addto_JQJK.js 1000  qqq