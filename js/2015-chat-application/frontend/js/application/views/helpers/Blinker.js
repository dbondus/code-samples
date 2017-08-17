define([
    'underscore'
], function (_) {
    "use strict";


    /**
     * @typedef BlinkerOptions
     * @type {object}
     * @property {number} blinkingDelay
     * @property {string} blinkClass
     */
    var BlinkerOptions;

    /**
     * @param {jQuery} $blinkTarget
     * @param {jQuery} $messageCounter
     * @param {BlinkerOptions} [options]
     * @class
     * @classdesc Makes target element blink and adds small message counter
     *
     * @throws {Error}
     */
    var Blinker = function ($blinkTarget, $messageCounter, options) {
        options || (options = {});

        if (!$blinkTarget) {
            throw new Error('$blinkTarget should be defined');
        }
        if (!$messageCounter) {
            throw new Error('$messageCounter should be defined');
        }

        this.$messageCounter = $messageCounter;
        this.$blinkTarget = $blinkTarget;

        options.blinkingDelay && (this.blinkingDelay = options.blinkingDelay);
        options.blinkClass && (this.blinkClass = options.blinkClass);
    };

    _.extend(Blinker.prototype,
        /** @lends Blinker.prototype */
        {
            /**
             * @type {boolean} Locked state flag. Can not blink while this flag is up
             */
            isLocked: false,

            /**
             * @type {boolean} Blink state indicator
             */
            isBlinking: false,

            /**
             * @type {?number} Holds blink interval ID
             */
            blinkingInterval: null,
            /**
             * @type {number}
             */
            blinkingDelay: 1000,

            /**
             * @type {string} CSS class name of the blink state
             */
            blinkClass: 'highlighted',

            /**
             * @type {jQuery}
             */
            $messageCounter: null,
            /**
             * @type {jQuery}
             */
            $blinkTarget: null,

            /**
             * Update message counter. It removes them completely if amount of messages is 0.
             * Does not work if Blinker is locked
             *
             * @param {number} amount
             */
            updateMessageCounter: function (amount) {
                if (this.isLocked) {
                    return;
                }

                if (!amount) {
                    this.$messageCounter.text('');

                    return;
                }

                this.$messageCounter.text('[' + amount + ']');
            },

            /**
             * Starts blinking state. Target element will toggle "blinkClass" in every "blinkingDelay" ms
             */
            startBlinking: function () {
                if (this.isLocked) {
                    return;
                }

                if (this.isBlinking) {
                    return;
                }

                this.isBlinking = true;

                this.blink();

                this.blinkingInterval = setInterval(function (blinker) {
                    blinker.blink();
                }, this.blinkingDelay, this);
            },

            /**
             * Toggles "blinkClass"
             *
             * @param {bool} state
             */
            blink: function (state) {
                this.$blinkTarget.toggleClass(this.blinkClass, state);
            },

            /**
             * Stops blinking. Removes "blinkClass". Clears interval
             */
            stopBlinking: function () {
                if (this.isLocked) {
                    return;
                }

                if (!this.isBlinking) {
                    return;
                }

                this.isBlinking = false;
                this.blink(false);

                clearInterval(this.blinkingInterval);
                this.blinkingInterval = null;
            },

            /**
             * @param {bool} state
             */
            toggleLock: function (state) {
                var stateDefined = typeof state === "boolean";

                this.isLocked = stateDefined
                    ? state
                    : !this.isLocked;
            }
        });

    return Blinker;
});
