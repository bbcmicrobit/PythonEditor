var LANGUAGE = {
  "code_snippets": {
    "title": "Snippets",
    "description": "Snippets são pequenos blocos de código para reutilização nos seus próprios programas. Existem snippets para as coisas mais comuns que você vai querer fazer usando o MicroPython.",
    "instructions": "Selecione um dos snippets abaixo para inserir o bloco de código. ",
    "trigger_heading": "gatilho",
    "description_heading": "descrição",
    "docs": "crie um comentário para descrever seu código",
    "wh": "enquanto alguma condição for verdadeira, continuar repetindo algum código",
    "with": "faça algumas coisas com algo atribuído a um nome",
    "cl": "criar uma nova classe que define o comportamento de um novo tipo de objeto",
    "def": "define uma função nomeada que recebe alguns argumentos e, opcionalmente, adiciona uma descrição",
    "if": "se alguma condição for verdadeira, fazer algo",
    "ei": "caso contrário, se alguma outra condição for verdadeira, faça algo",
    "el": "Caso contrário, faça alguma outra coisa",
    "for": "para cada item em uma coleção de itens fazer algo com cada item",
    "try": "tente fazer algo e lide com exceções (erros)"
  },
  "alerts": {
    "download": "O Safari tem um bug que significa que seu trabalho será baixado como um arquivo não nomeado. Por favor, renomeie-o para algo terminando em .hex. Como alternativa, use um navegador como Firefox ou Chrome. Eles não sofrem com esse erro.",
    "save": "O Safari tem um bug que significa que seu trabalho será baixado como um arquivo não nomeado. Por favor, renomeie-o para algo terminando em .py. Alternativamente, use um navegador como Firefox ou Chrome. Eles não sofrem com esse erro.",
    "load_code": "Opa! Não foi possível carregar o código no arquivo hex",
    "unrecognised_hex": "Desculpe, não conseguimos reconhecer este arquivo",
    "snippets": "Snippets são desativados quando blockly está ativado.",
    "error": "Erro:",
    "empty": "O arquivo Python não tem nenhum conteúdo.",
    "no_python": "Não foi possível encontrar código Python válido no arquivo hex",
    "no_script": "Hex file does not contain an appended Python script.",
    "no_main": "O arquivo hex não contém um arquivo main.py.",
    "cant_add_file": "Não foi possível adicionar o arquivo ao sistema de arquivos:",
    "module_added": "O módulo \"{{module_name}}\" foi adicionado ao sistema de arquivos.",
    "module_out_of_space": "Não foi possível adicionar o arquivo ao sistema, pois não há mais espaço de armazenamento."
  },
  "help": {
    "docs-link": {
      "title": "Ver a documentação para MicroPython",
      "label": "Documentação"
    },
    "support-link": {
      "title": "Obtenha suporte para seu micro:bit em uma nova aba",
      "label": "Suporte"
    },
    "help-link": {
      "title": "Abrir a ajuda deste editor em uma nova aba",
      "label": "Ajuda"
    },
    "issues-link": {
      "title": "Visualizar questões abertas para o Editor Python no GitHub",
      "label": "Rastreador de problemas"
    },
    "feedback-link": {
      "title": "Envie-nos seu feedback sobre o Editor de Python",
      "label": "Enviar Feedback"
    },
    "editor-ver": "Versão do Editor:",
    "mp-ver": "Versão MicroPython:"
  },
  "confirms": {
    "quit": "Algumas das suas alterações não foram salvas. Sair mesmo assim?",
    "blocks": "Você tem código não salvo. Usar blocos vai mudar o seu código. Você pode perder as suas alterações. Você deseja continuar?",
    "replace_main": "Adicionar um arquivo main.py substituirá o código no editor!",
    "replace_file": "Deseja substituir o arquivo \"{{file_name}}\"?",
    "replace_module": "Deseja substituir o arquivo \"{{module_name}}\"?",
    "download_py_multiple": "Este projeto contém vários arquivos que não serão salvos usando este formato.\nRecomendamos baixar o arquivo Hex que contém todo o seu projeto e pode ser carregado de volta ao editor.\n\n Tem certeza de que deseja baixar apenas o arquivo {{file_name}}?"
  },
  "code": {
    "start": "Adicione seu código Python aqui. Por exemplo,"
  },
  "webusb": {
    "err": {
      "update-req": "You need to <a target=\"_blank\" href=\"https://microbit.org/firmware/\">update your micro:bit firmware</a> to make use of this feature.",
      "update-req-title": "Please update the micro:bit firmware",
      "clear-connect": "Outro processo está conectado a este dispositivo.<br>Feche quaisquer outras abas que possam estar usando WebUSB (e. . MakeCode, Editor Python) ou desconecte e reconecte o micro:bit antes de tentar novamente.",
      "reconnect-microbit": "Por favor, reconecte seu micro:bit e tente novamente.",
      "partial-flashing-disable": "Se os erros persistirem, tente desabilitar o Flash Rápido nas opções beta.",
      "device-disconnected": "Dispositivo desconectado",
      "device-bootloader": "Please unplug the micro:bit and connect it again without pressing the reset button.<br>More info:",
      "device-bootloader-title": "micro:bit in MAINTENANCE mode",
      "timeout-error": "Não foi possível conectar ao micro:bit",
      "timeout-error-title": "Connection Timed Out",
      "unavailable": "Com WebUSB você pode programar seu micro:bit e se conectar ao console serial diretamente do editor online.<br/>Infelizmente, o WebUSB não é suportado neste navegador. Recomendamos o Chrome, ou um navegador Chrome, para usar o WebUSB.",
      "find-more": "Saiba mais"
    },
    "troubleshoot": "Solução",
    "close": "Fechar",
    "request-repl": "Enviar CTRL-C para REPL",
    "request-serial": "Enviar CTRL-D para redefinir",
    "flashing-title": "Flashing MicroPython",
    "flashing-title-code": "Flashing code",
    "flashing-long-msg": "Initial flash might take longer, subsequent flashes will be quicker.",
    "download": "Baixar HEX"
  },
  "load": {
    "show-files": "Mostrar Arquivos",
    "load-title": "Carregar",
    "instructions": "Arraste e solte um arquivo .hex ou .py aqui para abri-lo.",
    "submit": "Carregar",
    "save-title": "Salvar",
    "save-hex": "Baixar Projeto Hex",
    "save-py": "Baixar Python Script",
    "fs-title": "Arquivos",
    "toggle-file": "Ou procure um arquivo.",
    "fs-add-file": "Adicionar arquivo",
    "hide-files": "Ocultar arquivos",
    "td-filename": "Nome do arquivo",
    "td-size": "Tamanho",
    "fs-space-free": "grátis",
    "remove-but": "Remover",
    "save-but": "Salvar",
    "files-title": "Arquivos de Projeto",
    "help-button": "Arquivos de Ajuda",
    "file-help-text": "A área de Arquivos de Projeto mostra os arquivos incluídos no seu programa e permite adicionar ou remover módulos externos de python e outros arquivos. Saiba mais no ",
    "help-link": "Documentação de ajuda do Editor Python",
    "invalid-file-title": "Tipo de arquivo inválido",
    "mpy-warning": "Esta versão do Editor Python não suporta atualmente a adição de arquivos .mpy.",
    "extension-warning": "O Editor Python só pode carregar arquivos com as extensões .hex ou .py."
  },
  "languages": {
    "en": {
      "title": "Inglês"
    },
    "zh-CN": {
      "title": "Chinês (Simplificado)"
    },
    "zh-HK": {
      "title": "Chinês (Tradicional, Hong Kong)"
    },
    "zh-TW": {
      "title": "Chinês (Tradicional, Taiwan)"
    },
    "hr": {
      "title": "croata"
    },
    "pl": {
      "title": "Polonês"
    },
    "es": {
      "title": "Espanhol"
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
        "title": "Baixe um arquivo hex para instalar o micro:bit",
        "label": "Baixar"
      },
      "command-disconnect": {
        "title": "Desconectar do micro:bit",
        "label": "Desconectar"
      },
      "command-flash": {
        "title": "Carregue o projeto diretamente para o micro:bit",
        "label": "Piscar"
      },
      "command-files": {
        "title": "Carregar/Salvar arquivos",
        "label": "Carregar/Salvar"
      },
      "command-serial": {
        "title": "Conecte o micro:bit via serial",
        "label": "Abrir Serial",
        "title-close": "Feche a conexão serial e volte para o editor",
        "label-close": "Fechar serial"
      },
      "command-connect": {
        "title": "Conectar ao micro:bit",
        "label": "Conectar"
      },
      "command-connecting": {
        "title": "Conectando-se ao micro:bit",
        "label": "Conectando"
      },
      "command-options": {
        "title": "Alterar as configurações do editor",
        "label": "Opções Beta"
      },
      "command-blockly": {
        "title": "Clique para criar código com blockly",
        "label": "Blockly"
      },
      "command-snippet": {
        "title": "Clique para selecionar um snippet (atalho de código)",
        "label": "Snippets"
      },
      "command-help": {
        "title": "Descubra recursos úteis",
        "label": "Ajuda"
      },
      "command-language": {
        "title": "Selecione um idioma",
        "label": "Idioma"
      },
      "command-zoom-in": {
        "title": "Aumentar zoom"
      },
      "command-zoom-out": {
        "title": "Diminuir zoom"
      }
    },
    "script-name": {
      "label": "Nome do script"
    },
    "options-dropdown": {
      "autocomplete": "Autocompletar",
      "on-enter": "Ao entrar",
      "partial-flashing": "Flash Rápido",
      "lang-select": "Selecione o Idioma:",
      "add-language-link": "Adicionar um idioma"
    },
    "text-editor": {
      "aria-label": "editor de texto"
    }
  }
};
