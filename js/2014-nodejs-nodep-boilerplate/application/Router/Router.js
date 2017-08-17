"use strict";

var path = require('path'),
    url = require('url'),
    BaseClass = require('../BaseClass.js');

var routeParamOptional = /\((.*?)\)/g,
    routeParamNamed = /(\(\?)?:\w+/g,
    routeParamWildcard = /\*\w+/g,
    escapeRegExpSymbols = /[\-{}\[\]+?.,\\\^$|#\s]/g;

var Router = BaseClass.extend({
    routes: null,
    middlewares: null,

    controllers: null,
    controllersPath: null,

    initialize: function (routes, controllersPath) {
        this.middlewares = [];
        this.routes = {};

        this.controllers = {};
        this.controllersPath = controllersPath;

        this.initRouteMethods();

        if (!routes) {
            return;
        }

        routes.forEach(function (route) {
            route.method || (route.method = 'get');

            if (!this[route.method]) {
                throw new Error(route.method + 'is not supported [' + route.path + ']');
            }

            this[route.method](route.path, route.handler, route.defaults, route.isStatic);
        }.bind(this));
    },

    middleware: function (middleware) {
        this.middlewares.push(middleware);
    },

    initRouteMethods: function () {
        ["GET", "POST", "PUT", "DELETE", "PATCH"].forEach(function (method) {
            this.routes[method] = [];

            this[method.toLowerCase()] = function (path, handler, defaults, isStatic) {
                var route = {
                    path: path,
                    defaults: defaults,

                    handler: handler
                };

                if (typeof handler === 'string') {
                    handler = this.parseController(handler);

                    route.handler = this.prepareControllerAction(
                        this.resolveController(handler.controller),
                        handler.action
                    );
                }

                if (!isStatic) {
                    var patternData = this.compilePattern(path);

                    route.pattern = patternData.pattern;
                    route.tokens = patternData.tokens;
                }

                this.routes[method].push(route);

                return this;
            };
        }.bind(this));
    },

    parseController: function (data) {
        var pair = data.split(':');

        return {
            controller: pair[0],
            action: pair[1]
                ? pair[1]
                : 'index'
        }
    },

    resolveController: function (controller) {
        if (!controller) {
            throw new Error('controller definition error: ' + controller);
        }

        if (!this.controllers[controller]) {
            var Controller = require(this.controllersPath + '/' + controller);
            this.controllers[controller] = new Controller();
        }

        this.controllers[controller].name = controller;

        return this.controllers[controller];
    },

    prepareControllerAction: function (controller, action) {
        if (!controller[action]) {
            throw new Error('controller [' + controller.name + '] action definition error: ' + action);
        }

        return controller[action].bind(controller);
    },

    compilePattern: function (path) {
        var tokens = [],
            pattern = path.replace(escapeRegExpSymbols, '\\$&')
                .replace(routeParamOptional, '(?:$1)?')
                .replace(routeParamNamed, function (match, optional) {
                    tokens.push(match.substring(1));

                    return optional
                        ? match
                        : '([^/?]+)';
                });

        if (routeParamWildcard.test(pattern)) {
            pattern = '^' + pattern.replace(routeParamWildcard, function (match) {
                tokens.push(match.substring(1));

                return '([^?]*)';
            });
        } else {
            pattern = '^' + pattern + '/?(?:\\?(?:[\\s\\S]*))?$'
        }

        return {
            pattern: new RegExp(pattern),
            tokens: tokens
        };
    },

    requestHandler: function (req, res) {
        this.applyMiddlewares(req, res)
            .then(function (isHandled) {
                if (isHandled) {
                    return;
                }

                this.collectParams(req)
                    .then(function (params) {
                        this.handleRoute(req, res, params.query, params.body);
                    }.bind(this))
                    .catch(function (e) {
                        console.log('route processing error', e);

                        res.writeHead(500);
                        res.end();
                    });
            }.bind(this))
    },

    applyMiddlewares: function (req, res) {
        var middlewares = this.middlewares;

        return new Promise(function (resolve, reject) {
            if (!middlewares.length) {
                resolve();
                return;
            }

            var idx = 0;

            function next(stop) {
                if (stop || idx >= middlewares.length) {
                    resolve(stop);
                    return;
                }

                middlewares[idx++](req, res)
                    .then(next)
                    .catch(reject);
            }

            next();
        });
    },

    collectParams: function (req) {
        var query = url.parse(req.url, true).query,
            isJSON = (req.headers['content-type'] && req.headers['content-type'].indexOf('application/json') > -1);

        return new Promise(function (resolve, reject) {
            if (req.method === "GET") {
                resolve({
                    query: query,
                    body: {}
                });
                return;
            }

            var bodyBuffer;
            req.on('data', function (chunk) {
                bodyBuffer.push(chunk);
            });

            req.on('error', reject);

            req.on('end', function () {
                var body = null;

                if (isJSON) {
                    try {
                        body = JSON.parse(bodyBuffer.join('')) || {};
                    }
                    catch (e) {
                    }
                } else {
                    body = url.parse('?' + bodyBuffer.join(''), true).query;
                }

                resolve({
                    query: query,
                    body: body
                });
            });
        });
    },

    handleRoute: function (req, res, query, body) {
        if (!this.routes[req.method]) {
            res.writeHeader(404);
            res.end('not found');

            return;
        }

        var reqPath = url.parse(req.url).pathname;
        if (reqPath.length > 1 && reqPath.charAt(reqPath.length - 1) === '/') {
            reqPath = reqPath.substr(0, reqPath.length - 1)
        }

        var matches = this.routes[req.method].filter(function (route) {
            return route.pattern
                ? route.pattern.test(req.url)
                : route.path === reqPath;
        });

        var route = matches.length
            ? matches.pop()
            : null;

        if (route) {
            var routeParams = {};
            route.pattern && route.pattern.exec(req.url).slice(1).forEach(function (param, idx) {
                if (!param) {
                    return;
                }

                routeParams[route.tokens[idx]] = decodeURIComponent(param);
            });

            route.handler(req, res, {
                routeParams: routeParams,
                query: query,
                body: body
            });
            return;
        }

        res.writeHeader(404);
        res.end('not found');
    }
});

module.exports = Router;
