const lib = require('./lib_bazi.js');
var rt = []
var str1 = " rt.push('aa') " 
var str = " var a1 = true ; \
            var a2 = true ; \
            if( a1 && a2 ) \
            {console.log('1')} else { console.log('2') } ";
// eval(str1)
// console.log(rt)


//test2
// var bb = " 1==1 && 2==3  "
// cc = eval(bb)
// console.log(cc)


// console.log(lib.one('庚戌'))
// console.log(lib.BaizToArr('戊午壬戌庚戌戊寅'))
// console.log(lib.Gods('戊午壬戌庚戌戊寅'))
// console.log(lib.Gods('戊午壬戌丙午戊寅'))
// console.log(lib.pipei(['戊', '午', '壬','戌', '丙', '午', '戊', '寅'],[4,5],["丙午","戊午","丁巳","壬子","癸亥"]))
// console.log(lib.Gods2('戊午壬寅甲寅戊寅'))



// console.log(lib.Gods2('戊午壬戌庚戌戊寅'))//魁罡
// console.log(lib.Gods2('戊午壬戌戊午戊寅'))//羊刃
console.log(lib.Gods2('戊午壬戌丙子戊寅'))//阴差阳错日


