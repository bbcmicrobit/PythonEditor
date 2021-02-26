/* Puppeteer tests for the A11y. */
const { AxePuppeteer } = require('axe-puppeteer');
const puppeteer = require('puppeteer');

jest.setTimeout(30000);

describe("Puppeteer accessibility tests for the Python Editor.", function() {
    'use strict';

    const editorURL = 'http://localhost:5000/editor.html';
    const helpURL = 'http://localhost:5000/help.html';
    let browser = null;

    beforeAll(async () => {
        // Setup a headless Chromium browser.
        // Flags allow Puppeteer to run within a container.
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
            defaultViewport: {
                width: 1024,
                height: 768
            }
        });
    });

    afterAll(async () => {
        browser.close();
    });

    test('Checks the editor.html page with Axe', async () => {
        // First, run some code which loads the content of the page.
        const page = await browser.newPage();
        await page.goto(editorURL);
        await new AxePuppeteer(page).analyze();
        await expect(page).toPassAxeTests({
            // disable tab-index as we have values greater than 0
            // and h1 as we aren't using this heading
            disabledRules: [ 'tabindex', 'page-has-heading-one' ],
        });
        await page.close();
    });

    test('Checks the Load/Save modal with Axe', async () => {
        const page = await browser.newPage();
        await page.goto(editorURL);
        await page.waitForSelector("#command-files");
        await page.click("#command-files");
        await new AxePuppeteer(page).analyze();
        await expect(page).toPassAxeTests({
            // exclude everything else in main
            exclude: '.main',
            // disable checking for h1 as we aren't using this heading
            disabledRules: [ 'page-has-heading-one' ],
        });
        await page.close();
    });

    test('Checks the Snippets modal with Axe', async () => {
        const page = await browser.newPage();
        await page.goto(editorURL);
        await page.waitForSelector("#command-snippet");
        await page.click("#command-snippet");
        await new AxePuppeteer(page).analyze();
        await expect(page).toPassAxeTests({
            // exclude everything else in main
            exclude: '.main',
            // disable checking for h1 as we aren't using this heading
            disabledRules: [ 'page-has-heading-one' ],
        });
        await page.close();
    });

    test('Checks the help.html page with Axe', async () => {
        const page = await browser.newPage();
        await page.goto(helpURL);
        await new AxePuppeteer(page).analyze();
        await expect(page).toPassAxeTests({
            // exclude code highlighter
            exclude: '.hljs-comment',
            // disable checking for h1 as we aren't using this heading
            disabledRules: [ 'page-has-heading-one' ],
        });
        await page.close();
    });
});
