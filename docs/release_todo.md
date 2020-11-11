# Checklist for Releases

* Update the Python Editor version number in the editor.html file.
* Round-trip the translations
* If the release is for a beta version of the editor, set the "experimental" flag to `true`.
* If the MicroPython runtime is to be updated:
    * Update the firmware hex file from the `micropython` folder to the correct version.
    * Update the MicroPython version string in the editor.html file.
    * Update micropythonapi.js to be up-to-date with the API of the modules included with MicroPython.
* Ensure all CI tests pass
* Run the jasmine (help.html) tests
* Run the Manual Test Procedure
* Update the CHANGELOG file with an English description of all changes made.
* Create a tagged release using GitHub.
