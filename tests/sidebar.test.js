const puppeteer = require('puppeteer');
const EXTENSION_PATH = 'src';
const EXTENSION_ID = 'klfgbkppjgoffpbafkchcgenpdgfjfef';
let browser;
let page;

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false,
        args: [
            `--disable-extensions-except=${EXTENSION_PATH}`,
            `--load-extension=${EXTENSION_PATH}`
        ]
    });
    page = await browser.newPage();
    await page.goto(`chrome-extension://${EXTENSION_ID}/sidebar.html`);
});

afterEach(async () => {
    await browser.close();
    browser = undefined;
});

describe('Sidebar UI Elements', () => {
    test('sidebar renders correctly', async () => {
        const exists = await page.$('.container');
        expect(exists).toBeTruthy();
    });

    test('popup renders with correct title', async () => {
        const title = await page.$('title');
        const titleText = await page.evaluate(
            (element) => element.textContent,
            title
        );
        expect(titleText).toBe('Counter Sidebar');
    });

    test('all buttons are present', async () => {
        const incrementBtn = await page.$('[data-testid="increment"]');
        const decrementBtn = await page.$('[data-testid="decrement"]');
        const resetBtn = await page.$('[data-testid="reset"]');

        expect(incrementBtn).toBeTruthy();
        expect(decrementBtn).toBeTruthy();
        expect(resetBtn).toBeTruthy();
    });

    test('counter display is present and starts at 0', async () => {
        const counterElement = await page.$('[data-testid="counter"]');
        const counterText = await page.evaluate(
            (element) => element.textContent,
            counterElement
        );
        expect(counterText).toBe('0');
    });
});

describe('Counter Operations', () => {
    test('increment button increases counter by 1', async () => {
        await page.click('[data-testid="increment"]');
        const counterText = await page.$eval(
            '[data-testid="counter"]',
            (el) => el.textContent
        );
        expect(counterText).toBe('1');
    });

    test('decrement button decreases counter by 1', async () => {
        await page.click('[data-testid="increment"]');
        await page.click('[data-testid="decrement"]');
        const counterText = await page.$eval(
            '[data-testid="counter"]',
            (el) => el.textContent
        );
        expect(counterText).toBe('0');
    });

    test('reset button sets counter to 0', async () => {
        // Increment a few times first
        await page.click('[data-testid="increment"]');
        await page.click('[data-testid="increment"]');
        await page.click('[data-testid="increment"]');

        // Then reset
        await page.click('[data-testid="reset"]');
        const counterText = await page.$eval(
            '[data-testid="counter"]',
            (el) => el.textContent
        );
        expect(counterText).toBe('0');
    });

    test('multiple operations work correctly', async () => {
        await page.click('[data-testid="increment"]');
        await page.click('[data-testid="increment"]');
        await page.click('[data-testid="decrement"]');
        const counterText = await page.$eval(
            '[data-testid="counter"]',
            (el) => el.textContent
        );
        expect(counterText).toBe('1');
    });
});

describe('Storage Persistence', () => {
    test('counter value persists after page reload', async () => {
        await page.click('[data-testid="increment"]');
        await page.click('[data-testid="increment"]');

        await page.reload();

        const counterText = await page.$eval(
            '[data-testid="counter"]',
            (el) => el.textContent
        );
        expect(counterText).toBe('2');
    });

    test('storage is cleared when reset button is clicked', async () => {
        await page.click('[data-testid="increment"]');
        await page.click('[data-testid="increment"]');

        await page.click('[data-testid="reset"]');

        await page.reload();

        const counterText = await page.$eval(
            '[data-testid="counter"]',
            (el) => el.textContent
        );
        expect(counterText).toBe('0');
    });
});

describe('Edge Cases', () => {
    test('handles negative numbers correctly', async () => {
        await page.click('[data-testid="decrement"]');
        await page.click('[data-testid="decrement"]');
        const counterText = await page.$eval(
            '[data-testid="counter"]',
            (el) => el.textContent
        );
        expect(counterText).toBe('-2');
    });

    test('handles rapid button clicks', async () => {
        const clicks = 5;
        for (let i = 0; i < clicks; i++) {
            await page.click('[data-testid="increment"]');
        }
        const counterText = await page.$eval(
            '[data-testid="counter"]',
            (el) => el.textContent
        );
        expect(counterText).toBe(clicks.toString());
    });
});
