define([
    'backbone',
    'underscore',
    'jquery',

    'services/mediatorService'
], function (Backbone, _, $, mediator) {
    "use strict";

    return Backbone.View.extend({
        name: 'baseView',
        template: null,

        mediator: mediator,

        cache: null,

        initialize: function (options) {
            Backbone.View.prototype.initialize.call(this, options);

            this.template = $(this.template);

            this.cache = {};
        },

        renderTemplate: function (id, data) {
            data || (data = {});

            var result;
            if (this.cache[id]) {
                result = this.cache[id](data)
            } else {
                var tmplRaw = _.find(this.template, function (v) {
                    return v['id'] == id;
                });

                if (tmplRaw) {
                    var tmpl = _.template(tmplRaw.innerHTML);
                    result = tmpl(data);

                    this.cache[id] = tmpl;
                } else {
                    result = '#' + this.name + 'no template#';
                }
            }


            result = $.trim(result);
            return $(result);
        },

        render: function (data, tmplId) {
            data || (data = {});
            tmplId || (tmplId = 'content');

            this.$el.html(
                this.renderTemplate(tmplId, data)
            );

            return this;
        },

        remove: function () {
            this.trigger('Removed');

            Backbone.View.prototype.remove.call(this);
        }
    });
});
