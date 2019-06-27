jest.setTimeout(60000 * 5);

describe("An editor for MicroPython running at localhost.", function() {

    beforeAll(async() => {
        // Setup a headless Chromium browser.
        // Flags allow Puppeteer to run within a container.
        global.browser = await global.puppeteer.launch({headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"]});
    });

    afterAll(async() => {
        global.browser.close();
    });

    it("Can store the correct number of small files in the filesystem", async function() {

        const page = await global.browser.newPage();
        await page.goto("http://localhost:5000/editor.html");
        // We expect to be able to add 214 small files to the fs.
        const expectedFileLimit = 215;
        const fileRoot = "./spec/test-files/chunks/";

        await page.click("#command-files");
        const fileInput = await page.$("#fs-file-upload-input");
        let fileList = [];
        // Create small1.py -> small215.py (215 small files)
        for (let i = 1; i<=expectedFileLimit; i++) {
            const fileName = `small${i}.py`;
            if (!fs.existsSync(`${fileRoot}${fileName}`)) {
                console.log(`>> Generated new file for test: ${fileName}`)
                await fs.writeFile(`${fileRoot}${fileName}`, `# Empty Python file < 128 bytes ${fileName}`, function(err, result) {
                    if(err) console.warn('error', err);
                });
            }
            fileList.push(`${fileRoot}${fileName}`);
        }
        console.log("> Uploading files (this may take some time)");
        await fileInput.uploadFile(...fileList);
        let fileLimit = 0;
        page.on("dialog", async dialog => {
            await dialog.accept();
            if (dialog.message().includes("There is no storage space left.")) {
                // Get the number of files (the error warns that we can't add the 215th file, but we expect 215 files as there are 214 small.py files + main.py)
                fileLimit = parseInt(dialog.message().split("small")[1].split(".py")[0]);
            }
        });
        for (let ms=0; ms<(60000 * 3); ms++) {
            if (fileLimit !== 0) break;
            await page.waitFor(1);
        }
        await page.close();

        expect(fileLimit).toEqual(expectedFileLimit);

    });
   
    it("Can store one large file in the filesystem", async function() {

        const page = await global.browser.newPage();
        await page.goto("http://localhost:5000/editor.html");
        const initialCode = await page.evaluate("window.EDITOR.getCode();");
        let codeContent = "";
        let noErrorOnDownload = true;

        await page.click("#command-files");
        const fileInput = await page.$("#file-upload-input");
        await fileInput.uploadFile("./spec/test-files/large.py");
        for (let ms=0; ms<1000; ms++) {
            codeContent = await page.evaluate("window.EDITOR.getCode();");
            if (codeContent != initialCode) break;
            await page.waitFor(1);
        }
        page.on("dialog", async dialog => {
            if (dialog.message().includes("enough space")) {
                noErrorOnDownload = false;
            }
            await dialog.accept();
        });
        await page.waitFor(1000);
        await page.click("#command-download");
        const codeName = await page.evaluate("document.getElementById('script-name').value");
        await page.close();

        // Max filesize = ([27 * 1024] * [126 / 128])
        // We use a slightly smaller file (as this doesn't fully compensate for headers)
        expect(codeContent).toHaveLength(27204);
        expect(codeContent).toContain("import love");
        expect(codeName).toEqual("main");
        expect(noErrorOnDownload).toEqual(true);

    });

    it("Shows an error when loading a file that is too large in the filesystem", async function() {

        const page = await global.browser.newPage();
        await page.goto("http://localhost:5000/editor.html");
        const initialCode = await page.evaluate("window.EDITOR.getCode();");
        let codeContent = "";
        let rejectsLargeFileDownload = false;

        await page.click("#command-files");
        const fileInput = await page.$("#file-upload-input");
        await fileInput.uploadFile("./spec/test-files/too-large.py");
        page.on("dialog", async dialog => {
            if (dialog.message().includes("enough space")) {
                rejectsLargeFileDownload = true;
            }
            await dialog.accept();
        });
        for (let ms=0; ms<1000; ms++) {
            codeContent = await page.evaluate("window.EDITOR.getCode();");
            if (codeContent != initialCode) break;
            await page.waitFor(1);
        }
        await page.waitFor(1000);
        // Check that we get an error when attempting to download
        await page.click("#command-download");
        for (let ms=0; ms<1000; ms++) {
            if (rejectsLargeFileDownload) break;
            await page.waitFor(1);
        }
        const codeName = await page.evaluate("document.getElementById('script-name').value");
        await page.close();

        expect(rejectsLargeFileDownload).toEqual(true);
        // Max filesize = ([27 * 1024] * [126 / 128])
        expect(codeContent).toHaveLength(27216);
        expect(codeContent).toContain("# Filler");
        expect(codeName).toEqual("main");

    });

    it("Correctly loads files via the load modal", async function() {

        const page = await global.browser.newPage();
        await page.goto("http://localhost:5000/editor.html");
        const initialCode = await page.evaluate("window.EDITOR.getCode();");
        let mainPyWarningDialogShows = false;
        let codeOnCancel = "";
        let codeOnAccept = "";
        let fileListContents = "";
        let hasAttemptedCancel = false;

        await page.click("#command-files");
        const fileInput = await page.$("#fs-file-upload-input");
        page.on("dialog", async dialog => {
            if (dialog.message().includes("Adding a main.py file will replace the code in the editor!")){
                mainPyWarningDialogShows = true;
                if (!hasAttemptedCancel){
                    // Ensure that pressing 'Cancel' doesn't replace code contents
                    await dialog.dismiss();
                    codeOnCancel = await page.evaluate("window.EDITOR.getCode();");
                    hasAttemptedCancel = true;
                    await fileInput.uploadFile("./spec/test-files/main.py");
                } else {
                    // Ensure that pressing 'Accept' does replace code contents
                    await dialog.accept();
                    codeOnAccept = await page.evaluate("window.EDITOR.getCode();");
                    fileListContents = await page.evaluate("$('#fs-file-list').html()");
                }
            }
        });
        await fileInput.uploadFile("./spec/test-files/main.py");
        for (let ms=0; ms<1000; ms++) {
            if (fileListContents !== "") break;
            await page.waitFor(1);
        }
        await page.close();

        expect(mainPyWarningDialogShows).toEqual(true);
        expect(codeOnCancel).toEqual(initialCode);
        expect(codeOnAccept).not.toEqual(initialCode);
        expect(codeOnAccept).toContain("PASS");
        expect(fileListContents).toContain("main.py");

    });

    it("Correctly imports modules with the 'magic comment' in the filesystem.", async function() {

        const page = await global.browser.newPage();
        await page.goto("http://localhost:5000/editor.html");
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
        await page.waitFor(500);
        await page.click("#command-files");
        fileInput = await page.$("#file-upload-input");
        await fileInput.uploadFile("./spec/test-files/secondline.py");
        await page.click("#command-files");
        const magicSecondlineContent = await page.evaluate("window.EDITOR.getCode();");
        const magicSecondlineName = await page.evaluate("document.getElementById('script-name').value");
        await page.waitFor(500);
        await page.click("#command-files");
        fileInput = await page.$("#file-upload-input");
        await fileInput.uploadFile("./spec/test-files/thirdline.py");
        await page.click("#command-files");
        const magicThirdlineContent = await page.evaluate("window.EDITOR.getCode();");
        const magicThirdlineName = await page.evaluate("document.getElementById('script-name').value");
        await page.waitFor(500);
        await page.click("#command-files");
        fileInput = await page.$("#file-upload-input");
        await fileInput.uploadFile("./spec/test-files/fourthline.py");
        await page.click("#command-files");
        const magicFourthlineContent = await page.evaluate("window.EDITOR.getCode();");
        const magicFourthlineName = await page.evaluate("document.getElementById('script-name').value");
        const fileListContents = await page.evaluate("$('#fs-file-list').html()");
        await page.waitFor(500);

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
        // Expect invalid module to change the main.py
        expect(fileListContents).not.toContain("fourthline.py");
        expect(magicFourthlineName).toEqual("main");
        expect(magicFourthlineContent).toContain("PASS");
        expect(magicFourthlineContent).toHaveLength(136);

    });

});