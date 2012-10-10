var http = require('http'),
    cfg = require('./cfg'),
    misc = require('./misc'),
    routes = require('./routes');

// Create a new HTTP server
http.createServer(function (request, response) {
    var file = misc.getRequestedFile(request);
    console.log("SRV: " + misc.getRequestedPath(request));
    var stopRouting = false;
    for (var i = 0, l = routes.length; !stopRouting && i < l; i++) {
        if (routes[i].filter.test(request.url) && false === routes[i].action(request, response)) {
            stopRouting = true;
        }
    }

}).listen(cfg.port, cfg.uri);
console.log('Server running at http://' + cfg.uri + ':' + cfg.port + '/');
