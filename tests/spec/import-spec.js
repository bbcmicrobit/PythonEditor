jest.setTimeout(10000);

async function TestScriptImport() {
    return new Promise(async function(resolve, reject) {
        try {
            let hasPassed = false;

            const browser = await global.puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']});
            const page = await browser.newPage();
            
            const projectURL = "http://localhost:5000/editor.html?#project:XQAAgAApAQAAAAAAAAA9gn0iDP5hOXUMBZ4M1sxt7nhTa/UMRecCSq6uHLM44uVEs1hTA1G/Oa3Hy9fjvqw9MOrrvyqKstR9g9oq4yc4pkk1m9E2hvucCCCVEeUdb6bwT0S5asuGStzirbKaXcmYjTAskliKk/1v60vUCxCI/fc8ZUstwqzchTG2zAzzDii/EzhUsce8bjtDMg+OOMAzY03WeyEN6x5Z3bkVA20HbuSfofyGzVIlKfTxKeZlZVU2Wt3DdOqe1ccGelN7y0dADIpV19vKoZ9AWI8K4l3FkQQ43EIIM/vyyq0+JjpgrLhtSv/8Ma+A";
            await page.goto(projectURL);
            
            const codeContent = await page.evaluate("window.EDITOR.getCode();");
            if (codeContent.includes("Test passed!") && codeContent.length === 111) hasPassed = true;

            browser.close();
            resolve(hasPassed);
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

describe("The editor can load scripts", function() {

    it("Correctly loads a script from an import URL", async function() {

        expect.assertions(1);
        const passValue = await TestScriptImport();

        expect(passValue).toEqual(true);

    });

});