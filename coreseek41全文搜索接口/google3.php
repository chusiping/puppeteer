<?php 
// This for sphinx coreseek
// indexer -c D:/xampp____web/coreseek41/etc/csft_mysql.conf  --all 
// searchd --config D:/xampp____web/coreseek41/etc/csft_mysql.conf
require 'sphinxapi_coreseek41.php';

@$keyword=$_POST['keyword'];
if($keyword!=null) {
	$sc = new SphinxClient();            
	$sc->setServer('127.0.0.1', 9312);    
	$indexname ='mysql';
	$sc->SetMatchMode(SPH_MATCH_PHRASE); //SPH_MATCH_PHRASE：必须匹配整个短语  SPH_MATCH_ALL：完全匹配所有的词

//     $sc->SetLimits(0,100);  //条数限制为200条
	$res = $sc->query($keyword,$indexname);
	$ids = $res['matches'];
	$id = array_keys($ids);
	$id = implode(',',$id);
	mysql_connect("1172.18.1.208",'root','toor.1qaz@WSX');
	mysql_query('use typecho');
	mysql_query('SET NAMES UTF8');
	$sql="select cid,title,text,FROM_UNIXTIME(created) date from typecho_contents where cid in($id) order by cid desc";
	// echo $sql;
	$res = mysql_query($sql) ;
	$list=array();

	//======== 判断是否是全词限定 =========
	$isAll = false;
	if(mb_strlen($keyword,'utf8')<4) {  $isAll = true; }
	if(strpos($keyword,"\"")>-1 ) {  $isAll = true; }
	//=================
	$opts = array(
        "before_match"=> '<span style="color:blue;font-weight:bold;">',
        "after_match" => '</span>',
        "chunk_separator"=> '　　...　　',
        "around" => 16,
        "exact_phrase" => $isAll
    );
	// var_dump($isAll); 
	while($row=mysql_fetch_assoc($res)){
	    $list[]=$row;
	}
}
?>
<!DOCTYPE HTML>
<html class="no-js">
<head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="renderer" content="webkit">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>在水一方--google</title>
        <meta name="robots" content="noindex, nofollow">
        <link rel="stylesheet" href="http://win7.qy:8001/admin/css/normalize.css?v=17.10.30">
		<link rel="stylesheet" href="http://win7.qy:8001/admin/css/grid.css?v=17.10.30">
		<link rel="stylesheet" href="http://win7.qy:8001/admin/css/style.css?v=17.10.30">
		<script type="text/javascript" src="jscss/jquery-1.8.3.min.js"></script>
</head>
<body class="body">
<div class="container clearfix">
	<div>
	    <div style="padding: 10px; display: inline-block;">
	        <form action="" method="post" name="login" role="form">
					<datalist id="cp1_datalist"></datalist>
	                <input type="text" id="keyword" name="keyword" value="<?php echo $keyword; ?>" class="text-l" autofocus="" list="cp1_datalist">
	            	<button id="bt_1" type="submit" onclick="save_input();" class="btn btn-l primary">搜索</button>
	        </form>
	    </div>
	   <div style="display: inline-block;"> 
	   		<a href="/admin/manage-posts.php">后台</a>　
	   		<a href="index.php/archives/170/">待办</a>
	   </div>

	</div>   
	<div id="main"> 
	<?php
		if (isset($list)){
			foreach($list as $v){
				$row = $sc->buildExcerpts($v,$indexname,$keyword,$opts);
	?>
			<article class="post">
				<div style="font-size: 15px; font-weight: bolder; display: inline-block; width: 800px;">
				<a href="/admin/write-post.php?cid=<?php echo $row[0]; ?>" target="_blank"><?php echo $row[1]; ?></a>　　
				</div>
				<div style="display: inline-block;;"> <a href="/index.php/archives/<?php echo $row[0]; ?>/?key=<?php echo $keyword; ?>" target="_blank"><?php echo $row[3]; ?></a> </div>
				<div class="post_content">
				 	<?<?php echo $row[2]; ?>
				</div>
			</article>
			<hr>
	<?php } } else {  ?>
		<div style="font-size: 18px; font-weight: bolder">买卖次数越多，周转越快，赚得越多</div>
		<div style="font-size: 18px; font-weight: bolder">第六感和外因</div>
		<div style="font-size: 18px; font-weight: bolder">不击，不中，一出，必中</div>
	<?php }  ?>
	</div>
</div>
<script type="text/javascript" src="jscss/lib.js"></script>
<script type="text/javascript" src="jscss/jquery.cookie.js"></script>
<script language="JavaScript">  
    $(document).ready(function(){
        BindDataList();	
    });
	function BindDataList()		//把cookie里的数据绑定到所有的datalist
	{
		var c_start=document.cookie.indexOf("history=");
		if(c_start == -1) return;
		var HistoryCookie = $.cookie('history');
		var hisObject = JSON.parse(HistoryCookie); //字符串转化成JSON数据		
		for(var i=0;i<hisObject.length;i++){
			for(var key in hisObject[i]){
				//alert(key+':'+hisObject[i][key]);
				$('#'+ key +'').append('<option value="' + hisObject[i][key] + '"></option>'); ////给指定的datalist添加option
			}
		}
	}
	function SetBataListCookie(inputID,datalistID)  //把input里的输入历史记录到cookie
	{
		var c_start=document.cookie.indexOf("history=");
		var HistoryCookie = null; 
		var hisObject = [];
		var vl = $(inputID).val();
		if(vl == "") return;
		var newob = {}; newob[datalistID] = vl ;
		if(c_start > -1) {
			HistoryCookie = $.cookie('history');
			hisObject = JSON.parse(HistoryCookie); //字符串转化成JSON数据
			for(var i=0;i<hisObject.length;i++){
				for(var key in hisObject[i]){
					if(key == datalistID && hisObject[i][key] == vl ) return;
				}
			}
		}		
		hisObject.push(newob);
		var objString = JSON.stringify(hisObject); 
		$.cookie('history',objString);
		$('#'+ datalistID +'').html('');
		BindDataList();		
	}
	function save_input()
	{
		SetBataListCookie('#cp1','cp1_datalist');
	}
</script>
<script src="http://win7.qy:8001/admin/js/jquery.js?v=17.10.30"></script>
<script src="http://win7.qy:8001/admin/js/jquery-ui.js?v=17.10.30"></script>
<script src="http://win7.qy:8001/admin/js/typecho.js?v=17.10.30"></script>
</body>
</html>
