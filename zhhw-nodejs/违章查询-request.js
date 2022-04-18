//测试有效，带cookie请求接口
var requestify = require('requestify');

var url = "https://gd.122.gov.cn/user/m/uservio/suriquery";
var para = {"startDate":'20210101',"endDate":'20211001',"hpzl":'02',"hphm":'粤A29BN9',"page":'1',"hphm":'0'};
const bd =  {
        "startDate": "20210101",
        "endDate": "20211001",
        "hpzl": "02",
        "hphm": "粤A29BN9",
        "page": "1",
        "type":"0"
    }; 

requestify.request(url, {
    method: 'post',
    params: bd,
    cookies: {
        Cookie :"_uab_collina=163374818524468265628371; sto-id-20480-sg_http=BJAKKNKNCICD; JSESSIONID-L=30044b81-5f5b-4abf-a776-4d101d4b6587; accessToken=p7WfM1Qoa12YFaQJHGTh3Egwfzcy9fyi9bWHl6YZaGDS1INyxMhHVHZIPpxEC4vKdcF44vUf5nKhEOg9sAyN+gsZU7uGQNzffidB9Urm24XY88G2zbiWcoIU7frywNEiw9cRLVan+g0H7pPqmEWxR1CLLHZ/qNKke9IJOUF/MXNMHV1TSzcfyvoZZ6O9jGOY; JSESSIONID=5644E51550C57B34303B0DF4BFF5DCE5; c_yhlx_=2; tmri_csfr_token=7BF563A1CC2B3F2276E0084B23DCFF32" 
    },
}).then(function(response) {    
    console.log(response);
});


