// 通过DOM事件发送消息给content-script
const Href = [
  { title : "常用", links:[    
    ["http://win7.qy:8001/admin/manage-posts.php","img/在水一方.jpg","typecho"],
    ["http://win7.qy/vhost/custom/aaa2.php","","aaa2.php"],
    ["https://www.aliyundrive.com/drive/","img/aliyun.png","阿里云盘"]
  ]},
  { title : "电子书", links:[
    ["https://www.8bei8.com/book/ditiansui.html?share_token=8c99c98e-8405-4b81-a454-433fd1e458c4","","我滴天髓"]
  ]},
  { title : "证券财经", links:[
    ["http://www.people.com.cn/","http://www.people.com.cn/img/2020peopleindex/img/t_logo1.png","人民日报"],
    ["https://t.10jqka.com.cn/newcircle/user/userPersonal/?from=finance&tab=zx","","同花顺自选"],
    ["http://q.10jqka.com.cn/gn/","img/ths.png","同花顺板块"],
    ["https://q.stock.sohu.com/","img/souhu.png","搜狐涨跌停"],
    ["https://finance.sina.com.cn/futures/quotes/CHA50CFD.shtml","http://i1.sinaimg.cn/dy/images/header/2009/standardl2nav_sina_new.gif","A50"],
    ["https://cn.investing.com/indices/usa-indices","img/ywcq.png","道琼斯"],
    ["http://stock.10jqka.com.cn/","img/ths.png","同花顺"],
    ["http://gu.qq.com/hkHSI/zs","img/hs.png","恒升指数"],
    ["https://finance.sina.com.cn/money/forex/hq/USDCNY.shtml","","外汇"]
  ]},
  { title : "翻墙新闻", links:[
    ["https://player.fm/","","player.fm"],
    ["https://www.timednews.com/","","时刻新闻"], 
    ["https://himoney.press/","img/xmly.png","喜马拉雅财经"],
    ["https://wallstreetcn.com/","img/hej.png","华尔街见闻"],
    ["https://cn.reuters.com/","img/lts.png","路透社"],
    ["https://www.renminbao.com/","img/rmb.png","人民报"],
    ["https://www.bannedbook.org/","img/jww.png","明镜网"],
    ["https://www.voachinese.com/","img/voa.png","美国知音"],
    ["http://www.dwnews.com/","img/dww.png","多维网"],
    ["https://m.secretchina.com/","img/kzg.png","看中国"],
    ["https://mnewstv.com/","img/hjm.png","世界门"],
    ["https://www.pin-cong.com/","img/cong.png","品葱"],
    ["https://www.backchina.com/portal.php","img/bkq.png","倍可亲"],
    ["https://www.youtube.com/results?search_query=Ted.came+%E4%B8%AD%E8%8B%B1%E6%96%87%E5%AF%B9%E7%85%A7","img/ted.png","Ted双语"] 
  ]},
  { title : "新闻", links:[
    ["https://www.thepaper.cn/","img/pp.png","澎湃网"],
    ["http://www.ftchinese.com/","img/ft.png","FT中文网"],
    ["http://www.caixin.com/","img/cx.png","财新网"],
    ["http://www.takungpao.com/","img/dgw.png","大公网"],
    ["https://news.sina.com.cn/","img/sina.png","新浪新闻"],
    ["http://finance.qq.com/l/usstock/scroll.htm","img/mgwd.png","美股外电"],
    ["http://finance.huanqiu.com/","img/hqcj.png","环球财经"]

  ]},
  { title : "计算机软硬件", links:[
    ["https://thimble.mozilla.org/zh-CN/anonymous/0857e134-c8ef-4d4b-b339-d35c825334b2","img/html.png","在线html"],
    ["http://www.iheima.com/","img/hmw.png","黑马网"],
    ["https://www.csdn.net/","img/csdn.png","CSDN"],
    ["http://www.open-open.com/","img/sdky.png","深度开源"],
    ["http://www.51cto.com/","img/51cto.png","51CTO"],
    ["http://web.jobbole.com/","img/bole.png","伯乐在线"],
    ["https://www.iplaysoft.com/","img/yyc.png","异元次"],
    ["https://www.appinn.com/","img/xzrj.png","小众软件"],
    ["http://www.10tiao.com/html/337/201706/2660100224/1.html","img/st.png","10条"],
    ["http://dataunion.org/15876.html","img/sm.png","数盟"],
    ["https://tech.sina.com.cn/","img/xlkj.jpg","新浪科技"],
    ["https://www.tmtpost.com/","img/tmt.jpg","钛媒体"]
  ]},  
  { title : "黑客安全", links:[
    ["https://www.test404.com/","img/test404.png","test404"],
    ["http://www.freebuf.com/sectool/14047.html","img/buf.png","freebuf"],
    ["http://www.77169.cn/","img/hm.png","华盟网"],
    ["http://www.cnhonkerarmy.com/portal.php","img/hmsq.png","红盟社区"],
    ["https://www.kanxue.com/","img/kx.png","看雪"]      
  ]},
  { title : "其他", links:[
    ["http://www.fengniao.com/","https://icon.fengniao.com/20190823FnIndex2019/images/logo.png","蜂鸟"],
  ]}
];


const ShowTitle = ()=>{
	$("#ding").html('');//原来的html里的代码保留
 	Href.forEach(el=>{
 	  	var s1 =`<div class="content">
 	  				<span class="title">${el.title}</span>_aaa_
 	  		     </div>`;
        var s2 = "";
        for (let i = 0; i < el.links.length; i++) {
        	s2 +=`<a href="${el.links[i][0]}">
		            <div class="box">
		              <img src="${el.links[i][1]}"/>
		              <span>${el.links[i][2]}</span>
		            </div>
          		  </a>\n`;   
        }
        s3 = s1.replace("_aaa_",s2);
        $("#ding").append(s3);
    })
};

(function() {
	var el=document.getElementById("wrapper")
	var hel=document.getElementById("hello")
	changeBgc(el);
	ShowTitle();
})();

function changeBgc(el){
	console.log("newTab.js --> changBgc")
	var num=parseInt(Math.random()*24);
	num?num:22;
	var path='img/backgrounds/'+num+'.jpg'
	el.style.backgroundImage="url("+path+")";
}


