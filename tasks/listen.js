var gulp = require('gulp');
var utils = require('../js/utils.js');
var _ = require('underscore');

gulp.task('listen', ['build'], function () {
	var projectFolder = utils.currentProject();
	var cascade = utils.get('cascadeSettings');
	var settings = utils.get('projectSettings');

	var htmlFiles = [projectFolder + '/**/' + cascade.html.fileName];
	var cssFiles = [projectFolder + '/**/' + cascade.css.fileName];
	var jsFiles = [projectFolder + '/**/' + cascade.js.fileName];

	gulp.watch(htmlFiles, ['html']);
	gulp.watch(cssFiles, ['css']);
	gulp.watch(jsFiles, ['js']);

});