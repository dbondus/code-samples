"use strict";

var Base = require('./BaseController');
var fs = require('fs');

module.exports = Base.extend({
    index: function (req, res, params) {
        var path = './public/index.html',
            stat = fs.statSync(path);

        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': stat.size
        });

        var readStream = fs.createReadStream(path);
        readStream.pipe(res);
    },

    getTasks: function (req, res, params) {
        this.ok(res, JSON.stringify(params.query));
    },

    createTask: function (req, res, params) {
        this.ok(res, params.routeParams.id || 'done');
    },

    updateTask: function (req, res, params) {
        this.ok(res, params.routeParams.id);
    },

    destroyTask: function (req, res, params) {
        this.ok(res, params.routeParams.id);
    }
});
