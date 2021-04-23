var LANGUAGE = {
  "code_snippets": {
    "title": "程式碼片段",
    "description": "程式碼片段（Code snippets）可以讓你在編程中快速使用代碼，這裡提供 MicroPython 裡最常見的一些。",
    "instructions": "選取下面的一個程式碼片段，或者在編輯器中輸入觸發片語後按下 TAB 鍵。",
    "trigger_heading": "觸發的片語",
    "description_heading": "說明",
    "docs": "為程式碼加上註解說明（documents）",
    "wh": "只要（while）條件為 true 時就不斷持續做某些事",
    "with": "給做某些事的內容分配一個名字",
    "cl": "建立一個新的類別（class）用於定義新類型物件的行為",
    "def": "定義一個已命名的函式，它需要一些參數並選擇性地添加描述",
    "if": "如果（if）某種條件是 True 那麼就做點什麼",
    "ei": "否則如果（else if）其他條件是 true 就做一些事",
    "el": "否則（else）做一些其他的事",
    "for": "在集合裡對每個（for each）項目都執行某項操作",
    "try": "嘗試（try）做某事以處理異常或錯誤"
  },
  "alerts": {
    "download": "在 Safari 上有個已知問題，你的工作將在被下載時會是一個未命名的檔案，請將它重新命名成以 .hex 結尾的檔案。另一個方法是改用 Firefox 或 Chrome 瀏覽器，它們不會發生這種問題。",
    "save": "在 Safari 上有個已知問題，你的工作將在被下載時會是一個未命名的檔案，請將它重新命名成以 .py 結尾的檔案。另一個方法是改用 Firefox 或 Chrome 瀏覽器，它們不會發生這種問題。",
    "load_code": "哎呀！無法將代碼載入到十六進位檔案中。",
    "unrecognised_hex": "抱歉，我們無法識別這個檔案",
    "snippets": "當 blockly 啟用時無法使用程式碼片段。",
    "error": "錯誤：",
    "empty": "這個 Python 檔案沒有任何內容。",
    "no_python": "在 hex 檔中找不到有效的 Python 程式碼。",
    "no_script": "Hex file does not contain an appended Python script.",
    "no_main": "Hex 檔沒有包含 main.py 檔案。",
    "cant_add_file": "無法添加檔案到檔案系統：",
    "module_added": "\"{{module_name}}\" 模組已添加到檔案系統。",
    "module_out_of_space": "無法將檔案添加到系統，因為沒有多餘的儲存空間。"
  },
  "help": {
    "docs-link": {
      "title": "檢視 MicroPython 說明文件",
      "label": "說明文件"
    },
    "support-link": {
      "title": "以新頁籤開啟 micro:bit 支援中心",
      "label": "支援"
    },
    "help-link": {
      "title": "以新頁籤開啟此編輯器的幫助文件",
      "label": "幫助"
    },
    "issues-link": {
      "title": "在 GitHub 中檢視 Python 編輯器的未解決問題",
      "label": "問題追蹤"
    },
    "feedback-link": {
      "title": "給我們關於 Python 編輯器的回饋",
      "label": "回饋意見"
    },
    "editor-ver": "編輯器版本：",
    "mp-ver": "MicroPython 版本："
  },
  "confirms": {
    "quit": "有些內容變更後未儲存，確定要離開嗎？",
    "blocks": "你有未儲存的程式。使用積木模式會更改你的代碼，你可能會遺失這些變更，確定要繼續嗎？",
    "replace_main": "添加的 main.py 檔案將取代編輯器中現有的程式碼！",
    "replace_file": "要取代 \"{{file_name}}\" 這個檔案嗎？",
    "replace_module": "要取代 \"{{module_name}}\" 這個模組嗎？",
    "download_py_multiple": "這個專案裡有多個不使用此格式保存的檔案。\n我們建議下載成 Hex 檔案，它將包含整個專案，也能在編輯器上重新讀取。\n\n確定只要下載 {{file_name}} 這個檔案？"
  },
  "code": {
    "start": "在此處添加 Python 程式碼。例如："
  },
  "webusb": {
    "err": {
      "update-req": "You need to <a target=\"_blank\" href=\"https://microbit.org/firmware/\">update your micro:bit firmware</a> to make use of this feature.",
      "update-req-title": "Please update the micro:bit firmware",
      "clear-connect": "另一個程序正在連線到這個設備。<br>關閉可能也在使用 WebUSB 的其它頁籤（像是 MakeCode、Python 編輯器），或者斷開 micro:bit 再重新連接。",
      "reconnect-microbit": "請重新連接你的 micro:bit 後再試一次。",
      "partial-flashing-disable": "如果錯誤仍然存在，請試著停用 Beta 選項中的快速燒錄功能。",
      "device-disconnected": "設備已斷開連接。",
      "device-bootloader": "Please unplug the micro:bit and connect it again without pressing the reset button.<br>More info:",
      "device-bootloader-title": "micro:bit in MAINTENANCE mode",
      "timeout-error": "無法連接到 micro:bit",
      "timeout-error-title": "Connection Timed Out",
      "unavailable": "WebUSB 可以讓你直接在線上編輯器編程並連結序列埠監控台。<br/>可惜，這個瀏覽器不支援 WebUSB，建議你改用 Chrome 或是基於 Chrome 內核的其它瀏覽器。",
      "find-more": "了解更多"
    },
    "troubleshoot": "疑難排解",
    "close": "關閉",
    "request-repl": "發送 CTRL-C 到 REPL",
    "request-serial": "發送 CTRL-D 以重設",
    "flashing-title": "Flashing MicroPython",
    "flashing-title-code": "Flashing code",
    "flashing-long-msg": "Initial flash might take longer, subsequent flashes will be quicker.",
    "download": "下載 Hex 檔案"
  },
  "load": {
    "show-files": "顯示檔案",
    "load-title": "讀取",
    "instructions": "拖曳一個 .hex 或 .py 檔案到這裡以開啟它。",
    "submit": "讀取",
    "save-title": "儲存",
    "save-hex": "下載專案 Hex 檔案",
    "save-py": "下載 Python 腳本",
    "fs-title": "檔案",
    "toggle-file": "或瀏覽裝置中的檔案。",
    "fs-add-file": "新增檔案",
    "hide-files": "隱藏檔案",
    "td-filename": "檔案名稱",
    "td-size": "大小",
    "fs-space-free": "可用空間",
    "remove-but": "移除",
    "save-but": "儲存",
    "files-title": "專案檔案",
    "help-button": "檔案説明",
    "file-help-text": "專案檔案區域顯示程式中引用（include）的檔案，並允許你添加或移除外部 python 模組和其它檔案。要進一步瞭解請參閱",
    "help-link": "Python 編輯器幫助文件",
    "invalid-file-title": "無效的檔案類型",
    "mpy-warning": "這個版本的 Python 編輯器還不支援添加 .mpy 檔案。",
    "extension-warning": "Python 編輯器只能載入副檔名為 .hex 或 .py 的檔案。"
  },
  "languages": {
    "en": {
      "title": "英文"
    },
    "zh-CN": {
      "title": "中文（簡體）"
    },
    "zh-HK": {
      "title": "中文（繁體，香港）"
    },
    "zh-TW": {
      "title": "中文（繁體，臺灣）"
    },
    "hr": {
      "title": "克羅地亞語"
    },
    "pl": {
      "title": "波蘭語"
    },
    "es": {
      "title": "西班牙语"
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
        "title": "下載一個 hex 檔案以燒錄到 micro:bit 上",
        "label": "下載"
      },
      "command-disconnect": {
        "title": "斷開 micro:bit 連線",
        "label": "中斷連線"
      },
      "command-flash": {
        "title": "直接將專案燒錄到 micro:bit",
        "label": "燒錄"
      },
      "command-files": {
        "title": "讀取/儲存檔案",
        "label": "讀取/儲存"
      },
      "command-serial": {
        "title": "通過序列埠連接 micro:bit",
        "label": "開啟序列埠",
        "title-close": "關閉序列埠連線並返回編輯器",
        "label-close": "關閉序列埠"
      },
      "command-connect": {
        "title": "連線到 micro:bit",
        "label": "連線"
      },
      "command-connecting": {
        "title": "正在連線到 micro:bit",
        "label": "正在連線"
      },
      "command-options": {
        "title": "變更編輯器設定",
        "label": "Beta 選項"
      },
      "command-blockly": {
        "title": "點擊以 blockly 建立程式碼",
        "label": "Blockly"
      },
      "command-snippet": {
        "title": "點擊以選擇一個片語（快捷代碼）",
        "label": "程式碼片段"
      },
      "command-help": {
        "title": "探索有用的資源",
        "label": "幫助"
      },
      "command-language": {
        "title": "選取語言",
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
      "label": "腳本名稱"
    },
    "options-dropdown": {
      "autocomplete": "自動完成",
      "on-enter": "按 [Enter] 後",
      "partial-flashing": "快速燒錄",
      "lang-select": "選擇語言:",
      "add-language-link": "新增語言"
    },
    "text-editor": {
      "aria-label": "文字編輯器"
    }
  }
};
