var gulp = require('gulp');
var utils = require('../js/utils.js');
var zip = require('gulp-zip');

gulp.task('publish', ['build'], function () {
	var cascade = utils.get('cascadeSettings');
	var project = utils.get('projectSettings');
	return gulp.src([project.path + '/**/*', '!' + project.path + '/*.zip'], {dot: true})
		.pipe(zip(project.name + '.scp'))
		.pipe(gulp.dest(project.path));
});