var LANGUAGE = {
  "code_snippets": {
    "title": "代碼段",
    "description": "程式碼片段是在您自己的程序中重複使用的短代碼塊，這是使用MicroPython時最常見的一些程式碼片段。",
    "instructions": "選擇下面的程式碼片段之一插入到代碼。",
    "trigger_heading": "觸發",
    "description_heading": "説明",
    "docs": "創建一個註釋來描述您的代碼",
    "wh": "當某些條件為真時，繼續循環某些代碼",
    "with": "完成一些與名字有關的功能",
    "cl": "創建定義對象行為的新類",
    "def": "定義一個帶有參數的命名函數，並可選添加描述",
    "if": "如果某些條件為真，執行功能",
    "ei": "否則如果其他條件為真，就執行功能",
    "el": "否則就執行功能",
    "for": "使用集合中的每個項目執行某些操作",
    "try": "嘗試執行某些操作並處理異常（錯誤）"
  },
  "alerts": {
    "download": "Safari存在一個錯誤，這意味着您的程序將作為一個未命名的檔案下載，請將其重命名為以.py結尾的檔案，或者使用Firefox或Chrome等瀏覽器，它們沒有這個錯誤。",
    "save": "Safari存在一個錯誤，這意味着您的程序將作為一個未命名的檔案下載，請將其重命名為以.hex結尾的檔案，或者使用Firefox或Chrome等瀏覽器，它們沒有這個錯誤。",
    "load_code": "哎呀！ 無法將代碼載入到十六進位檔案中。",
    "unrecognised_hex": "抱歉，我們無法識別這個檔案",
    "snippets": "啟用blockly時將禁用程式碼片段。",
    "error": "錯誤：",
    "empty": "Python 檔案沒有任何內容。",
    "no_python": "在hex檔案中找不到有效的Python代碼。",
    "no_script": "Hex file does not contain an appended Python script.",
    "no_main": "Hex 檔案沒有包含 main.py 檔案。",
    "cant_add_file": "不能添加檔案到檔案系統：",
    "module_added": "\"{{module_name}}\" 模塊已添加到檔案系統。",
    "module_out_of_space": "無法將檔案添加到系統，因為沒有剩餘的存儲空間。"
  },
  "help": {
    "docs-link": {
      "title": "查看 MicroPython 文檔",
      "label": "文檔"
    },
    "support-link": {
      "title": "在新標籤中得到 micro:bit 技術支持",
      "label": "技術支持"
    },
    "help-link": {
      "title": "在新標籤中打開編輯器的幫助",
      "label": "幫助"
    },
    "issues-link": {
      "title": "在GitHub中查看 Python Editor 的未解決問題",
      "label": "問題跟蹤"
    },
    "feedback-link": {
      "title": "給我們發送關於 Python Editor 的反饋",
      "label": "發送反饋"
    },
    "editor-ver": "編輯器版本：",
    "mp-ver": "MicroPython 版本："
  },
  "confirms": {
    "quit": "某些更改尚未保存。仍然退出嗎?",
    "blocks": "您有未保存的代碼。使用積木編程將更改代碼。您可能會丟失更改。你想繼續嗎?",
    "replace_main": "添加main.py檔案將替換編輯器中的代碼！",
    "replace_file": "替換 \"{{file_name}}\" 檔案嗎？",
    "replace_module": "替換 \"{{module_name}}\" 模塊嗎？",
    "download_py_multiple": "此項目包含多個將不使用此格式保存的檔案。\n\n推薦下載 Hex 檔案, 它將包含整個項目並能夠重新載入到編輯器中。\n\n 是否確認只下載檔案 {{file_name}} ？"
  },
  "code": {
    "start": "在此處添加 Python 代碼。例如："
  },
  "webusb": {
    "err": {
      "update-req": "You need to <a target=\"_blank\" href=\"https://microbit.org/firmware/\">update your micro:bit firmware</a> to make use of this feature.",
      "update-req-title": "Please update the micro:bit firmware",
      "clear-connect": "另一個進程已連接到這個設備。<br>關閉其它可能使用 WebUSB 的標籤（如 MakeCode、Python Editor），或者拔掉 micro:bit 插頭再重新插上。",
      "reconnect-microbit": "請重新連接 micro:bit 然後再次嘗試。",
      "partial-flashing-disable": "如果錯誤仍然存在，請嘗試禁用beta選項中的快速下載。",
      "device-disconnected": "設備已斷開。",
      "device-bootloader": "Please unplug the micro:bit and connect it again without pressing the reset button.<br>More info:",
      "device-bootloader-title": "micro:bit in MAINTENANCE mode",
      "timeout-error": "不能連接到 micro:bit",
      "timeout-error-title": "Connection Timed Out",
      "unavailable": "使用 WebUSB 可以從編輯器中直接給 micro:bit 編程並連接到串口控制枱。<br/>不幸的是，這個瀏覽器不支持 WebUSB。推薦使用 Chrome, 或 Chrome 內核的瀏覽器。",
      "find-more": "瞭解更多"
    },
    "troubleshoot": "故障排除",
    "close": "關閉",
    "request-repl": "發送 CTRL-C 到 REPL",
    "request-serial": "發送 CTRL-D 以復位",
    "flashing-title": "Flashing MicroPython",
    "flashing-title-code": "Flashing code",
    "flashing-long-msg": "Initial flash might take longer, subsequent flashes will be quicker.",
    "download": "下載 Hex"
  },
  "load": {
    "show-files": "顯示檔案",
    "load-title": "載入",
    "instructions": "拖放一個 .hex 或 .py 檔案到這裏載入它。",
    "submit": "載入",
    "save-title": "保存",
    "save-hex": "下載項目 Hex",
    "save-py": "下載 Python 腳本",
    "fs-title": "檔案",
    "toggle-file": "或瀏覽檔案。",
    "fs-add-file": "添加檔案",
    "hide-files": "隱藏檔案",
    "td-filename": "檔案名",
    "td-size": "大小",
    "fs-space-free": "剩餘",
    "remove-but": "刪除",
    "save-but": "保存",
    "files-title": "項目檔案",
    "help-button": "檔案幫助",
    "file-help-text": "項目檔案區域顯示程序中包含的檔案, 並允許您添加或刪除外部python模塊和其他檔案. 瞭解更多在 ",
    "help-link": "在 Python Editor 幫助文檔中",
    "invalid-file-title": "無效的檔案類型",
    "mpy-warning": "這個版本的 Python Editor 不支持添加 .mpy 檔案。",
    "extension-warning": "Python Editor 只能載入 .hex 或 .py 檔案。"
  },
  "languages": {
    "en": {
      "title": "英文"
    },
    "zh-CN": {
      "title": "中文（簡體）"
    },
    "zh-HK": {
      "title": "中文 (繁體，香港)"
    },
    "zh-TW": {
      "title": "中文（繁體，台灣）"
    },
    "hr": {
      "title": "克羅地亞語"
    },
    "pl": {
      "title": "波蘭語"
    },
    "es": {
      "title": "西班牙語"
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
        "title": "下載一個 hex 檔案到 micro:bit",
        "label": "下載"
      },
      "command-disconnect": {
        "title": "斷開 micro:bit 連接",
        "label": "斷開連接"
      },
      "command-flash": {
        "title": "直接下載項目到 micro:bit",
        "label": "下載"
      },
      "command-files": {
        "title": "載入/保存檔案",
        "label": "載入/保存"
      },
      "command-serial": {
        "title": "通過串口連接 micro:bit",
        "label": "打開串口",
        "title-close": "關閉串口連接並返回到編輯器",
        "label-close": "關閉串口"
      },
      "command-connect": {
        "title": "連接到 micro:bit",
        "label": "連接"
      },
      "command-connecting": {
        "title": "正在連接到 micro:bit",
        "label": "正在連接"
      },
      "command-options": {
        "title": "修改編輯器設置",
        "label": "Beta 選項"
      },
      "command-blockly": {
        "title": "單擊使用 blockly 創建程序",
        "label": "程式碼片段"
      },
      "command-snippet": {
        "title": "單擊以選擇代碼段（代碼快捷方式）",
        "label": "片段"
      },
      "command-help": {
        "title": "發現有用的資源",
        "label": "幫助"
      },
      "command-language": {
        "title": "選擇一種語言",
        "label": "語言"
      },
      "command-zoom-in": {
        "title": "放大"
      },
      "command-zoom-out": {
        "title": "縮小"
      }
    },
    "script-name": {
      "label": "腳本名"
    },
    "options-dropdown": {
      "autocomplete": "自動完成",
      "on-enter": "輸入 Enter",
      "partial-flashing": "快速下載",
      "lang-select": "選擇語言:",
      "add-language-link": "添加一種語言"
    },
    "text-editor": {
      "aria-label": "文本編輯器"
    }
  }
};
