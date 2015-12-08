/*
A simple editor that targets MicroPython for the BBC micro:bit for the
TouchDevelop platform from Microsoft.

Feel free to have a look around! (We've commented the code so you can see what
everything does.)

This code is based upon the example "blockly" editor found in the main
TouchDevelop repository.

All we've done is:

* Throw away all the code concerned with generating the TouchDevelop AST (we're
targeting MicroPython).
* Renamed various bits from blockly -> Python.
* Made use of the Ace JavaScript editor.
* Exposed code snippets in a pop-up.
* Switched on the merge functionality.

This editor uses the TouchDevelop platform for loading and saving work. It will
not respond to any other sort of messaging from TouchDevelop. It does not
transmit any data over the network and can work entirely offline (the .hex file
is generated in the local browser).
*/

/*
Hand crafted.

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

    return editor;
};

/*
Autogenerated and munged from TouchDevelop's blockly editor.

The following function defines various states associated with different aspects
of the editor. HINT: The names of the objects and functions should tell you
what they're for.
*/
var TDev;
(function (TDev) {
    var External;
    (function (External) {
        (function (MessageType) {
            MessageType[MessageType["Init"] = 0] = "Init";
            MessageType[MessageType["Metadata"] = 1] = "Metadata";
            MessageType[MessageType["MetadataAck"] = 2] = "MetadataAck";
            MessageType[MessageType["Save"] = 3] = "Save";
            MessageType[MessageType["SaveAck"] = 4] = "SaveAck";
            MessageType[MessageType["Compile"] = 5] = "Compile";
            MessageType[MessageType["CompileAck"] = 6] = "CompileAck";
            MessageType[MessageType["Merge"] = 7] = "Merge";
            MessageType[MessageType["Quit"] = 8] = "Quit";
            MessageType[MessageType["Upgrade"] = 9] = "Upgrade";
            MessageType[MessageType["Run"] = 10] = "Run";
            MessageType[MessageType["NewBaseVersion"] = 11] = "NewBaseVersion";
        })(External.MessageType || (External.MessageType = {}));
        var MessageType = External.MessageType;
        (function (Status) {
            Status[Status["Ok"] = 0] = "Ok";
            Status[Status["Error"] = 1] = "Error";
        })(External.Status || (External.Status = {}));
        var Status = External.Status;
        (function (SaveLocation) {
            SaveLocation[SaveLocation["Local"] = 0] = "Local";
            SaveLocation[SaveLocation["Cloud"] = 1] = "Cloud";
        })(External.SaveLocation || (External.SaveLocation = {}));
        var SaveLocation = External.SaveLocation;
        (function (Language) {
            Language[Language["TouchDevelop"] = 0] = "TouchDevelop";
            Language[Language["CPlusPlus"] = 1] = "CPlusPlus";
        })(External.Language || (External.Language = {}));
        var Language = External.Language;
    })(External = TDev.External || (TDev.External = {}));
})(TDev || (TDev = {}));

/*
Autogenerated and munged from TouchDevelop's blockly editor.

The following code contains the various functions that connect the behaviour of
the editor to the DOM (web-page).

See the comments in-line for more information.
*/
var TDev;
(function (TDev) {

    // Defines the domains in which the editor is allowed to be embedded.
    var allowedOrigins = [
        /^http:\/\/localhost/,
        /^https?:\/\/.*\.microbit\.co\.uk/,
        /^https?:\/\/microbit\.co\.uk/,
    ];

    // Given an origin domain, is the editor allowed to work within it?
    function isAllowedOrigin(origin) {
        return allowedOrigins.filter(function (x) { return !!origin.match(x); }).length > 0;
    }

    var outer = null;  // used to reference the TouchDevelop window within which this editor is embedded.
    var origin = null;  // the origin domain for the outer TouchDevelop.
    var currentVersion;  // the version of the code we're editing.
    var inMerge = false;  // a flag describing if the current code requires a merge to resolve a version conflict.

    // This function handles and checks messages received by the editor.
    window.addEventListener("message", function (event) {
        if (!isAllowedOrigin(event.origin)) {
            console.error("[inner message] not from the right origin!", event.origin);
            return;
        }
        if (!outer || !origin) {
            outer = event.source;
            origin = event.origin;
        }
        receive(event.data);
    });

    // This function takes a message, checks its type and responds.
    function receive(message) {
        console.log("[inner message]", message);
        switch (message.type) {
            case 0 /* Initialise the editor */:
                setupEditor(message);
                setupButtons();
                setupCurrentVersion(message);
                break;
            case 4 /* Save Acknowledgement */:
                saveAck(message);
                break;
            case 7 /* Merge */:
                promptMerge(message.merge);
                break;
            case 11 /* NewBaseVersion */:
                newBaseVersion(message);
                break;
        }
    }

    // Posts a message back to the origin (the outer TouchDevelop window).
    function post(message) {
        if (!outer)
            console.error("Invalid state");
        outer.postMessage(message, origin);
    }

    // Returns a prefix icon / description for log messages relating to storage.
    function prefix(where) {
        switch (where) {
            case 1 /* Cloud */:
                return ("☁  [cloud]");
            case 0 /* Local */:
                return ("⌂ [local]");
        }
    }

    // Given a type of icon, updates the user interface with the correct icon and descriptive message.
    function statusIcon(icon) {
        var i = $("#cloud-status i");
        i.attr("class", "fa fa-" + icon);
        switch (icon) {
            case "cloud-upload":
                i.attr("title", "Saved to cloud");
                break;
            case "floppy-o":
                i.attr("title", "Saved locally");
                break;
            case "exclamation-triangle":
                i.attr("title", "Error while saving -- see ⓘ for more information");
                break;
            case "pencil":
                i.attr("title", "Local changes");
                break;
            default:
                i.attr("title", "");
        }
    }

    // This function handles an incoming save acknowledgement message.
    function saveAck(message) {
        switch (message.status) {
            case 1 /* Error */:
                statusMsg(prefix(message.where) + " error: " + message.error, message.status);
                statusIcon("exclamation-triangle");
                break;
            case 0 /* Ok */:
                if (message.where == 1 /* Cloud */) {
                    statusMsg(prefix(message.where) + " successfully saved version (cloud in sync? " + message.cloudIsInSync + ", " + "from " + currentVersion + " to " + message.newBaseSnapshot + ")", message.status);
                    currentVersion = message.newBaseSnapshot;
                    if (message.cloudIsInSync)
                        statusIcon("cloud-upload");
                    else
                        statusIcon("exclamation-triangle");
                }
                else {
                    statusIcon("floppy-o");
                    statusMsg(prefix(message.where) + " successfully saved", message.status);
                }
                break;
        }
    }

    // Displays a status message.
    function statusMsg(s, st) {
        var box = $("#log");
        var elt = $("<div>").addClass("status").text(s);
        if (st == 1 /* Error */)
            elt.addClass("error");
        else
            elt.removeClass("error");
        box.append(elt);
        box.scrollTop(box.prop("scrollHeight"));
    }

    // Sets the description associated with the code displayed in the UI
    function setDescription(x) {
        $("#script-description").text(x);
    }

    // Sets the name associated with the code displayed in the UI
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

    var dirty = false;  // a flag describing if there are any unsaved changes in the editor.

    // Hides the logging popup
    function clearPopups() {
        $(".popup").addClass("hidden");
    }

    // Sets up the behaviour of popups (specifically, that associated with the logs).
    function setupPopups() {
        $(document).click(clearPopups);
        $(".popup").click(function (e) {
            e.stopPropagation();
        });
    }

    // Toggles the referenced popup if the passed in link is clicked.
    function setupPopup(link, popup) {
        link.click(function (e) {
            if (popup.hasClass("hidden"))
                showPopup(link, popup);
            else
                popup.addClass("hidden");
            e.stopPropagation();
        });
    }

    // Displays the referenced popup.
    function showPopup(link, popup) {
        clearPopups();
        popup.removeClass("hidden");
        var x = link[0].offsetLeft;
        var w = link[0].clientWidth;
        var y = link[0].offsetTop;
        var h = link[0].clientHeight;
        popup.css("left", Math.round(x - 500 + w / 2 + 5 + 15) + "px");
        popup.css("top", Math.round(y + h + 10 + 5) + "px");
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
        var state = message.script.editorState;
        if(message.script.scriptText.length > 0) {
            EDITOR.setCode(message.script.scriptText);
        } else {
            // A sane default starting point for a new script.
            EDITOR.setCode("# Add your Python code here. E.g.\n" +
                "from microbit import *\n\n\n" +
                "while True:\n" +
                "    display.scroll('Hello, World!')\n" +
                "    display.show(Image.HEART)\n" +
                "    sleep(2000)\n");
        }
        EDITOR.focus();
        EDITOR.ACE.gotoLine(EDITOR.ACE.session.getLength());
        window.setTimeout(function () {
            // Handles what to do if the user changes the content of the editor.
            EDITOR.ACE.on_change(function () {
                statusMsg("✎ local changes", 0 /* Ok */);
                statusIcon("pencil");
                dirty = true;
            });
        }, 1);
        // Handles what to do if the name is changed.
        $("#script-name").on("input keyup blur", function () {
            statusMsg("✎ local changes", 0 /* Ok */);
            statusIcon("pencil");
            dirty = true;
        });
        // Handles what to do if the description is changed.
        $("#script-description").on("input keyup blur", function () {
            statusMsg("✎ local changes", 0 /* Ok */);
            statusIcon("pencil");
            dirty = true;
        });
        setName(message.script.metadata.name);
        setDescription(message.script.metadata.comment);
        if (!message.script.metadata.comment)
            // If there's no description, default to something sensible.
            setDescription("A MicroPython script");
        // Describes what to do if the user attempts to close the editor without first saving their work.
        window.addEventListener("beforeunload", function (e) {
            if (dirty) {
                var confirmationMessage = "Some of your changes have not been saved. Quit anyway?";
                (e || window.event).returnValue = confirmationMessage;
                return confirmationMessage;
            }
        });
        // Automatically save what the user is doing anyway every 5 seconds.
        window.setInterval(function () {
            doSave();
        }, 5000);
        // When you click the link-log (the little "bug" icon) display a popup.
        setupPopup($("#link-log"), $("#popup-log"));
        setupPopups();
        // Configure the zoom related buttons.
        $("#zoom-in").click(function (e) {
            e.stopPropagation();
            zoomIn();
        });
        $("#zoom-out").click(function (e) {
            e.stopPropagation();
            zoomOut();
        });
        // Log the status of the editor.
        console.log("[loaded] cloud version " + message.script.baseSnapshot + "(dated from: " + state.lastSave + ")");
    }

    // Save the code back to TouchDevelop.
    function doSave(force) {
        if (force === void 0) { force = false; }
        if (!dirty && !force)
            return;
        var text = EDITOR.getCode();
        console.log("[saving] on top of: ", currentVersion);
        post({
            type: 3 /* Save */,
            script: {
                scriptText: text,
                editorState: {
                    lastSave: new Date()
                },
                baseSnapshot: currentVersion,
                metadata: {
                    name: getName(),
                    comment: getDescription()
                }
            },
        });
        dirty = false;
    }
    // This function describes what to do when the download button is clicked.
    function doDownload() {
        doSave();
        var firmware = $("#firmware").text();
        var output = EDITOR.getHexFile(firmware);
        var filename = getName().replace(" ", "_");
        var blob = new Blob([output], {type: "application/octet-stream"});
        saveAs(blob, filename + ".hex");
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

    // Join up the buttons in the user interface with some functions for handling what to do when they're clicked.
    function setupButtons() {
        $("#command-quit").click(function () {
            doSave();
            post({ type: 8 /* Quit */ });
        });
        $("#command-download").click(function () {
            doDownload();
        });
        $("#command-snippet").click(function () {
            doSnippets();
        });
    }
})(TDev || (TDev = {}));
