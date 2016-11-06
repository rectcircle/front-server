var express = require('express');

var rf=require("fs");  
var router = express.Router();

var ArticleService = require("../service/articleService");
var makedown = require('../utils/makedown');
var commonUtil = require('../utils/commonUtil');



var articleService = new ArticleService();

/* GET home page. */
router.get('/', function(req, res, next) {

	res.render('error');

	var contentdata=rf.readFileSync(__dirname+"/../simulatedata/detail.md","utf-8");
	//读取测试数据

	var html = makedown(contentdata);

	//console.log(makedown(contentdata));

	var testData = {
		content:html
	};

	res.render('detail', testData);	//文章列表首页
});


router.get('/:id', function(req, res, next) {


	articleService.getArticleDetail(function(err,data){
		if(err){
			res.render('error');	//文章列表首页
		} else {
			//console.log(data.detail);
			data.detail.content = makedown(data.detail.content);
			
			data.path = "/article/page/";
			res.render('detail',data);	//文章列表首页
		}
	},{
		articleId:req.params.id
	});
	
});

module.exports = router;
