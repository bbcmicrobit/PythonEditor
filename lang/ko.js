var LANGUAGE = {
  "code_snippets": {
    "title": "코드 스니펫",
    "description": "코드 스니펫은 재사용 할 수 있는 작은 코드 조각입니다. 마이크로파이썬(MicroPython)을 사용하는데 도움이 되는 스니펫들이 대부분 제공됩니다.",
    "instructions": "삽입할 코드 스니펫을 선택하세요.",
    "trigger_heading": "트리거",
    "description_heading": "설명",
    "docs": "코드 설명(주석)을 삽입합니다.",
    "wh": "조건식이나 값이 True(참) 인 동안, 반복해서 코드를 실행시킵니다.",
    "with": "지정한 이름으로 작업을 실행합니다.",
    "cl": "객체 클래스를 새로 정의합니다.",
    "def": "함수를 정의합니다. 매개 변수와 설명을 추가할 수 있습니다.",
    "if": "조건식이나 값이 True(참) 이면, 코드를 실행시킵니다.",
    "ei": "다른 조건식이나 값이 True(참) 이면, 코드를 실행시킵니다.",
    "el": "이외의 경우, 코드를 실행시킵니다.",
    "for": "리스트 안에 들어있는 각각의 모든 아이템에 대해서 반복적으로 실행합니다.(foreach)",
    "try": "작업을 시도하고 예외(오류)를 처리합니다."
  },
  "alerts": {
    "download": "사파리 웹브라우저에서는 이름 없는 파일로 다운로드 될 수 있습니다. 파일 이름의 마지막에 .hex 를 반드시 붙여주세요. 아니면, 이런 오류가 없는 파이어폭스(Firefox)나 크롬(Chrome) 브라우저를 사용해보세요.",
    "save": "사파리 웹브라우저에서는 이름 없는 파일로 다운로드 될 수 있습니다. 파일 이름의 마지막에 .py 를 반드시 붙여주세요. 아니면, 이런 오류가 없는 파이어폭스(Firefox)나 크롬(Chrome) 브라우저를 사용해보세요.",
    "load_code": "코드를 읽어 hex 파일로 가져올 수 없습니다!",
    "unrecognised_hex": "인식할 수 없는 파일입니다.",
    "snippets": "블록클리(blockly)가 활성화되면 스니펫은 사용할 수 없습니다.",
    "error": "오류: ",
    "empty": "내용이 없는 빈 파일입니다.",
    "no_python": "정상적인 파이썬 코드를 찾을 수 없습니다.",
    "no_script": "Hex file does not contain an appended Python script.",
    "no_main": "main.py 파일이 들어있지 않습니다.",
    "cant_add_file": "파일을 추가할 수 없습니다.:",
    "module_added": " \"{{module_name}}\" 모듈이 추가되었습니다.",
    "module_out_of_space": "파일을 추가할 수 없습니다. 저장 공간이 없습니다."
  },
  "help": {
    "docs-link": {
      "title": "MicroPython 참고문서",
      "label": "참고문서"
    },
    "support-link": {
      "title": "micro:bit 도움 및 지원 창을 새 탭으로 엽니다.",
      "label": "지원"
    },
    "help-link": {
      "title": "도움 및 지원 창을 새 탭으로 엽니다.",
      "label": "도움 및 지원"
    },
    "issues-link": {
      "title": "GitHub 에서 Python Editor 에 대한 Issues 를 살펴봅니다.",
      "label": "Github Issue Tracker"
    },
    "feedback-link": {
      "title": "Python Editor 문제점/개선사항 신고",
      "label": "피드백 보내기"
    },
    "editor-ver": "Editor Version:",
    "mp-ver": "MicroPython Version:"
  },
  "confirms": {
    "quit": "변경 사항을 저장하지 않고 종료 하시겠습니까?",
    "blocks": "변경 사항이 저장되지 않습니다. 블록들을 사용하면 코드가 수정됩니다. 계속 하시겠습니까?",
    "replace_main": "main.py 파일을 추가하면 편집기의 코드가 교체됩니다!",
    "replace_file": " \"{{file_name}}\" 파일을 바꾸시겠습니까?",
    "replace_module": " \"{{module_name}}\" 모듈을 바꾸시겠습니까?",
    "download_py_multiple": "이 프로젝트에는 정상적인 형식으로 저장될 수 없는 파일들이 포함되어있습니다.\n프로젝트의 전체 파일들이 포함되어있고 편집기로 불러들여 수정하기 위해서는 hex 파일로 다운로드하는 것을 권장합니다.\n\n 그래도 {{file_name}} 파일만 다운로드 하시겠습니까?"
  },
  "code": {
    "start": "코드가 추가됩니다. 예시."
  },
  "webusb": {
    "err": {
      "update-req": "You need to <a target=\"_blank\" href=\"https://microbit.org/firmware/\">update your micro:bit firmware</a> to make use of this feature.",
      "update-req-title": "Please update the micro:bit firmware",
      "clear-connect": "다른 프로그램과 연결되어있습니다.<br>WebUSB를 사용하는 다른 탭을 닫거나(예시. MakeCode, Python Editor), micro:bit 를 다시 연결해 보세요.",
      "reconnect-microbit": "micro:bit 연결을 확인한 후, 다시 시도해 보세요.",
      "partial-flashing-disable": "오류가 계속되면, Beta options 에서 빠른 업로드 (Quick Flash) 기능을 해제하세요.",
      "device-disconnected": "연결이 해제되었습니다.",
      "device-bootloader": "Please unplug the micro:bit and connect it again without pressing the reset button.<br>More info:",
      "device-bootloader-title": "micro:bit in MAINTENANCE mode",
      "timeout-error": "micro:bit 에 연결할 수 없습니다.",
      "timeout-error-title": "Connection Timed Out",
      "unavailable": "WebUSB를 사용하면, 온라인 편집기에서 바로 micro:bit 를 프로그래밍하고 시리얼 통신으로 직접 연결할 수 있습니다.<br/>하지만, 이 웹브라우저에서는 WebUSB가 지원되지 않습니다. WebUSB 기능을 사용하려면 Chrome 이나 크롬 기반 웹브라우저를 사용하는 것을 추천합니다.",
      "find-more": "더 알아보기"
    },
    "troubleshoot": "문제 해결",
    "close": "닫기",
    "request-repl": "CTRL-C 전송 (REPL/콘솔 실행 중지)",
    "request-serial": "CTRL-D 전송 (REPL/콘솔 리셋)",
    "flashing-title": "Flashing MicroPython",
    "flashing-title-code": "Flashing code",
    "flashing-long-msg": "Initial flash might take longer, subsequent flashes will be quicker.",
    "download": "hex 다운로드"
  },
  "load": {
    "show-files": "파일 표시",
    "load-title": "불러오기",
    "instructions": ".hex 파일이나 .py 파일을 드래그 하세요.",
    "submit": "불러오기",
    "save-title": "저장하기",
    "save-hex": "프로젝트 hex 다운로드",
    "save-py": "Python 스크립트 다운로드",
    "fs-title": "파일",
    "toggle-file": "파일을 불러와도 됩니다.",
    "fs-add-file": "파일 추가",
    "hide-files": "파일 숨기기",
    "td-filename": "파일 이름",
    "td-size": "크기",
    "fs-space-free": "메모리 삭제",
    "remove-but": "삭제",
    "save-but": "저장하기",
    "files-title": "프로젝트 파일",
    "help-button": "파일 정보",
    "file-help-text": "프로젝트 파일 영역에서는 프로그램에 포함된 파일들을 모두 보여 줍니다. 추가적인 파이썬 모듈과 파일들을 추가하거나 삭제할 수 있습니다. 더 자세한 사항은 다음 링크에서 살펴보세요. ",
    "help-link": "Python Editor 참고문서",
    "invalid-file-title": "잘못된 파일 형식",
    "mpy-warning": "이 버전에서는 .mpy 파일 추가를 지원하지 않습니다.",
    "extension-warning": "파이썬 편집기는 .hex 나 .py 확장 파일들만 불러올 수 있습니다."
  },
  "languages": {
    "en": {
      "title": "한국어"
    },
    "zh-CN": {
      "title": "중국어(간체)"
    },
    "zh-HK": {
      "title": "중국어(홍콩)"
    },
    "zh-TW": {
      "title": "중국어 (번체)"
    },
    "hr": {
      "title": "크로아티아어"
    },
    "pl": {
      "title": "폴란드어"
    },
    "es": {
      "title": "스페인어"
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
        "title": "micro:bit 에 hex 파일을 다운로드합니다.",
        "label": "다운로드"
      },
      "command-disconnect": {
        "title": "micro:bit 와의 연결을 해제합니다.",
        "label": "연결 해제"
      },
      "command-flash": {
        "title": "micro:bit 로 바로 업로드",
        "label": "프로그램 업로드"
      },
      "command-files": {
        "title": "불러오기/저장하기",
        "label": "불러오기/저장하기"
      },
      "command-serial": {
        "title": "micro:bit 에 시리얼 통신으로 연결합니다.",
        "label": "시리얼 통신 열기",
        "title-close": "시리얼 통신을 끊고, 편집기로 돌아갑니다.",
        "label-close": "시리얼 통신 닫기"
      },
      "command-connect": {
        "title": "micro:bit 에 연결합니다.",
        "label": "연결"
      },
      "command-connecting": {
        "title": " micro:bit 에 연결하는 중입니다.",
        "label": "연결 중."
      },
      "command-options": {
        "title": "편집기 설정 변경",
        "label": "Beta Options"
      },
      "command-blockly": {
        "title": "블록클리(blockly) 코드 작성",
        "label": "Blockly"
      },
      "command-snippet": {
        "title": "코드 스니펫(조각) 추가",
        "label": "스니펫"
      },
      "command-help": {
        "title": "도움 자료 찾기",
        "label": "도움 및 지원"
      },
      "command-language": {
        "title": "언어 선택",
        "label": "언어 선택"
      },
      "command-zoom-in": {
        "title": "글꼴 크게"
      },
      "command-zoom-out": {
        "title": "글꼴 작게"
      }
    },
    "script-name": {
      "label": "스크립트 이름"
    },
    "options-dropdown": {
      "autocomplete": "자동완성",
      "on-enter": "엔터를 눌러 ",
      "partial-flashing": "빠른 업로드 (Quick Flash)",
      "lang-select": "언어 선택:",
      "add-language-link": "언어 추가"
    },
    "text-editor": {
      "aria-label": "텍스트 편집기"
    }
  }
};
