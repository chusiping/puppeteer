var zNodes = [
    {id: 1, pId: 0, name: "时政", open: true},
        {id: 11, pId: 1, name: "文昭,江峰,嘚啵嘚,老灯,李沐阳"},
        {id: 12, pId: 1, name: "青灯观青史,薇羽看世間"},
    {id: 2, pId: 0, name: "电影", open: true},
        {id: 21, pId: 2, name: "初心熟男"},
        {id: 22, pId: 2, name: "小川侃电影"},
        {id: 23, pId: 2, name: "电影迷小雅"},
        {id: 24, pId: 2, name: "青蛙刀圣1993"},
        {id: 25, pId: 2, name: "电影最TOP唯一官方频道"},
        {id: 26, pId: 2, name: "小涛讲电影"},
    {id: 3, pId: 0, name: "其他", open: true},
        {id: 31, pId: 3, name: "EHPMusicChannel"},
        {id: 32, pId: 3, name: "URBAN DANCE CAMP"},
        {id: 33, pId: 3, name: "醫道搬運工"},
        {id: 34, pId: 3, name: "《家有大中医》官方频道"}, 
        {id: 35, pId: 3, name: "零度解说"}, 
        {id: 36, pId: 3, name: "Pan Piano"}, 
        
];
var selectObj;
var defaults = {
        zNodes: zNodes,
        height: 233,
        filter: true,
        searchShowParent: false,
        callback: {
        onCheck: function (treeSelectObj, treeNode) {
            if(selectObj!=null){
                getNew(selectObj.val(),zNodes)
                // console.log( selectObj.val().toString());
            } 
        }
    }
};

$(function () {
    selectObj = $("#demo").treeSelect(defaults);
})
let getNew=(data,所有Nodes)=>{
    var rt = [];//选中的对象
    let 选中的node =  data;
    for (let x2 = 0; x2 < 选中的node.length; x2++) {
        所有Nodes.forEach(x => {
            const el = 选中的node[x2];
            if(el== x.id && x.pId > 0){
                rt.push(x);
            }
        });
    };
    fuzhi(ck(rt,所有Nodes));
}
// 把值填充到input
let fuzhi = (str) =>{ $('#demo').val(str); }
let ck = (checkNodes,allNodes)=>{
    let arr=[];
    checkNodes.forEach(x1 => {
        var rt = true;
        allNodes.forEach(x2 => {
            if(x1.id == x2.pId) {
                rt = false;
            }
        });
        if(rt==true){
            arr.push(x1.name);
            // console.log(x1)
        }
    });
    return arr.join(',');
}