"use strict";
var BaseClass = require('../BaseClass.js');

var Controller = BaseClass.extend({
    name: null,

    json: function (res, data) {
        res.writeHeader(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(data));
    },

    ok: function (res, msg) {
        msg || (msg = 'OK');

        res.writeHeader(200);
        res.end(msg);
    },

    throw500: function (res, msg) {
        msg || (msg = 'error');

        res.writeHeader(500);
        res.end(msg);
    },

    throw404: function (res, msg) {
        msg || (msg = 'error');

        res.writeHeader(404);
        res.end(msg);
    }
});

module.exports = Controller;
