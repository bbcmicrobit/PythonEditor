// file system module to perform file operations
const path = require('path');
const fs = require('fs');

// Directory for working with downloaded translations
var directoryPath = '../translation/translations/';

//Passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    filesList = files.filter(function(e){
        return path.extname(e).toLowerCase() === '.json'
      });
    // Parse JSON data forEach file
    filesList.forEach(function (file) {
        fs.readFile(directoryPath + file, "utf8", function read(err, data) {
        if (err) {
        console.log("An error occured while reading the file");
        return console.log(err);
        }
        jsonContent = JSON.stringify(data);
        var jsContent = JSON.parse(jsonContent, null, 2);
        var jsFile = file.substr(0, file.lastIndexOf(".")) + ".js";
        fs.writeFile( directoryPath + jsFile, 'var language = ' + jsContent + '; \n', 'utf8', function (err) {
            if (err) {
            console.log("An error occured while writing JSON String to Object");
            return console.log(err);
            }
        });
 
    console.log(jsFile + " has been saved.");
    });
    });
});