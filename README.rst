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

To build and run the "vanilla" (i.e. non-microbit branded version of
TouchDevelop) you'll need to do one of the following:

* To build the site (it's written in Microsoft's TypeScript language
[http://www.typescriptlang.org/] that compiles to Javascript)::

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

You must log into the staging platform as follows:

19 point instructions.... :-((((

Assuming you have TouchDevelop running locally, you'll be able to see the
micro:bit version of the site here:

http://localhost:4242/editor/local/mbit.html?lite=stage.microbit.co.uk

Configure the Editor
++++++++++++++++++++

This::

    {
        company: "The Python Software Foundation",
        name: "Python Editor",
        description: "A simple editor for writing MicroPython scripts.",
        id: "ace",
        origin: "http://localhost:8000/",
        path: "editor.html",
        icon: ""
    }

Test
++++

Code
++++

Usage
-----

Documentation
-------------

