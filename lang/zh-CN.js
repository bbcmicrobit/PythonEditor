var LANGUAGE = {
  "code_snippets": {
    "title": "代码段",
    "description": "代码片段是在您自己的程序中重复使用的短代码块，这是使用MicroPython时最常见的一些代码片段。",
    "instructions": "选择下面的代码段之一插入到代码。",
    "trigger_heading": "触发",
    "description_heading": "说明",
    "docs": "创建一个注释来描述您的代码",
    "wh": "当某些条件为真时，继续循环某些代码",
    "with": "完成一些与名字有关的功能",
    "cl": "创建定义对象行为的新类",
    "def": "定义一个带有参数的命名函数，并可选添加描述",
    "if": "如果某些条件为真，执行功能",
    "ei": "否则如果其他条件为真，就执行功能",
    "el": "否则就执行功能",
    "for": "使用集合中的每个项目执行某些操作",
    "try": "尝试执行某些操作并处理异常（错误）"
  },
  "alerts": {
    "download": "Safari存在一个错误，这意味着您的程序将作为一个未命名的文件下载，请将其重命名为以.py结尾的文件，或者使用Firefox或Chrome等浏览器，它们没有这个错误。",
    "save": "Safari存在一个错误，这意味着您的程序将作为一个未命名的文件下载，请将其重命名为以.hex结尾的文件，或者使用Firefox或Chrome等浏览器，它们没有这个错误。",
    "load_code": "哎呀！无法将代码加载到十六进制文件中。",
    "unrecognised_hex": "抱歉，我们无法识别这个文件",
    "snippets": "启用blockly时将禁用代码段。",
    "error": "错误：",
    "empty": "Python 文件没有任何内容。",
    "no_python": "在hex文件中找不到有效的Python代码。",
    "no_script": "Hex file does not contain an appended Python script.",
    "no_main": "Hex 文件没有包含 main.py 文件。",
    "cant_add_file": "不能添加文件到文件系统：",
    "module_added": "\"{{module_name}}\" 模块已添加到文件系统。",
    "module_out_of_space": "无法将文件添加到系统，因为没有剩余的存储空间。"
  },
  "help": {
    "docs-link": {
      "title": "查看 MicroPython 文档",
      "label": "文档"
    },
    "support-link": {
      "title": "在新标签中得到 micro:bit 技术支持",
      "label": "技术支持"
    },
    "help-link": {
      "title": "在新标签中打开编辑器的帮助",
      "label": "帮助"
    },
    "issues-link": {
      "title": "在GitHub中查看 Python Editor 的未解决问题",
      "label": "问题跟踪"
    },
    "feedback-link": {
      "title": "给我们发送关于 Python Editor 的反馈",
      "label": "发送反馈"
    },
    "editor-ver": "编辑器版本：",
    "mp-ver": "MicroPython 版本："
  },
  "confirms": {
    "quit": "某些更改尚未保存。仍然退出吗?",
    "blocks": "您有未保存的代码。使用积木编程将更改代码。您可能会丢失更改。你想继续吗?",
    "replace_main": "添加main.py文件将替换编辑器中的代码！",
    "replace_file": "替换 \"{{file_name}}\" 文件吗？",
    "replace_module": "替换 \"{{module_name}}\" 模块吗？",
    "download_py_multiple": "此项目包含多个将不使用此格式保存的文件。\n\n推荐下载 Hex 文件, 它将包含整个项目并能够重新载入到编辑器中。\n\n 是否确认只下载文件 {{file_name}} ？"
  },
  "code": {
    "start": "在此处添加 Python 代码。例如："
  },
  "webusb": {
    "err": {
      "update-req": "You need to <a target=\"_blank\" href=\"https://microbit.org/firmware/\">update your micro:bit firmware</a> to make use of this feature.",
      "update-req-title": "Please update the micro:bit firmware",
      "clear-connect": "另一个进程已连接到这个设备。<br>关闭其它可能使用 WebUSB 的标签（如 MakeCode、Python Editor），或者拔掉 micro:bit 插头再重新插上。",
      "reconnect-microbit": "请重新连接 micro:bit 然后再次尝试。",
      "partial-flashing-disable": "如果错误仍然存在，请尝试禁用beta选项中的快速下载。",
      "device-disconnected": "设备已断开。",
      "device-bootloader": "Please unplug the micro:bit and connect it again without pressing the reset button.<br>More info:",
      "device-bootloader-title": "micro:bit in MAINTENANCE mode",
      "timeout-error": "不能连接到 micro:bit",
      "timeout-error-title": "Connection Timed Out",
      "unavailable": "使用 WebUSB 可以从编辑器中直接给 micro:bit 编程并连接到串口控制台。<br/>不幸的是，这个浏览器不支持 WebUSB。推荐使用 Chrome, 或 Chrome 内核的浏览器。",
      "find-more": "了解更多"
    },
    "troubleshoot": "故障排除",
    "close": "关闭",
    "request-repl": "发送 CTRL-C 到 REPL",
    "request-serial": "发送 CTRL-D 以复位",
    "flashing-title": "Flashing MicroPython",
    "flashing-title-code": "Flashing code",
    "flashing-long-msg": "Initial flash might take longer, subsequent flashes will be quicker.",
    "download": "下载 Hex"
  },
  "load": {
    "show-files": "显示文件",
    "load-title": "载入",
    "instructions": "拖放一个 .hex 或 .py 文件到这里载入它。",
    "submit": "载入",
    "save-title": "保存",
    "save-hex": "下载项目 Hex",
    "save-py": "下载 Python 脚本",
    "fs-title": "文件",
    "toggle-file": "或浏览文件。",
    "fs-add-file": "添加文件",
    "hide-files": "隐藏文件",
    "td-filename": "文件名",
    "td-size": "大小",
    "fs-space-free": "剩余",
    "remove-but": "删除",
    "save-but": "保存",
    "files-title": "项目文件",
    "help-button": "文件帮助",
    "file-help-text": "项目文件区域显示程序中包含的文件, 并允许您添加或删除外部python模块和其他文件. 了解更多在 ",
    "help-link": "在 Python Editor 帮助文档中",
    "invalid-file-title": "无效的文件类型",
    "mpy-warning": "这个版本的 Python Editor 不支持添加 .mpy 文件。",
    "extension-warning": "Python Editor 只能载入 .hex 或 .py 文件。"
  },
  "languages": {
    "en": {
      "title": "英文"
    },
    "zh-CN": {
      "title": "中文（简体）"
    },
    "zh-HK": {
      "title": "繁体中文（中国香港）"
    },
    "zh-TW": {
      "title": "繁体中文（中国台湾）"
    },
    "hr": {
      "title": "克罗地亚语"
    },
    "pl": {
      "title": "波兰语"
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
        "title": "下载一个 hex 文件到 micro:bit",
        "label": "下载"
      },
      "command-disconnect": {
        "title": "断开 micro:bit 连接",
        "label": "断开连接"
      },
      "command-flash": {
        "title": "直接下载项目到 micro:bit",
        "label": "下载"
      },
      "command-files": {
        "title": "载入/保存文件",
        "label": "载入/保存"
      },
      "command-serial": {
        "title": "通过串口连接 micro:bit",
        "label": "打开串口",
        "title-close": "关闭串口连接并返回到编辑器",
        "label-close": "关闭串口"
      },
      "command-connect": {
        "title": "连接到 micro:bit",
        "label": "连接"
      },
      "command-connecting": {
        "title": "正在连接到 micro:bit",
        "label": "正在连接"
      },
      "command-options": {
        "title": "修改编辑器设置",
        "label": "Beta 选项"
      },
      "command-blockly": {
        "title": "单击使用 blockly 创建程序",
        "label": "代码片段"
      },
      "command-snippet": {
        "title": "单击以选择代码段（代码快捷方式）",
        "label": "片段"
      },
      "command-help": {
        "title": "发现有用的资源",
        "label": "帮助"
      },
      "command-language": {
        "title": "选择一种语言",
        "label": "语言"
      },
      "command-zoom-in": {
        "title": "放大"
      },
      "command-zoom-out": {
        "title": "缩小"
      }
    },
    "script-name": {
      "label": "脚本名"
    },
    "options-dropdown": {
      "autocomplete": "自动完成",
      "on-enter": "输入 Enter",
      "partial-flashing": "快速下载",
      "lang-select": "选择语言:",
      "add-language-link": "添加一种语言"
    },
    "text-editor": {
      "aria-label": "文本编辑器"
    }
  }
};
