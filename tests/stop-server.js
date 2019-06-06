// "Teardown" tests by stopping local server
// See https://jestjs.io/docs/en/configuration.html#globalteardown-string
module.exports = async () => {
    global.localServer.close();
}