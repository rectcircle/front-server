define('Upload', ['Common'], function (Common) {

    function Upload (btn, form) {
        $(btn).click(function (event) {
            _upload(form, afterUpload);
        });
    }

    function afterUpload (data) {
        var item = '<div class="col-sm-3 col-md-2 .col-xs-3">' +
					'	<div class="thumbnail">' +
					'	  <img class="thumbnail-100" src="/res/' + data + '" alt="...">' +
					'	  <div class="caption linebreak">' +
					'	  	<p>/res/'+ data +'</p>' +
					'	    <p class="text-center .copy"><button data-src="/res/' + data + '" class="btn btn-primary copyBtn" role="button">复制信息</button></p>' +
					'	  </div>' +
					'	</div>' +
					'</div>';

        var $item = $(item);
        $('#imgShowView').append($item);

    }

    function _upload (form, afterUpload) {
		// var $progress = $(propress);
        var formData = new FormData($(form)[0]);
        $.ajax({
            url: '/upload',
            type: 'POST',
            data: formData,
            dataType: 'json',
            contentType: false, // 必须false才会避开jQuery对 formdata 的默认处理 XMLHttpRequest会对 formdata 进行正确的处理
            processData: false, // 必须false才会自动加上正确的Content-Type
            success: function (data) {
                console.log(data);
                if (data.errcode === 0) {
                    afterUpload(data.data);
                } else {
                    Common.showPromptBox(data.errmsg);
                }
            },
	        error: function (e) {
	        	console.log(e);
	        	Common.showPromptBox('文件上传，请求失败');
	        },
        });
    }

    return Upload;
});
