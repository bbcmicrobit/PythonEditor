const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

jest.setTimeout(30000);

describe("Puppeteer basic tests for the Python Editor.", function() {
    "use strict";

    let browser = null;

    beforeAll(async() => {
        // Setup a headless Chromium browser.
        // Flags allow Puppeteer to run within a container.
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
        });
    });

    afterAll(async() => {
        browser.close();
    });

    async function getEditorPage() {
        const page = await browser.newPage();
        let fsLoaded = false;
        page.on('console', (msg) => {
            const msgTxt = msg.text();
            if (msgTxt == 'FS fully initialised') {
                fsLoaded = true;
            } else {
                // console.log('PAGE LOG:', msgTxt);
            }
        });
        await page.goto("http://localhost:5000/editor.html");
        while (!fsLoaded) {
            await page.waitForTimeout(5);
        }
        // The following two lines enable CPU throttling
        // const client = await page.target().createCDPSession();
        // await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
        return page;
    }

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
        const page = await getEditorPage();

        let hasShownError = false;
        page.on("dialog", async dialog => {
            if (dialog.message().includes("Could not find valid Python code")) {
                hasShownError = true;
            }
            await dialog.accept();
        });
        await page.click("#command-files");
        await page.click(".load-drag-target.load-toggle");
        let fileInput = await page.$("[name='load-form-file-upload']");
        await fileInput.uploadFile("./spec/test-files/makecode.hex");
        while (!hasShownError) {
            await page.waitForTimeout(100);
        }
        await page.close();

        expect(hasShownError).toEqual(true);
    });

    it("Correctly loads a v1.0.1 hex file", async function() {
        const page = await getEditorPage();
        const initialCode = await page.evaluate("window.EDITOR.getCode();");

        await page.click("#command-files");
        await page.click(".load-drag-target.load-toggle");
        let fileInput = await page.$("[name='load-form-file-upload']");
        await fileInput.uploadFile("./spec/test-files/1.0.1.hex");
        let codeContent = await page.evaluate("window.EDITOR.getCode();");
        while (codeContent === initialCode) {
            await page.waitForTimeout(10);
            codeContent = await page.evaluate("window.EDITOR.getCode();");
        }
        const codeName = await page.evaluate("$('#script-name').val()");
        await page.close();

        expect(codeContent).toHaveLength(32);
        expect(codeContent).toContain("PASS1");
        expect(codeName).toEqual("1.0.1");
    });

    it("Correctly loads a v0.9 hex file", async function() {
        const page = await getEditorPage();
        const initialCode = await page.evaluate("window.EDITOR.getCode();");

        await page.click("#command-files");
        await page.click(".load-drag-target.load-toggle");
        let fileInput = await page.$("[name='load-form-file-upload']");
        await fileInput.uploadFile("./spec/test-files/0.9.hex");
        let codeContent = await page.evaluate("window.EDITOR.getCode();");
        while (codeContent === initialCode) {
            await page.waitForTimeout(10);
            codeContent = await page.evaluate("window.EDITOR.getCode();");
        }
        const codeName = await page.evaluate("$('#script-name').val()");
        await page.close();

        expect(codeContent).toHaveLength(31);
        expect(codeContent).toContain("PASS2");
        expect(codeName).toEqual("0.9");
    }, 45 * 1000);

    it("Shows an error when trying to download a Hex file if the Python code is too large", async function() {
        const page = await getEditorPage();
        const initialCode = await page.evaluate("window.EDITOR.getCode();");
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
        let codeContent = await page.evaluate("window.EDITOR.getCode();");
        while (codeContent === initialCode) {
            await page.waitForTimeout(10);
            codeContent = await page.evaluate("window.EDITOR.getCode();");
        }
        const codeName = await page.evaluate("document.getElementById('script-name').value");
        // TODO: WHY is this wait necessary??
        await page.waitForTimeout(1000);
        // But when we try to download the hex, we get an expected error
        page.removeListener("dialog", fileRejected);
        page.on("dialog", async (dialog) => {
            if (dialog.message().includes("There is no storage space left.")) {
                rejectedLargeHexDownload = true;
            }
            await dialog.accept();
        });
        await page.click("#command-download");
        while (!rejectedLargeHexDownload) {
            await page.waitForTimeout(10);
        }
        await page.close();

        expect(rejectedLargeFileLoad).toEqual(false);
        expect(codeContent).not.toEqual(initialCode);
        expect(codeContent).toHaveLength(27216);    // Max size = ([27 * 1024] * [126 / 128])
        expect(codeContent).toContain("# Filler");
        expect(rejectedLargeHexDownload).toEqual(true);
        expect(codeName).toEqual("too-large");
    });

    it("Saves a python file with the correct filename", async function() {
        const downloadFolder = path.join(process.cwd(), "spec", "test-files", "temp-test-files");
        const filePath = path.join(downloadFolder, "program_test.py");
        if (!fs.existsSync(downloadFolder)) fs.mkdirSync(downloadFolder);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        const page = await getEditorPage();
        await page._client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: downloadFolder
        });

        await page.evaluate(() => document.getElementById("script-name").value = "program test")
        for (let ms = 0; ms < 100; ms++) {
            let scriptName = await page.evaluate("document.getElementById('script-name').value");
            if (scriptName === "program test") break;
            await page.waitForTimeout(10);
        }
        await page.click("#command-files");
        await page.click("#show-files");
        await page.waitForTimeout(100);
        await page.click(".save-button.save");
        await page.waitForTimeout(500);    // waiting to ensure file is saved
        const fileExists = fs.existsSync(filePath);
        fs.unlinkSync(filePath);
        fs.rmdirSync(downloadFolder);
        await page.close();

        expect(fileExists).toBeTruthy();
    });

    it("Correctly handles an mpy file", async function(){
        const page = await getEditorPage();

        await page.click("#command-files");
        let fileInput = await page.$("#file-upload-input");
        await fileInput.uploadFile("./spec/test-files/samplempyfile.mpy");
        await page.waitForSelector("#modal-msg-content", { visible: true });
        await page.waitForTimeout(5);
        const modalContent = await page.evaluate("$('#modal-msg-content').text()");
        const modalDisplay = await page.evaluate("$('#modal-msg-overlay-container').css('display')");
        await page.close();

        expect(modalContent).toContain("This version of the Python Editor doesn\'t currently support adding .mpy files.");
        expect(modalDisplay).toContain("block");
    }, 45 * 1000);

    it("Correctly handles a file with an invalid extension", async function(){
        const page = await getEditorPage();

        await page.click("#command-files");
        let fileInput = await page.$("#file-upload-input");
        await fileInput.uploadFile("./spec/test-files/sampletxtfile.txt");
        await page.waitForSelector("#modal-msg-content", { visible: true });
        await page.waitForTimeout(5);
        const modalContent = await page.evaluate("$('#modal-msg-content').text()");
        const modalDisplay = await page.evaluate("$('#modal-msg-overlay-container').css('display')");
        await page.close();

        expect(modalContent).toContain("The Python Editor can only load files with the .hex or .py extensions.");
        expect(modalDisplay).toContain("block");
    }, 45 * 1000);
});
