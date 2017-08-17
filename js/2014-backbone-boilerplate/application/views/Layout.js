define([
    'underscore',

    'views/BaseView',

    'text!./_tmpl/Layout.html'
], function (_, BaseView, tmplData) {
    "use strict";

    return BaseView.extend({
        name: 'layout',
        template: tmplData,

        activeView: null,

        $content: '.c-content',

        initialize: function (options) {
            options || (options = {});
            BaseView.prototype.initialize.call(this, options);

            this.listenTo(this.mediator, this.mediator.EVENT_VIEW_CHANGE, this.changeView);
        },

        render: function () {
            BaseView.prototype.render.call(this);

            _.isString(this.$content) && (this.$content = this.$(this.$content));

            return this;
        },

        changeView: function (View, args) {
            args || (args = []);

            this.activeView && this.activeView.remove();
            this.activeView = new View();

            if (!this.activeView.load) {
                this.renderCurrentView();

                return;
            }

            this.activeView.load.apply(this.activeView, args)
                .bind(this)
                .then(this.renderCurrentView);
        },

        renderCurrentView: function () {
            var view = this.activeView.render();

            this.$content.empty().append(view.$el);
        }
    });
});
