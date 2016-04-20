var _ = require('underscore');
var utils = require('../js/utils.js');

module.exports = function (opts) {
	opts = opts || {
		prefix: 'ad-',
		newPrefix: 'data-'
	};

	var elements = utils.getPlugins('element');
	var attrs = utils.getPlugins('attribute');
	var cascade = utils.get('cascadeSettings');
	var normalizePath = cascade.css.normalizeDir;
	var normalize = cascade.css.normalize;
	
	return function (tree) {
		var dependencies = {
			css: [],
			js: [],
			jsPlugins: [],
			jsWhiteList: [],
			jsSnippets: []
		}
		var component = tree[0].replace('<!-- ', '').replace(' -->', '');


		// First Process Ad Element Attributes (data-exit, data-expand, etc)
		tree.walk(function(node) {
			_.each(attrs, function(attr) {
				if (node.attrs) {
					if (_.has(node.attrs, opts.prefix + attr.name) === true) {
						node.attrs[opts.newPrefix + attr.name] = node.attrs[opts.prefix + attr.name];
						delete node.attrs[opts.prefix + attr.name];
						var attrObj = {
				    		options: attr.options,
				    		jsSnippets : [],
				    		jsDependencies : [],
				    		cssDependencies : [],
				    		node: node
				    	};
				    	var transformedEl = attrObj;
					    if (attr.transformScript) {
					    	var transformPath = '..' + attr.path + '/' + attr.transformScript;
					    	if (require.resolve(transformPath)) {
					    		delete require.cache[require.resolve(transformPath)]
					    	}
					    	transformedEl = require(transformPath)(attrObj);

					    }
					    if (attr.dependencies) {
				    		attr.dependencies.jsSnippets = transformedEl.jsSnippets;
				    		if (transformedEl.jsDependencies.length > 0) {
				    			attr.dependencies.js = attr.dependencies.js.concat(transformedEl.jsDependencies);
				    		}
				    		if (transformedEl.cssDependencies.length > 0) {
				    			attr.dependencies.css = attr.dependencies.css.concat(transformedEl.cssDependencies);
				    		}
				    		dependencies = utils.addDeps(dependencies, attr.dependencies, attr.path);
				    	}
					    node = transformedEl.node;
					}
				}
			});
			return node;
		});

		// Next Process Ad Elements
		_.each(elements, function(element) {
			tree.match({ tag: opts.prefix + element.name }, function(node) {
				node.tag = element.tag;
				if (node.attrs) {
					node.attrs['data-element'] = element.name;
				} else {
					node.attrs = { 'data-element': element.name };
				}
				var elObj = {
		    		options: element.options,
		    		jsSnippets : [],
		    		jsDependencies : [],
		    		cssDependencies : [],
		    		node: node
		    	};
		    	var transformedEl = elObj;
			    if (element.transformScript) {
			    	var transformPath = '..' + element.path + '/' + element.transformScript;
			    	if (require.resolve(transformPath)) {
			    		delete require.cache[require.resolve(transformPath)]
			    	}
			    	
			    	transformedEl = require(transformPath)(elObj);

			    }
			    if (element.dependencies) {
		    		element.dependencies.jsSnippets = transformedEl.jsSnippets;
		    		if (transformedEl.jsDependencies.length > 0) {
		    			element.dependencies.js = element.dependencies.js.concat(transformedEl.jsDependencies);
		    		}
		    		if (transformedEl.cssDependencies.length > 0) {
		    			element.dependencies.css = element.dependencies.css.concat(transformedEl.cssDependencies);
		    		}
		    		dependencies = utils.addDeps(dependencies, element.dependencies, element.path);
		    	}
			    node = transformedEl.node;
			    return node;
			});
		});

		// Finally process all elements used that require normalization-- and insert those as css dependencies before the custom ones. 
		var normalizeDeps = [];
		_.each(normalize, function(element) {
			tree.match({tag: element.tag}, function(node) {
				normalizeDeps.push(normalizePath + '/' + element.css);
				return node;
			})
		});
		dependencies.css = normalizeDeps.concat(dependencies.css);
		utils.logComponentDetails(component, 'html', 'dependencies', dependencies);
	}
}