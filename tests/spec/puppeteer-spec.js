const fs = require("fs");
const puppeteer = require("puppeteer");

jest.setTimeout(20000);

describe("Puppeteer basic tests for the Python Editor.", function() {
    "use strict";

    let browser = null;

    beforeAll(async() => {
        // Setup a headless Chromium browser.
        // Flags allow Puppeteer to run within a container.
        browser = await puppeteer.launch({headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]});
    });

    afterAll(async() => {
        browser.close();
    });

    it("Correctly loads a script from an import URL.", async function() {
        const page = await browser.newPage();
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
        const page = await browser.newPage();
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
        const page = await browser.newPage();
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
        const page = await browser.newPage();
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

    it("Shows an error when trying to download a Hex file if the Python code is too large", async function() {
        const page = await browser.newPage();
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
        // But when we try to download the hex, we get an expected error
        page.removeListener("dialog", fileRejected);
        page.on("dialog", async (dialog) => {
            if (dialog.message().includes("There is no storage space left.")) {
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

    it("Saves a python file with the correct filename", async function(){
        if (fs.existsSync("./spec/test-files/temp-test-files/program_test.py")) {
            fs.unlinkSync("./spec/test-files/temp-test-files/program_test.py");
        }
        const page = await browser.newPage();
        await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: './spec/test-files/temp-test-files'});
        await page.goto("http://localhost:5000/editor.html");

        await page.evaluate( () => document.getElementById("script-name").value = "program test")
        const scriptName = await page.evaluate("document.getElementById('script-name').value");
        for (let ms=0; ms<100; ms++) {
            if (scriptName === "program test") break;
            await page.waitFor(10);
        }
        await page.click("#command-files");
        await page.click("#show-files");
        await page.click(".save-button.save");
        await page.waitFor(1000); //waiting to ensure file is saved
        const fileExists = fs.existsSync("./spec/test-files/temp-test-files/program_test.py");
        fs.unlinkSync("./spec/test-files/temp-test-files/program_test.py");

        expect(fileExists).toBeTruthy();
    });

    it("Correctly handles an mpy file", async function(){
        const page = await browser.newPage();
        await page.goto("http://localhost:5000/editor.html");
        await page.click("#command-files");
        let fileInput = await page.$("#file-upload-input");
        await fileInput.uploadFile("./spec/test-files/samplempyfile.mpy");
        const modalContent = await page.evaluate("$('#modal-msg-content').text()");
        const modalDisplay = await page.evaluate("$('#modal-msg-overlay-container').css('display')");
        expect(modalContent).toContain("This version of the Python Editor doesn\'t currently support adding .mpy files.");
        expect(modalDisplay).toContain("block");
    });

    it("Correctly handles a file with an invalid extension", async function(){
        const page = await browser.newPage();
        await page.goto("http://localhost:5000/editor.html");
        await page.click("#command-files");
        let fileInput = await page.$("#file-upload-input");
        await fileInput.uploadFile("./spec/test-files/sampletxtfile.txt");
        const modalContent = await page.evaluate("$('#modal-msg-content').text()");
        const modalDisplay = await page.evaluate("$('#modal-msg-overlay-container').css('display')");
        expect(modalContent).toContain("The Python Editor can only load files with the .hex or .py extensions.");
        expect(modalDisplay).toContain("block");
    });
});
