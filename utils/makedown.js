var marked = require('marked');

var renderer = new marked.Renderer();

renderer.code = function(code, lang) {
	var language = lang && (' language-' + lang) || '';
	return '<pre class="' + language + ' line-numbers">'+ 
		'<code>' + code.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code>'+ 
	'</pre>';
};

renderer.table = function (header, body) {
	return '<table class="table table-striped">'+header+body+'</table>';
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

