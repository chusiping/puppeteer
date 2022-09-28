// 通过postMessage调用content-script
function invokeContentScript(code) {
    window.postMessage({
        cmd: 'invoke',
        code: code
    }, '*');
}
// 发送普通消息到content-script
function sendMessageToContentScriptByPostMessage(data) {
    window.postMessage({
        cmd: 'message',
        data: data
    }, '*');
}

// 通过DOM事件发送消息给content-script
(function () {
    var customEvent = document.createEvent('Event');
    customEvent.initEvent('myCustomEvent', true, true);
    // 通过事件发送消息给content-script
    function sendMessageToContentScriptByEvent(data) {
        data = data || '你好，我是injected-script!';
        var hiddenDiv = document.getElementById('myCustomEventDiv');
        hiddenDiv.innerText = data
        hiddenDiv.dispatchEvent(customEvent);
    }
    window.sendMessageToContentScriptByEvent = sendMessageToContentScriptByEvent;

    var myDate = new Date();
    var mytime = myDate.toLocaleTimeString(); //获取当前时间	
    console.log('我是 : E:\\____dropbox__Sync\\Dropbox\\阅读\\zxq\\js\\inject.js ' + mytime);
    if (location.host == 'q.stock.sohu.com') {
        clickDayK(location);
        AddMySeleStock(location);
    }
    if (location.host == 'gu.qq.com') {
        eableQQclick(); //QQ自选股查看k线的按钮点击
    }
    if (location.host == 'news.10jqka.com.cn' || location.host == 'm.10jqka.com.cn' || location.host == 't.10jqka.com.cn') {
        codeto_aaa_m();
        StopTip();
    }
    if (location.host == 'quote.eastmoney.com') {
        scrollDown();
    }
    if (location.host == 'oa.gzqiaoyin.com') {
        OA_Pro();
        OA_selectSets(location);
    }
    if (location.host == 'finance.sina.com.cn') {
        clickDayK(location);
        sinaAddBtn();
        cleartTable();
    }
    if (location.host == 'gd.122.gov.cn') {
        var x = document.cookie;
        console.log(x);
    }
    if (location.host == 'www.ywsft.com' || location.host == 'www.ywnmt.com' || location.host == 'www.mtsyt.com' || location.host == 'www.swmzt.com'|| location.host == 'www.sfwht.com' || location.host == 'www.yhmnt.com' || location.host == 'www.gqnmt.com' ) {
        quchuMohu() ;
    }
    if (location.host == 'www.photos18.com') {
       img缩小();
    }
    if (location.host == 'camcam.cc') {
        quAD();
     }

})();


function GooglePureText() {
    setTimeout(function () {
        (function ($) {
            // $("div.yuRUbf").each(function () {
            //     $(this).html("<b>Hello world!</b>")
            // });
            // $("div.yuRUbf a").html("<b>Hello world!</b>")
        })(jQuery);
    }, 800);
}


function quAD() {
    setTimeout(function () {
        (function ($) {
            $("div#adde_modal-overlay").css("display","none");
            $("div#adde_modal-modal").css("display","none");
        })(jQuery);
    }, 800);
}

//2020-10-23 EditJarry 因为不能在插件中使用jquery的包，所以被迫使用httpRequest对象
function codeto_aaa_m() {
    //第一步：建立所需的对象
    var httpRequest = new XMLHttpRequest();
    //第二步：打开连接  将请求参数写在url中  ps:"./Ptest.php?name=test&nameone=testone"
    httpRequest.open('GET', 'http://news.10jqka.com.cn/siteapi/ucenter/selfstock/?track=wap_self&callback=getSelfStock1596770176000', true);
    http: //news.10jqka.com.cn/siteapi/ucenter/selfstock/?track=wap_self&callback=getSelfStock1596781232000
        //第三步：发送请求  将请求参数写在URL中
        httpRequest.send();
    /**
     * 获取数据后的处理程序
     */
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = httpRequest.responseText; //获取到json字符串，还需解析
            // json = "600333,300222";
            json = json.replace('getSelfStock1596770176000', '');
            var reg = /([063]\d{5})/g;
            var rs = json.match(reg);
            //保存自选股
            SaveZxgcodeArr(rs.toString());
            console.log(rs.toString());
        }
    };
}

function img缩小() {
    setTimeout(function () {
        (function ($) {
            $("div.card").each(function () {
                $(this).css("width", 150);
            });
            $("div.my-2 img").each(function () {
                $(this).css("width", 200);
            });
            $("div.my-2").each(function () {
                $(this).css("display", "flex");
                $(this).css("float", "left");
            });
            $("div.main-header").children().css("display","none");
        })(jQuery);
     
    }, 800);
}

//去除模糊 
function quchuMohu() {
    setTimeout(function () {
        console.log("执行方法：去除模糊")
        let picg_ = document.getElementById("picg")
        picg_.id = 'id_new';
        var x = document.getElementsByClassName("bg-text"); //class隐藏
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.display = 'none';
        }
        let title_ = document.getElementsByTagName("title")[0].innerText;
        let img_ = document.getElementById("id_new").firstChild.firstChild.firstChild.src
        let msg = `地址::${window.location.href}`;
        console.log("当前title::"+title_);
        console.log("当前地址::"+msg);
        console.log("当前图片::"+img_);
        document.getElementById("divStayTopright2").innerHTML = "";
        
    }, 600);
}

//同花顺自选股禁止确认框
function StopTip() {
    (function ($) { // dialogtip-text
        setInterval(function () {
            console.log("执行方法：StopTip");
            $(function () {
                $("i.rmv").each(function () {
                    $(this).attr("onclick", "delFc();"); //绑定事件
                });
            });
        }, 2500);
    })(jQuery);
}
//同花顺自选股-关联绑定
function delFc() {
    if (confirm("将会循环删除全部，是否继续") == true) {
        (function ($) { // dialogtip-text
            setInterval(function () {
                $(function () {
                    $("div.dialogtip-btn-sure").each(function () {
                        $(this).trigger("click"); //遍历和触发所有事件	
                        console.log('自动删除自选股循环中......');
                    });
                });
            }, 1500);
        })(jQuery);
    } else {
        text = "You canceled!";
    }
}
//侨银oa的流程显示优化 多个嵌套的iframe查找元素
function OA_Pro() {
    var timesRun = 0;
    (function ($) {
        var inter = setInterval(function () {
            $(function () {

                $("#mainFrame").contents().find("#myFrame").contents().find("#tabcontentframe").contents().find("div#_xTable a").each(function () {
                    var txt = $(this).text();
                    MarkRed(txt, 'IT服务提单', 'color', $(this));
                    MarkRed(txt, '文件传阅', 'hide', $(this));
                    MarkRed(txt, '工商注册类', 'hide', $(this));
                    MarkRed(txt, '中标项目核算归属', 'hide', $(this));
                    MarkRed(txt, '共享查阅权限开通流程', 'hide', $(this));
                    // $(this).text(txt);
                    console.log(txt);
                    timesRun++;
                });

            });
            if (timesRun > 0) {
                clearInterval(inter);
            }
        }, 4000);
    })(jQuery);
}
//【2021.09.16】选择项目车载设备
function OA_selectSets(host) {
    //iframe https://oa.gzqiaoyin.com/workflow/request/AddRequestIframe.jsp?workflowid=905&isagent=0&beagenter=0&f_weaver_belongto_userid=&isfromtab=false&fromFlowDoc=&prjid=&docid=&crmid=&hrmid=43125&reqid=&topage=&f_weaver_belongto_userid=&f_weaver_belongto_usertype=null
    var key = 'workflow/request/AddRequest.jsp?workflowid=905&isagent=0&beagenter=0&f_weaver_belongto_userid=';
    // var key = 'CommonSingleBrowser.jsp?customid=25&browsertype=browser';
    if (host.toString().includes(key)) {
        // 1 提叫地址
        // 2 获取返回的table
        // 3 遍历table所有的值
        // 4 循环数组，动态添加到表单里
        var tr = [];
        (function ($) {
            //【2021.09.17】通过定时循环抓取iframe里item
            ck = 0;
            var done = 0;
            var timerId = window.setInterval(function () {
                var baseIframe;
                $("iframe").each(function () {
                    src = $(this).attr('src');

                    if (ck == 0 && typeof (src) != "undefined" && src.includes('AddRequestIframe.jsp?workflowid=905')) {
                        baseIframe = this;
                        if ($(this).contents().find("#field15858_0_browserbtn").length) {
                            $(this).contents().find("#field15858_0_browserbtn").click();
                            ck = 1;
                        }
                    } else if (ck == 1) {
                        // tr = [];
                        if (typeof (src) != "undefined" && src.includes('/interface/CommonBrowser.jsp?type=browser.JM_ITbzj|15858_0')) {
                            $(this).contents().find('iframe').each(function () {
                                if ($(this).contents().find('div.table').length) {
                                    //console.log($(this).attr('id'));
                                    $(this).contents().find('div.table').find("tr").each(function () {
                                        var Things = $(this).find("td");
                                        var td = {};
                                        for (var i = 0; i < Things.length; i++) {
                                            if (i == 2 && Things[2].innerText.length > 0) {
                                                td["name"] = Things[2].innerText
                                            };
                                            if (i == 3 && Things[3].innerText.length > 0) {
                                                td["typee"] = Things[3].innerText
                                            };
                                            if (i == 4 && Things[4].innerText.length > 0) {
                                                td["price"] = Things[4].innerText
                                            };
                                        }
                                        if (JSON.stringify(td) != '{}') {
                                            tr.push(td);
                                        }
                                    });
                                    console.log(JSON.stringify(tr));
                                    done = 1;
                                    // window.clearInterval(timerId);
                                    //循环赋值给input

                                }
                                if (done == 1 && tr.length > 0) $(this).contents().find("#btncancel").click();
                            });
                        };
                    };
                });
            }, 2000);
            var ck2 = 0;
            var timerId2 = window.setInterval(function () {
                if (done == 1 && tr.length > 0) {
                    $("iframe").each(function () {
                        src = $(this).attr('src');
                        if (typeof (src) != "undefined" && src.includes('AddRequestIframe.jsp?workflowid=905')) {
                            var bt1 = $(this).contents().find("#div0button > button").first();

                            if ($(bt1).length) {
                                for (var i = 0; i < tr.length - 1; i++) {
                                    tri = tr[i];
                                    if (ck2 == 0) $(bt1).click();
                                    console.log(tri);
                                }
                                console.log(ck2);
                                ck2 = 1;
                            }
                            idx = 0;
                            content = `<span class="e8_showNameClass"><a title="" href="/formmode/view/AddFormMode.jsp?type=0&amp;modeId=56&amp;formId=-365&amp;billid=2" target="_blank">车载摄像头</a>&nbsp;<span class="e8_delClass" id="2" onclick="del(event,this,1,false,{});" style="opacity: 1; visibility: hidden;">&nbsp;x&nbsp;</span></span>`
                            $(this).contents().find("table#oTable0").find('tr').each(function () {
                                if ($(this).attr("_target") == 'datarow') {
                                    var Things = $(this).find("td");
                                    for (var i = 0; i < Things.length; i++) {
                                        if (i == 3) {
                                            $(Things[i]).text(tr[idx].typee);
                                        }
                                        if (i == 4) {
                                            $(Things[i]).text(tr[idx].name);
                                        }
                                        if (i == 5) {
                                            $(Things[i]).text('0');
                                        }
                                        if (i == 6) {
                                            $(Things[i]).text('个');
                                        }
                                        if (i == 7) {
                                            $(Things[i]).text(tr[idx].price);
                                        }
                                    }
                                    idx++;
                                    if (idx == tr.length - 1) idex = 0;
                                };
                            });
                        }
                    });
                    //window.clearInterval(timerId2);
                }
            }, 4000);

        })(jQuery);
    }
}
//对字符窜标红或者隐藏
function MarkRed(str, key, how, obj) {
    var rt = str;
    if (str.indexOf(key) > -1) {
        if (how == 'color') {
            obj.parent().css("background-color", "#a0a2e0");
        }
        if (how == 'hide') {
            obj.parent().parent().css("display", "none");
        }
    }
}

// -- url 跳转到 东方财富网
function url_To_Eastomoney() {
    setInterval(function () {
        var $j = jQuery.noConflict();
        $j(".namebox a").each(function () {
            var txt = $j(this).attr("href");
            if (txt.indexOf('sohu.com') < 0) return false;
            txt = txt.replace("//q.stock.sohu.com/cn/", "").replace("/index.shtml", "");
            var nt = "http://quote.eastmoney.com/" + txt + ".html";
            $j(this).attr("href", nt);
            console.log(nt);
        });
    }, 1000);
}

function sohu_css() {
    var $j2 = jQuery.noConflict();
    var linkTag = $j2('<link href="http://127.0.0.1/phpmyadmin/custom/jscss/biz_ms.css" rel="stylesheet" type="text/css" media="screen" />');
    $j2($j2('head')[0]).append(linkTag);
}

function eableQQclick() {
    var i = 0;
    setInterval(function () {
        var $j2 = jQuery.noConflict();
        var s = $j2(".zxg-stocklist>dl");
        $j2(s).each(function () {
            // console.log(this);
            $j2(this).live("click", function () {
                $j2("[class='nav-item day']").click();
            });
        });
        i++;
    }, 1000);
}

function SaveZxgcodeArr(codeArr) {
    //http://win7.qy/vhost/custom/api_stock.php?fcname=save_zxg&code=600918,601066,600313,300386
    var httpRequest = new XMLHttpRequest();
    var postUrl = "http://win7.qy/vhost/custom/api_stock.php?fcname=save_zxg&code=" + codeArr;
    httpRequest.open('GET', postUrl, true);
    httpRequest.send();
    console.log("保存自选完成！");
}
//默认触发点击显示日k图，不是分时图,
function clickDayK(host) {
    var key = 'finance.sina.com.cn/realstock/company/';
    if (host.toString().includes(key)) {
        var $j3 = jQuery.noConflict();
        $j3(document).ready(function () {
            setTimeout(function () {
                $j3(window).scrollTop(600);
                $j3('div.kke_menus_tab_edage > div[data-id="KKE_tab_kd"] > a')[0].click();
            }, 3500);
        });
    }
}

function scrollDown() {
    var $j3 = jQuery.noConflict();
    $j3(document).ready(function () {
        setTimeout(function () {
            $j3(window).scrollTop(700);
        }, 3000);
    });
    window.jQuery = window.$ = jQuery;
}
//加自选按钮：加入自选 删除自选 相关新闻
function sinaAddBtn() {
    (function ($) {
        $(document).ready(function () {
            var _name = jQuery('.c8_name').text();
            var Code = jQuery('#stockName > span').text().replace("(", "").split('.')[0]
            console.log("执行Row331 sinaAddBtn")
            jQuery('#stockName').append(ReturnBtn(Code, _name));
        });
    })(jQuery)
}
function cleartTable() {
    (function ($) {
        $(document).ready(function () {
            setInterval(function () {
                // jQuery('div#h5Container > div.wrapflash > div.flash').children().eq(1).children().eq(2).children(0).children(0).eq(6).html('');
                    jQuery('div#h5Container > div.wrapflash > div.flash').children().eq(1).children().eq(2).children(0).children(0).eq(6).attr('style',"");
                    jQuery('div#h5Container > div.wrapflash > div.flash').children().eq(1).children().eq(2).children(0).children(0).eq(6).children(0).css("display","none");
          
                console.log("清除悬浮框380")
            }, 2000);
            // var hiddenDiv = document.getElementById('abhbk');
            // let tm = hiddenDiv.getAttribute("class")
            // console.log(tm)
        });
    })(jQuery)
}




function clickDayK2(host) {
    var key = 'q.stock.sohu.com/cn/';
    console.log("选日k");
    if (host.toString().includes(key)) {
        var $j4 = jQuery.noConflict();
        $j4(document).ready(function () {
            setTimeout(function () {
                $j4("iframe").each(function () {
                    src = $j4(this).attr('id');
                    if (src == "canvas") {
                        console.log(src);
                        $(this).contents().find('#hqNav_k').click();
                    }
                });
                //$j4("#hqNav_k").click();
                // $j4("#hqNav_k > a").click();
            }, 800);
        });
    }
}

function clickDayK(host) {
    var key = 'q.stock.sohu.com/cn/';
    console.log("执行：clickDayK(host)");
    if (host.toString().includes(key)) {
        (function ($) {
            setTimeout(function () {
                $("iframe").each(function () {
                    src = $(this).attr('id');
                    if (src == "canvas") {
                        console.log(src);
                        $(this).contents().find('#hqNav_k').click();
                    }
                });
                $("#hqNav_k").click();
                $("#hqNav_k > a").click();
            }, 900);
        })(jQuery)
    }
}
//sohu日k图添加自选按钮：加入自选 删除自选 相关新闻
function AddMySeleStock(host) {
    var key = 'q.stock.sohu.com/cn/';
    console.log("执行: AddMySeleStock(host...)");
    if (host.toString().includes(key)) {
        console.log("执行: AddMySeleStock(key2..)");
        (function ($) {
            $(document).ready(function () {
                var Code = "";
                var _name = "";
                $("li").each(function () {
                    src = $(this).attr('class');
                    if (src == "code") {
                        Code = $(this).text();
                        Code = Code.replace('(', '').replace(')', '');
                    }
                    if (src == "name") {
                        _name = $(this).text();
                    }
                    if (src == "addbtn") {
                        $(this).html('');
                        $(this).after(ReturnBtn(Code, _name));
                    }
                });
            });
        })(jQuery);

    }
}

function op3(cname) {
    //参考url https://www.cnblogs.com/chris-oil/p/4205517.html
    var $j4 = jQuery.noConflict();
    var mycars = new Array();
    mycars[0] = 'https://www.google.com/search?ei=pM7HXL-yHovfz7sPsaa-SA&q=' + cname + '+site:eastmoney.com&oq=' + cname + '+site:eastmoney.com&as_qdr=m';
    mycars[1] = 'http://www.iwencai.com/stockpick/search?tid=stockpick&qs=sl_box_main_ths&w=' + cname;
    $j4.each(mycars, function (i, url) {
        window.open(url, "_blank", "");
    });
};

function ReturnBtn(Code, _name) {
    var str = `<div id="myzxg" style="width: 120px;height: 30px;z-index: 999;background-color: aquamarine ;margin: 5px;border: solid 1px ;position: fixed;left: 200px;top: 120px" >
						<span style="">
                            <span onclick=visitApi('add','${Code}')>加自选</span>  
                            <span onclick=visitApi('del','${Code}')>删除</span> 
                            <span onclick="op3('${_name}')">新闻 </span>
    			 		</span>
					</div>`
    return str;
}

function visitApi(act, Code) {
    (function ($) {
        if (act == 'add') {
            $.get(`https://win7.qy/vhost/custom/api_stock.php?fcname=AddCode&bkname=bkzxg_%E8%87%AA%E9%80%89&code=${Code}`, function(result){  
                if(result.length == 0) {  console.log("get_bk_one:读取数据失败!"); return; }               
                if(result == "okok") { alert("成功!")}
            });  
        } else {
            $.get("https://win7.qy/vhost/custom/api_stock.php?fcname=delcode&code="+ Code +"&bkname=bkzxg_%E8%87%AA%E9%80%89", function(result){  
                if(result.length == 0) {  console.log("get_bk_one:读取数据失败!"); return; }               
                if(result == "ok") { alert("成功!")}
            });  
        }
    })(jQuery)
}