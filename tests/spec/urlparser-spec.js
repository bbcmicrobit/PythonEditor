/**
 * Test for URL Parameter parsing
 */


var defaultUrl = "https://python.microbit.org/v/1.1"; 
describe("Testing different URL formats", () => {
    test("Check if no Parameter is recognised", () =>{
        expect(global.urlparse("parameter", defaultUrl)).toBeUndefined();
    });
    test("Check if URL fragments are ignored", ()=>{
        expect(global.urlparse("anchor", defaultUrl + "#anchor")).toBeUndefined();
    });
    test("Check if parameter is recognised", () =>{
        expect(global.urlparse("key", defaultUrl + "?key=value1")).toEqual("value1");
    });
    test("Check if both parameters return correct result", () =>{
        var url = defaultUrl + "?key1=value1&key2=value2";
        expect(global.urlparse("key1", url)).toEqual("value1");
        expect(global.urlparse("key2", url)).toEqual("value2");
    });
    test("Check if more than one url parameter affects result and that URL fragments are ignored", ()=>{
        expect(global.urlparse("key2", defaultUrl + "?key1=value1&key2=value2#anchor")).toEqual("value2");
    });
    test("Check if incomplete url fragments (just contain keys) and a URL fragments work", ()=>{
        expect(global.urlparse("key2", defaultUrl + "?key1&key2#anchor")).toBeNull();
    });
    test("Check if incomplete URL parameter returns null", ()=>{
        expect(global.urlparse("key1", defaultUrl + "?key1=")).toBeNull();
    });
    test("Check if a URL parameter followed by an ampersand returns correct value", ()=>{
        expect(global.urlparse("key1", defaultUrl + "?key1=value&")).toBe("value");
    });
    test("Check if an incomplete URL parameter followed by an ampersand returns undefined", ()=>{
        expect(global.urlparse("key1", defaultUrl + "?key1=&")).toBeNull();
    });
    test("Check if an incomplete URL parameter followed by an ampersand and a URL fragment returns undefined", ()=>{
        expect(global.urlparse("key1", defaultUrl + "?key1=&#anchor")).toBeNull();
    });
    test("Check if a URL parameter value of 0 returns string '0'", ()=>{
        expect(global.urlparse("key1", defaultUrl + "?key1=0")).toBe("0");
    });
    test("Check if a URL parameter value of null returns string 'null'", ()=>{
        expect(global.urlparse("key1", defaultUrl + "?key1=null")).toBe("null");
    });
    test("Check if a URL parameter value of undefined returns string 'undefined'", ()=>{
        expect(global.urlparse("key1", defaultUrl + "?key1=undefined")).toBe("undefined");
    });
    test("Check if incomplete URL parameter with url fragment returns null", ()=>{
        expect(global.urlparse("key1", defaultUrl + "?key1=#anchor")).toBeNull();
    });
    test("Check if same key set twice returns last value", ()=>{
        expect(global.urlparse("key1", defaultUrl + "?key1=value1&key1=value2")).toBe("value2");
    });
    test("Check if both url parameter keys return the correct value", ()=>{
        expect(global.urlparse("key1", defaultUrl + "?key1=value1&key2=value2") === "value1" && 
        global.urlparse("key2", defaultUrl + "?key1=value1&key2=value2") === "value2").toBeTruthy();
    });
    test("Check if a non-existent key with existing key returns undefined", ()=>{
        expect(global.urlparse("notpresent", defaultUrl + "?key1=value1")).toBeUndefined();
    });
});