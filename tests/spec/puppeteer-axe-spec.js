/* Puppeteer tests for the A11y. */
const { AxePuppeteer } = require('axe-puppeteer');
const puppeteer = require('puppeteer');

describe("Puppeteer accessibility tests for the Python Editor.", function() {
    'use strict';

    const editorURL = 'http://localhost:5000/editor.html';
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

    test( 'Checks the editor.html page with Axe', async () => {
        // First, run some code which loads the content of the page.
        const page = await browser.newPage();
        await page.goto(editorURL);
        await new AxePuppeteer(page).analyze();
        await expect(page).toPassAxeTests({
            disabledRules: [ 'tabindex', 'page-has-heading-one' ],
        });
        await page.close();
    });

    test( 'Checks the Load/Save modal with Axe', async () => {
        const page = await browser.newPage();
        await page.goto(editorURL);
        await page.waitForSelector("#command-files");
        await page.click("#command-files");
        await new AxePuppeteer(page).analyze();
        await expect(page).toPassAxeTests({
            exclude: '.main',
            disabledRules: [ 'page-has-heading-one' ],
        });
        await page.close();
    });

    test( 'Checks the Load/Save modal with Axe', async () => {
        const page = await browser.newPage();
        await page.goto(editorURL);
        await page.waitForSelector("#command-snippet");
        await page.click("#command-snippet");
        await new AxePuppeteer(page).analyze();
        await expect(page).toPassAxeTests({
            exclude: '.main',
            disabledRules: [ 'page-has-heading-one' ],
        });
        await page.close();
    });
});
