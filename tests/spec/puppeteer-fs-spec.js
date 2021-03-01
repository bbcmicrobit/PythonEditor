const fs = require("fs");
const tmp = require("tmp");
const puppeteer = require("puppeteer");

describe("Puppeteer filesystem tests for the Python Editor.", function() {
    "use strict";

    const msStep = 100;
    let browser = null;

    beforeAll(async () => {
        // Setup a headless Chromium browser.
        // Flags allow Puppeteer to run within a container.
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]
        });
    });

    afterAll(async () => {
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

    it("Can store the correct number of small files in the filesystem", async function() {
        const page = await getEditorPage();
        // We expect to be able to add 160 small files to the fs (ignoring main.py)
        const expectedFileLimit = 159;
        let fileNameList = [];
        let fileCleanUps = [];

        await page.click("#command-files");
        const fileInput = await page.$("#fs-file-upload-input");
        // Create small1.py -> small159.py (160 small files)
        for (let i = 1; i <= expectedFileLimit; i++) {
            var tmpFile = tmp.fileSync({ prefix: 'small' + i + '-', postfix: '.py' });
            fs.writeFileSync(tmpFile.fd, `# Empty Python file < 128 bytes small${i}.py`);
            fs.closeSync(tmpFile.fd);
            fileNameList.push(tmpFile.name);
            fileCleanUps.push(tmpFile.removeCallback);
        }
        // Set up a listener for the dialog that will tell us fs is full
        let fileLimit = 0;
        page.on("dialog", async dialog => {
            await dialog.accept();
            if (dialog.message().includes("There is no storage space left.")) {
                // Get the number of files (the error warns that we can't add the 215th file, 
                // but we expect 215 files as there are 214 small.py files + main.py)
                fileLimit = parseInt(dialog.message().split("small")[1].split("-")[0]);
            } else {
                console.error("Unexpected dialog msg:", dialog.message());
            }
        });
        console.log("> Uploading files (this may take some time)...");
        await fileInput.uploadFile(...fileNameList);
        // fileLimit changes on the dialog above, if it doesn't jest times out
        while (fileLimit === 0) {
            await page.waitForTimeout(msStep);
        }
        await page.close();
        fileCleanUps.forEach(function(removeCallback) {
            removeCallback();
        });

        expect(fileLimit).toEqual(expectedFileLimit);
    }, 10 * 60 * 1000);

    it("Can store one large file in the filesystem", async function() {
        const page = await getEditorPage();
        const initialCode = await page.evaluate("window.EDITOR.getCode();");
        let codeContent = "";
        let errorOnDownload = false;

        await page.click("#command-files");
        const fileInput = await page.$("#file-upload-input");
        await fileInput.uploadFile("./spec/test-files/large-20k.py");
        for (let ms = 0; ms < 4000; ms += msStep) {
            codeContent = await page.evaluate("window.EDITOR.getCode();");
            if (codeContent != initialCode) break;
            await page.waitForTimeout(msStep);
        }
        page.on("dialog", async dialog => {
            if (dialog.message().includes("enough space")) {
                errorOnDownload = true;
            } else {
                console.error("Unexpected dialog message received:", dialog.message());
            }
            await dialog.accept();
        });
        await page.click("#command-download");
        const codeName = await page.evaluate("document.getElementById('script-name').value");
        await page.close();

        // Max filesize = ([27 * 1024] * [126 / 128])
        // We use a slightly smaller file (as this doesn't fully compensate for headers)
        expect(codeContent).toHaveLength(20141);
        expect(codeContent).toContain("import love");
        expect(codeName).toEqual("large-20k");
        expect(errorOnDownload).toBeFalsy();
    }, 30 * 1000);

    it("Shows an error when loading a file to the filesystem that is too large", async function() {
        const page = await getEditorPage();
        const initialCode = await page.evaluate("window.EDITOR.getCode();");
        const initialName = await page.evaluate("document.getElementById('script-name').value");
        let codeContent = "";
        let rejectedLargeFileLoad = false;

        page.on("dialog", async (dialog) => {
            if (dialog.message().includes("There is no storage space left.")) {
                rejectedLargeFileLoad = true;
            }
            await dialog.accept();
        });
        await page.click("#command-files");
        const fileInput = await page.$("#fs-file-upload-input");
        await fileInput.uploadFile("./spec/test-files/too-large.py");
        for (let ms=0; ms < 1000; ms++) {
            if (rejectedLargeFileLoad) break;
            await page.waitForTimeout(10);
        }
        codeContent = await page.evaluate("window.EDITOR.getCode();");
        const codeName = await page.evaluate("document.getElementById('script-name').value");
        await page.close();

        expect(rejectedLargeFileLoad).toEqual(true);
        expect(codeContent).toEqual(initialCode);
        expect(codeContent).not.toContain("# Filler");
        expect(codeName).toEqual(initialName);
        expect(codeName).not.toEqual("main");
    }, 60 * 1000);

    it("Correctly loads files via the load modal", async function() {
        const page = await getEditorPage();
        const initialCode = await page.evaluate("window.EDITOR.getCode();");
        let mainPyWarningDialogShows = false;
        let codeOnCancel = "";
        let codeOnAccept = "";
        let fileListContents = "";
        let hasAttemptedCancel = false;

        await page.click("#command-files");
        const fileInput = await page.$("#fs-file-upload-input");
        page.on("dialog", async dialog => {
            if (dialog.message().includes("Adding a main.py file will replace the code in the editor!")) {
                mainPyWarningDialogShows = true;
                if (!hasAttemptedCancel){
                    // Ensure that pressing 'Cancel' doesn't replace code contents
                    await dialog.dismiss();
                    await page.waitForTimeout(10);
                    codeOnCancel = await page.evaluate("window.EDITOR.getCode();");
                    hasAttemptedCancel = true;
                    await fileInput.uploadFile("./spec/test-files/main.py");
                } else {
                    // Ensure that pressing 'Accept' does replace code contents
                    await dialog.accept();
                    await page.waitForTimeout(10);
                    codeOnAccept = await page.evaluate("window.EDITOR.getCode();");
                    fileListContents = await page.evaluate("$('#fs-file-list').html()");
                }
            }
        });
        await fileInput.uploadFile("./spec/test-files/main.py");
        while (fileListContents == "") {
            await page.waitForTimeout(msStep);
        }
        await page.close();

        expect(mainPyWarningDialogShows).toEqual(true);
        expect(codeOnCancel).toEqual(initialCode);
        expect(codeOnAccept).not.toEqual(initialCode);
        expect(codeOnAccept).toContain("PASS");
        expect(fileListContents).toContain("main.py");
    }, 60 * 1000);

    it("Correctly imports modules with the 'magic comment' in the filesystem.", async function() {
        const page = await getEditorPage();
        const initialContent = await page.evaluate("window.EDITOR.getCode();");
        let fileInput = undefined;
        page.on("dialog", async dialog => {
            await dialog.accept();
        });

        await page.click("#command-files");
        fileInput = await page.$("#file-upload-input");
        await fileInput.uploadFile("./spec/test-files/firstline.py");
        await page.click("#command-files");
        const magicFirstlineContent = await page.evaluate("window.EDITOR.getCode();");
        const magicFirstlineName = await page.evaluate("document.getElementById('script-name').value");
        await page.waitForTimeout(500);
        await page.click("#command-files");
        fileInput = await page.$("#file-upload-input");
        await fileInput.uploadFile("./spec/test-files/secondline.py");
        await page.click("#command-files");
        const magicSecondlineContent = await page.evaluate("window.EDITOR.getCode();");
        const magicSecondlineName = await page.evaluate("document.getElementById('script-name').value");
        await page.waitForTimeout(500);
        await page.click("#command-files");
        fileInput = await page.$("#file-upload-input");
        await fileInput.uploadFile("./spec/test-files/thirdline.py");
        await page.click("#command-files");
        const magicThirdlineContent = await page.evaluate("window.EDITOR.getCode();");
        const magicThirdlineName = await page.evaluate("document.getElementById('script-name').value");
        await page.waitForTimeout(500);
        await page.click("#command-files");
        fileInput = await page.$("#file-upload-input");
        await fileInput.uploadFile("./spec/test-files/fourthline.py");
        await page.click("#command-files");
        const magicFourthlineContent = await page.evaluate("window.EDITOR.getCode();");
        const magicFourthlineName = await page.evaluate("document.getElementById('script-name').value");
        const fileListContents = await page.evaluate("$('#fs-file-list').html()");
        await page.waitForTimeout(500);

        // Expect modules to not change the main.py file
        expect(fileListContents).toContain("firstline.py");
        expect(fileListContents).toContain("secondline.py");
        expect(fileListContents).toContain("thirdline.py");
        expect(magicFirstlineName).toEqual("microbit program");
        expect(magicSecondlineName).toEqual("microbit program");
        expect(magicThirdlineName).toEqual("microbit program");
        expect(magicFirstlineContent).toEqual(initialContent);
        expect(magicSecondlineContent).toEqual(initialContent);
        expect(magicThirdlineContent).toEqual(initialContent);
        expect(magicFourthlineName).toEqual("fourthline");
        expect(magicFourthlineContent).toContain("PASS");
        expect(magicFourthlineContent).toHaveLength(136);
    }, 30 * 1000);

    it("Correctly loads a python script with the correct name", async function(){
        const page = await getEditorPage();
        await page.click("#command-files");
        const startFileName = await page.evaluate("document.getElementById('script-name').value");
        let fileInput = await page.$("#file-upload-input");

        await fileInput.uploadFile("./spec/test-files/samplefile.py");
        let fileName = await page.evaluate("document.getElementById('script-name').value");
        while (fileName === startFileName) {
            await page.waitForTimeout(msStep);
            fileName = await page.evaluate("document.getElementById('script-name').value");
        }

        expect(fileName).toContain("samplefile");
    }, 60 * 1000);
});
