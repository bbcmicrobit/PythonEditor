var LANGUAGE = {
  "code_snippets": {
    "title": "Kodesnuttar",
    "description": "Kodesnuttar er korte bitar av kode som du kan gjenbruke i programma dine. Det finst ferdige snuttar for dei vanlegaste tinga du kan ville gjere med MicroPython.",
    "instructions": "Velg ein av snuttane under for å setje inn kodeblokka.",
    "trigger_heading": "utløysar",
    "description_heading": "skildring",
    "docs": "skriv ein kommentar for å skildre koden din",
    "wh": "medan ei tilstand er sann, held fram med ei løkke kring koden",
    "with": "gjer noko med ein ting som er tilordna eit namn",
    "cl": "opprett ei ny klasse som definerer korleis ein ny type objekt skal oppføre seg",
    "def": "definer ein namngjeve funksjon som tek nokre argument og eventuelt legg til ei skildring",
    "if": "gjer noko dersom eit vilkår er sant",
    "ei": "elles, dersom eit anna vilkår er sant, gjer noko",
    "el": "elles gjer noko anna",
    "for": "for kvart element i ei samling av element, gjer noko med kvart element",
    "try": "forsøk å gjere noko og handtere unnatak (feil)"
  },
  "alerts": {
    "download": "Safari har ein feil som inneber at arbeidet ditt blir lasta ned som ei fil utan namn. Gje eit nytt namn som sluttar på filtypen . ex (t.d. filnamn.hex). Elles kan du bruke ein annan nettlesar som Firefox eller Chrome, som ikkje har denne feilen.",
    "save": "Safari har ein feil som inneber at arbeidet ditt blir lasta ned som ei fil utan namn. Gje eit nytt namn som sluttar på filtypen . py (t.d. filnamn.py). Elles kan du bruke ein annan nettlesar som Firefox eller Chrome, som ikkje har denne feilen.",
    "load_code": "Heisann! Kunne ikkje laste koden inn i hex-fila.",
    "unrecognised_hex": "Orsak, men vi kjenner ikkje att denne fila.",
    "snippets": "Snuttar er deaktivert når blockly er aktivert.",
    "error": "Feil:",
    "empty": "Python-fila har ikkje noko innhald.",
    "no_python": "Kunne ikkje finne gyldig Python-kode i hex-fila.",
    "no_script": "Hex file does not contain an appended Python script.",
    "no_main": "Hex-fila inneheld ikkje ei main.py-fil.",
    "cant_add_file": "Kunne ikkje legge fil til i filsystemet:",
    "module_added": "Modulen \"{{module_name}}\" er lagt til i filsystemet.",
    "module_out_of_space": "Kunne ikkje legge til fil i systemet fordi det ikkje er ledig lagringsplass."
  },
  "help": {
    "docs-link": {
      "title": "Vis dokumentasjonen for MicroPython",
      "label": "Dokumentasjon"
    },
    "support-link": {
      "title": "Opne brukarstøtte for micro:bit i ein ny fane",
      "label": "Brukarstøtte"
    },
    "help-link": {
      "title": "Opne hjelp for dette redigeringsprogrammet i ein ny fane",
      "label": "Hjelp"
    },
    "issues-link": {
      "title": "Syn uløyste problem med Python Editor i GitHub",
      "label": "Problemsporing"
    },
    "feedback-link": {
      "title": "Send oss tilbakemelding om Python-redigering",
      "label": "Send tilbakemelding"
    },
    "editor-ver": "Nettlesar-versjon:",
    "mp-ver": "MikroPython-versjon:"
  },
  "confirms": {
    "quit": "Somme av endringane er ikkje lagra. Avslutt likevel?",
    "blocks": "Du har ulagra kode. Bruk av blokker vil endre koden din. Du kan miste endringane dine. Vil du halde fram?",
    "replace_main": "Å leggje til ei fil av typen main.py vil erstatte koden i redigeringsprogrammet!",
    "replace_file": "Vil du erstatte fila \"{{file_name}}\"?",
    "replace_module": "Vil du erstatte modulen \"{{module_name}}\"?",
    "download_py_multiple": "Prosjektet inneheld fleire filer som ikkje vil bli lagra i dette formatet.\nVi rår deg til først å laste ned hex-fila, som inneheld heile prosjektet og som kan bli lasta tilbake i redigeringsprogrammet.\n\nEr du viss på at du vil laste ned fila {{file_name}}?"
  },
  "code": {
    "start": "Legg til Python-koden din her. Til dømes"
  },
  "webusb": {
    "err": {
      "update-req": "You need to <a target=\"_blank\" href=\"https://microbit.org/firmware/\">update your micro:bit firmware</a> to make use of this feature.",
      "update-req-title": "Please update the micro:bit firmware",
      "clear-connect": "Ein annan prosess er kopla til denne eininga.<br>Lukk alle fanar som kan tenkjast å nytte WebUSB (dvs. MakeCode, Python Editor), eller kople frå og kople til micro:bit på nytt før du prøver igjen.",
      "reconnect-microbit": "Kople til micro:bit igjen og prøv på nytt.",
      "partial-flashing-disable": "Om feila held fram, kan du prøve å deaktivere Quick Flash i beta-innstillingane.",
      "device-disconnected": "Eininga er kopla frå.",
      "device-bootloader": "Please unplug the micro:bit and connect it again without pressing the reset button.<br>More info:",
      "device-bootloader-title": "micro:bit in MAINTENANCE mode",
      "timeout-error": "Kan ikkje kople til micro:biten",
      "timeout-error-title": "Connection Timed Out",
      "unavailable": "Med WebUSB kan du programmere micro:bit og kople til seriellkonsollen direkte frå redigeringsprogrammet på nett.<br/>Dessverre støttar ikkje nettlesaren din WebUSB. Vi rår deg til å nytte Chrome, eller ein nettlesar tufta på Chrome, for å bruke WebUSB.",
      "find-more": "Finn ut meir"
    },
    "troubleshoot": "Feilsøking",
    "close": "Lukk",
    "request-repl": "Send CTRL-C for å REPL",
    "request-serial": "Send CTRL-D for å tilbakestille",
    "flashing-title": "Flashing MicroPython",
    "flashing-title-code": "Flashing code",
    "flashing-long-msg": "Initial flash might take longer, subsequent flashes will be quicker.",
    "download": "Laste ned HEX-fil"
  },
  "load": {
    "show-files": "Vis filer",
    "load-title": "Laste",
    "instructions": "Dra og slepp ei .hex- eller .py-fil her for å opne henne.",
    "submit": "Laste",
    "save-title": "Lagre",
    "save-hex": "Last ned hex-prosjekt",
    "save-py": "Last ned Python-skript",
    "fs-title": "Filer",
    "toggle-file": "Eller søk etter ei fil.",
    "fs-add-file": "Legg til fil",
    "hide-files": "Skjul filer",
    "td-filename": "Filnamn",
    "td-size": "Storleik",
    "fs-space-free": "gratis",
    "remove-but": "Fjern",
    "save-but": "Lagre",
    "files-title": "Prosjektfiler",
    "help-button": "Filhjelp",
    "file-help-text": "Prosjektfil-området syner filene som er inkludert i programmet ditt og lar deg leggje til eller fjerne eksterne python-modular og andre filer. Finn ut meir i  ",
    "help-link": "Hjelpedokumentasjon for Python",
    "invalid-file-title": "Ugyldig filtype",
    "mpy-warning": "Denne versjonen av Python støttar ikkje høvet til å leggje til .mpy-filer.",
    "extension-warning": "Python kan berre laste filer med .hex eller .py-utvidingar."
  },
  "languages": {
    "en": {
      "title": "Norsk Nynorsk"
    },
    "zh-CN": {
      "title": "Kinesisk (forenkla)"
    },
    "zh-HK": {
      "title": "Kinesisk (tradisjonelt, Hongkong)"
    },
    "zh-TW": {
      "title": "Kinesisk (tradisjonelt, Taiwan)"
    },
    "hr": {
      "title": "Kroatisk"
    },
    "pl": {
      "title": "Polsk"
    },
    "es": {
      "title": "Spansk"
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
        "title": "Last ned ei hex-fil for å laste henne til micro:biten",
        "label": "Last ned"
      },
      "command-disconnect": {
        "title": "Kople frå micro:bit",
        "label": "Kople frå"
      },
      "command-flash": {
        "title": "Last prosjektet direkte til micro:bit",
        "label": "Last inn"
      },
      "command-files": {
        "title": "Laste / lagre filer",
        "label": "Laste/lagre"
      },
      "command-serial": {
        "title": "Kople til micro:bit via serieport",
        "label": "Opne serieport",
        "title-close": "Lukk serietilkoplinga og gå tilbake til redigering",
        "label-close": "Lukk serieport"
      },
      "command-connect": {
        "title": "Kople til micro:bit",
        "label": "Kople til"
      },
      "command-connecting": {
        "title": "Koplar til micro:bit",
        "label": "Koplar til"
      },
      "command-options": {
        "title": "Endre innstillingar for redigeringsprogrammet",
        "label": "Beta-alternativ"
      },
      "command-blockly": {
        "title": "Klikk for å skape kode med blockly",
        "label": "Blockly"
      },
      "command-snippet": {
        "title": "Klikk for å velgje ein snutt (snarveg til kode)",
        "label": "Snuttar"
      },
      "command-help": {
        "title": "Oppdag nyttige ressursar",
        "label": "Hjelp"
      },
      "command-language": {
        "title": "Vel eit språk",
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
      "label": "Namn på skriptet"
    },
    "options-dropdown": {
      "autocomplete": "Autofullfør",
      "on-enter": "Ved Enter",
      "partial-flashing": "Rask innlasting",
      "lang-select": "Vel språk:",
      "add-language-link": "Legg til eit språk"
    },
    "text-editor": {
      "aria-label": "tekstredigering"
    }
  }
};
