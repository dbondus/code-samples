requirejs.config({
    "paths": {
		app: 'application',
        views: 'application/views',
        models: 'application/models',
		configs: 'application/configs',
        services: 'application/services',
        utils: 'application/utils',

        backbone : 'vendor/backbone/backbone',
        underscore : 'vendor/underscore/underscore',

        jquery : 'vendor/jquery/jquery',

        almond: 'vendor/almond/almond',
        text: 'vendor/text/text',

        bluebird: 'vendor/bluebird/js/browser/bluebird.min'
    },

    shim : {
        bluebird: {
            exports: 'Bluebird',
            init: function() {
                return Promise.noConflict();
            }
        },

        jquery : {
            exports : 'jQuery'
        },

        underscore : {
            exports : '_'
        },

        backbone : {
            deps : [
                'jquery',
                'underscore'
            ],
            exports : 'Backbone'
        }
    }
});
