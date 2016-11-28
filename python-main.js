/*
0.0.7

A simple editor that targets MicroPython for the BBC micro:bit.

Feel free to have a look around! (We've commented the code so you can see what
everything does.)
*/

/*
Returns an object that defines the behaviour of the Python editor. The editor
is attached to the div with the referenced id.
*/
function pythonEditor(id) {
    // An object that encapsulates the behaviour of the editor.
    editor = {};

    // Represents the ACE based editor.
    var ACE = ace.edit(id);  // The editor is in the tag with the referenced id.
    ACE.setOptions({
        enableSnippets: true  // Enable code snippets.
    })
    ACE.setTheme("ace/theme/kr_theme");  // Make it look nice.
    ACE.getSession().setMode("ace/mode/python");  // We're editing Python.
    ACE.getSession().setTabSize(4); // Tab=4 spaces.
    ACE.getSession().setUseSoftTabs(true); // Tabs are really spaces.
    editor.ACE = ACE;

    // Gets the textual content of the editor (i.e. what the user has written).
    editor.getCode = function() {
        return ACE.getValue();
    };

    // Sets the textual content of the editor (i.e. the Python script).
    editor.setCode = function(code) {
        ACE.setValue(code);
    };

    // Give the editor user input focus.
    editor.focus = function() {
        ACE.focus();
    }

    // Set a handler function to be run if code in the editor changes.
    editor.on_change = function(handler) {
        ACE.getSession().on('change', handler);
    };

    // Return details of all the snippets this editor knows about.
    editor.getSnippets = function() {
        var snippetManager = ace.require("ace/snippets").snippetManager;
        return snippetManager.snippetMap.python;
    };

    // Triggers a snippet by name in the editor.
    editor.triggerSnippet = function(snippet) {
        var snippetManager = ace.require("ace/snippets").snippetManager;
        var snippet = snippetManager.snippetNameMap.python[snippet];
        if(snippet) {
            snippetManager.insertSnippet(ACE, snippet.content);
        }
    };

    /*
    Turn a Python script into Intel HEX format to be concatenated at the
    end of the MicroPython firmware.hex.  A simple header is added to the
    script.

    - takes a Python script as a string
    - returns hexlified string, with newlines between lines
    */
    editor.hexlify = function(script) {
        function hexlify(ar) {
            var result = '';
            for (var i = 0; i < ar.length; ++i) {
                if (ar[i] < 16) {
                    result += '0';
                }
                result += ar[i].toString(16);
            }
            return result;
        }
        // add header, pad to multiple of 16 bytes
        data = new Uint8Array(4 + script.length + (16 - (4 + script.length) % 16));
        data[0] = 77; // 'M'
        data[1] = 80; // 'P'
        data[2] = script.length & 0xff;
        data[3] = (script.length >> 8) & 0xff;
        for (var i = 0; i < script.length; ++i) {
            data[4 + i] = script.charCodeAt(i);
        }
        // TODO check data.length < 0x2000
        // convert to .hex format
        var addr = 0x3e000; // magic start address in flash
        var chunk = new Uint8Array(5 + 16);
        var output = [];
        for (var i = 0; i < data.length; i += 16, addr += 16) {
            chunk[0] = 16; // length of data section
            chunk[1] = (addr >> 8) & 0xff; // high byte of 16-bit addr
            chunk[2] = addr & 0xff; // low byte of 16-bit addr
            chunk[3] = 0; // type (data)
            for (var j = 0; j < 16; ++j) {
                chunk[4 + j] = data[i + j];
            }
            var checksum = 0;
            for (var j = 0; j < 4 + 16; ++j) {
                checksum += chunk[j];
            }
            chunk[4 + 16] = (-checksum) & 0xff;
            output.push(':' + hexlify(chunk).toUpperCase())
        }
        return output.join('\n');
    };

    // Generates a hex file containing the user's Python from the firmware.
    editor.getHexFile = function(firmware) {
        var hexlified_python = this.hexlify(this.getCode());
        var insertion_point = ":::::::::::::::::::::::::::::::::::::::::::";
        return firmware.replace(insertion_point, hexlified_python);
    }

    // Takes a hex blob and turns it into a decoded string.
    editor.unhexlify = function(data) {

        var hex2str = function(str) {
            var result = '';
            for (var i=0, l=str.length; i<l; i+=2) {
                result += String.fromCharCode(parseInt(str.substr(i, 2), 16));
            }
            return result;
        };

        var lines = data.trimRight().split(/\r?\n/);
        if (lines.length > 0) {
            var output = [];
            for (var i=0; i<lines.length; i++) {
                var line = lines[i];
                output.push(hex2str(line.slice(9, -2)));
            }
            output[0] = output[0].slice(4);
            var last = output.length - 1;
            output[last] = output[last].replace(/\0/g, '');
            return output.join('');
        } else {
            return '';
        }
    }

    // Given an existing hex file, return the Python script contained therein.
    editor.extractScript = function(hexfile) {
        var hex_lines = hexfile.trimRight().split(/\r?\n/);
        var start_line = hex_lines.lastIndexOf(':020000040003F7');
        if (start_line > 0) {
            var lines = hex_lines.slice(start_line + 1, -2);
            var blob = lines.join('\n');
            if (blob=='') {
                return '';
            } else {
                return this.unhexlify(blob);
            }
        } else {
            return '';
        }
    }

    return editor;
};

/*
The following code contains the various functions that connect the behaviour of
the editor to the DOM (web-page).

See the comments in-line for more information.
*/
function web_editor() {

    // Indicates if there are unsaved changes to the content of the editor.
    var dirty = false;

    // Sets the description associated with the code displayed in the UI.
    function setDescription(x) {
        $("#script-description").text(x);
    }

    // Sets the name associated with the code displayed in the UI.
    function setName(x) {
        $("#script-name").text(x);
    }

    // Gets the description associated with the code displayed in the UI.
    function getDescription() {
        return $("#script-description").text();
    }

    // Gets the name associated with the code displayed in the UI.
    function getName() {
        return $("#script-name").text();
    }

    // Get the font size of the text currently displayed in the editor.
    function getFontSize() {
        return parseInt($('#editor').css('font-size'));
    }

    // Set the font size of the text currently displayed in the editor.
    function setFontSize(size) {
        $('#editor').css('font-size', size + 'px');
    }

    // Sets up the zoom-in functionality.
    function zoomIn() {
        var fontSize = getFontSize();
        fontSize += 8;
        if(fontSize > 46) {
            fontSize = 46;
        }
        setFontSize(fontSize);
    };

    // Sets up the zoom-out functionality.
    function zoomOut() {
        var fontSize = getFontSize();
        fontSize -= 8;
        if(fontSize < 22) {
            fontSize = 22;
        }
        setFontSize(fontSize);
    };

    // This function is called by TouchDevelop to cause the editor to be initialised. It sets things up so the user sees their code or, in the case of a new program, uses some sane defaults.
    function setupEditor(message) {
        // Setup the Ace editor.
        EDITOR = pythonEditor('editor');
        if(!message.name) {
            // If there's no name, default to something sensible.
            setName("microbit")
        } else {
            setName(message.name);
        }
        if (!message.comment) {
            // If there's no description, default to something sensible.
            setDescription("A MicroPython script");
        } else {
            setDescription(message.comment);
        }
        if(message.code && message.code.length > 0) {
            EDITOR.setCode(message.code);
        } else {
            // A sane default starting point for a new script.
            EDITOR.setCode("# Add your Python code here. E.g.\n" +
                "from microbit import *\n\n\n" +
                "while True:\n" +
                "    display.scroll('Hello, World!')\n" +
                "    display.show(Image.HEART)\n" +
                "    sleep(2000)\n");
        }
        EDITOR.ACE.gotoLine(EDITOR.ACE.session.getLength());
        // Configure the zoom related buttons.
        $("#zoom-in").click(function (e) {
            e.stopPropagation();
            zoomIn();
        });
        $("#zoom-out").click(function (e) {
            e.stopPropagation();
            zoomOut();
        });
        window.setTimeout(function () {
            // What to do if the user changes the content of the editor.
            EDITOR.on_change(function () {
                dirty = true;
            });
        }, 1);
        // Handles what to do if the name is changed.
        $("#script-name").on("input keyup blur", function () {
            dirty = true;
        });
        // Handles what to do if the description is changed.
        $("#script-description").on("input keyup blur", function () {
            dirty = true;
        });
        // Describes what to do if the user attempts to close the editor without first saving their work.
        window.addEventListener("beforeunload", function (e) {
            if (dirty) {
                var confirmationMessage = "Some of your changes have not been saved. Quit anyway?";
                (e || window.event).returnValue = confirmationMessage;
                return confirmationMessage;
            }
        });
        // Bind the ESCAPE key.
        $(document).keyup(function(e) {
            if (e.keyCode == 27) { // ESCAPE
                $('#link-log').focus();
            }
        });
        // Bind drag and drop into editor.
        $('#editor').on('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
        $('#editor').on('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
        $('#editor').on('drop', doDrop);
        // Focus on the element with TAB-STATE=1
        $("#command-download").focus();
    }

    // This function describes what to do when the download button is clicked.
    function doDownload() {
        var firmware = $("#firmware").text();
        var output = EDITOR.getHexFile(firmware);
        var ua = navigator.userAgent.toLowerCase();
        if((ua.indexOf('safari/') > -1) && (ua.indexOf('chrome') == -1)) {
            alert("Safari has a bug that means your work will be downloaded as an un-named file. Please rename it to something ending in .hex. Alternatively, use a browser such as Firefox or Chrome. They do not suffer from this bug.");
            window.open('data:application/octet;charset=utf-8,' + encodeURIComponent(output), '_newtab');
        } else {
            var filename = getName().replace(" ", "_");
            var blob = new Blob([output], {type: "application/octet-stream"});
            saveAs(blob, filename + ".hex");
        }
    }

    // This function describes what to do when the save button is clicked.
    function doSave() {
        var output = EDITOR.getCode();
        var ua = navigator.userAgent.toLowerCase();
        if((ua.indexOf('safari/') > -1) && (ua.indexOf('chrome') == -1)) {
            alert("Safari has a bug that means your work will be downloaded as an un-named file. Please rename it to something ending in .py. Alternatively, use a browser such as Firefox or Chrome. They do not suffer from this bug.");
            window.open('data:application/octet;charset=utf-8,' + encodeURIComponent(output), '_newtab');
        } else {
            var filename = getName().replace(" ", "_");
            var blob = new Blob([output], {type: "text/plain"});
            saveAs(blob, filename + ".py");
        }
        dirty = false;
    }

    function doBlockly() {
        // Triggered when a user clicks the blockly button. Toggles blocks on/off.
        var blockly = $('#blockly');
        if(blockly.is(':visible')) {
            dirty = false;
            blockly.hide();
            editor.ACE.setReadOnly(false);
        } else {
            if(dirty) {
                var msg = "You have unsaved code. Using blocks will change your code. You may lose your changes. Do you want to continue?";
                if(!confirm(msg)) {
                    return;
                }
            }
            editor.ACE.setReadOnly(true);
            blockly.show();
            blockly.css('width', '33%');
            blockly.css('height', '100%');
            if(blockly.find('div.injectionDiv').length === 0) {
                var workspace = Blockly.inject('blockly', {
                    toolbox: document.getElementById('blockly-toolbox')
                });
                function myUpdateFunction(event) {
                    var code = Blockly.Python.workspaceToCode(workspace);
                    EDITOR.setCode(code);
                }
                workspace.addChangeListener(myUpdateFunction);
            }
        };
    }

    // This function describes what to do when the snippets button is clicked.
    function doSnippets() {
        // Snippets are triggered by typing a keyword followed by pressing TAB.
        // For example, type "wh" followed by TAB.
        var snippetManager = ace.require("ace/snippets").snippetManager;
        var template = $('#snippet-template').html();
        Mustache.parse(template);
        var context = {
            'snippets': snippetManager.snippetMap.python,
            'describe': function() {
                return function(text, render) {
                    name = render(text);
                    description = name.substring(name.indexOf(' - '),
                                                 name.length);
                    return description.replace(' - ', '');
                }
            }
        }
        vex.open({
            content: Mustache.render(template, context),
            afterOpen: function(vexContent) {
                $(vexContent).find('.snippet-selection').click(function(e){
                    var snippet_name = $(this).find('.snippet-name').text();
                    EDITOR.triggerSnippet(snippet_name);
                    vex.close();
                    EDITOR.focus();
                });
            }
        });
    }

    function doShare() {
        // Triggered when the user wants to generate a link to share their code.
        var template = $('#share-template').html();
        Mustache.parse(template);
        var qs_array = [];
        qs_array.push('name=' + encodeURIComponent(getName()));
        qs_array.push('comment=' + encodeURIComponent(getDescription()));
        qs_array.push('code=' + encodeURIComponent(EDITOR.getCode()));
        var old_url = window.location.href.split('?');
        var new_url = old_url[0].replace('#', '') + '?' + qs_array.join('&');
        // shortener API
        var url = "https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyB2_Cwh5lKUX4a681ZERd3FAt8ijdwbukk";
        $.ajax(url, {
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify({
                longUrl: new_url
            })
        }).done(function( data ) {
            console.log(data);
            vex.open({
                content: Mustache.render(template, {})
            })
            $('#direct-link').attr('href', data.id);
            $('#direct-link').text(data.id);
            $('#twitter-button').html('<a href="https://twitter.com/share" class="twitter-share-button" data-url="' + data.id +'" data-text="Check out this cool MicroPython script! :-)" data-via="ntoll" data-hashtags="bbcmicrobit" data-dnt="true">Tweet</a>');
            $('#facebook-button').attr('src', 'https://www.facebook.com/plugins/share_button.php?href=' + encodeURIComponent(data.id) + '&layout=button&size=small&mobile_iframe=true&width=59&height=20&appId');
            twttr.widgets.load();
        });
    }

    function doDrop(e) {
        // Triggered when a user drops a file onto the editor.
        e.stopPropagation();
        e.preventDefault();
        var file = e.originalEvent.dataTransfer.files[0];
        var ext = (/[.]/.exec(file.name)) ? /[^.]+$/.exec(file.name) : null;
        var reader = new FileReader();
        if (ext == 'py') {
            setName(file.name.replace('.py', ''));
            setDescription('Extracted from a Python file');
            reader.onload = function(e) {
                EDITOR.setCode(e.target.result);
            }
            reader.readAsText(file);
            EDITOR.ACE.gotoLine(EDITOR.ACE.session.getLength());
        } else if (ext == 'hex') {
            setName(file.name.replace('.hex', ''));
            setDescription('Extracted from a hex file');
            reader.onload = function(e) {
                var code = EDITOR.extractScript(e.target.result);
                if (code.length < 8192) {
                    EDITOR.setCode(code);
                }
            }
            reader.readAsText(file);
            EDITOR.ACE.gotoLine(EDITOR.ACE.session.getLength());
        }
        $('#editor').focus();
    }

    // Join up the buttons in the user interface with some functions for handling what to do when they're clicked.
    function setupButtons() {
        $("#command-download").click(function () {
            doDownload();
        });
        $("#command-save").click(function () {
            doSave();
        });
        $("#command-blockly").click(function () {
            doBlockly();
        });
        $("#command-snippet").click(function () {
            doSnippets();
        });
        $("#command-share").click(function () {
            doShare();
        });
    }

    // Extracts the query string and turns it into an object of key/value pairs.
    function get_qs_context() {
        var query_string = window.location.search.substring(1);
        if(window.location.href.indexOf("file://") == 0 ) {
            // Running from the local file system so switch off network share.
            $('#command-share').hide();
            return {};
        }
        var kv_pairs = query_string.split('&');
        var result = {};
        for (var i = 0; i < kv_pairs.length; i++) {
            var kv_pair = kv_pairs[i].split('=');
            result[kv_pair[0]] = decodeURIComponent(kv_pair[1]);
        }
        return result;
    }

    setupEditor(get_qs_context());
    setupButtons();
};

// Call the web_editor function to start the editor running.
web_editor();
