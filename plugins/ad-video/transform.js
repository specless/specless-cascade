module.exports = function (element, utils, _) {
    
    var videojsOptions = {
    	controls : false,
    	autoplay : false,
    	preload : 'metadata',
    	loop : false,
    	poster : false
    };

    var elementOptions = {
    	playerType : 'html5',
    	name : null,
    	sizing : 'contain',
    	simpleControls : false,
    	muted : false,
    	wallpaper: false,
    	aspect : '16x9',
    	audioHover : false, 
    	viewToggleOff : false
    };

    var attrs = element.node.attrs;

    _.each(attrs, function (attr, key) {
    	camelKey = utils.snakeToCamel(key);
    	if (_.has(elementOptions, camelKey) === true) {
    		elementOptions[camelKey] = utils.normalizeAttrValue(attr);
    		delete attrs[key]
    	}
    	if (_.has(videojsOptions, camelKey) === true) {
    		videojsOptions[camelKey] = utils.normalizeAttrValue(attr);
    		delete attrs[key]
    	}
    });

    attrs['data-setup'] = JSON.stringify(videojsOptions);
    attrs['data-element-setup'] = JSON.stringify(elementOptions);
    element.node.attrs = attrs;
    console.log(elementOptions);
    console.log(videojsOptions);
    return element
}