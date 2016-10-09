// An editor needs to be instantiated *before* the tests are run so the
// snippets are created so they can be referenced within the tests. Yay
// JavaScript. :-(
var faux_editor = pythonEditor('fooeditor');


// Test suite for the pythonEditor object.
describe("An editor for MicroPython on the BBC micro:bit:", function() {

    describe("The editor initialises as expected.", function() {

        beforeEach(function() {
            affix("#editor");
        });

        it("The editor is associated with the referenced div.", function() {
            var editor = pythonEditor('editor');
            // An editor object is created
            expect(editor).toBeDefined();
            // The div with the id='editor' has been trapped for editing.
            var dom_editor = $('#editor');
            expect(dom_editor.children().length).toBeGreaterThan(0);
            // It references the expected classes.
            var expected_classes = ' ace_editor ace-kr-theme ace_dark';
            expect(dom_editor.attr('class')).toEqual(expected_classes);
        });

        it("The expected theme is kr_theme.", function() {
            var editor = pythonEditor('editor');
            expect(editor.ACE.getTheme()).toEqual('ace/theme/kr_theme');
        });

        it("The editor mode is set to 'Python'.", function() {
            var editor = pythonEditor('editor');
            expect(editor.ACE.getOption('mode')).toEqual('ace/mode/python');
        });

        it("Snippets are enabled.", function() {
            var editor = pythonEditor('editor');
            expect(editor.ACE.getOption('enableSnippets')).toBe(true);
        });

        it("A tab is the same as 4 spaces.", function() {
            var editor = pythonEditor('editor');
            expect(editor.ACE.getOption('tabSize')).toBe(4);
        })

        it("A tab is 'soft'.", function() {
            var editor = pythonEditor('editor');
            expect(editor.ACE.getOption('useSoftTabs')).toBe(true);
        });
    });

    describe("Getting and setting Python scripts is possible.", function() {

        var editor;
        var dom_editor;

        beforeEach(function() {
            affix("#editor");
            editor = pythonEditor('editor');
            dom_editor = $('#editor');
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
            affix("#editor");
            editor = pythonEditor('editor');

            mock = {
                handler: function(){ return null;}
            };

            spyOn(mock, 'handler');
            editor.on_change(mock.handler);
            editor.setCode('foo');
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
            affix("#editor");
            editor = pythonEditor('editor');
            snippetManager = ace.require("ace/snippets").snippetManager;
            spyOn(snippetManager, 'insertSnippet');
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

        beforeEach(function() {
            affix("#editor");
            editor = pythonEditor('editor');
        });

        it("The editor converts text into Intel's hex format.", function() {
            var hexified = editor.hexlify('display.scroll("Hello")');
            var expected = ':10E000004D501700646973706C61792E7363726F81\n' +
                ':10E010006C6C282248656C6C6F222900000000009F';
            expect(hexified).toEqual(expected);
        });

        it("A hex file is generated from the script and template firmware.",
           function() {
            var template_hex = ":10E000004D500B004D6963726F507974686F6E00EC\n" +
                ":::::::::::::::::::::::::::::::::::::::::::\n" +
                ":10E000004D500B004D6963726F507974686F6E00EC";
            editor.setCode('display.scroll("Hello")');
            var result = editor.getHexFile(template_hex);
            var expected = ":10E000004D500B004D6963726F507974686F6E00EC\n" +
                ":10E000004D501700646973706C61792E7363726F81\n" +
                ":10E010006C6C282248656C6C6F222900000000009F\n" +
                ":10E000004D500B004D6963726F507974686F6E00EC";
            expect(result).toEqual(expected);
        });
    });
});
