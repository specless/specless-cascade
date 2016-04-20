var gulp = require('gulp');
var utils = require('../js/utils.js');
var _ = require('underscore');
var express = require('express');
var server = express();

gulp.task('listen', ['build'], function () {
	var cascade = utils.get('cascadeSettings');
	var settings = utils.get('projectSettings');

	var htmlFiles = [settings.path + '/**/' + cascade.html.fileName, '!' + settings.path + '/{' + cascade.assetsDirName + ',' + cascade.assetsDirName + '/**}'];
	var cssFiles = [settings.path + '/**/' + cascade.css.fileName, '!' + settings.path + '/{' + cascade.assetsDirName + ',' + cascade.assetsDirName + '/**}'];
	var jsFiles = [settings.path + '/**/' + cascade.js.fileName, '!' + settings.path + '/{' + cascade.assetsDirName + ',' + cascade.assetsDirName + '/**}'];

	gulp.watch(htmlFiles, ['html']);
	gulp.watch(cssFiles, ['css']);
	gulp.watch(jsFiles, ['js']);

	server.get('/', function (req, res) {
		var width = 300;
		var height = 250;
		var previewPrefix = 'http://app.specless.io/preview/' + cascade.csfVersion + '?ad=000000&width=' + width + '&height=' + height + '#';
		var projectSettings = utils.get('projectSettings');
		var previewObj = {
			unfriendlyCreative: true,
			components: []
		}
		var previewUrl;

		_.each(projectSettings.components, function(component) {
			var prefix  = 'http://localhost:' + cascade.serverPort + '/components/' + component.name;
			var obj = {
				src: prefix + '.html',
				jsLocation: prefix + '.js',
			}
			previewObj.components.push(obj);
		});
		previewObj = JSON.stringify(previewObj);
		previewUrl = previewPrefix + previewObj;
		res.location(previewUrl);
	  	res.redirect(302, previewUrl);
	});

	server.use('/components', express.static(settings.path + '/' + cascade.buildDir));
	server.use('/assets', express.static(settings.path + '/' + cascade.assetsDirName));
	server.get('/settings', express.static(settings.path + '/' + cascade.settingsFileName));

	server.listen(cascade.serverPort, function () {
			
	});

});



//http://app.specless.io/preview/623?height=571&width=1378&ad=000000#{"unfriendlyCreative":true,"components":[{"src":"http://localhost:8787/loader","jsLocation":"http://localhost:8787/loader/js"},{"src":"http://localhost:8787/banner","jsLocation":"http://localhost:8787/banner/js"},{"src":"http://localhost:8787/panel","jsLocation":"http://localhost:8787/panel/js","width":1378,"height":571,"dimensionType":"auto"}]}