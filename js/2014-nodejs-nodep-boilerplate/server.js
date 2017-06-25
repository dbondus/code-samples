"use strict";

var path = require('path'),
	http = require('http'),
	routes = require('./application/configs/routes'),
    Router = require('./application/Router/Router'),
    staticFiles = require('./application/Router/middlewares/staticFiles');

var router = new Router(
	routes,
    path.join(__dirname, 'application/controllers')
);
router.middleware(staticFiles(path.join(__dirname, 'public'), ['js', 'css', 'html']));

http.createServer(
	router.requestHandler.bind(router)
)
.listen(3001);

