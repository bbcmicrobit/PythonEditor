/**
 * The Editor can be controlled by remote hosts that wrap the editor with
 * an iframe or in some kind of webview.
 */
'use strict';

/**
 * @returns An object with the fs wrapper.
 */
var EditorController = function() {
    var _returnObj = {};

    var _editorActions = null;
    var _controllerHost = null;

    /** Constants used for iframe messaging */
    var CONTROLLER_MESSAGING = Object.freeze({
        // Embed editor host type
        type: 'pyeditor',
        // Embed editor messaging actions
        actions: {
            workspacesync: 'workspacesync',
            workspacesave: 'workspacesave',
            workspaceloaded: 'workspaceloaded',
            importproject: 'importproject',
            loadhex: 'loadhex',
            loadfile: 'loadfile',
            downloadmode: 'downloadmode',
            savefile: 'save',
            flashhex: 'download',
        }
    });

    /**
     * JS debounce for a given amount of time. If the same function is called
     * before the timeout the timer resets.
     *
     * @param {function} callback - Function to debounce. 
     * @param {number} wait - Time to wait without calling this debounce to
     *      finally execute the callback.
     */
    function debounce(callback, wait) {
        var timeout = null;
        return function() {
            var args = arguments;
            var next = function() {
                return callback.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(next, wait);
        }
    }

    /**
     * Sending a postMessage to the host controller.
     */
    function hostPostMessage() {
        if (_controllerHost) {
            _controllerHost.postMessage.apply(null, arguments);
        } else {
            console.error('Trying to postMessage to undefined host controller:');
            console.error(arguments);
        }
    }

    /**
     * Send data to the host controller to save a file into the device.
     *
     * @param {string} filename - File name for the file to save to the device.
     * @param {string} fileStr - File content to save to the device.
     */
    function hostSaveFile(filename, fileStr) {
        hostPostMessage({
            type: CONTROLLER_MESSAGING.type,
            action: CONTROLLER_MESSAGING.actions.savefile,
            name: filename,
            data: fileStr,
        }, '*');
    }

    /**
     * Send a hex to the host controller to flash the device.
     *
     * @param {string} filename - File name for the hex to flash into the device.
     * @param {string} hexStr  - Hex string to flash to the device.
     */
    function hostFlashHex(filename, hexStr) {
        hostPostMessage({
            type: CONTROLLER_MESSAGING.type,
            action: CONTROLLER_MESSAGING.actions.flashhex,
            name: filename,
            data: hexStr,
        }, '*');
    }

    /**
     * Set up the Editor Controller actions required by the protocol messages.
     * 
     * @param {object} editorActions - Functions needed to control the editor:
     *      - setCode() - Replace the code in the editor.
     *      - getCode() - Retrieve the code from the editor.
     *      - onCodeChange() - Callback to run on every call change.
     *      - loadHex() - Sending a hex into the editor to load it.
     *      - loadFileToFs() - Sending a file to the editor to add it to the
     *                         filesystem.
     *      - setMobileEditor() - Function to run to set up the editor in a
     *                            a special mode for the mobile apps.
     */
    _returnObj.setup = function(editorActions) {
        _editorActions = editorActions;

        window.addEventListener('message', function(event) {
            if (!event.data) return;

            if (event.data.type === CONTROLLER_MESSAGING.type) {
                switch (event.data.action) {
                    // Parent is sending code to update editor
                    case CONTROLLER_MESSAGING.actions.importproject:
                        if (!event.data.project || typeof event.data.project !== 'string') {
                            throw new Error("Invalid 'project' data type. String should be provided.");
                        }
                        _editorActions.setCode(event.data.project);
                        break;

                    // Parent is sending initial code for editor
                    // Also here we can sync parent data with editor's data
                    case CONTROLLER_MESSAGING.actions.workspacesync:
                        if (!event.data.projects || !Array.isArray(event.data.projects)) {
                            throw new Error("Invalid 'projects' data type. Array should be provided.");
                        }
                        if (event.data.projects.length < 1) {
                            throw new Error("'projects' array should contain at least one item.");
                        }
                        _editorActions.setCode(event.data.projects[0]);
                        // Notify parent about editor successfully configured
                        window.parent.postMessage({
                            type: CONTROLLER_MESSAGING.type,
                            action: CONTROLLER_MESSAGING.actions.workspaceloaded
                        }, '*');
                        break;

                    // Parent is sending HEX file
                    case CONTROLLER_MESSAGING.actions.loadhex:
                        _editorActions.loadHex(event.data.filename, event.data.hexstring);
                        break;

                    // Parent is sending file for filesystem
                    case CONTROLLER_MESSAGING.actions.loadfile:
                        _editorActions.loadFileToFs(event.data.filename, event.data.filestring);
                        break;

                    // Parent is requesting postMessage downloads
                    case CONTROLLER_MESSAGING.actions.downloadmode:
                        _editorActions.setMobileEditor(hostFlashHex, hostSaveFile);
                        break;

                    default:
                        throw new Error('Unsupported action.')
                }
            }
        }, false);
    };

    /**
     * Initialises the controller based on the URL query string parameters and
     * the `window` environment.
     * The Classroom controller will be an iframe parent, and the mobile apps
     * will have postMessage handlers on different namespaces within `window`.
     *
     * @param {object} qs - The editor URL query string parameters.
     */
    _returnObj.initialise = function(qs) {
        var inIframe = window !== window.parent;
        var iframeControllerMode = inIframe && qs.controller == '1';
        var appControllerMode = qs.mobileApp == '1';

        if (iframeControllerMode || appControllerMode) {
            // Detect the host controller to send our messages
            if (iframeControllerMode && window.parent && window.parent.postMessage) {
                // Classroom wraps the editor in an iframe
                _controllerHost = window.parent;
            } else if (appControllerMode &&
                    window.webkit &&
                    window.webkit.messageHandlers &&
                    window.webkit.messageHandlers.host &&
                    window.webkit.messageHandlers.host.postMessage) {
                // iOS app, 'host' used to match the MakeCode messageHandler name
                _controllerHost = window.webkit.messageHandlers.host;
            } else if (appControllerMode && window.host && window.host.postMessage) {
                // Android app
                _controllerHost = window.host
            } else {
                console.error('Cannot detect valid host controller.');
                return;
            }

            window.addEventListener('load', function() {
                hostPostMessage({
                    type: CONTROLLER_MESSAGING.type,
                    action: CONTROLLER_MESSAGING.actions.workspacesync
                }, '*');
            });
        }

        if (iframeControllerMode) {
            // For classroom we clear the code in the editor
            _editorActions.setCode(' ');
            // Send code to the controller in real time (with a 1s debounce)
            var debounceCodeChange = debounce(function(code) {
                hostPostMessage({
                    type: CONTROLLER_MESSAGING.type,
                    action: CONTROLLER_MESSAGING.actions.workspacesave,
                    project: code
                }, '*');
            }, 1000);
            _editorActions.onCodeChange(function() {
                debounceCodeChange(_editorActions.getCode());
            });
        }

        if (appControllerMode) {
            // If the editor is loaded on the mobile apps it will change
            // the buttons and how it deals with files
            _editorActions.setMobileEditor(hostFlashHex, hostSaveFile);
        }
    };

    return _returnObj;
}

if (typeof module !== 'undefined' && module.exports) {
    global.EditorController = EditorController;
} else {
    window.EditorController = EditorController;
}
