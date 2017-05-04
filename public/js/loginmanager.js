(function() {

  var baseUrl = 'http://10.220.10.60:8089';
  var urls = {
    loginUrl : baseUrl + '/probe-service/rest/login/query.do',
    logoutUrl : baseUrl +  '/probe-service/rest/logout/query.do'
  }  
  var COOKIE_TIME = 60 * 60 * 1000 * 24;
  var COOKIE_NAME = 'isLogin';

// 登录管理
var loginManage = {

  login:function(username,pw){
    var reqData={
      "userName":username,
      "password":pw
    };
    $.ajax({
      url: urls.loginUrl,
      type: 'POST',
      dataType: 'json',
      contentType:"application/json; charset=utf-8",
      data: JSON.stringify(reqData)
    })
    .done(function(res) {
      var expiresDate= new Date();
      expiresDate.setTime(expiresDate.getTime() + (COOKIE_TIME));
      if(res.status==0){
        usecookies.setCookie(COOKIE_NAME,true,expiresDate);
        /*登录页登陆后直接跳转到首页*/
        if(location.href.match(/login/)){
          location.href = '/probe/index/index.html';
        } else {
          history.go(-1); 
        }
      }
    });
  },
  logout:function(){
    $.get(urls.logoutUrl, function(res) {
      if(res.status==0){
        usecookies.delCookie(COOKIE_NAME);
        window.location.href = "/probe/login/login.html";
      }
    });
  },
  chack:function(){
    var hosturl = window.location.href.indexOf("login");
    if($.cookie(COOKIE_NAME) == null || usecookies.getCookie(COOKIE_NAME)==false && hosturl==-1) {
        window.location.href = "/probe/login/login.html";
      }  
    }
  }

  // if(!window.snailprobe) {window.snailprobe = {}};
  // if(!window.snailprobe.LoginManager) {window.snailprobe.LoginManager = loginManage};
  window.loginManage = loginManage;

})()