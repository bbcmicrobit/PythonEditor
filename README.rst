BBC micro:bit MicroPython Editor for TouchDevelop
=================================================

This project is for an editor that targets the MicroPython
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

To build and run the "vanilla" (i.e. non-microbit brandedi) version of
TouchDevelop you'll need to do one of the following:

* To build the site (it's written in Microsoft's TypeScript language [http://www.typescriptlang.org/] that compiles to Javascript)::

    jake

* To build and run locally::

    jake local

* To clean::

    jake clean


Configure TouchDevelop
++++++++++++++++++++++

Copy the file contrib/mbit.html into the www directory in the root of the
TouchDevelop repository. This turns the "vanilla" flavoured TouchDevelop into
something with the micro:bit branding and features available.

Because this modification depends on assets stored at stage.microbit.co.uk you
must log into the staging platform as follows:

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

In the editor/external.ts file at around line 26 where externalEditorsCache
is assigned as a list of objects, ensure you add the following object::

    {
        company: "The Python Software Foundation",
        name: "Python Editor",
        description: "A simple editor for writing MicroPython scripts.",
        id: "ace",
        origin: origin,
        path: path + "python/editor.html",
    }

You're not done yet! TouchDevelop expects its embedded editors to be served
from the same domain it is also running on (usually localhost:4242). To
facilitate this we simply link the root directory of this project into the
www directory of TouchDevelop. In Linux, assuming you remember to change the
paths appropriately, the command is::

    ln -s ~/src/editor ~/src/TouchDevelop/www/python

Please make sure you restart your locally running TouchDevelop instance.

Testing Your Setup
++++++++++++++++++

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
* FileSaver.min.js - https://github.com/eligrey/FileSaver.js/
* jquery-2.1.4.min.js - https://jquery.com/
* python-main.js - JavaScript code needed for the editor to function.
* style.css - based upon Microsoft's own CSS for editor consistency.

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
one on the left indicates the scripts status (changed, saved locally, saved to
the cloud) and the other, shaped like a bug, will display a log of the events
that occured during the current session of using the editor.

All new scripts default to::

    import microbit

... which seems an obvious thing to do.

The layout and functionality apes Microsoft's own editors. Importantly this
includes saving scripts to Microsoft's cloud and sharing them with others via
TouchDevelop's publish functionalty.

The four buttons at the top left, act as follows:

* my scripts - returns you to the main menu listing all your scripts.
* download - downloads the Python code directly to the local filesystem. The filename will be the name of the script with spaces replaced by "_" and ending in .py. So "extraordinary script" is saved as extraordinary_script.py. This is all done locally in the user's browser - no network based services are needed.
* code snippets - currently a stub, will allow user's to write code from pre-defined Python fragments (functions, loops, if...else etc).
* help - currently a stub, Python specific help will be available from here.

In other editors there are "compile" and "run" buttons. These target the
TouchDevelop platform to create an AST and either use a third party service
contacted via the network to create a downloadable .hex
file (for the former) or run the code on the embedded simulator (for the
latter).

Since we're targeting MicroPython we simply allow the user to download their
script. They simply drag the resulting file onto the device (that's already
been flashed with MicroPython).

As you'll see, TouchDevelop automatically puts the device simulator to the
right of the editor if there's enough room on the screen. Since we don't need
this functionality we need to replace this with something more appropriate -
perhaps instructions for downloading and flashing MicroPython onto the
micro:bit. We'll need to collaborate with Microsoft (send them a patch) to
make this happen.

Documentation
-------------

For documentation for this project - you're reading it. ;-)

For in-editor documentation aimed at the user, this is to be done but will
encompass both code snippets and generic help.
