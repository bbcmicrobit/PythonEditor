Manual Test Procedure
=====================

Intro
-----

Until we have a comprehensive set end-to-end tests, we will have to carry
some tests manually to ensure all the user-facing features of the Python Editor
are working as expected.

We need to be pragmatic about the amount of tests we carry manually, so this
Test Procedure tries to balance coverage vs test duration.


Nomenclature and Definitions
----------------------------

- **Python Editor**: This constitutes the whole web app.

- **Text Editor**: The text or code editor (using the Ace framework) inside the
  Python Editor.

- **Load by editor drag&drop**: Load a file into the Python Editor by dragging
  a file from the user OS, to the Text Editor area.

- **Load by modal drag&drop**: Load a file into the Python Editor by
clicking on the "Load/Save button" and then dragging a file from the user OS
  to the large grey box that says "Drag and drop a .hex or .py file in here to
  open it".

- **Load by file picker**: Load a file into the Python Editor by clicking on
  the "Load/Save button", then clicking on the "Or Browse for a file" button,
  selecting a file in the browser file picker, and finally clicking on the
  "Open" button.

- **Load by any method**: Load a file into the Python Editor using either
  of the three options: "Load by editor drag&drop", "Load by modal
  drag&drop", or "Load by file picker".

- **Connect to the REPL**: Use any type of serial terminal to connect with the
  micro:bit, and send a Ctrl+C command to enter the REPL.

- **Script Name**: The name of the script stored on the top right side of the
  Python Editor. This can be often confused with a search box.

- **Test Case**: A set of test steps to verify a related set of conditions.

- **Program by any method**: Write a file onto the micro:bit. This can be done
  by dragging the file into the MICROBIT drive or through the WebUSB connect
  button.


Preparation
-----------

Ensure you have everything listed in the "You will need" sub-section.

Each Test Case will focus on a single feature under tests. Make sure to read
the "Test Cases" opening paragraphs carefully.


You will need
'''''''''''''

- Internet Explorer 11: non-Chrome-based

- A modern version of Edge

  - Edge v44 or lower: non-Chrome-based
  - Edge v77 or higher: Chrome-based

- A modern version of Chrome: Chrome-based

- A modern version of Firefox: non-Chrome-based

- A modern version of Safari: non-Chrome-based with **Press Tab to highlight
  each item on a web page** enabled for A11y tests
  (https://support.apple.com/en-gb/guide/safari/ibrw1075/mac)

- A text editor (the one included in most operating systems is fine)

- Access to the Python Editor under test

- The expected version number for the Python Editor under test

- The expected version number for the MicroPython interpreter included in the
  Python Editor under tests

- The test files from `./test-files/`

- A micro:bit V1

- A micro:bit V2

- One from the following:

  - A serial terminal program you are comfortable to connect to a micro:bit
  - The working microREPL installation (https://github.com/ntoll/microrepl)
  - Mu editor (https://codewith.mu/)
  - A micro:bit with WebUSB-enabled DAPLink and access to a version of the
    Python Editor with WebUSB REPL

- If running the tests on Windows 7 you might need the Mbed serial driver
  installed


Tests Execution
---------------

The test cases listed below always need to be run in a chrome-based browser:

- Connect and Flash over WebUSB and use REPL
- Full Flash over WebUSB
- WebUSB error modal links are working

For a Primary Editor release run all the tests in all browsers. For a Beta
Editor release, run all tests in Internet Explorer 11, except for the
test cases listed above that need to be run in a chrome-based browser.

**Start each test case in a new instance of the Python Editor.**

When a Test Case bullet point starts with a checkbox (denoted by a ``[ ]``) it
indicates a boolean condition (Pass/Fail) that needs to be checked and the
result annotated.

Please note that there are different ways to load files to the Python Editor
and that different Test Cases will use different methods.


Test Case: Hex file can be generated
''''''''''''''''''''''''''''''''''''
- Click the "Download" button.
- [ ] Confirm the file downloaded is named "microbit_program.hex".
- Program by any method the downloaded hex file into a micro:bit.
- [ ] Confirm the micro:bit displays "Hello, World!" followed by a heart.
- Save this hex file for the following test case.


Test Case: Generated hex file can be loaded to the editor
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''
- Delete the content of the Script Name box.
- Delete the content from the Text Editor.
- Load by editor drag&drop the hex file saved in the test case "Test: Hex file
  can be generated".
- [ ] Confirm the Script Name is the same as the hex filename without the
  extension.
- [ ] Confirm the Text Editor contains the exact contents from "Code block 1".

Code block 1::

    # Add your Python code here. E.g.
    from microbit import *


    while True:
        display.scroll('Hello, World!')
        display.show(Image.HEART)
        sleep(2000)


Test Case: Editor v0 hex file can be loaded to the drop area
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
- Load by modal drag&drop the file ``example-editor-v0.hex``.
- [ ] Confirm the Script Name is ``example-editor-v0``.
- [ ] Confirm the Text Editor contains the exact contents from "Code block 2".

Code block 2::

    # This is a Python Editor v0 file
    from microbit import *
    display.show(Image.CLOCK1)


Test Case: Editor v1.1 (MicroPython v1.0) hex file can be loaded by file picker
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
- Load by file picker the file ``example-editor-v1.hex``.
- [ ] Confirm the Script Name is ``example-editor-v1``.
- [ ] Confirm the Text Editor contains the exact contents from "Code block 3".

Code block 4::

    # This is a Python Editor v1.1.0 file (MicroPython v1.0.0)
    from microbit import *
    display.show(Image.TRIANGLE)


Test Case: Python file can be saved
'''''''''''''''''''''''''''''''''''
- Click the "Load/Save" button.
- Click the "Download Python Script" button.
- [ ] Confirm the file downloaded is named "microbit_program.py".
- Open the contents in a text editor from your operating system.
- [ ] Confirm the file contains the exact contents from "Code block 5".
- Save this Python file for the following test case.

Code block 5::

    # Add your Python code here. E.g.
    from microbit import *


    while True:
        display.scroll('Hello, World!')
        display.show(Image.HEART)
        sleep(2000)


Test Case: Saved Python file can be loaded to the editor
''''''''''''''''''''''''''''''''''''''''''''''''''''''''
- Delete the content of the Script Name box.
- Delete the content from the Text Editor.
- Load by editor drag&drop the Python file saved in the test case "Test:
  Python file can be saved".
- [ ] Confirm the Script Name is the same as the Python filename without the
  extension.
- [ ] Confirm the Text Editor contains the exact contents from "Code block 6".

Code block 6::

    # Add your Python code here. E.g.
    from microbit import *


    while True:
        display.scroll('Hello, World!')
        display.show(Image.HEART)
        sleep(2000)


Test Case: Python file can be loaded to the drop area
'''''''''''''''''''''''''''''''''''''''''''''''''''''
- Load by modal drag&drop the file ``python-example.py``.
- [ ] Confirm the Script Name is ``python-example``.
- [ ] Confirm the Text Editor contains the exact contents from "Code block 7".

Code block 7::

    # This is a simple Python file
    from microbit import *
    display.show(Image.PACMAN)


Test Case: Python file can be loaded by file picker
'''''''''''''''''''''''''''''''''''''''''''''''''''
- Load by file picker the file ``python-example.py``.
- [ ] Confirm the Script Name is ``python-example``.
- [ ] Confirm the Text Editor contains the exact contents from "Code block 8".

Code block 8::

    # This is a simple Python file
    from microbit import *
    display.show(Image.PACMAN)


Test Case: module.py file can be loaded by modal file picker and used in main.py
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Run this test case with a micro:bit **V1**.

- Load by "Load/Save > Or browse for a file" the file ``emoji.py``
- [ ] Confirm the modal dialogue displays 'The "emoji" module has been added
  to the filesystem.'
- Click "Show Files (2)"
- [ ] Confirm the file shows up in the files list with the same title.
- Return to the editor and replace the current script with "Code block 9".
- [ ] Click the "Download" button, copy the hex file via OS drag&drop it into
  the MICROBIT, confirm it flashes successfully.
- [ ] Confirm that the programme behaves as expected, showing emojis for the
  appropriate gestures and buttons.

Code block 9::

    from microbit import *
    from emoji import *

    while True:
        display.show(😃)
        if accelerometer.was_gesture('shake'):
            display.show(😡)
            sleep(2000)
        if button_a.was_pressed():
            display.show(💖)
            sleep(2000)
        elif button_b.was_pressed():
            display.show(🏠)
            sleep(2000)
        sleep(100)


Test Case: module.py file can be loaded by filesystem file picker
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
Run this test case with a micro:bit **V2**.

- Load by "Load/Save > Show Files > Add file" the file ``emoji.py``
- [ ] Confirm the file shows up in the files list with the same title.
- Return to the editor and replace the current script with "Code block 9".
- [ ] Click the "Download" button, copy the hex file via OS drag&drop it into
  the MICROBIT, confirm it flashes successfully.
- [ ] Confirm that the programme behaves as expected, showing emojis for the
  appropriate gestures and buttons.


Test Case: module.py file can be 'magically' loaded into the editor by drag&drop
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
- Load by drag&drop into the editor the file ``emoji.py``
- [ ] Confirm the modal dialogue displays 'The "emoji" module has been added
  to the filesystem.'
- [ ] Confirm the file shows up in the files list with the same title.


Test Case: module.py file can be loaded by Load/Save modal drag&drop
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
- Load by Load/Save drop area drag&drop the file ``emoji.py``
- [ ] Confirm the modal dialogue displays 'The "emoji" module has been added
  to the filesystem.'


Test Case: Hex file containing module can be loaded in the editor
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
- Load the file ``emoji-example.hex`` into the editor using drag&drop
- [ ] In the Load/Save modal, confirm the editor has loaded the
  ``emoji-example.py (main.py)`` and ``emoji.py`` files.
- [ ] Confirm that each .py file can be downloaded individually.
- [ ] Confirm that the emoji.py file can be deleted.
- Program the project by any method to the micro:bit.
- [ ] Confirm that an exception is thrown in the micro:bit.


Test Case: Empty script downloads MicroPython interpreter only
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
- Remove all the content from the Text Editor.
- Click the "Download" button.
- Program by any method the downloaded hex file into a micro:bit.
- Connect to the REPL.
- With the serial connection opened, press the micro:bit reset button.
- [ ] Confirm the micro:bit restarted and that it went straight to the REPL.


Test Case: Snippets inject code into the Text Editor
''''''''''''''''''''''''''''''''''''''''''''''''''''
- Click the "Snippets" button.
- Click on the "if" trigger.
- [ ] Confirm the contents defined in "Code block 10" were injected to the end
  of the Text Editor (where the cursor should be by default).

Code block 10::

    if condition:
        # TODO: write code...


Test Case: Help menu expands and links work
'''''''''''''''''''''''''''''''''''''''''''
- Click the "Help" button.
- [ ] Confirm help drop down menu appears.
- [ ] Confirm the correct "Editor Version" is displayed.
- [ ] Confirm the correct "MicroPython Version" is displayed.
- Click on the "Documentation" link.
- [ ] Confirm the micro:bit MicroPython documentation has been opened and the
  version displayed is the MicroPython version listed in the Python Editor
  help info (not "latest" or an older version).
- Click the "Help" link.
- [ ] Confirm the ``help.html`` from the Python Editor under test has been
  opened.
- Click the "Support" link.
- [ ] Confirm the entry point for https://support.microbit.org has been opened.


Test Case: Zoom changes the Text Editor font size
'''''''''''''''''''''''''''''''''''''''''''''''''
- Click the button with a magnifying lens and a ``+`` sign.
- [ ] Confirm the font in the Text Editor has been increased.
- Click the button with a magnifying lens and a ``-`` sign.
- [ ] Confirm the font in the Text Editor has been decreased.


Test Case: Language options work
''''''''''''''''''''''''''''''''
- Confirm that selecting each language option changes it to the corresponding language

- [ ] English
- [ ] Chinese (Hong Kong)
- [ ] Chinese (simplified)
- [ ] Chinese (Taiwan)
- [ ] Croatian
- [ ] Polish
- [ ] Spanish
- [ ] French
- [ ] Korean
- [ ] Norwegian Nynorsk
- [ ] Portugese
- [ ] Serbian


Test Case: Connect and Flash over WebUSB and use REPL
'''''''''''''''''''''''''''''''''''''''''''''''''''''
Carry out this test in Chrome or a chrome-based browser.
Run this test case twice, once with a micro:bit V1 and once with a V2.

- [ ] Connect to micro:bit and confirm that menu now shows options to
  "Flash" and "Disconnect".
- [ ] Confirm you can flash the default program to the micro:bit via WebUSB
  and that it behaves as expected.
- [ ] "Open Serial" and confirm you can enter the REPL by click or CTRL-C.
- [ ] Type ``help()`` and confirm that you see a result.
- [ ] Disconnect and confirm that menu returns to "Download" and "Connect".


Test Case: Full Flash over WebUSB
'''''''''''''''''''''''''''''''''
This feature will only be available in the beta versions.
Carry out this test in Chrome or a chrome-based browser.
Run this test case twice, once with a micro:bit V1 and once with a V2.

- Click the 'Beta Options' button.
- Click the 'Quick Flash' toggle to disable it.
- [ ] Connect to micro:bit and confirm that menu now shows options to
  "Flash" and "Disconnect".
- [ ] Confirm you can flash the default program to the micro:bit via WebUSB
  and that it behaves as expected.
- [ ] "Open Serial" and confirm you can enter the REPL by click or CTRL-C.


Test Case: WebUSB not supported message is working
''''''''''''''''''''''''''''''''''''''''''''''''''
Carry out this test in non-Chrome-based browsers:

- Click the 'Connect' button.
- [ ] Confirm the WebUSB not supported message box is displayed.
- Click outside the modal.
- [ ] Confirm the modal closes.
- Click the 'Open Serial' button.
- [ ] Confirm the WebUSB not supported message box is displayed.
- Click the 'Find Out More' link.
- [ ] Confirm the help.html page is opened on the WebUSB section.


Test Case: WebUSB error modal links are working
'''''''''''''''''''''''''''''''''''''''''''''''
Carry out this test in Chrome or a chrome-based browser:

- Click the 'Connect' button.
- Click 'Cancel' button in the WebUSB device selection window that opens.
- Click the 'Download Hex' link in the modal that opens.
- [ ] Confirm a hex file with the name 'microbit_program.hex' is downloaded.
- Click the 'Troubleshoot' link.
- [ ] Confirm that https://support.microbit.org/support/solutions/articles/19000105428-webusb-troubleshooting
  is opened in a new tab.
- Close the troubleshooting tab.
- Click the 'Close' link.
- [ ] Confirm the modal closes.


Test Case: Autocomplete
'''''''''''''''''''''''
This feature will only be available in the beta versions.

- [ ] Start typing in the editor and confirm that autocomplete offers
  suggestions eg type 'di' and be offered 'display'.
- [ ] Disable autocomplete in "Options" and confirm that autocomplete no
  longer offers suggestions.


Test Case A11y: Keyboard focus order follows the visual layout
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
- [ ] Using your keyboard, navigate through the menu and any submenus using the
  `tab` and `enter` or `space` keysand confirm  they follow natural order of
  the page elements eg.left to right and top top bottom.
- [ ] Using your keyboard, navigate through the modal windows using the `tab`
  and `enter` or `space` keys and confirm  they follow natural order of the
  page elements eg.left to right and top top bottom.


Test Case A11y: Esc key returns focus to menu
'''''''''''''''''''''''''''''''''''''''''''''
- [ ] Type something in the text editor, then confirm the `Esc` key returns the
  focus to the menu from the text editor.
- [ ] Enter the Load/Save modal window and confirm the `Esc` key closes the
  open modal.


Test Case A11y: Using a screenreader
''''''''''''''''''''''''''''''''''''
- [ ] If you are using a Mac, enable the Voiceover tool
  https://support.apple.com/en-gb/guide/voiceover-guide/vo2682/web and
  repeat the A11y tests using Voiceover.


Test Case Unit Tests: Browser based unit tests
''''''''''''''''''''''''''''''''''''''''''''''
This test uses a local clone of the repository.

- Clone the repository version under test and start the local server.
  (see https://github.com/bbcmicrobit/PythonEditor/blob/master/README.rst)
- Launch "http://localhost:8000/tests.html" in the browser.
- [ ] Confirm all tests pass (errors will be marked red).


Test results
------------

Record any failures as issues in the
https://github.com/bbcmicrobit/PythonEditor/ GitHub repository.


Acceptance Criteria
-------------------

If any of the tests cases has a single failure this is considered an overall
**test failure** and the editor should be fixed before it can be released.
