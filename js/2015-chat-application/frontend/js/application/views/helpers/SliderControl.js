define([
    'lib/Events',
    'underscore'
], function(Events, _) {
    "use strict";

    /**
     * @typedef SliderControlOptions
     * @type {object}
     * @property {number} minValue
     * @property {number} maxValue
     * @property {number} value
     */
    var SliderControlOptions;

    /**
     *
     * @param {jQuery} $back
     * @param {jQuery} $handle
     * @param {SliderControlOptions} [options]
     * @class
     * @classdesc Slider UI controller
     * Features:
     * 1 convert value to handler position
     * 2 convert handler position to value
     * 3 value/position clamping
     * 4 min/max values can be changed
     *
     * @throws {Error}
     */
    var SliderControl = function($back, $handle, options) {
        options || (options = {});

        if(!$back) {
            throw new Error('$back should be defined');
        }
        if(!$handle) {
            throw new Error('$handle should be defined');
        }

        this.$back = $back;
        this.$handle = $handle;

        options.minValue && (this.minValue = options.minValue);
        options.maxValue && (this.maxValue = options.maxValue);
        options.value && (this.value = options.value);
    };

    _.extend(SliderControl.prototype, Events,
        /** @lends SliderControl.prototype */
        {
        /** @type {number} */
        handleRadius: 0,
        /** @type {number} */
        backWidth: 0,

        /** @type {number} */
        minValue: 0,
        /** @type {number} */
        maxValue: 1,
        /** @type {number} */
        value: 0.5,

        initialize: function() {
            this.handleRadius = this.$handle.width() / 2;
            this.backWidth = this.$back.width();

            this.setValue(this.value, true);
        },

        /**
         * @param {number} x
         * @param {boolean} [force] Force update of the value even if the value has not been changed
         */
        setHandlePosition: function(x, force) {
            x > this.backWidth && (x = this.backWidth);
            x < 0 && (x = 0);

            var range = this.maxValue - this.minValue,
                value = (x / this.backWidth) * range + this.minValue;
            value = Math.ceil(value);

            if(value === this.value && !force) {
                return;
            }

            this.$handle.css('left', x + 'px');

            this.value = value;

            this.trigger(this.EVENT_CHANGE, this.value);
        },

        /**
         * @param {number} value
         * @param {boolean} [force] Force update of the value even if the value has not been changed
         */
        setValue: function(value, force) {
            value = Math.ceil(value);
            value > this.maxValue && (value = this.maxValue);
            value < this.minValue && (value = this.minValue);

            if(value === this.value && !force) {
                return;
            }

            this.value = value;

            var range = this.maxValue - this.minValue,
                position = ((value - this.minValue) / range) * this.backWidth -  this.handleRadius;

            this.$handle.css('left', position + 'px');

            this.trigger(this.EVENT_CHANGE, this.value);
        },

        /**
         * @returns {number}
         */
        getValue: function() {
            return this.value;
        },

        /**
         * Value has been changed
         *
         * @event SliderControl#EVENT_CHANGE
         * @type {number|object}
         */
        EVENT_CHANGE: 'change'
    });

    return SliderControl;
});
