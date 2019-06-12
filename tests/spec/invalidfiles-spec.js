jest.setTimeout(20000);

async function TestInvalidFiles() {
    return new Promise(async function(resolve, reject) {
        try {
            let hasPassed = false;
            
            const browser = await global.puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']});
            const page = await browser.newPage();
            await page.goto("http://localhost:5000/editor.html");

            page.on('dialog', async dialog => {
                if (dialog.message().includes("couldn't recognise this file")) hasPassed = true;
                await dialog.accept();
            });

            await page.click('#command-load');
            await page.click('.load-drag-target.load-toggle');
            let fileInput = await page.$('[name="load-form-file-upload"]');
            await fileInput.uploadFile('./src/makecode.hex');
            await page.click('[value="Load"]');
            await page.waitFor(2000);

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

describe("The editor shows an error dialog when loading invalid files", function() {

    it("Shows an error dialog when loading a MakeCode hex file", async function() {

        expect.assertions(1);
        const passValue = await TestInvalidFiles();

        expect(passValue).toEqual(true);

    });

});