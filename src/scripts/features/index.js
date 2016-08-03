var $ = require('jquery');
var DomElements = require('../dom');
var openFilesTemplate = require('../templates/open-files.jade');
var tabsTemplate = require('../templates/tabs.jade');
var codes = require('../templates/codes');
var Prism = require('../prism');

function Features (event) {
	event = event || {};
}

var features = new Features();
var active = 'body-content--nav__tabActive';
var normal = 'body-content--nav__tab';

Features.prototype.getNewDom = function(event) {
	event = event || {};
	return new DomElements(event);
};

// Acciones cuando ocurre un evento
Features.prototype.addCode = function(file) {
	var dom = this.getNewDom()
	var fileAtr = dom.getFileAtr(file);
	var codeText = codes[dom.getCode(file)];
	var language = dom.getLanguage(fileAtr.fileExt);
	
	if(language === 'unknown'){
		$('code')
			.removeClass()
			.html(codeText);
	} else {

		var html = Prism.highlight(codeText, Prism.languages[language]);

		$('code')
			.removeClass()
			.addClass('language-'+ language)
			.html(html);

		var env = {
			code: html,
			element: $('code').get()[0]
		}

		Prism.hooks.run('complete', env);
	}


};


// Activar y desactivar las pestañas cuando abrimos un archivo
Features.prototype.activeTab = function() {
	$('.tab')
		.last()
		.siblings()
		.removeClass(active)
		.addClass(normal);
};

// Cambia de pestaña activa y de código cuando selecionas otro archivo
Features.prototype.changeTab = function(event, file) {
	event.preventDefault();
	event.stopPropagation();

	var dom = new DomElements(event);

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

	features.addCode(file);

};

Features.prototype.filesPreview = function(event) {
	event.preventDefault();
	event.stopPropagation();

	var dom = features.getNewDom(event);
	var file = dom.getFile(dom.element);

  if(dom.tab.length > 1){
  	features.changeTab(event, file);
  }

	features.addCode(file);
};

// Escuchar los eventos de los nuevos elementos del Dom
Features.prototype.listenOpenFiles = function() {
	var newDom = features.getNewDom();
	newDom.openFiles.on('click', features.changeTab);
};

Features.prototype.listenFiles = function() {
	var newDom = features.getNewDom();
	newDom.files.on('click', newDom.iconFilesClass ,features.filesPreview);
	newDom.$files.on('click', newDom.iconFilesClass ,features.filesPreview);
};

Features.prototype.listenTabs = function() {
	var newDom = features.getNewDom();
	newDom.tab.on('click', features.changeTab);
};


Features.prototype.listenReclosableElements = function () {
	var newDom = new DomElements();
	newDom.iconCross.on('click', features.closeFile);
}

Features.prototype.openFile = function(event) {
	event.preventDefault();
	event.stopPropagation();

	// Elementos del dom cuando se activa esta función
	var dom = new DomElements(event);

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
			.done(features.listenReclosableElements)
			.done(features.listenFiles)
			.done(features.listenOpenFiles);

		// Code

		features.addCode(file);
		
		// Tabs

		dom.tabList
			.append(tabsTemplate({file: file}))
			.promise()
			.done(features.activeTab)
			.done(features.listenReclosableElements)
			.done(features.listenTabs);
	}
};

Features.prototype.closeFile = function(event) {

	// El Dom en el estado actual
	var dom = new DomElements(event);

	// Filtro de elementos que van a cerrarse
	var filter = dom.reclosables.filter(function (element) {
		return $(element).text() === dom.$file;
	});

	// Eliminación de esos elementos
	$(filter).each(function (index, element) {
		$(element).remove();
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

				features.addCode(file); 

			}
		}
	});

};

Features.prototype.activeFolders = function(event) {
	var dom = new DomElements(event);
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
};

module.exports =  Features;