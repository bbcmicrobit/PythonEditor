const puppeteer = require('puppeteer');

// jest.setTimeout(60000);

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
    });

    afterAll(async () => {
        browser.close();
    });

    async function getEmbeddedPage(qs, msgCollection) {
        if (!qs) qs = '';
        const page = await browser.newPage();
        // The postmessage logger can only be added after setting the content
        // but we cannot wait for it to finish or we'll miss early messages
        page.setContent(`<!doctype html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Testing iframe controller</title>
                <style>
                    html, body {
                        margin: 0;
                        height: 100%;
                    }
                </style>
            </head>
            <body>
                <iframe defer src="http://localhost:5000/editor.html?${qs}"
                    id="embeddedEditor" frameborder="0"
                    style="height:100%;width:100%;top:0px;left:0px;right:0px;bottom:0px">
                </iframe>
                <script>
                    window.addEventListener('message', e => {
                        console.log({event: e, data: e.data});
                        if (typeof(logEventData) != "undefined") {
                            logEventData(e.data);
                        }
                    });
                </script>
            </body>
            </html>
        `);
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

    it('Example', async function() {
        const page = await getEmbeddedPage();
        //await page.waitFor(60000);

        const codeContent = await page.evaluate(iframeWindow + 'EDITOR.getCode();');
        const codeName = await page.evaluate(iframeWindow + '$("#script-name").val()');
        await page.close();

        expect(codeContent).toEqual(defaultScript);
        expect(codeName).toEqual(defaultScriptName);
    });

    it('iFrame controller: Has no code in the editor', async function() {
        const page = await getEmbeddedPage('controller=1');

        const codeContent = await page.evaluate(iframeWindow + 'EDITOR.getCode();');
        const codeName = await page.evaluate(iframeWindow + '$("#script-name").val()');
        await page.close();

        expect(codeContent).toEqual(' ');
        expect(codeName).toEqual(defaultScriptName);
    });

    it('iFrame controller: Sends the workspacesync message on load', async function() {
        const msgCollection = [];
        const page = await getEmbeddedPage('controller=1', msgCollection);

        await page.close();

        expect(msgCollection[0]).toEqual({type: 'pyeditor', action: 'workspacesync'});
    });


    it('iFrame controller: Code changes are sent to parent', async function() {
        const msgCollection = [];
        const page = await getEmbeddedPage('controller=1', msgCollection);

        await page.evaluate(iframeWindow + 'EDITOR.setCode("new content");');
        await page.waitFor(1100);
        await page.evaluate(iframeWindow + 'EDITOR.setCode("replaced");');
        await page.waitFor(1100);
        await page.close();

        expect(msgCollection[1]).toEqual({type: 'pyeditor', action: 'workspacesave', project: 'new content'});
        expect(msgCollection[2]).toEqual({type: 'pyeditor', action: 'workspacesave', project: 'replaced'});
    }, 10000);
});
