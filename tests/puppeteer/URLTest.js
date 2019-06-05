/*
  Tests: LZMA projects can be loaded by URL

  * Test 1: Project can be loaded from URL successfully -> 'load-test'
*/

const puppeteer = require('puppeteer');

async function Run(targetUrl, downloadsDir, device) {

  return new Promise(async function(resolve, reject) {

    try {
      console.log("------------ URL test ------------");
      console.log("Tests that projects can be loaded by URL");
      if (device == null) {
        console.log("> Running test without device");
      } else {
        console.log("> Running test with device");
      }

      // Initialise the tests
      let testStates = {
        "load-test": false
      };

      const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']});
      const page = await browser.newPage();
      
      const projectURL = targetUrl + "?#project:XQAAgAApAQAAAAAAAAA9gn0iDP5hOXUMBZ4M1sxt7nhTa/UMRecCSq6uHLM44uVEs1hTA1G/Oa3Hy9fjvqw9MOrrvyqKstR9g9oq4yc4pkk1m9E2hvucCCCVEeUdb6bwT0S5asuGStzirbKaXcmYjTAskliKk/1v60vUCxCI/fc8ZUstwqzchTG2zAzzDii/EzhUsce8bjtDMg+OOMAzY03WeyEN6x5Z3bkVA20HbuSfofyGzVIlKfTxKeZlZVU2Wt3DdOqe1ccGelN7y0dADIpV19vKoZ9AWI8K4l3FkQQ43EIIM/vyyq0+JjpgrLhtSv/8Ma+A";
      await page.goto(projectURL);
      
      const codeContent = await page.evaluate("window.EDITOR.getCode();");
      if (codeContent.includes("Test passed!") && codeContent.length === 111) testStates["load-test"] = true;

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
