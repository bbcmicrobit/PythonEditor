BBC micro:bit MicroPython Editor for TouchDevelop
=================================================

This project is an editor that targets the MicroPython
(http://micropython.org) version of the Python programming language
(http://python.org/). Code written with this editor is expected to run on the
BBC's micro:bit device (https://en.wikipedia.org/wiki/Micro_Bit).

Developer Setup
---------------

This editor is written to be embedded in Microsoft's TouchDevelop
(https://www.touchdevelop.com/) platform. It means this project is served
within an iFrame in TouchDevelop. For this to work for development purposes,
you'll need both TouchDevelop and this project serving locally.

Apologies for the "stand on one leg, stick your finger in your ear then
whistle 'Yankee Doodle'" nature of these instructions, but they must be
completed in order and to the very end before you'll have a working local
development environment.

Honest, it's worth it! ;-)

Install TouchDevelop
++++++++++++++++++++

In order to set up a working local development environment you will need to
download and install the (open source) TouchDevelop platform. It's a node.js
application that's hosted on GitHub (https://github.com/Microsoft/TouchDevelop)
and the setup instructions can be found in the README. For this to work you
will need GIT and node.js installed.

They essentially boil down to the following steps:

* clone a copy of the repo::

    git clone https://github.com/Microsoft/TouchDevelop.git

* change to the TouchDevelop directory::

    cd TouchDevelop

* install dependencies::

    npm install jake -g
    npm install tsd@next -g
    tsd reinstall
    npm install

To build and run the "vanilla" (i.e. non-microbit branded) version of
TouchDevelop you'll need to do one of the following:

* To build the site (it's written in Microsoft's TypeScript language [http://www.typescriptlang.org/] that compiles to Javascript)::

    jake

* To build and run locally::

    jake local

* To clean::

    jake clean


Configure TouchDevelop
++++++++++++++++++++++

To turn the "vanilla" flavoured TouchDevelop into something with the micro:bit
branding and features you need to copy some files.

The contrib directory in this project contains files and sub-directories that
should be copied over the to equivalent place in the TouchDevelop repository
(where contrib is equivalent of the TouchDevelop repository root). For example,
copy the file contrib/www/mbit.html into the www directory in the root of the
TouchDevelop repository.

Remember to restart the TouchDevelop application in order to compile the
changes contained within the copied files.

Because these modifications depend on assets stored at stage.microbit.co.uk
you must log into the staging platform as follows:

* Go to https://stage.microbit.co.uk/home
* Login with username: microbit password: bitbug42
* Go to "My Scripts" in the top right hand corner, then go to "Sign In"
* Click on "I'm an Adult"
* Tick the box to accept the T&C's
* Login with one of the 3rd party OAuth choices
* Enter the code jnhrsrcsui

Assuming you have completed the steps above and have TouchDevelop running
locally, you'll be able to see the micro:bit version of the site here:

http://localhost:4242/editor/local/mbit.html?lite=stage.microbit.co.uk

You're not finished yet!

Configure the Editor
++++++++++++++++++++

TouchDevelop expects its embedded editors to be served from the domain it
expects. In the case of the Python editor for local development you simply
run it on localhost:8000.

If you're using Python 2 this can be achieved by running the following command
in the root directory of this project::

    $ python -m SimpleHTTPServer

For Python 3 the command is::

    $ python -m http.server

Please make sure you restart your locally running TouchDevelop instance.

Testing Your Setup
++++++++++++++++++

Almost there!

As mentioned above, you should visit the following URL to see the locally
running version of TouchDevelop:

http://localhost:4242/editor/local/mbit.html?lite=stage.microbit.co.uk

DO NOT CLICK ON "Create Code". It doesn't work when TouchDevelop is running
locally. Instead, click on the legal/copyright footer with the terms of use
and privacy policy links in it.

In the resulting popup you'll find a "create script" button under the "admin"
section. Click it and choose the Python editor from the selection you're
presented with.

You should find yourself in the Python editor..! See the "Usage" section
below for details on what you can do.

Code
++++

* ace - a directory containing the Ace editor (http://ace.c9.io).
* contrib - a directory containing code required for set-up.
* editor.html - the page to be embedded within the iFrame in TouchDevelop.
* help.html - a single page user facing help page.
* static - contains css, js and img sub-directories.

Usage
-----

The Python editor is based upon the "Ace" JavaScript editor (http://ace.c9.io)
and includes syntax highlighting, code folding and (semi) intelligent
auto-indentation.

Following the TouchDevelop conventions, naming scripts is done automatically -
it'll be something like, "distinct script" or "awesome script 2". This also
applies to the description - it's automatically set to "A MicroPython script".
You can change these at any time by clicking on them.

Directly underneath the name and description of the script are two icons - the
one on the left indicates the script's status (changed, saved locally, saved to
the cloud) and the other, shaped like a bug, will display a log of the events
that occured during the current session of using the editor.

All new scripts default to::

    import microbit

... which seems an obvious thing to do since this module is how user's will
access the micro:bit hardware.

The layout and functionality apes Microsoft's own editors. Importantly this
includes saving scripts to Microsoft's cloud and sharing them with others via
TouchDevelop's publish functionality.

The four buttons at the top left, act as follows:

* my scripts - returns you to the main menu listing all your scripts.
* download - creates a .hex file locally in the user's browser and prompts the user to download it. The resulting file should be copied over to the micro:bit device just like when using all the other editors. The filename will be the name of the script with spaces replaced by "_" and ending in .py. So "extraordinary script" is saved as extraordinary_script.py.
* code snippets - allow user's to write code from pre-defined Python fragments (functions, loops, if...else etc). They are triggered by typing a keyword followed by TAB. For example, type "wh" followed by TAB to insert a while... loop. Clicking on the code snippets button opens up a modal dialog window containing instructions and a table of the available snippets along with their trigger and a short and simple description.
* help - opens a single page in a new tab that contains user-facing help.

Here are three YouTube demos of early versions of this editor / and
MicroPython:

* https://www.youtube.com/watch?v=6MoBKf3jTIY - this editor running on a local instance of TouchDevelop. This is, ultimately, what we need to integrate with Microsoft. It's very simple to use and pretty much works as advertised.
* https://www.youtube.com/watch?v=duyqxrvDXzU - connecting to the micro:bit and interacting with it via the standard Python REPL. A very 1980's 8 bit feel. It's also a nice demonstration of just how capable MicroPython is. Kudos to Damien for such an amazing feat.
* https://www.youtube.com/watch?v=jCIWY485bx0 - flashing the device with .hex files generated via this editor.

In other TouchDevelop editors there are "compile" and "run" buttons. These
target the TouchDevelop platform to create an AST and either use a third party
service contacted via the network to create a downloadable .hex
file (for the former) or run the code on the embedded simulator (for the
latter).

Since we're targeting MicroPython instead, we simply allow the user to
download their locally generated .hex file. They simply drag the resulting
file onto the device. If you connect to the device (and the script ISN'T in an
infinite loop) you'll be presented with the Python REPL. If there was an error
you should also see an error message.

If you plug in your micro:bit and want to get the REPL you'll need to install
pyserial and run the following command with the appropriate permissions (such
as root, as shockingly demonstrated below)::

    $ sudo python -m serial.tools.miniterm -b 115200 /dev/ttyACM3

Remember to replace tty/ACM3 with the appropriate device for your computer.

The .hex file is generated in the following way:

* A "vanilla" version of the MicroPython hex is hidden within the DOM.
* We take the Python code in the editor and turn it into a hex representation.
* We insert the Python derived hex into the correct place within the MicroPython hex.
* The resulting combination is downloaded onto the user's local filesystem for flashing onto the device.

The hidden MicroPython hex is just over 600k. While this sounds large, it's
relatively small when you consider:

* The Guardian's front page is around 1.5mb
* compression is built into the server
* the web has caching built in (we should trust it)
* we actually want kids to view source and find the .hex file in as raw a form as possible.

Finally, as you'll see, TouchDevelop automatically puts the device simulator to
the right of the editor if there's enough room on the screen. Since we don't
need this functionality we need to replace this with something more
appropriate - perhaps instructions for downloading and flashing MicroPython
onto the micro:bit. We'll need to collaborate with Microsoft (send them a
patch) to make this happen.

Documentation
-------------

For documentation for this project - you're reading it. ;-)

For in-editor documentation aimed at the user, this is to be done but will
encompass both code snippets and generic help in the help.html file.
