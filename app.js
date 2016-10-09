//-------引入运行时依赖--------
var express = require('express');	//webserver容器api
var path = require('path');	//处理文件路径问题
var favicon = require('serve-favicon');	//处理网站logo
var logger = require('morgan');	//自动刷新重启服务
var cookieParser = require('cookie-parser');	
var bodyParser = require('body-parser');
var template = require('art-template');	//模板插件
//-----------------------------

//--------自定义路由-----------
var routes = require('./routes/index');
var users = require('./routes/users');

//-----------------------------

var app = express();	//获取api的接口

//设置模板引擎
template.config('extname', '.html');	//设置模板后缀名
app.engine('.html', template.__express);	
app.set('view engine', 'html');
app.set('views', __dirname + '/views');	//注册模板的目录位置，默认为__dirname + 'views'

app.use(logger('dev'));	//开发者模式使用日志记录

app.use(bodyParser.json());	//将请求体转为json
app.use(bodyParser.urlencoded({ extended: false }));	//？？
app.use(cookieParser());	//cookie解析



//设置开发者模式，默认为开发者模式
//windows下： cmd输入set NODE_ENV=development
// 通过NODE_ENV可以来设置环境变量（默认值为development）。 一般我们通过检查这个值来分别对开发环境和生产环境下做不同的处理。
// 可以在命令行中通过下面的方式设置这个值：
// linux & mac: export NODE_ENV=production
// windows:set NODE_ENV=production

if(app.get('env') === 'production'){
	console.log('进入了生产模式');
	app.use(express.static(path.join(__dirname, '/public')));	//设定静态文件目录
	app.set('views', __dirname + '/views');	//注册模板的目录位置，默认为__dirname + 'views'
} else if(app.get('env') === 'development') {
//配置调试环境
	console.log('进入了开发者模式');
	app.use('/js', express.static(path.join(__dirname, '/.tmp/js')));
	app.use('/css', express.static(path.join(__dirname, '/.tmp/css')));
	app.use('/img', express.static(path.join(__dirname, '/app/img')));
	app.use('/fonts', express.static(path.join(__dirname, '/.tmp/fonts')));
	app.use('/bower_components',express.static(path.join(__dirname, '/bower_components')));

	app.set('views', __dirname + '/app');	//注册模板的目录位置，默认为__dirname + 'views'
}

//-------转入路由---------
app.use('/', routes);

//------------------------



//调用前设置
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		// res.render('error', {
		// 	message: err.message,
		// 	error: err
		// });
	});
}


//TODO 错误处理

app.listen(3000);
module.exports = app;







