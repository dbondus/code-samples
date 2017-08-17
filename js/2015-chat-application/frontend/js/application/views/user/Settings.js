define([
    'views/base/View',

    'services/applicationSettings',
    './Settings/Slider',

    'views/helpers/Accordion',

    'text!./_tmpl/Settings.html'
], function (BaseView, applicationSettings, SliderView, Accordion, tmplData) {
    "use strict";

    /**
     * @class
     * @classdesc Settings view
     */
    var Settings = BaseView.extend(
        /** @lends Setting.prototype */
        {
            /** @override */
            name: 'settingsView',
            /** @override */
            template: tmplData,

            /** @override */
            events: {
                /**
                 * Handles user input
                 * @param {object} e
                 */
                'keyup .e-name': function (e) {
                    if (e.keyCode !== 13) {
                        return;
                    }

                    var $el = this.$(e.currentTarget);

                    if (this._updateNickname($el.val())) {
                        $el.blur();

                        return;
                    }

                    $el.val(applicationSettings.getCurrentUserName());
                },

                /**
                 * Handles accordion interaction
                 * @param {object} e
                 */
                'click .e-header': function (e) {
                    var $el = this.$(e.currentTarget);

                    this.accordion.toggleRow(
                        $el.closest('.c-accordion-row')
                    );
                }
            },

            /** @type (Accordion|Function) */
            accordion: Accordion,

            /** @type (Slider|Function) */
            photoWidthSlider: SliderView,
            /** @type (Slider|Function) */
            photoHeightSlider: SliderView,

            /** @override */
            render: function () {
                BaseView.prototype.render.call(this);

                this._renderAccordion(this.$('.c-accordion'));

                this.photoWidthSlider = this._renderSlider(this.$('.c-width'), 'Width', 200, 800, applicationSettings.get('photoWidth'));
                this.photoHeightSlider = this._renderSlider(this.$('.c-height'), 'Height', 200, 800, applicationSettings.get('photoHeight'));

                this._addListeners();

                return this;
            },

            /** @override */
            remove: function () {
                this.photoWidthSlider.remove();
                this.photoHeightSlider.remove();

                BaseView.prototype.remove.call(this);
            },

            /**
             * @param {jQuery} $container
             * @private
             */
            _renderAccordion: function ($container) {
                $container.append(
                    this.renderTemplate('accordion-row', {
                        caption: 'Photo settings',
                        content: this.renderTemplate('settings-photos')
                    })
                );

                $container.append(
                    this.renderTemplate('accordion-row', {
                        caption: 'Chat settings',
                        content: this.renderTemplate('settings-chat', {
                            name: applicationSettings.getCurrentUserName()
                        })
                    })
                );

                this.accordion = new this.accordion(
                    $container.find('.c-accordion-row'), {
                        headerClass: '.e-header',
                        headerActiveClass: '.ca-header-active',

                        contentClass: '.c-content',
                        contentHiddenClass: '.ca-content-hidden'
                    }
                );
                this.accordion.initialize();
            },

            /**
             * @param {jQuery} $container
             * @param {string} caption
             * @param {number} min
             * @param {number} max
             * @param {number} value
             * @returns {Slider}
             * @private
             */
            _renderSlider: function ($container, caption, min, max, value) {
                return new SliderView({
                    el: $container,
                    caption: caption,

                    minValue: min,
                    maxValue: max,
                    value: value
                }).render();
            },

            /**
             * Handles update of the user name
             *
             * @param {string} name
             * @returns {boolean}
             * @private
             */
            _updateNickname: function (name) {
                name = this._sanitizeNickname(name);

                console.log(this._validateNickName(name));

                if (!this._validateNickName(name)) {
                    return false;
                }

                applicationSettings.get('user').set('name', name);

                return true;
            },

            /**
             * Basic sanitize of user input
             *
             * @param {string} name
             * @returns {string}
             * @private
             */
            _sanitizeNickname: function (name) {
                return name.replace(/^\s+|\s+$/gm, '');
            },

            /**
             * Basic validation of user input
             *
             * @param {string} name
             * @returns {bool}
             * @private
             */
            _validateNickName: function (name) {
                if (name.length < 3) {
                    return false;
                }

                if (!/^[a-z]*$/i.test(name)) {
                    return false;
                }

                return true;
            },

            /**
             * @private
             */
            _addListeners: function () {
                /**
                 * @param {Slider~event:EVENT_CHANGE} value
                 * @listens Slider~event:EVENT_CHANGE
                 */
                this.listenTo(this.photoWidthSlider, this.photoWidthSlider.EVENT_CHANGE, function (value) {
                    applicationSettings.set('photoWidth', value);
                });

                /**
                 * @param {Slider~event:EVENT_CHANGE} value
                 * @listens Slider~event:EVENT_CHANGE
                 */
                this.listenTo(this.photoHeightSlider, this.photoHeightSlider.EVENT_CHANGE, function (value) {
                    applicationSettings.set('photoHeight', value);
                });
            }
        });

    return Settings;
});
