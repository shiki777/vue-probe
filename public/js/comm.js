(function ($){
  $.fn.getdatas = function(options) {  
    var defaults = {
       datatype:1,//1-探针 2-任务
       url:"http://192.168.5.233:8084/probe/rest/probeTask/query.do",
       pagedome: $('#page'),    
       vname:"",   
       callBack : function(isget){}
    }   
    var opt = $.extend(defaults, options);   

    return this.each(function() {
      obj = $(this);   
      var resUrl = opt.url,
      datatype = options.datatype,
      pagedome = opt.pagedome,
      vname = opt.vname;
      var pageshow = {
      	getData(showindex,resUrl){	 
      		var def = $.Deferred();
      		if (datatype==1) {
      			var reqData = {
      				hostname:vname,
      				pageindex:showindex
      			}
      		} else if(datatype==2) {
      			var reqData = {
      				taskName:vname,
      				pageindex:showindex
      			}
      		}
      		$.ajax({
      			url: resUrl,
      			type: 'POST',
      			contentType:"application/json; charset=utf-8",
      			data: JSON.stringify(reqData),
      			dataType: 'json'
      		})
      		.done(function(res) {
      			if(res.indexCounts==0){   
      				$('#tableDada').after('<div class="datatips text-center">目前没有相关数据</div>');
      				opt.callBack(false);
      			}
      			pageshow.drawingTable(showindex,res);
      			def.resolve(res);
      		})
      		.fail(function() {
      				$('#tableDada').after('<div class="datatips text-center">获取数据失败！</div>');
      			return;
      		})
      	   	return def.promise();
      	},
      	init:function () {     		 	   			
      		pageshow.getData(1,resUrl).done(function(res){
      			var showoptbtn = (res.indexCounts>2)?true:false;
      			pagedome.Page({
					totalPages: res.indexCounts,//分页总数
					liNums: 5,//分页的数字按钮数
					activeClass: 'activP', //active 类样式定义
					hasFirstPage: showoptbtn,
					hasLastPage: showoptbtn,
					hasPrv: showoptbtn,
					hasNext: showoptbtn,
					callBack : function(showindex){
						pageshow.getData(showindex,resUrl);	   	   			          	
					}
      	    	});
      		});	  			   	   	
      	},
      	drawingTable:function(showindex,res){  		
      		var pagesize = 10; 			
      		var data = {
      			showindex:showindex*pagesize-9,
      			resdata: datatype==1?res.probeList:res.taskList   			
      		};
      		var probeTemplate = template('datatemp', data);      		
      		obj.html(probeTemplate);
      	}
      }
      pageshow.init();
    })
  }
})(jQuery);


$(function() {
	$('.sidebar-toggle').click(function(event) {
		$('.vFramework-body').toggleClass('vFramework-full vFramework-mini');
	});
	// sidebarmenu
	var menu_li = $('.sidebar-menu>ul .list-group-item');
	
	menu_li.each(function(i, el) {
		$(this).click(function(event) {
			if (i < 2) {
				menu_li.removeClass('active').eq(i).addClass('active');
				$('#dataArea>div').hide().eq(i).show();
				$("#creatTask").hide();
			}else{
				toggleSub();
			}
		});		
	});
	 
 	function toggleSub(){
 		var sub_sidebar_menu = $('.sub-sidebar-menu');
 		if(sub_sidebar_menu.attr('data-closed') == "true"){
 			sub_sidebar_menu.attr('data-closed', "false");
 			sub_sidebar_menu.animate({left: "100%"}, 300);
 			 setTimeout(function () {
                 $(document).unbind('click.doc').one("click.doc", function () {
                 	sub_sidebar_menu.attr('data-closed', "true");
                     $(".sub-sidebar-menu").animate({left: "-250%"}, 300);
                 })
             }, 10)
             event.stopPropagation();
 		}else{
 			sub_sidebar_menu.attr('data-closed', "true");
 			sub_sidebar_menu.animate({left: "-250%"}, 300)
 		}
 	}

 	// search
 	var searchQuery = $('#searchQuery');
 	$("#J_searchBtn").on('click',function(event){
 			var queryurl = $(this).data("searchkey");
 			var dType = (queryurl.indexOf("probeTask")>-1)?1:2;
 			var dataDmo = $("#datas");
 			if(queryurl.indexOf("historyTaskList")>-1){
 				dataDmo = $("#datasHistory");
 			} 			
 			if(searchQuery.val()==""){
 				searchQuery.parent('.search-area').addClass('has-error');		
 			}else{
			   	dataDmo.getdatas({
			   		url:queryurl,
				   	datatype:dType,
				   	vname:searchQuery.val()
			    })
 			}
 			toggleVal(); 
 	})

 	searchQuery.keyup(function(event) {
 		searchQuery.parent('.search-area').removeClass('has-error');
 	});

	function toggleVal(){
		if(searchQuery.val()==""){
			$(document).unbind('click.doc').one("click.doc", function () {
				$('.search-area').removeClass('has-error');
			})
            event.stopPropagation();
		}
	}


})