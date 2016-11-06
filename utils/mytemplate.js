var template = require('art-template');	//模板插件
var templateNative = require('art-template/node/template-native.js')

template.config('extname', '.html');	//设置模板后缀名
templateNative.config('extname', '.html');	//设置模板后缀名

var defaults = template.defaults;
var rExtname;

// 提供新的配置字段
defaults.base = '';
defaults.extname = '.html';
defaults.encoding = 'utf-8';



module.exports = {
	__express: function (file, options, fn){
		if (typeof options === 'function') {
			fn = options;
			options = {};
		}


		if (!rExtname) {
			// 去掉 express 传入的路径
			rExtname = new RegExp((defaults.extname + '$').replace(/\./g, '\\.'));
		}


		file = file.replace(rExtname, '');

		options.filename = file;
		fn(null,templateNative.compile(template.renderFile(file, options))(options));
	}
};