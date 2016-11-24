
var $ = require('jquery');
var Dom = require('../dom');
var openFilesTemplate = require('../templates/open-files.jade');
var tabsTemplate = require('../templates/tabs.jade');
var codes = require('../templates/codes');
var Prism = require('../prism');

var active = 'body-content--nav__tabActive';
var normal = 'body-content--nav__tab';

var getNewDom = function(event) {
	event = event || {};
	return new Dom(event);
}

var activeFolders = function (event) {
	var dom = getNewDom(event);
	dom.element.siblings().toggle();

	if(dom.element.hasClass('icon-folder-open')) {
		dom.element
			.removeClass('icon-folder-open')
			.addClass('icon-folder');
	} else {
		dom.element
			.removeClass('icon-folder')
			.addClass('icon-folder-open');
	}
}

// Activar y desactivar las pestañas cuando abrimos un archivo
var activeTab = function() {
	$('.tab')
		.last()
		.siblings()
		.removeClass(active)
		.addClass(normal);
};


// Acciones cuando ocurre un evento
var	addCode = function(file) {
	var dom = getNewDom();
	var fileAtr = dom.getFileAtr(file);
	var codeText = codes[dom.getCode(file)];
	var language = dom.getLanguage(fileAtr.fileExt);
	
	if(language === 'unknown'){
		$('code')
			.removeClass()
			.html(codeText);

		$('.footer-lang')
			.text('unknown')
			.promise()
			.done(function () {
				localStorage.dom = $('.container').html()
			})

		var env = {
			code: codeText,
			element: $('code').get()[0]
		}

		Prism.hooks.run('complete', env);

	} else {

		var html = Prism.highlight(codeText, Prism.languages[language]);

		$('code')
			.removeClass()
			.addClass('language-'+ language)
			.html(html);

		$('.footer-lang')
			.text(language)
			.promise()
			.done(function () {
				localStorage.dom = $('.container').html()
			})

		var env = {
			code: html,
			element: $('code').get()[0]
		}

		Prism.hooks.run('complete', env);
	}
};

// Cambia de pestaña activa y de código cuando selecionas otro archivo
var	changeTab = function (event, file) {
	event.preventDefault();
	event.stopPropagation();

	var dom = getNewDom(event);

	file = file || dom.file;

	dom.tab.each(function (index, element) {
  		if($(element).text() === file){
  			$(element)
  				.removeClass(normal)
					.addClass(active)
					.siblings()
					.removeClass(active)
					.addClass(normal);
  		}
  });

	// Añadir el código correspondiente al cuerpo

	addCode(file);

}

var filesPreview = function(event) {
	event.preventDefault();
	event.stopPropagation();

	var dom = getNewDom(event);
	var file = dom.getFile(dom.element);

  if(dom.tab.length > 1){
  	changeTab(event, file);
  }

	addCode(file);
}

var openFile = function(event) {
	event.preventDefault();
	event.stopPropagation();

	// Elementos del dom cuando se activa esta función
	var dom = getNewDom(event);

	var	file = dom.getFile(dom.element);

	// Iteración sobre los archivos abiertos
	var opened = dom.openFilesArray.some(function (element) {
		return $(element).text() === file;
	});

	// Algoritmo para cuando se abren archivos
	if(!opened){

		// Sidebar Open Files

		dom.openFilesList
			.append(openFilesTemplate({file: file}))
			.promise()
			.done(function () {
				var newDom = new Dom();
				newDom.iconCross.on('click', closeFile);
				newDom.$files.on('dblclick', newDom.iconFilesClass, openFile);
				newDom.files.on('dblclick', newDom.iconFilesClass, openFile);
				newDom.files.on('click', newDom.iconFilesClass, filesPreview);
				newDom.$files.on('click', newDom.iconFilesClass, filesPreview);
				newDom.openFiles.on('click', changeTab);
			})

		// Code

		addCode(file);
		
		// Tabs

		dom.tabList
			.append(tabsTemplate({file: file}))
			.promise()
			.done(activeTab)
			.done(function () {
				var newDom = new Dom();
				newDom.tab.on('click', changeTab);
				newDom.iconCross.on('click', closeFile);
			})
	}
}

var closeFile = function(event) {

	// El Dom en el estado actual
	var dom = getNewDom(event);

	// Filtro de elementos que van a cerrarse
	var filter = dom.reclosables.filter(function (element) {
		return $(element).text() === dom.$file;
	});

	// Eliminación de esos elementos
	$(filter).each(function (index, element) {
		$(element).remove()
	});

	/* Algoritmo que resuelve el estado de las pestañas
	 al cerrar un archivo */
	dom.tab.each(function (index, element) {
		if($(element).text() === dom.$file){
			var prev = dom.tab.get(index - 1);

			if(dom.tab.length === 1){
				$('code').contents().remove();
			} else if($(element).hasClass(active) && $(prev).hasClass(normal)) {
				$(prev)
					.removeClass(normal)
					.addClass(active);

				// Añadir el código correspondiente al cuerpo
				var file = $(prev).text();

				addCode(file); 
			}
		}
	});
}

module.exports = {
	filesPreview: filesPreview,
	openFile: openFile,
	closeFile: closeFile,
	activeFolders: activeFolders,
	changeTab : changeTab
}






