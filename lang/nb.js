var LANGUAGE = {
  "code_snippets": {
    "title": "Kodebiter",
    "description": "Kodebiter er korte kodeblokker du kan bruke på nytt i dine egne programmer. Det finnes kodebiter for de vanligste tingene du vil gjøre med MicroPython.",
    "instructions": "Velg en av bitene under for å sette inn kodeblokken.",
    "trigger_heading": "utløser",
    "description_heading": "beskrivelse",
    "docs": "opprett en kommentar for å beskrive koden din",
    "wh": "fortsett å kjøre ei løkke for koden så lenge visse betingelser er sanne ",
    "with": "gjør et eller annet med noe som er tilordnet et navn",
    "cl": "opprett en ny klasse som definerer adferden til en ny type objekt",
    "def": "definer en navngitt funksjon som tar noen argumenter, legg eventuelt til en beskrivelse",
    "if": "hvis en betingelse er sann: gjør noe",
    "ei": "ellers: gjør noe hvis en annen betingelse er sann",
    "el": "ellers: gjør noe annet",
    "for": "for hver variabel i en samling av variabler: gjør noe med hver variabel",
    "try": "forsøke å gjøre noe og håndtere unntak (feil)"
  },
  "alerts": {
    "download": "Safari har en feil som gjør at arbeidet ditt blir lastet ned som en ikke-navngitt fil. Vennligst velg et nytt navn som slutter på .hex. Alternativt, bruk en nettleser som Firefox eller Chrome. De har ikke denne feilen.",
    "save": "Safari har en feil som gjør at arbeidet ditt blir lastet ned som en ikke-navngitt fil. Vennligst velg et nytt navn som slutter på .hex. Alternativt, bruk en nettleser som Firefox eller Chrome. De har ikke denne feilen.",
    "load_code": "Oisann! Kunne ikke laste koden inn i hex-fila.",
    "unrecognised_hex": "Beklager, vi gjenkjenner ikke denne fila",
    "snippets": "Snippets er deaktivert når blockly er aktivert.",
    "error": "Feil:",
    "empty": "Python-fila har ikke noe innhold.",
    "no_python": "Kunne ikke finne en gyldig Python-kode i hex-fila.",
    "no_script": "Hex file does not contain an appended Python script.",
    "no_main": "hex-fila inneholder ikke en main.py-fil.",
    "cant_add_file": "Kunne ikke legge til fil i filsystemet:",
    "module_added": "Modulen \"{{module_name}}\" er lagt til i filsystemet.",
    "module_out_of_space": "Kunne ikke legge til fil i systemet fordi det ikke er nok lagringsplass."
  },
  "help": {
    "docs-link": {
      "title": "Les dokumentasjonen for MicroPython",
      "label": "Dokumentasjon"
    },
    "support-link": {
      "title": "Få hjelp med micro:biten din i en ny fane",
      "label": "Støtte"
    },
    "help-link": {
      "title": "Åpne hjelp for denne nettleseren i en ny fane",
      "label": "Hjelp"
    },
    "issues-link": {
      "title": "Vis uløste problemer for Python Editor i GitHub",
      "label": "Problem-sporing"
    },
    "feedback-link": {
      "title": "Send oss din tilbakemelding om Python Editor",
      "label": "Gi tilbakemelding"
    },
    "editor-ver": "Nettleserversjon:",
    "mp-ver": "MikroPython-versjon:"
  },
  "confirms": {
    "quit": "Noen av endringene dine har ikke blitt lagret. Avslutt likevel?",
    "blocks": "Du har ulagret kode. Bruk av blokker endrer koden din. Du kan miste endringene. Vil du fortsette?",
    "replace_main": "Å legge til en main.py-fil vil erstatte koden i nettleseren!",
    "replace_file": "Vil du erstatte fila \"{{file_name}}\"?",
    "replace_module": "Vil du erstatte modulen \"{{module_name}}\"?",
    "download_py_multiple": "Dette prosjektet inneholder flere filer som ikke blir lagret i dette formatet.\nVi anbefaler å laste ned Hex-fila, som inneholder hele prosjektet og kan bli lasta tilbake i nettleseren.\nEr du sikker på at du kun vil laste ned fila {{file_name}}?"
  },
  "code": {
    "start": "Legg til Python-koden din her. F.eks."
  },
  "webusb": {
    "err": {
      "update-req": "You need to <a target=\"_blank\" href=\"https://microbit.org/firmware/\">update your micro:bit firmware</a> to make use of this feature.",
      "update-req-title": "Please update the micro:bit firmware",
      "clear-connect": "En annen prosess er koblet til denne enheten.<br>Lukk alle faner som bruker WebUSB (F.eks. MakeCode, Python Editor), eller koble micro:bit fra og til før du prøver igjen.",
      "reconnect-microbit": "Vennligst koble til micro:bit på nytt og prøv igjen.",
      "partial-flashing-disable": "Hvis feilene vedvarer, kan du prøve å deaktivere Quick Flash i beta-innstillingene.",
      "device-disconnected": "Enheten er frakoblet.",
      "timeout-error": "Kan ikke koble til micro:bit",
      "unavailable": "Med WebUSB kan du programmere micro:bit og koble deg til seriellkonsollen direkte fra nettlesreen.<br/>Dessverre støttes ikke WebUSB i denne nettleseren. Vi anbefaler Chrome eller en Chrome-basert nettleser for å bruke WebUSB.",
      "find-more": "Finn ut mer"
    },
    "troubleshoot": "Feilsøking",
    "close": "Lukke",
    "request-repl": "Send CTRL-C for REPL",
    "request-serial": "Send CTRL-D for å tilbakestille",
    "flashing-title": "Flashing MicroPython",
    "flashing-title-code": "Flashing code",
    "flashing-long-msg": "Initial flash might take longer, subsequent flashes will be quicker.",
    "download": "Last ned HEX"
  },
  "load": {
    "show-files": "Vis filer",
    "load-title": "Last inn",
    "instructions": "Dra og slipp en .hex- eller .py-fil her for å åpne den.",
    "submit": "Last inn",
    "save-title": "Lagre",
    "save-hex": "Download Project Hex",
    "save-py": "Last ned Python Script",
    "fs-title": "Filer",
    "toggle-file": "Eller søk etter en fil.",
    "fs-add-file": "Legg til fil",
    "hide-files": "Skjul filer",
    "td-filename": "Filnavn",
    "td-size": "Størrelse",
    "fs-space-free": "ledig",
    "remove-but": "Fjern",
    "save-but": "Lagre",
    "files-title": "Prosjektfiler",
    "help-button": "Hjelp for filer",
    "file-help-text": "Prosjektfil-området viser filene dine som er inkludert i programmet og lar deg legge til eller fjerne eksterne python-moduler og andre filer. Finn ut mer i ",
    "help-link": "Python Editor help documentation",
    "invalid-file-title": "Ugyldig filtype",
    "mpy-warning": "This version of the Python Editor doesn't currently support adding .mpy files.",
    "extension-warning": "Python Editor kan bare laste filer med .hex eller .py-utvidelser."
  },
  "languages": {
    "en": {
      "title": "Norsk"
    },
    "es": {
      "title": "Spansk"
    },
    "pl": {
      "title": "Polsk"
    },
    "hr": {
      "title": "Kroatisk"
    },
    "zh-CN": {
      "title": "Kinesisk (forenklet)"
    },
    "zh-HK": {
      "title": "Kinesisk (tradisjonell, Hongkong)"
    },
    "zh-TW": {
      "title": "Kinesisk (tradisjonell, Taiwan)"
    }
  },
  "static-strings": {
    "buttons": {
      "command-download": {
        "title": "Download a hex file to flash onto the micro:bit",
        "label": "Last ned"
      },
      "command-disconnect": {
        "title": "Koble fra micro:bit",
        "label": "Koble fra"
      },
      "command-flash": {
        "title": "Flash the project directly to the micro:bit",
        "label": "Flash"
      },
      "command-files": {
        "title": "Load/Save files",
        "label": "Load/Save"
      },
      "command-serial": {
        "title": "Connect the micro:bit via serial",
        "label": "Open Serial",
        "title-close": "Close the serial connection and go back to the editor",
        "label-close": "Close Serial"
      },
      "command-connect": {
        "title": "Koble til micro:bit",
        "label": "Logg på"
      },
      "command-connecting": {
        "title": "Kobler til micro:bit",
        "label": "Connecting"
      },
      "command-options": {
        "title": "Endre innstillinger for tekstbehandler",
        "label": "Beta Options"
      },
      "command-blockly": {
        "title": "Click to create code with blockly",
        "label": "Blockly"
      },
      "command-snippet": {
        "title": "Click to select a snippet (code shortcut)",
        "label": "Snippets"
      },
      "command-help": {
        "title": "Oppdag nyttige ressurser",
        "label": "Hjelp"
      },
      "command-language": {
        "title": "Velg språk",
        "label": "Språk"
      },
      "command-zoom-in": {
        "title": "Zoom inn"
      },
      "command-zoom-out": {
        "title": "Zoom ut"
      }
    },
    "script-name": {
      "label": "Script Name"
    },
    "options-dropdown": {
      "autocomplete": "Autofullfør",
      "on-enter": "On Enter",
      "partial-flashing": "Quick Flash",
      "lang-select": "Velg språk",
      "add-language-link": "Legg til språk"
    },
    "text-editor": {
      "aria-label": "Tekstbehandler"
    }
  }
};
