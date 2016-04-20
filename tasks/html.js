var gulp = require('gulp');
var _ = require('underscore');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var utils = require('../js/utils.js');
var posthtml = require('gulp-posthtml');
var prettify = require('gulp-html-prettify');
var processHtml = require('../js/process-html.js');

gulp.task('html', function () {
	var cascade = utils.get('cascadeSettings');
	var settings = utils.get('projectSettings');
	var glob = [settings.path + '/**/' + cascade.html.fileName, '!' + settings.path + '/{' + cascade.assetsDirName + ',' + cascade.assetsDirName + '/**}'];
	
	var posthtmlOptions = {};

	return gulp.src(glob)
		.pipe(plumber({
    		errorHandler: function(error) {
    			utils.sendMessage("failure", error.message, 1);
    		}
    	}))
    	.pipe(rename(function (path) {
    		component = path.dirname;
		    path.basename = path.dirname;
		    path.dirname = '';
		}))
		.pipe(utils.markComponent('html'))
		.pipe(posthtml([
			require('../js/posthtml-ad-elements')()
		], posthtmlOptions))
		.pipe(processHtml())
		.pipe(prettify({indent_size: 4}))
        .pipe(gulp.dest(settings.path + '/' + cascade.buildDir));
});