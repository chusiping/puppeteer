const axios = require('axios');

const url = 'https://t.10jqka.com.cn/newcircle/group/getSelfStockWithMarket/?callback=selfStock&_=1692841728360';

const headers = { 'cookie': 'searchGuide=sg; Hm_lvt_722143063e4892925903024537075d0d=1690421598; Hm_lvt_929f8b362150b1f77b477230541dbbc2=1690421234; Hm_lvt_da7579fd91e2c6fa5aeb9d1620a9b333=1690421616; Hm_lvt_78c58f01938e4d85eaf619eae71b4ed1=1690421599; Hm_lpvt_722143063e4892925903024537075d0d=1691112970; Hm_lpvt_929f8b362150b1f77b477230541dbbc2=1691112970; user=MDpjaHVzaXBpbmc6Ok5vbmU6NTAwOjg2NzY0MzE0OjcsMTExMTExMTExMTEsNDA7NDQsMTEsNDA7NiwxLDQwOzUsMSw0MDsxLDEwMSw0MDsyLDEsNDA7MywxLDQwOzUsMSw0MDs4LDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxLDQwOzEwMiwxLDQwOjI3Ojo6NzY3NjQzMTQ6MTY5MjMyNTMwMDo6OjEyNjAyOTE3ODA6NjA0ODAwOjA6MWE2NTdkODQxNzk4OGI5Njg3NjM3M2VmOTEyNjYyZTRmOmRlZmF1bHRfNDow; userid=76764314; u_name=chusiping; escapename=chusiping; ticket=9a7aceee161be2f41063ce18e9c3c71c; user_status=0; utk=23d4885dc45dd32bb8b2563b63eb94d8; historystock=603767%7C*%7C300527%7C*%7C301398; spversion=20130314; Hm_lpvt_78c58f01938e4d85eaf619eae71b4ed1=1692841728; Hm_lpvt_da7579fd91e2c6fa5aeb9d1620a9b333=1692841728; v=A3NBwOSzE_wFRN-ookAx_iNcAnyYqAdwwT5LniUQzxLJJJ1irXiXutEM2-k2' };

const requestPayload = {};

axios.post(url, requestPayload, { headers })
  .then(response => {
    let rt = response.data;
    console.log(rt);

  })
  .catch(error => {
    console.error(error);
  });