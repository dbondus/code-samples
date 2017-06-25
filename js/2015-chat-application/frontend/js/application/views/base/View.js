define([
    'services/mediator',
    'lib/Renderer',

    'underscore',
    'backbone'
], function(mediator, Renderer, _, Backbone) {
    "use strict";

    /**
     * @class
     * @classdesc Base view
     * @extends Backbone.View
     */
    var View = Backbone.View.extend(
        /** @lends View.prototype */
        {
        name: 'baseView',
        template: null,

        /**
         * @type {Mediator}
         */
        mediator: mediator,

        /**
         * @type {(Renderer|Function)}
         */
        renderer: Renderer,

        initialize: function(options) {
            Backbone.View.prototype.initialize.call(this, options);

            this._collectInheritedEvents();

            this.renderer = new this.renderer(this.template);
        },

        /**
         * @param {string} id
         * @param {object} [data]
         * @returns {string}
         */
        renderTemplate: function(id, data) {
            var result = this.renderer.render(id, data);

            return result.replace(/^\s+|\s+$/gm, '');
        },

        /**
         * @param {object} [data]
         * @param {string} [templateId='content']
         * @returns {View}
         */
        render: function(data, templateId) {
            data || (data = {});
            templateId || (templateId = 'content');

            this.$el.html(
                this.renderTemplate(templateId, data)
            );

            return this;
        },

        /**
         * @fires View~EVENT_DESTROY
         * @override
         */
        remove: function() {
            this.trigger(this.EVENT_DESTROY);

            Backbone.View.prototype.remove.call(this);
        },

        /**
         * Merge DOM events of the whole prototype chain
         *
         * @private
         */
        _collectInheritedEvents: function() {
            var constructor = this.constructor;
            while(constructor.__super__) {
                _.extend(this.events, constructor.__super__.events);

                constructor = constructor.__super__.constructor;
            }
        },

        /**
         * View removal notification
         *
         * @event View#EVENT_DESTROY
         * @type {object}
         */
        EVENT_DESTROY: 'destroy'
    });

    return View;
});
