var express = require('express');
var httpRequest = require('../utils/httprequest');

var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('admin');	//文章列表首页
});

router.post('/:action', function(req, res, next) {
	httpRequest.proxy("admin/"+req.params.action, req,res);
	// res.send(req.params.action);
});

router.post('/article/:action', function(req, res, next) {
	httpRequest.proxy("admin/article/"+req.params.action, req,res);
	// res.send(req.params.action);
});

router.post('/subject/:action', function(req, res, next) {
	httpRequest.proxy("admin/subject/"+req.params.action, req,res);
	// res.send(req.params.action);
});

router.post('/tag/:action', function(req, res, next) {
	httpRequest.proxy("admin/tag/"+req.params.action, req,res);
	// res.send(req.params.action);
});


module.exports = router;
