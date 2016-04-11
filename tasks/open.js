var gulp = require('gulp');
var prompt = require('gulp-prompt');
var utils = require('../js/utils.js');

gulp.task('open', ['clean'], function () {
	return gulp.src('./package.json')
		.pipe(prompt.prompt({
			type: 'input',
			name: 'path',
			message: 'Please enter the full path to a Specless Cascade Project: '
		}, function(response){
			utils.openProject(response.path);
		}));
});