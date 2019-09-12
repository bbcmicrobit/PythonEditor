var language = {
  'code_snippets': {
    'title': 'Code Snippets',
    'description': "Code snippets are short blocks of code to re-use in your own programs. There are snippets for most common things you'll want to do using MicroPython.",
    'instructions': "Select one of the snippets below to inject the code block.",
    'trigger_heading': 'trigger',
    'description_heading': 'description',
    'docs': 'create a comment to describe your code',
    'wh': 'while some condition is True, keep looping over some code',
    'with': 'do some stuff with something assigned to a name',
    'cl': 'create a new class that defines the behaviour of a new type of object',
    'def': 'define a named function that takes some arguments and optionally add a description',
    'if': 'if some condition is True, do something',
    'ei': 'else if some other condition is True, do something',
    'el': 'else do some other thing',
    'for': 'for each item in a collection of items do something with each item',
    'try': 'try doing something and handle exceptions (errors)'
  },
  'share': {
    'title': 'Share Code',
    'instructions': 'Use a password and optional hint (to help you remember the password) to securely create a link to share your code with others.',
    'passphrase': 'Password: ',
    'hint': 'Password hint: ',
    'button': 'Create Link',
    'description': 'This URL points to your code:',
    'shortener': 'This is a short version of the link:'
  },
  'decrypt': {
    'title': 'Decrypt Source Code',
    'instructions': 'Enter a password to decrypt the source code.',
    'passphrase': 'Password: ',
    'button': 'Decrypt'
  },
  'alerts': {
    'download': 'Safari has a bug that means your work will be downloaded as an un-named file. Please rename it to something ending in .hex. Alternatively, use a browser such as Firefox or Chrome. They do not suffer from this bug.',
    'save': 'Safari has a bug that means your work will be downloaded as an un-named file. Please rename it to something ending in .py. Alternatively, use a browser such as Firefox or Chrome. They do not suffer from this bug.',
    'load_code': 'Oops! Could not load the code into the hex file.',
    'unrecognised_hex': "Sorry, we couldn't recognise this file",
    'snippets': 'Snippets are disabled when blockly is enabled.',
    'error': 'Error:\n',
    'empty': 'The Python file does not have any content.',
    'no_python': 'Could not find valid Python code in the hex file.',
    'no_script': 'Hex file does not contain a Python script.',
    'no_main': 'The hex file does not contain a main.py file.',
    'cant_add_file': 'Could not add file to the filesystem:',
    'module_added': 'The "{{module_name}}" module has been added to the filesystem.',
    'module_out_of_space': 'Could not add file to the system as there is no storage space left.'
  },
  'help': {
    'docs-link': {
      'title':'View the documentation for MicroPython',
      'label':'Documentation'
    },
    'support-link': {
      'title':'Get support for your micro:bit in a new tab',
      'label':'Support'
    },
    'help-link': {
      'title':'Open the help for this editor in a new tab',
      'label':'Help'
    },
    'issues-link': {
      'title':'View open issues for the Python Editor in GitHub',
      'label':'Issue Tracker'
    },
    'feedback-link': {
      'title':'Send us your feedback about the Python Editor',
      'label':'Send Feedback'
    },
    'editor-ver': 'Editor Version:',
    'mp-ver': 'MicroPython Version:'
  },
  'confirms': {
    'quit': "Some of your changes have not been saved. Quit anyway?",
    'blocks': "You have unsaved code. Using blocks will change your code. You may lose your changes. Do you want to continue?",
    'replace_main': 'Adding a main.py file will replace the code in the editor!',
    'replace_file': 'Do you want to replace the "{{file_name}}" file?',
    'replace_module': 'Do you want to replace the "{{module_name}}" module?',
    'download_py_multiple': 'This project contains multiple files that will not be saved using this format.\nWe recommend downloading the Hex file, which contains your entire project and can be loaded back into the editor.\n\n Are you sure you want to download the {{file_name}} file only?'
  },
  'code': {
    'start': "# Add your Python code here. E.g.\n" +
            "from microbit import *\n\n\n" +
            "while True:\n" +
            "    display.scroll('Hello, World!')\n" +
            "    display.show(Image.HEART)\n" +
            "    sleep(2000)\n"
  },
  'webusb': {
    'err': {
      'update-req': 'You need to <a target="_blank" href="https://support.microbit.org/support/solutions/articles/19000019131-how-to-upgrade-the-firmware-on-the-micro-bit">update your micro:bit firmware</a> to make use of this feature.',
      'clear-connect': 'Another process is connected to this device.<br>Close any other tabs that may be using WebUSB (e.g. MakeCode, Python Editor), or unplug and replug the micro:bit before trying again.',
      'reconnect-microbit': 'Please reconnect your micro:bit and try again.',
      'partial-flashing-disable': 'If the errors persist, try disabling Quick Flash in the beta options.',
      'device-disconnected': 'Device disconnected.',
      'unavailable': 'With WebUSB you can program your micro:bit and connect to the serial console directly from the online editor.<br/>Unfortunately, WebUSB is not supported in this browser. We recommend Chrome, or a Chrome-based browser to use WebUSB.',
      'find-more': 'Find Out More'
    },
    'close': 'Close',
    'request-repl': 'Send CTRL-C for REPL',
    'request-serial': 'Send CTRL-D to reset',
    'flashing-text': 'Flashing micro:bit',
    'download': 'Download Hex'
  },
  'load': {
    'show-files' : 'Show Files',
    'load-title': 'Load',
    'instructions': 'Drag and drop a .hex or .py file in here to open it.',
    'submit': 'Load',
    'save-title': 'Save',
    'save-hex' : 'Download Project Hex',
    'save-py' : 'Download Python Script',
    'fs-title': 'Files',
    'toggle-file': 'Or browse for a file.',
    'fs-add-file': 'Add file',
    'hide-files': 'Hide Files',
    'td-filename': 'Filename',
    'td-size': 'Size',
    'fs-space-free':'free',
    'remove-but' : 'Remove',
    'save-but': 'Save'
  },
  'static-strings': {
    'buttons': {
      'command-download': {
        'title': 'Download a hex file to flash onto the micro:bit',
        'label': 'Download'
      },
      'command-disconnect': {
        'title': 'Disconnect from the micro:bit',
        'label': 'Disconnect'
      },
      'command-flash': {
        'title': 'Flash the project directly to the micro:bit',
        'label': 'Flash'
      },
      'command-files': {
        'title': 'Load/Save files',
        'label': 'Load/Save'
      },
      'command-serial': {
        'title': 'Connect the micro:bit via serial',
        'label': 'Open Serial',
        'title-close': 'Close the serial connection and go back to the editor',
        'label-close': 'Close Serial'
      },
      'command-connect': {
        'title': 'Connect to the micro:bit',
        'label': 'Connect'
      },
      'command-options': {
        'title': 'Change the editor settings',
        'label': 'Beta Options'
      },
      'command-blockly': {
        'title': 'Click to create code with blockly',
        'label': 'Blockly'
      },
      'command-snippet': {
        'title': 'Click to select a snippet (code shortcut)',
        'label': 'Snippets'
      },
      'command-help': {
        'title': 'Discover helpful resources',
        'label': 'Help'
      },
      'command-language': {
        'title': 'Select a language',
        'label': 'Language'
      },
      'command-share': {
        'title': 'Create a link to share your script',
        'label': 'Share'
      },
      'command-zoom-in': {
        'title': 'Zoom in'
      },
      'command-zoom-out': {
        'title': 'Zoom out'
      }
    },
    'script-name': {
      'label': 'Script Name'
    },
    'options-dropdown': {
      'autocomplete': 'Autocomplete',
      'on-enter': 'On Enter',
      'partial-flashing': 'Quick Flash',
      'lang-select': 'Select Language:'
    },
    'text-editor': {
      'aria-label': 'text editor'
    }
  }
};
