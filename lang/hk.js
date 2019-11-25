var language = {
  "code_snippets": {
    "title": "程式碼片段",
    "description": "程式碼片段是在您自己的程式中可重複使用的短程式碼區塊。對於大多數一般的程式碼片段, 您需要用 MicroPython 來做。",
    "instructions": "選擇下面的一個程式碼片段, 或者鍵入程式碼片段的觸發器, 然後點選 TAB 鍵",
    "trigger_heading": "觸發器",
    "description_heading": "描述",
    "docs": "建立一個註解來描述你的程式碼",
    "wh": "當某些條件為真時, 在某些程式碼上保持迴圈",
    "with": "給做某些事的內容分配一個名字",
    "cl": "建立一個新類, 用於定義新類型物件的行為",
    "def": "定義一個已命名的函數, 它需要一些參數並選擇性地添加描述",
    "if": "如果某種條件是真的, 做點什麼",
    "ei": "否則, 如果其他條件是真的, 做一些事",
    "el": "否則做一些其他的事",
    "for": "對於項目集合中的每個項目都執行某項操作",
    "try": "嘗試做某事並處理異常 (錯誤)"
  },
  "share": {
    "title": "共用程式碼",
    "instructions": "使用密碼和選擇性提示 (説明您記住密碼), 以安全地建立一個連結, 與他人共享您的程式碼",
    "passphrase": "密碼: ",
    "hint": "密碼提示: ",
    "button": "建立連結",
    "description": "此 URL 指向您的程式碼:",
    "shortener": "這是連結的簡短版本:"
  },
  "decrypt": {
    "title": "解密原始程式碼",
    "instructions": "輸入密碼以解密原始程式碼",
    "passphrase": "密碼: ",
    "button": "解密"
  },
  "alerts": {
    "download": "Safari 有一個錯誤, 這意味著您的工作將被下載成為一個未命名的檔案, 請將其重命名為以.hex結尾的檔案。另一個方法是使用 Firefox 或 Chrome 瀏覽器, 它們不會遭遇這個錯誤。",
    "save": "Safari 有一個錯誤, 這意味著您的工作將被下載成為一個未命名的檔案, 請將其重命名成為以 .py結尾的檔案。另一個方法是使用 Firefox 或 Chrome 瀏覽器, 它們不會遭遇這個錯誤",
    "load_code": "哎呀！ 無法將代碼載入到十六進位檔案中。",
    "unrecognised_hex": "抱歉，我們無法識別這個檔案",
    "snippets": "啟用blockly時禁用程式碼片段.",
    "error": "錯誤:\n",
    "empty": "Python 檔案沒有任何內容.",
    "no_python": "在hex檔中找不到有效的Python程式碼.",
    "no_script": "Hex 檔不包含 Python 腳本.",
    "no_main": "Hex 檔沒有包含 main.py 檔案.",
    "cant_add_file": "不能新增檔案到檔案系統:",
    "module_added": "\"{{module_name}}\" 模組已新增到檔案系統.",
    "module_out_of_space": "無法將檔案新增到系統，因為沒有剩餘的存儲空間."
  },
  "help": {
    "docs-link": {
      "title": "檢視 MicroPython 文件",
      "label": "文件"
    },
    "support-link": {
      "title": "在新標籤中取得你的 micro:bit 支援",
      "label": "支援"
    },
    "help-link": {
      "title": "在新標籤中打開編輯器的説明",
      "label": "説明"
    },
    "issues-link": {
      "title": "在GitHub中檢視 Python Editor 的未解決問題",
      "label": "問題追蹤"
    },
    "feedback-link": {
      "title": "向我們發送關於 Python Editor 的回饋",
      "label": "傳送意見反應"
    },
    "editor-ver": "編輯器版本:",
    "mp-ver": "MicroPython 版本:"
  },
  "confirms": {
    "quit": "某些更改尚未保存。 仍然結束嗎?",
    "blocks": "您有未保存的程式碼。 使用積木將更改你的程式碼，您可能會丟失你的改變，你想繼續嗎?",
    "replace_main": "新增main.py檔案將取代編輯器中的程式碼!",
    "replace_file": "取代 \"{{file_name}}\" 檔案嗎?",
    "replace_module": "取代 \"{{module_name}}\" 模組嗎?",
    "download_py_multiple": "此專案包含多個不使用此格式保存的檔案.\n\n推薦下載 Hex 檔, 它將包含整個專案並能夠重新載入到編輯器中.\n\n 是否確認只下載檔案 {{file_name}} ?"
  },
  "code": {
    "start": "在此處新增 Python 程式碼。例如."
  },
  "webusb": {
    "err": {
      "update-req": "你需要 <a target=\"_blank\" href=\"https://support.microbit.org/support/solutions/articles/19000019131-how-to-upgrade-the-firmware-on-the-micro-bit\"> 更新 micro:bit 固件</a> 以使用這個功能.",
      "clear-connect": "另一個程序正在連線到這個設備. <br>關閉其它任何可能使用 WebUSB 的標籤 (如 MakeCode, Python Editor), 或者拔掉 micro:bit 插頭再重新插上.",
      "reconnect-microbit": "請重新連線 micro:bit 然後再次嘗試.",
      "partial-flashing-disable": "如果錯誤仍然存在，請嘗試禁用Beta選項中的快速下載.",
      "device-disconnected": "設備已斷開.",
      "timeout-error": "不能連線到 micro:bit",
      "unavailable": "使用 WebUSB 可以從編輯器中直接給 micro:bit 設計程式並連線到序列埠主控台.<br/> 不幸的是, 這個瀏覽器不支援 WebUSB. 推薦使用 Chrome, 或 Chrome 內核的瀏覽器.",
      "find-more": "了解更多"
    },
    "troubleshoot": "疑難排解",
    "close": "關閉",
    "request-repl": "發送 CTRL-C 到 REPL",
    "request-serial": "發送 CTRL-D 以重設",
    "flashing-text": "燒錄 micro:bit",
    "download": "下載 Hex"
  },
  "load": {
    "show-files": "顯示檔案",
    "load-title": "載入",
    "instructions": "拖放一個 .hex 或 .py 檔案在此開啓它.",
    "submit": "載入",
    "save-title": "儲存",
    "save-hex": "下載專案 Hex",
    "save-py": "下載 Python 腳本",
    "fs-title": "檔案",
    "toggle-file": "或瀏覽檔案.",
    "fs-add-file": "新增檔案",
    "hide-files": "隱藏檔案",
    "td-filename": "檔案名稱",
    "td-size": "大小",
    "fs-space-free": "剩餘",
    "remove-but": "刪除",
    "save-but": "儲存",
    "files-title": "專案檔案",
    "help-button": "檔案説明",
    "file-help-text": "專案檔案區域顯示程式中包含的檔案, 並允許您新增或刪除外部python模組和其他檔案. 了解更多在",
    "help-link": "在Python Editor 説明文件中",
    "invalid-file-title": "無效的檔案類型",
    "mpy-warning": "這個版本的 Python Editor 現在不支援新增 .mpy 檔案.",
    "extension-warning": "Python Editor 只能載入副檔名 .hex 或 .py 檔案."
  },
  "languages": {
    "en": {
      "title": "香港繁體"
    },
    "es": {
      "title": "Spanish"
    },
    "pl": {
      "title": "Polish"
    },
    "hr": {
      "title": "Croatian"
    },
    "hk": {
      "title": "Chinese (simplified)"
    }
  },
  "static-strings": {
    "buttons": {
      "command-download": {
        "title": "下載一個 hex 檔案到 micro:bit",
        "label": "下載"
      },
      "command-disconnect": {
        "title": "斷開 micro:bit 連線",
        "label": "中斷連線"
      },
      "command-flash": {
        "title": "直接下載專案到 micro:bit",
        "label": "下載"
      },
      "command-files": {
        "title": "載入/儲存檔案",
        "label": "載入/儲存"
      },
      "command-serial": {
        "title": "通過序列埠連線 micro:bit",
        "label": "打開序列埠",
        "title-close": "關閉序列埠連線並返回到編輯器",
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
        "title": "按一下用 blockly 建立程式碼",
        "label": "Blockly"
      },
      "command-snippet": {
        "title": "按一下以選擇程式碼片段（快捷代碼）",
        "label": "片段"
      },
      "command-help": {
        "title": "探索有用的資源",
        "label": "説明"
      },
      "command-language": {
        "title": "選取語言",
        "label": "語言"
      },
      "command-share": {
        "title": "建立一個連結共享你的腳本",
        "label": "共用"
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
      "partial-flashing": "快速下載",
      "lang-select": "選擇語言:",
      "add-language-link": "新增語言"
    },
    "text-editor": {
      "aria-label": "文字編輯器"
    }
  }
};
