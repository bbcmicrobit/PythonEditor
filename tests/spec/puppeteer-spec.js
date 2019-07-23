jest.setTimeout(20000);

describe("Puppeteer basic tests for the Python Editor.", function() {

    beforeAll(async() => {
        // Setup a headless Chromium browser.
        // Flags allow Puppeteer to run within a container.
        global.browser = await global.puppeteer.launch({headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]});
    });

    afterAll(async() => {
        global.browser.close();
    });

    it("Correctly loads a script from an import URL.", async function() {
        const page = await global.browser.newPage();
        const projectURL = "http://localhost:5000/editor.html?#project:XQAAgAApAQAAAAAAAAA9gn0iDP5hOXUMBZ4M1sxt7nhTa/UMRecCSq6uHLM44uVEs1hTA1G/Oa3Hy9fjvqw9MOrrvyqKstR9g9oq4yc4pkk1m9E2hvucCCCVEeUdb6bwT0S5asuGStzirbKaXcmYjTAskliKk/1v60vUCxCI/fc8ZUstwqzchTG2zAzzDii/EzhUsce8bjtDMg+OOMAzY03WeyEN6x5Z3bkVA20HbuSfofyGzVIlKfTxKeZlZVU2Wt3DdOqe1ccGelN7y0dADIpV19vKoZ9AWI8K4l3FkQQ43EIIM/vyyq0+JjpgrLhtSv/8Ma+A";
        await page.goto(projectURL);

        const codeContent = await page.evaluate("window.EDITOR.getCode();");
        const codeName = await page.evaluate("$('#script-name').val()");
        await page.close();

        expect(codeContent).toHaveLength(111);
        expect(codeContent).toContain("Test passed!");
        expect(codeName).toEqual("unearthly script 2");
    });

    it("Shows an error dialog when loading a MakeCode hex file", async function() {
        const page = await global.browser.newPage();
        await page.goto("http://localhost:5000/editor.html");

        let hasShownError = false;
        page.on("dialog", async dialog => {
            if (dialog.message().includes("Could not find valid Python code")) hasShownError = true;
            await dialog.accept();
        });
        await page.click("#command-files");
        await page.click(".load-drag-target.load-toggle");
        let fileInput = await page.$("[name='load-form-file-upload']");
        await fileInput.uploadFile("./spec/test-files/makecode.hex");
        for (let ms=0; ms<100; ms++) {
            if (hasShownError) break;
            await page.waitFor(10);
        }
        await page.close();

        expect(hasShownError).toEqual(true);
    });

    it("Correctly loads a v1.0.1 hex file", async function() {
        const page = await global.browser.newPage();
        await page.goto("http://localhost:5000/editor.html");
        const initialCode = await page.evaluate("window.EDITOR.getCode();");
        let codeContent = "";

        await page.click("#command-files");
        await page.click(".load-drag-target.load-toggle");
        let fileInput = await page.$("[name='load-form-file-upload']");
        await fileInput.uploadFile("./spec/test-files/1.0.1.hex");
        for (let ms=0; ms<100; ms++) {
            codeContent = await page.evaluate("window.EDITOR.getCode();");
            if (codeContent != initialCode) break;
            await page.waitFor(10);
        }
        const codeName = await page.evaluate("$('#script-name').val()");
        await page.close();

        expect(codeContent).toHaveLength(32);
        expect(codeContent).toContain("PASS1");
        expect(codeName).toEqual("1.0.1");
    });

    it("Correctly loads a v0.9 hex file", async function() {

        const page = await global.browser.newPage();
        await page.goto("http://localhost:5000/editor.html");
        const initialCode = await page.evaluate("window.EDITOR.getCode();");
        let codeContent = "";

        await page.click("#command-files");
        await page.click(".load-drag-target.load-toggle");
        let fileInput = await page.$("[name='load-form-file-upload']");
        await fileInput.uploadFile("./spec/test-files/0.9.hex");
        for (let ms=0; ms<100; ms++) {
            codeContent = await page.evaluate("window.EDITOR.getCode();");
            if (codeContent != initialCode) break;
            await page.waitFor(10);
        }
        const codeName = await page.evaluate("$('#script-name').val()");
        await page.close();

        expect(codeContent).toHaveLength(31);
        expect(codeContent).toContain("PASS2");
        expect(codeName).toEqual("0.9");
    });

    it("Shows an error when trying to download a Hex file if the Python code us too large", async function() {
        const page = await global.browser.newPage();
        await page.goto("http://localhost:5000/editor.html");
        const initialCode = await page.evaluate("window.EDITOR.getCode();");
        const initialName = await page.evaluate("document.getElementById('script-name').value");
        let codeContent = "";
        let rejectedLargeFileLoad = false;
        let rejectedLargeHexDownload = false;
        const fileRejected = async (dialog) => {
            if (dialog.message().includes("Not enough space")) {
                rejectedLargeFileLoad = true;
            }
            await dialog.accept();
        };

        page.on("dialog", fileRejected);
        await page.click("#command-files");
        const fileInput = await page.$("#file-upload-input");
        // A Python file will be loaded into the editor even if it's too large
        await fileInput.uploadFile("./spec/test-files/too-large.py");
        for (let ms=0; ms<100; ms++) {
            codeContent = await page.evaluate("window.EDITOR.getCode();");
            if (codeContent != initialCode) break;
            await page.waitFor(10);
        }
        const codeName = await page.evaluate("document.getElementById('script-name').value");
        // TODO: WHY is this wait necessary??
        await page.waitFor(1000);
        // But when we try to downlod the hex, we get an expected error
        page.removeListener("dialog", fileRejected);
        page.on("dialog", async (dialog) => {
            if (dialog.message().includes("Not enough space")) {
                rejectedLargeHexDownload = true;
            }
            await dialog.accept();
        });
        await page.click("#command-download");
        for (let ms=0; ms<100; ms++) {
            if (rejectedLargeHexDownload) break;
            await page.waitFor(10);
        }
        await page.close();

        expect(rejectedLargeFileLoad).toEqual(false);
        expect(codeContent).not.toEqual(initialCode);
        expect(codeContent).toHaveLength(27216);    // Max size = ([27 * 1024] * [126 / 128])
        expect(codeContent).toContain("# Filler");
        expect(rejectedLargeHexDownload).toEqual(true);
        expect(codeName).toEqual("too-large");
    });

});
