define([
    'views/base/View',

    'views/helpers/SliderControl',

    'text!./_tmpl/Slider.html',
    'underscore'
], function(BaseView, SliderControl, tmplData, _) {
    "use strict";
    /**
     * @typedef SliderOptions
     * @type {object}
     * @property {number} minValue
     * @property {number} maxValue
     * @property {number} value
     * @property {string} caption
     */
    var SliderOptions;

    /**
     * @class
     * @classdesc Slider UI
     * Features:
     * 1 handles both mouse and touch
     */
    var Slider = BaseView.extend({
        /**
         * @override
         */
        name: 'sliderView',
        /**
         * @override
         */
        template: tmplData,

        /**
         * @override
         */
        events: {
            /**
             * Starts mouse drag of the slider
             *
             * @param {object} e
             */
            'mousedown .e-handle': function(e) {
                e.preventDefault();

                this._dragMouseStart();
            },

            /**
             * Starts touch drag of the slider
             *
             * @param {object} e
             */
            'touchstart .e-handle': function(e) {
                e.preventDefault();

                this._dragTouchStart();
            }
        },

        /** @type {string} */
        caption: 'Slider',
        /** @type {SliderControl|Function} */
        sliderControl: SliderControl,

        /** @type {number} */
        value: 0.5,
        /** @type {number} */
        minValue: 0,
        /** @type {number} */
        maxValue: 1,

        /** @type {number} */
        offset: 0,

        /**
         * @param {SliderOptions} [options]
         * @override
         */
        initialize: function(options) {
            options || (options = {});
            BaseView.prototype.initialize.call(this, options);

            options.minValue && (this.minValue = options.minValue);
            options.maxValue && (this.maxValue = options.maxValue);
            options.value && (this.value = options.value);
            options.caption && (this.caption = options.caption);

            this._dragMouse = _.bind(this._dragMouse, this);
            this._dragMouseEnd = _.bind(this._dragMouseEnd, this);
            this._dragTouch = _.bind(this._dragTouch, this);
            this._dragTouchEnd = _.bind(this._dragTouchEnd, this);
        },

        /**
         * @override
         * @returns {Slider}
         */
        render: function() {
            BaseView.prototype.render.call(this, {
                caption: this.caption,
                value: this.value
            });

            //next frame
            setTimeout(_.bind(this._applyControls, this), 0);

            return this;
        },

        /**
         * Instantiates SliderControl and adds listeners
         * @private
         */
        _applyControls: function() {
            this.sliderControl = new this.sliderControl(
                this.$('.e-back'),
                this.$('.e-handle'), {
                    minValue: this.minValue,
                    maxValue: this.maxValue,
                    value: this.value
                }
            );

            this.sliderControl.initialize();

            this.offset = this.$('.e-container').offset().left + this.$('.e-handle').width() / 2;

            this._addListeners();
        },

        /**
         * @private
         */
        _addListeners: function() {
            this.listenTo(this.sliderControl, this.sliderControl.EVENT_CHANGE, this._onSliderValueChange, this);
        },

        /**
         * @param {SliderControl~event:EVENT_CHANGE} value
         * @listens SliderControl~event:EVENT_CHANGE
         * @fires Slider~EVENT_CHANGE
         * @private
         */
        _onSliderValueChange: function(value) {
            this.$('.e-value').text(value);

            this.trigger(this.EVENT_CHANGE, value);
        },

        /**
         * Tracking of mouse drag
         *
         * @param {object} e
         * @private
         */
        _dragMouse: function(e) {
            this.sliderControl.setHandlePosition(e.clientX - this.offset);
        },

        /**
         * Tracking of touch drag
         *
         * @param {object} e
         * @private
         */
        _dragTouch: function(e) {
            e.originalEvent && (e = e.originalEvent);

            this.sliderControl.setHandlePosition(e.changedTouches[0].clientX - this.offset);
        },

        /**
         * Initiates mouse moves tracking
         * @private
         */
        _dragMouseStart: function() {
            this.delegate('mousemove', '.e-container', this._dragMouse);
            this.delegate('mouseup', '.e-container', this._dragMouseEnd);
            this.delegate('mouseleave', '.e-container', this._dragMouseEnd);
        },

        /**
         * Clean up after mouse tracking is finished
         * @private
         */
        _dragMouseEnd: function() {
            this.undelegate('mousemove', '.e-container', this._dragMouse);
            this.undelegate('mouseup', '.e-container', this._dragMouseEnd);
            this.undelegate('mouseleave', '.e-container', this._dragMouseEnd);
        },

        /**
         * Initiates touch moves tracking
         * @private
         */
        _dragTouchStart: function() {
            this.delegate('touchmove', '.e-container', this._dragTouch);
            this.delegate('touchend', '.e-container', this._dragTouchEnd);
            this.delegate('touchcancel', '.e-container', this._dragTouchEnd);
        },

        /**
         * Clean up after touch tracking is finished
         * @private
         */
        _dragTouchEnd: function() {
            this.undelegate('mousemove', '.e-container', this._dragTouch);
            this.undelegate('mouseup', '.e-container', this._dragTouchEnd);
            this.undelegate('mouseleave', '.e-container', this._dragTouchEnd);
        },

        /**
         * Value has been changed
         *
         * @event Slider#EVENT_CHANGE
         * @type {number|object}
         */
        EVENT_CHANGE: 'change'
    });

    return Slider;
});
