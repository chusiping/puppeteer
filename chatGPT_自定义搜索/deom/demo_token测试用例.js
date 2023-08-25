const axios = require('axios');

const url = 'https://t.10jqka.com.cn/newcircle/group/getSelfStockWithMarket/?callback=selfStock&_=1692841728360';

const headers = { 'cookie': 'searchGuide=sg; Hm_lvt_722143063e4892925903024537075d0d=1690421598; Hm_lvt_929f8b362150b1f77b477230541dbbc2=1690421599; Hm_lvt_da7579fd91e2c6fa5aeb9d1620a9b333=1690421616; Hm_lvt_78c58f01938e4d85eaf619eae71b4ed1=1690421599; Hm_lpvt_722143063e4892925903024537075d0d=1691112970; Hm_lpvt_929f8b362150b1f77b477230541dbbc2=1691112970; historystock=603767%7C*%7C300527%7C*%7C301398; spversion=20130314; u_ukey=A10702B8689642C6BE607730E11E6E4A; u_uver=1.0.0; u_dpass=Xr6jSwNaKjTRAA6c52zlqBRCY5bHxyMIRUhTC6Gt1AfIH3aE9ijHln0ON632peAB%2FsBAGfA5tlbuzYBqqcUNFA%3D%3D; u_did=A082CDBEDD10415DA6554FCC238748DC; u_ttype=WEB; ttype=WEB; user=MDpjaHVzaXBpbmc6Ok5vbmU6NTAwOjg2NzY0MzE0OjcsMTExMTExMTExMTEsNDA7NDQsMTEsNDA7NiwxLDQwOzUsMSw0MDsxLDEwMSw0MDsyLDEsNDA7MywxLDQwOzUsMSw0MDs4LDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAxLDQwOzEwMiwxLDQwOjI3Ojo6NzY3NjQzMTQ6MTY5MjkzMTQ1OTo6OjEyNjAyOTE3ODA6NjA0ODAwOjA6MTczYzdmNGFlOWJjZjZjNmIxOWNkNDZmYmMwMmIwMDYxOmRlZmF1bHRfNDow; userid=76764314; u_name=chusiping; escapename=chusiping; ticket=337c7d7e126c2dcd20f4f2c0c62e70fc; user_status=0; utk=1c780efcead1c9633c3982fd3b609b54; Hm_lpvt_da7579fd91e2c6fa5aeb9d1620a9b333=1692931462; Hm_lpvt_78c58f01938e4d85eaf619eae71b4ed1=1692931462; v=AzsJKPyr26oqbOceCK6J1tu0yhSgkE-BSaYTRi34FzpRjFXKtWDf4ll0o58-' };


const requestPayload = {};

axios.post(url, requestPayload, { headers })
  .then(response => {
    let rt = response.data;
    console.log(rt);

  })
  .catch(error => {
    console.error(error);
  });