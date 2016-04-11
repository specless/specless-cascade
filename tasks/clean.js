var gulp = require('gulp');
var utils = require('../js/utils.js');
var clean = require('gulp-clean');
var cascade = utils.get('cascadeSettings');

gulp.task('clean', function () {
	utils.setCurrentProject('default');
	return gulp.src(cascade.buildDir, {read: false})
		.pipe(clean());
});