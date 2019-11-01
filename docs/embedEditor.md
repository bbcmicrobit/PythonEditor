# Embedding python editor in the site

### Using iframe

```
<iframe
  title="Embed python editor"
  src="http://url/pointing/to/editor?controller=1" />
```

To enable embed editor messaging between window and iframe query param "controller=1" should be provided

For receiving editor's messages you need to subscribe to window event "onMessage"

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

For sending messages to editor use

```
document.querySelector('iframe').contentWindow.postMessage(EditorMessageData,"*");
```

where EditorMessageData is

```
{
  type: "pyeditor"
  action: MessageAction # see supported actions
  project?: string # is python code
  projects?: string[] # is python code []
}
```

supported actions:

- workspacesync - Used to sync initial data between parent window and iframe window. Used to receive and send messages (see example bellow).
- workspacesave - received action when the code has changed in the editor
- workspaceloaded - received action when editor fully configured/sync
- importproject - use for sending new code to editor

> received - parent window gets message from editor

> send - parent window sends message to editor

### How synchronize parent window data with embed editor data. For ex. set initial code

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
