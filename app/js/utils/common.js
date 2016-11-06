/**
 * 通用工具静态函数集合
 * Created by sunben960729 on 2016/9/17.
 */
 define('Common', function () {
     return {

        /**
         * [getRandomString description]
         * @param  {[int]} len [获取随机字符串的长度]
         * @return {[String]}     [随机字符串]
         */
         getRandomString: function (len) {
             len = len || 32;
             var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; // 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1
             var maxPos = chars.length;
             var pwd = '';
             for (var i = 0; i < len; i++) {
                 pwd += chars.charAt(Math.floor(Math.random() * maxPos));
             }
             return pwd;
         },

        /**
         * 获取url中的参数
         */
         getUrlParam: function (name) {
             var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'); // 构造一个含有目标参数的正则表达式对象
             var r = window.location.search.substr(1).match(reg);  // 匹配目标参数
             if (r !== null) {
                 return unescape(r[2]);
             }
             return null; // 返回参数值
         },

        /**
         * 显示弹出框
         * @param  {string} type 弹出类型可选：success、info、warning、danger
         * @param  {[string]} content   [文本内容]
         */
         showPromptBox: function (content, type) {
             var _type = type || 'danger';
             var html = '<div class="alert alert-' + _type + ' alert-dismissible" role="alert" style="position: fixed;top: 60px;right:20px;left: 20px; z-index: 2">' +
                            '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                            content +
                        '</div>';

             $('body').append(html);
         },

     };
 });
