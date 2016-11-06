
function innerHTML(html){
	return html.replace(/<[^>]+>/gi, '');
}


module.exports = {
	innerHTML:innerHTML
};