var $ = require('jquery');
var page = require('page');
var Dom = require('./dom');
require('./templates/home');

// Extender lenguajes

var Features = require('./features');
var features = new Features();

$(document).ready(function () {
	var dom = new Dom();

	// Listeners

	dom.iconFolder.on('click', features.activeFolders);

	dom.iconFile.on('dblclick', features.openFile);

	dom.iconCross.on('click', features.closeFile);


});

page();
