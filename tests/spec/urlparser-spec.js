/**
 * Test for URL Parameter parsing
 */
'use strict';

describe('Testing urlparse() with different URL formats', function() {
    var defaultUrl = 'https://python.microbit.org/v/1.1';

    it('No Parameter is recognised', () =>{
        expect(urlparse('parameter', defaultUrl)).toBeUndefined();
    });

    it('URL fragments are ignored', function() {
        expect(urlparse('anchor', defaultUrl + '#anchor')).toBeUndefined();
    });

    it('Parameter is recognised', function() {
        expect(urlparse('key', defaultUrl + '?key=value1')).toEqual('value1');
    });

    it('Both parameters return correct result', function() {
        var url = defaultUrl + '?key1=value1&key2=value2';
        expect(urlparse('key1', url)).toEqual('value1');
        expect(urlparse('key2', url)).toEqual('value2');
    });

    it('More than one url parameter affects result and that URL fragments are ignored', function() {
        expect(urlparse('key2', defaultUrl + '?key1=value1&key2=value2#anchor')).toEqual('value2');
    });

    it('Incomplete url fragments (just contain keys) and a URL fragments work', function() {
        expect(urlparse('key2', defaultUrl + '?key1&key2#anchor')).toBeNull();
    });

    it('Incomplete URL parameter returns null', function() {
        expect(urlparse('key1', defaultUrl + '?key1=')).toBeNull();
    });

    it('URL parameter followed by an ampersand returns correct value', function() {
        expect(urlparse('key1', defaultUrl + '?key1=value&')).toBe('value');
    });

    it('Incomplete URL parameter followed by an ampersand returns undefined', function() {
        expect(urlparse('key1', defaultUrl + '?key1=&')).toBeNull();
    });
    it('Incomplete URL parameter followed by an ampersand and a URL fragment returns undefined', function() {
        expect(urlparse('key1', defaultUrl + '?key1=&#anchor')).toBeNull();
    });

    it('URL parameter value of 0 returns string "0"', function() {
        expect(urlparse('key1', defaultUrl + '?key1=0')).toBe('0');
    });

    it('URL parameter value of null returns string "null"', function() {
        expect(urlparse('key1', defaultUrl + '?key1=null')).toBe('null');
    });

    it('URL parameter value of undefined returns string "undefined"', function() {
        expect(urlparse('key1', defaultUrl + '?key1=undefined')).toBe('undefined');
    });

    it('Incomplete URL parameter with url fragment returns null', function() {
        expect(urlparse('key1', defaultUrl + '?key1=#anchor')).toBeNull();
    });

    it('Check if same key set twice returns last value', function() {
        expect(urlparse('key1', defaultUrl + '?key1=value1&key1=value2')).toBe('value2');
    });

    it('Both url parameter keys return the correct value', function() {
        expect(urlparse('key1', defaultUrl + '?key1=value1&key2=value2') === 'value1' && 
        urlparse('key2', defaultUrl + '?key1=value1&key2=value2') === 'value2').toBeTruthy();
    });

    it('Non-existent key with existing key returns undefined', function() {
        expect(urlparse('notpresent', defaultUrl + '?key1=value1')).toBeUndefined();
    });
});
