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
    var _msgEventListener = null;
    var _controllerHost = null;

    /** Constants used for iframe messaging */
    var CONTROLLER_MESSAGING = Object.freeze({
        // Embed editor host type
        type: 'pyeditor',
        // Embed editor messaging actions
        actions: {
            // Editor sends it to sync with controller and possibly receive a
            // project to load
            // direction: Bidirectional
            // dataOut: Nothing
            // dataIn: projects - An array with python code, editor loads [0]
            workspacesync: 'workspacesync',
            // Notifies controller 'workspacesync' was successful
            // direction: Output
            // dataOut: Nothing
            workspaceloaded: 'workspaceloaded',
            // Sends the editor code to the controller, configured to do this
            // periodically when the code changes
            // direction: Output
            // dataOut: project - A string with the editor code
            workspacesave: 'workspacesave',
            // Controller sends code to load into the editor
            // direction: Input
            // dataIn: project - A string with python code
            importproject: 'importproject',
            // Controller sends a hex file to load into the editor
            // direction: Input
            // dataIn: filename - String with the hex file name
            //         filestring - String with the hex contents
            loadhex: 'loadhex',
            // Controller sends a python file to load into the editor
            // direction: Input
            // dataIn: filename - String with the python file name
            //         filestring - String with the python code from the file
            loadfile: 'loadfile',
            // Editor sends a python file to the controller
            // direction: Output
            // dataOut: filename - String with the python file name
            //          filestring - String with the python code from the file
            savefile: 'savefile',
            // Editor sends a hex file to the controller
            // direction: Output
            // dataOut: filename - String with the hex file name
            //          filestring - String with the python code from the file
            flashhex: 'flashhex',
            // Change the editor configuration for the mobile apps UX
            // The serial and connect buttons are removed, flash button added,
            // and the download and flash buttons send data to the controller
            // direction: Input
            // dataIn: Nothing
            mobilemode: 'mobilemode',
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
    function hostPostMessage(message, targetOrigin) {
        if (_controllerHost) {
            _controllerHost.postMessage(message, targetOrigin);
        } else {
            console.error('Trying to postMessage to undefined host controller:');
            console.error(message, targetOrigin);
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
            filename: filename,
            filestring: fileStr,
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
            filename: filename,
            filestring: hexStr,
        }, '*');
    }

    /**
     * Set up the Editor Controller actions required by the protocol messages.
     * This does not set up the 
     * 
     * @param {object} editorActions - Functions needed to control the editor:
     *      - setCode(code) - Replace the code in the editor.
     *                        code - String with the code to add to the editor.
     *      - getCode() - Retrieve the code from the editor.
     *      - onCodeChange(callback) - Callback to run on every call change.
     *                                 callback - Callback function.
     *      - loadHex(filename, hexStr)
     *              Sending a hex into the editor to load it.
     *              filename - String with the file name
     *              hexStr - String with the hex data
     *      - loadFileToFs(filename, fileStr)
     *              Sending a file to the editor to add it to the filesystem.
     *              filename - String with the file name
     *              fileStr - String with the python file text
     *      - setMobileEditor(appFlash, appSave)
     *              Set up the editor in a special UX mode for the mobile apps.
     *              appFlash(filename, hexStr) - callback to send hex for flashing
     *              appSave - 
     */
    _returnObj.setup = function(editorActions) {
        _editorActions = editorActions;
        _msgEventListener = function(event) {
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
                        if (!event.data.filename || typeof event.data.filename !== 'string') {
                            throw new Error("Invalid 'filename' data type. String should be provided.");
                        }
                        if (!event.data.filestring || typeof event.data.filestring !== 'string') {
                            throw new Error("Invalid 'filename' data type. String should be provided.");
                        }
                        _editorActions.loadHex(event.data.filename, event.data.filestring);
                        break;

                    // Parent is sending file for filesystem
                    case CONTROLLER_MESSAGING.actions.loadfile:
                        if (!event.data.filename || typeof event.data.filename !== 'string') {
                            throw new Error("Invalid 'filename' data type. String should be provided.");
                        }
                        if (!event.data.filestring || typeof event.data.filestring !== 'string') {
                            throw new Error("Invalid 'filestring' data type. String should be provided.");
                        }
                        _editorActions.loadFileToFs(event.data.filename, event.data.filestring);
                        break;

                    // Parent is requesting postMessage downloads
                    case CONTROLLER_MESSAGING.actions.mobilemode:
                        _editorActions.setMobileEditor(hostFlashHex, hostSaveFile);
                        break;

                    default:
                        throw new Error('Unsupported action.')
                }
            }
        };
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

            console.log('Activating editor controller mode.');
            if (_msgEventListener) {
                window.addEventListener('message', _msgEventListener, false);
            } else {
                throw new Error("The editor controller setup() has not been configured.");
            }
            window.addEventListener('load', function() {
                hostPostMessage({
                    type: CONTROLLER_MESSAGING.type,
                    action: CONTROLLER_MESSAGING.actions.workspacesync
                }, '*');
            });
        }

        if (iframeControllerMode) {
            console.log('Configuring iframe controller.');
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
    };

    return _returnObj;
}

if (typeof module !== 'undefined' && module.exports) {
    global.EditorController = EditorController;
} else {
    window.EditorController = EditorController;
}
