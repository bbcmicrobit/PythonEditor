jest.setTimeout(20000);

async function TestOldHexFiles() {
    return new Promise(async function(resolve, reject) {
        try {
            let hasPassed = false;

            const browser = await global.puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']});
            const page = await browser.newPage();
            await page.goto("http://localhost:5000/editor.html");

            page.on('dialog', async dialog => {
                // If there is an error dialog, fail
                await dialog.accept();
                hasPassed = false;
            });

            await page.click('#command-load');
            await page.click('.load-drag-target.load-toggle');
            let fileInput = await page.$('[name="load-form-file-upload"]');
            await fileInput.uploadFile('./src/1.0.1.hex');
            await page.click('[value="Load"]');
            const codeContent = await page.evaluate("window.EDITOR.getCode();");
            if (codeContent.includes("PASS1") && codeContent.length === 32) hasPassed = true;

            await page.waitFor(3000); // Wait for error dialog, if there is one

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

describe("The editor can load old hex files", function() {

    it("Correctly loads a v1.0.1 hex file", async function() {

        expect.assertions(1);
        const passValue = await TestOldHexFiles();

        expect(passValue).toEqual(true);

    });

});