$(function(){
	function tabshow(ta){
		tadkTab.removeClass('active');
		ta.addClass('active');
	}
	obtain(2);
   	var tadkTab =  $('#J_task_tab li');
   	var flag = true;//第一次请求已完成数据开关
   	var haveHistory = true;

    $('.nowTask').on('click',function(){
   		tabshow($(this));
   		$('#J_searchBtn').data('searchkey',urls.taskUrl);
   		$('#datas,.newtaskbtngroup,#page').show();
   		$('#datasHistory,#hispage').hide();
   		$('.datatips').remove()
    })
    $('.historyTask').on('click',function(){
   		$('#datas,.newtaskbtngroup,#page').hide();
   		$('#J_searchBtn').data('searchkey',urls.historyTaskUrl);
   		tabshow($(this));
   		$('.datatips').remove()
   		if(flag){			
   			$('#datasHistory').getdatas({
   				url:urls.historyTaskUrl,
   				datatype:2,
   				pagedome:$('#hispage'),
   				callBack:function(isget){
   					haveHistory = isget;
   					if(!isget){		   						
   						$('#hispage').hide();
   					}
   				}
   			})
   			flag = false;
   		}else{
   			if(haveHistory){
   				$('#datasHistory,#hispage').show();	
   			}		   			
   		}
    })

   // 新建任务
	$("#J_newCreatTask").click(function() {		
		$("#creatTask").show();
	});

	// 取消新建
	$('#J_btn_cancel').click(function(event) {
		$("#creatTask").hide();
	});
})