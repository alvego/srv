var
    misc = require('./misc'),
    path = require('path'),
    jade = require('jade'),
    less = require('less'),
    fs = require('fs');



function defaultAction(request, result){
    var file = misc.getRequestedFile(request);
    console.log('defaultAction', file);
    fs.readFile(file, function (err, data) {
        if (err) {
            misc.sendNotFound(result, file);
            console.log("ERR: Couldn't find " + file + ", returning 404!");
            return false;
        }
        misc.sendHead(result, file);
        result.end(data);
        return false;
    });
}

function cssAction(request, result){
    var file = misc.getRequestedFile(request);
    console.log('cssAction', file);
    var lessFile = file.replace(/.css$/, '.less');
    if (fs.existsSync(lessFile)){

        var lessErr = function(err){
            console.log(err);
            misc.sendHead(result, file);
            var message = 'LESS ' + err.type + ' Error: ' + err.message.replace('\'', '`') + ' (file '+ err.filename + ', line ' + err.line + ')';
            result.end( 'body:before { color:red; content:\'' + message + '\'; }');
        };

        var cssCode = fs.readFileSync(lessFile, 'utf8');
        new(less.Parser)({
            paths: [path.dirname(file)],
            filename:path.basename(lessFile),
            optimization: 0
        }).parse(cssCode, function (err, tree) {
            if (err) {
               lessErr(err);
            } else {
                try {
                    var css = tree.toCSS();
                    misc.sendHead(result, file);
                    result.end(css);
                } catch (e) {
                    lessErr(err);
                }
            }
        });
        return false;
    }
}

function htmlAction(request, result){
    var file = misc.getRequestedFile(request);
    console.log('htmlAction', file);
    var jadeFile = file.replace(/.html$/, '.jade');
    if (fs.existsSync(jadeFile)){
        try {
            var jadeCode = fs.readFileSync(jadeFile, 'utf8');
            var fn = jade.compile(
                jadeCode,
                {   pretty: true,
                    debug: false,
                    compileDebug: true,
                    filename: jadeFile
                }
            );
            var html = fn();
            misc.sendHead(result, file);
            result.end(html);
        } catch(e){
            misc.sendHead(result, '.txt');
            result.end(e.message);
        }
        return false;
    }
}

function banAction(request, result){
    var file = misc.getRequestedFile(request);
    console.log('banAction', file);
    misc.sendNotFound(result, file);
    return false;
}

module.exports = [
    { filter: /.*\.(jade|less)$/, action: banAction  },
    { filter: /.*\.html$/, action: htmlAction  },
    { filter: /.*\.css$/, action: cssAction  },
    { filter: /.*/, action: defaultAction  }
];
