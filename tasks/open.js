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
			if (utils.validateProject(response.path) === true) {
				var settings = utils.get('projectSettings');
				utils.setCurrentProject(response.path);
				settings.path = utils.currentProject();
				console.log(settings.path);
				utils.save('projectSettings', settings);
			} else {
				console.warn("This is not a valid Specless Cascade project.");
				utils.setCurrentProject('default');
			}
		}));
});