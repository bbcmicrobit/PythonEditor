var LANGUAGE = {
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
  'alerts': {
    'download': 'Safari has a bug that means your work will be downloaded as an un-named file. Please rename it to something ending in .hex. Alternatively, use a browser such as Firefox or Chrome. They do not suffer from this bug.',
    'save': 'Safari has a bug that means your work will be downloaded as an un-named file. Please rename it to something ending in .py. Alternatively, use a browser such as Firefox or Chrome. They do not suffer from this bug.',
    'load_code': 'Oops! Could not load the code into the hex file.',
    'unrecognised_hex': "Sorry, we couldn't recognise this file",
    'snippets': 'Snippets are disabled when blockly is enabled.',
    'error': 'Error:',
    'empty': 'The Python file does not have any content.',
    'no_python': 'Could not find valid Python code in the hex file.',
    'no_script': 'Hex file does not contain an appended Python script.',
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
    'start': "Add your Python code here. E.g."
  },
  'webusb': {
    'err': {
      'update-req': 'You need to <a target="_blank" href="https://microbit.org/firmware/">update your micro:bit firmware</a> to make use of this feature.',
      'update-req-title': 'Please update the micro:bit firmware',
      'clear-connect': 'Another process is connected to this device.<br>Close any other tabs that may be using WebUSB (e.g. MakeCode, Python Editor), or unplug and replug the micro:bit before trying again.',
      'reconnect-microbit': 'Please reconnect your micro:bit and try again.',
      'partial-flashing-disable': 'If the errors persist, try disabling Quick Flash in the beta options.',
      'device-disconnected': 'Device disconnected.',
      'device-bootloader': 'Please unplug the micro:bit and connect it again without pressing the reset button.<br>More info:',
      'device-bootloader-title': 'micro:bit in MAINTENANCE mode',
      'timeout-error': 'Unable to connect to the micro:bit',
      'timeout-error-title': 'Connection Timed Out',
      'unavailable': 'With WebUSB you can program your micro:bit and connect to the serial console directly from the online editor.<br/>Unfortunately, WebUSB is not supported in this browser. We recommend Chrome, or a Chrome-based browser to use WebUSB.',
      'find-more': 'Find Out More'
    },
    'troubleshoot': 'Troubleshoot',
    'close': 'Close',
    'request-repl': 'Send CTRL-C for REPL',
    'request-serial': 'Send CTRL-D to reset',
    'flashing-title': 'Flashing MicroPython',
    'flashing-title-code': 'Flashing code',
    'flashing-long-msg': 'Initial flash might take longer, subsequent flashes will be quicker.',
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
    'save-but': 'Save',
    'files-title' : 'Project Files',
    'help-button' : 'Files Help',
    'file-help-text' : 'The Project Files area shows you the files included in your program and lets you add or remove external python modules and other files. Find out more in the ',
    'help-link' : 'Python Editor help documentation',
    'invalid-file-title' : 'Invalid File Type',
    'mpy-warning' : 'This version of the Python Editor doesn\'t currently support adding .mpy files.',
    'extension-warning' : 'The Python Editor can only load files with the .hex or .py extensions.'
  },
  'languages': {
    'en': {
      'title': 'English'
    },
    'zh-CN': {
      'title': 'Chinese (simplified)'
    },
    'zh-HK': {
      'title': 'Chinese (traditional, Hong Kong)'
    },
    'zh-TW': {
      'title': 'Chinese (traditional, Taiwan)'
    },
    'hr': {
      'title': 'Croatian'
    },
    'pl': {
      'title': 'Polish'
    },
    'es': {
      'title': 'Spanish'
    },
    'fr': {
      'title': 'French'
    },
    'ko': {
      'title': 'Korean'
    },
    'nn': {
      'title': 'Norwegian Nynorsk'
    },
    'pt': {
      'title': 'Portuguese'
    },
    'sr': {
      'title': 'Serbian'
    }
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
      'command-connecting': {
        'title': 'Connecting to the micro:bit',
        'label': 'Connecting'
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
      'lang-select': 'Select Language:',
      'add-language-link':'Add a language'
    },
    'text-editor': {
      'aria-label': 'text editor'
    }
  }
};
