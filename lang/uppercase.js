var language = {
        'code_snippets': {
            'title': 'CODE SNIPPETS',
            'description': "CODE SNIPPETS ARE SHORT BLOCKS OF CODE TO RE-USE IN YOUR OWN PROGRAMS. THERE ARE SNIPPETS FOR MOST COMMON THINGS YOU'LL WANT TO DO USING MICROPYTHON.",
            'instructions': "SELECT ONE OF THE SNIPPETS BELOW, OR TYPE THE SNIPPET'S TRIGGER THEN TAP THE TAB KEY.",
            'trigger_heading': 'TRIGGER',
            'descrption_heading': 'DESCRIPTION',
            'docs': 'CREATE A COMMENT TO DESCRIBE YOUR CODE',
            'wh': 'WHILE SOME CONDITION IS TRUE, KEEP LOOPING OVER SOME CODE',
            'with': 'DO SOME STUFF WITH SOMETHING ASSIGNED TO A NAME',
            'cl': 'CREATE A NEW CLASS THAT DEFINES THE BEHAVIOUR OF A NEW TYPE OF OBJECT',
            'def': 'DEFINE A NAMED FUNCTION THAT TAKES SOME ARGUMENTS AND OPTIONALLY ADD A DESCRIPTION',
            'if': 'IF SOME CONDITION IS TRUE, DO SOMETHING',
            'ei': 'ELSE IF SOME OTHER CONDITION IS TRUE, DO SOMETHING',
            'el': 'ELSE DO SOME OTHER THING',
            'for': 'FOR EACH ITEM IN A COLLECTION OF ITEMS DO SOMETHING WITH EACH ITEM',
            'try': 'TRY DOING SOMETHING AND HANDLE EXCEPTIONS (ERRORS)'
        },
        'share': {
            'title': 'SHARE CODE',
            'instructions': 'USE A PASSWORD AND OPTIONAL HINT (TO HELP YOU REMEMBER THE PASSWORD) TO SECURELY CREATE A LINK TO SHARE YOUR CODE WITH OTHERS.',
            'passphrase': 'PASSWORD: ',
            'hint': 'PASSWORD HINT: ',
            'button': 'CREATE LINK',
            'description': 'THIS URL POINTS TO YOUR CODE:',
            'shortener': 'THIS IS A SHORT VERSION OF THE LINK:'
        },
        'decrypt': {
          'title': 'DECRYPT SOURCE CODE',
          'instructions': 'ENTER A PASSWORD TO DECRYPT THE SOURCE CODE.',
          'passphrase': 'PASSWORD: ',
          'button': 'DECRYPT'
        },
        'alerts': {
            'download': 'SAFARI HAS A BUG THAT MEANS YOUR WORK WILL BE DOWNLOADED AS AN UN-NAMED FILE. PLEASE RENAME IT TO SOMETHING ENDING IN .HEX. ALTERNATIVELY, USE A BROWSER SUCH AS FIREFOX OR CHROME. THEY DO NOT SUFFER FROM THIS BUG.',
            'save': 'SAFARI HAS A BUG THAT MEANS YOUR WORK WILL BE DOWNLOADED AS AN UN-NAMED FILE. PLEASE RENAME IT TO SOMETHING ENDING IN .PY. ALTERNATIVELY, USE A BROWSER SUCH AS FIREFOX OR CHROME. THEY DO NOT SUFFER FROM THIS BUG.',
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
        'help': {
          'docs-link':{
            'title':'VIEW THE DOCUMENTATION FOR MICROPYTHON',
            'label':'DOCUMENTATION'
          },
          'support-link':{
            'title':'GET SUPPORT FOR YOUR MICRO:BIT IN A NEW TAB',
            'label':'SUPPORT'
          },
          'help-link':{
            'title':'OPEN HELP FOR THIS EDITOR IN A NEW TAB',
            'label':'HELP'
          },
          'issues-link':{
            'title':'VIEW OPEN ISSUES FOR THE PYTHON EDITOR IN GITHUB',
            'label':'ISSUE TRACKER'
          },
          'editor-ver': 'EDITOR VERSION:',
          'mp-ver': 'MICROPYTHON VERSION:'
        },
        'confirms': {
          'quit': "SOME OF YOUR CHANGES HAVE NOT BEEN SAVED. QUIT ANYWAY?",
          'blocks': "YOU HAVE UNSAVED CODE. USING BLOCKS WILL CHANGE YOUR CODE. YOU MAY LOSE YOUR CHANGES. DO YOU WANT TO CONTINUE?",
          'replace_main': 'Adding a main.py file will replace the code in the editor!',
          'replace_file': 'Do you want to replace the "{{file_name}}" file?',
          'replace_module': 'Do you want to replace the "{{module_name}}" module?',
          'download_py_multiple': 'This project contains multiple files that will not be saved using this format.\nWe recommend downloading the Hex file, which contains your entire project and can be loaded back into the editor.\n\n Are you sure you want to download the {{file_name}} file only?'
      },
      'code': {
        'start': "# ADD YOUR PYTHON CODE HERE. E.g.\n" +
                 "from microbit import *\n\n\n" +
                 "while True:\n" +
                 "    display.scroll('Hello, World!')\n" +
                 "    display.show(Image.HEART)\n" +
                 "    sleep(2000)\n"
      },
      'webusb':{
        'err':{
          'flash':{
            'update-req': 'YOU NEED TO <a target="_blank" href="https://microbit.org/guide/firmware/">UPDATE YOUR MICRO:BIT FIRMWARE',
            'clear-connect': 'ANOTHER PROCESS IS CONNECTED TO THIS DEVICE.</div><div>CLOSE ANY OTHER TABS THAT MAY BE USING WEBUSB (E.G. MAKECODE, PYTHON EDITOR), OR UNPLUG AND REPLUG THE MICRO:BIT BEFORE TRYING AGAIN.',
            'restart-microbit': 'PLEASE RESTART YOUR MICRO:BIT AND TRY AGAIN'
          },
          'serial':{
          'update-req':'<a target="_blank" href="https://support.microbit.org/support/solutions/articles/19000019131-how-to-upgrade-the-firmware-on-the-micro-bit">UPDATE YOUR MICRO:BIT FIRMWARE</a> TO MAKE USE OF THIS FEATURE!',
          'clear-connect':'AANOTHER PROCESS IS CONNECTED TO THIS DEVICE.</div><div>CLOSE ANY OTHER TABS THAT MAY BE USING WEBUSB (E.G. MAKECODE, PYTHON EDITOR), OR UNPLUG AND REPLUG THE MICRO:BIT BEFORE TRYING AGAIN.',
          'restart-microbit':'PLEASE RESTART YOUR MICRO:BIT AND TRY AGAIN'
          },
        },
        'close': 'CLOSE',
        'request-repl': 'CLICK HERE OR PRESS CTRL-C TO ENTER THE REPL',
        'flashing-text': 'FLASHING MICRO:BIT'
      },
      'load': {
        'save-hex' : 'DOWNLOAD HEX',
        'show-files' : 'SHOW FILES',
        'load-title': 'LOAD',
        'instructions': 'DRAG AND DROP A .HEX OR .PY FILE IN HERE TO OPEN IT.',
        'submit': 'LOAD',
        'save-title': 'SAVE',
        'fs-title': 'FILES',
        'toggle-file': 'OR BROWSE FOR A FILE',
        'fs-add-file': 'ADD FILE',
        'show-files': 'SHOW FILES',
        'hide-files': 'HIDE FILES',
        'td-filename': 'FILENAME',
        'td-size': 'SIZE',
        'fs-space-free':'FREE',
        'remove-but' : 'REMOVE',
        'save-but': 'SAVE'
      },
      'static-strings':{
        'buttons':{
          'command-download':{
            'title': 'DOWNLOAD A HEX FILE TO FLASH ONTO YOUR MICRO:BIT',
            'label': 'DOWNLOAD'
          },
          'command-flash':{
            'title':'FLASH YOUR PROJECT DIRECTLY TO YOUR MICRO:BIT',
            'label':'FLASH'
          },
          'command-disconnect':{
            'title':'DISCONNECT FROM YOUR MICRO:BIT',
            'label':'DISCONNECT'
          },
          'command-files':{
            'title':'LOAD/SAVE FILES',
            'label':'LOAD/SAVE'
          },
          'command-serial':{
            'title':'CONNECT YOUR MICRO:BIT VIA SERIAL',
            'label':'OPEN SERIAL',
            'title-close': 'CLOSE THE SERIAL CONNECTION AND GO BACK TO THE EDITOR',
            'label-close': 'CLOSE SERIAL'
          },
          'command-connect':{
            'title':'CONNECT TO YOUR MICRO:BIT',
            'label':'CONNECT'
          },
          'command-options':{
            'title':'CHANGE THE EDITOR SETTINGS',
            'label':'BETA OPTIONS'
          },
          'command-blockly':{
            'title':'CLICK TO CREATE CODE WITH BLOCKLY',
            'label':'BLOCKLY'
          },
          'command-snippet':{
            'title':'CLICK TO SELECT A SNIPPET (CODE SHORTCUT)',
            'label':'SNIPPETS'
          },
          'command-help':{
            'title':'DISCOVER HELPFUL RESOURCES',
            'label':'HELP'
          },
          'command-language':{
            'title':'SELECT A LANGUAGE',
            'label':'LANGUAGE'
          },
          'command-share':{
            'title':'CREATE A LINK TO SHARE YOUR SCRIPT',
            'label':'SHARE'
          },
          'command-zoom-in':{
            'title':'ZOOM IN'
          },
          'command-zoom-out':{
            'title':'ZOOM OUT'
          }
        },
      'script-name':{
        'label': 'SCRIPT NAME'
        },
      'options-dropdown':{
        'autocomplete': 'AUTOCOMPLETE',
        'on-enter': 'ON ENTER',
        'lang-select':'SELECT LANGUAGE:'
        }
      }
};