/*
A simple editor that targets MicroPython for the BBC micro:bit.

Feel free to have a look around! (We've commented the code so you can see what
everything does.)
*/

/*
Lazy load JS script files.
*/
function script(url) {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = false;
    s.defer = true;
    s.src = url;
    var x = document.getElementsByTagName('head')[0];
    x.appendChild(s);
}

/*
Returns an object that defines the behaviour of the Python editor. The editor
is attached to the div with the referenced id.
*/
function pythonEditor(id) {
    'use strict';

    // An object that encapsulates the behaviour of the editor.
    var editor = {};
    editor.initialFontSize = 22;
    editor.fontSizeStep = 4;

    // Represents the ACE based editor.
    var ACE = ace.edit(id);  // The editor is in the tag with the referenced id.
    ACE.setOptions({
        enableSnippets: true  // Enable code snippets.
    });
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
    };

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
        snippet = snippetManager.snippetNameMap.python[snippet];
        if (snippet) {
            snippetManager.insertSnippet(ACE, snippet.content);
        }
    };

    // Generates a hex file containing the user's Python from the firmware.
    editor.getHexFile = function(firmware) {
        return upyhex.injectPyStrIntoIntelHex(firmware, this.getCode());
    };

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
    };

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
    };

    return editor;
}
/* Attach to the global object if running in node */
if (typeof module !== 'undefined' && module.exports) {
    global.pythonEditor = pythonEditor;
}

/*
 * Returns an object to wrap around Blockly.
 */
function blocks() {
    'use strict';

    var blocklyWrapper = {};
    var resizeSensorInstance = null;
    // Stores the Blockly workspace created during injection 
    var workspace = null;

    blocklyWrapper.init = function() {
        // Lazy loading all the JS files
        script('blockly/blockly_compressed.js');
        script('blockly/blocks_compressed.js');
        script('blockly/python_compressed.js');
        script('microbit_blocks/blocks/microbit.js');
        script('microbit_blocks/generators/accelerometer.js');
        script('microbit_blocks/generators/buttons.js');
        script('microbit_blocks/generators/compass.js');
        script('microbit_blocks/generators/display.js');
        script('microbit_blocks/generators/image.js');
        script('microbit_blocks/generators/microbit.js');
        script('microbit_blocks/generators/music.js');
        script('microbit_blocks/generators/neopixel.js');
        script('microbit_blocks/generators/pins.js');
        script('microbit_blocks/generators/radio.js');
        script('microbit_blocks/generators/speech.js');
        script('microbit_blocks/generators/python.js');
        script('blockly/msg/js/en.js');
        script('microbit_blocks/messages/en/messages.js');
    };

    blocklyWrapper.inject = function(blocklyElement, toolboxElement, zoomLevel, zoomScaleSteps) {
        workspace = Blockly.inject(blocklyElement, {
            toolbox: toolboxElement,
            zoom: {
                controls: false,
                wheel: false,
                startScale: zoomLevel,
                scaleSpeed: zoomScaleSteps + 1.0
            }
        });
        // Resize blockly
        resizeSensorInstance = new ResizeSensor(blocklyElement, function() {
            Blockly.svgResize(workspace);
        });
    };

    blocklyWrapper.getCode = function() {
        return workspace ? Blockly.Python.workspaceToCode(workspace) : 'Blockly not injected';
    };

    blocklyWrapper.addCodeChangeListener = function(callback) {
        if (workspace) {
            workspace.addChangeListener(function(event) {
                var code = blocklyWrapper.getCode();
                callback(code);
            });
        } else {
            throw new Error('Trying to add a Blockly change listener before injection.');
        }
    };

    blocklyWrapper.zoomIn = function() {
        if (workspace) {
            Blockly.getMainWorkspace().zoomCenter(1);
        }
    };

    blocklyWrapper.zoomOut = function() {
        if (workspace) {
            Blockly.getMainWorkspace().zoomCenter(-1);
        }
    };

    return blocklyWrapper;
}

/*
The following code contains the various functions that connect the behaviour of
the editor to the DOM (web-page).

See the comments in-line for more information.
*/
function web_editor(config) {
    'use strict';

    // Global (useful for testing) instance of the ACE wrapper object
    window.EDITOR = pythonEditor('editor');

    var BLOCKS = blocks();

    // Represents the REPL terminal
    var REPL = null;

    // Indicates if there are unsaved changes to the content of the editor.
    var dirty = false;

    // Sets the name associated with the code displayed in the UI.
    function setName(x) {
        $("#script-name").val(x);
    }

    // Gets the name associated with the code displayed in the UI.
    function getName() {
        return $("#script-name").val();
    }

    // Get the font size of the text currently displayed in the editor.
    function getFontSize() {
        return EDITOR.ACE.getFontSize();
    }

    // Set the font size of the text currently displayed in the editor.
    function setFontSize(size) {
        EDITOR.ACE.setFontSize(size);
        $("#request-repl")[0].style.fontSize = "" + size + "px";

        // Only update font size if REPL is open
        if ($("#repl").css('display') != 'none') {
             REPL.prefs_.set('font-size', size);
        }
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
        if (continueZooming) {
            BLOCKS.zoomIn();
        }
    }

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
        if (continueZooming) {
            BLOCKS.zoomOut();
        }
    }

    // Checks for feature flags in the config object and shows/hides UI
    // elements as required.
    function setupFeatureFlags() {
        if(config.flags.blocks) {
            $("#command-blockly").removeClass('hidden');
            BLOCKS.init();
        }
        if(config.flags.snippets) {
            $("#command-snippet").removeClass('hidden');
        }
        if(config.flags.share) {
            $("#command-share").removeClass('hidden');
        }
        if(config.flags.experimental) {
            $("#known-issues").removeClass('hidden');
            EDITOR.ACE.renderer.scroller.style.backgroundImage = "url('static/img/experimental.png')";
        }
        if(config.flags.options) {
            $("#command-options").removeClass('hidden');
        }
        // Update the help link to pass feature flag information.
        var helpAnchor = $("#help-link");
        var featureQueryString = Object.keys(config.flags).filter(function(f) {
            return config.flags[f];
        }).map(function(f) {
            return encodeURIComponent(f) + "=true";
        }).join("&");
        helpAnchor.attr("href", helpAnchor.attr("href") + "?" + featureQueryString);

        if (navigator.usb) {
            script('static/js/dap.umd.js');
            script('static/js/hterm_all.js');
            $("#command-connect").removeClass('hidden');
            $("#command-serial").removeClass('hidden');
        }
    }

    // Update the docs link to append MicroPython version
    var docsAnchor = $("#docs-link");
    docsAnchor.attr("href", docsAnchor.attr("href") + "en/" + "v" + UPY_VERSION);

    // This function is called to initialise the editor. It sets things up so
    // the user sees their code or, in the case of a new program, uses some
    // sane defaults.
    function setupEditor(message, migration) {
        // Set version in document title
        document.title = document.title + ' ' + EDITOR_VERSION;
        // Setup the Ace editor.
        if(message.n && message.c && message.s) {
            var template = $('#decrypt-template').html();
            Mustache.parse(template);
            var context = config.translate.decrypt;
            if (message.h) {
                context.hint = '(Hint: ' + decodeURIComponent(message.h) + ')';
            }
            vex.open({
                content: Mustache.render(template, context)
            });
            $('#button-decrypt-link').click(function() {
                var password = $('#passphrase').val();
                setName(EDITOR.decrypt(password, message.n));
                EDITOR.setCode(EDITOR.decrypt(password, message.s));
                vex.close();
                EDITOR.focus();
            });
        } else if(migration != null){
            setName(migration.meta.name);
            EDITOR.setCode(migration.source);
            EDITOR.focus();
        } else {
            // If there's no name, default to something sensible.
            setName("microbit");
            // A sane default starting point for a new script.
            EDITOR.setCode(config.translate.code.start);
        }
        EDITOR.ACE.gotoLine(EDITOR.ACE.session.getLength());
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

    // Generates the text for a hex file with MicroPython and the user code
    function generateFullHexStr() {
        var firmware = $("#firmware").text();
        var fullHexStr = '';
        try {
            fullHexStr = EDITOR.getHexFile(firmware);
        } catch(e) {
            // We generate a user readable error here to be caught and displayed
            throw new Error(config.translate.alerts.length);
        }
        return fullHexStr;
    }

    // This function describes what to do when the download button is clicked.
    function doDownload() {
        try {
            var output = generateFullHexStr();
        } catch(e) {
            alert('Error:\n' + e.message);
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
                    // Dispatch an event to allow others to listen to it
                    var event = new CustomEvent("load-drop", { detail: e.originalEvent.dataTransfer.files[0] });
                    document.dispatchEvent(event);
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
                            reader.onload = function(e) {
                                EDITOR.setCode(e.target.result);
                            };
                            reader.readAsText(f);
                            EDITOR.ACE.gotoLine(EDITOR.ACE.session.getLength());
                        } else if (ext == 'hex') {
                            setName(f.name.replace('.hex', ''));
                            reader.onload = function(e) {
                                var code = '';
                                var showAlert = false;
                                try {
                                    code = upyhex.extractPyStrFromIntelHex(e.target.result);
                                } catch(e) {
                                    showAlert = true;
                                }
                                if (showAlert || code.length === 0) {
                                    return alert(config.translate.alerts.unrecognised_hex);
                                } else {
                                    EDITOR.setCode(code);
                                }
                            };
                            reader.readAsText(f);
                            EDITOR.ACE.gotoLine(EDITOR.ACE.session.getLength());
                        }
                    }
                    vex.close();
                    EDITOR.focus();
                    return false;
                });
            }
        });
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
            EDITOR.ACE.setReadOnly(false);
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
            EDITOR.ACE.setReadOnly(true);
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
                var blocklyElement = document.getElementById('blockly');
                var toolboxElement = document.getElementById('blockly-toolbox');
                BLOCKS.inject(blocklyElement, toolboxElement, zoomLevel, zoomScaleSteps);
                BLOCKS.addCodeChangeListener(function(code) {
                    EDITOR.setCode(code);
                });
            }
            // Set editor to current state of blocks.
            EDITOR.setCode(BLOCKS.getCode());
        }
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
                };
            }
        };
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
        });
        $('#passphrase').focus();
        $('#button-create-link').click(function() {
            var password = $('#passphrase').val();
            var hint = $('#hint').val();
            var qs_array = [];
            // Name
            qs_array.push('n=' + EDITOR.encrypt(password, getName()));
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
            reader.onload = function(e) {
                EDITOR.setCode(e.target.result);
            };
            reader.readAsText(file);
            EDITOR.ACE.gotoLine(EDITOR.ACE.session.getLength());
        } else if (ext == 'hex') {
            setName(file.name.replace('.hex', ''));
            reader.onload = function(e) {
                var code = '';
                var showAlert = false;
                try {
                    code = upyhex.extractPyStrFromIntelHex(e.target.result);
                } catch(e) {
                    showAlert = true;
                }
                if (showAlert || code.length === 0) {
                    return alert(config.translate.alerts.unrecognised_hex);
                } else {
                    EDITOR.setCode(code);
                }
            };
            reader.readAsText(file);
            EDITOR.ACE.gotoLine(EDITOR.ACE.session.getLength());
        }
        $('#editor').focus();
    }

    function doConnect(e, serial) {
        navigator.usb.requestDevice({
            filters: [{vendorId: 0x0d28, productId: 0x0204}]
        }).then(function(device) {
            // Connect to device
            window.transport = new DAPjs.WebUSB(device);
            window.daplink = new DAPjs.DAPLink(window.transport);

            // Ensure disconnected
            window.daplink.disconnect();

            // Connect to board
            return window.daplink.connect()
            .then(function() {
                try {
                 var output = generateFullHexStr();
               } catch(err) {
                 alert(err.message);
                 return;
                }

                // Change button to disconnect
                $("#command-connect").attr("id", "command-disconnect");
                $("#command-disconnect > .roundlabel").text("Disconnect");
                $("#command-disconnect").attr("title", "Disconnect from your micro:bit");

                // Change download to flash
                $("#command-download").attr("id", "command-flash");
                $("#command-flash > .roundlabel").text("Flash");
                $("#command-flash").attr("title", "Flash your project directly to your micro:bit");

                if (serial){
                  doSerial();
                }
            })
            .catch(function(err) {
                console.log("Error connecting: " + err);
                $("#flashing-overlay-container").css("display", "flex");
                $("#flashing-info").addClass('hidden');

                // If micro:bit does not support dapjs
                if (err.message === "No valid interfaces found."){
                    $("#flashing-overlay-error").html('<div>' + err + '</div><div>You need to <a target="_blank" href="https://microbit.org/guide/firmware/">update your micro:bit firmware</a> to make use of this feature!</div><a href="#" onclick="flashErrorClose()">Close</a>');
                    return;
                } else if (err.message === "Unable to claim interface.") {
                    $("#flashing-overlay-error").html('<div>Another process is connected to this device.</div><div>Close any other tabs that may be using WebUSB (e.g. MakeCode, Python Editor), or unplug and replug the micro:bit before trying again.</div><a href="#" onclick="flashErrorClose()">Close</a>');
                    return;
                }

                $("#flashing-overlay-error").html('<div>' + err + '</div><div>Please restart your micro:bit and try again</div><a href="#" onclick="flashErrorClose()">Close</a>');
            });
        }).catch(function(err) {
            console.log("There was an error during connecting: " + err);
        });
    }

    function doDisconnect(e) {
        // Hide serial and disconnect if open
        if ($("#repl").css('display') != 'none') {
            $("#repl").hide();
            $("#request-repl").hide();
            $("#editor-container").show();
            $("#command-serial").attr("title", "Connect to your micro:bit via serial");
            $("#command-serial > .roundlabel").text("Open Serial");
        }

        window.daplink.stopSerialRead();
        $("#repl").empty();
        REPL = null;

        window.daplink.disconnect();

        // Change button to connect
        $("#command-disconnect").attr("id", "command-connect");
        $("#command-connect > .roundlabel").text("Connect");
        $("#command-connect").attr("title", "Connect to your micro:bit");

        // Change flash to download
        $("#command-flash").attr("id", "command-download");
        $("#command-download > .roundlabel").text("Download");
        $("#command-download").attr("title", "Download a hex file to flash onto your micro:bit");
    }

    function doFlash(e) {
        // Hide serial and disconnect if open
        if ($("#repl").css('display') != 'none') {
            $("#repl").hide();
            $("#request-repl").hide();
            $("#editor-container").show();
            window.daplink.stopSerialRead();
            $("#command-serial").attr("title", "Connect to your micro:bit via serial");
            $("#command-serial > .roundlabel").text("Open Serial");
        }

        // Event to monitor flashing progress
        window.daplink.on(DAPjs.DAPLink.EVENT_PROGRESS, function(progress) {
            $("#webusb-flashing-progress").val(progress).css("display", "inline-block");
        });

        // Push binary to board
        return window.daplink.connect()
        .then(function() {
            try {
             var output = generateFullHexStr();
            } catch(error) {
             alert(err.message);
             return;
            }

            // Encode firmware for flashing
            var enc = new TextEncoder();
            var image = enc.encode(output).buffer;

            $("#webusb-flashing-progress").val(0);
            $('#flashing-overlay-error').html("");
            $("#flashing-info").removeClass('hidden');
            $("#flashing-overlay-container").css("display", "flex");
            return window.daplink.flash(image);
        })
        .then(function() {
            $("#flashing-overlay-container").hide();
            return;
        })
        .catch(function(err) {
            console.log("Error flashing: " + err);
            $("#flashing-overlay-container").css("display", "flex");
            $("#webusb-flashing-progress").css("display", "none");

            // If micro:bit does not support dapjs
            if (err.message === "No valid interfaces found.") {
                $("#flashing-overlay-error").html('<div>' + err + '</div><div>You need to <a target="_blank" href="https://microbit.org/guide/firmware/">update your micro:bit firmware</a> to make use of this feature!</div><a href="#" onclick="flashErrorClose()">Close</a>');
                return;
            } else if(err.message === "Unable to claim interface.") {
                $("#flashing-overlay-error").html('<div>Another process is connected to this device.</div><div>Close any other tabs that may be using WebUSB (e.g. MakeCode, Python Editor), or unplug and replug the micro:bit before trying again.</div><a href="#" onclick="flashErrorClose()">Close</a>');
                return;
            }

            $("#flashing-overlay-error").html('<div>' + err + '</div><div>Please restart your micro:bit and try again</div><a href="#" onclick="flashErrorClose()">Close</a>');
        });
    }

    function doSerial(){
        // Hide terminal
        if ($("#repl").css('display') != 'none') {
            $("#repl").hide();
            $("#request-repl").hide();
            $("#editor-container").show();
            window.daplink.stopSerialRead();
            $("#command-serial").attr("title", "Connect to your micro:bit via serial");
            $("#command-serial > .roundlabel").text("Open Serial");
            return;
        }

        // Check if we need to connect
        if ($("#command-connect").length){
            doConnect(undefined, true);
        } else {
            // Change Serial button to close
            $("#command-serial").attr("title", "Close the serial connection and go back to the editor");
            $("#command-serial > .roundlabel").text("Close Serial");

            window.daplink.connect()
            .then( function() {
                return window.daplink.setSerialBaudrate(115200);
            })
            .then( function() {
                return window.daplink.getSerialBaudrate();
            })
            .then(function(baud) {
                window.daplink.startSerialRead(1);
                lib.init(setupHterm);
            })
            .catch(function(err) {
                // If micro:bit does not support dapjs
                $("#flashing-overlay-error").show();
                if (err.message === "No valid interfaces found.") {
                    $("#flashing-overlay-error").html('<div>' + err + '</div><div><a target="_blank" href="https://support.microbit.org/support/solutions/articles/19000019131-how-to-upgrade-the-firmware-on-the-micro-bit">Update your micro:bit firmware</a> to make use of this feature!</div><a href="#" onclick="flashErrorClose()">Close</a>');
                    return;
                } else if (err.message === "Unable to claim interface.") {
                    $("#flashing-overlay-error").html('<div>' + err + '</div><div>Another process is connected to this device.</div><a href="#" onclick="flashErrorClose()">Close</a>');
                    return;
                }

                $("#flashing-overlay-error").html('<div>' + err + '</div><div>Please restart your micro:bit and try again</div><a href="#" onclick="flashErrorClose()">Close</a>');
            });
        }
    }

    function setupHterm(){
       if (REPL == null) {
         hterm.defaultStorage = new lib.Storage.Memory();

         REPL = new hterm.Terminal("opt_profileName");
         REPL.options_.cursorVisible = true;
         REPL.prefs_.set('font-size', 22);

         var daplinkReceived = false;

         REPL.onTerminalReady = function() {
             var io = REPL.io.push();

             io.onVTKeystroke = function(str) {
                  window.daplink.serialWrite(str);
             };

             io.sendString = function(str) {
                  window.daplink.serialWrite(str);
             };

             io.onTerminalResize = function(columns, rows) {
             };
         };

         REPL.decorate(document.querySelector('#repl'));
         REPL.installKeyboard();

         window.daplink.on(DAPjs.DAPLink.EVENT_SERIAL_DATA, function(data) {
                 REPL.io.print(data); // first byte of data is length
                 daplinkReceived = true;
         });
       }

       $("#editor-container").hide();
       $("#repl").show();
       $("#request-repl").show();

       // Recalculate terminal height
       $("#repl > iframe").css("position", "relative");
       $("#repl").attr("class", "hbox flex1");
       REPL.prefs_.set('font-size', getFontSize());

       /* Don't do this automatically
       // Send ctrl-C to get the terminal up
       var attempt = 0;
       var getPrompt = setInterval(
               function(){
                    daplink.serialWrite("\x03");
                    console.log("Requesting REPL...");
                    attempt++;
                    if(attempt == 5 || daplinkReceived) clearInterval(getPrompt);
                }, 200);
       */
    }

    function formatMenuContainer(parentButtonId, containerId) {
        var container = $('#' + containerId);
        if (container.is(':visible')) {
            var parentButton = $('#' + parentButtonId);
            if ($(window).width() > 720) {
                if (container.offset().left !== parentButton.offset().left) {
                    container.css('left', parentButton.offset().left);
                    container.css('top', parentButton.offset().top + parentButton.outerHeight() + 10);
                }
            } else {
                var containerRight = container.offset().left + container.outerWidth();
                var parentButtonRight = parentButton.offset().left + parentButton.outerWidth();
                if (containerRight !== parentButtonRight) {
                    container.css('left', parentButtonRight - container.outerWidth());
                    container.css('top', parentButton.offset().top + parentButton.outerHeight() + 10);
                }
            }
        }
    }

    // Join up the buttons in the user interface with some functions for
    // handling what to do when they're clicked.
    function setupButtons() {
        $("#command-download").click(function () {
            if ($("#command-download").length) {
              doDownload();
            } else {
              doFlash();
            }
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
        $("#command-connect").click(function () {
            if ($("#command-connect").length) {
              doConnect();
            } else {
              doDisconnect();
            }
        });
        $("#command-serial").click(function () {
            doSerial();
        });
        $("#request-repl").click(function () {
            daplink.serialWrite("\x03");
        });
        $("#command-options").click(function (e) {
            // Hide any other open menus and show/hide options menu
            $('#helpsupport_container').addClass('hidden');
            $('#options_container').toggleClass('hidden');
            formatMenuContainer('command-options', 'options_container');
            // Stop immediate closure
            e.stopImmediatePropagation();
        });
        $("#command-help").click(function (e) {
            // Hide any other open menus and show/hide help menu
            $('#options_container').addClass('hidden');
            $('#helpsupport_container').toggleClass('hidden');
            formatMenuContainer('command-help', 'helpsupport_container');
            // Stop immediate closure
            e.stopImmediatePropagation();
        });
        $("#zoom-in").click(function (e) {
            zoomIn();
            e.stopPropagation();
        });
        $("#zoom-out").click(function (e) {
            zoomOut();
            e.stopPropagation();
        });

        window.addEventListener('resize', function() {
            formatMenuContainer('command-options', 'options_container');
            formatMenuContainer('command-help', 'helpsupport_container');
        });

        document.body.addEventListener('click', function(event) {
            // Close any button menu on a click is outside menu or a link within
            if ($(event.target).closest('.buttons_menu_container').length == 0 ||
                    $(event.target).prop('tagName').toLowerCase() === 'a') {
                $('.buttons_menu_container').addClass('hidden');
            }
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

    function get_migration() {
        var compressed_project = window.location.toString().split("#project:")[1];
        if(typeof compressed_project === "undefined") return null;
        var bytes = base64js.toByteArray(compressed_project);
        var project = JSON.parse(LZMA.decompress(bytes));
        return project;
    }

    var qs = get_qs_context();
    var migration = get_migration();
    setupFeatureFlags();
    setupEditor(qs, migration);
    setupButtons();
}

/*
 * Function to close flash error box
 */
function flashErrorClose(){
    $('#flashing-overlay-error').html("");
    $('#flashing-overlay-container').hide();
}
