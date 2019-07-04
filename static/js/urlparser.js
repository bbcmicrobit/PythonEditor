function getUrlParam(key){
    var urlParams = new URLSearchParams(window.location.search);
    var param = urlParams.get(key);
    if(param === null){
        console.log("that url parameter key does not exist");
        return;
    }
    return param;
}