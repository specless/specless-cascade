var postcss = require('gulp-postcss');
var gulp = require('gulp');
var _ = require('underscore');
var utils = require('../js/utils.js');

gulp.task('css', function () {
	var cascade = utils.get('cascadeSettings');
	var settings = utils.get('projectSettings');
	var projectFolder = settings.path;

	var component = process.argv[3];
	var glob;
	if (component !== undefined) {
		component = component.replace('--', '');
		glob = [projectFolder + '/' + component + '/' + cascade.css.fileName];
	} else {
		glob = [projectFolder + '/**/' + cascade.css.fileName];
	}

    var postcssBefore = [
    	require('postcss-import')({
    		root : './',
    		path : projectFolder
    	}),
    	require('postcss-simple-vars'),
    	require('postcss-sassy-mixins'),
    	require('postcss-atroot'),
    	require('postcss-simple-extend'),
    	require('postcss-conditionals'),
    	require('postcss-each'),
    	require('postcss-for'),
    	require('postcss-custom-selectors'),
		require('postcss-nested')({
			bubble: cascade.css.syntax.contexts.concat([cascade.css.syntax.flowlane, cascade.css.syntax.breakpoint])
		}),
		require('../js/postcss-context-queries')({
			contexts: cascade.css.syntax.contexts,
			operators: cascade.css.syntax.contextOperators,
			attrPrefix : cascade.css.syntax.attrPrefix,
			attrJoiner : cascade.css.syntax.attrJoiner,
			attrExplicitJoiner : cascade.css.syntax.attrExplicitJoiner,
			attrEnding : cascade.css.syntax.attrEnding,
			logResults: true,
			logTo : 'project'
		}),
		require('../js/postcss-flowlanes-breakpoints')({
			flowlaneSyntax : cascade.css.syntax.flowlane,
			defineFlowlaneSyntax : cascade.css.syntax.flowlaneDefine,
			breakpointSyntax : cascade.css.syntax.breakpoint,
			breakpointDefault : cascade.css.syntax.defaultBreakpointType,
			attrPrefix : cascade.css.syntax.attrPrefix,
			attrJoiner : cascade.css.syntax.attrExplicitJoiner,
			attrEnding : cascade.css.syntax.attrEnding,
			flowlaneProps : cascade.css.syntax.flowlaneProperties,
			flowlaneDefaults : cascade.css.syntax.flowlaneDefaults,
			logResults: true,
			logTo : 'project'
		}),
		require('postcss-reporter')({
			clearMessages:true
		})
	];
	
	var postcssAfter = [
		require('postcss-nested'),
		require('postcss-easysprites')({
			imagePath : projectFolder,
			spritePath : projectFolder + '/' + cascade.assetsDirName
		}),
		require('postcss-calc'),
		require('postcss-functions'),
		require('postcss-color-function'),
		require('postcss-aspect-ratio'),
		require('postcss-filter-gradient'),
		require('postcss-easings'),
		require('postcss-animation'),
		require('postcss-assets'),
		require('autoprefixer')
	];

	var component;
    
    return gulp.src(glob)
        .pipe(postcss(postcssBefore))
        .pipe(postcss(postcssAfter))
        .pipe(gulp.dest(cascade.buildDir));
});