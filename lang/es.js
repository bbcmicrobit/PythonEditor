var LANGUAGE = {
  "code_snippets": {
    "title": "Fragmentos de Codigo",
    "description": "Los fragmentos de código son bloques cortos de código para reutilizar en tus programas. Hay fragmentos de las cosas más comunes que querrás hacer con MicroPython.",
    "instructions": "Selecciona uno de los fragmentos para incluir el bloque de codigo.",
    "trigger_heading": "atajo",
    "description_heading": "descripción",
    "docs": "crea un comentario para describir tu código",
    "wh": "mientras que alguna condición es verdadera, continua ejecutando el código",
    "with": "haz algo con algo asignado a un nombre",
    "cl": "crea una nueva clase que define el comportamiento de un nuevo tipo de objeto",
    "def": "define una función con nombre propio que toma algunos argumentos y opcionalmente añade una descripción",
    "if": "si alguna condición es verdadera, haz algo",
    "ei": "de lo contrario, si alguna otra condición es verdadera, haz algo",
    "el": "de lo contratio, haz otra cosa",
    "for": "por cada elemento de una colección de elementos, haz algo con cada elemento",
    "try": "intenta hacer algo y maneja las excepciones (errores)"
  },
  "alerts": {
    "download": "Safari tiene un error que significa que el trabajo se descargará como un archivo sin nombre. Por favor, cambia el nombre a algo que termine en .hex. Alternativamente, usa un navegador como Firefox o Chrome. Estos navegadores no sufren de este error.",
    "save": "Safari tiene un error que significa que el trabajo se descargará como un archivo sin nombre. Por favor, cambia el nombre a algo que termine en .py. Alternativamente, usa un navegador como Firefox o Chrome. No sufren de este error.",
    "load_code": "¡Uy! No se pudo añadir el código en el archivo hex.",
    "unrecognised_hex": "Lo sentimos, no pudimos reconocer este archivo",
    "snippets": "Los fragmentos están deshabilitados cuando blockly está habilitado.",
    "error": "Error:",
    "empty": "El archivo Python no tiene ningún contenido.",
    "no_python": "No se pudo encontrar código válido de Python en el archivo hex.",
    "no_script": "Hex file does not contain an appended Python script.",
    "no_main": "El archivo hex no contiene un archivo main.py.",
    "cant_add_file": "No se pudo añadir el archivo al sistema de archivos:",
    "module_added": "El módulo \"{{module_name}}\" se ha agregado al sistema de archivos.",
    "module_out_of_space": "No se pudo añadir el archivo al sistema ya que no queda espacio de almacenamiento."
  },
  "help": {
    "docs-link": {
      "title": "Ver la documentación de MicroPython",
      "label": "Documentación"
    },
    "support-link": {
      "title": "Obtenga apoyo para su micro:bit en una nueva pestaña",
      "label": "Soporte"
    },
    "help-link": {
      "title": "Abra la ayuda para este editor en una pestaña nueva",
      "label": "Ayuda"
    },
    "issues-link": {
      "title": "Ver problemas abiertos para el editor de Python en GitHub",
      "label": "Seguimiento de errores"
    },
    "feedback-link": {
      "title": "Envíanos tus comentarios sobre el editor de Python",
      "label": "Enviar Comentarios"
    },
    "editor-ver": "Versión del Editor:",
    "mp-ver": "Versión de MicroPython:"
  },
  "confirms": {
    "quit": "Algunos de sus cambios no se han guardado. Salir de todos modos?",
    "blocks": "Tienes un código sin guardar. Usar los bloques cambiará tu código. Puedes perder tus cambios. ¿Quieres continuar?",
    "replace_main": "¡Agregar un archivo main.py reemplazará el código en el editor!",
    "replace_file": "¿Quieres reemplazar el archivo \"{{file_name}}\"?",
    "replace_module": "¿Quieres reemplazar el módulo \"{{module_name}}\"?",
    "download_py_multiple": "Este proyecto contiene varios archivos que no se guardarán con este formato.\nRecomendamos descargar el archivo Hex, que contiene todo el proyecto y puede volver a cargarse en el editor.\n\n¿Estas seguro que quieres descargar el {{file_name}} archivo solo?"
  },
  "code": {
    "start": "Añade tu código Python aquí. Por ejemplo,"
  },
  "webusb": {
    "err": {
      "update-req": "You need to <a target=\"_blank\" href=\"https://microbit.org/firmware/\">update your micro:bit firmware</a> to make use of this feature.",
      "update-req-title": "Please update the micro:bit firmware",
      "clear-connect": "Hay otro proceso conectado a este dispositivo.<br>Cierre cualquier otra pestaña que pueda estar usando WebUSB (por ejemplo, MakeCode or Editor de Python), o desconecte y vuelva a conectar el micro:bit antes de volver a intentarlo.",
      "reconnect-microbit": "Por favor reconecta el micro:bit e intentalo de nuevo.",
      "partial-flashing-disable": "Si el error persiste, intenta deshabilitar el flasheo rapido en las opciones beta.",
      "device-disconnected": "Dispositivo desconectado.",
      "device-bootloader": "Please unplug the micro:bit and connect it again without pressing the reset button.<br>More info:",
      "device-bootloader-title": "micro:bit in MAINTENANCE mode",
      "timeout-error": "No se pudo conectar a la micro:bit",
      "timeout-error-title": "Connection Timed Out",
      "unavailable": "Con WebUSB puedes programar tu micro: bit y conectarte a la consola de serie directamente desde el Editor de Python.<br/>Desafortunadamente, WebUSB no es compatible con este navegador. Recomendamos Chrome o un navegador basado en Chrome para usar WebUSB.",
      "find-more": "Saber más"
    },
    "troubleshoot": "Resolución de problemas",
    "close": "Cerrar",
    "request-repl": "Envia CTRL-C para el REPL",
    "request-serial": "Envia CTRL-D para reiniciar",
    "flashing-title": "Flashing MicroPython",
    "flashing-title-code": "Flashing code",
    "flashing-long-msg": "Initial flash might take longer, subsequent flashes will be quicker.",
    "download": "Descargar Hex"
  },
  "load": {
    "show-files": "Mostrar Archivos",
    "load-title": "Cargar",
    "instructions": "Arrastre y suelte aqui un archivo .hex o .py para abrirlo.",
    "submit": "Cargar",
    "save-title": "Guardar",
    "save-hex": "Descargar Proyecto Hex",
    "save-py": "Descargar Script de Python",
    "fs-title": "Archivos",
    "toggle-file": "O busque un archivo.",
    "fs-add-file": "Agregar archivo",
    "hide-files": "Ocultar Archivos",
    "td-filename": "Nombre de archivo",
    "td-size": "Tamaño",
    "fs-space-free": "disponible",
    "remove-but": "Borrar",
    "save-but": "Guardar",
    "files-title": "Archivos del proyecto",
    "help-button": "Ayuda de archivos",
    "file-help-text": "El área de Archivos de Proyecto le muestra los archivos incluidos en su programa y le permite añadir o eliminar módulos python externos y otros archivos. Más información en el ",
    "help-link": "Documentación de ayuda del Editor de Python",
    "invalid-file-title": "Tipo de archivo inválido",
    "mpy-warning": "Esta versión del Editor de Python no permite actualmente añadir archivos .mpy.",
    "extension-warning": "El Editor de Python sólo puede cargar archivos con las extensiones .hex o .py."
  },
  "languages": {
    "en": {
      "title": "Inglés"
    },
    "zh-CN": {
      "title": "Chino (simplificado)"
    },
    "zh-HK": {
      "title": "Chino (tradicional, Hong Kong)"
    },
    "zh-TW": {
      "title": "Chino (tradicional, Taiwan)"
    },
    "hr": {
      "title": "Croata"
    },
    "pl": {
      "title": "Polaco"
    },
    "es": {
      "title": "Español"
    },
    "fr": {
      "title": "French"
    },
    "ko": {
      "title": "Korean"
    },
    "nn": {
      "title": "Norwegian Nynorsk"
    },
    "pt": {
      "title": "Portuguese"
    },
    "sr": {
      "title": "Serbian"
    }
  },
  "static-strings": {
    "buttons": {
      "command-download": {
        "title": "Descargue un archivo hex para flashear el micro:bit",
        "label": "Descargar"
      },
      "command-disconnect": {
        "title": "Desconectarse del micro:bit",
        "label": "Desconectar"
      },
      "command-flash": {
        "title": "Flash el proyecto directamente al micro:bit",
        "label": "Flash"
      },
      "command-files": {
        "title": "Cargar/Guardar archivos",
        "label": "Cargar/Guardar"
      },
      "command-serial": {
        "title": "Conecte el micro:bit a través de serie",
        "label": "Abrir Serie",
        "title-close": "Cierra la conexión en serie y vuelva al editor.",
        "label-close": "Cerrar Serie"
      },
      "command-connect": {
        "title": "Conéctea al micro:bit",
        "label": "Conectar"
      },
      "command-connecting": {
        "title": "Conectando a la micro:bit",
        "label": "Conectando"
      },
      "command-options": {
        "title": "Cambie la configuración del editor",
        "label": "Opciones Beta"
      },
      "command-blockly": {
        "title": "Haga clic para crear código con blockly",
        "label": "Blockly"
      },
      "command-snippet": {
        "title": "Haga clic para seleccionar un fragmento (acceso directo de código)",
        "label": "Fragmentos"
      },
      "command-help": {
        "title": "Descubre recursos útiles",
        "label": "Ayuda"
      },
      "command-language": {
        "title": "Seleccionar Idioma",
        "label": "Idioma"
      },
      "command-zoom-in": {
        "title": "Aumentar zoom"
      },
      "command-zoom-out": {
        "title": "Disminuir zoom"
      }
    },
    "script-name": {
      "label": "Nombre del Script"
    },
    "options-dropdown": {
      "autocomplete": "Autocompletar",
      "on-enter": "Al presionar Intro",
      "partial-flashing": "Flasheo Rapido",
      "lang-select": "Seleccionar Idioma:",
      "add-language-link": "Añadir un idioma"
    },
    "text-editor": {
      "aria-label": "editor de texto"
    }
  }
};
