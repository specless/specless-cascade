var gulp = require('gulp');
var _ = require('underscore');
var plumber = require('gulp-plumber');
var utils = require('../js/utils.js');
var express = require('express');
var server = express();

gulp.task('serve', function () {
	var settings = utils.get('projectSettings');
	server.use('/components', express.static(settings.path + '/.output'));
	server.listen(8686, function () {
	  console.log('Example app listening on port 3000!');
	});
});