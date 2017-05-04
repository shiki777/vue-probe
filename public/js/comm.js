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
      var resUrl = 'http://10.220.10.60:8087/probe-service/task/taskList'
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
      			var showoptbtn = (res.indexCounts>2)?true:false;//看看有必要显示首未和上下页
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
// 获取地址栏的参数数组
function getUrlParams(){var search=window.location.search;var tmparray=search.substr(1,search.length).split("&");var paramsArray=new Array;if(tmparray!=null){for(var i=0;i<tmparray.length;i++){var reg=/[=|^==]/;var set1=tmparray[i].replace(reg,'&');var tmpStr2=set1.split('&');var array=new Array;array[tmpStr2[0]]=tmpStr2[1];paramsArray.push(array)}}return paramsArray}
// 根据参数名称获取参数值
function getParamValue(name){var paramsArray=getUrlParams();if(paramsArray!=null){for(var i=0;i<paramsArray.length;i++){for(var j in paramsArray[i]){if(j==name){return paramsArray[i][j]}}}}return null}



function obtain(n){
  var requrl = (n==1)?urls.probeUrl:urls.taskUrl;
  console.log(urls.taskUrl)
  $('#J_searchBtn').data('searchkey',requrl);
  $('#datas').getdatas({
      url:requrl,
      datatype:n
  })
}

var baseUrl = 'http://10.220.10.60:8087';
var urls = {
  probeUrl : baseUrl + '/probe/rest/probeTask/query.do',
  taskUrl : baseUrl + '/probe-service/task/taskList',
  historyTaskUrl : baseUrl + '/probe/rest/historyTaskList/query.do',
  loginUrl : baseUrl + '/probe/rest/login/query.do',
  logoutUrl : baseUrl +  '/probe/rest/logout/query.do'
}


var group = {
  groupname:"probes",
    cInit:function(){
      var grouplist = {
        groups:['a','b','c'],
        len:6
      };
      // 获取是否已经有定义好的组
     /* $.ajax({
        url: 'test.php',
        type: 'POST',
        dataType: 'json'
      })
      .done(function(grouplist) {
        console.log(grouplist);
      })*/
      var probeGroupTemplate = template('groupTemp', grouplist);          
      $('#probeGroupList').html(probeGroupTemplate);
      obtain(1);
    },
    cGroupName:function(){
      $('.modal,.probe-group-dialog').show();
      $('.modal,.modal-backdrop').addClass('in');
    },
    cNextStep:function(){
      var groupName = $('#groupName').val();
      if (groupName=="") {
        $('#noNameTips').text('小哥、组名不能为空嘛～').show().addClass('in');
      }else{
        //查询组名是否存在
        $.ajax({
          url: 'http://127.0.0.1:5000/addgroup',
          type: 'POST',
          dataType:'json',
          data: "groupName=" + groupName,
        }).done(function(res) {
          if(typeof(res)!='object' && res.code!=0){
            $('#noNameTips').text('阿西！返回有错，刷新再来try一把～').show().addClass('in');return;};
          if (res.code == 1) {
            $('#noNameTips').text('小哥、组名已经有啦，换一个吧～').show().addClass('in');
          }else{
            group.groupname = groupName;
            $('.probe-group-dialog').hide();
            $('.group-multiselect').show(); 
            setTimeout(function () {
              group.cGetProbeList()
            }, 500);            
          }
        })  
      }
    },
    cPrevStep:function(){
      $('.probe-group-dialog').show();
      $('.group-multiselect').hide();
    },
    cGetProbeList:function(){
      console.log(this.groupname);
      // 获取探针列表放入金鱼缸等待选妃
      $.ajax({
        url: 'test.php',
        timeout : 5000,
        dataType:'json',
        type: 'POST'
      })
      .done(function(reslist) {
        if(typeof(reslist)!='object' && reslist.code!=0) return;
        $.each(reslist.probeList, function(i, v) {
           $('#multiselect_from').append("<option value='"+v.district+"'>"+v.district+"</option>");
        });
        $('#multi_select').removeClass('hide');
        $('#loadingLayer').addClass('hide');//隐藏菊花转
        $('.multiselect').multiselect();
      })
      .always(function(XMLHttpRequest,status) {
        console.log(XMLHttpRequest);
        if (status=='timeout') {
          alert('请求超时');
        }else if (status=="timeout") {
          alert("请求超时");
        }
      });         
    },
    cSaveGroup:function () {
      $('.modal,.probe-group-dialog').hide();
      $.ajax({
        url: 'test.php',
        type: 'POST',
        dataType: 'json'
      })
      .done(function(res) {
        if (typeof(res)!='object' && res.code!=0) {
          return;
        }
        group.cPrevStep();
      })
      .fail(function() {
        console.log("error");
      });
    },
    cCancelCreat:function(){
      $('.modal,.probe-group-dialog').hide();
      $('.modal,.modal-backdrop').removeClass('in');
      this.cPrevStep();

    },
    getGroupList:function () {
      
      
    }
}

$(function() {
	// sidebarmenu
  $('.sidebar-toggle').click(function(event) {
    $('.vFramework-body').toggleClass('vFramework-full vFramework-mini');
  });
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