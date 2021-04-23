var LANGUAGE = {
  "code_snippets": {
    "title": "Ulomci kôda",
    "description": "Ulomci kôda su kratki blokovi koda koje možeš više puta koristiti u svojim programima. Postoje ulomci za najčešće stvari koje se izvode pomoću programa MicroPython.",
    "instructions": "Odaberi jedan od ponuđenih ulomaka kako bi u program uključio blok kôda.",
    "trigger_heading": "okidač",
    "description_heading": "opis",
    "docs": "izradi komentar za opis svoga kôda",
    "wh": "ako je neki uvjet zadovoljen, neka se određeni kôd izvodi u petlji",
    "with": "neka objekt određenog imena nešto radi",
    "cl": "kreiraj novu klasu koja definira ponašanje nekoga novog tipa objekta",
    "def": "definiraj i imenuj jednu funkciju koja preuzima neke argumente, možeš dodati i opis",
    "if": "ako je neki uvjet zadovoljen, izvedi neku radnju",
    "ei": "ili ako je neki drugi uvjet zadovoljen, izvedi neku radnju",
    "el": "u protivnom, izvedi neku drugu radnju",
    "for": "za svaku stavku iz nekog skupa napravi neku radnju",
    "try": "pokušaj napraviti nešto i uz to upravljati iznimkama (greškama)"
  },
  "alerts": {
    "download": "Safari ima bug zbog kojega će tvoj uradak preuzeti kao neimenovanu datoteku. Zato te molimo da joj dodijeliš ime koje završava s .hex. Drugi način je da koristiš Firefox ili Chrome preglednik koji nemaju taj bug.",
    "save": "Safari ima bug zbog kojega će tvoj uradak preuzeti kao neimenovanu datoteku. Zato te molimo da joj dodijeliš ime koje završava s .hex. Drugi način je da koristiš Firefox ili Chrome preglednik koji nemaju taj bug.",
    "load_code": "Uh! Kôd se ne može upisati u .hex datoteku.",
    "unrecognised_hex": "Nažalost ne prepoznajemo datoteku",
    "snippets": "Ulomci su isključeni kada je uključena \"blockly\" biblioteka.",
    "error": "Greška:",
    "empty": "Pythonova datoteka je prazna.",
    "no_python": "U .hex datoteci nije pronađen važeći Pythonov kôd.",
    "no_script": "U hex datoteci nije pronađen Pythonov programski kôd.",
    "no_main": "U hex datoteci nije pronađena main.py datoteka.",
    "cant_add_file": "Datoteka se ne može dodati u sustav:",
    "module_added": "Modul \"{{module_name}}\" dodan je u sustav.",
    "module_out_of_space": "Datoteka se ne može dodati u sustav jer nema dovoljno prostora za pohranjivanje."
  },
  "help": {
    "docs-link": {
      "title": "Pogledaj dokumentaciju za MicroPython",
      "label": "Dokumentacija"
    },
    "support-link": {
      "title": "Otvori novu karticu za pomoć u vezi s tvojim micro:bitom",
      "label": "Podrška"
    },
    "help-link": {
      "title": "U novoj kartici otvori upute za pomoć u vezi s ovim uređivačem kôda",
      "label": "Pomoć"
    },
    "issues-link": {
      "title": "U GitHubu pogledaj otvorena pitanja u vezi s Python Editorom",
      "label": "Praćenje problema"
    },
    "feedback-link": {
      "title": "Pošalji nam povratne informacije o Python Editoru",
      "label": "Pošanji povratne informacije"
    },
    "editor-ver": "Verzija uređivača:",
    "mp-ver": "Verzija MicroPythona:"
  },
  "confirms": {
    "quit": "Nisu spremljene sve promjene. Svejedno želiš izaći?",
    "blocks": "Nije spremljen sav kôd. Korištenjem blokova promijeniti će se kôd. Promjene bi se mogle izgubiti. Želiš li nastaviti?",
    "replace_main": "Dodavanjem main.py datoteke, ona će se u uređivaču upisati preko kôda!",
    "replace_file": "Želiš li zamijeniti datoteku \"{{file_name}}\"?",
    "replace_module": "Želiš li zamijeniti modul \"{{module_name}}\"?",
    "download_py_multiple": "Ovaj se projekt koristi višestrukim datotekama koje se u ovom formatu neće spremiti. Preporučujemo preuzimanje .hex datoteke koja sadrži tvoj cijeli projekt i može se vratiti u uređivač.\n\nJesi li siguran da želiš preuzeti samo datoteku {{file_name}}?"
  },
  "code": {
    "start": "Ovdje dodaj svoj Python kôd. Npr."
  },
  "webusb": {
    "err": {
      "update-req": "Trebaš <a target=\"_blank\" href=\"https://microbit.org/firmware/\">promijeniti svoj micro:bit firmware</a> da bi tu značajku mogao koristiti.",
      "update-req-title": "Ažuriraj micro:bitov firmware",
      "clear-connect": "Za ovaj je uređaj vezan još jedan proces.<br>Zatvori sve tabove u kojima se koristi WebUSB (npr. MakeCode, Python Editor) ili isključi pa ponovo uključi micro:bit i onda pokušaj ponovo.",
      "reconnect-microbit": "Nanovo uključi svoj micro:bit i pokušaj opet.",
      "partial-flashing-disable": "Ako se greške ponavljaju, pokušaj u beta opcijama isključiti opciju Quick Flash.",
      "device-disconnected": "Uređaj je isključen.",
      "device-bootloader": "Please unplug the micro:bit and connect it again without pressing the reset button.<br>More info:",
      "device-bootloader-title": "micro:bit in MAINTENANCE mode",
      "timeout-error": "Nije se moguće spojiti na micro:bit",
      "timeout-error-title": "Connection Timed Out",
      "unavailable": "Pomoću WebUSB-a možeš programirati svoj micro:bit i izravno iz uređivača povezati ga na serijsku konzolu.<br/>Nažalost, ovaj pretraživač ne podržava WebUSB. Preporučujemo WebUSB koristiti u pretraživaču Chrome ili u nekom iz njega izvedenom.",
      "find-more": "Saznaj više"
    },
    "troubleshoot": "Rješavanje problema",
    "close": "Zatvori",
    "request-repl": "Pošalji CTRL-C za REPL",
    "request-serial": "Pošalji CTRL-D za krenuti ispočetka",
    "flashing-title": "'Flashanje' MicroPythona",
    "flashing-title-code": "'Flashanje' kôda",
    "flashing-long-msg": "Prvi 'flash' može potrajati, sljedeći će biti brži.",
    "download": "Preuzmi .hex"
  },
  "load": {
    "show-files": "Pokaži datoteke",
    "load-title": "Učitaj",
    "instructions": "Povuci i spusti .hex ili .py datoteku ovamo da se otvori.",
    "submit": "Učitaj",
    "save-title": "Spremi",
    "save-hex": "Preuzmi .hex datoteku projekta",
    "save-py": "Preuzmi Pythonov programski kôd",
    "fs-title": "Datoteke",
    "toggle-file": "Ili potraži datoteku pomoću pretraživača.",
    "fs-add-file": "Dodaj datoteku",
    "hide-files": "Sakrij datoteke",
    "td-filename": "Ime datoteke",
    "td-size": "Veličina",
    "fs-space-free": "slobodno",
    "remove-but": "Izbaci",
    "save-but": "Spremi",
    "files-title": "Datoteke projekta",
    "help-button": "Pomoć za datoteke",
    "file-help-text": "U području projektnih datoteka vidi se koje su sve datoteke uključene u tvoj program i tu se mogu dodavati ili uklanjati vanjski Pythonovi moduli i druge datoteke. Saznaj više u ",
    "help-link": "Dokumentacija za pomoć s Pythonovim uređivačem",
    "invalid-file-title": "Neispravan tip datoteke",
    "mpy-warning": "Ova verzija Pythonova uređivača nažalost još ne podržava dodavanje .mpy datoteka.",
    "extension-warning": "Pythonov uređivač može učitati samo datoteke s ekstenzijama .hex ili .py."
  },
  "languages": {
    "en": {
      "title": "Engleski"
    },
    "zh-CN": {
      "title": "Kineski (pojednostavljeni)"
    },
    "zh-HK": {
      "title": "Kineski (tradicionalni, Hong Kong)"
    },
    "zh-TW": {
      "title": "Kineski (tradicionalni)"
    },
    "hr": {
      "title": "Hrvatski"
    },
    "pl": {
      "title": "Poljski"
    },
    "es": {
      "title": "Španjolski"
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
        "title": "Preuzmi .hex datoteku za prijenos (flash) na micro:bit",
        "label": "Preuzmi"
      },
      "command-disconnect": {
        "title": "Odspoji s micro:bita",
        "label": "Odspoji"
      },
      "command-flash": {
        "title": "Učitaj (\"flash\") projekt izravno u micro:bit",
        "label": "Flash ('flashaj')"
      },
      "command-files": {
        "title": "Učitaj/spremi datoteke",
        "label": "Učitaj/spremi"
      },
      "command-serial": {
        "title": "Priključi micro:bit putem serijske veze",
        "label": "Otvori seriju",
        "title-close": "Zatvori serijsku vezu i vrati se u uređivač",
        "label-close": "Zatvori serijsku vezu"
      },
      "command-connect": {
        "title": "Spoji se na micro:bit",
        "label": "Poveži"
      },
      "command-connecting": {
        "title": "Povezivanje s micro:bitom",
        "label": "Povezivanje"
      },
      "command-options": {
        "title": "Promijeni postavke uređivača",
        "label": "Beta opcije"
      },
      "command-blockly": {
        "title": "Klikni za kreiranje kôda pomoću \"blockly\" biblioteke",
        "label": "Blockly biblioteka"
      },
      "command-snippet": {
        "title": "Klikni za odabir ulomka (prečacom do kôda)",
        "label": "Ulomci"
      },
      "command-help": {
        "title": "Otkrij korisne resurse",
        "label": "Pomoć"
      },
      "command-language": {
        "title": "Odaberi jezik",
        "label": "Jezik"
      },
      "command-zoom-in": {
        "title": "Povećaj"
      },
      "command-zoom-out": {
        "title": "Smanji"
      }
    },
    "script-name": {
      "label": "Naziv skripte (programskog kôda)"
    },
    "options-dropdown": {
      "autocomplete": "Dovrši automatski",
      "on-enter": "Pritiskom Enter",
      "partial-flashing": "Brzi \"flash\" (učitavanje)",
      "lang-select": "Odaberi jezik:",
      "add-language-link": "Dodaj jezik"
    },
    "text-editor": {
      "aria-label": "obrađivač teksta"
    }
  }
};
