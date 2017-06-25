define([
	'views/BaseView',

    'text!./_tmpl/Start.html'
], function(BaseView, tmplData) {
	"use strict";

    return BaseView.extend({
        name: 'startView',
        template: tmplData
    });
});
