const https = require('https');
const iconv = require('iconv-lite');
var request = require('request');


let Get搜狐主页涨跌家数 = function (){
  return new Promise((resolve, reject) => { 
      const randomNum = Math.floor(Math.random() * 1000000000000);
      const url = `https://hq.stock.sohu.com/zs/001/zs_000001-1.html?_=${randomNum}`;
      var site = { url: url, headers: { referer: "https://q.stock.sohu.com"}
      }
      request.get(site).pipe(iconv.decodeStream('gb2312')).collect(function(err, body) {
      utf8Data = body.replace("fortune_hq(", "");
      utf8Data = utf8Data.replace("]});", "]}");
      var body = eval("(" + utf8Data + ")");
          resolve(body)
      });
  });
};

let GetA50涨跌点数 = function (){
    return new Promise((resolve, reject) => { 
        const randomNum = Math.floor(Math.random() * 1000000000000);
        const url = `https://futsseapi.eastmoney.com/static/104_CN00Y_qt?callbackName=jQuery35109279821241686885_1709200168239&field=name,sc,dm,p,zsjd,zdf,zde,utime,o,zjsj,qrspj,h,l,mrj,mcj,vol,cclbh,zt,dt,np,wp,ccl,rz,cje,mcl,mrl,jjsj,j,lb,zf&token=1101ffec61617c99be287c1bec3085ff&_=${randomNum}`;
        var site = { url: url, headers: { referer: "https://futsseapi.eastmoney.com"}
        }
        request.get(site).pipe(iconv.decodeStream('utf-8')).collect(function(err, body) {
        body = body.substring(body.indexOf('({"') + 1, body.lastIndexOf('}})')+2);
        body = eval("(" + body + ")");
        resolve(body)
        });
    });
};

let Get恒指涨跌 = function (){
    return new Promise((resolve, reject) => { 
        const randomNum = Math.floor(Math.random() * 1000000000000);
        const url = `https://qt.gtimg.cn/?q=s_sh000001,s_sz399001,s_r_hkHSI,s_usDJI,s_usIXIC,gzFCHI,gzGDAXI,gzN225,gzFTSTI,gzTWII,fqUS_GC_1,fqUS_CL_1&_=${randomNum}`;
        var site = { url: url, headers: { referer: "https://qt.gtimg.cn"}
        }
        request.get(site).pipe(iconv.decodeStream('gb2312')).collect(function(err, body) {
    //    
        resolve(body)
        });
    });
};

(async()=>{
    // var data = await Get搜狐主页涨跌家数()
    // console.log(data);

    // var data2 = await GetA50涨跌点数()
    // console.log(data2);

    var data3 = await Get恒指涨跌()
    console.log(data3);

})()


//运行 E:\git_15home\puppeteer\express\aaa2>node shili示例__sohu主页的涨跌家数的接口.js