define([
    'views/Base/View',

    'views/common/Header',

    'text!./_tmpl/Layout.html',

    'underscore'
], function (BaseView, HeaderView, tmplData, _) {
    "use strict";

    /**
     * @class
     * @classdesc Layout view
     * Features:
     * 1 tracks active screen view
     * 2 optionally calls load function before view rendering
     */
    var Layout = BaseView.extend(
        /** @lends Layout.prototype */
        {
            /** @override */
            name: 'layout',
            /** @override */
            template: tmplData,

            /** @type {?View} */
            activeView: null,
            /** @type {?View} */
            header: null,

            /** @type {jQuery|string} */
            $content: '.c-content',

            /**
             * @param {{$content: jQuery}} [options]
             * @override
             */
            initialize: function (options) {
                options || (options = {});
                options.$content && (this.$content = options.$content);

                BaseView.prototype.initialize.call(this, options);

                this.listenTo(this.mediator, this.mediator.EVENT_ROUTE_CHANGE, this.changeView);
            },

            /**
             * @returns {Layout}
             * @override
             */
            render: function () {
                BaseView.prototype.render.call(this);

                _.isString(this.$content) && (this.$content = this.$(this.$content));

                this._renderHeader();

                return this;
            },

            /**
             * Replaces current screen view with new one.
             * Optionally calls load function to give view time for data loading before rendering
             *
             * @param {Mediator~event:EVENT_ROUTE_CHANGE} event
             * @listens Mediator~event:EVENT_ROUTE_CHANGE
             */
            changeView: function (event) {
                var View = event.boundView,
                    args = event.boundViewArguments || [];

                args || (args = []);

                this.activeView && this.activeView.remove();
                this.activeView = new View();

                if (!this.activeView.load) {
                    this._renderCurrentView();

                    return;
                }

                this.activeView.load.apply(this.activeView, args)
                    .bind(this)
                    .then(this._renderCurrentView);
            },

            /**
             * @private
             */
            _renderCurrentView: function () {
                var view = this.activeView.render();

                this.$content.empty().append(view.$el);
            },

            /**
             * @private
             */
            _renderHeader: function () {
                this.header = new HeaderView();

                this.$('.c-header').append(
                    this.header.render().$el
                );
            }
        });

    return Layout;
});
