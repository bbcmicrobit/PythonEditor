function getUrlParam(key) {
    var urlParams = window.location.search.split("?")[1];
    var value = null;
    urlParams = urlParams.split("&");
    urlParams.forEach(function (param) {
        let parameter = {
            key: param.split("=")[0],
            value: param.split("=")[1]
        }
        if (parameter.key === key) {
            value = parameter.value;
        }
    });
    return value;
};