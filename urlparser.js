/**
 * 
 * function searches the url parameters to find the specified key
 * before returning the value associated with that key in string form.
 * 
 * If the key is found but no value is assigned (e.g. ?key1=) the value
 * returned will be null
 * 
 * If the key is not found the value returned will be undefined.
 * 
 * @param {string} key Specifies the key to search for in the Url parameters  
 * @param {string} url Specifies custom url to search for the key for (implemented for testing)
 * 
 * If key is found and value exists, returns string
 * If key is found and value does not exist, returns null
 * If no key is found, returns undefined
 */

var urlparse = 
    function getUrlParam(key, url) {
        if (url === undefined) {
            url = window.location.href;
        }
        var urlParams = url.split("?")[1];
        if (urlParams === undefined) {
            return;
        }
        if(urlParams.match(/#/)){ 
            //Removes anchor/url fragments from the end of the url
           urlParams = urlParams.slice(0,urlParams.indexOf('#'));
        }
        var value = undefined;
        urlParams = urlParams.split("&");
        urlParams.forEach(function (param) {
            var parameter = {
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