var http = require('http'),
    cfg = require('./cfg'),
    misc = require('./misc'),
    routes = require('./routes');

// Create a new HTTP server
http.createServer(function (request, result) {
    var file = misc.getRequestedFile(request);
    console.log("SRV: " + request.url);
    var stopRouting = false;
    for(var i = 0, l = routes.length; !stopRouting && i < l; i++ ){
        if (routes[i].filter.test(file) && false === routes[i].action(request, result)) {
            stopRouting = true;
        }
    }

}).listen(cfg.port, cfg.uri);
console.log('Server running at http://' + cfg.uri + ':' + cfg.port + '/');



