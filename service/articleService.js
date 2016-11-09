var httprequest = require('../utils/httprequest');
var async = require('async');

var makedown = require('../utils/makedown');
var commonUtil = require('../utils/commonUtil');

//定义一个类
function ArticleService(){

}

//添加一个public方法,处理目录相关
ArticleService.prototype.getAllArticleList = function(func, opts){
	//并行执行一些请求
	async.parallel({
			tags:getAllTag,
			subjects:getAllSubject,
			catalogs:function(done){
				getCatalog(opts, done);
			},
			pageInfo: function(done){
				getPageCount(opts, done);
			},
			crumb: function(done){
				getCrumbs(opts, done);
			}
		},func);

};

//添加一个public方法，处理详情页
ArticleService.prototype.getArticleDetail = function(func, opts){
	//并行执行一些请求
	async.parallel({
			tags:getAllTag,
			subjects:getAllSubject,
			detail: function(done){
				readTimeAdd(opts.articleId);
				getDetail(opts, done);
			}
		},func);

};

//添加一个public方法，处理详情页
ArticleService.prototype.getSearchArticleList = function(func, opts){
	//并行执行一些请求
	async.parallel({
			tags:getAllTag,
			subjects:getAllSubject,
			catalogs:function(done){
				getSearchCatalog(opts, done);
			},
			pageInfo:function(done) {
				done(null,{
					nowPage:1,
					pageCount:1
				});
			},
			crumb: function(done){
				done(null,{crumb:"搜索："+opts.wd});
			}
		},func);
};

//获取tag标签的私有方法
function getAllTag(done){
	httprequest.get("tag/getAll", function(data){
		if(data.errcode===0){
			done(null, data.data); //done(err,data)，用于传递回调数据
		} else {
			done("getAllTag", data); //done(err,data)，用于传递回调数据
		}
	});
}

//获取subject主题的私有方法
function getAllSubject(done){
	httprequest.get("subject/getAll", function(data){
		// console.log(data);
		if(data.errcode===0){
			done(null, data.data); //done(err,data)，用于传递回调数据
		} else {
			done("getAllSubject", data); //done(err,data)，用于传递回调数据
		}
	});
}

//获取目录的私有方法
function getCatalog(opts, done){

	var form = {};

	if(opts.tagId){
		form.tagId = opts.tagId;
	}

	if(opts.subjectId){
		form.subjectId = opts.subjectId;
	}


	httprequest.post("article/getCatalog",form , function(data){

		if(data.errcode===0 && data.data){
			var catalogs = data.data;
			
			//处理摘要数据
			for(var i=0; i<catalogs.length; i++){
				var catalog = catalogs[i];
				catalog.digest = commonUtil.innerHTML(makedown(catalog.digest));
			}

			done(null, catalogs); //done(err,data)，用于传递回调数据
		} else {
			done('error', data);
		}
	});
}

//获取总页数
function getPageCount(opts, done){
	var form = {};


	if(opts.tagId){
		form.tagId = opts.tagId;
	}

	if(opts.subjectId){
		form.subjectId = opts.subjectId;
	}


	httprequest.post("page/count", form, function(data){
		if(data.errcode===0){
			done(null, {
				pageCount :data.data,
				nowPage: opts.nowPage
			});
		} else {
			done("getPageCount",data);
		}
	});


}

//获取总面包屑导航
function getCrumbs(opts, done){
	var form = {};

	if(opts.tagId){
		form.tagId = opts.tagId;
	}

	if(opts.subjectId){
		form.subjectId = opts.subjectId;
	}

	httprequest.post("getCrumbs", form, function(data){
		if(data.errcode===0){
			// console.log(data);
			done(null, data.data);
		} else {
			done("getCrumbs", data);
		}
	});


}

//获取总面包屑导航
function getDetail(opts, done){
	var form = {};

	if(opts.articleId){
		form.articleId = opts.articleId;
	}

	httprequest.post("article/getDetail", form, function(data){
		if(data.errcode===0){
			done(null, data.data);
		} else {
			done("getDetail", data);
		}
	});
}


//获取搜索列表
function getSearchCatalog(opts, done){

	var form = {
		wd: opts.wd
	};


	httprequest.post("article/getSearchCatalog",form , function(data){
		if( data.errcode===0 && data.data){
			var catalogs = data.data;
			
			//处理摘要数据
			for(var i=0; i<catalogs.length; i++){
				var catalog = catalogs[i];
				catalog.digest = commonUtil.innerHTML(makedown(catalog.digest));
			}

			done(null, catalogs); //done(err,data)，用于传递回调数据
		} else {
			done('error', data);
		}
	});
}

//
function readTimeAdd(id){
	httprequest.post("article/readTimesAdd",{articleId: id} , function(data){
		//console.log(data);
	});

}

module.exports = ArticleService;