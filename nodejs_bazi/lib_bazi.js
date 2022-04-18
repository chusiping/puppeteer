var GodArr2 = 
[
    // {name:"", cnd:[ { p:[], str :['','']},{ p:[,], str :['',''] }], reg : "" , intro :"" },
    {name:"四废日", cnd:[ { p:[3],  str :['寅','卯']},{ p:[4,5], str :['甲寅','乙卯'] }], reg : "&&" , intro :"甲寅,乙卯" },

    {name:"魁罡",   cnd:[ { p:[4,5], str :["庚戌","庚辰","壬辰","戊戌"]}], reg : "&&" , intro :"魁罡日所生之人，个性耿直暴躁，疾恶如仇，不善忍让，故也不合夫妻之道，也不利婚恋。\
    但魁罡日所生之人，较不易中法（法咒），故使用符咒道法，则需要高德法师择取特定时辰，用特殊方法令其中法，化解婚恋中各种不利因素。\
    化解方法：根据生辰八字五行调配阴阳能量，择选时辰，施加特殊法咒，改善婚恋现状。" },

    {name:"羊刃", cnd:[ { p:[4,5], str :["丙午","戊午","丁巳","壬子","癸亥"]}], reg : "&&" , intro :"生于羊刃日的人，之所以婚恋不顺，是受到“羊刃”特性影响\
    古人云：“羊， 言刚也；刃者，取宰割之义。禄过则刃生，功成当退不退，则过越其分。如羊之在刃，有伤也” \
    羊刃者，本为司刑之特殊星，而此星之特征为刚烈，暴戾，激发，急躁等，与夫妇阴阳和合之道背道而驰，故极不利婚恋" },

    {name:"阴差阳错日", cnd:[ { p:[4,5], str : ["丙子","丙午","丁丑","丁未","戊寅","戊申","辛卯","辛酉","壬辰","壬戌","癸巳","癸亥"]}], reg : "&&" , intro :"" },
]

function Gods2(str)
{
    var rt = []
    var _bazi = BaizToArr(str)
    GodArr2.forEach(            //循环GodArr数组
        x => {
            truefalse = [];
            x.cnd.forEach(      //循环cnd条件
                _cnd => {
                    var bj = pipei(_bazi,_cnd.p,_cnd.str)  //{ p:[3], str :['寅','卯']} 逐一匹配月令是否是yinmao得出bool
                    truefalse.push(bj)
                }
            )   
            let xstr = ''
            for (let index = 0; index < truefalse.length; index++) {
                xstr = xstr + ' truefalse['+ index +'].ok == true ' + x.reg 
                console.log(truefalse[index])
            }
            let xxx = { name : x.name,intro : x.intro } //intro : x.intro
            xstr = xstr.substr(0,xstr.length-2)
            
            let bool_ = eval(xstr)  
            if(bool_) rt.push(xxx)
        }
    )
    return rt;
}
// lib.pipei(['戊', '午', '壬','戌', '丙', '午', '戊', '寅'],[4,5],["丙午","戊午","丁巳","壬子","癸亥"])
function pipei(baziArr,int_Arr,compStrArr)
{
    let _str = ''
    let rt = { ok:false,msg:'' }
    int_Arr.forEach(
        x=> {
            _str = _str + baziArr[x]
        }
    )
    compStrArr.forEach(
        x=>{
            if(x == _str)
            {
                rt.ok = true
                rt.msg = _str;
            }
        }
    )
    return rt;
}
//转数组
function BaizToArr(str)
{
    if(str.length != 8 ) return null
    return str.split('');
}
//神煞
exports.Gods2 = Gods2
exports.pipei = pipei
exports.BaizToArr =BaizToArr


str = ("select *"
    " from a "
    " where b = 1")
