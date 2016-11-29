var readmeMD = require('./readme.txt');
var packageJSON = require('./package.txt');
var gulpfileJS = require('./gulpfile.txt');
var index = require('./index.txt');
var indexHTML = require('./index-html.txt');
var indexJADE = require('./index-jade.txt');
var indexJS = require('./index-js.txt');
var mainCSS = require('./main-css.txt');
var mainJS = require('./main-js.txt');
var mainSTYL = require('./main-styl.txt');
var aboutMD = require('./about.txt');

module.exports = {
	index: index,
	indexHTML: indexHTML,
	indexJADE: indexJADE,
	indexJS: indexJS,
	readmeMD: readmeMD,
	packageJSON: packageJSON,
	gulpfileJS: gulpfileJS,
	mainCSS: mainCSS,
	mainJS: mainJS,
	mainSTYL: mainSTYL,
	aboutMD: aboutMD
}