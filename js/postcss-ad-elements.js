var postcss = require('postcss');
var _ = require('underscore');
var utils = require('../js/utils.js');

module.exports = postcss.plugin('plugin-triggers', function (opts) {

	opts = opts || {
		pseudoPrefix : '::',
		elementPrefix : '~ad-'
	}
	var elements = utils.getPlugins('element');

	return function (css, result) {
		css.walk(function (node) {
			if (node.type === 'rule') {
				_.each(elements, function(element) {
					var selector = opts.elementPrefix + element.name;
					var newSelector = "[data-element='" + element.name + "']";
					var childSelectorPrefix = opts.pseudoPrefix + 'ad-' + element.name;
					node.selector = node.selector.replace(selector, newSelector);

					if (element.childSelectors) {
						_.each(element.childSelectors, function(childSelector) {
							var childSelectorString = childSelectorPrefix + '-' + childSelector.name;
							node.selector = node.selector.replace(childSelectorString, childSelector.selector);
						});
					}
				});
			}
		});
	}
});