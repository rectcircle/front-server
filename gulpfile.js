var gulp = require('gulp');	//引入gulp核心
var gulpLoadPlugins = require('gulp-load-plugins');		//引入插件加载器
var browserSync = require('browser-sync').create();	//浏览器实时响应变更测试
var del = require('del');	//引入删除插件
var wiredep = require('wiredep').stream;	//引入bower依赖
var runSequence = require('run-sequence');	//引入顺序执行任务插件

var $ = gulpLoadPlugins();	//执行加载插件，加载所有插件返回一个{}
var reload = browserSync.reload;

var cdnPrefix = "";  //给html引用添加cdn前缀

//定义一个task,处理css编译生成
gulp.task('css',function(){ //es6写法相当于无参数匿名函数
	return gulp.src('app/css/{,*/}*.scss')	//返回一个stream对象且，向下扫描两层目录
		.pipe($.plumber())	//添加错误处理模块
		.pipe($.sourcemaps.init())	//初始化sourcemap
		.pipe($.sass.sync({	//使用sass插件对对象进行编译
			outputStyle: 'expanded',	//配置sass输出样式expanded：展开，nested：嵌套，compact：紧凑，compressed：压缩
			precision: 10,	//？？
			includePaths: ['.']	//包含路径
		}).on('error', $.sass.logError))
		.pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))	//添加浏览器私有前缀
		.pipe($.sourcemaps.write())	//写出map
		.pipe(gulp.dest('.tmp/css'))	//将流对象输出到文件夹内
		.pipe(reload({stream: true}))
	;
});

//处理js
gulp.task('js',function () {	
	return gulp.src('app/js/{,*/}*.js',{})
		.pipe($.plumber())
		.pipe($.sourcemaps.init())  //初始化生成js 调试map文件
//		.pipe($.babel({presets: ['es2015']}))	//处理es6转换为es5否则压缩将会出错，且浏览器兼容有问题
		.pipe($.babel())	//读取.babelrc配置文件，对es6转换为es5
		.pipe($.sourcemaps.write('.'))  //输出map文件
		.pipe(gulp.dest('.tmp/js'))
		.pipe(reload({stream: true}))
	;

});

//处理图片
gulp.task('img', function() {
  return gulp.src('app/img/{,*/}*')
    .pipe($.cache($.imagemin()))  //压缩图片
    .pipe(gulp.dest('public/img'))
    ;
});

//font处理拷贝
gulp.task('fonts', function() {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
      .concat('app/fonts/**/*'))  //？TODO
      .pipe(gulp.dest('.tmp/fonts')) 
      .pipe(gulp.dest('public/fonts'))
      ;
});

//将app根目录的非html文件直接复制到发布目录
gulp.task('extras', function() {
  return gulp.src(['app/*', '!app/*.html'], {dot: true})
    .pipe(gulp.dest('public'));
});

//清空发布和临时目录
gulp.task('clean', del.bind(null, ['.tmp', 'public', 'views']));

//前置任务处理css、js并行
//处理html
gulp.task('html', ['css', 'js'], function () {	
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))	//扫描、合并、更改引用、输出到文件流
    .pipe($.if('*.js', $.uglify()))	//if是js文件，使用uglify压缩
    .pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))	//使用cssnano压缩
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))	//htmlmin压缩html
//...
  	.pipe($.if('!*.html', $.rev()))	//对非html文件进行MD5算法
  	.pipe($.revReplace())
//...
    .pipe($.if('!*.html', gulp.dest('public')))	//非html输出到public目录
    .pipe($.if('*.html', $.prefix(cdnPrefix, null, '{{')))  //给引用的静态资源添加前缀
    .pipe($.if('*.html', gulp.dest('views')))	//html输出到views
	;	
});

//处理bower依赖
gulp.task('wiredep', function() {
	gulp.src('app/*.html')
	.pipe(wiredep({
		optional: 'configuration',
    	goes: 'here'
	}))
	.pipe(gulp.dest('app/'));
});

//校验js函数
function lint(files, options) {
  return gulp.src(files)
    .pipe(reload({stream: true, once: true}))
    .pipe($.eslint(options))
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
}

//校验js文件
gulp.task('lint', function() {
  return lint(['app/js/**/*.js','service/**/*.js','routes/**/*.js'], {
    fix: true
  })
    .pipe(gulp.dest('app/js'));
});

//校验js测试文件
gulp.task('lint:test', function() {
  return lint('test/spec/**/*.js', {
    fix: true,
    env: {
      mocha: true
    }
  })
    .pipe(gulp.dest('test/spec'));
});

//开启nodejs服务器并自动检测文件变化并重启
function startServer(cb, NODE_ENV){
	var started = false;

  return $.nodemon({
    script: 'app.js', //入口文件
    ext: 'js html css json',  //检测文件的后缀
    verbose: true,
    env:{
        "NODE_ENV":NODE_ENV, //  env： 是开发环境; 运行环境 development; production 是生产环境
        "PORT":"3000"
    }
  }).on('start', function() {
    if (!started) {
      cb();
      started = true;
    }
  });
}

//开启页面开发者的node服务器
gulp.task('nodemon', function(cb) {
  return startServer(cb, "development");
});

//开启发布的node服务器
gulp.task('nodemon:dist', function(cb) {
  return startServer(cb, "production");
});

//启动测试服务器监视文件变化并实时展示
gulp.task('serve', function() {
	//顺序执行
	runSequence(['clean', 'wiredep'], ['html', 'fonts','img'],['nodemon'], function() {
		browserSync.init({
			notify: false,
			port: 9000,
			proxy: 'http://localhost:3000'

		});

		gulp.watch([
			'app/*.html',
			'app/img/**/*',
			'.tmp/fonts/**/*'
			]).on('change', function(){
				setTimeout(reload,1000);
			});

		gulp.watch('app/css/**/*.scss', ['css']);
		gulp.watch('app/js/**/*.js', ['js']);
		gulp.watch('app/fonts/**/*', ['fonts']);
		gulp.watch('bower.json', ['wiredep', 'fonts']);

	});
});

//测试开启发布服务器
gulp.task('serve:dist', ["nodemon:dist"],function() {
	browserSync.init({
		notify: false,
		port: 9000,
		proxy: 'http://localhost:3000'
	});
});

//启动js单元测试
gulp.task('serve:test', ['js'], function() {
  browserSync.init({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/js': '.tmp/js',
        '/bower_components': 'bower_components'
      }
    }
  });

  gulp.watch('app/scripts/**/*.js', ['js']);
  gulp.watch(['test/spec/**/*.js', 'test/index.html']).on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

//构建
gulp.task('build', ['lint', 'html', 'img', 'fonts', 'extras'], function() {
	return gulp.src(['public/**/*','views']).pipe($.size({title: 'build', gzip: true}));
});

//缺省任务
gulp.task('default', function() {
  runSequence(['clean', 'wiredep'], 'build');
});

//TODO 编写此文档的说明