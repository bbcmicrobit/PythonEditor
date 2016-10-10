BBC micro:bit MicroPython Editor for Browsers
=============================================

This project is an editor that targets the MicroPython
(http://micropython.org) version of the Python programming language
(http://python.org/). Code written with this editor is expected to run on the
BBC's micro:bit device (https://en.wikipedia.org/wiki/Micro_Bit).

Developer Setup
---------------

This editor works with any modern web browser.

Assuming you have Python 3 installed you can serve the editor like this::

    $ ./show.sh
    http://localhost:8000/editor.html
    Serving HTTP on 0.0.0.0 port 8000 ...

As the script tells us, point your browser to http://localhost:8000/editor.html.

It's also possible to run the editor directly from the file system like this,
for example::

    $ firefox editor.html

Or by double-clicking on the ``editor.html`` file from your file manager.

**IMPORTANT**: When the editor is run from the file system, the "sharing"
button is hidden. Because of security reasons, many local browsers won't allow
it to function correctly unless the editor is properly served from a network
domain rather than directly from the file system.

Tests
+++++

Simply point your browser to the ``tests.html`` file.

Tests are in the ``tests`` directory with their own README explaining how they
work.

Code
++++

* ace - a directory containing the Ace editor (http://ace.c9.io).
* editor.html - the page to be loaded by your browser.
* firmware.hex - copy of the "vanilla" MicroPython firmware used by the editor.
* help.html - a single page user facing help page.
* python-main.js - the JavaScript code for running the editor.
* tests.html - the browser based test runner.
* show.sh - a script that allows you to serve the editor from localhost. Requires Python 3.
* static - contains css, js and img sub-directories.
* tests - contains the Python specific test suite.

Contributing
++++++++++++

We love bug reports, contributions and help. Please read the CONTRIBUTING.rst
file for how we work as a community and our expectations for workflow, code and
behaviour.

Usage
-----

The Python editor is based upon the "Ace" JavaScript editor (http://ace.c9.io)
and includes syntax highlighting, code folding and (semi) intelligent
auto-indentation.

All new scripts default to something simple and sensible.

The default name for a new script is ``microbit``. The default comment is
``A MicroPython script``. The default code is a short program to repeatedly
display ``Hello, World!`` followed by a heart. You can change these at any time
by clicking on them.

It is possible to override the default name, comment and code via query string
arguments in the URL. For example, appending ``?name=My%20script`` to the
editor's URL will update the name of the script. Furthermore, appending
``?name=My%20script&comment=A%20different%20comment`` will override both the
name and comment. Please note that all query string arguments must be correctly
URL encoded - this especially applies to code. Use the "share" button in the
editor to generate and share such URLs with appended query strings.

The layout and functionality is deliberately simple. The four buttons at the
top left, act as follows:

* Download - creates a .hex file locally in the user's browser and prompts the user to download it. The resulting file should be copied over to the micro:bit device just like when using all the other editors. The filename will be the name of the script with spaces replaced by "_" and ending in .py. So "extraordinary script" is saved as extraordinary_script.py.
* Snippets - allow user's to write code from pre-defined Python fragments (functions, loops, if...else etc). They are triggered by typing a keyword followed by TAB. For example, type "wh" followed by TAB to insert a while... loop. Clicking on the code snippets button opens up a modal dialog window containing instructions and a table of the available snippets along with their trigger and a short and simple description.
* Help - opens a single page in a new tab that contains user-facing help.
* Share - generate a short URL for the script. Share this with others. This button will be missing if run from the local file system.

Directly next to the four large buttons are two smaller icons. The zoom in and
zoom out buttons that make it easy for teachers to display code via a projector.

If you plug in your micro:bit and want to get the REPL you'll need to install
pyserial and run the following command with the appropriate permissions (such
as root, as shockingly demonstrated below)::

    $ sudo python -m serial.tools.miniterm -b 115200 /dev/ttyACM0

Remember to replace ``/dev/ttyACM0`` with the appropriate device for your computer.

The .hex file is generated in the following way:

* A "vanilla" version of the MicroPython hex is hidden within the DOM.
* We take the Python code in the editor and turn it into a hex representation.
* We insert the Python derived hex into the correct place within the MicroPython hex.
* The resulting combination is downloaded onto the user's local filesystem for flashing onto the device.

The hidden MicroPython hex is just over 600k. While this sounds large, it's
relatively small when you consider:

* The Guardian's front page is around 1.5mb
* Compression is built into the server
* The web has caching built in (we should trust it)
* We actually want kids to view source and find the .hex file in as raw a form as possible.

Documentation
-------------

For documentation for this project - you're reading it. ;-)

For in-editor documentation aimed at the user, this is in the help.html file.

Legacy
------

This project was born from a TouchDevelop based editor created by Nicholas
H.Tollervey for the BBC. This is no longer maintained, although you can find it
still on the ``touch-develop-legacy`` branch in this repository.
