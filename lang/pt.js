var LANGUAGE = {
  "code_snippets": {
    "title": "Snippets de código",
    "description": "Snippets são pequenos blocos de código que podes reutilizar nos teus programas. Existem fragmentos para a maioria das coisas que vais querer fazer quando utilizares o MicroPython.",
    "instructions": "Seleciona um dos snippets de baixo para lançar o bloco de código.",
    "trigger_heading": "trigger",
    "description_heading": "descrição",
    "docs": "cria um comentário para descrever o teu código",
    "wh": "enquanto uma condição for Verdadeira, um determinado é lançado ininterruptamente em loop",
    "with": "faz alguma coisa com algo atribuído a um nome",
    "cl": "cria uma nova classe que define o comportamento de um novo tipo de objeto",
    "def": "define uma função com alguns argumentos, dá-lhe um nome e, opcionalmente, adiciona uma descrição",
    "if": "se uma condição é Verdadeira (True), algo acontece",
    "ei": "caso contrário, se uma outra condição for Verdadeira (True), faz alguma coisa",
    "el": "caso contrário, faz outra coisa",
    "for": "para cada item numa coleção de itens, algo acontece com cada um deles",
    "try": "tenta fazer algo e lidar com exceções (erros)"
  },
  "alerts": {
    "download": "O Safari tem um bug que faz com que o teu trabalho seja descarregado sem nome. Por favor dá um nome à tua escolha, sempre terminado em .hex. Como alternativa, sugerimos um navegador como o Firefox ou o Chrome. Estes browsers não dão este erro.",
    "save": "O Safari tem um bug que faz com que o teu trabalho seja descarregado sem nome. Por favor dá um nome à tua escolha, sempre terminado em .py. Como alternativa, sugerimos um navegador como o Firefox ou o Chrome. Estes browsers não dão este erro.",
    "load_code": "Oops! Não foi possível carregar o código no ficheiro hex.",
    "unrecognised_hex": "Desculpa, não conseguimos reconhecer este ficheiro",
    "snippets": "Os snippets estão desativados quando o blockly está ativado.",
    "error": "Erro:",
    "empty": "O ficheiro Python não tem nenhum conteúdo.",
    "no_python": "Não foi possível encontrar código Python válido no ficheiro hexadecimal.",
    "no_script": "O ficheiro Hex não contém nenhum script Python anexado.",
    "no_main": "O arquivo hexadecimal não contém um ficheiro main.py.",
    "cant_add_file": "Não foi possível adicionar o ficheiro no sistema de arquivos:",
    "module_added": "O módulo \"{{module_name}}\" foi adicionado ao sistema de ficheiros.",
    "module_out_of_space": "Não foi possível descarregar o ficheiro porque já não tens espaço no disco."
  },
  "help": {
    "docs-link": {
      "title": "Vê a documentação para MicroPython",
      "label": "Documentação"
    },
    "support-link": {
      "title": "Obtém apoio para o teu micro:bit numa nova aba",
      "label": "Apoio"
    },
    "help-link": {
      "title": "Abre a ajuda deste editor numa nova aba",
      "label": "Ajuda"
    },
    "issues-link": {
      "title": "Ver questões abertas para o editor Python no GitHub",
      "label": "Localizador de Problemas"
    },
    "feedback-link": {
      "title": "Envia-nos o teu feedback sobre o editor Python",
      "label": "Envia comentários"
    },
    "editor-ver": "Versão do editor:",
    "mp-ver": "Versão do MicroPython:"
  },
  "confirms": {
    "quit": "Algumas das tuas alterações não foram gravadas. Sair na mesma?",
    "blocks": "O teu código não está gravado. Usar blocos vai alterar o teu código. Podes perder as tuas alterações. Queres continuar?",
    "replace_main": "Adicionar um ficheiro main.py vai substituir o código no editor!",
    "replace_file": "Queres substituir o ficheiro \"{{file_name}}\"?",
    "replace_module": "Queres substituir o módulo \"{{module_name}}\"?",
    "download_py_multiple": "Este projeto contém múltiplos ficheiros que não vão ser guardados se usares este formato.\nRecomendamos que descarregues o ficheiro Hex que contém todo o projeto e que depois o carregues de volta para o editor.\n\n Tens a certeza que queres descarregar apenas o ficheiro {{file_name}}?"
  },
  "code": {
    "start": "Adiciona o teu código Python aqui. Por exemplo,"
  },
  "webusb": {
    "err": {
      "update-req": "Precisas de <a target=\"_blank\" href=\"https://microbit.org/firmware/\">atualizar o teu firmware micro:bit</a> para usar esta função.",
      "update-req-title": "Por favor, atualiza o firmware do micro:bit",
      "clear-connect": "Está a decorrer outro processo neste dispositivo. <br>Fecha qualquer outra aba que possa estar a usar WebUSB ( Por ex.: MakeCode, Editor Python) ou desliga e volta a ligar o micro:bit antes de tentar novamente.",
      "reconnect-microbit": "Por favor, volta a ligar o teu micro:bit e tenta novamente.",
      "partial-flashing-disable": "Se os erros persistirem, tenta desligar o Quick Flash nas opções beta.",
      "device-disconnected": "Dispositivo desligado.",
      "device-bootloader": "Please unplug the micro:bit and connect it again without pressing the reset button.<br>More info:",
      "device-bootloader-title": "micro:bit in MAINTENANCE mode",
      "timeout-error": "Não foi possível fazer ligação com o micro:bit.",
      "timeout-error-title": "Connection Timed Out",
      "unavailable": "Com WebUSB podes programar e ligar-te ao serial do teu micro:bit diretamente do editor online.<br/>Infelizmente, o WebUSB não funciona com este navegador. Recomendamos o uso do Chrome, ou de um navegador baseado no Chrome, para usar o WebUSB.",
      "find-more": "Descobre mais"
    },
    "troubleshoot": "Resolução de problemas",
    "close": "Fechar",
    "request-repl": "Carrega em CTRL-C para REPL",
    "request-serial": "Carrega em CTRL-D para reiniciar",
    "flashing-title": "A descarregar o MicroPython",
    "flashing-title-code": "A descarregar o código",
    "flashing-long-msg": "A primeira vez que descarregas o programa demora mais tempo que nas vezes seguintes.",
    "download": "Descarrega Hex"
  },
  "load": {
    "show-files": "Mostrar ficheiro",
    "load-title": "Carregar",
    "instructions": "Arrasta e larga o ficheiro .hex ou .py aqui para abri-lo.",
    "submit": "Carregar",
    "save-title": "Guardar",
    "save-hex": "Descarrega ficheiro Hex",
    "save-py": "Descarrega código Python",
    "fs-title": "Ficheiros",
    "toggle-file": "Ou procura ficheiro",
    "fs-add-file": "Adicionar ficheiro",
    "hide-files": "Esconder ficheiros",
    "td-filename": "Nome do ficheiro",
    "td-size": "Tamanho",
    "fs-space-free": "livre",
    "remove-but": "Remover",
    "save-but": "Guardar",
    "files-title": "Ficheiros do Projeto",
    "help-button": "Ficheiro de Ajuda",
    "file-help-text": "A área de Ficheiros do Projecto mostra os ficheiros incluidos no teu programa e permite-te adicionar ou remover módulos python externos ou outros ficheiros. Sabe mais aqui na",
    "help-link": "documentação de apoio do Editor Python",
    "invalid-file-title": "Tipo de ficheiro inválido",
    "mpy-warning": "Esta versão do Editor Python por enquanto não permite adicionar ficheiros .mpy",
    "extension-warning": "O Editor Python só permite carregar ficheiros com extensões .hex ou .py."
  },
  "languages": {
    "en": {
      "title": "Inglês"
    },
    "zh-CN": {
      "title": "Chinês (simplificado)"
    },
    "zh-HK": {
      "title": "Chinês (tradicional, Hong Kong)"
    },
    "zh-TW": {
      "title": "Chinês (tradicional, Taiwan)"
    },
    "hr": {
      "title": "Croata"
    },
    "pl": {
      "title": "Polaco"
    },
    "es": {
      "title": "Castelhano"
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
        "title": "Descarrega ficheiro hex para instalar no micro:bit",
        "label": "Descarregar"
      },
      "command-disconnect": {
        "title": "Desligar do micro:bit",
        "label": "Desligar"
      },
      "command-flash": {
        "title": "Carregar o projeto diretamente para o micro:bit",
        "label": "Flash"
      },
      "command-files": {
        "title": "Carregar/Guardar ficheiros",
        "label": "Carregar/Guardar"
      },
      "command-serial": {
        "title": "Ligar o micro:bit via serial",
        "label": "Abrir Serial",
        "title-close": "Fechar a ligação serial e volta para o editor",
        "label-close": "Fechar serial"
      },
      "command-connect": {
        "title": "Conectar ao micro:bit",
        "label": "Ligar"
      },
      "command-connecting": {
        "title": "A ligar ao micro:bit",
        "label": "A ligar"
      },
      "command-options": {
        "title": "Altera as definições do editor",
        "label": "Opções Beta"
      },
      "command-blockly": {
        "title": "Clica para criar código com blockly",
        "label": "Blockly"
      },
      "command-snippet": {
        "title": "Clica para escolher um snippet (atalho para código)",
        "label": "Snippets"
      },
      "command-help": {
        "title": "Descobre funcionalidades úteis",
        "label": "Ajuda"
      },
      "command-language": {
        "title": "Seleciona um idioma",
        "label": "Idioma"
      },
      "command-zoom-in": {
        "title": "Ampliar"
      },
      "command-zoom-out": {
        "title": "Reduzir"
      }
    },
    "script-name": {
      "label": "Nome do código"
    },
    "options-dropdown": {
      "autocomplete": "Autocompletar",
      "on-enter": "Ao carregar no Enter",
      "partial-flashing": "Flash Rápido",
      "lang-select": "Seciona Idioma:",
      "add-language-link": "Adiciona um idioma"
    },
    "text-editor": {
      "aria-label": "editor de texto"
    }
  }
};
