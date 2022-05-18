// var sleep = require( 'sleep' );
// 数组删除
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
const Ming = {
    六十甲子: ["甲子", "乙丑", "丙寅", "丁卯", "戊辰", "已巳", "庚午", "辛未", "壬申", "癸酉", "甲戌", "乙亥", "丙子", "丁丑", "戊寅", "已卯", "庚辰", "辛巳", "壬午", "癸未", "甲申", "乙酉", "丙戌", "丁亥", "戊子", "已丑", "庚寅", "辛卯", "壬辰", "癸巳", "甲午", "乙未", "丙申", "丁酉", "戊戌", "已亥", "庚子", "辛丑", "壬寅", "癸卯", "甲辰", "乙巳", "丙午", "丁未", "戊申", "已酉", "庚戌", "辛亥", "壬子", "癸丑", "甲寅", "乙卯", "丙辰", "丁巳", "戊午", "已未", "庚申", "辛酉", "壬戌", "癸亥"],
    四天干: "", 四地支: "", 六十甲子_逆: [], 甲子180个: [], 甲子180个_逆: [], 四柱: [], 流年: [], 大运: [], 岁: 0, 顺排: false, birthYear : 0, 
    init(bornYear, bazi, sex, age) {
        this.甲子180个 = this.六十甲子.concat(this.六十甲子).concat(this.六十甲子);
        this.甲子180个_逆 = [...this.甲子180个]; this.甲子180个_逆.reverse();
        this.六十甲子_逆 = [...this.六十甲子]; this.六十甲子_逆.reverse();
        this.birthYear = bornYear; 
        this.getSiZhu(bazi); this.getLiuNian(bornYear); this.getDaYun(sex, age, bornYear);
        this.callbacks.forEach(x => x(this));
    },
    getSiZhu(bazi) {     //分割参数,得到四柱数组 getSiZhu("戊午,壬戌,庚寅,戊寅")

        this.四柱 = bazi.split(',');
        SizhuStr = this.四柱.join("");
        Sizhu2Str = SizhuStr.split('');
        this.四天干 = Sizhu2Str[0] + Sizhu2Str[2] + Sizhu2Str[4] + Sizhu2Str[6];
        this.四地支 = Sizhu2Str[1] + Sizhu2Str[3] + Sizhu2Str[5] + Sizhu2Str[7];
    },
    getLiuNian(bornYear) {       //循环得到流年数组 getLiuNian(1978)
        var nian = (this.六十甲子).indexOf(this.四柱[0]);
        var _bornYear = bornYear;
        for (let index = nian; index < nian + 100; index++) {
            var ob = {}; ob[this.甲子180个[index]] = _bornYear;
            this.流年.push(ob);
// console.log(ob);
            _bornYear++;
        }
    },
    getDaYun(sex, age, bornYear) {
        this.getShunNie(sex);   //获取顺排逆排
        let jia180 = this.甲子180个;
        let yueZhu_pos = (this.六十甲子).indexOf(this.四柱[1]);
        if (!this.顺排) {
            jia180 = this.甲子180个_逆;  //选择顺逆的甲子数组
            yueZhu_pos = (this.六十甲子_逆).indexOf(this.四柱[1]);
        }

        var ten = 10, forIdx = 0; //设置循环大运的参数
        for (let index = yueZhu_pos + 1; index < yueZhu_pos + 8; index++) {
            var age2 = age + (ten * forIdx);
            var ob = {};
            ob[jia180[index]] = age2 + "-" + (age2 + ten - 1) + "," + (age2 + bornYear);
            this.大运.push(ob);
            forIdx++;
// console.log(ob);      
        }
    },
    getShunNie(sex) {
        var nian = (this.六十甲子).indexOf(this.四柱[0]);
        if (nian % 2 === 0 && sex == "男") this.顺排 = true;
        if (nian % 2 !== 0 && sex == "女") this.顺排 = true;
    },
    Is天克地冲(arr四干支,arr大运干支,arr流年干支){ //可以删除  是否是三合局
        //甲庚,乙辛,丙壬,丁癸
        //子午,丑未
        let dichong = ["子午","丑未","寅申","卯酉","辰戌","巳亥","午子","未丑","申寅","酉卯","戌辰","亥巳"];
        let tianke =  ["甲戊","乙己","丙庚","丁辛","戊壬","己癸","庚甲","辛乙","壬丙","癸丁","戊甲","己乙","庚丙","辛丁","壬戊","癸己","甲庚","乙辛","丙壬","丁癸"];
        let arrGan = [],arrZhi = [];
        arrGan.push(arr大运干支[0]+arr流年干支[0]); //干+干  //甲子,乙丑
        arrZhi.push(arr大运干支[1]+arr流年干支[1]); //支+支
        arr四干支.forEach(x => {
            str干 = x.split('')[0];
            str支 = x.split('')[1];
            arrGan.push(arr大运干支[0] + str干); //干+干
            arrZhi.push(arr大运干支[1] + str支); //支+支
            arrGan.push(arr流年干支[0] + str干); //干+干
            arrZhi.push(arr流年干支[1] + str支); //支+支
        } );
        for (let i = 0; i < arrGan.length; i++) {
            rt =`${arrGan[i]} - ${arrZhi[i]}`;
            // console.log(rt);//4
            if(tianke.includes(arrGan[i]) && dichong.includes(arrZhi[i])){
                let ganzhi1 = arrGan[i].split('')[0] + arrZhi[i].split('')[0];
                let ganzhi2 = arrGan[i].split('')[1] + arrZhi[i].split('')[1];
                console.log(`\t天克地冲:${ganzhi1} - ${ganzhi2}`);
            };
        }
    },
    Is合局(str四地支,str大运支,str流年支,JU){ //是否是三合或者三会局
        let SanJu = JU.JuArr;// 三合或者三会局 ["寅午戌", "申子辰", "亥卯未", "巳酉丑"];
        let SanJu_son = "";
        for (let i = 0; i < SanJu.length; i++) { //大运查三合局,看是哪个和局
            if(SanJu[i].includes(str大运支)){SanJu_son = SanJu[i];break;}
        };
        SanJu_son = SanJu_son.replaceAll(str大运支,''); //剩下两个
        if(SanJu_son.includes(str流年支)){
            SanJu_son = SanJu_son.replaceAll(str流年支,'');
            if(str四地支.includes(SanJu_son)) {
                console.log(`\t流年${JU.JuName}:大运${str大运支}`);
                return true;//如果也存在,则三个交集成和局成立
            }
        }else{ return false;}
    },
    Get日干查日支(Mingx,obj){
        let 羊刃 = obj.Arr;
        let rizhu = Mingx.四柱[2]; //日柱
        let 四支 = Mingx.四地支;
        for (let i = 0; i < 羊刃.length; i++) {
            let yangrenson = 羊刃[i];
            if(yangrenson.includes(rizhu.split('')[0])){ //查日干
                if(四支.includes(羊刃[i].split('')[1])){  //查四柱地支
console.log(`日柱${obj.Name}:${rizhu.split('')[0]} - ${羊刃[i].split('')[1]}`)
                };
                break;
            };
        };
    },
    callbacks: [
        (Mingx) => { //魁罡
            let 魁罡 = ["庚戌", "庚辰", "壬辰", "戊戌"];
            if (魁罡.includes(Mingx.四柱[2])) {
console.log("日柱魁罡:" + Mingx.四柱[2]) ;
            };
        },
        (Mingx) => { 
            let JU = { Name:"羊刃", Arr : ["甲卯","乙寅","丙午","丁未","庚酉","辛申","壬子","癸亥"] };
            Mingx.Get日干查日支(Mingx,JU);
        },     
        (Mingx) => { //循环四柱 大运 流年 交集各种情况
            Mingx.大运.forEach(y => {
                let 大运干支 = (Object.keys(y)).toString();
                let 大运干 = 大运干支.split('')[0];
                let 大运支 = 大运干支.split('')[1];
                let 大运起始流年 = (Object.values(y)).toString().split(',')[1];
                for (let i = 0; i < Mingx.流年.length; i++) {
                    let 流年干支 = (Object.keys(Mingx.流年[i])).toString();
                    let 流年干 = 流年干支.split('')[0];
                    let 流年支 = 流年干支.split('')[1];
                    let 流年年份 = (Object.values(Mingx.流年[i])).toString();
                    if ((parseInt(大运起始流年) + 10) > parseInt(流年年份) && parseInt(流年年份) >= parseInt(大运起始流年)) {//在大运中循环十年
//console.log(`${流年年份}年(${流年年份-Mingx.birthYear}岁): ${大运干支}运 - ${流年干支}`);
                        let Ju1 = { JuName:"三合局", JuArr : ["寅午戌", "申子辰", "亥卯未", "巳酉丑"] };
                        let Ju2 = { JuName:"三会局", JuArr : ["寅卯辰", "巳午未", "申酉戌", "亥子丑"] };
                        // Mingx.Is合局(Mingx.四地支,大运支,流年支,Ju1);   //测试ok
                        // Mingx.Is合局(Mingx.四地支,大运支,流年支,Ju2);   //测试ok
                        // Mingx.Is天克地冲(Mingx.四柱,大运干支,流年干支); //测试ok
                    };   
                };
            })
        }
    ]
};

Ming.init(1978, "戊午,壬戌,庚戌,戊寅", "男", 8);
// Ming.init(1993,"丙子,丙申,甲辰,戊辰","女",9); //七銀

data.sort(
    firstBy(function (v1, v2) { return v1.name.length - v2.name.length; })
    .thenBy(function (v1, v2) { return v1.population - v2.population; })
    .thenBy(function (v1, v2) { return v1.id - v2.id; })
);