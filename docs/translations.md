# 🐍 🌍 🚀Translation Release Strategy
Thanks for your interest in translating the micro:bit Python Editor. Translations for all the Micro:bit Educational Foundation’s editors and apps are contributed by an amazing team of volunteers and we’d love for you to be a part of this too. 

This document sets out the strategy and process for how the Foundation manages the translation of the Python Editor.

## 1. Translation and Management in the Python Editor

Translation is the act of taking the written materials in one language and converting them into another language in the most meaningful way possible. In terms of the micro:bit Python Editor, translation happens on the [strings marked for translation in the projects' codebase](https://github.com/bbcmicrobit/PythonEditor/lang/en.js). The default language of the editor is English and you may select another available language using the Globe icon in the menu.

### 1.1 Crowdin
The Micro:bit Educational Foundation makes use of the [Crowdin platform](https://crowdin.com/project/microbitorg) to manage and support community translations for our web projects. We have an amazing team of volunteer translators and proofreaders in our global micro:bit community and Crowdin helps us support them through the process. There is some more information on how this works at [microbit.org/translate](https://microbit.org/translate/)

### 1.2 Translating the editor
We encourage translators to use [Crowdin](https://crowdin.com/project/microbitorg) as it has a rigorous process for translation, proofreading and syncronisation and the Foundation use it to communicate and help guide the translation community. It also makes it easy for lots of people to contribute to the translation process, rather than one person being responsible for a language.

In the microbit.org project, you’ll find a [folder titled apps that contains a sub folder for the Python Editor.](https://crowdin.com/project/microbitorg/ar#/new/apps/python-editor) This folder contains the current English language translation **en.json** file with the strings required for translation. Selecting this file opens the Crowdin editor where you can submit your own or use a suggested translation for the string. It will then need to be [verified by a proofreader for that language.](https://support.crowdin.com/online-editor/#proofreadingvoting-mode)

### 1.3 Syncing Translations
Crowdin can perform a sync between itself and Github, meaning that we can pass language updates either way. This is currently triggered manually.  When a new release of the editor is made, any updates to the strings in en.js will be uploaded to Crowdin and translators are notified that translation strings have changed.

### 1.4 Requesting a language
There are two cases in which you may want to request a language:
a) If you do not see the language available in the editor, but it is enabled in the [Crowdin project](https://crowdin.com/project/microbitorg)
b) If you do not see the language available in the editor or the Crowdin project
In either case please [get in touch with the Foundation](https://support.microbit.org/en/support/tickets/new) to ask if it can be made available.

### 1.5 Available languages
The Foundation strives to make our online offerings as accessible as possible and new translations to the Crowdin project are always welcome. To ensure a consistent experience for users, we need to ensure that any languages we make available for translation are suitably maintained. Enabled languages can be found in the Crowdin project. For the Python Editor, we expect the **source strings to be 100% translated and proofread** before they are made public as a released language.

## 2. Release cycle

### 2.1 Releases and freezes
At a predefined time during the release cycle there will be a "string freeze”, which means that after this point strings marked for translation in the codebase can no longer be changed except in the case of critical-priority bugs.

For the Python Editor this will be at the Release Candidate (RC) stage. The current version can be found by selecting the help menu in the editor. If you see the string `rc1` or similar in the version number, this can be considered an RC candidate.

Translators will be notified via the Crowdin messaging platform when the string freeze will occur, but will still have the majority of time during the [beta testing programme period](https://microbit.org/testing/) to make changes. 

Once the string freeze is in effect, the translation files in Github and Crowdin can be assumed to be static. This is not to say that translation can't happen all the time, but during the development process strings may change and translation efforts may end up being wasted. 

### 2.2 Stable releases and backports
There two main stable release branches of the editor can be found at:

[python.microbit.org](http://python.microbit.org)  - which contains available languages that have been translated.
[python.microbit.org/v/beta](http://python.microbit.org/v/beta) - which contains available languages that have been translated and any proposed available languages. It may be the case that the beta editor is updated with new languages and strings more often than the live editor as we test out new languages.

At present, changes to translations will not be backported to legacy stable release branches, for example python.microbit.org/v/0. Doing so would require maintaining wholly separate copies of each set of translations and massively increases the burden on translators. Previous releases will have translations frozen at the time they are released.

## 3. Translation infrastructure CI and automation

We are currently using a manually triggered script to convert the JS object to JSON via Crowdin. There is another script to do this in reverse. This is currently manageable as we are only translating one file. It may be the case that we add further configuration to do this in [CI.](https://en.wikipedia.org/wiki/Continuous_integration).

### 3.1 Updating translations
This process requires:
- the [Crowdin CLI](https://support.crowdin.com/cli-tool/) installed locally in order to run
- 'Manager' level permissions in the microbitorg Crowdin project.
- API Key from https://crowdin.com/project/microbitorg/settings#api

The `lang` folder in the Python Editor contains the source `en.js` and any other translated files identified by their two-letter country code. The `crowdin.yml` file is configured to export/import translations from the `apps/python-editor/` folder in the `new` branch of our microbitorg project https://crowdin.com/project/microbitorg/settings#files

The Crowdin project contains a pre-processor that handles the conversion from js > JSON and back again.

Our process is to round trip the translation to and from Crowdin as the **last step prior to merging a PR** that contains translated text.

To export/import translations from Crowdin:

1. Save the project ID and generate and save a personal API token as a variable to be used by the Crowdin CLI

`export CROWDIN_PROJECT_ID=<Project ID from Crowdin>`
`export CROWDIN_PERSONAL_TOKEN=<Personal API token from Crowdin>`

2. Push an update to `en.js`

`crowdin upload sources -b new` where `new` is the branch we are using

3. Pull translated updates eg to `lang/es.js` for Spanish

`crowdin download -l es-ES -b new` where es-ES is the country code

## 4. Help

Further information about translation processes managed by the Foundation can be found on the [translate page of the micro:bit website.](https://microbit.org/translate/) If you come across an issue with the translation, you can suggest a change in Crowdin or [open an issue with micro:bit support.](https://support.microbit.org/en/support/tickets/new)

This work, "TRANSLATIONS.MD", is a derivative of "[wiki.openstack.org/wiki/Translations](https://wiki.openstack.org/wiki/Translations#String_Freeze)” by [OpenStack](https://openstack.org), used under [CC BY](https://creativecommons.org/licenses/by/2.0/). "TRANSLATIONS.MD" is licensed under [CC BY](https://creativecommons.org/licenses/by/2.0/) by the Micro:Bit Educational Foundation.
