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

Features.prototype.addCode = function(codeText, language) {

	var html = Prism.highlight(codeText, Prism.languages[language]);

	$('code')
		.html(html);
};

Features.prototype.activeTab = function(event) {
	event.preventDefault();
	event.stopPropagation();

	var dom = new DomElements(event);

	// Activar y desactivar pestañas cuando hacemos click en ellas
	dom.element
		.removeClass(normal)
		.addClass(active)
		.siblings()
		.removeClass(active)
		.addClass(normal);

	// Añadir el código correspondiente al cuerpo
	var file = dom.element.text();
	var fileName = file.split('.')[0];
	var fileExt = file.split('.')[1];
	var code = codes[fileName];
	var language = dom.getLanguage(fileExt);

	features.addCode(code, language);

};

Features.prototype.getNewDom = function(event) {
	event = event || {};
	return new DomElements(event);
};

Features.prototype.listenTabs = function() {
	var newDom = features.getNewDom();
	newDom.tab.on('click', features.activeTab);
};

Features.prototype.listenReclosableElements = function () {
	var newDom = new DomElements(event);

	// Activar y desactivar las pestañas cuando abrimos un archivo
	$('.tab')
		.last()
		.siblings()
		.removeClass(active)
		.addClass(normal);

	newDom.iconCross.on('click', features.closeFile);
}

Features.prototype.openFile = function(event) {
	event.preventDefault();
	event.stopPropagation();
	// Elementos del dom cuando se activa esta función
	var dom = new DomElements(event);

	// Iteración sobre los archivos abiertos
	var opened = dom.openFiles.some(function (element) {
		return $(element).text() === dom.file;
	});

	// Algoritmo para cuando se abren archivos
	if(!opened){
		
		var codeText = codes[dom.fileName];
		var language = dom.getLanguage();

		// Sidebar Open Files

		dom.openFilesList
			.append(openFilesTemplate({file: dom.file}))
			.promise()
			.done(features.listenReclosableElements);

		// Code

		features.addCode(codeText, language);
		
		// Tabs

		dom.tabList
			.append(tabsTemplate({file: dom.file}))
			.promise()
			.then(features.listenReclosableElements)
			.done(features.listenTabs);
	}
};

Features.prototype.closeFile = function(event) {

	// El Dom en el estado actual
	var dom = new DomElements(event);

	// Filtro de elementos que van a cerrarse
	var filter = dom.reclosables.filter(function (element) {
		return $(element).text() === dom.file;
	});

	// Eliminación de esos elementos
	$(filter).each(function (index, element) {
		$(element).remove();
	});

	/* Algoritmo que resuelve el estado de las pestañas
	 al cerrar un archivo */
	dom.tab.each(function (index, element) {
		if($(element).text() === dom.file){
			var prev = dom.tab.get(index - 1);

			if(dom.tab.length === 1){
				$('code').contents().remove();
			} else if($(element).hasClass(active) && $(prev).hasClass(normal)) {
				$(prev)
					.removeClass(normal)
					.addClass(active);

				// Añadir el código correspondiente al cuerpo
				var file = $(prev).text();
				var fileName = file.split('.')[0];
				var fileExt = file.split('.')[1];
				var code = codes[fileName];
				var language = dom.getLanguage(fileExt);

				features.addCode(code, language); 

			}
		}
	})



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