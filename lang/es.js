var language = {
  'code_snippets': {
    'title': 'Fragmentos de Codigo',
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
  'help': {
    'docs-link': {
      'title':'Ver la documentación de MicroPython',
      'label':'Documentación'
    },
    'support-link': {
      'title':'Obtenga apoyo para su micro:bit en una nueva pestaña',
      'label':'Soporte'
    },
    'help-link': {
      'title':'Abra la ayuda para este editor en una pestaña nueva',
      'label':'Ayuda'
    },
    'issues-link': {
      'title':'Ver problemas abiertos para el editor de Python en GitHub',
      'label':'Bug Tracker'
    },
    'feedback-link': {
      'title':'Envíanos tus comentarios sobre el editor de Python',
      'label':'Enviar Comentarios'
    },
    'editor-ver': 'Versión del Editor:',
    'mp-ver': 'Versión de MicroPython:'
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
      'update-req': 'Necesitas <a target="_blank" href="https://support.microbit.org/support/solutions/articles/19000019131-how-to-upgrade-the-firmware-on-the-micro-bit">actualizar el firmware del micro:bit </a> para poder usar esta función!',
      'clear-connect': 'Hay otro proceso conectado a este dispositivo.<br>Cierre cualquier otra pestaña que pueda estar usando WebUSB (por ejemplo, MakeCode or Editor de Python), o desconecte y vuelva a conectar el micro:bit antes de volver a intentarlo.',
      'reconnect-microbit': 'Por favor reconecta el micro:bit e intentalo de nuevo.',
      'partial-flashing-disable': 'Si el error persiste, intenta deshabilitar el flasheo parcial en las opciones beta.',
      'device-disconnected': 'Dispositivo desconectado.'
    },
    'close': 'Cerrar',
    'request-repl': 'Envia CTRL-C para el REPL',
    'request-serial': 'Envia CTRL-D para reiniciar',
    'flashing-text': 'Flasheando micro:bit',
    'download': 'Descargar Hex'
  },
  'load': {
    'show-files' : 'Mostrar Archivos',
    'load-title': 'Cargar',
    'instructions': 'Arrastre y suelte aqui un archivo .hex o .py para abrirlo.',
    'submit': 'Cargar',
    'save-title': 'Guardar',
    'save-hex' : 'Descargar Proyecto Hex',
    'save-py' : 'Descargar Script de Python',
    'fs-title': 'Archivos',
    'toggle-file': 'O busque un archivo.',
    'fs-add-file': 'Agregar archivo',
    'hide-files': 'Ocultar Archivos',
    'td-filename': 'Nombre de archivo',
    'td-size': 'Tamaño',
    'fs-space-free':'disponible',
    'remove-but' : 'Borrar',
    'save-but': 'Guardar'
  },
  'static-strings': {
    'buttons': {
      'command-download': {
        'title': 'Descargue un archivo hex para flashear el micro:bit',
        'label': 'Descargar'
      },
      'command-disconnect': {
        'title': 'Desconectarse del micro:bit',
        'label': 'Desconectar'
      },
      'command-flash': {
        'title': 'Flash el proyecto directamente al micro:bit',
        'label': 'Flash'
      },
      'command-files': {
        'title': 'Cargar/Guardar archivos',
        'label': 'Cargar/Guardar'
      },
      'command-serial': {
        'title': 'Conecte el micro:bit a través de serie',
        'label': 'Abrir Serie',
        'title-close': 'Cierra la conexión en serie y vuelva al editor.',
        'label-close': 'Cerrar Serie'
      },
      'command-connect': {
        'title': 'Conéctea al micro:bit',
        'label': 'Conectar'
      },
      'command-options': {
        'title': 'Cambie la configuración del editor',
        'label': 'Opciones Beta'
      },
      'command-blockly': {
        'title': 'Haga clic para crear código con blockly',
        'label': 'Blockly'
      },
      'command-snippet': {
        'title': 'Haga clic para seleccionar un fragmento (acceso directo de código)',
        'label': 'Fragmentos'
      },
      'command-help': {
        'title': 'Descubre recursos útiles',
        'label': 'Ayuda'
      },
      'command-language': {
        'title': 'Seleccionar Idioma',
        'label': 'Idioma'
      },
      'command-share': {
        'title': 'Crear un enlace para compartir tu script',
        'label': 'Compartir'
      },
      'command-zoom-in': {
        'title': 'Aumentar zoom'
      },
      'command-zoom-out': {
        'title': 'Disminuir zoom'
      }
    },
    'script-name': {
      'label': 'Nombre del Script'
    },
    'options-dropdown': {
      'autocomplete': 'Autocompletar',
      'on-enter': 'Al presionar Intro',
      'partial-flashing': 'Flasheo Parcial',
      'lang-select': 'Seleccionar Idioma:'
    },
    'text-editor': {
      'aria-label': 'editor de texto'
    }
  }
};
