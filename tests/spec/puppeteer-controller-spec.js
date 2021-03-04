const fs = require("fs");
const puppeteer = require('puppeteer');

describe('Puppeteer tests for the Python Editor iframe controller.', function() {
    'use strict';

    let browser = null;
    const iframeWindow = 'window.frames["embeddedEditor"].contentWindow.';

    const defaultScriptName = 'microbit program';
    const defaultScript = '# Add your Python code here. E.g.\n' +
                          'from microbit import *\n\n\n' +
                          'while True:\n' +
                          "    display.scroll('Hello, World!')\n" +
                          '    display.show(Image.HEART)\n' +
                          '    sleep(2000)\n';

    beforeAll(async () => {
        // Setup a headless Chromium browser.
        // Flags to run within a container and without cross-origin restrictions.
        browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox', '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', '--disable-web-security'
            ]
        });
        jest.setTimeout(10000);
    });

    afterAll(async () => {
        browser.close();
    });

    async function getEmbeddedPage(qs, msgCollection) {
        if (!qs) qs = '';
        const page = await browser.newPage();
        // The postmessage logger can only be added after setting the content
        // but we cannot wait for it to finish or we'll miss early messages
        page.goto('http://localhost:5000/tests/iframecontroller.html?' + qs);
        // If we want to track postMessages we add a listener to the page
        if (Array.isArray(msgCollection)) {
            // Create function to log event data in this context, which can be called from the page
            page.exposeFunction('logEventData', (eData) => {
                msgCollection.push(eData);
            });
        }
        // Now we can wait for the page to be fully loaded
        await page.waitForNavigation({waitUntil:'networkidle0'});
        return page;
    }

    async function controllerSendMsg(page, msg) {
        const msgStr = JSON.stringify(msg)
        const codeToRun = `${iframeWindow}postMessage(${msgStr})`;
        await page.evaluate(codeToRun);
    }

    it('iFrame controller: Has no code in the editor', async function() {
        const page = await getEmbeddedPage('controller=1');

        const codeContent = await page.evaluate(iframeWindow + 'EDITOR.getCode();');
        const codeName = await page.evaluate(iframeWindow + '$("#script-name").val()');
        await page.close();

        expect(codeContent).toEqual(' ');
        expect(codeName).toEqual(defaultScriptName);
    });

    it('iFrame controller: Sends the workspacesync on load and responds to it', async function() {
        const msgCollection = [];
        const page = await getEmbeddedPage('controller=1', msgCollection);

        await controllerSendMsg(page, {
            type: 'pyeditor',
            action: 'workspacesync',
            projects: ['This code to the editor']
        });
        // The editor then sends the 'workspaceloaded' message
        await page.waitForTimeout(10);
        const codeContent = await page.evaluate(iframeWindow + 'EDITOR.getCode();');
        await page.close();

        expect(codeContent).toEqual('This code to the editor');
        expect(msgCollection[0]).toEqual({type: 'pyeditor', action: 'workspacesync'});
        expect(msgCollection[1]).toEqual({type: 'pyeditor', action: 'workspaceloaded'});
    });

    it('iFrame controller: Code changes are sent to parent', async function() {
        const msgCollection = [];
        const page = await getEmbeddedPage('controller=1', msgCollection);

        await page.evaluate(iframeWindow + 'EDITOR.setCode("new content");');
        await page.waitForTimeout(1100); // Debouncing waits 1 sec before sending code
        await page.evaluate(iframeWindow + 'EDITOR.setCode("replaced");');
        await page.waitForTimeout(1100); // Debouncing waits 1 sec before sending code
        await page.close();

        expect(msgCollection[1]).toEqual({type: 'pyeditor', action: 'workspacesave', project: 'new content'});
        expect(msgCollection[2]).toEqual({type: 'pyeditor', action: 'workspacesave', project: 'replaced'});
    });

    it('iFrame controller: Controller can import project', async function() {
        const msgCollection = [];
        const page = await getEmbeddedPage('controller=1', msgCollection);

        await controllerSendMsg(page, {
            type: 'pyeditor',
            action: 'importproject',
            project: 'This project code to load to the editor'
        });
        // The editor then sends the 'workspaceloaded' message
        await page.waitForTimeout(10);
        const codeContent = await page.evaluate(iframeWindow + 'EDITOR.getCode();');
        await page.close();

        expect(codeContent).toEqual('This project code to load to the editor');
    });

    it('mobile controller: Initial code is maintained in the editor', async function() {
        const page = await getEmbeddedPage('mobileApp=1');

        const codeContent = await page.evaluate(iframeWindow + 'EDITOR.getCode();');
        const codeName = await page.evaluate(iframeWindow + '$("#script-name").val()');
        await page.close();

        expect(codeContent).toEqual(defaultScript);
        expect(codeName).toEqual(defaultScriptName);
    });

    it('mobile controller: Can enable mobile mode in the editor', async function() {
        const msgCollection = [];
        const page = await getEmbeddedPage('mobileApp=1', msgCollection);

        await controllerSendMsg(page, {
            type: 'pyeditor',
            action: 'mobilemode',
        });
        await page.waitForTimeout(10);
        const downloadButtonVisible = await page.evaluate(iframeWindow + "$('#command-download').is(':visible')");
        const flashButtonVisible = await page.evaluate(iframeWindow + "$('#command-flash').is(':visible')");
        const serialButtonVisible = await page.evaluate(iframeWindow + "$('#command-serial').is(':visible')");
        const connectButtonVisible = await page.evaluate(iframeWindow + "$('#command-connect').is(':visible')");
        // Clicking the buttons should send messages to controller
        await page.evaluate(iframeWindow + "$('#command-download').click()");
        await page.evaluate(iframeWindow + "$('#command-flash').click()");
        await page.evaluate(iframeWindow + "$('#command-files').click()");
        await page.evaluate(iframeWindow + "$('#save-hex').click()");
        await page.evaluate(iframeWindow + "$('#save-py').click()");
        await page.evaluate(iframeWindow + "$('.action.save-button.save').click()");
        await page.waitForTimeout(10);
        await page.close();

        //console.error(msgCollection);
        expect(downloadButtonVisible).toBeTruthy();
        expect(flashButtonVisible).toBeTruthy();
        expect(serialButtonVisible).toBeFalsy();
        expect(connectButtonVisible).toBeFalsy();
        expect(msgCollection[1]).toEqual(expect.objectContaining({
            type: 'pyeditor', action: 'savefile', filename: 'microbit_program.hex'
        }));
        expect(msgCollection[1]['filestring'].startsWith(':020000040000FA')).toBeTruthy();
        expect(msgCollection[2]).toEqual(expect.objectContaining({
            type: 'pyeditor', action: 'flashhex', filename: 'microbit_program.hex'
        }));
        expect(msgCollection[2]['filestring'].startsWith(':020000040000FA')).toBeTruthy();
        expect(msgCollection[3]).toEqual(expect.objectContaining({
            type: 'pyeditor', action: 'savefile', filename: 'microbit_program.hex'
        }));
        expect(msgCollection[3]['filestring'].startsWith(':020000040000FA')).toBeTruthy();
        expect(msgCollection[4]).toEqual(expect.objectContaining({
            type: 'pyeditor', action: 'savefile', filename: 'microbit_program.py', filestring: defaultScript
        }));
        expect(msgCollection[5]).toEqual(expect.objectContaining({
            type: 'pyeditor', action: 'savefile', filename: 'microbit_program.py', filestring: defaultScript
        }));
    });

    it('mobile controller: Controller can load a hex', async function() {
        const msgCollection = [];
        const page = await getEmbeddedPage('mobileApp=1', msgCollection);
        const uPy1HexFile = fs.readFileSync('./spec/test-files/1.0.1.hex', 'utf8');

        await controllerSendMsg(page, {
            type: 'pyeditor',
            action: 'loadhex',
            filename: 'my_hex.hex',
            filestring: uPy1HexFile
        });
        await page.waitForTimeout(10);
        const codeContent = await page.evaluate(iframeWindow + 'EDITOR.getCode();');
        const codeName = await page.evaluate(iframeWindow + '$("#script-name").val()');
        await page.close();

        expect(codeContent).toEqual('while True:\n    print ("PASS1")\n');
        expect(codeName).toEqual('my_hex');
    });

    it('mobile controller: Controller can load a python file', async function() {
        const msgCollection = [];
        const page = await getEmbeddedPage('mobileApp=1', msgCollection);
        const pyCode = fs.readFileSync('./spec/test-files/main.py', 'utf8');

        await controllerSendMsg(page, {
            type: 'pyeditor',
            action: 'loadfile',
            filename: 'my_python_file.py',
            filestring: pyCode
        });
        await page.waitForTimeout(10);
        const codeContent = await page.evaluate(iframeWindow + 'EDITOR.getCode();');
        const codeName = await page.evaluate(iframeWindow + '$("#script-name").val()');
        await page.close();

        expect(codeContent).toEqual('import microbit\n\nmicrobit.display.scroll("PASS")\n');
        expect(codeName).toEqual('my_python_file');
    });

    it('mobile controller: Controller can load a python module to the fs', async function() {
        const msgCollection = [];
        const page = await getEmbeddedPage('mobileApp=1', msgCollection);
        // Adding a module shows an alert, so make sure it's dismissed
        page.on('dialog', async dialog => {
            console.log('here');
            await dialog.accept();
        });
        const pyCode = fs.readFileSync('./spec/test-files/firstline.py', 'utf8');

        await controllerSendMsg(page, {
            type: 'pyeditor',
            action: 'loadfile',
            filename: 'firstline.py',
            filestring: pyCode
        });
        await page.waitForTimeout(10);
        const codeContent = await page.evaluate(iframeWindow + 'EDITOR.getCode();');
        const codeName = await page.evaluate(iframeWindow + '$("#script-name").val()');
        const filesInFs = await page.evaluate(iframeWindow + 'FS.ls()');
        await page.close();

        expect(codeContent).toEqual(defaultScript);
        expect(codeName).toEqual(defaultScriptName);
        expect(filesInFs).toEqual(['main.py', 'firstline.py']);
    });
});
