define([
    'backbone',
    'underscore',

    './BaseModel',

    'utils/promise',
    'utils/token'
], function (Backbone, _, Model, promise, token) {
    return Backbone.Collection.extend({
        model: Model,

        fetch: function (options) {
            return promise.resolve(
                Backbone.Collection.prototype.fetch.call(this, options)
            );
        },

        sync: function (method, model, options) {
            var currentToken = token.readToken();

            if (currentToken) {
                options.headers = _.extend({}, options.headers, {
                    Authorization: 'Token token=' + currentToken
                });
            }
            return Backbone.Collection.prototype.sync.call(this, method, model, options)
        }
    });
});
