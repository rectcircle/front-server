/**
 * 定义一组处理登录的类
 * 
 */
define('Login', ['Common'], function (Common) {
    /**
     * 登录构造函数
     * @param {string|jquery对象} el 登录绑定的按钮，默认为login
     */
    function Login(el){ 
        $("#loginTab").removeClass('active').hide();
        $("#loginView").removeClass('active').hide();
        var $el = $(el||'#login');
        isLogin(hideLoginView,login, $el);
    }
 
    //以下是私有方法
    function isLogin(trueFunc, falseFunc, $el){
        $.ajax({
                url: 'admin/isLogin',
                type: 'POST',
                dataType: 'json',
                
            })
            .done(function(data) {
                console.log(data);
                if(data.errcode===0){
                    trueFunc();
                } else {
                    falseFunc($el);
                }
            })
            .fail(function(e) {
                Common.showPromptBox("判断是否登录，请求失败");
            });

    }

    function login($el){
        showLoginView();
        var salt = Common.getRandomString();
        $el.click(function(){
            $.ajax({
                url: 'admin/login',
                type: 'POST',
                dataType: 'json',
                data: {
                    username: $('#username').val(),
                    encodedPassword: $.md5($.md5($('#password').val())+salt),
                    salt: salt
                },
            })
            .done(function(data) {
                console.log(data);
                if(data.errcode===0){
                    hideLoginView();
                } else {
                    Common.showPromptBox(data.errmsg);
                }
            })
            .fail(function(e) {
                Common.showPromptBox("登录，请求失败");
            });
            
        });

    }

    function showLoginView($el){
        $("#editTab").removeClass('active');
        $("#editView").removeClass('active');

        $("#loginTab").addClass('active').show();
        $("#loginView").addClass('active').show();
        // $('#loginTab a').tab('show');

    }

    function hideLoginView(){
        $("#loginTab").removeClass('active').hide();
        $("#loginView").removeClass('active').hide();

        // $("#editTab").addClass('active');
        // $("#editView").addClass('active');
        $('#editTab a').tab('show');        
    }


    return Login;
});
