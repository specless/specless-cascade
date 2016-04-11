var _ = require('underscore');
var jetpack = require('fs-jetpack');

var globalSettings = jetpack.read('./package.json', 'json');
var cascadeSettings = globalSettings['specless-cascade'];

module.exports = {
	currentProject : function() {
		var cascade = jetpack.read('./package.json', 'json')['specless-cascade'];
		if (cascade.currentProjectDir === 'default') {
			return cascade.path + cascade.defaultProjectDir
		} else {
			return cascade.currentProjectDir
		}
	},
	setCurrentProject : function(path) {
		var currentSettings = jetpack.read('./package.json', 'json');
		currentSettings['specless-cascade'].currentProjectDir = path;
		jetpack.write('./package.json', currentSettings);
	},
	get : function(type) {
		var projectFolder = this.currentProject();
		var result;
		if (type === 'projectSettings') {
			result = jetpack.read(projectFolder + '/' + cascadeSettings.settingsFileName, 'json');
			
			// Rebuild the settings object if it doesn't exist
			if (result === null) {
				result = {
					path : projectFolder,
					name : projectFolder.split('/').pop(),
					cascadeVersion : globalSettings.version,
					created : this.timestamp(),
					lastUpdated : this.timestamp(),
					csfVersion : cascadeSettings.csfVersion,
					components : [],
				}
			}
			return result
		} else if (type === 'cascadeSettings') {
			result = jetpack.read('./package.json', 'json');
			result = result['specless-cascade'];
			return result
		}
	},
	save : function(type, object) {
		var projectFolder = this.currentProject();
		if (type === 'projectSettings') {
			object.lastUpdated = this.timestamp();
			jetpack.write(projectFolder + '/' + cascadeSettings.settingsFileName, object);
			return object
		}
	},
	logComponentDetails : function(component, sourceType, logAs, value) {
		var settingsObj = this.get('projectSettings');
		
		if (settingsObj.components === undefined) {
			settingsObj.components = [];
		}
		var foundComponent = false;
		_.each(settingsObj.components, function(thisComponent) {
			if (thisComponent.name === component) {
				foundComponent = true;
			}
		});

		if (foundComponent === false) {
			var newComponent = {
				name: component,
				html: {},
				css: {},
				js: {},
				assets: {}
			};
			settingsObj.components.push(newComponent);
		}
		_.each(settingsObj.components, function(thisComponent) {
			if (thisComponent.name === component) {
				var category = thisComponent[sourceType];
				category[logAs] = value;
			}
		});
		settingsObj.lastUpdated = this.timestamp();
		this.save('projectSettings', settingsObj);
		return settingsObj;
	},
	timestamp : function() {
	    var date = new Date();
	    var hour = date.getHours();
	    hour = (hour < 10 ? "0" : "") + hour;
	    var min  = date.getMinutes();
	    min = (min < 10 ? "0" : "") + min;
	    var sec  = date.getSeconds();
	    sec = (sec < 10 ? "0" : "") + sec;
	    var year = date.getFullYear();
	    var month = date.getMonth() + 1;
	    month = (month < 10 ? "0" : "") + month;
	    var day  = date.getDate();
	    day = (day < 10 ? "0" : "") + day;
	    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
	},
	updateCascadePath : function(path) {
		var packageJson = jetpack.read('./package.json', 'json');
		packageJson["specless-cascade"].path = path;
		jetpack.write('./package.json', packageJson);
	},
	validateProject : function(path) {
		return true
	}
}