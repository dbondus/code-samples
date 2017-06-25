require.config({
    baseUrl: "../js",
    "paths": {
        views: 'application/views',
        models: 'application/models',
        configs: 'application/configs',
        services: 'application/services',

        backbone: 'vendor/backbone/backbone',
        underscore: 'vendor/underscore/underscore',

        jquery: 'vendor/jquery/jquery',

        almond: 'vendor/almond/almond',
        text: 'vendor/text/text',

        bluebird: 'vendor/bluebird/js/browser/bluebird',

        'socket.io': 'vendor/socket.io-client/dist/socket.io',

        chai: '../../node_modules/chai/chai'
    },

    shim: {
        bluebird: {
            exports: 'Bluebird',
            init: function() {
                /* jshint ignore:start */
                return Promise.noConflict();
                /* jshint ignore:end */
            }
        },

        jquery: {
            exports : 'jQuery'
        },

        underscore: {
            exports : '_'
        },

        backbone: {
            deps: [
                'jquery',
                'underscore'
            ],
            exports: 'Backbone'
        },

        'socket.io': {
            exports : 'io'
        }
    }
});
