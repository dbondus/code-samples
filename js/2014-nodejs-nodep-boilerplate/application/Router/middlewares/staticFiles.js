"use strict";

var fs = require('fs'),
    path = require('path'),
    http = require('http'),
    url = require('url');

var mime = {
    js: "application/javascript",
    jpg: "image/jpeg",
    png: "image/png",
    css: "text/css",
    html: "text/html; charset=utf-8"
};

module.exports = function (root, fileTypes) {
    fileTypes || (fileTypes = ['jpg', 'png', 'js', 'css', 'html']);

    return function (req, res) {
        return new Promise(function (resolve, reject) {
            if (req.method !== "GET") {
                resolve();
                return;
            }

            var filePath = url.parse(req.url).pathname;

            var fileNameParts = path.extname(filePath).split("."),
                extName = fileNameParts[fileNameParts.length - 1] || false;

            if (!extName || fileTypes.indexOf(extName) === -1) {
                resolve();
                return;
            }

            filePath = path.join(root, filePath);

            fs.stat(filePath, function (e, stat) {
                if (e) {
                    res.writeHeader(404);
                    res.end('not found');
                    resolve(true);
                    return;
                }

                if (stat.isFile()) {
                    res.writeHead(200, {
                        'Content-Type': mime[extName] || 'application/octet-stream',
                        'Content-Length': stat.size
                    });

                    fs.createReadStream(filePath).pipe(res);
                    resolve(true);
                    return;
                }

                resolve();
            });

        });
    };
};
