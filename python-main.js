/*
A simple editor that targets MicroPython for the BBC micro:bit.

Feel free to have a look around! (We've commented the code so you can see what
everything does.)
*/

/*
Lazy load JS script files.
*/
function script(url, id) {
    var s = document.createElement('script');
    if(id){
        s.id = id;
    }
    s.type = 'text/javascript';
    s.async = false;
    s.defer = true;
    s.src = url;
    var x = document.getElementsByTagName('head')[0];
    x.appendChild(s);
}

/**
 * JS debounce 
 * TODO: could be moved to some helper/util file
 */
function debounce(callback, wait) {
  var timeout = null;

  return function () {
    var args = arguments;
    var next = function () {
      return callback.apply(this, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(next, wait);
  }
}

// Constants used for iframe messaging
var EDITOR_IFRAME_MESSAGING = Object.freeze({
  // Embed editor host type
  host: "pyeditor",
  // Embed editor messaging actions
  actions: {
    workspacesync: "workspacesync",
    workspacesave: "workspacesave",
    workspaceloaded: "workspaceloaded",
    importproject: "importproject"
  }
})

//Allows for different CSS styling in IE10
var doc = document.documentElement;
doc.setAttribute('data-useragent', navigator.userAgent);

/*
Returns an object that defines the behaviour of the Python editor. The editor
is attached to the div with the referenced id.
*/
function pythonEditor(id, autocompleteApi) {
    'use strict';

    // An object that encapsulates the behaviour of the editor.
    var editor = {};
    editor.initialFontSize = 22;
    editor.fontSizeStep = 4;

    // Generates an expanded list of words for the ACE autocomplete to digest.
    var fullWordList = function(apiObj) {
        var wordsHorizontal = [];
        Object.keys(apiObj).forEach(function(module) {
            wordsHorizontal.push(module);
            if (Array.isArray(apiObj[module])){
                apiObj[module].forEach(function(func) {
                    wordsHorizontal.push(module + "." + func);
                });
            } else {
                Object.keys(apiObj[module]).forEach(function(sub) {
                    wordsHorizontal.push(module + "." + sub);
                    if (Array.isArray(apiObj[module][sub])) {
                        apiObj[module][sub].forEach(function(func) {
                            wordsHorizontal.push(module + "." + sub + "." + func);
                            wordsHorizontal.push(sub + "." + func);
                        });
                    }
                });
            }
        });
        return (wordsHorizontal);
    };

    // Represents the ACE based editor.
    var ACE = ace.edit(id);  // The editor is in the tag with the referenced id.
    ACE.setOptions({
        enableSnippets: true,  // Enable code snippets.
    });
    ACE.$blockScrolling = Infinity; // Silences the 'blockScrolling' warning
    ACE.setTheme("ace/theme/kr_theme_legacy"); // Make it look nice.
    ACE.getSession().setMode("ace/mode/python_microbit"); // We're editing Python.
    ACE.getSession().setTabSize(4); // Tab=4 spaces.
    ACE.getSession().setUseSoftTabs(true); // Tabs are really spaces.
    ACE.setFontSize(editor.initialFontSize);
    editor.ACE = ACE;

    // Configure Autocomplete
    var langTools = ace.require("ace/ext/language_tools");
    var extraCompletions = fullWordList(autocompleteApi || []).map(function(word) {
        return { "caption": word, "value": word, "meta": "static" };
    });
    langTools.setCompleters([langTools.keyWordCompleter, langTools.textCompleter, {
        "identifierRegexps": [/[a-zA-Z_0-9\.\-\u00A2-\uFFFF]/],
        "getCompletions": function(editor, session, pos, prefix, callback) {
            callback(null, extraCompletions);
        }
    }]);

    editor.enableAutocomplete = function(enable) {
        ACE.setOption('enableBasicAutocompletion', enable);
        ACE.setOption('enableLiveAutocompletion', enable);
        editor.triggerAutocompleteWithEnter(false); 
    };

    editor.triggerAutocompleteWithEnter = function(enable) {
        if (!ACE.completer) {
            // Completer not yet initialise, force it by opening and closing it
            ACE.execCommand('startAutocomplete');
            ACE.completer.detach();
        }
        if (enable) {
            ACE.completer.keyboardHandler.bindKey('Return', function(editor) {
                return editor.completer.insertMatch();
            });
        } else {
            ACE.completer.keyboardHandler.removeCommand('Return');
        }
    };

    // Gets the textual content of the editor (i.e. what the user has written).
    editor.getCode = function() {
        return ACE.getValue();
    };

    // Sets the textual content of the editor (i.e. the Python script).
    editor.setCode = function(code) {
        ACE.setValue(code);
        ACE.gotoLine(ACE.session.getLength());
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
 * Allows the Python Editor to display in multiple languages by manipulating
 * strings with correct JS language objects.
 */
function translations() {
    'use strict';
    // These values must be valid language codes
    // https://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    var validLangs = ['en', 'es', 'pl', 'hr', 'zh-HK', 'zh-CN', 'zh-TW'];

    /* Replaces DOM script element with the new language js file. */
    function updateLang(newLang, callback) {
        var elementId = 'lang';
        var newLangURL = 'lang/' + newLang + '.js';
        var endsWithURL = new RegExp(newLangURL + "$");
        var runCallback = function() {
            translateEmbedStrings(language);
            callback(language);
        };
        if (endsWithURL.test(document.getElementById(elementId).src)) {
            // The request newLang is the current one, don't reload js file
            return runCallback(language);
        }
        // Check for a valid language
        if (validLangs.indexOf(newLang) >- 1) {
            document.getElementById(elementId).remove();
            script(newLangURL, elementId);
            document.getElementById(elementId).onload = runCallback;
        } else {
            // Don't throw an error, but inform the console
            runCallback();
            console.error('Requested language not available: ' + newLang);
        }
    }

    /* Replaces the strings already loaded in the DOM, the rest are dynamically loaded. */
    function translateEmbedStrings(language) {
        var buttons = language['static-strings']['buttons'];
        $('.roundbutton').each(function(object, value) {
            var button_id = $(value).attr('id');
            $(value).attr('title', buttons[button_id]['title']);
            $(value).attr('aria-label', buttons[button_id]['title']);
            $(value).children('.roundlabel').text(buttons[button_id]['label']);
            if ((button_id === 'command-serial') && ($('#repl').css('display') !== 'none')) {
                // Serial button strings depend on the REPL being visible
                $(value).attr('title', buttons[button_id]['title-close']);
                $(value).children(':last').text(buttons[button_id]['label-close']);
            }
        });
        $('.ace_text-input').attr('aria-label',language['static-strings']['text-editor']['aria-label']);
        $('#script-name-label').text(language['static-strings']['script-name']['label']);
        $('#request-repl').text(language['webusb']['request-repl']);
        $('#request-serial').text(language['webusb']['request-serial']);
        $('#flashing-text').text(language['webusb']['flashing-text']);
        var optionsStrings = language['static-strings']['options-dropdown'];
        for (var object in optionsStrings) {
            $("#" + object).text(optionsStrings[object]);
        }
        var helpStrings = language['help'];
        for (var object in helpStrings) {
            if (helpStrings.hasOwnProperty(object)) {
                if (object.match(/ver/)) {
                    $('#' + object).text(helpStrings[object]);
                    continue;
                }
                $('#' + object).text(helpStrings[object]['label']);
                $('#' + object).attr('title',helpStrings[object]['title']);
            }
        }
        var languages = language['languages'];
        for (var object in languages) {
            if (languages.hasOwnProperty(object)) {
                $('#' + object).attr('title',languages[object]['title']);
            }
        }
    }

    return {
        'updateLang': updateLang
    };
}

/*
The following code contains the various functions that connect the behaviour of
the editor to the DOM (web-page).

See the comments in-line for more information.
*/
function web_editor(config) {
    'use strict';

    // Global (useful for testing) instance of the ACE wrapper object
    window.EDITOR = pythonEditor('editor', config.microPythonApi);

    var BLOCKS = blocks();
    var TRANSLATIONS = translations();

    // Represents the REPL terminal
    var REPL = null;

    // Indicates if there are unsaved changes to the content of the editor.
    var dirty = false;

    var inIframe = window !== window.parent;

    // Indicate if editor can listen and respond to messages
    var controllerMode = inIframe && urlparse("controller") === "1";

    var usePartialFlashing = true;

    // MicroPython filesystem to be initialised on page load.
    window.micropythonFs = undefined;

    // Sets the name associated with the code displayed in the UI.
    function setName(x) {
        $("#script-name").val(x);
    }

    // Gets the name associated with the code displayed in the UI.
    function getName() {
        return $("#script-name").val();
    }

    // Gets filename and replaces spaces with underscores
    function getSafeName(){
        return getName().replace(" ", "_");
    }

    // Get the font size of the text currently displayed in the editor.
    function getFontSize() {
        return EDITOR.ACE.getFontSize();
    }

    // Set the font size of the text currently displayed in the editor.
    function setFontSize(size) {
        EDITOR.ACE.setFontSize(size);
        $("#request-repl")[0].style.fontSize = "" + size + "px";
        $("#request-serial")[0].style.fontSize = "" + size + "px";

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

    function setLanguage(lang) {
        TRANSLATIONS.updateLang(lang, function(translations) {
            config.translate = translations;
            document.getElementsByTagName('HTML')[0].setAttribute('lang', lang);
            $('ul.tree > li > span > a').removeClass('is-selected');
            $('#'+lang).addClass('is-selected'); 
        });
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
            $('.experimental').removeClass('experimental');
            EDITOR.ACE.renderer.scroller.style.backgroundImage = "url('static/img/experimental.png')";
            EDITOR.enableAutocomplete(true);
            $('#menu-switch-autocomplete').prop("checked", true);
            $('#menu-switch-autocomplete-enter').prop("checked", false);
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
            script('static/js/hterm_all.min.js');
            script('partial-flashing.js');
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
            setName('microbit program');
            // A sane default starting point for a new script.
            EDITOR.setCode('# ' + config.translate.code.start + '\n' +
                'from microbit import *\n\n\n' +
                'while True:\n' +
                '    display.scroll(\'Hello, World!\')\n' +
                '    display.show(Image.HEART)\n' +
                '    sleep(2000)\n');
        }
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
                if ( $('#command-download').is(':visible') ) {
                    $('#command-download').focus();
                }
                else if ( $('#command-flash').is(':visible') ){
                    $('#command-flash').focus();
                }
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

    function initializeIframeMessaging() {
      window.addEventListener("load", function () {
        window.parent.postMessage({ type: EDITOR_IFRAME_MESSAGING.host, action: EDITOR_IFRAME_MESSAGING.actions.workspacesync }, "*");
      });

      window.addEventListener(
        "message",
        function (event) {
          if (event.data) {
            var type = event.data.type;

            if (type === EDITOR_IFRAME_MESSAGING.host) {
              var action = event.data.action;
              
              switch (action) {
                // Parent is sending code to update editor
                case EDITOR_IFRAME_MESSAGING.actions.importproject:
                  if (!event.data.project || typeof event.data.project !== "string") {
                    throw new Error("Invalid 'project' data type. String should be provided.");
                  }
                  EDITOR.setCode(event.data.project);
                  break;

                // Parent is sending initial code for editor
                // Also here we can sync parent data with editor's data
                case EDITOR_IFRAME_MESSAGING.actions.workspacesync:
                  if (!event.data.projects || !Array.isArray(event.data.projects)) {
                    throw new Error("Invalid 'projects' data type. Array should be provided.");
                  }
                  if (event.data.projects.length < 1) {
                    throw new Error("'projects' array should contain at least one item.");
                  }
                  EDITOR.setCode(event.data.projects[0]);
                  // Notify parent about editor successfully configured
                  window.parent.postMessage({ type: EDITOR_IFRAME_MESSAGING.host, action: EDITOR_IFRAME_MESSAGING.actions.workspaceloaded }, "*");
                  break;

                default:
                  throw new Error("Unsupported action.")
              }
            }
          }
        },
        false
      );

      var debounceCodeChange = debounce(function (code) {
        window.parent.postMessage({ type: EDITOR_IFRAME_MESSAGING.host, action: EDITOR_IFRAME_MESSAGING.actions.workspacesave, project: code }, "*");
      }, 1000);

      EDITOR.setCode(" ");
      EDITOR.on_change(function () {
        debounceCodeChange(EDITOR.getCode());
      });
    }

    // Sets up the file system and adds the initial main.py
    function setupFilesystem() {
        micropythonFs = new microbitFs.MicropythonFsHex($('#firmware').text());
        // Limit filesystem size to 20K
        micropythonFs.setStorageSize(20 * 1024);
        // The the current main.py
        micropythonFs.write('main.py', EDITOR.getCode());
    }

    // Based on the Python code magic comment it detects a module
    function isPyModule(codeStr) {
        var isModule = false;
        if (codeStr.length) {
            var codeLines = codeStr.split(/\r?\n/);
            // Only look at the first three lines
            var loopEnd = Math.min(3, codeLines.length);
            for (var i = 0; i < loopEnd; i++) {
                if (codeLines[i].indexOf('# microbit-module:') == 0) {
                    isModule = true;
                }
            }
        }
        return isModule;
    }

    // Loads Python code into the editor and/or filesystem
    function loadPy(filename, codeStr) {
        var isModule = isPyModule(codeStr);
        var moduleName = filename.replace('.py', '');
        filename = isModule ? filename : 'main.py';
        var showModuleLoadedAlert = true;
        if (isModule && micropythonFs.exists(filename)) {
            if (!confirm(config.translate.confirms.replace_module.replace('{{module_name}}', moduleName))) {
                return;
            }
            // A confirmation box to replace the module has already been accepted
            showModuleLoadedAlert = false;
        }
        if (codeStr) {
            try {
                micropythonFs.write(filename, codeStr);
            } catch(e) {
                alert(config.translate.alerts.load_code + '\n' + e.message);
            }
        } else {
            return alert(config.translate.alerts.empty);
        }
        if (isModule) {
            if (micropythonFs.getStorageRemaining() < 0){
                micropythonFs.remove(filename);
                return alert(config.translate.alerts.module_out_of_space);
            }
            if (showModuleLoadedAlert) {
                alert(config.translate.alerts.module_added.replace('{{module_name}}', moduleName));
            }
        } else {
            setName(moduleName);
            EDITOR.setCode(codeStr);
        }
    }

    // Reset the filesystem and load the files from this hex file to the fs and editor
    function loadHex(filename, hexStr) {
        var errorMsg = '';
        var code = '';
        var importedFiles = [];
        var tryOldMethod = false;
        try {
            // If hexStr is parsed correctly it formats the file system before adding the new files
            importedFiles = micropythonFs.importFilesFromIntelHex(hexStr, {
                overwrite: true,
                formatFirst:true
            });
            // Check if imported files includes a main.py file
            if (importedFiles.indexOf('main.py') > -1) {
                code = micropythonFs.read('main.py');
            } else {
                // There is no main.py file, but there could be appended code
                tryOldMethod = true;
                errorMsg += config.translate.alerts.no_main + '\n';
            }
        } catch(e) {
           tryOldMethod = true;
           errorMsg += e.message + '\n';
        }
        if (tryOldMethod) {
            try {
                code = microbitFs.getIntelHexAppendedScript(hexStr);
                micropythonFs.write('main.py', code);
            } catch(e) {
                // Only display an error if there were no files added to the filesystem
                if (!importedFiles.length) {
                    errorMsg += config.translate.alerts.no_script + '\n';
                    errorMsg += e.message;
                    return alert(config.translate.alerts.no_python + '\n\n' +
                            config.translate.alerts.error + errorMsg);
                }
            }
        }
        setName(filename.replace('.hex', ''));
        EDITOR.setCode(code);
    }

    // Function for adding file to filesystem
    function loadFileToFilesystem(filename, fileBytes) {
        // Check if file already exists and confirm overwrite
        if (filename !== 'main.py' && micropythonFs.exists(filename)) {
            if (!confirm(config.translate.confirms.replace_file.replace('{{file_name}}', filename))) {
                return;
            }
        }
        // For main.py confirm if the user wants to replace the editor content
        if (filename === 'main.py' && !confirm(config.translate.confirms.replace_main)) {
            return;
        }
        try {
            micropythonFs.write(filename, fileBytes);
            // Check if the filesystem has run out of space
            var _ = micropythonFs.getIntelHex();
        } catch(e) {
            if (micropythonFs.exists(filename)) {
                micropythonFs.remove(filename);
            }
            return alert(config.translate.alerts.cant_add_file + filename + '\n' + e.message);
        }
        if (filename == 'main.py') {
            // TODO: This will probably break in IE10
            var utf8 = new TextDecoder('utf-8').decode(fileBytes);
            EDITOR.setCode(utf8);
        }
    }

    // Downloads a file from the filesystem, main.py is renamed to the script name
    function downloadFileFromFilesystem(filename) {
        // Safari before v10 had issues downloading a file blob
        if ($.browser.safari && ($.browser.versionNumber < 10)) {
            alert(config.translate.alerts.save);
            var output = micropythonFs.read(filename);
            window.open('data:application/octet;charset=utf-8,' + encodeURIComponent(output), '_newtab');
            return;
        }
        // This works in all other browsers
        var output = micropythonFs.readBytes(filename);
        var blob = new Blob([output], { 'type': 'text/plain' });
        if (filename === 'main.py') {
            filename = getSafeName() + '.py';
        }
        saveAs(blob, filename);
    }

    // Update the widget that shows how much space is used in the filesystem
    function updateStorageBar() {
        var modulesSize = 0;
        var otherSize = 0;
        var mainSize = 0;
        var totalSpace = micropythonFs.getStorageSize();
        try {
            micropythonFs.write('main.py', EDITOR.getCode());
            mainSize = micropythonFs.size('main.py');
        } catch(e) {
            // No need to do any action with an error, just keep the size 0
        }
        micropythonFs.ls().forEach(function(filename) {
            var extension = filename.split('.').pop();
            if (extension === 'py') {
                if (filename !== 'main.py') {
                    modulesSize += micropythonFs.size(filename);
                }
            } else {
                otherSize += micropythonFs.size(filename);
            }
        });
        var firstTrFound = false;
        var setTrEl = function(trEl, sizePercentage) {
            if (sizePercentage > 0) {
                trEl.css('display','');
                trEl.css('width', Math.ceil(sizePercentage) + '%');
                if (!firstTrFound) {
                    trEl.attr('class', 'fs-space-table-first');
                    firstTrFound = true;
                } else {
                    trEl.attr('class', '');
                }
            } else {
                trEl.css('display', 'none');
            }
        };
        setTrEl($('#fs-space-modules'), modulesSize * 100 / totalSpace);
        setTrEl($('#fs-space-main'), mainSize * 100 / totalSpace);
        setTrEl($('#fs-space-other'), otherSize * 100 / totalSpace);
        // If we are out of free space hide the "free" box
        if ((modulesSize  + mainSize + otherSize) > (totalSpace * 0.98)) {
            $('#fs-space-free').css('display', 'none');
        } else {
            $('#fs-space-free').css('display', '');
        }
    }

    // Regenerate the table showing the file list and call for the storage bar to be updated
    function updateFileTables(loadStrings) {
        // Delete the current table body content and add rows file by file
        $('.fs-file-list table tbody').empty();
        micropythonFs.ls().forEach(function(filename) {
            var pseudoUniqueId = Math.random().toString(36).substr(2, 9);
            var name = filename;
            var disabled = '';
            if (filename === 'main.py') {
              name = getName() + ' (' + filename + ')';
              disabled = 'disabled';
            }
            $('.fs-file-list table tbody').append(
                '<tr><td>' + name + '</td>' +
                '<td>' + (micropythonFs.size(filename)/1024).toFixed(2) + ' Kb</td>' +
                '<td><button id="' + pseudoUniqueId + '_remove" class="action save-button remove ' + disabled + '" title='+ loadStrings["remove-but"] + ' ' + disabled + '><i class="fa fa-trash"></i></button>' +
                '<button id="' + pseudoUniqueId + '_save" class="action save-button save" title='+ loadStrings["save-but"] +'><i class="fa fa-download"></i></button></td></tr>'
            );
            $('#' + pseudoUniqueId + '_save').click(function(e) {
                downloadFileFromFilesystem(filename);
            });
            $('#' + pseudoUniqueId + '_remove').click(function(e) {
                micropythonFs.remove(filename);
                updateFileTables(loadStrings);
                var content = $('.expandable-content')[0];
                content.style.maxHeight = content.scrollHeight + "px";
            });
        });
        updateStorageBar();
    }

    // Generates the text for a hex file with MicroPython and the user code
    function generateFullHex(format) {
        var fullHex;
        try {
            // Remove main.py if editor content is empty to download a hex file
            // that includes the filesystem but doesn't try to run any code
            if (!EDITOR.getCode()) {
                if (micropythonFs.exists('main.py')) {
                    micropythonFs.remove('main.py');
                }
            } else {
                micropythonFs.write('main.py', EDITOR.getCode());
            }
            // Generate hex file
            if(format == "bytes") {
                fullHex = micropythonFs.getIntelHexBytes();
            } else {
                fullHex = micropythonFs.getIntelHex();
            }
        } catch(e) {
            // We generate a user readable error here to be caught and displayed
            throw new Error(config.translate.alerts.load_code + '\n' + e.message);
        }
        return fullHex;
    }

    // Trap focus in modal and pass focus to first actionable element
    function focusModal(modalId) {
        document.querySelector('body > :not(.vex)').setAttribute('aria-hidden', true);
        var dialog = document.querySelector(modalId);
        var focusableEls = dialog.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
        $(focusableEls).each(function() {
            $(this).attr('tabindex', '0');
        });
        dialog.focus();
        dialog.onkeydown = function(event) {
            if (event.which == 9) {
                // if tab key is pressed
                var numberOfFocusableEls = focusableEls.length;
                if (!numberOfFocusableEls) {
                    dialog.focus();
                    event.preventDefault();
                    return;
                }

                var focusedEl = document.activeElement;
                var focusedElIndex = Array.prototype.indexOf.call(focusableEls, focusedEl);
                if (event.which == 16) {
                    // if focused on first item and user shift-tabs back, go to the last focusable item
                    if (focusedElIndex == 0) {
                        focusableEls.item(numberOfFocusableEls - 1).focus();
                        event.preventDefault();
                    }
                } else {
                    // if focused on the last item and user tabs forward, go to the first focusable item
                    if (focusedElIndex == numberOfFocusableEls - 1) {
                        focusableEls[0].focus();
                        event.preventDefault();
                    }
                }
            }
        };
    }

    // This function describes what to do when the download button is clicked.
    function doDownload() {
        try {
            var output = generateFullHex("string");
        } catch(e) {
            alert(config.translate.alerts.error + e.message);
            return;
        }
        // Safari before v10 had issues downloading the file blob
        if ($.browser.safari && ($.browser.versionNumber < 10)) {
            alert(config.translate.alerts.download);
            window.open('data:application/octet;charset=utf-8,' + encodeURIComponent(output), '_newtab');
            return;
        }
        // This works in all other browser
        var filename = getSafeName();
        var blob = new Blob([output], { 'type': 'application/octet-stream' });
        saveAs(blob, filename + '.hex');
    }

    function invalidFileWarning(fileType){
        if(fileType=="mpy"){
            modalMsg(config['translate']['load']['invalid-file-title'],config['translate']['load']['mpy-warning'],"");
        }else{
            modalMsg(config['translate']['load']['invalid-file-title'], config['translate']['load']['extension-warning'],"");
        }
    }
    // Describes what to do when the save/load button is clicked.
    function doFiles() {
        var template = $('#files-template').html();
        Mustache.parse(template);
        config.translate.load["program-title"] = $("#script-name").val();
        var loadStrings = config.translate.load;
        vex.open({
            content: Mustache.render(template, loadStrings),
            afterOpen: function(vexContent) {
                focusModal("#files-modal");
                $("#show-files").attr("title", loadStrings["show-files"] +" (" + micropythonFs.ls().length + ")");
                document.getElementById("show-files").innerHTML = loadStrings["show-files"] + " (" + micropythonFs.ls().length + ") <i class='fa fa-caret-down'>";
                $('#save-hex').click(function() {
                    doDownload();
                });
                $('#save-py').click(function() {
                    if (micropythonFs.ls().length > 1) {
                        if (!confirm(config.translate.confirms.download_py_multiple.replace('{{file_name}}', getSafeName() + '.py'))) {
                            return;
                        }
                    }
                    downloadFileFromFilesystem('main.py');
                });
                $("#expandHelpPara").click(function(){
                    if ($("#fileHelpPara").css("display")=="none"){
                        $("#fileHelpPara").show();
                        $("#expandHelpPara").attr("aria-expanded","true");
                        $("#addFile").css("margin-bottom","10px");
                    }else{
                        $("#fileHelpPara").hide();
                        $("#expandHelpPara").attr("aria-expanded","false");
                        $("#addFile").css("margin-bottom","22px");
                    }
                });
                $('#show-files').click(function() {
                  var content = $('.expandable-content')[0];
                  if (content.style.maxHeight){
                    content.style.maxHeight = null;
                    $("#hide-files").attr("id", "show-files");
                    $("#show-files").attr("aria-expanded","false");
                    $("#show-files").attr("title", loadStrings["show-files"] + " (" + micropythonFs.ls().length + ")");
                    document.getElementById("show-files").innerHTML = loadStrings["show-files"] + " (" + micropythonFs.ls().length + ") <i class='fa fa-caret-down'>";
                  } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                    $("#show-files").attr("id", "hide-files");
                    $("#hide-files").attr("aria-expanded","true");
                    $("#hide-files").attr("title", loadStrings["hide-files"]);
                    document.getElementById("hide-files").innerHTML =loadStrings["hide-files"] + " <i class='fa fa-caret-up'>";
                  }
                });
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
                $('#file-upload-link').click(function() {
                    $('#file-upload-input').trigger('click');
                });
                $('#file-upload-input').on('change', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var inputFile = this;
                    document.dispatchEvent(new CustomEvent('file-upload', { detail: inputFile.files }));
                    if (inputFile.files.length === 1) {
                        var f = inputFile.files[0];
                        var ext = (/[.]/.exec(f.name)) ? /[^.]+$/.exec(f.name) : null;
                        var reader = new FileReader();
                        if (ext == 'py') {
                            reader.onload = function(e) {
                                loadPy(f.name, e.target.result);
                            };
                            reader.readAsText(f);
                        } else if (ext == 'hex') {
                            reader.onload = function(e) {
                                loadHex(f.name, e.target.result);
                            };
                            reader.readAsText(f);
                        } else{
                            invalidFileWarning(ext);
                        }
                    }
                    inputFile.value = '';
                    vex.close();
                    EDITOR.focus();
                    return false;
                });
                $('#fs-file-upload-button').click(function() {
                    $('#fs-file-upload-input').trigger('click');
                });
                $('#fs-file-upload-input').on('change', function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var inputFile = this;
                    Array.from(inputFile.files).forEach(function(file) {
                        var fileReader = new FileReader();
                        fileReader.onload = function(e) {
                            loadFileToFilesystem(file.name, new Uint8Array(e.target.result));
                            updateFileTables(loadStrings);
                            var content = $('.expandable-content')[0];
                            content.style.maxHeight = content.scrollHeight + "px";
                        };
                        fileReader.readAsArrayBuffer(file);
                    });
                    inputFile.value = '';
                });
            }
        });
        updateFileTables(loadStrings);
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
                focusModal("#snippet-modal");
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
            reader.onload = function(e) {
                loadPy(file.name, e.target.result);
            };
            reader.readAsText(file);
            $('#editor').focus();
        } else if (ext == 'hex') {
            reader.onload = function(e) {
                loadHex(file.name, e.target.result);
            };
            reader.readAsText(file);
            $('#editor').focus();
        } else {
            invalidFileWarning(ext);
        }
    }

    function showDisconnectError(event) {
        var error = {"name": "device-disconnected", "message": config["translate"]["webusb"]["err"]["device-disconnected"]};
        webusbErrorHandler(error);
    }

    function doConnect(serial) {
        // Change button to connecting
        $("#command-connect").hide();
        $("#command-connecting").show();
        $("#command-disconnect").hide();

        // Show error on WebUSB Disconnect Events
        navigator.usb.addEventListener('disconnect', showDisconnectError);

        var p = Promise.resolve();
        if (usePartialFlashing) {
            console.log("Connecting: Using Quick Flash");
            p = PartialFlashing.connectDapAsync();
        }
        else {
            console.log("Connecting: Using Full Flash");
            p = navigator.usb.requestDevice({
                filters: [{vendorId: 0x0d28, productId: 0x0204}]
            }).then(function(device) {
                // Connect to device
                window.transport = new DAPjs.WebUSB(device);
                window.daplink = new DAPjs.DAPLink(window.transport);

                // Ensure disconnected
                window.daplink.disconnect().catch(function(e) {
                    // Do nothing if already disconnected
                });

                // Connect to board
                return window.daplink.connect();
            })
            .then(function() {
                console.log('Connection Complete');
            });
        }

        return p.then(function() {
            // Dispatch event for listeners
            document.dispatchEvent(new CustomEvent('webusb', { 'detail': {
                'flash-type': 'webusb',
                'event-type': 'info',
                'message': 'connected'
            }}));

            // Change button to disconnect
            $("#command-connect").hide();
            $("#command-connecting").hide();
            $("#command-disconnect").show();

            // Change download to flash
            $("#command-download").hide();
            $("#command-flash").show();

            if (serial) {
                doSerial();
            }
        })
        .catch(webusbErrorHandler);
    }

    function webusbErrorHandler(err) {
        // Display error handler modal
        $("#flashing-overlay-container").css("display", "flex");
        $("#flashing-info").addClass('hidden');

        // Log error to console for feedback
        console.log("An error occurred whilst attempting to use WebUSB.");
        console.log("Details of the error can be found below, and may be useful when trying to replicate and debug the error.");
        console.log(err);
        console.trace();

        // Disconnect from the microbit
        doDisconnect().then(function() {
            // As there has been an error clear the partial flashing DAPWrapper
            if (window.dapwrapper) {
                window.dapwrapper = null;
            }
            if (window.previousDapWrapper) {
                window.previousDapWrapper = null;
            }
        });

        var errorType;
        var errorTitle;
        var errorDescription;

        // Determine type of error
        switch(typeof err) {
            case "object":
                console.log("Caught in Promise or Error object");
                // We might get Error objects as Promise rejection arguments
                if (!err.message && err.promise && err.reason) {
                    err = err.reason;
                }

                // Determine error type
                if (err.message === "No valid interfaces found.") {
                    errorType = "update-req";
                    errorTitle = err.message;
                    errorDescription = config["translate"]["webusb"]["err"][errorType];
                } else if (err.message === "Unable to claim interface.") {
                    errorType = "clear-connect";
                    errorTitle = err.message;
                    errorDescription = config["translate"]["webusb"]["err"][errorType];
                } else if (err.name === "device-disconnected") {
                    errorType = "device-disconnected";
                    errorTitle = err.message;
                    // No additional message provided here, err.message is enough
                    errorDescription = "";
                } else if (err.name === "timeout-error") {
                    errorType = "timeout-error";
                    errorTitle = "Connection Timed Out";
                    errorDescription = config["translate"]["webusb"]["err"]["reconnect-microbit"];
                } else {
                    // Unhandled error. User will need to reconnect their micro:bit
                    errorType = "reconnect-microbit";
                    errorTitle = "WebUSB Error";
                    errorDescription = config["translate"]["webusb"]["err"][errorType];
                    if (usePartialFlashing && config.flags.experimental) {
                        errorDescription += '<br>' + config["translate"]["webusb"]["err"]["partial-flashing-disable"];
                    }
                }

                break;
            case "string":
                // Caught a string. Example case: "Flash error" from DAPjs
                console.log("Caught a string");
                
                // Unhandled error. User will need to reconnect their micro:bit
                errorType = "reconnect-microbit";
                errorTitle = "WebUSB Error";
                errorDescription = config["translate"]["webusb"]["err"][errorType];
                if (usePartialFlashing && config.flags.experimental) {
                    errorDescription += '<br>' + config["translate"]["webusb"]["err"]["partial-flashing-disable"];
                }
                break;
            default:
                // Unexpected error type
                console.log("Unexpected error type: " + typeof(err) );
                
                // Unhandled error. User will need to reconnect their micro:bit
                errorType = "reconnect-microbit";
                errorTitle = "WebUSB Error";
                errorDescription = config["translate"]["webusb"]["err"][errorType];
                if (usePartialFlashing && config.flags.experimental) {
                    errorDescription += '<br>' + config["translate"]["webusb"]["err"]["partial-flashing-disable"];
                }
        }

        // If err is not device disconnected or if there is previous errors, append the download/troubleshoot buttons
        var showOverlayButtons = "";
        if(err.name !== 'device-disconnected' || $("#flashing-overlay-error").html() !== "") {
            showOverlayButtons = '<a title="" href="#" id="flashing-overlay-download" class="action" onclick="actionClickListener(event)">' +
                                    config["translate"]["webusb"]["download"] + 
                                 '</a> | ' +
                                 '<a title="" target="_blank" href="https://support.microbit.org/solution/articles/19000105428-webusb-troubleshooting/en" id="flashing-overlay-troubleshoot" class="action" onclick="actionClickListener(event)">' +
                                    config["translate"]["webusb"]["troubleshoot"] + 
                                '</a> | ';
        }

        var errorHTML = 
                    '<div>' + 
                        '<strong>' + errorTitle + '</strong>' +
                        '<br >' + 
                        errorDescription + 
                        (err.message ? ("<code>Error: " + err.message + "</code>") : "") +
                    '</div>' + 
                    '<div class="flashing-overlay-buttons">' + 
                        '<hr />' +
                        showOverlayButtons + 
                        '<a title="" href="#" onclick="flashErrorClose()">' + config["translate"]["webusb"]["close"] + '</a>' + 
                    '</div>';

        // Show error message, or append to existing errors
        if($("#flashing-overlay-error").html() == "") {
            $("#flashing-overlay-error").html(errorHTML);
        } else {
            $(".flashing-overlay-buttons").hide(); // Hide previous buttons
            $("#flashing-overlay-error").append("<hr />" + errorHTML);
        }

        // Attach download handler
        $("#flashing-overlay-download").click(doDownload);

        // Make the modal accessible now that all the content is present
        focusModal("#flashing-overlay");
        // If escape key is pressed close modal
        $('#flashing-overlay').keydown(function(e) {
            if (e.which == 27) {
                flashErrorClose();
            }
        });

        // Send event
        var errorMessage = (err.message ? (err.message.replace(/\W+/g, '-').replace(/\W$/, '').toLowerCase()) : "");
        // Append error message, replace all special chars with '-', if last char is '-' remove it
        var details = {
                "flash-type": (usePartialFlashing ? "partial-flash" : "full-flash"), 
                "event-type": ((err.name == "device-disconnected") ? "info" : "error"), 
                "message": errorType + "/" + errorMessage
        };

        document.dispatchEvent(new CustomEvent('webusb', { detail: details }));
    }

    function doDisconnect() {
        // Remove disconnect listener
        navigator.usb.removeEventListener('disconnect', showDisconnectError);

        // Hide serial and disconnect if open
        if ($("#repl").css('display') != 'none') {
            closeSerial();
        }

        // Change button to connect
        $("#command-disconnect").hide();
        $("#command-connecting").hide();
        $("#command-connect").show();

        // Change flash to download
        $("#command-flash").hide();
        $("#command-download").show();

        var p = Promise.resolve();

        if (usePartialFlashing && window.dapwrapper) {
            console.log('Disconnecting: Using Quick Flash');
            p = p.then(function() { return window.dapwrapper.disconnectAsync() });
        }
        else if (window.daplink) {
            console.log('Disconnecting: Using Full Flash');
            p = p.then(function() { return window.daplink.disconnect() });
        }

        p = p.catch(function() {
            console.log('Error during disconnection');
            document.dispatchEvent(new CustomEvent('webusb', { 'detail': {
                'flash-type': 'webusb',
                'event-type': 'error',
                'message': 'error-disconnecting'
            }}));
        }).finally(function() {
            console.log('Disconnection Complete');
            document.dispatchEvent(new CustomEvent('webusb', { 'detail': {
                'flash-type': 'webusb',
                'event-type': 'info',
                'message': 'disconnected'
            }}));
        });

        return p;
    }

    function doFlash() {
        var startTime = new Date().getTime();

        // Hide serial and disconnect if open
        if ($("#repl").css('display') != 'none') {
            closeSerial();
        }

        // Get the hex to flash in bytes format, exit if there is an error
        try {
            var output = generateFullHex('bytes');
        } catch(e) {
            return alert(config.translate.alerts.error + e.message);
        }

        $("#webusb-flashing-progress").val(0).hide();
        $("#webusb-flashing-complete").hide();
        $("#webusb-flashing-loader").show();
        $('#flashing-overlay-error').html("");
        $("#flashing-info").removeClass('hidden');
        $("#flashing-overlay-container").css("display", "flex");

        var connectTimeout = setTimeout(function() {
            var error = {"name": "timeout-error", "message": config["translate"]["webusb"]["err"]["timeout-error"]};
            webusbErrorHandler(error);
        }, 10000);

        var updateProgress = function(progress) {
            $('#webusb-flashing-progress').val(progress).css('display', 'inline-block');
        };

        var p = Promise.resolve();
        if (usePartialFlashing) {
            p = window.dapwrapper.disconnectAsync()
                .then(function() {
                    return PartialFlashing.connectDapAsync();
                })
                .then(function() {
                    // Clear connecting timeout
                    clearTimeout(connectTimeout);

                    // Begin flashing
                    $("#webusb-flashing-loader").hide();
                    $("#webusb-flashing-progress").val(0).css("display", "inline-block");
                    return PartialFlashing.flashAsync(window.dapwrapper, output, updateProgress);
                });
        }
        else {
            // Push binary to board
            console.log("Starting Full Flash");
            p = window.daplink.connect()
                .then(function() {
                    // Clear connecting timeout
                    clearTimeout(connectTimeout);

                    // Event to monitor flashing progress
                    window.daplink.on(DAPjs.DAPLink.EVENT_PROGRESS, updateProgress);

                    // Encode firmware for flashing
                    var enc = new TextEncoder();
                    var image = enc.encode(output).buffer;

                    $("#webusb-flashing-loader").hide();
                    $("#webusb-flashing-progress").val(0).css("display", "inline-block");
                    return window.daplink.flash(image);
                });
        }

        return p.then(function() {
            // Show tick
            $("#webusb-flashing-progress").hide();
            $("#webusb-flashing-complete").show();

            // Send flash timing event
            var timeTaken = (new Date().getTime() - startTime);
            var details = {"flash-type": (usePartialFlashing ? "partial-flash" : "full-flash"), "event-type": "flash-time", "message": timeTaken};
            document.dispatchEvent(new CustomEvent('webusb', { detail: details }));

            console.log("Flash complete");

            // Close overview
            setTimeout(flashErrorClose, 500);
        })
        .catch(webusbErrorHandler)
        .finally(function() {
            // Remove event listener
            window.removeEventListener("unhandledrejection", webusbErrorHandler);
        });
    }

    function closeSerial(keepSession) {
        console.log("Closing Serial Terminal");
        $('#repl').empty();
        $('#repl').hide();
        $('#request-repl').hide();
        $('#request-serial').hide();
        $('#editor-container').show();

        var serialButton = config['translate']['static-strings']['buttons']['command-serial'];
        $('#command-serial').attr('title', serialButton['title']);
        $('#command-serial > .roundlabel').text(serialButton['label']);

        var daplink = usePartialFlashing ? window.dapwrapper.daplink : window.daplink;
        daplink.stopSerialRead();
        daplink.removeAllListeners(DAPjs.DAPLink.EVENT_SERIAL_DATA);
        REPL.uninstallKeyboard();
        REPL.io.pop();
        REPL = null;
    }

    function doSerial() {
        // Hide terminal if it is currently shown
        var serialButton = config["translate"]["static-strings"]["buttons"]["command-serial"];
        if ($("#repl").css('display') != 'none') {
            closeSerial();
            return;
        }

        console.log("Setting Up Serial Terminal");
        // Check if we need to connect
        if ($("#command-connect").is(":visible")){
            doConnect(true);
        } else {
            // Change Serial button to close
            $("#command-serial").attr("title", serialButton["title-close"]);
            $("#command-serial > .roundlabel").text(serialButton["label-close"]);

            var daplink = usePartialFlashing ? window.dapwrapper.daplink : window.daplink;

            daplink.connect()
            .then( function() {
                return daplink.setSerialBaudrate(115200);
            })
            .then( function() {
                return daplink.getSerialBaudrate();
            })
            .then(function(baud) {
                daplink.startSerialRead(1);
                lib.init(setupHterm);
            })
            .catch(webusbErrorHandler);
        }
    }

    function setupHterm() {
        if (REPL == null) {
            hterm.defaultStorage = new lib.Storage.Memory();

            REPL = new hterm.Terminal("opt_profileName");
            REPL.options_.cursorVisible = true;
            REPL.prefs_.set('font-size', 22);
            REPL.onTerminalReady = function() {
                var io = REPL.io.push();
                io.onVTKeystroke = function(str) {
                    var daplink = usePartialFlashing ? window.dapwrapper.daplink : window.daplink;
                    daplink.serialWrite(str);
                };
                io.sendString = function(str) {
                    var daplink = usePartialFlashing ? window.dapwrapper.daplink : window.daplink;
                    daplink.serialWrite(str);
                };
                io.onTerminalResize = function(columns, rows) {
                };
            };
            REPL.decorate(document.querySelector('#repl'));
            REPL.installKeyboard();

            var daplink = usePartialFlashing ? window.dapwrapper.daplink : window.daplink;
            daplink.on(DAPjs.DAPLink.EVENT_SERIAL_DATA, function(data) {
                REPL.io.print(data); // first byte of data is length
            });
        }

        $("#editor-container").hide();
        $("#repl").show();
        $("#request-repl").show();
        $("#request-serial").show();

        // Recalculate terminal height
        $("#repl > iframe").css("position", "relative");
        $("#repl").attr("class", "hbox flex1");
        REPL.prefs_.set('font-size', getFontSize());
    }

    function modalMsg(title, content, links){
        var overlayContainer = "#modal-msg-overlay-container";
        $(overlayContainer).css("display","block");
        $("#modal-msg-title").text(title);
        $("#modal-msg-content").html(content);
        var modalLinks = [];
        var addCloseClickListener = false;
        if (links) {
            Object.keys(links).forEach(function(key) {
                if (links[key] === "close") {
                    modalLinks.push('<button type="button" area-labelledby="modal-msg-close-link" id="modal-msg-close-link">' + key + '</button>');

                    addCloseClickListener = true;
                } else {
                    modalLinks.push('<button type="button" aria-label="' + key + '" class="button-link" onclick="window.open(\' ' + links[key] + '\', \'_blank\')">' + key + '</button>');
                }
            });
        }
        $("#modal-msg-links").html((modalLinks).join(' | '));
        focusModal("#modal-msg-overlay");
        var modalMsgClose = function() {
            $(overlayContainer).hide()
            $(overlayContainer).off("keydown");
        };
        $("#modal-msg-close-cross").click(modalMsgClose);
        if (addCloseClickListener) {
            $("#modal-msg-close-link").click(modalMsgClose);
        }
        $(overlayContainer).keydown(function(e) {
            if (e.which == 27) {
                modalMsgClose();
            }
        });
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
        if(navigator.platform.match('Win') !== null){
            $(".roundsymbol").addClass("winroundsymbol");
            $("#small-icons-left .status-icon").addClass("win-status-icon");
            $("#small-icons-right .status-icon").addClass("win-status-icon");
        }
        $("#command-download").click(function () {
            doDownload();
        });
        $("#command-flash").click(function () {
            doFlash();
        });
        $("#command-files").click(function () {
            doFiles();
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
        if (navigator.usb) {
            $("#command-connect").click(function () {
                doConnect();
            });
            $("#command-disconnect").click(function () {
                doDisconnect();
            });
            $("#command-serial").click(function () {
                doSerial();
            });
            $("#request-repl").click(function () {
                var daplink = usePartialFlashing && window.dapwrapper ? window.dapwrapper.daplink : window.daplink;
                daplink.serialWrite('\x03');
                REPL.focus();
            });
            $("#request-serial").click(function () {
                var daplink = usePartialFlashing && window.dapwrapper ? window.dapwrapper.daplink : window.daplink;
                daplink.serialWrite('\x04');
            });
        } else {
            var WebUSBUnavailable = function() {
                var links = {};
                links[config['translate']['webusb']['err']['find-more']] = 'help.html#WebUSB';
                modalMsg('WebUSB', config['translate']['webusb']['err']['unavailable'], links);
            };
            $("#command-connect").click(WebUSBUnavailable);
            $("#command-serial").click(WebUSBUnavailable);

            $("#modal-msg-overlay-container").click(function(){
                $("#modal-msg-overlay-container").hide()
            });
            $("#modal-msg-overlay").click(function(e){
                e.stopPropagation();
            });
        }
        $("#command-options").click(function (e) {
            // Hide any other open menus and show/hide options menu
            $('#helpsupport_container').addClass('hidden');
            $('#language_container').addClass('hidden');
            $('#options_container').toggleClass('hidden');
            formatMenuContainer('command-options', 'options_container');
            // Stop closure of the menu in other local event handlers
            e.originalEvent.keepMenuOpen = true;
        });
        $("#command-help").click(function (e) {
            // Hide any other open menus and show/hide help menu
            $('#options_container').addClass('hidden');
            $('#language_container').addClass('hidden');
            $('#helpsupport_container').toggleClass('hidden');
            formatMenuContainer('command-help', 'helpsupport_container');
            // Stop closure of the menu in other local event handlers
            e.originalEvent.keepMenuOpen = true;
        });
        $("#command-zoom-in").click(function (e) {
            zoomIn();
        });
        $("#command-zoom-out").click(function (e) {
            zoomOut();
        });
        $("#command-language").click(function (e) {
            // Hide any other open menus and show/hide help menu
            $('#options_container').addClass('hidden');
            $('#helpsupport_container').addClass('hidden');
            $('#language_container').toggleClass('hidden');
            formatMenuContainer('command-language', 'language_container');
            // Stop closure of the menu in other local event handlers
            e.originalEvent.keepMenuOpen = true;
        });

        $(".lang-choice").on("click", function() {
            $("#language_container").addClass('hidden');
            setLanguage($(this).attr('id'));
        });

        $('#menu-switch-autocomplete').on('change', function() {
            var setEnable = $(this).is(':checked');
            if (setEnable) {
                $('#autocomplete-enter').removeClass('hidden');
            } else {
                $('#autocomplete-enter').addClass('hidden');
            }
            EDITOR.enableAutocomplete(setEnable);
            var setEnterEnable = $('#menu-switch-autocomplete-enter').is(':checked');
            EDITOR.triggerAutocompleteWithEnter(setEnterEnable);
        });
        $('#menu-switch-autocomplete-enter').on('change', function() {
            var setEnable = $(this).is(':checked');
            EDITOR.triggerAutocompleteWithEnter(setEnable);
        });
        $('#menu-switch-partial-flashing').on('change', function() {
            var setEnable = $(this).is(':checked');
            return doDisconnect()
                .catch(function(err) {
                    // Assume an error means that it is already disconnected.
                    // console.log("Error disconnecting when " + (setEnable ? "not " : "") + "using partial flashing: \r\n" + err);
                })
                .then(function() { usePartialFlashing = setEnable } ) 
        });

        window.addEventListener('resize', function() {
            formatMenuContainer('command-options', 'options_container');
            formatMenuContainer('command-help', 'helpsupport_container');
            formatMenuContainer('command-language', 'language_container');
        });

        document.body.addEventListener('click', function(event) {
            if (event.keepMenuOpen) return;
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
    setLanguage(qs.l || 'en');
    document.addEventListener('DOMContentLoaded', function() {
        // Firmware at the end of the HTML file has to be loaded first
        setupFilesystem();
    });

    // If iframe messaging allowed, initialize it
    if (controllerMode) {
      initializeIframeMessaging();
    }
}

/*
 * Function to close flash error box
 */
function flashErrorClose() {
    $('#flashing-overlay-error').html("");
    $('#flashing-overlay-container').hide();
    $('#flashing-overlay').off("keydown");
}
