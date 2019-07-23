Checklist for Releases
======================

* Update the version number in the editor.html file.
* If the release is for a beta version of the editor, set the "experimental" flag to `true`.
* If the MicroPython runtime is to be updated:
    * Update the firmware.hex file to the correct version.
    * Updated the MicroPython firmware hex string in the editor.html file.
    * Update the MicroPython version string in the editor.html file.
    * Update micropythonapi.js to be up-to-date with the API of the modules included with MicroPython.
* Ensure all CI tests pass
* Run the Manual Test Procedure
* Update the CHANGES.rst file with an English description of all changes made.
* Create a tagged release using GitHub.
