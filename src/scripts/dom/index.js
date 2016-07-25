var $ = require('jquery');

function DomElements (event) {
	event = event || {};
	this.element = $(event.target);

	// Icons

	this.iconCross = $('span.icon-cross');
	this.iconFolder = $('span.icon-folder');
	this.iconFile = $('span.icon-file-text2');
	
	// files

	this.$openFiles = $('.sidebar-openFiles--file');
	this.openFilesList = $('.sidebar-openFiles--list');
	this.file = this.element.parent().text();
	this.openFiles = this.$openFiles.toArray();
	this.fileName = this.file.split('.')[0];
	this.fileExt = this.file.split('.')[1];

	// Tabs
	this.tabList = $('.body-content--nav__list');
	this.$tab = $('li.body-content--nav__tab');
	this.tab = $('.tab');
	

	// Filters

	this.$reclosables = this.iconCross.parent();
	this.reclosables = $.makeArray(this.$reclosables);
}

DomElements.prototype.getLanguage = function(fileExt) {
	fileExt = fileExt || this.fileExt;
	if(fileExt === 'md') {
		return 'markdown';
	} else if(fileExt === 'html') {
		return 'markup'
	} else {
		return fileExt;
	}
};

module.exports = DomElements;