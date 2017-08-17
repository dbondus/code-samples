define([
    'backbone',
    'underscore',

    'utils/promise',
    'utils/token'
], function (Backbone, _, promise, token) {
    return Backbone.Model.extend({
        sync: function (method, model, options) {
            var currentToken = token.readToken();

            if (currentToken) {
                options.headers = _.extend({}, options.headers, {
                    Authorization: 'Token token=' + currentToken
                });
            }

            return Backbone.Model.prototype.sync.call(this, method, model, options);
        },

        save: function (key, val, options) {
            return promise.resolve(Backbone.Model.prototype.save.call(this, key, val, options));
        },

        fetch: function (options) {
            return promise.resolve(Backbone.Model.prototype.fetch.call(this, options));
        },

        destroy: function (options) {
            return promise.resolve(Backbone.Model.prototype.destroy.call(this, options));
        }
    });
});
