var express = require('express');
var router = express.Router();
var ArticleService = require("../service/articleService");
//var makedown = require('../utils/makedown');
//var commonUtil = require('../utils/commonUtil');



var articleService = new ArticleService();

/* 全部文章第一页. */
router.get('/', function(req, res, next) {


	articleService.getAllArticleList(function(err,data){
		if(err){
			res.render('error');	//文章列表首页
		} else {
			//console.log(data);
			//console.log(data.pageInfo);
			
			data.path = "/article/page/";
			res.render('article',data);	//文章列表首页
		}
	},{
		nowPage:1
	});
	
});

/* 全部文章n页 */
router.get('/page/:page', function(req, res, next) {

	articleService.getAllArticleList(function(err,data){
		if(err){
			res.render('error');	//文章列表首页
		} else {
			console.log(data.pageInfo);
			data.path = "/article/page/";
			res.render('article',data);	//文章列表首页
		}
	},{
		nowPage:req.params.page
	});
});

/* 标签下的文章 1页*/
router.get('/tag/:id', function(req, res, next) {

	articleService.getAllArticleList(function(err,data){
		if(err){
			res.render('error');	//文章列表首页
		} else {
			//console.log(data.crumb);
			data.path = "/article/tag/"+ req.params.id +"/";
			res.render('article',data);	//文章列表首页
		}
	},{
		nowPage:1,
		tagId:req.params.id
	});
});

/* 标签下的文章 n页 */
router.get('/tag/:id/page/:page', function(req, res, next) {

			//console.log(req.params.page);


	articleService.getAllArticleList(function(err,data){
		if(err){
			res.render('error');	//文章列表首页
		} else {
			//console.log(data.pageInfo);
			data.path = "/article/tag/"+ req.params.id +"/";
			res.render('article',data);	//文章列表首页
		}
	},{
		nowPage:req.params.page,
		tagId:req.params.id
	});
});

/* 主题下的文章1页 */
router.get('/subject/:id', function(req, res, next) {

	articleService.getAllArticleList(function(err,data){
		if(err){
			res.render('error');	//文章列表首页
		} else {
		//	console.log(data.pageInfo);
			data.path = "/article/subject/" + req.params.id +"/";
			res.render('article',data);	//文章列表首页
		}
	},{
		nowPage:1,
		subjectId:req.params.id
	});
});


/* 主题下的文章n页 */
router.get('/subject/:id/page/:page', function(req, res, next) {

	articleService.getAllArticleList(function(err,data){
		if(err){
			res.render('error');	//文章列表首页
		} else {
		//	console.log(data.pageInfo);
			data.path = "/article/subject/" + req.params.id +"/";
			res.render('article',data);	//文章列表首页
		}
	},{
		nowPage:req.params.page,
		subjectId:req.params.id
	});
});

/*搜索页面*/
router.get('/search/', function(req, res, next) {

	articleService.getSearchArticleList(function(err,data){

		if(!req.query.wd){
			res.render('error');	//文章列表首页
		}

		if(err){
			res.render('error');	//文章列表首页
		} else {
			//console.log(data.crumb);
			
			data.path = "/article/page/";
			res.render('article',data);	//文章列表首页
		}
	},{
		wd: req.query.wd
	});

});






module.exports = router;
