var zNodes = [
    {id: 1, pId: 0, name: "时政财经", open: true},
        {id: 101, pId: 1, name: "文昭"},
        {id: 102, pId: 1, name: "江峰"},
        {id: 103, pId: 1, name: "嘚啵嘚"},
        {id: 104, pId: 1, name: "老灯"},
        {id: 105, pId: 1, name: "一剑飘尘"},
        {id: 106, pId: 1, name: "李沐阳"},
        {id: 107, pId: 1, name: "青灯观青史"},
        {id: 108, pId: 1, name: "薇羽看世間"},
        {id: 109, pId: 1, name: "小翠時政財經"},
        {id: 110, pId: 1, name: "姜维平"},
        {id: 111, pId: 1, name: "科普君"},
        {id: 112, pId: 1, name: "骁话一下"}, 
        {id: 113, pId: 1, name: "王志安"},          
    {id: 2, pId: 0, name: "电影", open: true},
        {id: 201, pId: 2, name: "初心熟男"},
        {id: 202, pId: 2, name: "小川侃电影"},
        {id: 203, pId: 2, name: "电影迷小雅"},
        {id: 204, pId: 2, name: "青蛙刀圣1993"},
        {id: 205, pId: 2, name: "电影最TOP唯一官方频道"},
        {id: 206, pId: 2, name: "小涛讲电影"},
        {id: 207, pId: 2, name: "犯叔说影"},
    {id: 3, pId: 0, name: "史前", open: true},
        {id: 301, pId: 3, name: "老高與小茉"},
        {id: 302, pId: 3, name: "seeker大师兄"},
        {id: 303, pId: 3, name: "自说自话的总裁"},
        {id: 304, pId: 3, name: "脑洞乌托邦"},
    {id: 9, pId: 0, name: "其他", open: true},
        {id: 901, pId: 9, name: "The Virtual Safari"},
        {id: 903, pId: 9, name: "KIYASOV VIDEOZ"},
        {id: 904, pId: 9, name: "EHPMusicChannel"},
        {id: 905, pId: 9, name: "URBAN DANCE CAMP"},
        {id: 906, pId: 9, name: "醫道搬運工"},
        {id: 907, pId: 9, name: "《家有大中医》官方频道"}, 
        {id: 908, pId: 9, name: "零度解说"},
        {id: 909, pId: 9, name: "Viewty 룩북 | Viewty Lookbook"},
        {id: 910, pId: 9, name: "vote sport"},
        {id: 911, pId: 9, name: "万物有光"},
        {id: 912, pId: 9, name: "主播私享"},

];
var selectObj;
var defaults = {
        zNodes: zNodes,
        height: 233,
        filter: false,
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
    setTimeout(function(){
        $(".ztree").css("width","800px");
        $(".dropdown_container").css("margin-top","7px");
        $(".line").css({"display":"flex","flex-wrap": "wrap"});
        $(".dropdown_container li ul.level0").css({"display":"flex", "flex-wrap": "wrap"});
        $(".ztree li a").css("display:contents");
        // $(".center_docu").css("");
        $(".ztree li span.button.center_docu").css("width","3px");
        $(".ztree li span.button.bottom_docu").css("width","3px");
    }, 1000)
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