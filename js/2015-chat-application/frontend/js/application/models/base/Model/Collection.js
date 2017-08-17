define([
    'backbone',
    '../Model',

    'lib/Promise',
    'services/token',
    'underscore'
], function (Backbone, Model, Promise, token, _) {
    "use strict";

    /**
     * @class
     * @classdesc Base collection
     */
    var Collection = Backbone.Collection.extend(
        /** @lends Collection.prototype */
        {
            /**
             * @type {Model}
             */
            model: Model,

            /**
             * Fetches data from server. Patched to return promise instead of jquery's deferred
             *
             * @param {object} [options]
             * @override
             */
            fetch: function (options) {
                return Promise.resolve(
                    Backbone.Collection.prototype.fetch.call(this, options)
                );
            },

            /**
             * Handles network activity. Patched to handle security tokens
             *
             * @param {Function} method
             * @param {object} model
             * @param {object} [options]
             * @returns {xhr}
             *
             * @override
             */
            sync: function (method, model, options) {
                var currentToken = token.readToken();

                if (currentToken) {
                    options.headers = _.extend({}, options.headers, {
                        Authorization: 'Token token=' + currentToken
                    });
                }
                return Backbone.Collection.prototype.sync.call(this, method, model, options);
            }
        });

    return Collection;
});
