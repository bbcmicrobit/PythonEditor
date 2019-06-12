jest.setTimeout(20000);

describe("An editor for MicroPython running at localhost.", function() {

    beforeAll(async() => {
        global.browser = await global.puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']});
    });

    afterAll(async() => {
        global.browser.close();
    });

    it("Correctly loads a script from an import URL.", async function() {

        const page = await global.browser.newPage();
        const projectURL = "http://localhost:5000/editor.html?#project:XQAAgAApAQAAAAAAAAA9gn0iDP5hOXUMBZ4M1sxt7nhTa/UMRecCSq6uHLM44uVEs1hTA1G/Oa3Hy9fjvqw9MOrrvyqKstR9g9oq4yc4pkk1m9E2hvucCCCVEeUdb6bwT0S5asuGStzirbKaXcmYjTAskliKk/1v60vUCxCI/fc8ZUstwqzchTG2zAzzDii/EzhUsce8bjtDMg+OOMAzY03WeyEN6x5Z3bkVA20HbuSfofyGzVIlKfTxKeZlZVU2Wt3DdOqe1ccGelN7y0dADIpV19vKoZ9AWI8K4l3FkQQ43EIIM/vyyq0+JjpgrLhtSv/8Ma+A";
        await page.goto(projectURL);

        let hasLoadedContent = false;
        const codeContent = await page.evaluate("window.EDITOR.getCode();");
        if (codeContent.includes("Test passed!") && codeContent.length === 111) hasLoadedContent = true;
        await page.close();

        expect(hasLoadedContent).toEqual(true);

    });

    it("Shows an error dialog when loading a MakeCode hex file", async function() {

        const page = await global.browser.newPage();
        await page.goto("http://localhost:5000/editor.html");

        let hasShownError = false;
        page.on('dialog', async dialog => {
            if (dialog.message().includes("couldn't recognise this file")) hasShownError = true;
            await dialog.accept();
        });
        await page.click('#command-load');
        await page.click('.load-drag-target.load-toggle');
        let fileInput = await page.$('[name="load-form-file-upload"]');
        await fileInput.uploadFile('./src/makecode.hex');
        await page.click('[value="Load"]');
        await page.waitFor(2000);
        await page.close();

        expect(hasShownError).toEqual(true);

    });

    it("Correctly loads a v1.0.1 hex file", async function() {

        const page = await global.browser.newPage();
        await page.goto("http://localhost:5000/editor.html");

        let hasLoadedV101Hex = false;
        page.on('dialog', async dialog => {
            await dialog.accept();
            hasLoadedV101Hex = false;
        });
        await page.click('#command-load');
        await page.click('.load-drag-target.load-toggle');
        let fileInput = await page.$('[name="load-form-file-upload"]');
        await fileInput.uploadFile('./src/1.0.1.hex');
        await page.click('[value="Load"]');
        const codeContent = await page.evaluate("window.EDITOR.getCode();");
        if (codeContent.includes("PASS1") && codeContent.length === 32) hasLoadedV101Hex = true;
        await page.waitFor(2000);
        await page.close();

        expect(hasLoadedV101Hex).toEqual(true);

    });

    it("Correctly loads a v0.9 hex file", async function() {

        const page = await global.browser.newPage();
        await page.goto("http://localhost:5000/editor.html");

        let hasLoadedV09Hex = false;
        page.on('dialog', async dialog => {
            await dialog.accept();
            hasLoadedV09Hex = false;
        });
        await page.click('#command-load');
        await page.click('.load-drag-target.load-toggle');
        let fileInput = await page.$('[name="load-form-file-upload"]');
        await fileInput.uploadFile('./src/0.9.hex');
        await page.click('[value="Load"]');
        const codeContent = await page.evaluate("window.EDITOR.getCode();");
        if (codeContent.includes("PASS2") && codeContent.length === 31) hasLoadedV09Hex = true;
        await page.waitFor(2000);
        await page.close();

        expect(hasLoadedV09Hex).toEqual(true);

    });

});