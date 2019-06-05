/*
  Tests: Hex files from old versions of the editor should work well

  * Test 1: 1.0.1.hex should load correctly -> 'load-test'
  * Test 2: Hex should be flashed correctly -> 'flash-test'
*/

const puppeteer = require('puppeteer');
const usbutils = require('../src/WebUSB');
const fileutils = require('../src/FileUtils');

async function Run(targetUrl, downloadsDir, device) {

  return new Promise(async function(resolve, reject) {

    try {
      console.log("------------ Old hex test (v1.0.1) ------------");
      console.log("Tests that v1.0.1 hex file can be flashed correctly");
      if (device == null) {
        console.log("> Running test without device");
      } else {
        console.log("> Running test with device");
      }

      // Initialise the tests
      let testStates = {
        "load-test": false,
        "flash-test": null // Optional
      };

      const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']});
      const page = await browser.newPage();
      await page.goto(targetUrl);

      page.on('dialog', async dialog => {
        // If there is an error dialog, fail
        await dialog.accept();
        testStates["load-test"] = false;
      });

      await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: downloadsDir});

      await page.click('#command-load');
      await page.click('.load-drag-target.load-toggle');
      let fileInput = await page.$('[name="load-form-file-upload"]');
      await fileInput.uploadFile('./puppeteer/UploadFiles/OldTest/1.0.1.hex');
      await page.click('[value="Load"]');
      const codeContent = await page.evaluate("window.EDITOR.getCode();");
      if (codeContent.includes("PASS1") && codeContent.length === 32) testStates["load-test"] = true; // Pass of first test, code is loaded successfully

      await page.waitFor(1000); // Wait for error dialog, if there is one

      if (device != null) {
        await page.click('#command-download');

        const downloadListener = fileutils.onDownload(downloadsDir);
        console.log("> Awaiting download...");

        downloadListener.then(async function handle(path) {
          browser.close();
          console.log("> Flashing main hex");
          await usbutils.flashFile(path, device);
        })
        .then(async function () {
          console.log("> Starting serial listen...");
          const serialListener = usbutils.listenForSuccess(device, "PASS1");
          serialListener.then(function (response){
            console.log("> Serial listener finished. Got response: " + response.toString());
            testStates["flash-test"] = (response === 1); // Pass of second test, code is flashed successfully
            resolve(testStates);
          });
        })
        .catch(function() {
          console.log("> Unable to finish test on device");
          browser.close();
          resolve(testStates);
        });
      } else {
        browser.close();
        resolve(testStates);
      }
    } catch (e) {
      if (e.toString().includes("Cannot read property")) {
        console.warn("!! An error occurred. If you've updated the editor, check that you've updated the selectors in the tests.");
      }
      try {
        browser.close();
      }
      finally {
        reject(e);
      }
    }
  });
}

module.exports = {
  Run : Run
}
