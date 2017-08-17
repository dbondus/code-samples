define([
    'bluebird'
], function (Bluebird) {
    Bluebird.onPossiblyUnhandledRejection(function (e) {
        console.error(e.message, 'in', e.fileName);

        throw e;
    });

    return Bluebird;
});
