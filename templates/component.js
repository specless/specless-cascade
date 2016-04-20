{{{license}}}

// First Require White Listed Exteral CDN Scripts =================
ad.requires([{{{cdnscripts}}}], function() {

	//==================  Begin Plugin Dependencies  ==============

	{{{dependencies}}}

	//===================  End Plugin Dependencies  ===============

	//=================    Begin Cascade Plugins    ===============

	{{{plugins}}}

	//=================     End Cascade Plugins     ===============

	window.Specless.userJS(window, function (specless, _, extendFrom, factories, ad, $, plugins) {

		//========== Begin Plugin Generated Fragments =============

		{{{pluginfragments}}}

		//==========  End Plugin Generated Fragments  =============


		//================ Begin User Created JS ==================

		{{{userjs}}}

		//================  End User Created JS  ==================

	});
});