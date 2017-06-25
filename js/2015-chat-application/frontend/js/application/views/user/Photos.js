define([
    'views/base/View',

    'services/applicationSettings',

    'views/helpers/ImageCarousel',
    'services/photoStorage',

    'text!./_tmpl/Photos.html',
    'underscore'
], function(BaseView, applicationSettings, ImageCarousel, photoStorage, tmplData, _) {
    "use strict";

    /**
     * @class
     * @classdesc Photo view
     * Features:
     * 1 mouse/touch swipe gesture support
     */
    var Photos = BaseView.extend(
        /** @lends Photos.prototype */
        {
        /** @override */
        name: 'photosView',
        /** @override */
        template: tmplData,

        /** @override */
        className: 'ca-container-h100',

        /** @override */
        events: {
            'click .e-prev': function () {
                this.carousel.previous();
            },

            'click .e-next': function () {
                this.carousel.next();
            },

            /**
             * Starts touch swipe detection
             *
             * @param {object} e
             */
            'touchstart .e-container': function(e) {
                e.preventDefault();

                this._detectTouchSwipe(e);
            },

            /**
             * Starts mouse swipe detection
             *
             * @param {object} e
             */
            'mousedown .e-container': function(e) {
                e.preventDefault();

                this._detectMouseSwipe(e);
            }
        },

        /** @type {number} */
        swipeStartX: 0,
        /** @type {number} */
        swipeStartTime: 0,
        /** @type {number} */
        swipeThreshold: 0.17,

        /** @type {ImageCarousel|Function} */
        carousel: ImageCarousel,

        /**
         * @param {object} [options]
         * @override
         */
        initialize: function(options) {
            BaseView.prototype.initialize.call(this, options);

            this._swipeTouchEnd = _.bind(this._swipeTouchEnd, this);
            this._swipeMouseEnd = _.bind(this._swipeMouseEnd, this);
        },

        /**
         * @override
         */
        render: function() {
            BaseView.prototype.render.call(this, {
                width: applicationSettings.get('photoWidth'),
                height: applicationSettings.get('photoHeight')
            });

            this.carousel = new this.carousel(
                this.$('.e-container'),
                this.$('.e-spinner'), {
                    width: applicationSettings.get('photoWidth'),
                    height: applicationSettings.get('photoHeight'),

                    imageStorage: photoStorage.get('data'),

                    $indicator: this.$('.e-indicator')
                }
            );

            this.carousel.start();

            return this;
        },

        /**
         * @override
         */
        remove: function() {
            this.carousel && this.carousel.remove();

            BaseView.prototype.remove.call(this);
        },

        /**
         * Initializes routine to track touch gesture
         *
         * @param {object} e
         * @private
         */
        _detectTouchSwipe: function(e) {
            e.originalEvent && (e = e.originalEvent);

            this._swipeStart(e.changedTouches[0].clientX);

            this.delegate('touchend', '.e-container', this._swipeTouchEnd);
        },

        /**
         * Clean up after touch gesture detection
         *
         * @param {object} e
         * @private
         */
        _swipeTouchEnd: function(e) {
            e.originalEvent && (e = e.originalEvent);

            this.undelegate('touchend', '.e-container', this._swipeTouchEnd);

            this._swipeEnd(e.changedTouches[0].clientX);
        },

        /**
         * Initializes routine to track mouse
         *
         * @param {object} e
         * @private
         */
        _detectMouseSwipe: function(e) {
            this._swipeStart(e.clientX);

            this.delegate('mouseup', '.e-container', this._swipeMouseEnd);
        },

        /**
         * Clean up after mouse gesture detection
         *
         * @param {object} e
         * @private
         */
        _swipeMouseEnd: function(e) {
            this.undelegate('mouseup', '.e-container', this._swipeMouseEnd);

            this._swipeEnd(e.clientX);
        },

        /**
         * Starts gesture detection
         *
         * @param {number} x
         * @private
         */
        _swipeStart: function(x) {
            this.swipeStartX = x;
            this.swipeStartTime = new Date().getTime();
        },

        /**
         * Gesture detection
         *
         * @param {number} x
         * @private
         */
        _swipeEnd: function(x) {
            var deltaX = x - this.swipeStartX,
                deltaTime = new Date().getTime() - this.swipeStartTime,
                speed = (deltaX / deltaTime);

            if(Math.abs(speed) < this.swipeThreshold) {
                return;
            }

            speed > 0
                ? this.carousel.previous()
                : this.carousel.next();
        }

    });

    return Photos;
});
