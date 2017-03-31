<?php 
header('Content-type:text/json; charset=utf-8');     //这句是重点，它告诉接收数据的对象此页面输出的是json数据；
$pageindex = '';
if (!empty($GLOBALS['HTTP_RAW_POST_DATA']))
{
    $command =  isset($GLOBALS['HTTP_RAW_POST_DATA']) ? $GLOBALS['HTTP_RAW_POST_DATA'] : file_get_contents("php://input");
    $j =json_decode( $command,true);//true,转化成数组
    $pageindex = $j['pageindex'];
}
 

$pagesize = 10;
// $str = array('{"hostname":"test-242","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"上海 中国电信"}');

$arr = json_decode('[{"hostname":"test-001","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"天津 中国电信"},{"hostname":"test-002","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"广州 中国电信"},{"hostname":"test-003","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"北京 中国电信"},{"hostname":"test-004","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"北京 中国电信"},{"hostname":"test-005","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"武汉 中国电信"},{"hostname":"test-006","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"北京 中国电信"},{"hostname":"test-007","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"北京 中国电信"},{"hostname":"test-008","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"苏州 中国电信"},{"hostname":"test-009","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"北京 中国电信"},{"hostname":"test-010","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"北京 中国电信"},{"hostname":"test-242","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"北京 中国电信"},{"hostname":"test-011","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"南京 中国电信"},{"hostname":"test-012","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"北京 中国电信"},{"hostname":"test-242","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"北京 中国电信"},{"hostname":"test-242","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"北京 中国电信"},{"hostname":"test-242","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"北京 中国电信"},{"hostname":"test-242","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"北京 中国电信"},{"hostname":"test-242","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"北京 中国电信"},{"hostname":"test-242","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"北京 中国电信"},{"hostname":"test-242","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"北京 中国电信"},{"hostname":"test-242","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"北京 中国电信"},{"hostname":"test-242","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"北京 中国电信"},{"hostname":"test-242","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"北京 中国电信"},{"hostname":"test-24","hbtime":"2017-03-21 20:38:10","version":"v1.0.5","ip":"101.231.135.154","district":"大连 中国电信"}]',true);



$countsize = ceil(count($arr)/$pagesize); //总页数


$pagecur = $pagesize*($pageindex-1);
$obj = array_slice($arr,$pagecur,$pagesize);


$output = json_encode($obj);

// echo $obj = serialize($arr);
echo '{"probeList":'.$output.',"indexCounts":'.$countsize.'}'; 
// echo '{"taskList":'.$output.',"indexCounts":'.$countsize.'}'; 





 ?>