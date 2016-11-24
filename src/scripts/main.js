var $ = require('jquery');

var code = require('./templates/codes/');
var Prism = require('./prism');
var template = require('./templates/layout.jade');
var Dom = require('./dom')
var features = require('./features');

var defaultLocals = {
	file: 'index.html',
	lang: 'html'
};

if (localStorage.dom) {

	$('.container')
		.html(localStorage.dom);

} else {

	$('.container')
		.html(template(defaultLocals))
		.promise()
		.done(function () {
			var html = Prism.highlight(code.indexHTML, Prism.languages.markup);
			$('code')
				.addClass('language-markup')
				.html(html);
	});
}

$(document).ready(function () {
	
	var dom = new Dom();

	dom.iconFolder.on('click', features.activeFolders)
	dom.files.on('click', dom.iconFilesClass ,features.filesPreview);
	dom.$files.on('click', dom.iconFilesClass ,features.filesPreview);
	dom.$files.on('dblclick', dom.iconFilesClass, features.openFile);
	dom.files.on('dblclick', dom.iconFilesClass, features.openFile);
	dom.tab.on('click', features.changeTab);
	dom.openFiles.on('click', features.changeTab);
	dom.iconCross.on('click', features.closeFile);
	
})


