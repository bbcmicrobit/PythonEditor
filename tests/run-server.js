// "Setup" tests by starting local server
// See https://jestjs.io/docs/en/configuration.html#globalsetup-string
var http = require('http');
var nStatic = require('node-static');

module.exports = async () => {
    fileServer = new nStatic.Server('../');
    global.localServer = http.createServer(function (req, res) {
        fileServer.serve(req, res);
    }).listen(5000);
}
