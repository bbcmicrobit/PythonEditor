# Import Projects into the Python Editor

Python projects from external sources can be imported into the editor using a special URL e.g.
``https://python.microbit.org/v/1.1#project:{{ encoded project }}``

To encode a project, it must be structured as follows:

```json
{
    meta: {
        cloudId: "microbit.co.uk",       # optional
        comment: "A MicroPython script", # required - may be blank
        editor: "python",                # required - editor name
        lastUse: 1538407830,             # optional - UNIX time the script was last used
        name: "unearthly script 2"      # required - may be blank
        },
    source: "# Add your Python code here. E.g.\r\n from microbit import *\r\n while True:\r\n    display.scroll('Hello, World!')\r\nsleep(2000)"
}
```

This JSON structure is compressed using
[LZMA](https://github.com/LZMA-JS/LZMA-JS), and then encoded as Base64 to
include in the import URL.
