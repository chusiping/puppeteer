// jscss lib.js
/*  
    传入一个数组，一个方法，循环处理这个，再返回一个处理后的数组
      function while_object(arr,act)
    字符串转数组，换行符先转逗号，再以逗号分隔成数组，带空
      function str2Arr(str)
*/

/******************************* Date格式化扩展 ************************************/ 
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length > 0) {    
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if(args[key]!=undefined){
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
             }
          }
       }
   }
   return result;
}
/******************************* Date格式化扩展 var myDate = new Date(); myDate.Format('yyyy-MM-dd hh:mm:ss') ************************************/ 

Date.prototype.Format = function (fmt) {
    var o = {
      "y+": this.getFullYear(),
      "M+": this.getMonth() + 1,                 //月份
      "d+": this.getDate(),                    //日
      "h+": this.getHours(),                   //小时
      "m+": this.getMinutes(),                 //分
      "s+": this.getSeconds(),                 //秒
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度
      "S+": this.getMilliseconds()             //毫秒
    };
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)){
        if(k == "y+"){
          fmt = fmt.replace(RegExp.$1, ("" + o[k]).substr(4 - RegExp.$1.length));
        }
        else if(k=="S+"){
          var lens = RegExp.$1.length;
          lens = lens==1?3:lens;
          fmt = fmt.replace(RegExp.$1, ("00" + o[k]).substr(("" + o[k]).length - 1,lens));
        }
        else{
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
      }
    }
    return fmt;
  }
/******************************* 窗口居中  ************************************/  
var methods = {
  autosize: function(ele) {
    if(ele.height() <= $(window).height()) {
      ele.css("top", ($(window).height() - ele.height()) / 2 - 100);
    }
    if(ele.width() <= $(window).width()) {
      ele.css("left", ($(window).width() - ele.width()) / 2);
    }
  }
}    
$.fn.extend({
  propup: function(options) {
    $this = $(this);
    methods.autosize($this);
    $(window).resize(function() {
      methods.autosize($this);
    });
  }
});
//css:.na_popup{ width:300px; height:100px; position: fixed; z-index: 1500; top:0; left: 0;border: 1px solid black; text-align:center;background-color: #d8d8d8; border-radius:10px;word-break:break-all; padding: 5px; }
/******************************* 操作cookie ************************************/ 
// setCookie("name","hayden","s20");
function setCookie(name,value,time)
{ 
    var strsec = getsec(time); 
    var exp = new Date(); 
    exp.setTime(exp.getTime() + strsec*1); 
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString(); 
} 
function getCookie(name) 
{ 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
    if(arr=document.cookie.match(reg))
 
        return unescape(arr[2]); 
    else 
        return null; 
} 
function getsec(str)
{ 
  //  alert(str); 
   var str1=str.substring(1,str.length)*1; 
   var str2=str.substring(0,1); 
   if (str2=="s")
   { 
        return str1*1000; 
   }
   else if (str2=="h")
   { 
       return str1*60*60*1000; 
   }
   else if (str2=="d")
   { 
       return str1*24*60*60*1000; 
   } 
} 
/******************************* json转html - table  ************************************/  
//  用例  var par = { "列名":"auto" , "数据组":rt , "表ID" : "tableMSA" , "隐藏列":"", "列顺序":"","合并显示":""+ IsSpan +"","合并主键":"code" }
//  var html =  get_html_table(par)
//  参数1:th列的中文名 -> "姓名,年龄,习惯   
//  参数2:不显示的列名 -> "age,hobby"   
//  参数3:td数据列     -> myList  
//  参数4:table的ID    -> <table id="ttt">
//  参数5:自定义显示数据顺序     -> "hobby,age,name"
//  var myList = [
//  { "name": "abc", "age": 50 ,"hobby":"打麻将"},
//  { "name": "李四", "age": "25", "hobby": "swimming" },
//  { "name": "王五", "age": "13", "hobby": "dak" },
//  { "name": "赵六", "age": "44", "hobby": "smoke" },
//  { "name": "张七", "age": "21", "hobby": "sleep" },
//  { "name": "xyz", "age": "18", "hobby": "programming" }
//  ];
//  $('#test').html(html);
var arr_cp = new Array(); 
function get_html_table(par) {
  lieList =   par["列名"];
  date_list = par["数据组"];
  tb_id =     par["表ID"];
  hide_col =  par["隐藏列"]; 
  orderStr =  par["列顺序"]; 
  IsSpan =    par["合并显示"];
  Span_mk =   par["合并主键"]

  lieList = GetColName(date_list,lieList)

  th_list = lieList.split(',');
  var th= '<table id="'+ tb_id +'">';
  for (var i = 0; i < th_list.length; i++) {
      th += '<th>'+ th_list[i]  +'</th>';
  }  

  rrt = set_colspan(th_list.length,date_list,Span_mk); 
  for (var i = 0; i < date_list.length; i++) {
      var tdstr = ''; 
      temp = date_list[i][Span_mk];
      if(typeof(orderStr) == "undefined" ||  orderStr.trim() == '')  {                   //无指定数据顺序
        for (var value in date_list[i]) {  
            if(typeof(hide_col) != "undefined" &&  hide_col.indexOf(value) >=0 ) continue; 
                item_v = date_list[i][value];
                if(IsSpan == "true"){
                    if(i>0 && (item_v == date_list[i-1][value]) && date_list[i][Span_mk] == date_list[i-1][Span_mk] ) {
                        
                    }
                    else{
                        sp_n = rrt[i][value];
                        rowstr = ' rowspan='+ sp_n;
                        if(sp_n == 1) rowstr = '';
                        tdstr += '<td ' + rowstr +'>'+ item_v +'</td>';
                    }
                }else {           
                        tdstr += '<td>'+ item_v +'</td>';
                }            
        }
      }
      else{
        odrArr = orderStr.split(',');
        for (index = 0; index < odrArr.length; index++) {                               //指定数据顺序,则hide_col无效
            for (var value in date_list[i]) {  
                if(odrArr[index] == value) {
                    tdstr += '<td>'+ date_list[i][value] +'</td>';
                }
            }
        }
      }
      th+= '<tr>'+ tdstr +'</tr>';
  }
  th += "</table>";
  return th;
}
//----------- 如果是auto，则自动显示select语句里每个列的列名----------------
function GetColName(date_list,lieList)
{
    if(lieList == 'auto'){
        tdstr= '';
        for (var value in date_list[0]) {          
            tdstr += value +',';
        }
        return rtrim(tdstr); 
    }
    else{
        return lieList;
    }
}
//------------初始化泛型集合-----------------
function init_span(per_row)
{
    var obj = {};
    for (var value in per_row) {  
        obj[value] = {"val":"","col":1};
    }
    return obj;
}
function set_colspan(col_cnt,date_list,span_mk)
{        
    turn_n = ''; rrt = []; 
    var obj_col = init_span(date_list[0]) ;  
    for (item_i = date_list.length-1; item_i >-1; item_i--) {      
        per_row = date_list[item_i];
                          
        var rt = {};
        for (var value in per_row) {                                        
            if(obj_col[value].val == per_row[value] ) {             //如果每个td的值比对相等，则rowspan累加1
                obj_col[value].col++;                                      
            }
            else { 
                //当换了新行的时候,对象属相清零
                if(turn_n !='' && span_mk == value  ){              
                     obj_col = init_span(per_row)
                }
                //当值不相等，则重新计算
                obj_col[value].val = per_row[value];                
                obj_col[value].col = 1;
                //主键更换 
                if(span_mk == value ) turn_n = per_row[value];                      
            }
            rt[value] = obj_col[value]["col"];
        }
        rrt[item_i] = rt;
    }
    return rrt;
}
/******************************* 通用:去到最右边的逗号   1,2,3, -->  1,2,3  ************************************/ 
function rtrim(s) {
  var lastIndex = s.lastIndexOf(',');
      if (lastIndex > -1) {
          s = s.substring(0, lastIndex);
      }
      return s;　　
  }
/******************************* 通用:返回链接 ************************************/
function get_stock_url(name,code)
{        return '<a href="http://q.stock.sohu.com/cn/'+ code +'/index.shtml" target="_blank">'+ name +'</a>  ';    }
/******************************* 通用:定时函数 ************************************/
function set_Interval(Func,timeout)
{
    setInterval(function() { 
        var date = new Date();var date_f = parseInt(date.Format("hhmm"), 10); 
        if(Is_StockTime()) { Func();}
    },timeout); 
} 
function Is_StockTime()
{
    var date = new Date();var date_f = parseInt(date.Format("hhmm"), 10); 
    if ( (date_f > 900 && date_f < 1130 ) || (date_f > 1200 && date_f < 1501 ) )
    { return true; } else { return false; }     
}
     function autoTable_head(arr_head,tag_head) {
        tb_head = '<th>序号</th>';
        $.each(arr_head, function(i, item) {                
            tb_head = tb_head + '<th> ' + arr_head[i]["Field"]  + '</th>';                                                           
        })  
        $(tag_head).html(tb_head);          
    }
    //用例：  autoTable(json数据,table的id,标红的string);
    function autoTable(arr_tr,tag_body,markStr) {
        html = ''; key = "";
    	   var xx =1 ;
        $.each(arr_tr, function(i, item) {     
            html = html + '<tr><td>'+ xx +'</td>'; 
            for (x in item)
            {
                key = markStr;
                //if(arr_tr[i][x]==null) continue;
                vstr =  arr_tr[i][x];
                if(arr_tr[i][x] !=null) { vstr = arr_tr[i][x].replace(key,"<font color=red>"+ key +"</font>") };
                html = html + '<td> '+ vstr  +' </td>';                   
            }
    		xx++;
        })          
        $(tag_body).html(html);    
    }
    //用例：  autoTable2(一维数组,table的id); 
    function autoTable2(arr_tr,tag_body) {
        html = ''; 
        $.each(arr_tr, function(i, item) {     
            html = html + '<tr><td>'+ item +'</td>'; 
        })          
        $(tag_body).html(html);    
    }
    function autoTable_mongo(arr_tr,tag_body) {
        html = ''; 
        Object.keys(arr_tr).forEach(function(key){
            html = html + '<tr><td>'+ JSON.stringify(arr_tr[key]) +'</td>'; 
        }); 

        $(tag_body).html(html);    
    }
    //https://blog.csdn.net/wangyuchun_799/article/details/38460515
    //精确小数点
    //number：为你要转换的数字
    //format：要保留几位小数；譬如要保留2位，则值为2
    //zerFill:是否补零。不需要补零可以不填写此参数
    function  accurateDecimal(number,format,zeroFill){
        //判断非空
    if (!isEmpty(number))
    {
        //正则匹配:正整数，负整数，正浮点数，负浮点数
        if (!/^\d+(\.\d+)?$|^-\d+(\.\d+)?$/.test(number)) 
            return number; 
        var n=1;
        for(var i=0;i<format;i++){
            n=n*10;
        }
        
        //四舍五入
        number=Math.round(number*n)/n;
        var str=number.toString();
        
        //是否补零
        if(zeroFill){
            var index;
            if(str.indexOf(".")==-1){
                index=format;
                str+='.';
            }else{
                index=format-((str.length-1)-str.indexOf("."));
            }
            
            for(var i=0;i<index;i++){
                
                str+='0';
                }
            }
            return str;
        }
        return number;
    };
    function isEmpty(ObjVal){
    if ((ObjVal==null || typeof(ObjVal)=="undefined")|| (typeof(ObjVal)=="string"&&ObjVal==""&&ObjVal!="undefined")){
            return true;
         }else{
             return false;
         }
    }
    function SetStock(code)
    {
        var _code = 'sz'+ code;
        if(code.substring(0, 1) == '6')  _code = 'sh' + code;            
        return _code;
    }
    //
    String.prototype.format = function() {
     if(arguments.length == 0) return this;
     var param = arguments[0];
     var s = this;
     if(typeof(param) == 'object') {
      for(var key in param)
       s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
      return s;
     } else {
      for(var i = 0; i < arguments.length; i++)
       s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
      return s;
     }
    }
    //传入一个数组，一个方法，循环处理这个，再返回一个处理后的数组
    function while_object(arr,act)
    {
        var arr2 = [],i2 = 0
        for (var i = 0; i < arr.length; i++) {
            if(!isEmpty(arr[i]))
            {
                var s_ = act(arr[i]); 
                if(!isEmpty(s_))
                {
                    arr2[i2] = act(arr[i]);  
                    i2++;
                }
            }
        }
        return arr2;
    }
    //字符串转数组，换行符先转逗号，再以逗号分隔成数组，带空
    function str2Arr(str)
    {
        str = str.replace(/\n/g,',');
        var arr = str.split(",");
        return arr;
    }
    //调用：autocomplet_tgPrice("#ipt_target_name","#ipt_target1");要包含<script type="text/javascript" src="../skin1/jscss/jquery-ui.min.js"></script>
    var cache = {}; 
    function autocomplet_tgPrice(input1,input2)
    {        
        var term_t = ""; 
        $( input1 ).autocomplete({
                minLength: 1,
                source: function(request, response) {                    
                    var mk = request.term.lastIndexOf(',');                    
                    term_t = request.term.substring(mk,request.term.length);
                    // console.log("term_t:"+ custcodes_v);  
                    if ( term_t in cache ) {
                        response( cache[ term_t ] );                        
                        return;
                    }
                    $.ajax({
                        url: "api_name2code.php?fcname=seek",
                        dataType: "json",
                        data: { pinyin: term_t },
                        success: function (data) {                            
                            cache[ term_t ] = data;
                            response(data);
                        }
                    });
                },
                focus: function( event, ui ) {                    
                    return false;
                },
                select: function( event, ui ) {                             
                    $( input1 ).val(ui.item[3]);
                    $( input2 ).val(ui.item[2]);
                    return false;
                }
                })
                .data( "ui-autocomplete" )._renderItem = function( ul, item ) {
                return $( "<li>" )
                    .append( "<a>" + item[2] + "   " + item[3] + "</a>" )
                    .appendTo( ul );
        }; 
    }
    //返回localStorage所有key中包含waining_的集合[]
    //调用  forLocalStorageKey('waining_');返回[{},{},....]
    function forLocalStorageKey(keyname)
    {
        arr = [];
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i); //获取本地存储的Key
            if(key.includes(keyname)){
                arr.push(JSON.parse(localStorage.getItem(key)));
            }
        }
        return arr;
    }
    //判断浏览器
    function IsWhatBrowser()
    {
        //源码地址：https://passer-by.com/browser/
        var rt;
        var info = new Browser();
        if(info.browser == "Sogou")
            rt = "Sogou";
        else 
            rt = '2';
        // console.log('浏览器:' + rt);
        return rt;
    }
    //2022-5-31 14:20 调佣方法
    // JsontoTable.data = data.list;
    // JsontoTable.para.列名 = ["a","b"]  未实现
    // JsontoTable.para.隐藏列 = ["日期","序号"] 未实现
    // JsontoTable.setDivHtml("#mydiv2");
    let JsontoTable = {
            data : [{"序号":"1","信息ID":"1001","信息内容":"xxx超速","日期":"2022-5-15","接受对象":"张三","类型":"app","所属单位":"佛山项目"},{"序号":"2","信息ID":"1002","信息内容":"xxx违规打电话","日期":"2022-5-16","接受对象":"李四","类型":"钉钉","所属单位":"资产部"},{"序号":"3","信息ID":"1003","信息内容":"xxx超速","日期":"2022-5-17","接受对象":"张三","类型":"微信","所属单位":"信息化部"},{"序号":"4","信息ID":"1004","信息内容":"xxx违规打电话","日期":"2022-5-18","接受对象":"李四","类型":"app","所属单位":"佛山项目"},{"序号":"5","信息ID":"1005","信息内容":"xxx超速","日期":"2022-5-19","接受对象":"张三","类型":"钉钉","所属单位":"资产部"},{"序号":"6","信息ID":"1006","信息内容":"xxx违规打电话","日期":"2022-5-20","接受对象":"李四","类型":"微信","所属单位":"信息化部"},{"序号":"7","信息ID":"1007","信息内容":"xxx超速","日期":"2022-5-21","接受对象":"张三","类型":"app","所属单位":"佛山项目"}],
            para :{ "列名":[], "表ID" : "" , "隐藏列": [], "列顺序":"","合并显示":'false',"合并主键":"code" },
            setDivHtml:function(divTag) {
                let str = this.get_html_table();
                $(divTag).html(str);
                // console.log(this.data);
                // console.log(JSON.stringify(this.para));
                
            },
            forArr: (obj,type)=>{ //循环对象的属性值
                let rt = [];
                for (var key in obj){
                    if(type=="1") //value
                        rt.push(obj[key]);
                    else
                        rt.push(key); //key
                }
                return rt;
            },
            displayNone:(arr,key)=>{ //没有用到,保留吧
                if(arr.includes(key))
                    return ` style="display:none";`;
                else
                    return "";
            },
            get_html_table: function () {
                lieList = this.para["列名"];
                date_list = this.data;
                tb_id = this.para["表ID"]; //id="tableMSM"
                hide_col = this.para["隐藏列"];//用逗号隔开
                orderStr = this.para["列顺序"];//拟定列的顺序,以逗号隔开
                IsSpan = this.para["合并显示"];
                Span_mk = this.para["合并主键"]

                let template = `<table id="_id_"> _th_ _tr_ </table> `;
                let thArr = this.forArr(date_list[0],0); //data里的数组head
                let table_Arrth = lieList.length > 0 ? lieList : thArr;

                let table_th = table_Arrth.map(x=> `\n\t<td>${x}</td>`);

                let table_trs = date_list.map(x => {
                    let rt = this.forArr(x,1);   // 取出每个tr对象
                    let rt_hide = this.forArr(x,0);   
                    let Arr_tdStr = rt.map( x=> `\n\t<td>${x}</td>` );  // td加到数组
                    let td_str =Arr_tdStr.join("");
                    let tr = `\n<tr>${td_str}</tr>\n`;
                    return tr;
                } );
                let rt = template.replace("_id_",tb_id).replace("_th_",table_th.join("")).replace("_tr_",table_trs.join(""));
                return rt ;    
            }
        }
    //给table添加编辑删除按钮
    //$(document).ready(function () {
    //  myButton.AddTableBtn('#app div table');
    // });
    let myButton =  {
        btn : function(sname,sty) {
            return `<button type="button" class="btn  btn-xs ${sty}">${sname}</button> `;
        },
        AddTableBtn : function (Tabel_Tag) {
            var table = Tabel_Tag; 
            $(table).attr("class","table  table-bordered table-hover");
            var trList = $(table).find("tr");
            for (var i=0;i<trList.length;i++) {
                var tr = trList[i];
                if(i==0){
                    $(tr).append("<td>操作</td>");
                }else{
                    $(tr).append('<td>'+  this.btn('详情','btn-warning') + this.btn('编辑','btn-primary') + this.btn('删除','btn-danger')+'</td>' );
                }
            };
        }
    }

/******************************* end ************************************/