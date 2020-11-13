BBC micro:bit MicroPython Editor for Browsers
=============================================

|Build status|

This project is an editor that targets the `MicroPython
<https://micropython.org>`_ version of the `Python programming language
<http://python.org/>`_. Code written with this editor is expected to run on the
`BBC micro:bit device <https://microbit.org>`_.

Developer Setup
---------------

This editor works with any modern web browser.

In addition to cloning the repository it is required to retrieve the GIT
submodules::

    git clone https://github.com/bbcmicrobit/PythonEditor
    cd PythonEditor
    git submodule update --init --recursive

Assuming you have Python 3 installed you can serve the editor like this::

    $ ./bin/show
    http://localhost:8000/editor.html
    Serving HTTP on 0.0.0.0 port 8000 ...

You can also look at the script content and execute the same, or similar,
command on a terminal as long as it serves the contents of this repository on
port `8000`. `This article <https://gist.github.com/willurd/5720255>`_ shows
other ways to achieve the same.

Then, point your browser to http://localhost:8000/editor.html.

Tests
+++++

There are two ways to run tests:

* A portion of the tests can be run in the browser

  - Serve the editor and point your browser to
    ``http://localhost:8000/tests.html``.

* The full test suit can be run with Node.js

  - ``cd tests && npm install && npm run test``

Tests are in the ``tests`` directory with their own README explaining how they
work.

Code
++++

* ace - a directory containing the Ace editor (http://ace.c9.io).
* bin - a directory containing useful scripts.
* blockly - a GIT sub-module containing Google's blockly project.
* docs - a directory containing more documentation for the editor.
* js - a directory containing the JavaScript code for running the editor.
* CHANGELOG - a record of how things have changed between versions.
* CONTRIBUTING.rst - a guide for people who want to contribute (you should!).
* editor.html - the page to be loaded by your browser.
* help.html - a single page user facing help page.
* lang - a directory containing the editor translations.
* LICENSE - a copy of the MIT software license that covers this code.
* microbit_blocks - a GIT sub-module containing custom MicroPython blocks.
* micropython - a directory with the MicroPython hex files used by the editor.
* python-main.js - the JavaScript code for running the editor.
* README.rst - this file, the clue is in the name. ;-)
* tests.html - the browser based test runner.
* show.sh - a script that allows you to serve the editor from localhost.
* static - contains third party css, js and img sub-directories.
* tests - contains the Python specific test suite.
* tests.html - point your browser at this file to run the tests.

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

The default name for a new script is ``microbit``. The default code is a
short program to repeatedly display ``Hello, World!`` followed by a heart.
You can change these at any time by clicking on them.

The layout and functionality is deliberately simple. A description of the
buttons can be found in the [help page](help.html).

If you have a Python script or hex file on your local computer, you can load it
into the editor by dragging it onto the text area.

The micro:bit can then be programmed by downloading a hex file into your
computer and then copying the file into the MICROBIT drive. If you are using
a Chrome-based browser you also have the option to connect via WebUSB and
flash the micro:bit directly from the browser.

Configuration
-------------

To launch the editor you'll need to pass in a ``config`` JavaScript object
containing translation strings and feature flags. Take a look in the
``editor.html`` file to see how this is done.

Documentation
-------------

More documentation can be found in the `docs folder <docs>`_.

For in-editor documentation aimed at the user, this is in the `help.html file
<help.html>`_.

Metrics
-------

In order to help developers measure the way features of the editor are being
used, all buttons and actions have an 'action' class added to them. Measurement
can then be added by anyone deploying the editor through inclusion of a script
that attaches events to these actions and counts them.

Legacy
------

This project was born from a TouchDevelop based editor created by Nicholas
H.Tollervey for the BBC. This is no longer maintained, although you can find it
still on the ``touch-develop-legacy`` branch in this repository.


.. |Build status| image:: https://dev.azure.com/microbitPython/PythonEditor/_apis/build/status/bbcmicrobit.PythonEditor?branchName=master
