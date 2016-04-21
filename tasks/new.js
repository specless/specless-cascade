var gulp = require('gulp');
var _ = require('underscore');
var copy = require('gulp-contrib-copy');
var utils = require('../js/utils.js');
var fs = require('fs');
var jetpack = require('fs-jetpack');

gulp.task('new', function () {
	var cascade = utils.get('cascadeSettings');

	var path, name;
	_.each(process.argv, function(arg) {
	   thisArg = arg.split('=');
	   if (thisArg.length === 2) {
		   	if (thisArg[0] === '--path') {
		   		path = thisArg[1];
		   	} else if (thisArg[0] === '--name') {
		   		name = thisArg[1];
		   	}
	   }
	});
	if (path === undefined) {
		console.error("You must provide a path for your new project.");
		
	} else if (name === undefined) {
		console.error("You must provide a name for your new project.");
	}

	var rename = function(name) {
		function transform(file, cb) {
			if (file.relative === cascade.settingsFileName) {
				var settings = JSON.parse(String(file.contents));
				settings.name = name;
				settings.path = path + '/' + name;
				settings = JSON.stringify(settings);
				file.contents = new Buffer(settings);
			}
		    cb(null, file);
		}
		return require('event-stream').map(transform);
	}

	var destination = path + '/' + name;
	fs.access(destination, fs.F_OK, function(err) {
	    if (!err) {
	        console.error("The project '" + name + "' already exists here.");
	    } else {
	        return gulp.src(cascade.path + cascade.defaultProjectDir + '/**/*')
				.pipe(copy())
				.pipe(rename(name))
			    .pipe(gulp.dest(destination));
			// var settings = jetpack.read(destination + '/' + cascade.settingsFileName, 'json');
			// settings.name = name;
			// jetpack.write(destination + '/' + cascade.settingsFileName, settings);
	    }
	});
});