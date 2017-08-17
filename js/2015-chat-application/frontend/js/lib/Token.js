define([
    'underscore'
], function (_) {
    "use strict";

    /**
     * @class
     * @classdesc Stub functionality to manage security tokens
     */
    var Token = function () {
    };

    _.extend(Token.prototype,
        /** @lends Token.prototype */
        {
            readToken: function () {
                return null;
            }
        }
    );

    return Token;
});
