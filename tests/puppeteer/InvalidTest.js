/*
  Tests: Adding invalid files
  - Trying to load an invalid hex file (e.g. from MakeCode) should display an understandable error message.

  * Test 1: Loading an invalid hex file shows an error message -> 'invalid-test'
*/

const puppeteer = require('puppeteer');

async function Run(targetUrl, downloadsDir, device) {

  return new Promise(async function(resolve, reject) {

    try {
      console.log("------------ Invalid test ------------");
      console.log("Tests that adding invalid files gives an error");
      if (device == null) {
        console.log("> Running test without device");
      } else {
        console.log("> Running test with device");
      }

      // Initialise the tests
      let testStates = {
        "invalid-test": false
      };

      const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']});
      const page = await browser.newPage();
      await page.goto(targetUrl);

      page.on('dialog', async dialog => {
        if (dialog.message().includes("couldn't recognise this file")) testStates["invalid-test"] = true; // Pass of first test, that we get an error dialog when loading an invalid (makecode) hex file
        await dialog.accept();
      });

      await page.click('#command-load');
      await page.click('.load-drag-target.load-toggle');
      let fileInput = await page.$('[name="load-form-file-upload"]');
      await fileInput.uploadFile('./puppeteer/UploadFiles/InvalidTest/makecode.hex');
      await page.click('[value="Load"]');

      await page.waitFor(1000); // Wait for the dialog

      browser.close();
      resolve(testStates);
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
