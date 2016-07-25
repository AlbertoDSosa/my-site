var $ = require('jquery');
var page = require('page');
var homeTemplate = require('./home.jade');
var Prism = require('prismjs');
var code = require('./codes/');

// Home

var defaultLocals = {
	file: 'index.html'
}

function home () {
	$('.container')
	.html(homeTemplate(defaultLocals))
	.promise()
	.done(function () {
		var html = Prism.highlight(code.index, Prism.languages.markup);
		$('code')
			.addClass('language-markup')
			.html(html);
	});
}

page('/', home);

