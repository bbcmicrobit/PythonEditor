/*
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
    editor.initialFontSize = 22;
    editor.fontSizeStep = 4;

    // Represents the ACE based editor.
    var ACE = ace.edit(id);  // The editor is in the tag with the referenced id.
    ACE.setOptions({
        enableSnippets: true  // Enable code snippets.
    })
    ACE.setTheme("ace/theme/kr_theme");  // Make it look nice.
    ACE.getSession().setMode("ace/mode/python");  // We're editing Python.
    ACE.getSession().setTabSize(4); // Tab=4 spaces.
    ACE.getSession().setUseSoftTabs(true); // Tabs are really spaces.
    ACE.setFontSize(editor.initialFontSize);
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
        // check data.length < 0x2000
        if(data.length > 8192) {
            throw new RangeError('Too long');
        }
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

    // Given a password and some plaintext, will return an encrypted version.
    editor.encrypt = function(password, plaintext) {
        var key_size = 24;
        var iv_size = 8;
        var salt = forge.random.getBytesSync(8);
        var derived_bytes = forge.pbe.opensslDeriveBytes(password, salt, key_size + iv_size);
        var buffer = forge.util.createBuffer(derived_bytes);
        var key = buffer.getBytes(key_size);
        var iv = buffer.getBytes(iv_size);
        var cipher = forge.cipher.createCipher('AES-CBC', key);
        cipher.start({iv: iv});
        cipher.update(forge.util.createBuffer(plaintext, 'binary'));
        cipher.finish();
        var output = forge.util.createBuffer();
        output.putBytes('Salted__');
        output.putBytes(salt);
        output.putBuffer(cipher.output);
        return encodeURIComponent(btoa(output.getBytes()));
    }

    // Given a password and cyphertext will return the decrypted plaintext.
    editor.decrypt = function(password, cyphertext) {
        var input = atob(decodeURIComponent(cyphertext));
        input = forge.util.createBuffer(input, 'binary');
        input.getBytes('Salted__'.length);
        var salt = input.getBytes(8);
        var key_size = 24;
        var iv_size = 8;
        var derived_bytes = forge.pbe.opensslDeriveBytes(password, salt, key_size + iv_size);
        var buffer = forge.util.createBuffer(derived_bytes);
        var key = buffer.getBytes(key_size);
        var iv = buffer.getBytes(iv_size);
        var decipher = forge.cipher.createDecipher('AES-CBC', key);
        decipher.start({iv: iv});
        decipher.update(input);
        var result = decipher.finish();
        return decipher.output.getBytes();
    }

    return editor;
};

/*
The following code contains the various functions that connect the behaviour of
the editor to the DOM (web-page).

See the comments in-line for more information.
*/
function web_editor(config) {

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
        return EDITOR.ACE.getFontSize();
    }

    // Set the font size of the text currently displayed in the editor.
    function setFontSize(size) {
        EDITOR.ACE.setFontSize(size);
    }

    // Sets up the zoom-in functionality.
    function zoomIn() {
        var continueZooming = true;
        // Change editor zoom
        var fontSize = getFontSize();
        fontSize += EDITOR.fontSizeStep;
        var fontSizeLimit = EDITOR.initialFontSize + (EDITOR.fontSizeStep * 6);
        if (fontSize > fontSizeLimit) {
            fontSize = fontSizeLimit;
            continueZooming = false;
        }
        setFontSize(fontSize);
        // Change Blockly zoom
        var workspace = Blockly.getMainWorkspace();
        if (workspace && continueZooming) {
            Blockly.getMainWorkspace().zoomCenter(1);
        }
    };

    // Sets up the zoom-out functionality.
    function zoomOut() {
        var continueZooming = true;
        // Change editor zoom
        var fontSize = getFontSize();
        fontSize -= EDITOR.fontSizeStep;
        var fontSizeLimit = EDITOR.initialFontSize - (EDITOR.fontSizeStep * 3);
        if(fontSize < fontSizeLimit) {
            fontSize = fontSizeLimit;
            continueZooming = false;
        }
        setFontSize(fontSize);
        // Change Blockly zoom
        var workspace = Blockly.getMainWorkspace();
        if (workspace && continueZooming) {
            Blockly.getMainWorkspace().zoomCenter(-1);
        }
    };

    // Checks for feature flags in the config object and shows/hides UI
    // elements as required.
    function setupFeatureFlags() {
        if(config.flags.blocks) {
            $("#command-blockly").removeClass('hidden');
        }
        if(config.flags.snippets) {
            $("#command-snippet").removeClass('hidden');
        }
        if(config.flags.share) {
            $("#command-share").removeClass('hidden');
        }
    };

    // This function is called to initialise the editor. It sets things up so
    // the user sees their code or, in the case of a new program, uses some
    // sane defaults.
    function setupEditor(message) {
        // Set version in document title
        document.title = document.title + ' ' + VERSION;
        // Setup the Ace editor.
        EDITOR = pythonEditor('editor');
        if(message.n && message.c && message.s) {
            var template = $('#decrypt-template').html();
            Mustache.parse(template);
            var context = config.translate.decrypt;
            if (message.h) {
                context.hint = '(Hint: ' + decodeURIComponent(message.h) + ')';
            }
            vex.open({
                content: Mustache.render(template, context)
            })
            $('#button-decrypt-link').click(function() {
                var password = $('#passphrase').val();
                setName(EDITOR.decrypt(password, message.n));
                setDescription(EDITOR.decrypt(password, message.c));
                EDITOR.setCode(EDITOR.decrypt(password, message.s));
                vex.close();
                EDITOR.focus();
            });
        } else {
            // If there's no name, default to something sensible.
            setName("microbit")
            // If there's no description, default to something sensible.
            setDescription("A MicroPython script");
            // A sane default starting point for a new script.
            EDITOR.setCode(config.translate.code.start);
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
                var confirmationMessage = config.translate.confirms.quit;
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
        try {
            var output = EDITOR.getHexFile(firmware);
        } catch(e) {
            alert(config.translate.alerts.length);
            return;
        }
        var ua = navigator.userAgent.toLowerCase();
        if((ua.indexOf('safari/') > -1) && (ua.indexOf('chrome') == -1)) {
            alert(config.translate.alerts.download);
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
            alert(config.translate.alerts.save);
            window.open('data:application/octet;charset=utf-8,' + encodeURIComponent(output), '_newtab');
        } else {
            var filename = getName().replace(" ", "_");
            var blob = new Blob([output], {type: "text/plain"});
            saveAs(blob, filename + ".py");
        }
        dirty = false;
    }

    // Describes what to do when the load button is clicked.
    function doLoad() {
        var template = $('#load-template').html();
        Mustache.parse(template);
        vex.open({
            content: Mustache.render(template, config.translate.load),
            afterOpen: function(vexContent) {
                $(vexContent).find('#load-drag-target').on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                })
                .on('dragover dragenter', function() {
                    $('#load-drag-target').addClass('is-dragover');
                })
                .on('dragleave dragend drop', function() {
                    $('#load-drag-target').removeClass('is-dragover');
                })
                .on('drop', function(e) {
                    doDrop(e);
                    vex.close();
                    EDITOR.focus();
                });
                $(vexContent).find('#load-form-form').on('submit', function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    if(e.target[0].files.length === 1) {
                        var f = e.target[0].files[0];
                        var ext = (/[.]/.exec(f.name)) ? /[^.]+$/.exec(f.name) : null;
                        var reader = new FileReader();
                        if (ext == 'py') {
                            setName(f.name.replace('.py', ''));
                            setDescription(config.translate.drop.python);
                            reader.onload = function(e) {
                                EDITOR.setCode(e.target.result);
                            }
                            reader.readAsText(f);
                            EDITOR.ACE.gotoLine(EDITOR.ACE.session.getLength());
                        } else if (ext == 'hex') {
                            setName(f.name.replace('.hex', ''));
                            setDescription(config.translate.drop.hex);
                            reader.onload = function(e) {
                                var code = EDITOR.extractScript(e.target.result);
                                if(code.length < 8192) {
                                    EDITOR.setCode(code);
                                }
                            }
                            reader.readAsText(f);
                            EDITOR.ACE.gotoLine(EDITOR.ACE.session.getLength());
                        }
                    }
                    vex.close();
                    EDITOR.focus();
                    return false;
                });
            }
        })
        $('.load-toggle').on('click', function(e) {
            $('.load-drag-target').toggle();
            $('.load-form').toggle();
        });
    }

    // Triggered when a user clicks the blockly button. Toggles blocks on/off.
    function doBlockly() {
        var blockly = $('#blockly');
        if(blockly.is(':visible')) {
            dirty = false;
            blockly.hide();
            $('#editor').attr('title', '');
            editor.ACE.setReadOnly(false);
            $("#command-snippet").removeClass('disabled');
            $("#command-snippet").off('click');
            $("#command-snippet").click(function () {
              doSnippets();
            });
        } else {
            if(dirty) {
                if(!confirm(config.translate.confirms.blocks)) {
                    return;
                }
            }
            editor.ACE.setReadOnly(true);
            $('#editor').attr('title', 'The code editor is read-only when blocks are active.');
            $("#command-snippet").off('click');
            $("#command-snippet").click(function () {
              alert(config.translate.alerts.snippets);
            });
            $("#command-snippet").addClass('disabled');
            blockly.show();
            blockly.css('width', '33%');
            blockly.css('height', '100%');
            if(blockly.find('div.injectionDiv').length === 0) {
                // Calculate initial zoom level
                var zoomScaleSteps = 0.2;
                var fontSteps = (getFontSize() - EDITOR.initialFontSize) / EDITOR.fontSizeStep;
                var zoomLevel = (fontSteps * zoomScaleSteps) + 1.0;
                var workspace = Blockly.inject('blockly', {
                    toolbox: document.getElementById('blockly-toolbox'),
                    zoom: {
                        controls: false,
                        wheel: false,
                        startScale: zoomLevel,
                        scaleSpeed: zoomScaleSteps + 1.0
                    }
                });
                function myUpdateFunction(event) {
                    var code = Blockly.Python.workspaceToCode(workspace);
                    EDITOR.setCode(code);
                }
                // Resize blockly
                var element = document.getElementById('blockly');
                new ResizeSensor(element, function() {
                    Blockly.svgResize(workspace);
                });
                workspace.addChangeListener(myUpdateFunction);
            }
            // Set editor to current state of blocks.
            EDITOR.setCode(Blockly.Python.workspaceToCode(workspace));
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
            'title': config.translate.code_snippets.title,
            'description': config.translate.code_snippets.description,
            'instructions': config.translate.code_snippets.instructions,
            'trigger_heading': config.translate.code_snippets.trigger_heading,
            'description_heading': config.translate.code_snippets.description_heading,
            'snippets': snippetManager.snippetMap.python,
            'describe': function() {
                return function(text, render) {
                    var name = render(text);
                    var trigger = name.split(' - ')[0];
                    return config.translate.code_snippets[trigger];
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
        vex.open({
            content: Mustache.render(template, config.translate.share)
        })
        $('#passphrase').focus();
        $('#button-create-link').click(function() {
            var password = $('#passphrase').val();
            var hint = $('#hint').val();
            var qs_array = [];
            // Name
            qs_array.push('n=' + EDITOR.encrypt(password, getName()));
            // Comment
            qs_array.push('c=' + EDITOR.encrypt(password, getDescription()));
            // Source
            qs_array.push('s=' + EDITOR.encrypt(password, EDITOR.getCode()));
            // Hint
            qs_array.push('h=' + encodeURIComponent(hint));
            var old_url = window.location.href.split('?');
            var new_url = old_url[0].replace('#', '') + '?' + qs_array.join('&');
            $('#make-link').hide();
            $('#direct-link').val(new_url);
            $('#share-link').show();
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
                $('#short-link').attr('href', data.id);
                $('#short-link').text(data.id);
                $('#shortener').show();
            });
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
            setDescription(config.translate.drop.python);
            reader.onload = function(e) {
                EDITOR.setCode(e.target.result);
            }
            reader.readAsText(file);
            EDITOR.ACE.gotoLine(EDITOR.ACE.session.getLength());
        } else if (ext == 'hex') {
            setName(file.name.replace('.hex', ''));
            setDescription(config.translate.drop.hex);
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

    // Join up the buttons in the user interface with some functions for
    // handling what to do when they're clicked.
    function setupButtons() {
        $("#command-download").click(function () {
            doDownload();
        });
        $("#command-save").click(function () {
            doSave();
        });
        $("#command-load").click(function () {
            doLoad();
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

    // Extracts the query string and turns it into an object of key/value
    // pairs.
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

    // Checks if this is the latest version of the editor. If not display an
    // appropriate message.
    function checkVersion(qs) {
        $.getJSON('../manifest.json').done(function(data) {
            if(data.latest === VERSION) {
                // Already at the latest version, so ignore.
                return;
            } else {
                // This isn't the latest version. Display the message bar with
                // helpful information.
                if(qs.force) {
                    // The inbound link tells us to force use of this editor.
                    // DO SOMETHING APPROPRIATE HERE? IF ANYTHING?
                }
                var template = $('#messagebar-template').html();
                Mustache.parse(template);
                var context = config.translate.messagebar;
                var messagebar = $('#messagebar');
                messagebar.html(Mustache.render(template, context))
                messagebar.show();
                $('#messagebar-link').attr('href',
                                           window.location.href.replace(VERSION, data.latest));
                $('#messagebar-close').on('click', function(e) {
                    $('#messagebar').hide();
                });
            }
        });
    }

    var qs = get_qs_context()
    setupFeatureFlags();
    setupEditor(qs);
    checkVersion(qs);
    setupButtons();
};

