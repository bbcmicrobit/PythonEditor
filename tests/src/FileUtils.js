/*
  Download listener; listens for a downloaded file and returns the filename
*/

const fs = require('fs');

async function onDownload(downloadsDir){
  return new Promise(function(resolve, reject){
    timeout = setTimeout(function(){reject("Download was unsuccessful, please retry test.");}, 10000);
    fs.watch(downloadsDir, (eventType, filename) => {
      if (!filename.includes(".crdownload")){
        const downloaded = filename;
        const path = downloadsDir + downloaded;
        clearTimeout(timeout);
        resolve(path);
      }
    });
  });
}

module.exports = {
  onDownload : onDownload
}
