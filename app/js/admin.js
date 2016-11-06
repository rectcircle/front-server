/**
 * main函数，程序入口
 */
main(['Common', 'Login', 'ArticleAdmin', 'Upload'],function (Common, Login, ArticleAdmin,Upload) {
	$(function(){
		new Login();
		new ArticleAdmin();
		new Clipboard('.copyBtn', {
		    text: function(trigger) {
		    	var name = $(trigger).data('src');
		        return "![]("+ name +")";
		    }
		});
		new Upload('#startUpload', '#uploadForm');
	});
});