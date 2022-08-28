//代码来源： https://gitee.com/ls_web/echarts-demo
function getmData(_code) { //分时图 改为promise写法
    return new Promise((resolve, reject) => {
        var mdata = { "data": [] }
        $.ajax({
            // url: "http://data.gtimg.cn/flashdata/hushen/minute/sh601066.js?maxage=110&0.28163905744440854",
            url: "http://127.0.0.1:3004/getMinite_KLine?code="+_code,  //分时数据
            dataType: "json",
            cache: "false",
            type: "GET",
            success: function (rt) {
                let _arr = [];
                for (var i = 0; i < rt.data.length; i++) {
                    let _rt = [rt.data[i].m, rt.data[i].p, rt.data[i].v,];
                    _arr.push(_rt)
                }
                mdata.data = _arr
                resolve(mdata)
            },
            error: function () {
                reject("wrong");
            }
        });
    });
}
let GetSixCode = function (code){
    let mk = "sz";
    if(code.substring(0,1) == "6") mk = "sh";
    if(code.substring(0,1) == "5") mk = "sh";
    return mk+code;
};
function getInfo(_code) { //获取股票昨天的收盘价格
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "http://127.0.0.1:3004/test?code="+_code,
            dataType: "script",
            cache: "false",
            type: "GET",
            success: function () {
                t_code = GetSixCode(_code);
                var info = eval('hq_str_'+t_code).split(",")
                resolve(info)
            },
            error: function () {
                reject("查询信息失败")
            }
        })
    });
}
