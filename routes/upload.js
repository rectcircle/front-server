var express = require('express');
var router = express.Router();

var multiparty = require('multiparty');
//var util = require('util');
//var fs = require('fs');

/* GET home page. */
router.post('/', function(req, res, next) {
	//生成multiparty对象，并配置上传目标路径
	var form = new multiparty.Form({uploadDir: './public/img/'});
	//上传完成后处理
	form.parse(req, function(err, fields, files) {
		// var filesTmp = JSON.stringify(files);

		if(err){
			//console.log('parse error: ' + err);
			res.send({errcode:40007,errmsg:"文件上传错误"});
		} else {
			// console.log(files.file[0].path);
			var strArr = files.file[0].path.split(/[/\\]/)
			// console.log(strArr[strArr.length-1]);
			res.send({errcode:0,errmsg:"success",data:strArr[strArr.length-1]});
		}
		
	});
});



module.exports = router;