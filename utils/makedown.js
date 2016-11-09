var marked = require('marked');

var renderer = new marked.Renderer();

renderer.code = function(code, lang) {
	var language = lang && (' language-' + lang) || 'language-none';
	return '<pre class="' + language + ' line-numbers">'+ 
		'<code>' + code.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code>'+ 
	'</pre>';
};

renderer.table = function (header, body) {
	return '<table class="table table-striped">'+header+body+'</table>';
};

renderer.link = function (href, title, text) {
	
	var name ="";

	if(href.indexOf('#')!==0 ){
		name = text || "";
	}


	if(!text){
		text = href;
	}

	var result = '<a href="'+href+'" '; //拼接链接的href
	
	if(name!==""){ //拼接name
		result += 'name="'+ name +'" ';
	}

	if(title){ //存在title，将拼接title
		result += 'title="'+ title +'"';
	}

	result += '>'+ text +'</a>'; //闭合标签并拼接文本

	return result;

};

marked.setOptions({
	renderer: renderer,
	gfm: true,
	tables: true,
	breaks: true,
	pedantic: false,
	sanitize: false,
	smartLists: true
});

module.exports = marked;

