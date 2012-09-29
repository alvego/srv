var url = require('url'),
    path = require('path'),
    mime = require('./mime'),
    cfg = require('./cfg');

module.exports = {
    getRequestedFile : function(request){
        return path.join(path.join(__dirname, cfg.public_path), url.parse(request.url).pathname.replace(/\.\.\//g, '').substring(1) || 'index.html');
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







