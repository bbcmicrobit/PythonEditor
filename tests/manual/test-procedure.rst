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

- **Load by drop area drag&drop**: Load a file into the Python Editor by
  clicking on the "Load button" and then dragging a file from the user OS to
  the large grey box that says "Drag and drop a .hex or .py file in here to
  open it".

- **Load by file picker**: Load a file into the Python Editor by clicking on
  the "Load button", then clicking on the "Or pick a file" link, then clicking
  on the "Browse" button, selecting a file in the browser file picker, and
  finally clicking on the "Load" button.

- **Load by any method**: Load a file into the Python Editor using either
  of the three options: "Load by editor drag&drop", "Load by drop area
  drag&drop", or "Load by file picker".

- **Connect to the REPL**: Use any type of serial terminal to connect with the
  micro:bit, and send a Ctrl+C command to enter the REPL.

- **Script Name**: The name of the script stored on the top right side of the
  Python Editor. This can be often confused with a search box.

- **Test Case**: A set of test steps to verify a related set of conditions.


Preparation
-----------

Ensure you have everything listed in the "You will need" sub-section.

Each Test Case will focus on a single feature under tests. Make sure to read
the "Test Cases" opening paragraphs carefully.


You will need
'''''''''''''

- Internet Explorer 10

- A modern version of Edge

- A modern version of Chrome

- A modern version of Firefox

- A text editor (the one included in most operating systems is fine).

- Access to the Python Editor under test

- The version number for the Python Editor under test

- The version number for the MicroPython interpreter included in the Python
  Editor under tests

- The test files from
  https://github.com/bbcmicrobit/PythonEditor/tree/master/tests/manual/test-files

- A micro:bit

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

All Test Cases have to be run in one of the browsers listed in the
"Preparation" section, and AT LEAST the following Test Cases have to be run
in all of the other browsers as well:

- Hex file can be generated
- Generated hex file can be loaded to the editor
- Python file can be saved
- Saved Python file can be loaded to the editor
- Snippets inject code into the Text Editor
- Help menu expands and links work
- Zoom changes the Text Editor font size

Start each test case in a new instance of the Python Editor.

When a Test Case bullet point starts with a checkbox (denoted by a ``[ ]``) it
indicates a boolean condition (Pass/Fail) that needs to be checked and the
result annotated.

Please note that there are different ways to load files to the Python Editor
and that different Test Cases will use different methods.


Test Case: Hex file can be generated
''''''''''''''''''''''''''''''''''''
- Click the "Download" button.
- [ ] Confirm the file downloaded is named "microbit.hex".
- Flash the downloaded hex file into a micro:bit.
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
- [ ] Confirm the Text Editor contains the exact contents defined in the
  "Code block 1" at the bottom of this Test Case.

Code block 1::

    # Add your Python code here. E.g.
    from microbit import *


    while True:
        display.scroll('Hello, World!')
        display.show(Image.HEART)
        sleep(2000)


Test Case: Editor v0 hex file can be loaded to the drop area
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
- Load by drop area drag&drop the file ``example-editor-v0.hex``.
- [ ] Confirm the Script Name is ``example-editor-v0``.
- [ ] Confirm the Text Editor contains the exact contents defined in the
  "Code block 1" at the bottom of this Test Case.

Code block 1::

    # This is a Python Editor v0 file
    from microbit import *
    display.show(Image.CLOCK1)


Test Case: Editor v1.1 (MicroPython v1.0) hex file can be loaded by file picker
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
- Load by file picker the file ``example-editor-v1.hex``.
- [ ] Confirm the Script Name is ``example-editor-v1``.
- [ ] Confirm the Text Editor contains the exact contents defined in the
  "Code block 1" at the bottom of this Test Case.

Code block 1::

    # This is a Python Editor v1.1.0 file (MicroPython v1.0.0)
    from microbit import *
    display.show(Image.TRIANGLE)


Test Case: Python file can be saved
'''''''''''''''''''''''''''''''''''
- Click the "Save" button.
- [ ] Confirm the file downloaded is named "microbit.py".
- Open the contents in a text editor from your operating system.
- [ ] Confirm the file contains the exact contents defined in the "Code block
  1" at the bottom of this Test Case.
- Save this Python file for the following test case.

Code block 1::

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
- [ ] Confirm the Text Editor contains the exact contents defined in the
  "Code block 1" at the bottom of this Test Case.

Code block 1::

    # Add your Python code here. E.g.
    from microbit import *


    while True:
        display.scroll('Hello, World!')
        display.show(Image.HEART)
        sleep(2000)


Test Case: Python file can be loaded to the drop area
'''''''''''''''''''''''''''''''''''''''''''''''''''''
- Load by drop area drag&drop the file ``python-example.py``.
- [ ] Confirm the Script Name is ``python-example``.
- [ ] Confirm the Text Editor contains the exact contents defined in the
  "Code block 1" at the bottom of this Test Case.

Code block 1::

    # This is a simple Python file
    from microbit import *
    display.show(Image.PACMAN)


Test Case: Python file can be loaded by file picker
'''''''''''''''''''''''''''''''''''''''''''''''''''
- Load by file picker the file ``python-example.py``.
- [ ] Confirm the Script Name is ``python-example``.
- [ ] Confirm the Text Editor contains the exact contents defined in the
  "Code block 1" at the bottom of this Test Case.

Code block 1::

    # This is a simple Python file
    from microbit import *
    display.show(Image.PACMAN)


Test Case: module.py file can be loaded by file picker and used in main.py
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
- Load by Load/Save > Add file the file ``emoji.py``
- [ ] Confirm the file shows up in the files list with the same title.
- Return to the editor and replace the current script with the following::

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

- [ ] Flash this file to the micro:bit and confirm that it behaves as expected,
  showing emojis for the appropriate gestures and buttons.


Test Case: module.py file can be 'magically' loaded into the editor by drag&drop and used in main.py
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
- Load by drag&drop into the editor the file ``emoji.py``
- [ ] Confirm the modal dialogue displays 'The "emoji" module has been added to the filesystem.'
- Return to the editor and replace the current script with the following::


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

- [ ] Flash this file to the micro:bit and confirm that it behaves as expected,
  showing emojis for the appropriate gestures and buttons.


Test Case: module.py file can be loaded by Load/Save modal drag&drop and used in main.py
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
- Load by Load/Save drop area drag&drop the file ``emoji.py``
- [ ] Confirm the modal dialogue displays 'The "emoji" module has been added to the filesystem.'
- Return to the editor and replace the current script with the following::


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

- [ ] Flash this file to the micro:bit and confirm that it behaves as expected,
  showing emojis for the appropriate gestures and buttons.


Test Case: Hex file containing module can be loaded in the editor
'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
- Load the file ``emoji-example.hex`` into the editor using drag&drop
- [ ] In the Load/Save modal, confirm the editor has loaded the 
    ``emoji-example.py (main.py)`` and ``emoji.py`` files.
- [ ] Confirm that each .py file can be downloaded individually.
- [ ] Confirm that the emoji.py file can be deleted, then re-flash the file
  to the micro:bit and confirm that an exception is thrown.


Test Case: Empty script downloads MicroPython interpreter only
''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
- Remove all the content from the Text Editor.
- Click the "Download" button.
- Flash the downloaded hex file into a micro:bit.
- Connect to the REPL.
- With the serial connection opened, press the micro:bit reset button.
- [ ] Confirm the micro:bit restarted and that it went straight to the REPL.


Test Case: Snippets inject code into the Text Editor
''''''''''''''''''''''''''''''''''''''''''''''''''''
- Click the "Snippets" button.
- Click on the "if" trigger.
- [ ] Confirm the contents defined in the "Code block 1", at the bottom of this
  Test Case, were injected to the end of the Text Editor (where the cursor
  should be by default).

Code block 1::

    if condition:
        # TODO: write code...


Test Case: Help menu expands and links work
'''''''''''''''''''''''''''''''''''''''''''
- Click the "Help" button.
- [ ] Confirm additional info and links are shown on the Python Editor.
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


Test Case: Connect and Flash over WebUSB and use REPL
'''''''''''''''''''''''''''''''''''''''''''''''''''''
- [ ] Connect to micro:bit and confirm that menu now shows options to "Flash" and "Disconnect".
- [ ] Confirm you can flash the default program to the micro:bit via WebUSB and that it behaves as expected.
- [ ] "Open Serial" and confirm you can enter the REPL by click or CTRL-C.
- [ ] Type ``help()`` and confirm that you see a result. 
- [ ] Disconnect and confirm that menu returns to "Download" and "Connect".


Test Case: Autocomplete
'''''''''''''''''''''''
- [ ] Start typing in the editor and confirm that autocomplete offers suggestions
  eg type 'di' and be offered 'display'.
- [ ] Disable autocomplete in "Options" and confirm that autocomplete no longer offers suggestions.

Test Case: Incompatible File Handling
'''''''''''''''''''''''''''''''''''''
- Click the Load/Save button.
- Load by any method any file that does not have a '.hex','.py', or '.mpy' extension.
- [ ] Confirm that the Load/Save modal closes.
- [ ] Confirm that a second 'Invalid File Type' modal opens.
- [ ] Confirm text below header is "You can only load files with the extensions .hex or .py. Please try again.".
- Close the 'Invalid File Type' modal and load by any method a file with a '.mpy' extension.
- [ ] Confirm that the Load/Save modal closes.
- [ ] Confirm that a second 'Invalid File Type' modal opens.
- [ ] Confirm text below header is "You just tried to load a .mpy file. We are currently working on supporting these files but currently the only supported file types are .hex and .py. We hope to implement this feature soon!".

Test results
------------

Record any failures as issues in the
https://github.com/bbcmicrobit/PythonEditor/ GitHub repository.


Acceptance Criteria
-------------------

If any of the tests cases has a single failure this is considered an overall
**test failure** and the editor should be fixed before it can be released.
