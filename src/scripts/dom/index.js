var $ = require('jquery');

function DomElements (event) {
	event = event || {};
	this.element = $(event.target);

	// Icons

	this.iconCross = $('span.icon-cross');
	this.iconFolder = $('span.icon-folder');
	this.iconFile = $('span.icon-file-text2');
	this.iconFileClass = 'span.icon-file-text2';
	
	// files

	this.openFiles = $('.sidebar-openFiles--file');
	this.openFilesArray = this.openFiles.toArray();
	this.openFilesList = $('.sidebar-openFiles--list');
	this.files = $('li.folder-open--file');
	this.$files = $('li.sidebar-folders--file');
	this.file = this.element.text();
	this.$file = this.element.parent().text();

	// Tabs

	this.tabList = $('.body-content--nav__list');
	this.tab = $('.tab');	

	// Filters

	this.$reclosables = this.iconCross.parent();
	this.reclosables = this.$reclosables.toArray();
}

DomElements.prototype.getLanguage = function(fileExt) {
	if(fileExt === 'md') {
		return 'markdown';
	} else if(fileExt === 'html') {
		return 'markup'
	} else {
		return fileExt;
	}
};

DomElements.prototype.getFileAtr = function(file) {
	return {
		fileName: file.split('.')[0],
		fileExt: file.split('.')[1]
	}
};

DomElements.prototype.getFile = function(element) {
	if(element.hasClass('folder-open--file') || element.hasClass('sidebar-folders--file')){
		return this.file;
	} else {
		return this.$file;
	}
};

DomElements.prototype.getCode = function(file) {
	var fileAtr = this.getFileAtr(file);
	return fileAtr.fileName + fileAtr.fileExt.toUpperCase();	
};

module.exports = DomElements;