    var language = {
          'code_snippets': {
            'title': 'Code Snippets',
            'description': "Code snippets are short blocks of code to re-use in your own programs. There are snippets for most common things you'll want to do using MicroPython.",
            'instructions': "Select one of the snippets below, or type the snippet's trigger then tap the TAB key.",
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
            'cant_add_file': 'Could not add file to the system:',
            'module_added': 'The "{{module_name}}" module has been added to the filesystem.',
            'module_out_of_space': 'Could not add file to the system as there is no storage space left.'
          },
          'confirms': {
            'quit': "Some of your changes have not been saved. Quit anyway?",
            'blocks': "You have unsaved code. Using blocks will change your code. You may lose your changes. Do you want to continue?",
            'replace_main': 'Adding a main.py file will replace the code in the editor!',
            'replace_file': 'Do you want to replace the "{{file_name}}" file?',
            'replace_module': 'Do you want to replace the "{{module_name}}" module?'
          },
          'code': {
            'start': "# Add your Python code here. E.g.\n" +
                    "from microbit import *\n\n\n" +
                    "while True:\n" +
                    "    display.scroll('Hello, World!')\n" +
                    "    display.show(Image.HEART)\n" +
                    "    sleep(2000)\n"
          },
          'load': {
            'save-hex' : 'Download Hex',
            'show-files' : 'Show Files',
            'load-title': 'Load/Save',
            'instructions': 'Drag and drop a .hex or .py file in here to open it.',
            'submit': 'Load',
            'toggle-file': 'Or browse for a file',
            'fs-add-file': 'Add file',
            'show-files': 'Show Files',
            'hide-files': 'Hide Files',
            'td-filename': 'Filename',
            'td-size': 'Size',
            'fs-space-free':'free',
            'remove-but' : 'Remove',
            'save-but': 'Save'
          },
          'static-strings':{
            'buttons':{
              'command-download':{
                'title': 'Download a hex file to flash onto your micro:bit',
                'label': 'Download'
              },
              'command-files':{
                'title':'Load/Save files',
                'label':'Load/Save'
              },
              'command-serial':{
                'title':'Connect your micro:bit via serial',
                'label':'Open Serial'
              },
              'command-connect':{
                'title':'Connect to your micro:bit',
                'label':'Connect'
              },
              'command-options':{
                'title':'Change the editor settings',
                'label':'Options'
              },
              'command-blockly':{
                'title':'Click to create code with blockly',
                'label':'Blockly'
              },
              'command-snippet':{
                'title':'Click to select a snippet (code shortcut)',
                'label':'Snippets'
              },
              'command-help':{
                'title':'Discover helpful resources',
                'label':'Help'
              },
              'command-language':{
                'title':'Select a language',
                'label':'Language'
              },
              'command-share':{
                'title':'Create a link to share your script',
                'label':'Share'
              },
              'zoom-in':{
                'title':'Zoom in'
              },
              'zoom-out':{
                'title':'Zoom out'
              }
            },
          'script-name':{
            'label': 'Script Name'
            },
          'options-dropdown':{
            'autocomplete': 'Autocomplete',
            'on-enter': 'On Enter:'
          }
          }
    };