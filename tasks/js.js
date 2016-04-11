var gulp = require('gulp');
var _ = require('underscore');
var plumber = require('gulp-plumber');
var utils = require('../js/utils.js');

gulp.task('js', function () {
	var cascade = utils.get('cascadeSettings');
	var settings = utils.get('projectSettings');
	var glob = [settings.path + '/**/' + cascade.js.fileName, '!' + settings.path + '/{' + cascade.assetsDirName + ',' + cascade.assetsDirName + '/**}'];
	
	return gulp.src(glob)
		.pipe(plumber({
    		errorHandler: function(error) {
    			utils.logError("There was an error compiling your javascript!", error.message);
    		}
    	}))
        .pipe(gulp.dest(cascade.buildDir));
});