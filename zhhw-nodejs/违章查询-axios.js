// const _url = "http://192.168.1.144/vhost/custom/api_stock.php"
const _url = "https://gd.122.gov.cn/user/m/uservio/suriquery"

const axios = require('axios');
axios({
    method: 'post', url: _url,
    withCredentials: true,
    cookies: {
        Cookie :"_uab_collina=163374818524468265628371; sto-id-20480-sg_http=BJAKKNKNCICD; JSESSIONID-L=30044b81-5f5b-4abf-a776-4d101d4b6587; accessToken=p7WfM1Qoa12YFaQJHGTh3Egwfzcy9fyi9bWHl6YZaGDS1INyxMhHVHZIPpxEC4vKdcF44vUf5nKhEOg9sAyN+gsZU7uGQNzffidB9Urm24XY88G2zbiWcoIU7frywNEiw9cRLVan+g0H7pPqmEWxR1CLLHZ/qNKke9IJOUF/MXNMHV1TSzcfyvoZZ6O9jGOY; JSESSIONID=5644E51550C57B34303B0DF4BFF5DCE5; c_yhlx_=2; tmri_csfr_token=7BF563A1CC2B3F2276E0084B23DCFF32" 
    },
    params:  {
        "startDate": "20210101",
        "endDate": "20211001",
        "hpzl": "02",
        "hphm": "粤A29BN9",
        "page": "1",
        "type":"0"
    }
}).then(res => { console.log(res.data);}).catch(err => {console.log(err);});












//   const got = require('got');

//   got('https://jsonplaceholder.typicode.com/todos/1', { json: true })
//       .then(res => {
//         console.log(res.body.id);
//         console.log(res.body.title);
//       }).catch(err => {
//         console.log(err.response.body);
//       });







// axios.get('http://192.168.1.144/vhost/custom/api_stock.php')
//   .then(res => {
//     console.log(res.data);
//   })
//   .catch(err => {
//     console.log(err);
//   });