var LANGUAGE = {
  "code_snippets": {
    "title": "Extraits de code",
    "description": "Les extraits de code sont de courts blocs de code à réutiliser dans vos propres programmes. Il existe des extraits pour la plupart des tâches courantes que vous voudrez faire à l'aide de MicroPython.",
    "instructions": "Sélectionnez un des extraits ci-dessous pour injecter le bloc de code.",
    "trigger_heading": "déclencheur",
    "description_heading": "Description",
    "docs": "créer un commentaire pour décrire votre code",
    "wh": "tant que certaines conditions sont vraies, continuez à boucler sur un code",
    "with": "faire quelque chose avec la valeur assignée à un nom",
    "cl": "créer une nouvelle classe qui définit le comportement d'un nouveau type d'objet",
    "def": "définir une fonction nommée qui prend quelques arguments et éventuellement ajouter une description",
    "if": "si une condition est vraie, faire quelque chose",
    "ei": "sinon si une autre condition est True, faire quelque chose",
    "el": "sinon faire autre chose",
    "for": "pour chaque élément d'une collection d'éléments faire quelque chose avec chaque élément",
    "try": "essayez de faire quelque chose et de gérer les exceptions (erreurs)"
  },
  "alerts": {
    "download": "Safari présente un défaut qui fera que votre travail sera téléchargé comme un fichier sans nom, merci de le renommer en ajoutant à la fin l'extension .hex. Sinon, utilisez un autre navigateur comme Firefox ou Chrome qui ne présentent pas ce défaut.",
    "save": "Safari présente un défaut qui fera que votre travail sera téléchargé comme un fichier sans nom, merci de le renommer en ajoutant à la fin l'extension .py. Sinon, utilisez un autre navigateur comme Firefox ou Chrome qui ne présentent pas ce défaut.",
    "load_code": "Oups ! Impossible de charger le code dans le fichier hexadécimal.",
    "unrecognised_hex": "Désolé, nous n'avons pas pu reconnaître ce fichier",
    "snippets": "Les extraits de texte sont désactivés lorsque le blockly est activé.",
    "error": "Erreur :",
    "empty": "Le fichier Python n'a pas de contenu.",
    "no_python": "Impossible de trouver du code Python valide dans le fichier hexadécimal.",
    "no_script": "Le fichier .hex ne contient pas de script Python attaché.",
    "no_main": "Le fichier hexadécimal ne contient pas de fichier main.py.",
    "cant_add_file": "Impossible d'ajouter le fichier au système de fichiers :",
    "module_added": "Le module \"{{module_name}}\" a été ajouté au système de fichiers.",
    "module_out_of_space": "Impossible d'ajouter le fichier au système car il n'y a plus d'espace de stockage libre."
  },
  "help": {
    "docs-link": {
      "title": "Voir la documentation de MicroPython",
      "label": "Documentation"
    },
    "support-link": {
      "title": "Obtenez de l'aide pour votre micro:bit dans un nouvel onglet",
      "label": "Aide"
    },
    "help-link": {
      "title": "Ouvrir l'aide pour cet éditeur dans un nouvel onglet",
      "label": "Aide"
    },
    "issues-link": {
      "title": "Voir les tickets ouverts pour l'éditeur Python dans GitHub",
      "label": "Suivi de l'incident"
    },
    "feedback-link": {
      "title": "Envoyez-nous vos commentaires à propos de l'éditeur Python",
      "label": "Envoyer un commentaire"
    },
    "editor-ver": "Version de l'éditeur :",
    "mp-ver": "Version de MicroPython :"
  },
  "confirms": {
    "quit": "Certaines de vos modifications n'ont pas été enregistrées. Quitter quand même ?",
    "blocks": "Vous avez du code non enregistré. Utiliser des blocs va changer votre code. Vous pouvez perdre vos modifications. Voulez-vous continuer ?",
    "replace_main": "Ajouter un fichier main.py remplacera le code dans l'éditeur !",
    "replace_file": "Voulez-vous remplacer le fichier \"{{file_name}}\" ?",
    "replace_module": "Voulez-vous remplacer le module \"{{module_name}}\" ?",
    "download_py_multiple": "Ce projet contient plusieurs fichiers qui ne seront pas enregistrés en utilisant ce format.\nNous vous recommandons de télécharger le fichier Hex, qui contient l'ensemble de votre projet et peut être rechargé dans l'éditeur.\n\n Êtes-vous sûr de vouloir télécharger le fichier {{file_name}} uniquement ?"
  },
  "code": {
    "start": "Ajoutez votre code Python ici, par exemple :"
  },
  "webusb": {
    "err": {
      "update-req": "Vous devez <a target=\"_blank\" href=\"https://microbit.org/firmware/\">mettre à jour le firmware de votre carte micro:bit</a> pour utiliser cette fonctionnalité.",
      "update-req-title": "Veuillez mettre à jour le firmware du micro:bit",
      "clear-connect": "Un autre processus est connecté à cet appareil.<br>Fermez tous les autres onglets qui peuvent utiliser WebUSB (e. . MakeCode, éditeur Python), ou débranchez et rebranchez le micro:bit avant de réessayer.",
      "reconnect-microbit": "Veuillez reconnecter votre micro:bit et réessayer.",
      "partial-flashing-disable": "Si les erreurs persistent, essayez de désactiver Quick Flash dans les options bêta.",
      "device-disconnected": "Appareil déconnecté.",
      "device-bootloader": "Please unplug the micro:bit and connect it again without pressing the reset button.<br>More info:",
      "device-bootloader-title": "micro:bit in MAINTENANCE mode",
      "timeout-error": "Impossible de se connecter au micro:bit",
      "timeout-error-title": "Connection Timed Out",
      "unavailable": "Avec WebUSB, vous pouvez programmer votre micro:bit et vous connecter à la console série directement à partir de l'éditeur en ligne.<br/>Malheureusement, WebUSB n'est pas pris en charge dans ce navigateur. Nous recommandons Chrome, ou à un navigateur basé sur Chrome pour utiliser WebUSB.",
      "find-more": "En savoir plus"
    },
    "troubleshoot": "Dépanner",
    "close": "Fermer",
    "request-repl": "Envoyer CTRL-C pour REPL",
    "request-serial": "Envoyer CTRL-D pour réinitialiser",
    "flashing-title": "Téléversement de MicroPython",
    "flashing-title-code": "Téléversement du code",
    "flashing-long-msg": "Le premier téléversement peut être long, les suivants seront plus rapides.",
    "download": "Télécharger le fichier Hex"
  },
  "load": {
    "show-files": "Afficher les fichiers",
    "load-title": "Charger",
    "instructions": "Glissez et déposez un fichier .hex ou .py ici pour l'ouvrir.",
    "submit": "Charger",
    "save-title": "Enregistrer",
    "save-hex": "Télécharger le projet Hex",
    "save-py": "Télécharger le script Python",
    "fs-title": "Fichiers",
    "toggle-file": "Ou parcourir un fichier.",
    "fs-add-file": "Ajouter un fichier",
    "hide-files": "Cacher les fichiers",
    "td-filename": "Nom du fichier",
    "td-size": "Taille",
    "fs-space-free": "libre",
    "remove-but": "Supprimer",
    "save-but": "Enregistrer",
    "files-title": "Fichiers du projet",
    "help-button": "Aide sur les fichiers",
    "file-help-text": "La zone Fichiers du projet vous montre les fichiers inclus dans votre programme et vous permet d'ajouter ou de supprimer des modules python externes et d'autres fichiers. En savoir plus dans le ",
    "help-link": "Documentation d'aide à l'éditeur Python",
    "invalid-file-title": "Type de fichier incorrect",
    "mpy-warning": "Cette version de l'éditeur Python ne supporte pas actuellement l'ajout de fichiers .mpy.",
    "extension-warning": "L'éditeur Python ne peut charger que des fichiers avec les extensions .hex ou .py."
  },
  "languages": {
    "en": {
      "title": "Français"
    },
    "zh-CN": {
      "title": "Chinois (simplifié)"
    },
    "zh-HK": {
      "title": "Chinois (traditionnel, Hong Kong)"
    },
    "zh-TW": {
      "title": "Chinois (traditionnel, Taiwan)"
    },
    "hr": {
      "title": "Croate"
    },
    "pl": {
      "title": "Polonais"
    },
    "es": {
      "title": "Espagnol"
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
        "title": "Télécharger le fichier hex pour le charger dans la micro:bit",
        "label": "Télécharger"
      },
      "command-disconnect": {
        "title": "Se déconnecter du micro:bit",
        "label": "Se déconnecter"
      },
      "command-flash": {
        "title": "Téléchargez le projet directement vers le micro:bit",
        "label": "Flash"
      },
      "command-files": {
        "title": "Charger/Enregistrer les fichiers",
        "label": "Ouvrir/Enregistrer"
      },
      "command-serial": {
        "title": "Connecter le micro:bit via le port série",
        "label": "Ouvrir la connexion série",
        "title-close": "Fermer la connexion série et retourner à l'éditeur",
        "label-close": "Fermer le port série"
      },
      "command-connect": {
        "title": "Se connecter au micro:bit",
        "label": "Se connecter"
      },
      "command-connecting": {
        "title": "Connexion au micro:bit",
        "label": "Connexion en cours"
      },
      "command-options": {
        "title": "Modifier les paramètres de l'éditeur",
        "label": "Options bêta"
      },
      "command-blockly": {
        "title": "Cliquez pour créer du code avec blockly",
        "label": "Blockly"
      },
      "command-snippet": {
        "title": "Cliquer pour sélectionner un snippet (extraits de code)",
        "label": "Extraits de code"
      },
      "command-help": {
        "title": "Découvrez des ressources utiles",
        "label": "Aide"
      },
      "command-language": {
        "title": "Choisir une langue",
        "label": "Langue"
      },
      "command-zoom-in": {
        "title": "Agrandir"
      },
      "command-zoom-out": {
        "title": "Réduire"
      }
    },
    "script-name": {
      "label": "Nom du script"
    },
    "options-dropdown": {
      "autocomplete": "Auto-complétion",
      "on-enter": "Sur Entrée",
      "partial-flashing": "Flash rapide",
      "lang-select": "Choisir la langue :",
      "add-language-link": "Ajouter une langue"
    },
    "text-editor": {
      "aria-label": "Éditeur de texte"
    }
  }
};
