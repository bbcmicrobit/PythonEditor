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
    var langTools = ace.require("ace/ext/language_tools");
    var ACE = ace.edit(id);  // The editor is in the tag with the referenced id.
    ACE.setOptions({
        enableSnippets: true,  // Enable code snippets.
        enableBasicAutocompletion: true, // Enable (automatic) autocompletion
        enableLiveAutocompletion: true
    });
    ACE.$blockScrolling = Infinity; // Silences the 'blockScrolling' warning

    var horizontalWordList = populateWordList();

    var staticWordCompleter = {
        identifierRegexps: [/[a-zA-Z_0-9\.\-\u00A2-\uFFFF]/],
        getCompletions: function(editor, session, pos, prefix, callback) {
            var wordList = horizontalWordList;
            
            callback(null, wordList.map(function(word) {
                return {
                    caption: word,
                    value: word,
                    meta: "static"
                };
            }));
        }
    }
    langTools.setCompleters([langTools.keyWordCompleter, langTools.textCompleter, staticWordCompleter])
    
    ACE.setTheme("ace/theme/kr_theme_legacy");  // Make it look nice.
    ACE.getSession().setMode("ace/mode/python_microbit");  // We're editing Python.
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
        return snippetManager.snippetMap.python_microbit;
    };

    // Triggers a snippet by name in the editor.
    editor.triggerSnippet = function(snippet) {
        var snippetManager = ace.require("ace/snippets").snippetManager;
        snippet = snippetManager.snippetNameMap.python_microbit[snippet];
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
This code generates a list of words for the autocomplete.
*/
function populateWordList(){
    var words = {
        "microbit" : {
            "Image" : ['ALL_CLOCKS', 'ANGRY', 'ARROW_E', 'ARROW_N', 'ARROW_NE', 'ARROW_NW', 'ARROW_S', 'ARROW_SE', 'ARROW_SW', 'ARROW_W', 'ASLEEP', 'BUTTERFLY', 'CHESSBOARD', 'CLOCK1', 'CLOCK10', 'CLOCK11', 'CLOCK12', 'CLOCK2', 'CLOCK3', 'CLOCK4', 'CLOCK5', 'CLOCK6', 'CLOCK7', 'CLOCK8', 'CLOCK9', 'CONFUSED', 'COW', 'DIAMOND', 'DIAMOND_SMALL', 'DUCK', 'FABULOUS', 'GHOST', 'GIRAFFE', 'HAPPY', 'HEART', 'HEART_SMALL', 'HOUSE', 'MEH', 'MUSIC_CROTCHET', 'MUSIC_QUAVER', 'MUSIC_QUAVERS', 'NO', 'PACMAN', 'PITCHFORK', 'RABBIT', 'ROLLERSKATE', 'SAD', 'SILLY', 'SKULL', 'SMILE', 'SNAKE', 'SQUARE', 'SQUARE_SMALL', 'STICKFIGURE', 'SURPRISED', 'SWORD', 'TARGET', 'TORTOISE', 'TRIANGLE', 'TRIANGLE_LEFT', 'TSHIRT', 'UMBRELLA', 'XMAS', 'YES'],
            "pin0" : ["is_touched", "read_analog", "read_digital", "set_analog_period", "set_analog_period_microseconds", "write_analog", "write_digital"],
            "pin1" : ["is_touched", "read_analog", "read_digital", "set_analog_period", "set_analog_period_microseconds", "write_analog", "write_digital"],
            "pin2" : ["is_touched", "read_analog", "read_digital", "set_analog_period", "set_analog_period_microseconds", "write_analog", "write_digital"],
            "pin3" : ["read_analog", "read_digital", "set_analog_period", "set_analog_period_microseconds", "write_analog", "write_digital"],
            "pin4" : ["read_analog", "read_digital", "set_analog_period", "set_analog_period_microseconds", "write_analog", "write_digital"],
            "pin5" : ["read_digital", "write_digital"],
            "pin6" : ["read_digital", "write_digital"],
            "pin7" : ["read_digital", "write_digital"],
            "pin8" : ["read_digital", "write_digital"],
            "pin9" : ["read_digital", "write_digital"],
            "pin10" : ["read_analog", "read_digital", "set_analog_period", "set_analog_period_microseconds", "write_analog", "write_digital"],
            "pin11" : ["read_digital", "write_digital"],
            "pin12" : ["read_digital", "write_digital"],
            "pin13" : ["read_digital", "write_digital"],
            "pin14" : ["read_digital", "write_digital"],
            "pin15" : ["read_digital", "write_digital"],
            "pin16" : ["read_digital", "write_digital"],
            "pin19" : ["read_digital", "write_digital"],
            "pin20" : ["read_digital", "write_digital"],
            "accelerometer" : ["current_gesture", "get_gestures", "get_values", "get_x", "get_y", "get_z", "was_gesture"],
            "button_a" : ["get_presses", "is_pressed", "was_pressed"],
            "button_b" : ["get_presses", "is_pressed", "was_pressed"],
            "compass" : ["calibrate", "clear_calibration", "get_field_strength", "get_x", "get_y", "get_z", "heading", "is_calibrated"],
            "display" : ["clear", "get_pixel", "is_on", "off", "on", "read_light_level", "scroll", "set_pixel", "show"],
            "i2c" : ["init", "read", "scan", "write"],
            "panic" : "",
            "reset" : "",
            "running_time" : "",
            "sleep" : "",
            "spi" : ["init", "read", "write", "write_readinto"],
            "temperature" : "",
            "uart" : ["any", "init", "read", "readall", "readline", "write"]
        },
        "audio" : ["play", "AudioFrame"],
        "machine" : ["disable_irq", "enable_irq", "freq", "reset", "time_pulse_us", "unique_id"],
        "micropython" : ["const", "heap_lock", "heap_unlock", "kbd_intr", "mem_info", "opt_level", "qstr_info", "stack_use"],
        "music" : ["BADDY", "BA_DING", "BIRTHDAY", "BLUES", "CHASE", "DADADADUM", "ENTERTAINER", "FUNERAL", "FUNK", "JUMP_DOWN", "JUMP_UP", "NYAN", "ODE", "POWER_DOWN", "POWER_UP", "PRELUDE", "PUNCHLINE", "PYTHON", "RINGTONE", "WAWAWAWAA", "WEDDING", "get_tempo", "pitch", "play", "reset", "set_temp", "stop"],
        "speech" : ["pronounce", "say", "sing", "translate"],
        "radio" : ["RATE_1MBIT", "RATE_250KBIT", "RATE_2MBIT", "config", "off", "on", "receive", "receive_bytes", "receive_bytes_into", "receive_full", "reset", "send", "send_bytes"],
        "os" : ["remove", "listdir", "size", "uname"],
        "time" : ["sleep", "sleep_ms", "sleep_us", "ticks_ms", "ticks_us", "ticks_add", "ticks_diff"],
        "utime" : ["sleep", "sleep_ms", "sleep_us", "ticks_ms", "ticks_us", "ticks_add", "ticks_diff"],
        "ucollections" : ["namedtuple", "OrderedDict"],
        "collections" : ["namedtuple", "OrderedDict"],
        "array" : ["array"],
        "math" : ["e", "pi", "sqrt", "pow", "exp", "log", "cos", "sin", "tan", "acos", "asin", "atan", "atan2", "ceil", "copysign", "fabs", "floor", "fmod", "frexp", "ldexp", "modf", "isfinite", "isinf", "isnan", "trunc", "radians", "degrees"],
        "random" : ["getrandbits", "seed", "randrange", "randint", "choice", "random", "uniform"],
        "ustruct" : ["calcsize", "pack", "pack_into", "unpack", "unpack_from"],
        "struct" : ["calcsize", "pack", "pack_into", "unpack", "unpack_from"],
        "sys" : ["version", "version_info", "implementation", "platform", "byteorder", "exit", "print_exception"],
        "gc" : ["collect", "disable", "enable", "isenabled", "mem_free", "mem_alloc", "threshold"],
        "neopixel" : {
            "NeoPixel" : ["clear", "show"]
        }
    };

    var wordsHorizontal = [];
    Object.keys(words).forEach(function(module){
        wordsHorizontal.push(module);
        if (Array.isArray(words[module])){
            words[module].forEach(function(func){
                wordsHorizontal.push(module + "." + func);
            });
        }else{
            Object.keys(words[module]).forEach(function(sub){
                wordsHorizontal.push(module + "." + sub);
                if (Array.isArray(words[module][sub])){
                    words[module][sub].forEach(function(func){
                        wordsHorizontal.push(module + "." + sub + "." + func);
                        wordsHorizontal.push(sub + "." + func);
                    });
                }
            });
        }
    });
    return (wordsHorizontal);
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
        // Update the help link to pass feature flag information.
        var helpAnchor = $("#help-link");
        var featureQueryString = Object.keys(config.flags).filter(function(f) {
            return config.flags[f];
        }).map(function(f) {
            return encodeURIComponent(f) + "=true";
        }).join("&");
        helpAnchor.attr("href", helpAnchor.attr("href") + "?" + featureQueryString);
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
        // If configured as experimental update editor background to indicate it
        if(config.flags.experimental) {
            EDITOR.ACE.renderer.scroller.style.backgroundImage = "url('static/img/experimental.png')";
            $("#known-issues").removeClass('hidden');
        }
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
        var template = $('#snippet-template').html();
        Mustache.parse(template);
        var context = {
            'title': config.translate.code_snippets.title,
            'description': config.translate.code_snippets.description,
            'instructions': config.translate.code_snippets.instructions,
            'trigger_heading': config.translate.code_snippets.trigger_heading,
            'description_heading': config.translate.code_snippets.description_heading,
            'snippets': EDITOR.getSnippets(),
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

        function formatHelpPanel(){
            if($(".helpsupport_container").offset().left !== $("#command-help").offset().left && $(window).width() > 620){
                $(".helpsupport_container").css("top", $("#command-help").offset().top + $("#toolbox").height() + 10);
                $(".helpsupport_container").css("left", $("#command-help").offset().left);
            }
            else if($(window).width() < 620){
                $(".helpsupport_container").css("left", $("#command-help").offset().left - 200);
                $(".helpsupport_container").css("top", $("#command-help").offset().top + $("#toolbox").height() + 10);
            }
        };

        $("#command-help").click(function (e) {
            // Show help
            formatHelpPanel();
            // Toggle visibility
            if($(".helpsupport_container").css("display") == "none"){
                $(".helpsupport_container").css("display", "flex");
                $(".helpsupport_container").css("display", "-ms-flexbox"); // IE10 support
            } else {
                $(".helpsupport_container").css("display", "none");
            }

            // Stop immediate closure
            e.stopImmediatePropagation();
        });

        window.addEventListener('resize', function(){
            if($(".helpsupport_container").is(":visible")){
            formatHelpPanel();
            }
        });

        // Add document click listener
        document.body.addEventListener('click',function(event) {
            // Close helpsupport if the click isn't on a descendent of #command-help
            if($(event.target).closest('.helpsupport_container').length == 0 || $(event.target).prop("tagName").toLowerCase() === 'a')
                $(".helpsupport_container").css("display", "none");
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
