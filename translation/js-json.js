// file system module to perform file operations
const fs = require('fs');

var sourceFile = require('../lang/en.js');
 
// Javascript object to process
var jsData = sourceFile.language;
 
// Create JSON string from object
var jsonContent = JSON.stringify(jsData); 
fs.writeFile("./en.json", jsonContent, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }
 
    console.log("JSON file has been saved.");
}); 