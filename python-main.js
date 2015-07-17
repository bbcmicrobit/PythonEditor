var EDITOR = ace.edit("editor");
EDITOR.setTheme("theme/monokai");
EDITOR.getSession().setMode("ace/mode/python");

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
        ;
        (function (Status) {
            Status[Status["Ok"] = 0] = "Ok";
            Status[Status["Error"] = 1] = "Error";
        })(External.Status || (External.Status = {}));
        var Status = External.Status;
        ;
        (function (SaveLocation) {
            SaveLocation[SaveLocation["Local"] = 0] = "Local";
            SaveLocation[SaveLocation["Cloud"] = 1] = "Cloud";
        })(External.SaveLocation || (External.SaveLocation = {}));
        var SaveLocation = External.SaveLocation;
        ;
        (function (Language) {
            Language[Language["TouchDevelop"] = 0] = "TouchDevelop";
            Language[Language["CPlusPlus"] = 1] = "CPlusPlus";
        })(External.Language || (External.Language = {}));
        var Language = External.Language;
    })(External = TDev.External || (TDev.External = {}));
})(TDev || (TDev = {}));
var TDev;
(function (TDev) {
    var allowedOrigins = [
        /^http:\/\/localhost/,
        /^https?:\/\/.*\.microbit\.co\.uk/,
        /^https?:\/\/microbit\.co\.uk/,
    ];
    function isAllowedOrigin(origin) {
        return allowedOrigins.filter(function (x) { return !!origin.match(x); }).length > 0;
    }
    var outer = null;
    var origin = null;
    var currentVersion;
    var inMerge = false;
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
    function receive(message) {
        console.log("[inner message]", message);
        switch (message.type) {
            case 0 /* Init */:
                setupEditor(message);
                setupButtons();
                setupCurrentVersion(message);
                break;
            case 4 /* SaveAck */:
                saveAck(message);
                break;
            case 7 /* Merge */:
                promptMerge(message.merge);
                break;
            case 6 /* CompileAck */:
                compileAck(message);
                break;
            case 11 /* NewBaseVersion */:
                newBaseVersion(message);
                break;
        }
    }
    function post(message) {
        if (!outer)
            console.error("Invalid state");
        outer.postMessage(message, origin);
    }
    function prefix(where) {
        switch (where) {
            case 1 /* Cloud */:
                return ("☁  [cloud]");
            case 0 /* Local */:
                return ("⌂ [local]");
        }
    }
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
    function compileAck(message) {
        $("#command-compile > .roundsymbol").removeClass("compiling");
        switch (message.status) {
            case 1 /* Error */:
                statusMsg("compilation error: " + message.error, message.status);
                showPopup($("#link-log"), $("#popup-log"));
                break;
            case 0 /* Ok */:
                statusMsg("compilation successful", message.status);
                break;
        }
    }
    var mergeDisabled = true;
    function newBaseVersion(msg) {
        statusMsg("✎ got assigned our first base version", 0 /* Ok */);
        currentVersion = msg.baseSnapshot;
    }
    function setupCurrentVersion(message) {
        currentVersion = message.script.baseSnapshot;
        console.log("[revisions] current version is " + currentVersion);
        if (message.merge)
            promptMerge(message.merge);
    }
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
    function savePython() {
        return EDITOR.getValue();
    }
    function setDescription(x) {
        $("#script-description").text(x);
    }
    function setName(x) {
        $("#script-name").text(x);
    }
    function getDescription() {
        return $("#script-description").text();
    }
    function getName() {
        return $("#script-name").text();
    }
    var dirty = false;
    function clearPopups() {
        $(".popup").addClass("hidden");
    }
    function setupPopups() {
        $(document).click(clearPopups);
        $(".popup").click(function (e) {
            e.stopPropagation();
        });
    }
    function setupPopup(link, popup) {
        link.click(function (e) {
            if (popup.hasClass("hidden"))
                showPopup(link, popup);
            else
                popup.addClass("hidden");
            e.stopPropagation();
        });
    }
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
    function setupEditor(message) {
        var state = message.script.editorState;
        if(message.script.scriptText.length > 0) {
            EDITOR.setValue(message.script.scriptText);
        } else {
            EDITOR.setValue("import microbit\n\n");
        }
        EDITOR.focus();
        EDITOR.gotoLine(EDITOR.session.getLength());
        EDITOR.getSession().setTabSize(4);
        EDITOR.getSession().setUseSoftTabs(true);
        window.setTimeout(function () {
            EDITOR.getSession().on('change', function () {
                statusMsg("✎ local changes", 0 /* Ok */);
                statusIcon("pencil");
                dirty = true;
            });
        }, 1);
        $("#script-name").on("input keyup blur", function () {
            statusMsg("✎ local changes", 0 /* Ok */);
            statusIcon("pencil");
            dirty = true;
        });
        $("#script-description").on("input keyup blur", function () {
            statusMsg("✎ local changes", 0 /* Ok */);
            statusIcon("pencil");
            dirty = true;
        });
        setName(message.script.metadata.name);
        setDescription(message.script.metadata.comment);
        if (!message.script.baseSnapshot && !message.script.metadata.comment)
            setDescription("A MicroPython script");
        window.addEventListener("beforeunload", function (e) {
            if (dirty) {
                var confirmationMessage = "Some of your changes have not been saved. Quit anyway?";
                (e || window.event).returnValue = confirmationMessage;
                return confirmationMessage;
            }
        });
        window.setInterval(function () {
            doSave();
        }, 5000);
        setupPopup($("#link-log"), $("#popup-log"));
        setupPopups();
        console.log("[loaded] cloud version " + message.script.baseSnapshot + "(dated from: " + state.lastSave + ")");
    }
    function doSave(force) {
        if (force === void 0) { force = false; }
        if (!dirty && !force)
            return;
        var text = savePython();
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
    function doDownload() {
        doSave();
        var text = savePython();
        var filename = getName().replace(" ", "_");
        var blob = new Blob([text], {type: "text/plain;charset=utf-8"});
        saveAs(blob, filename + ".py");
    }
    function doSnippets() {
        alert("Snippets");
    }
    function doHelp() {
        alert("Help");
    }
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
        $("#command-help").click(function () {
            doHelp();
        });
    }
})(TDev || (TDev = {}));

