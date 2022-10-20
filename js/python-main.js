/*
A simple editor that targets MicroPython for the BBC micro:bit.

Feel free to have a look around! (We've commented the code so you can see what
everything does.)
*/

/*
Lazy load JS script files.
*/
function script(url, id, onLoadCallback) {
    var s = document.createElement('script');
    if (id){
        s.id = id;
    }
    s.type = 'text/javascript';
    s.async = false;
    s.defer = true;
    s.src = url;
    if (onLoadCallback) {
        s.onload = onLoadCallback;
    }
    var x = document.getElementsByTagName('head')[0];
    x.appendChild(s);
}

// Allows for different CSS styling in IE10
var doc = document.documentElement;
doc.setAttribute('data-useragent', navigator.userAgent);

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
    editor.setAutocompleteApi = function(autocompleteApi) {
        var extraCompletions = (autocompleteApi || []).map(function(word) {
            return { "caption": word, "value": word, "meta": "static" };
        });
        langTools.setCompleters([langTools.keyWordCompleter, langTools.textCompleter, {
            "identifierRegexps": [/[a-zA-Z_0-9\.\-\u00A2-\uFFFF]/],
            "getCompletions": function(editor, session, pos, prefix, callback) {
                callback(null, extraCompletions);
            }
        }]);
    };

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

    // Remove a handler function to be run when code in the editor changes.
    editor.on_change_remove = function(handler) {
        ACE.getSession().off('change', handler);
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

    // Add ace "annotations" (box next to the line number with a mouse over
    // message) and "markers" (text highlight) to the code to highlight errors.
    // errors = [{line_start, column_start, line_end, column_end, message }]
    var Range = ace.require("ace/range").Range;
    editor.setErrors = function(errors) {
        var aceSession = ACE.getSession();
        // First remove previous errors from the editor
        aceSession.clearAnnotations();
        var markers = aceSession.getMarkers();
        for (var m in markers) {
            aceSession.removeMarker(m);
        }
        // Then add all the provided errors
        var errorAnnotations = [];
        errors.forEach(function(error) {
            errorAnnotations.push({
                row: error.line_start,   // 0 based
                text: error.message,
                type: "error"
            });
            // column_end is optional and null value marks until the line end
            if (error.column_end == null) {
                error.column_end = aceSession.getLine(error.line_end).length;;
            }
            // If the error marker is on the last line character we need to
            // highlight the character after or the annotation is empty
            if (error.line_start == error.line_end && error.column_start == error.column_end) {
                error.column_end++;
            }
            aceSession.addMarker(
                new Range(
                    error.line_start,
                    error.column_start,
                    error.line_end,
                    error.column_end
                ),
                'parser_warning',
                'py_error',
                false
            );
        });
        aceSession.setAnnotations(errorAnnotations);
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
        // Lazy loading all Blockly the JS files from submodules
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
        // Load the toolbox
        script('/js/blocks-toolbox.js');
    };

    blocklyWrapper.inject = function(blocklyElement, zoomLevel, zoomScaleSteps) {
        workspace = Blockly.inject(blocklyElement, {
            toolbox: BLOCKS_TOOLBOX,
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
function translations(baseLanguage) {
    'use strict';
    // These values must be valid language codes
    // https://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    var validLangs = ['en', 'es', 'fr', 'hr', 'ko', 'nn', 'pl', 'pt', 'sr', 'zh-HK', 'zh-CN', 'zh-TW'];

    // This is the base language that will be extended with the translations.
    // It is assumed this translation object (likely 'en') contains all the
    // keys the editor needs. By extending this object instead of replacing it
    // we ensure this will still contain any keys a translation might not have.
    var _baseLanguage = baseLanguage;
    var _extendedLang = baseLanguage;
    translateEmbedStrings();

    /* Replaces DOM script element with the new language js file. */
    function updateLang(newLang, successCallback, errorCallback) {
        var elementId = 'lang';
        var newLangURL = 'lang/' + newLang + '.js';
        var endsWithURL = new RegExp(newLangURL + "$");
        if (endsWithURL.test(document.getElementById(elementId).src)) {
            // The request newLang is the current one, don't reload js file
            return successCallback(_extendedLang);
        }
        // Check for a valid language
        if (validLangs.indexOf(newLang) >- 1) {
            LANGUAGE = null;
            document.getElementById(elementId).remove();
            script(newLangURL, elementId, function() {
                _extendedLang = $.extend(true, {}, _baseLanguage, LANGUAGE);
                translateEmbedStrings();
                successCallback(_extendedLang);
            });
        } else {
            console.error('Requested language not available: ' + newLang);
            errorCallback();
        }
    }

    /* Replaces the strings already loaded in the DOM, the rest are dynamically loaded. */
    function translateEmbedStrings() {
        var buttons = _extendedLang['static-strings']['buttons'];
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
        $('.ace_text-input').attr('aria-label', _extendedLang['static-strings']['text-editor']['aria-label']);
        $('#script-name-label').text(_extendedLang['static-strings']['script-name']['label']);
        $('#request-repl').text(_extendedLang['webusb']['request-repl']);
        $('#request-serial').text(_extendedLang['webusb']['request-serial']);
        var optionsStrings = _extendedLang['static-strings']['options-dropdown'];
        for (var object in optionsStrings) {
            $("#" + object).text(optionsStrings[object]);
        }
        var helpStrings = _extendedLang['help'];
        for (var object in helpStrings) {
            if (helpStrings.hasOwnProperty(object)) {
                if (object.match(/ver/)) {
                    $('#' + object).text(helpStrings[object]);
                    continue;
                }
                $('#' + object).text(helpStrings[object]['label']);
                $('#' + object).attr('title', helpStrings[object]['title']);
            }
        }
        // WebUSB flashing modal
        $('#flashing-extra-msg').text(_extendedLang['webusb']['flashing-long-msg']);
        $('#flashing-title').text(_extendedLang['webusb']['flashing-title']);
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
    // Generating MicroPython hex with user code in the filesystem
    window.FS = microbitFsWrapper();
    // Python code error checker
    window.CHECKER = ErrorChecker();

    var BLOCKS = blocks();
    var TRANSLATIONS = translations(config.translate);
    var CONTROLLER = EditorController();

    // Represents the REPL terminal
    var REPL = null;

    // Indicates if there are unsaved changes to the content of the editor.
    var dirty = false;

    var usePartialFlashing = true;

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
            $('#' + lang).addClass('is-selected');
        }, function() {
            // At the moment we fail silently. If the language request came
            // a URL parameter we ignore it, if it came from a menu it will
            // be caught by the CI tests
        });
    }

    // Checks for feature flags in the config object and shows/hides UI
    // elements as required.
    function setupFeatureFlags() {
        if(config.flags.blocks) {
            BLOCKS.init();
            $('#command-blockly').removeClass('hidden');
        }
        if(config.flags.snippets) {
            $("#command-snippet").removeClass('hidden');
        }
        if(config.flags.experimental) {
            $('.experimental').removeClass('experimental');
            EDITOR.ACE.renderer.scroller.style.backgroundImage = "url('static/img/experimental.png')";
            // Set up autocomplete
            EDITOR.setAutocompleteApi(microPythonApi.getBaseApi());
            EDITOR.enableAutocomplete(true);
            $('#menu-switch-autocomplete').prop("checked", true);
            $('#menu-switch-autocomplete-enter').prop("checked", false);
        }
        if(config.flags.checker) {
            $('.experimental-checker').removeClass('hidden');
        }

        // Update the help link to pass feature flag information.
        var helpAnchor = $("#help-link");
        var featureQueryString = Object.keys(config.flags).filter(function(f) {
            return config.flags[f];
        }).map(function(f) {
            return encodeURIComponent(f) + "=true";
        }).join("&");
        helpAnchor.attr("href", helpAnchor.attr("href") + "?" + featureQueryString);

        // Enable WebUSB if available in this browser
        if (navigator.usb) {
            script('static/js/dap.umd.js');
            script('static/js/hterm_all.min.js');
            script('js/partial-flashing.js');
        }
    }

    // This function is called to initialise the editor. It sets things up so
    // the user sees their code or, in the case of a new program, uses some
    // sane defaults.
    function setupEditor(migration) {
        // Set version in document title
        document.title = document.title + ' ' + EDITOR_VERSION;
        // Setup the Ace editor.
        if (migration != null) {
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
        if (isModule && FS.exists(filename)) {
            if (!confirm(config.translate.confirms.replace_module.replace('{{module_name}}', moduleName))) {
                return;
            }
            // A confirmation box to replace the module has already been accepted
            showModuleLoadedAlert = false;
        }
        if (codeStr) {
            try {
                FS.write(filename, codeStr);
            } catch(e) {
                alert(config.translate.alerts.load_code + '\n' + e.message);
            }
        } else {
            return alert(config.translate.alerts.empty);
        }
        if (isModule) {
            if (FS.getStorageRemaining() < 0){
                FS.remove(filename);
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
        var importedFiles = [];
        // If hexStr is parsed correctly it formats the file system before adding the new files
        try {
            importedFiles = FS.importHexFiles(hexStr);
        } catch(hexImportError) {
            try {
                importedFiles = FS.importHexAppended(hexStr);
            } catch(appendedError) {
                return alert(config.translate.alerts.no_python + '\n\n' +
                             config.translate.alerts.error + '\n' +
                             hexImportError.message + '\n' + 
                             config.translate.alerts.no_script);
            }
        }
        // Check if imported files includes a main.py file
        var code = '';
        if (importedFiles.indexOf('main.py') > -1) {
            code = FS.read('main.py');
        } else {
            alert(config.translate.alerts.no_main);
        }
        setName(filename.replace('.hex', ''));
        EDITOR.setCode(code);
    }

    // Function for adding file to filesystem
    function loadFileToFilesystem(filename, fileBytes) {
        // Check if file already exists and confirm overwrite
        if (filename !== 'main.py' && FS.exists(filename)) {
            if (!confirm(config.translate.confirms.replace_file.replace('{{file_name}}', filename))) {
                return;
            }
        }
        // For main.py confirm if the user wants to replace the editor content
        if (filename === 'main.py' && !confirm(config.translate.confirms.replace_main)) {
            return;
        }
        try {
            FS.write(filename, fileBytes);
            // Check if the filesystem has run out of space
            var _ = FS.getUniversalHex();
        } catch(e) {
            if (FS.exists(filename)) {
                FS.remove(filename);
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
    var downloadFileFromFilesystem = function(filename) {
        // Safari before v10 had issues downloading a file blob
        if ($.browser.safari && ($.browser.versionNumber < 10)) {
            alert(config.translate.alerts.save);
            var output = FS.read(filename);
            window.open('data:application/octet;charset=utf-8,' + encodeURIComponent(output), '_newtab');
            return;
        }
        // This works in all other browsers
        var output = FS.readBytes(filename);
        var blob = new Blob([output], { 'type': 'text/plain' });
        if (filename === 'main.py') {
            filename = getSafeName() + '.py';
        }
        saveAs(blob, filename);
    };

    // Update the widget that shows how much space is used in the filesystem
    function updateStorageBar() {
        var modulesSize = 0;
        var otherSize = 0;
        var mainSize = 0;
        var totalSpace = FS.getStorageSize();
        try {
            updateMain();
            mainSize = FS.size('main.py');
        } catch(e) {
            // No need to do any action with an error, just keep the size 0
        }
        FS.ls().forEach(function(filename) {
            var extension = filename.split('.').pop();
            if (extension === 'py') {
                if (filename !== 'main.py') {
                    modulesSize += FS.size(filename);
                }
            } else {
                otherSize += FS.size(filename);
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
        FS.ls().forEach(function(filename) {
            var pseudoUniqueId = Math.random().toString(36).substr(2, 9);
            var name = filename;
            var disabled = '';
            if (filename === 'main.py') {
              name = getName() + ' (' + filename + ')';
              disabled = 'disabled';
            }
            $('.fs-file-list table tbody').append(
                '<tr><td>' + name + '</td>' +
                '<td>' + (FS.size(filename)/1024).toFixed(2) + ' Kb</td>' +
                '<td><button id="' + pseudoUniqueId + '_remove" class="action save-button remove ' + disabled + '" title='+ loadStrings["remove-but"] + ' ' + disabled + '><i class="fa fa-trash"></i></button>' +
                '<button id="' + pseudoUniqueId + '_save" class="action save-button save" title='+ loadStrings["save-but"] +'><i class="fa fa-download"></i></button></td></tr>'
            );
            $('#' + pseudoUniqueId + '_save').click(function(e) {
                downloadFileFromFilesystem(filename);
            });
            $('#' + pseudoUniqueId + '_remove').click(function(e) {
                FS.remove(filename);
                updateFileTables(loadStrings);
                var content = $('.expandable-content')[0];
                content.style.maxHeight = content.scrollHeight + "px";
            });
        });
        updateStorageBar();
    }

    // Update main.py code with required rules for including or excluding the file
    function updateMain() {
        try {
            // Remove main.py if editor content is empty to download a hex file
            // with MicroPython included (also includes the rest of the filesystem)
            var mainCode = EDITOR.getCode();
            if (!mainCode) {
                if (FS.exists('main.py')) {
                    FS.remove('main.py');
                }
            } else {
                FS.write('main.py', mainCode);
            }
        } catch(e) {
            // We generate a user readable error here to be caught and displayed
            throw new Error(config.translate.alerts.load_code + '\n' + e.message);
        }
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
    var doDownload = function() {
        try {
            updateMain();
            var output = FS.getUniversalHex();
        } catch(e) {
            alert(config.translate.alerts.error + '\n' + e.message);
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
        var blob = new Blob([output], { 'type': 'text/plain' });
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
                $('#show-files').attr('title', loadStrings['show-files'] +' (' + FS.ls().length + ')');
                document.getElementById('show-files').innerHTML = loadStrings['show-files'] + ' (' + FS.ls().length + ') <i class="fa fa-caret-down">';
                $('#save-hex').on('click', doDownload);
                $('#save-py').click(function() {
                    if (FS.ls().length > 1) {
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
                    $('#show-files').attr('title', loadStrings['show-files'] + ' (' + FS.ls().length + ')');
                    document.getElementById('show-files').innerHTML = loadStrings['show-files'] + ' (' + FS.ls().length + ') <i class="fa fa-caret-down">';
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
                BLOCKS.inject(blocklyElement, zoomLevel, zoomScaleSteps);
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
        var error = {
            "name": "device-disconnected",
            "message": config["translate"]["webusb"]["err"]["device-disconnected"]
        };
        document.dispatchEvent(new CustomEvent('webusb', { 'detail': {
            'flash-type': usePartialFlashing ? 'partial-flash' : 'full-flash',
            'event-type': 'info',
            'message': 'disconnected'
        }}));
        webusbErrorHandler(error);
    }

    function doConnect() {
        // Change button to connecting
        $("#command-connect").hide();
        $("#command-connecting").show();
        $("#command-disconnect").hide();

        // Show error on WebUSB Disconnect Events
        navigator.usb.addEventListener('disconnect', showDisconnectError);

        console.log("Connecting WebUSB");
        return PartialFlashing.connectDapAsync()
            .then(function() {
                // Dispatch event for listeners
                document.dispatchEvent(new CustomEvent('webusb', { 'detail': {
                    'flash-type': 'webusb',
                    'event-type': 'info',
                    'message': 'connected'
                }}));

                // Update the Editor autocompletion MicroPython PI based on the board connected
                var boardApi = microPythonApi.getCompatibleMicroPythonApi(window.dapwrapper.boardId);
                EDITOR.setAutocompleteApi(boardApi);

                // Change button to disconnect
                $('#command-connect').hide();
                $('#command-connecting').hide();
                $('#command-disconnect').show();
                // Change download to flash
                $('#command-download').hide();
                $('#command-flash').show();
            });
    }

    function webusbErrorHandler(err) {
        // Log error to console for feedback
        console.log('An error occurred whilst attempting to use WebUSB, details below:');
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
                // TODO: Checking for strings provided by DAPJs is brittle, we
                // should add some kind of tests to ensure these still exist
                if (err.message === "No valid interfaces found.") {
                    // Generated by DAPJs?
                    errorTitle = config["translate"]["webusb"]['err']['update-req-title'];
                    errorType = 'update-req';
                    err.message = ''
                    errorDescription = config["translate"]["webusb"]["err"][errorType];
                } else if (err.message === "Unable to claim interface.") {
                    // Generated by DAPJs?
                    errorType = "clear-connect";
                    errorTitle = err.message;
                    errorDescription = config["translate"]["webusb"]["err"][errorType];
                } else if (err.name === "device-disconnected") {
                    // Generated by the editor when the browser WebUSB connection
                    // triggers a disconnected event.
                    // In this case we don't show an error modal any more, the
                    // editor UI should be already updated and in "not connected" mode
                    return;
                } else if (err.name === "timeout-error") {
                    // From time outs triggered in the editor to ensure we don't get stuck
                    errorType = "timeout-error";
                    errorTitle = config["translate"]["webusb"]["err"]["timeout-error-title"];
                    errorDescription = config["translate"]["webusb"]["err"]["reconnect-microbit"];
                } else if (err.message === 'device-bootloader') {
                    // Triggered from partial-flashing.js when micro:bit is in MAINTENANCE mode
                    errorType = 'reconnect-microbit';
                    errorTitle = config['translate']['webusb']['err']['device-bootloader-title'];
                    errorDescription = config['translate']['webusb']['err']['device-bootloader'];
                    // Add URL to the description
                    errorDescription += ' <a href="https://support.microbit.org/support/solutions/articles/19000082598-maintenance-mode" target="_blank">';
                    errorDescription += 'https://support.microbit.org/support/articles/19000082598</a>'
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
            case "undefined":
                console.log('Unexpected error received is undefined.');
                // Defining something so that he rest of the function has something to query
                err = 'Undefined error';
                // Intentional fall-through to run default code as well
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

        // Display error handler modal
        $('#flashing-overlay-container').css('display', 'flex');
        $('#flashing-info').addClass('hidden');

        // Add the error message, or append to existing error already displayed
        var errorHTML =
            '<div>' +
                '<h3 id="modal-overlay-title">' + errorTitle + '</h3>' +
                errorDescription +
                (err.message ? ("<code>Error: " + err.message + "</code>") : "") +
            '</div>';
        if($("#flashing-overlay-error").html() == "") {
            $("#flashing-overlay-error").html(errorHTML);
        } else {
            $("#flashing-overlay-error").append("<hr />" + errorHTML);
        }

        // Add the flash error buttons and attach handler
        $("#flashing-overlay-error-buttons").html(
            '<hr />' +
            '<a title="" href="#" id="flashing-overlay-download" class="action" onclick="actionClickListener(event)">' +
                config['translate']['webusb']['download'] +
            '</a> | ' +
            '<a title="" target="_blank" href="https://support.microbit.org/solution/articles/19000105428-webusb-troubleshooting/en" id="flashing-overlay-troubleshoot" class="action" onclick="actionClickListener(event)">' +
                config['translate']['webusb']['troubleshoot'] +
            '</a> | ' +
            '<a title="" href="#" onclick="flashErrorClose()">' + config["translate"]["webusb"]["close"] + '</a>'
        );
        $("#flashing-overlay-download").click(doDownload);

        // Make the modal accessible now that all the content is present
        focusModal("#flashing-overlay");
        // If escape key is pressed close modal
        $('#flashing-overlay').keydown(function(e) {
            if (e.which == 27) {
                flashErrorClose();
            }
        });

        // Sanitise error message, replace all special chars with '-', if last char is '-' remove it
        var errorMessage = (err.message ? (err.message.replace(/\W+/g, '-').replace(/\W$/, '').toLowerCase()) : "");
        // Send event
        document.dispatchEvent(new CustomEvent('webusb', { 'detail': {
            'flash-type': usePartialFlashing ? 'partial-flash' : 'full-flash',
            'event-type': 'error',
            'message': errorType + '/' + errorMessage
        }}));
    }

    function doDisconnect() {
        // Remove disconnect listener
        navigator.usb.removeEventListener('disconnect', showDisconnectError);

        // Hide serial and disconnect if open
        if ($('#repl').is(':visible')) closeSerial();

        // Change button to connect
        $("#command-disconnect").hide();
        $("#command-connecting").hide();
        $("#command-connect").show();

        // Change flash to download
        $("#command-flash").hide();
        $("#command-download").show();

        console.log('Disconnecting WebUSB');
        if (window.dapwrapper) {
            return window.dapwrapper.disconnectAsync()
                .catch(function(err) {
                    console.log('Error during disconnection:\r\n' + err);
                    console.trace();
                    document.dispatchEvent(new CustomEvent('webusb', { 'detail': {
                        'flash-type': 'webusb',
                        'event-type': 'error',
                        'message': 'error-disconnecting'
                    }}));
                })
                .finally(function() {
                    console.log('Disconnection Complete');
                    document.dispatchEvent(new CustomEvent('webusb', { 'detail': {
                        'flash-type': 'webusb',
                        'event-type': 'info',
                        'message': 'disconnected'
                    }}));
                });
        } else {
            return Promise.resolve();
        }
    }

    function doFlash() {
        var startTime = new Date().getTime();

        // Hide serial and disconnect if open
        if ($('#repl').is(':visible')) closeSerial();

        // Update main.py and check we don't run out of filesystem space
        try {
            updateMain();
            var freeFsSpace = FS.getStorageRemaining();
            if (freeFsSpace < 0) {
                throw Error(config.translate.alerts.module_out_of_space);
            }
        } catch(e) {
            return alert(config.translate.alerts.error + '\n' + e.message);
        }

        $("#webusb-flashing-progress").val(0).hide();
        $("#webusb-flashing-complete").hide();
        $("#webusb-flashing-loader").show();
        $('#flashing-overlay-error').html('');
        $('#flashing-overlay-error-buttons').html('');
        $("#flashing-info").removeClass('hidden');
        $("#flashing-overlay-container").css("display", "flex");
        $('#flashing-extra-msg').hide();

        var updateProgress = function(progress, longFlash) {
            if (!!longFlash) {
                $('#flashing-title').text(config.translate.webusb['flashing-title']);
                $('#flashing-extra-msg').show()
            } else {
                $('#flashing-title').text(config.translate.webusb['flashing-title-code']);
                $('#flashing-extra-msg').hide();
            }
            $('#webusb-flashing-progress').val(progress).css('display', 'inline-block');
        };

        var connectTimeout = setTimeout(function() {
            webusbErrorHandler({
                'name': 'timeout-error',
                'message': config['translate']['webusb']['err']['timeout-error']
            });
        }, 10 * 1000);

        return window.dapwrapper.disconnectAsync()
            .then(function() {
                return PartialFlashing.connectDapAsync();
            })
            .then(function() {
                // Clear connecting timeout
                clearTimeout(connectTimeout);

                // TODO: Update the Api compatibility to take in consideration second level imports
                //if (!microPythonApi.isApiUsedCompatible(window.dapwrapper.boardId, EDITOR.getCode())) {
                //    // TODO: Add to language strings
                //    throw new Error('One ore more of the modules used in this script are not available in this version of MicroPython.');
                //}

                // Collect data to flash, partial flashing can use just the flash bytes,
                // but full flashing needs the entire Intel Hex to include the UICR data
                var flashBytes = FS.getBytesForBoardId(window.dapwrapper.boardId);
                var hexBuffer = FS.getIntelHexForBoardId(window.dapwrapper.boardId);
                // Begin flashing
                $('#webusb-flashing-loader').hide();
                $('#webusb-flashing-progress').val(0).css('display', 'inline-block');
                return usePartialFlashing
                    ? PartialFlashing.flashAsync(window.dapwrapper, flashBytes, hexBuffer, updateProgress)
                    : PartialFlashing.fullFlashAsync(window.dapwrapper, hexBuffer, updateProgress);
            })
            .then(function() {
                // Show tick
                $('#webusb-flashing-progress').hide();
                $('#webusb-flashing-complete').show();

                // Send flash timing event
                var timeTaken = (new Date().getTime()) - startTime;
                document.dispatchEvent(new CustomEvent('webusb', { detail: {
                    'flash-type' : (usePartialFlashing ? 'partial-flash' : 'full-flash'),
                    'event-type': 'flash-time',
                    'message': timeTaken
                }}));
                console.log("Flash complete");

                // Close overview
                setTimeout(flashErrorClose, 500);
            })
            .catch(function(err) {
                clearTimeout(connectTimeout);
                return webusbErrorHandler(err);
            })
            .finally(function() {
                // Remove event listener
                window.removeEventListener('unhandledrejection', webusbErrorHandler);
            });
    }

    function closeSerial() {
        console.log("Closing Serial Terminal");
        $('#repl').empty();
        $('#repl').hide();
        $('#request-repl').hide();
        $('#request-serial').hide();
        $('#editor-container').show();

        var serialButton = config['translate']['static-strings']['buttons']['command-serial'];
        $('#command-serial').attr('title', serialButton['title']);
        $('#command-serial > .roundlabel').text(serialButton['label']);

        if (window.dapwrapper) {
            window.dapwrapper.daplink.stopSerialRead();
            window.dapwrapper.daplink.removeAllListeners(DAPjs.DAPLink.EVENT_SERIAL_DATA);
        }
        REPL.uninstallKeyboard();
        REPL.io.pop();
        REPL = null;
    }

    function doSerial() {
        // Hide terminal if it is currently shown
        if ($('#repl').is(':visible')) {
            closeSerial();
            return;
        }

        console.log('Setting Up Serial Terminal');
        return Promise.resolve()
            .then(function() {
                // Connect first if not done already
                if ($('#command-connect').is(':visible')) {
                    return doConnect();
                }
                return Promise.resolve();
            })
            .then(function() {
                return window.dapwrapper.disconnectAsync();
            })
            .then(function() {
                return window.dapwrapper.daplink.connect();
            })
            .then(function() {
                // Change Serial button to close
                var serialButton = config['translate']['static-strings']['buttons']['command-serial'];
                $('#command-serial').attr('title', serialButton['title-close']);
                $('#command-serial > .roundlabel').text(serialButton['label-close']);

                return window.dapwrapper.daplink.setSerialBaudrate(115200);
            })
            .then(function() {
                window.dapwrapper.daplink.startSerialRead(1);
                lib.init(setupHterm);
            })
            .catch(webusbErrorHandler);
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
                    window.dapwrapper.daplink.serialWrite(str);
                };
                io.sendString = function(str) {
                    window.dapwrapper.daplink.serialWrite(str);
                };
                io.onTerminalResize = function(columns, rows) {
                };
                REPL.focus();
            };
            REPL.decorate(document.querySelector('#repl'));
            REPL.installKeyboard();

            window.dapwrapper.daplink.on(DAPjs.DAPLink.EVENT_SERIAL_DATA, function(data) {
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

    // Event to register to be called on key presses to run the code checker
    function checkerOnEditorChange() {
        CHECKER.parseCode(EDITOR.getCode());
    }

    // Enables/Disables the code checker running in the background
    function enableCodeChecker(enable) {
        if (enable) {
            // TODO: try/catch this and show an error message to the user
            CHECKER.enable(EDITOR.setErrors);
            // Register an event on keystrokes, but rate limit dynamically
            EDITOR.on_change(checkerOnEditorChange);
        } else {
            CHECKER.disable(EDITOR.setErrors);
            EDITOR.on_change_remove(checkerOnEditorChange);
            EDITOR.setErrors([]);
        }
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
        $('#command-download').on('click', doDownload);
        $('#command-flash').on('click', doFlash);
        $("#command-files").click(function () {
            doFiles();
        });
        $("#command-blockly").click(function () {
            doBlockly();
        });
        $("#command-snippet").click(function () {
            doSnippets();
        });
        if (navigator.usb) {
            $("#command-connect").click(function () {
                doConnect().catch(webusbErrorHandler);
            });
            $("#command-disconnect").click(function () {
                doDisconnect();
            });
            $("#command-serial").click(function () {
                doSerial();
            });
            $("#request-repl").click(function () {
                window.dapwrapper.daplink.serialWrite('\x03').then(function() {
                    REPL.focus();
                });
            });
            $("#request-serial").click(function () {
                window.dapwrapper.daplink.serialWrite('\x03').then(function() {
                    return window.dapwrapper.daplink.serialWrite('\x04');
                }).then(function() {
                    REPL.focus();
                });
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
            $("#partial-flashing").hide();
            $("#menu-switch-partial-flashing-label").hide();
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
                .then(function() {
                     usePartialFlashing = setEnable;
                })
                .catch(function(err) {
                    console.log('Error disconnecting when using ' + (setEnable ? 'partial' : 'full') + ' flashing:\r\n' + err);
                })
        });
        $('#menu-switch-code-checker').on('change', function() {
            var setEnable = $(this).is(':checked');
            enableCodeChecker(setEnable);
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

    CONTROLLER.setup({
        'setCode': function(code) {
            EDITOR.setCode(code);
        },
        'getCode': function() {
            return EDITOR.getCode();
        },
        'onCodeChange': function(callback) {
            EDITOR.on_change(callback);
        },
        'loadHex': function(filename, hexStr) {
            loadHex(filename, hexStr);
        },
        'loadFileToFs': function(filename, fileStr) {
            loadPy(filename, fileStr);
        },
        'setMobileEditor': function(appFlash, appSave) {
            console.log('Configuring mobile mode.');
            // Show the Download and Flash buttons and remove Serial
            $('#command-connect').hide();
            $('#command-serial').hide();
            $('#command-download').show();
            $('#command-flash').show();
            // Sending a hex to one of the two argument callbacks
            var sendHex = function(sendFunction) {
                try {
                    updateMain();
                    var hexStr = FS.getUniversalHex();
                } catch(e) {
                    alert(config.translate.alerts.error + '\n' + e.message);
                    return;
                }
                var filename = getSafeName() + '.hex';
                sendFunction(filename, hexStr);
            };
            // Flash button to send the hex to the app
            $('#command-flash').off('click', doFlash).on('click', function() {
                sendHex(appFlash);
            });
            // Hex download buttons to send hex to the app
            var mobileHexDownload = function() {
                sendHex(appSave);
            };
            $('#command-download').off('click', doDownload).on('click', mobileHexDownload);
            $('#save-hex').off('click', doDownload).on('click', mobileHexDownload);
            doDownload = mobileHexDownload;
            // Downloading a Python file now sends it to the app
            downloadFileFromFilesystem = function(filename) {
                var output = FS.read(filename);
                if (filename === 'main.py') {
                    filename = getSafeName() + '.py';
                }
                appSave(filename, output);
            };
        },
    });

    // Extracts the query string and turns it into an object of key/value
    // pairs.
    function get_qs_context() {
        var query_string = window.location.search.substring(1);
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
    setupEditor(migration);
    setupButtons();
    setLanguage(qs.l || 'en');
    CONTROLLER.initialise(qs);
    FS.setupFilesystem().then(function() {
        // Add the editor code to main.py
        FS.create('main.py', EDITOR.getCode());
        console.log('FS fully initialised');
    }).fail(function() {
        console.error('There was an issue initialising the file system.');
    });
}

/*
 * Function to close flash error box
 */
function flashErrorClose() {
    $('#flashing-overlay-error').html('');
    $('#flashing-overlay-error-buttons').html('');
    $('#flashing-overlay-container').hide();
    $('#flashing-overlay').off("keydown");
}
