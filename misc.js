var url = require('url'),
    path = require('path'),
    mime = require('./mime'),
    cfg = require('./cfg');

module.exports = {
    getRequestedFile : function(request){
        var pathName = url.parse(request.url).pathname;
        pathName = pathName.replace('../', '');
        if (pathName.slice(-1) === '/') {
            pathName = path.join(pathName, 'index.html');
        }
        return path.join(cfg.public_path, pathName);
    },

    sendNotFound: function(result){
        result.writeHead(404, {
            "Content-Type":"text/plain"
        });
        result.end("404 Not Found\n");
    },

    sendHead: function SendHead(result, file){
        result.writeHead(200, {
            'Content-Type':mime(file),
            'Access-Control-Allow-Origin':'*'
        });
    }

};







