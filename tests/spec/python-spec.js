// An editor needs to be instantiated *before* the tests are run so the
// snippets are created so they can be referenced within the tests. Yay
// JavaScript. :-(
$('body').append('<div id="fooeditor"></div>');
var faux_editor = pythonEditor('fooeditor');


// Test suite for the pythonEditor object.
describe("An editor for MicroPython on the BBC micro:bit:", function() {

    describe("The editor initialises as expected.", function() {

        beforeEach(function() {
            $('body').append('<div id="editor"></div>');
        });

        afterEach(function() {
            $('#editor').remove();
        });

        it("The editor is associated with the referenced div.", function() {
            var editor = pythonEditor('editor');
            // An editor object is created
            expect(editor).toBeDefined();
            // The div with the id='editor' has been trapped for editing.
            var dom_editor = $('#editor');
            expect(dom_editor.children().length).toBeGreaterThan(0);
            // It references the expected classes.
            var editorClasses = dom_editor.attr('class');
            expect(editorClasses.indexOf('ace_editor')).toBeGreaterThan(-1);
            expect(editorClasses.indexOf('ace-kr-theme')).toBeGreaterThan(-1);
            expect(editorClasses.indexOf('ace_dark')).toBeGreaterThan(-1);
        });

        it("The expected theme is kr_theme.", function() {
            var editor = pythonEditor('editor');
            expect(editor.ACE.getTheme()).toEqual('ace/theme/kr_theme_legacy');
        });

        it("The editor mode is set to 'Python'.", function() {
            var editor = pythonEditor('editor');
            expect(editor.ACE.getOption('mode')).toEqual('ace/mode/python_microbit');
        });

        it("Snippets are enabled.", function() {
            var editor = pythonEditor('editor');
            expect(editor.ACE.getOption('enableSnippets')).toBe(true);
        });

        it("A tab is the same as 4 spaces.", function() {
            var editor = pythonEditor('editor');
            expect(editor.ACE.getOption('tabSize')).toBe(4);
        });

        it("A tab is 'soft'.", function() {
            var editor = pythonEditor('editor');
            expect(editor.ACE.getOption('useSoftTabs')).toBe(true);
        });
    });

    describe("Getting and setting Python scripts is possible.", function() {

        var editor;
        var dom_editor;

        beforeEach(function() {
            $('body').append('<div id="editor"></div>');
            editor = pythonEditor('editor');
            dom_editor = $('#editor');
        });

        afterEach(function() {
            $('#editor').remove();
        });

        it("It's possible to set / get the code to be edited.", function() {
            expect(editor.getCode()).toBe('');
            var code = "print('Hello, World!')";
            editor.setCode(code);
            expect(editor.getCode()).toBe(code);
        });

        it("The editor can be given focus.", function() {
            editor.focus();
            expect(document.activeElement.className).toEqual('ace_text-input');
        });
    });

    describe("Change events are handled as specified.", function() {

        var editor;
        var mock;

        beforeEach(function() {
            $('body').append('<div id="editor"></div>');
            editor = pythonEditor('editor');

            mock = {
                handler: function(){ return null;}
            };

            spyOn(mock, 'handler');
            editor.on_change(mock.handler);
            editor.setCode('foo');
        });

        afterEach(function() {
            $('#editor').remove();
        });

        it("The editor calls the referenced function when the text changes.",
           function() {
           expect(mock.handler).toHaveBeenCalled();
        });
    });

    describe("Code snippets function as expected.", function() {

        var editor;
        var snippetManager;

        beforeEach(function() {
            $('body').append('<div id="editor"></div>');
            editor = pythonEditor('editor');
            snippetManager = ace.require("ace/snippets").snippetManager;
            spyOn(snippetManager, 'insertSnippet');
        });

        afterEach(function() {
            $('#editor').remove();
        });

        it("The editor returns all available snippet objects.", function() {
            var result = editor.getSnippets();
            expect(result.length).toBeGreaterThan(0);
        });

        it("It is possible to trigger an existing named snippet.", function() {
            var snippets = editor.getSnippets();
            var snippet = snippets[0];
            editor.triggerSnippet(snippet.name);
            expect(snippetManager.insertSnippet).toHaveBeenCalled();
            expect(snippetManager.insertSnippet.calls.count()).toBe(1);
            var call = snippetManager.insertSnippet.calls.argsFor(0);
            expect(call[0]).toBe(editor.ACE);
            expect(call[1]).toBe(snippet.content);
        });

        it("The editor will ignore unknown snippet names.", function() {
            editor.triggerSnippet('foo');
            expect(snippetManager.insertSnippet.calls.count()).toBe(0);
        });
    });

    describe("It's possible to generate a hex file.", function() {

        var editor;
        var template_hex = ":1000000000400020ED530100295401002B54010051\n" +
                ":::::::::::::::::::::::::::::::::::::::::::\n" +
                ":00000001FF\n";

        beforeEach(function() {
            $('body').append('<div id="editor"></div>');
            editor = pythonEditor('editor');
        });

        afterEach(function() {
            $('#editor').remove();
        });

        it("The editor complains if the Python script is greater than 8k in length.", function() {
            var hex_fail = function() {
                // Keep in mind the 4 Bytes header
                var codeLen = (8 * 1024) - 4 + 1;
                var result = microbitFs.addIntelHexAppendedScript(template_hex, new Array(codeLen + 1).join('a'));
            };
            expect(hex_fail).toThrowError(RangeError, 'Too long');
        });

        it("The editor is fine if the Python script is 8k in length.", function() {
            var codeLen = (8 * 1024) - 4;
            var hexified = microbitFs.addIntelHexAppendedScript(template_hex, new Array(codeLen + 1).join('a'));
            expect(hexified).not.toBe(null);
        });

        it("A hex file is generated from the script and template firmware.",
           function() {
            editor.setCode('display.scroll("Hello")');
            var result = microbitFs.addIntelHexAppendedScript(template_hex, editor.getCode());
            var expected = ":020000040000FA\n" +
                ":1000000000400020ED530100295401002B54010051\n" +
                ":020000040003F7\n" +
                ":10E000004D501700646973706C61792E7363726F81\n" +
                ":10E010006C6C282248656C6C6F222900000000009F\n" +
                ":00000001FF\n";
            expect(result).toEqual(expected);
        });
    });

    describe("It's possible to extract scripts from a hex file.", function() {

        var editor;

        beforeEach(function() {
            $('body').append('<div id="editor"></div>');
            editor = pythonEditor('editor');
        });

        afterEach(function() {
            $('#editor').remove();
        });

        it("The editor converts from Intel's hex format to text", function() {
            var raw_hex = ":020000040003F7\n" +
                ":10E000004D501700646973706C61792E7363726F81\n" +
                ":10E010006C6C282248656C6C6F222900000000009F\n" +
                ":00000001FF\n";
            var result = microbitFs.getIntelHexAppendedScript(raw_hex);
            var expected = 'display.scroll("Hello")';
            expect(result).toEqual(expected);
        });

        it("A script is extracted from a hex file.", function() {
            var raw_hex = ":10E000004D500B004D6963726F507974686F6E00EC\n" +
                ":020000040003F7\n" +
                ":10B2C00021620100E1780100198001000190010074\n" +
                ":04B2D0000D0100006C\n" +
                ":020000040003F7\n" +
                ":10E000004D501700646973706C61792E7363726F81\n" +
                ":10E010006C6C282248656C6C6F222900000000009F\n" +
                ":04000005000153EDB6\n" +
                ":00000001FF";
            var result = microbitFs.getIntelHexAppendedScript(raw_hex);
            var expected = 'display.scroll("Hello")';
            expect(result).toEqual(expected);
        });

        it("If no script in hex, return empty string.", function() {
            var raw_hex = ":10E000004D500B004D6963726F507974686F6E00EC\n" +
                ":10B2C00021620100E1780100198001000190010074\n" +
                ":04B2D0000D0100006C\n" +
                ":04000005000153EDB6\n" +
                ":00000001FF";
            var result = microbitFs.getIntelHexAppendedScript(raw_hex);
            var expected = '';
            expect(result).toEqual(expected);
        });
    });
});
