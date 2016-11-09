/**
 * main函数，程序入口
 */
main(['Common', 'Login', 'ArticleAdmin', 'Upload','backTop'],function (Common, Login, ArticleAdmin,Upload,backTop) {
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
		new backTop.BackTop('#backtop');
		$('#goBottom').click(function(){ 
			$('html, body').animate({scrollTop: $(document).height()}, 300); 
			
			return false; 
		}); 

	});



});