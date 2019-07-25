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
        'confirms': {
          'quit': "SOME OF YOUR CHANGES HAVE NOT BEEN SAVED. QUIT ANYWAY?",
          'blocks': "YOU HAVE UNSAVED CODE. USING BLOCKS WILL CHANGE YOUR CODE. YOU MAY LOSE YOUR CHANGES. DO YOU WANT TO CONTINUE?",
          'replace_main': 'Adding a main.py file will replace the code in the editor!',
          'replace_file': 'Do you want to replace the "{{file_name}}" file?',
          'replace_module': 'Do you want to replace the "{{module_name}}" module?'
      },
      'code': {
        'start': "# ADD YOUR PYTHON CODE HERE. E.g.\n" +
                 "from microbit import *\n\n\n" +
                 "while True:\n" +
                 "    display.scroll('Hello, World!')\n" +
                 "    display.show(Image.HEART)\n" +
                 "    sleep(2000)\n"
      },
      'load': {
        'save-hex' : 'DOWNLOAD HEX',
        'show-files' : 'SHOW FILES',
        'load-title': 'LOAD/SAVE',
        'instructions': 'DRAG AND DROP A .HEX OR .PY FILE IN HERE TO OPEN IT.',
        'submit': 'LOAD',
        'toggle-file': 'OR BROWSE FOR A FILE',
        'fs-add-file': 'ADD FILE'
      },
      'static-strings':{
        'buttons':{
          'command-download':{
            'title': 'DOWNLOAD A HEX FILE TO FLASH ONTO YOUR MICRO:BIT',
            'label': 'DOWNLOAD'
          },
          'command-files':{
            'title':'LOAD/SAVE FILES',
            'label':'LOAD/SAVE'
          },
          'command-serial':{
            'title':'CONNECT YOUR MICRO:BIT VIA SERIAL',
            'label':'OPEN SERIAL'
          },
          'command-connect':{
            'title':'CONNECT TO YOUR MICRO:BIT',
            'label':'CONNECT'
          },
          'command-options':{
            'title':'CHANGE THE EDITOR SETTINGS',
            'label':'OPTIONS'
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
          'zoom-in':{
            'title':'ZOOM IN'
          },
          'zoom-out':{
            'title':'ZOOM OUT'
          }
        },
      'script-name':{
        'label': 'SCRIPT NAME'
        }
      }
};