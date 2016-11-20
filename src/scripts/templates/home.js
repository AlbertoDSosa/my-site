var $ = require('jquery');
var page = require('page');
var homeTemplate = require('./home.jade');
var Prism = require('../prism');
var code = require('./codes/');
var Dom = require('../dom');

// Home

var defaultLocals = {
	file: 'index.html',
	lang: 'html'
}

function home () {
	$('.container')
	.html(homeTemplate(defaultLocals))
	.promise()
	.done(function () {
		var html = Prism.highlight(code.indexHTML, Prism.languages.markup);
		$('code')
			.addClass('language-markup')
			.html(html);

	});

}

page('/', home);

