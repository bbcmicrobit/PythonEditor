var urlparse = 
    function getUrlParam(key, url) {
        if (url === undefined) {
            url = window.location.search;
        }
        var urlParams = url.split("?")[1];
        if (urlParams === undefined) {
            return;
        }
        if(urlParams.match(/#/)){ 
            //Removes anchor/url fragments from the end of the url
           urlParams = urlParams.slice(0,urlParams.indexOf('#'));
        }
        var value = null;
        urlParams = urlParams.split("&");
        urlParams.forEach(function (param) {
            let parameter = {
                key: param.split("=")[0],
                value: param.split("=")[1]
            }
            if (parameter.key === key) {
                value = parameter.value || null;
            }
        });
        return value;
    };

if (typeof module !== 'undefined' && module.exports) {
    global.urlparse = urlparse;
}