define([
    'bluebird'
], function (Bluebird) {
    "use strict";

    Bluebird.onPossiblyUnhandledRejection(function (e) {
        console.error(e.message, 'in', e.fileName);

        throw e;
    });

    /**
     * @class
     * @classdesc Bridge to promise system
     */
    var Promise = function (resolver) {
        Bluebird.call(this, resolver);
    };

    Promise.resolve = function (object) {
        return Bluebird.resolve(object);
    };

    return Promise;
});
