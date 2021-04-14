/**
 * The goal of this spec file is to test in Internet Explorer via Jasmin
 * tests.html file a few of the polyfills we know are used in the editor.
 * These are mostly coming via microbit-fs library.
 * 
 * In the past the build pipeline has somehow failed to include some of the
 * polyfills (in one case the minifier has also affected this). So having a
 * few tests here as a sanity check.
 * 
 * Useful links:
 * https://kangax.github.io/compat-table/es6/
 * https://caniuse.com/?search=es6
 */

describe("Check (some) ES6 features work.", function() {
    /* Currently not used in microbit-fs
    it("String.prototype.startsWith()", function() {
        expect('random string'.startsWith('random')).toBeTruthy();
    });
    */
    it("String.prototype.endsWith()", function() {
        expect('random string'.endsWith('string')).toBeTruthy();
    });

    it("String.prototype.includes()", function() {
        expect('random string'.includes('m s')).toBeTruthy();
    });

    it("isNaN()", function() {
        expect(isNaN('100F')).toBeTruthy();
    });
    /* Currently not used in microbit-fs
    it("Number.parseInt()", function() {
        expect(Number.parseInt(' 0xF', 16)).toEqual(15);
    });
    */
    it("Array.prototype.fill()", function() {
        var array1 = [1, 2, 3, 4];
        array1.fill(0, 2, 4)
        expect(array1).toEqual([1, 2, 0, 0]);
    });
    /* Currently not used in microbit-fs
    it("Array.prototype.find()", function() {
        var array1 = [5, 12, 8, 130, 44];
        var found = array1.find(function(element) {
            return element > 10
        });
        expect(found).toEqual(12);
    });
    */
    /* Currently not used in microbit-fs
    it("Array.prototype.findIndex()", function() {
        var array1 = [5, 12, 8, 130, 44];
        var isLargeNumber = array1.findIndex(function(element) {
            return element > 13
        });
        expect(isLargeNumber).toEqual(3);
    });
    */
});
