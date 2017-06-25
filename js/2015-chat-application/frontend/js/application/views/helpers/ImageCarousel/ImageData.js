define([
    'lib/Events',

    'underscore'
], function(Events, _) {
    "use strict";

    //old ie patch
    var addEventListener,
        removeEventListener;

    if(window.attachEvent) {
        addEventListener = function(target, event, handler) {
            target.attachEvent('on' + event, handler);
        };
        removeEventListener = function(target, event, handler) {
            target.detachEvent('on' + event, handler);
        };
    } else {
        addEventListener = function(target, event, handler) {
            target.addEventListener(event, handler);
        };
        removeEventListener = function(target, event, handler) {
            target.removeEventListener(event, handler);
        };
    }

    /**
     * @typedef ImageDataOptions
     * @type {object}
     * @property {string} id
     * @property {number} width
     * @property {number} height
     * @property {string} url
     */
    var ImageDataOptions;


    /**
     * @class
     * @classdesc Image wrapper
     * @param {ImageDataOptions} [options]
     */
    var ImageData = function(options) {
        this.initialize(options);
    };

    _.extend(ImageData.prototype, Events,
        /** @lends ImageData.prototype */
        {
        /**
         * @type {?HTMLImageElement}
         */
        image: null,

        /**
         * @type {?string}
         */
        id: null,

        /**
         * @param {ImageDataOptions} [options]
         */
        initialize: function(options) {
            options || (options = {});

            this.image = document.createElement('img');

            options.id && (this.id = options.id);

            options.width && (this.image.width = options.width);
            options.height && (this.image.height = options.height);

            options.url && this.load(options.url);

            this._addListeners();
        },

        /**
         * Starts loading process
         *
         * @param {string} url
         */
        load: function(url) {
            this.status = this.STATUS_LOADING;

            this.image.src = url;
        },

        /**
         * Frees resources for GC
         */
        dispose: function() {
            this._removeListeners();

            var parent = this.image.parentNode;
            parent && parent.removeChild(this.image);

            this.image = null;
        },

        /**
         * @param {number} width
         * @param {number} height
         */
        adjustImageSize: function(width, height) {
            this.image.width = width;
            this.image.height = height;
        },

        /**
         * @private
         */
        _addListeners: function() {
            this._onImageReady = _.bind(this._onImageReady, this);
            this._onImageError = _.bind(this._onImageError, this);

            addEventListener(this.image, 'load', this._onImageReady);
            addEventListener(this.image, 'error',this._onImageError);
        },

        /**
         * @private
         */
        _removeListeners: function() {
            removeEventListener(this.image, 'load', this._onImageReady);
            removeEventListener(this.image, 'error',this._onImageError);
        },

        /**
         * @fires ImageData~EVENT_READY
         * @private
         */
        _onImageReady: function() {
            this.status = this.STATUS_READY;

            this.trigger(this.EVENT_READY, this);
        },

        /**
         * @fires ImageData~EVENT_ERROR
         * @private
         */
        _onImageError: function() {
            this.status = this.STATUS_ERROR;

            this.trigger(this.EVENT_ERROR, this);
        },

        STATUS_LOADING: 'loading',
        STATUS_ERROR: 'error',
        STATUS_READY: 'ready',

        /**
         * Image loading is completed
         *
         * @event ImageData#EVENT_READY
         * @type {ImageData|object}
         */
        EVENT_READY: 'ready',

        /**
         * Image loading is failed
         *
         * @event ImageData#EVENT_ERROR
         * @type {ImageData|object}
         */
        EVENT_ERROR: 'error'
    });

    return ImageData;
});
