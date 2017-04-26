(function() {

    var loginBtn = $('#loginBtn');

    loginBtn.on('click', function() {
        loginManage.login($('#un_1').val(),$('#pw_1').val());
    })

})()