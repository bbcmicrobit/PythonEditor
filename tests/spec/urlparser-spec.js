/**
 * Test for URL Parameter parsing
 */


let defaultUrl = "https://python.microbit.org/v/1.1"; 
describe("Testing different URL formats", () => {
    test("Check if no Parameter is recognised", () =>{
        expect(global.urlparse("parameter", defaultUrl) === undefined).toBeTruthy();
    });
    test("Check if URL fragments are ignored", ()=>{
        expect(global.urlparse("anchor", defaultUrl + "#anchor") === undefined).toBeTruthy();
    });
    test("Check if parameter is recognised", () =>{
        expect(global.urlparse("key", defaultUrl + "?key=value1") === "value1").toBeTruthy();
    });
    test("Check if more than one parameter affects result", () =>{
        expect(global.urlparse("key1", defaultUrl + "?key1=value1&key2=value2") === "value1").toBeTruthy();
    });
    test("Check if more than one url parameter affects result and that URL fragments are ignored", ()=>{
        expect(global.urlparse("key2", defaultUrl + "?key1=value1&key2=value2#anchor") === "value2").toBeTruthy();
    });
    test("Check if incomplete url fragments (just contain keys) and a URL fragments work", ()=>{
        expect(global.urlparse("key2", defaultUrl + "?key1&key2#anchor") === null).toBeTruthy();
    });
    test("Check if incomplete URL parameter returns null", ()=>{
        expect(global.urlparse("anchor", defaultUrl + "?key1=") === null).toBeTruthy();
    });
    test("Check if a URL parameter followed by an ampersand returns correct value", ()=>{
        expect(global.urlparse("key1", defaultUrl + "?key1=value&")).toBe("value");
    });
    test("Check if an incomplete URL parameter followed by an ampersand returns undefined", ()=>{
        expect(global.urlparse("key1", defaultUrl + "?key1=&")).toBe(null);
    });
    test("Check if an incomplete URL parameter followed by an ampersand and a URL fragment returns undefined", ()=>{
        expect(global.urlparse("key1", defaultUrl + "?key1=&#anchor")).toBe(null);
    });
})