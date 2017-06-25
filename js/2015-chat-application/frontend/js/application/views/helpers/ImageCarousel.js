define([
    './ImageCarousel/ImageData',

    'underscore'
], function(ImageData, _) {
    "use strict";

    /**
     * @typedef ImageCarouselOptions
     * @type {object}
     * @property {jQuery} $indicator
     * @property {number} width
     * @property {number} height
     * @property {ImageData[]} imageStorage
     */
    var ImageCarouselOptions;

    /**
     *
     * @param {jQuery} $imageContainer
     * @param {jQuery} $spinner
     * @param {ImageCarouselOptions} [options]
     * @class
     * @classdesc Carousel UI helper
     * Features:
     * 1 async operations with images, user can go through gallery as far as he wants
     * 2 support of horizontal swipe gesture
     * 3 image state is saved while the user is working with other application tabs
     *
     * @throws {Error}
     */
    var ImageCarousel = function($imageContainer, $spinner, options) {
        options || (options = {});

        if(!$imageContainer) {
            throw new Error('$imageContainer should be defined');
        }
        if(!$spinner) {
            throw new Error('$imageContainer should be defined');
        }

        this.$imageContainer = $imageContainer;
        this.$spinner = $spinner;

        options.$indicator && (this.$indicator = options.$indicator);

        options.width && (this.width = options.width);
        options.height && (this.height = options.height);

        this.imageStorage = options.imageStorage
                                ? options.imageStorage
                                : [];
    };

    _.extend(ImageCarousel.prototype,
        /** @lends ImageCarousel.prototype */
        {
        /**
         * @type {string} Image gallery source
         */
        baseUrl: 'http://lorempixel.com',

        /**
         * @type {number}
         */
        width: 400,
        /**
         * @type {number}
         */
        height: 200,

        /**
         * @type {ImageData[]} List of ImageData with active listeners
         */
        imageListened: null,
        /**
         * @type {ImageData[]}
         */
        imageStorage: null,
        /**
         * @type {number} Active image ID
         */
        currentIndex: 1,

        /**
         * @type {jQuery}
         */
        $imageContainer: null,
        /**
         * @type {jQuery}
         */
        $spinner: null,

        /**
         * @type {?jQuery}
         */
        $indicator: null,

        /**
         * Starts loading from first image
         */
        start: function() {
            this.imageListened = [];

            this._loadImage();
        },

        /**
         * Go to the previous image (if available)
         */
        previous: function() {
            if(this.currentIndex === 1) {
                return;
            }

            this.currentIndex--;

            this._loadImage();
        },

        /**
         * Go to the next image
         */
        next: function() {
            this.currentIndex++;

            this._loadImage();
        },

        /**
         * Removes all active listeners
         */
        remove: function() {
            var i = this.imageListened.length;
            while(i--) {
                var imageData = this.imageListened.pop();

                imageData.off(imageData.EVENT_READY, this._onImageReady, this);
                imageData.off(imageData.EVENT_ERROR, this._onImageError, this);
            }
        },

        /**
         * Loads image.
         * If image is still in loading state it shows loader.
         * If the image size was changed in settings it will try to downsize current image to new the new size or
         * will start download process again
         * If image is already loaded it will simply show that image
         *
         * @private
         */

        _loadImage: function() {
            this.$imageContainer.empty();

            var imageData = this.imageStorage[this.currentIndex]
                                ? this.imageStorage[this.currentIndex]
                                : this._prepareImageData();

            //loading is in process
            if(imageData.status === imageData.STATUS_LOADING && imageData.image.height === this.height && imageData.image.width === this.width) {
                this._addSpinner();

                return;
            }

            //image is ready and has correct size
            if(imageData.status === imageData.STATUS_READY && imageData.image.height === this.height && imageData.image.width === this.width) {
                this._onImageReady(imageData);

                return;
            }

            //image is ready, but needs size adjustments
            if(imageData.status === imageData.STATUS_READY && imageData.image.height > this.height && imageData.image.width > this.width) {
                imageData.adjustImageSize(this.width, this.height);

                this._onImageReady(imageData);

                return;
            }

            this._addSpinner();

            imageData.load(this._makeUrl());
        },

        /**
         * Generates image url with current size settings. Adds current timestamp to force existing image element to
         * load new image
         *
         * @returns {string}
         * @private
         */
        _makeUrl: function() {
            var parts = [
                this.baseUrl, '/',
                this.width, '/',
                this.height, '/',
                '?', new Date().getTime()
            ];

            return parts.join('');
        },

        /**
         * Initialization routine to prepare new ImageData instance
         *
         * @private
         */
        _prepareImageData: function() {
            var imageData = new ImageData({
                id: this.currentIndex,

                width: this.width,
                height: this.height
            });

            this.imageListened.push(imageData);

            imageData.on(imageData.EVENT_READY, this._onImageReady, this);
            imageData.on(imageData.EVENT_ERROR, this._onImageError, this);

            this.imageStorage[this.currentIndex] = imageData;

            return imageData;
        },

        /**
         * @param {ImageData~event:EVENT_READY} imageData
         * @listens ImageData~event:EVENT_READY
         * @private
         */
        _onImageReady: function(imageData) {
            //filter out visible image
            if(imageData.id !== this.currentIndex) {
                return;
            }

            if(imageData.status !== imageData.STATUS_READY) {
                return;
            }

            this.$imageContainer
                .empty()
                .append(imageData.image);
        },

        /**
         * Starts new loading process if the previous loading failed
         *
         * @param {ImageData~event:EVENT_ERROR} imageData
         * @listens ImageData~event:EVENT_ERROR
         * @private
         */
        _onImageError: function(imageData) {
            //filter out visible image
            if(imageData.id !== this.currentIndex) {
                return;
            }

            this._loadImage();
        },

        /**
         * Inserts loader widget. Optionally updates indicator with current image ID
         *
          * @private
         */
        _addSpinner: function() {
            this.$imageContainer.prepend(this.$spinner);
            this.$indicator && this.$indicator.text(this.currentIndex);
        }
    });

    return ImageCarousel;
});
