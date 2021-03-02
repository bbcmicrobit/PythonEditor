# Embedding python editor in the site

## From a mobile app webview

Load the editor with the URL parameter `?mobileApp=1`.

The app needs to subscribe to the following window 'onMessage' events:
- iOS: `window.webkit.messageHandlers.host`
- Android: `window.host`

## Using an iframe

```
<iframe
  title="Embed python editor"
  src="http://url/pointing/to/editor?controller=1" />
```

To enable embed editor messaging between window and iframe query param
"controller=1" should be provided.

For receiving editor's messages you need to subscribe to window event
"onMessage".

```
window.addEventListener("message", handleMessageReceive);
```

where 'handleMessageReceive' is (meesage received from editor)
```
function(event: MessageEvent) {
  const data: EditorMessageData = event.data
  # where data is EditorMessageData
  # EditorMessageData described bellow
  ...
}
```

For sending messages to editor use:

```
document.querySelector('iframe').contentWindow.postMessage(EditorMessageData,"*");
```

where EditorMessageData is the following (optional keys will depend on the
`action` type):

```
{
  type: "pyeditor"
  action: MessageAction # see supported actions
  project?: string      # value is python code
  projects?: string[]   # value python code []
  filename?: string     # value is file name
  filestring?: string   # value is file data
}
```


## Supported Actions

- workspacesync - Used to sync initial data between parent window and iframe
  window. Used to receive and send messages (see example bellow).
- workspaceloaded - Notifies controller 'workspacesync' was successful and the
  editor is fully configured/sync
- workspacesave - Sends the editor code to the controller, configured to do this
  periodically when the code changes
- importproject - Controller sends code to load into the editor
- loadhex - Controller sends a hex file to load into the editor
- loadfile - Controller sends a python file to load into the editor
- loadfile - Controller sends a python file to load into the editor
- savefile - Editor sends a python file to the controller
- flashhex - Editor sends a hex file to the controller
- mobilemode - Change the editor configuration for the mobile apps UX

More info can be found in the `CONTROLLER_MESSAGING` object in the
`js/editor-controller.js` source file.


## How synchronize parent window data with embed editor data. For ex. set initial code

```
# when action 'workspacesync' received
# we should send back data object with extra property 'projects' where we set initial code.

document.querySelector('iframe').contentWindow.postMessage({
  ...data, # where 'data' is received 'data' object from event
  projects: new Array("# initial code")
},"*");
```

When the synchronisation is done we should receive a message with action 'workspaceloaded'.

To update the code inside the editor send:

```
document.querySelector('iframe').contentWindow.postMessage({ 
  type: "pyeditor"
  action: "importproject"
  project: "# initial code"
},"*");
```
