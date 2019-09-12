var language = {
   'code_snippets': {
      'title': 'Fragmenty Kodu',
      'description': 'Fragmenty kodu są krótkimi blokami kodu do użycia we własnych programach. Znajdują się fragmenty dla zwykłych rzeczy, które będziemy chcieli zrobić za pomocą MicroPython.',
      'instructions': 'Select one of the snippets below to inject the code block.',
      'trigger_heading': 'spust',
      'description_heading': 'opisanie',
      'docs': 'utworzyć komentarz, aby opisać swój kod',
      'wh': 'podczas gdy niektóry warunek jest prawidłowy, powtarzaj kod',
      'with': 'zrób coś z czymś przypisanym do jakieś nazwy',
      'cl': 'utwórz nową klasę która definuje zachowanie nowego typu obiektu',
      'def': 'zdefiniuj nazwaną funkcję, która pobiera pewne argumenty i opcjonalnie dodaj opis',
      'if': 'jeśli jakiś warunek jest prawidłowy, zrób coś',
      'ei': 'jeśli jakiś warunek jest prawidłowy, zrób coś',
      'el': 'inaczej zrób inną rzecz',
      'for': 'dla każdego przedmiotu w kolekcji przedmiotów zrób co coś z każdym przedmiotem',
      'try': 'spróbuj coś zrobić i obsłuż wyjątki (błędy)'
   },
   'share': {
      'title': 'Udostępnij Kod',
      'instructions': 'Użyj hasła i opcjonalnej podpowiedzi (aby pomóc ci zapamiętać hasło), aby bezpiecznie utworzyć link do udostępniania twojego kodu z innymi.',
      'passphrase': 'Hasło: ',
      'hint': 'Podpowiedź do hasła: ',
      'button': 'Utwórz Link',
      'description': 'Ten URL wskazuje do twojego kodu:',
      'shortener': 'To jest skrócona wersia linku:'
   },
   'decrypt': {
      'title': 'Odszyfruj kod',
      'instructions': 'Wpisz hasło aby odszyfrować kod.',
      'passphrase': 'Hasło: ',
      'button': 'Odszyfruj'
   },
   'alerts': {
      'download': 'Safari ma błąd, który znaczy że ​​twoja praca zostanie pobrana jako nie nazwany plik. Zmień nazwę na coś kończącego się na .hex. Możesz też użyć innej przeglądarki, takiej jak Firefox lub Chrome którę nie mają tego błędu.',
      'save': 'Safari ma błąd, który znaczy że ​​twoja praca zostanie pobrana jako nie nazwany plik. Zmień nazwę na coś kończącego się na .hex. Możesz też użyć innej przeglądarki, takiej jak Firefox lub Chrome którę nie mają tego błędu.',
      'load_code': 'Ups! Nie można załadować kodu do pliku hex.',
      'unrecognised_hex': 'Przepraszamy, nie mogliśmy rozpoznać tego pliku ',
      'snippets': 'Fragmenty są wyłączone, gdy blockly jest włączony.',
      'error': 'Błąd:\n',
      'empty': 'Plik Pythona nie zawiera żadnego kodu.',
      'no_python': 'Nie znaleźono poprawnego kodu Pythona w pliku hex.',
      'no_script': 'Plik hex nie zawiera skyrptu Pythona.',
      'no_main': 'Hex plik nie zawiera main.py.',
      'cant_add_file': 'Plik nie mógł być dodany do systemu:',
      'module_added': 'Moduł "{{module_name}}" został dodany do systemu plików.',
      'module_out_of_space': 'Nie udało się dodać pliku do systemu bo nie ma dosyć miejsca.'
   },
   'help': {
      'docs-link': {
         'title': 'Zobacz dokumentację MicroPythona',
         'label': 'Dokumentacja'
      },
      'support-link': {
         'title': 'Znajć pomoc dla twojego micro:bit w nowym oknie',
         'label': 'Wsparcie'
      },
      'help-link': {
         'title': 'Otwórz pomoc dla tego edytora w nowym oknie',
         'label': 'Pomoc'
      },
      'issues-link': {
         'title': 'Zobacz otwarte problemy dla edytora Python w GitHub',
         'label': 'Lista problemow'
      },
      'feedback-link': {
         'title':'Prześlij nam swoją opinię o edytorze',
         'label':'Wyślij opinię'
      },
      'editor-ver': 'Wersja Edytora:',
      'mp-ver': 'Wersja MicroPythona:'
   },
   'confirms': {
      'quit': 'Niektóre z twoich zmian nie były zapisanę. Chcesz i tak zamknąć?',
      'blocks': 'Masz niezapisany kod. Użycie bloków zmieni twój kod. Możesz stracić zmiany. Czy chcesz kontynuować?',
      'replace_main': 'Dodanie pliku main.py zastąpi kod w edytorze!',
      'replace_file': 'Czy chcesz zastąpić plik "{{file_name}}"?',
      'replace_module': 'Czy chcesz zastąpić moduł "{{module_name}}"?',
      'download_py_multiple': 'Ten projekt zawiera wiele plików, które nie zostaną zapisane w tym formacie. \nZalecamy pobranie pliku Hex zawierającego cały projekt i załadowanie go z powrotem do edytora. \n\n Czy na pewno chcesz pobrać {{file_name}}?'
   },
   'code': {
      'start': '# Dodaj twój python kod tutaj.' +
         "from microbit import *\n\n\n" +
         "while True:\n" +
         "    display.scroll('Hello, World!')\n" +
         "    display.show(Image.HEART)\n" +
         "    sleep(2000)\n"
   },
   'webusb': {
      'err': {
         'update-req': 'Musisz <a target="_blank" href="https://support.microbit.org/support/solutions/articles/19000019131-how-to-upgrade-the-firmware-on-the-micro-bit">zaktualizuj oprogramowanie układowe micro: bit</a>, aby skorzystać z tej funkcji.',
         'clear-connect': 'Inny proces jest podłączony do tego urządzenia.<br> Zamknij wszystkie inne okna które mogą korzystać z WebUSB (np. MakeCode, Python Editor), lub odłącz i ponownie podłącz micro: bit przed ponowną próbą.',
         'reconnect-microbit': 'Please reconnect your micro:bit and try again.',
         'partial-flashing-disable': 'If the errors persist, try disabling Quick Flash in the beta options.',
         'device-disconnected': 'Device disconnected.',
         'unavailable': 'With WebUSB you can program your micro:bit and connect to the serial console directly from the online editor.<br/>Unfortunately, WebUSB is not supported in this browser. We recommend Chrome, or a Chrome-based browser to use WebUSB.',
         'find-more': 'Find Out More'
      },
      'close': 'Zamknij',
      'request-repl': 'Send CTRL-C for REPL',
      'request-serial': 'Send CTRL-D to reset',
      'flashing-text': 'Instalowanie na micro:bit',
      'download': 'Download hex'
   },
   'load': {
      'save-hex': 'Pobierz hex',
      'show-files': 'Pokaż pliki',
      'load-title': 'Załaduj/Zapisz',
      'instructions': 'Przeciągnij i upuść plik .hex lub .py tutaj, aby go otworzyć.',
      'submit': 'Załaduj',
      'save-title': 'Save',
      'save-py': 'Pobierz Scrypt Python',
      'fs-title': 'Pliki',
      'toggle-file': 'Lub wyszukaj plik.',
      'fs-add-file': 'Dodaj Plik',
      'hide-files': 'Ukryj pliki',
      'td-filename': 'Nazwa pliku',
      'td-size': 'Rozmiar',
      'fs-space-free': 'wolne',
      'remove-but': 'Usuń',
      'save-but': 'Zapisz'
   },
   'static-strings': {
      'buttons': {
         'command-download': {
            'title': 'Pobierz plik hex do flashowania na micro:bit',
            'label': 'Pobierz'
         },
         'command-disconnect': {
            'title': 'Odłącz od swojego micro:bit',
            'label': 'Odłącz'
         },
         'command-flash': {
            'title': 'Załaduj swój projekt bezpośrednio na micro:bit',
            'label': 'Zainstaluj'
         },
         'command-files': {
            'title': 'Załaduj/Zapisz pliki',
            'label': 'Załaduj/Zapisz'
         },
         'command-serial': {
            'title': 'Podłącz swój micro:bit przez serial',
            'label': 'Otwórz Serial',
            'title-close': 'Zamknij połączenie serial i wróć do edytora',
            'label-close': 'Zamknij Serial'
         },
         'command-connect': {
            'title': 'Podłącz do swojego micro: bit',
            'label': 'Podłącz'
         },
         'command-options': {
            'title': 'Zmień opcje editora',
            'label': 'Opcje'
         },
         'command-blockly': {
            'title': 'Stwórz kod używając blockly',
            'label': 'Blockly'
         },
         'command-snippet': {
            'title': 'Kliknij aby wybrać fragment (skrót kodu)',
            'label': 'Fragmenty'
         },
         'command-help': {
            'title': 'Odkryj pomocne strony',
            'label': 'Pomoc'
         },
         'command-language': {
            'title': 'Wybierz Język',
            'label': 'Język'
         },
         'command-share': {
            'title': 'Utwórz link, aby udostępnić swój kod',
            'label': 'Udostępnić'
         },
         'command-zoom-in': {
            'title': 'Powiększ'
         },
         'command-zoom-out': {
            'title': 'Pomniejsz'
         }
      },
      'script-name': {
         'label': 'Nazwa Skryptu'
      },
      'options-dropdown': {
         'autocomplete': 'Autocomplete',
         'on-enter': 'Na Enter:',
         'partial-flashing': 'Quick Flash',
         'lang-select': 'Wybierz Język:'
      },
      'text-editor': {
         'aria-label': 'Edytor tekstu'
       }
   }
};
