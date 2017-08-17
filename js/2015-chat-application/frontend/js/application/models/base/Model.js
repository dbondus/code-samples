define([
    'backbone',
    'lib/Promise',
    'services/token',
    'underscore'
], function (Backbone, Promise, token, _) {
    "use strict";

    /**
     * @class
     * @classdesc Base model
     */
    var Model = Backbone.Model.extend(
        /** @lends Model.prototype */
        {

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

                return Backbone.Model.prototype.sync.call(this, method, model, options);
            },

            /**
             * Sends data to server. Patched to return promise instead of jquery's deferred
             *
             * @param {(string|object)} key
             * @param {object} val
             * @param [options]
             *
             * @override
             */
            save: function (key, val, options) {
                return Promise.resolve(Backbone.Model.prototype.save.call(this, key, val, options));
            },

            /**
             * Fetches data from server. Patched to return promise instead of jquery's deferred
             *
             * @param {object} [options]
             *
             * @override
             */
            fetch: function (options) {
                return Promise.resolve(Backbone.Model.prototype.fetch.call(this, options));
            },

            /**
             * Handles destroy operations and may send DELETE request to server. Patched to return promise instead of jquery's deferred
             *
             * @param {object} [options]
             *
             * @override
             */
            destroy: function (options) {
                return Promise.resolve(Backbone.Model.prototype.destroy.call(this, options));
            }
        });

    return Model;
});
