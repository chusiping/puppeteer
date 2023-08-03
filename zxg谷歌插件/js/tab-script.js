const data = [
    { label: "#费城风云", value: "费城风云" },
    { label: "#美股指数", value: "美股指数" },
    { label: "#文昭,江峰,天亮时分,嘚啵嘚,老灯,李沐阳", value: "文昭,江峰时刻,天亮时分,嘚啵嘚,老灯,李沐阳" },
    { label: "#阿南德,帕克", value: "阿南德,英国预言家帕克" },
    { label: "#乌克兰战争", value: "乌克兰战争" },
    { label: "#新闻-青灯观青史", value: "青灯观青史" },
    { label: "#新闻-新聞看點李沐阳", value: "新聞看點李沐阳" },
    { label: "#新闻-薇羽看世間", value: "薇羽看世間" },
    { label: "#科技-零度解说 ", value: "零度解说 " },
    { label: "#中医-醫道搬運工", value: "醫道搬運工" },
    { label: "#中医-《家有大中医》官方频道", value: "《家有大中医》官方频道" },
    { label: "#美女-이지Leezy", value: "이지Leezy" },
    { label: "电影-初心熟男", value: "初心熟男" },
    { label: "电影-小川侃电影", value: "小川侃电影" },
    { label: "电影-电影迷小雅", value: "电影迷小雅" },
    { label: "电影-青蛙刀圣1993", value: "青蛙刀圣1993" },
    { label: "电影-电影最TOP唯一官方频道", value: "电影最TOP唯一官方频道" },
    { label: "电影-小涛讲电影", value: "小涛讲电影" },
    { label: "音乐-EHPMusicChannel", value: "EHPMusicChannel" },
    { label: "音乐-URBAN DANCE CAMP", value: "URBAN DANCE CAMP" },
    { label: "jQuery-拖动放大", value: "拖拽放大缩小插件idrag,vue-draggable-resizable" },
    { label: "jQuery-工具类库", value: "前端常用插件、工具类库汇总 不要重复造轮子啦" }
];
//扩展属性
Number.prototype.add = function (n) {
    return this + n;
}
Number.prototype.print = function () {
    console.log(this.toString());
}

$(function () {

    $("#tabs").tabs();
    AppData("keyWord", data); //找到storge里数据源名为keyWord的数组数据，追加到data数组
    $("#key").autocomplete({
        delay: 200, autoFocus: false, source: data, minLength: 0,

    }).focus(function () {
        this.source = data;
        $(this).autocomplete("search", "#");
    });
    $("#key").click(function () {
        // $("#key" ).val('');
        // $("#key" ).focus();
        $("#key").select();
    });
    $("input").click(function () {
        if (this.id == "key") return;
        // forOpen(Site[this.id]);
        forOpen(Site, this.id);
        console.log(this.id);
        save_input("#key", "keyWord");
    });
    let google3=(data)=>{
        var windowParam = "height=510,width=750";
        doOpenPostWin('http://win7.qy:8001/google3.php?keyword='+data, [{ name: "keyword", value: $("#key").val() }], "google", windowParam);
    }

    // $("#key").on("click","#twoAdd",function(){ console.log('tmie1111111')  });
    // setTimeout(x=>{  $("#key").trigger("click"); ;console.log('tmie33353')},3500);
    // 
    document.onkeydown = function (e) {
        console.log("bt")
        if (!e) e = window.event;//火狐中是 window.event
        if ((e.keyCode || e.which) == 13) {
            // forOpen(Site, 'common');
            // forOpen(Site, 'baidu');
            forOpen(Site, 'google3');
        }
    }

});

const Site = {
    common: `http://www.google.com/search?q=_key_`,
    google3: `http://win7.qy:8001/google3.php?keyword=_key_`,
    baidu:`https://www.baidu.com/s?wd=_key_`,
    youtube: `https://www.youtube.com/results?search_query=_key_`,
    youdao: `http://www.youdao.com/w/eng/_key_/#keyfrom=dict2.index`,
    taobao: `https://ai.taobao.com/search/index.htm?key=_key_`,
    twitter: `https://twitter.com/search?q=_key_`,
    gupiao: `https://biz.finance.sina.com.cn/suggest/lookup_n.php?q=_key_&country=stock`,
    gupiao_code2: `https://q.stock.sohu.com/cn/_key_/index.shtml`,
    gupiao_code: `https://finance.sina.com.cn/realstock/company/_key_/nc.shtml`
};

const sz = (code) => {
    var rt = "sz";
    if (code.substring(0, 1) == "6") rt = "sh";
    return rt + code;
}


// 调用：forOpen(Site[this.id]);
var forOpen = (site, buttonName) => {
    var url = site[buttonName];
    var key = $("#demo").val().replace("，", ",");//"#key"  换成  "#demo"
    if (buttonName == "gupiao") key = key.replaceAll(" ", ",");
    var Things = key.split(',');
    for (let i = 0; i < Things.length; i++) {
        if (Things[i] == "") continue;
        var item = Things[i];
        if (buttonName == "gupiao_code") item = sz(Things[i]);
        window.open(url.replace("_key_", item), "_blank", "");
    }
}



//读取 [{"key_datalist":"aa1"},{"key_datalist":"aa2"}]
var ReadStorage = (ControlName, DateListName) => {
    if (!window.localStorage) {
        alert("浏览器支持localstorage");
        return null;
    } else {
        var storage = window.localStorage;
        var json = storage.getItem(DateListName);
        var jsonObj = JSON.parse(json);
        console.log(typeof jsonObj);
        if (jsonObj == null) return []; //若干地产以
        return jsonObj;
    }
}
//调用：save_input("#key","keyWord");
//写入结果：数组类型子串 [{"keyWord":"aa1"},{"keyWord":"aa2"}]
var save_input = (ControlName, DateListName, Clear) => {
    var storage = window.localStorage;
    //参数为clear，就清除全部
    if (Clear == "clear") storage.setItem(DateListName, "");
    if (!window.localStorage) {
        alert("浏览器支持localstorage");
    } else {
        var vl = $(ControlName).val();
        if (vl == "") return;
        var newob = {}; newob[DateListName] = vl;

        var hisObject = ReadStorage(ControlName, DateListName);
        for (var i = 0; i < hisObject.length; i++) {
            for (var key in hisObject[i]) {
                if (key == DateListName && hisObject[i][key] == vl) return;
            }
        };
        //数组追加对象
        hisObject.push(newob);
        var d = JSON.stringify(hisObject);
        storage.setItem(DateListName, d);
    }
}

var AppData = (DateListName, appData) => {
    var hisObject = ReadStorage("", DateListName);
    for (var i = 0; i < hisObject.length; i++) {
        var newob = {}; newob["label"] = hisObject[i][DateListName];
        appData.push(newob);
    };
}

function doOpenPostWin(url, args, name, windowParam) {
    //创建表单对象
    var _form = $("<form></form>", {
        'id': 'tempForm',
        'method': 'post',
        'action': url,
        'target': name,
        'style': 'display:none'
    }).appendTo($("body"));
    //将隐藏域加入表单
    for (var i in args) {
        _form.append($("<input>", { 'type': 'hidden', 'name': args[i].name, 'value': args[i].value }));
    }
    //绑定提交触发事件
    _form.bind('submit', function () {
        window.open("about:blank", name, windowParam);
    });
    //触发提交事件
    _form.trigger("submit");
    //表单删除
    _form.remove();
}

$(document).ready(function(e) {
    setTimeout(function(){
        // ttbb();
        // var alem= document.getElementById('key');
        // alem.focus();
        // $("input#key").focus();
        // $("input#key").val();
        // $("input#key").select();
    }, 1000)
});

let ttbb = ()=>{
    $('#key').trigger('click');
    console.log('123');
}