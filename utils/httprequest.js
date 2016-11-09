var request = require('request');

var config = require('../config/config.js');

/**
 *
 * http代理请求
 * 
 */

var errData = {
	errcode : 50000,
	errmsg : "后端服务错误"
};

function proxy(path, userReq, userRes){
	
	/**
	 * 处理java的sessionid的路径问题
	 */
	function handCookie(cookies){
		var resArr = [], cookie;
		for(var i=0; i<cookies.length; i++){
			cookie = cookies[i];
			if(cookie.indexOf("JSESSIONID")!==-1){ //是java的sessionid
				//处理path的值
				cookie = cookie.replace(/Path.+?; /i,"/");
			} 
			resArr.push(cookie);
		}
		return resArr;
	}

	/**
	 * 配置选项
	 */
	var opts = {
		method: 'POST',
		url: config.baseUrl + path,
		headers: {
			Cookie: userReq.headers.cookie, //传递用户cookie
			'content-type': 'application/json',
		},
		form: userReq.body
		//jar: true
	};

	/**
	 * 执行请求
	 */
	request(opts, function(err, res, body){

		if(!err){
			userRes.setHeader("Content-Type", "application/json");
			if(res && res.headers && res.headers['set-cookie']){
				userRes.setHeader('set-cookie', handCookie(res.headers['set-cookie']));

			} 
			if(body){
				userRes.send(body);
			}
		} else {
			userRes.send(errData);
		}

		
	});
}

function post(path, data, func){
	/**
	 * 配置选项
	 */
	var opts = {
		method: 'POST',
		url: config.baseUrl + path,
		json: true
	};

	if(data){
		opts.form = data;
	}

	/**
	 * 执行请求
	 */
	request(opts, function(err, res, body){
		if(err){
			func({errcode:50000, errmsg: "后端服务器请求错误", data: err});
		} else {
			func(body);
		}
	});
}

function get(path, func){
	/**
	 * 配置选项
	 */
	var opts = {
		method: 'GET',
		url: config.baseUrl + path,
		json: true
	};

	/**
	 * 执行请求
	 */
	request(opts, function(err, res, body){
		if(err){
			func({errcode:50000, errmsg: "后端服务器请求错误", data: err});
		} else {
			func(body);
		}
	});
}

module.exports = {
	proxy: proxy,
	post: post,
	get: get
};







