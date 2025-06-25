const puppeteerExtra = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteerExtra.use(StealthPlugin());

async function scrapeInfoJobs() {
    console.log('→ Launching browser with stealth plugin...');
    const browser = await puppeteerExtra.launch({
        headless: true,
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set a realistic user agent and viewport to better mimic a real user
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    const url = 'https://www.infojobs.net/ofertas-trabajo';
    console.log(`→ Navigating to ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2' });

    // The stealth plugin may prevent the CAPTCHA from appearing at all.
    try {
        const captchaSelector = 'div.geetest_radar_tip';
        console.log('→ Looking for Geetest CAPTCHA...');
        await page.waitForSelector(captchaSelector, { visible: true, timeout: 5000 });
        console.log('→ CAPTCHA found. Clicking to verify...');
        await page.click(captchaSelector);
        await page.waitForTimeout(3000);
        console.log('→ Verification click complete.');
    } catch (error) {
        console.log('→ Geetest CAPTCHA not found.');
    }

    // Handle the cookie consent banner
    try {
        const cookieButtonSelector = 'button[data-testid="TcfAccept"]';
        console.log('→ Looking for cookie consent button...');
        await page.waitForSelector(cookieButtonSelector, { timeout: 5000 });
        await Promise.all([
            page.click(cookieButtonSelector),
            page.waitForNavigation({ waitUntil: 'networkidle2' })
        ]);
        console.log('→ Accepted cookie consent.');
    } catch (error) {
        console.log('→ Cookie consent banner not found or already accepted.');
    }

    // Wait for the main container of all job listings to ensure they are all loaded.
    const jobListContainerSelector = 'ul.ij-List';
    console.log(`→ Waiting for job list container: "${jobListContainerSelector}"`);
    await page.waitForSelector(jobListContainerSelector, { timeout: 30000 });

    const jobCardSelector = 'li.sui-PrimitiveLinkBox';
    console.log(`→ Job list found. Scraping all cards with selector: "${jobCardSelector}"`);

    const jobs = await page.$$eval(jobCardSelector, (cards) => {
        return cards.map(card => {
            const titleElement = card.querySelector('a.ij-OfferCardContent-description-title-link');
            const companyElement = card.querySelector('a.ij-OfferCardContent-description-subtitle-link');
            const locationElement = card.querySelector('span.ij-OfferCardContent-description-list-item-truncate');
            const descriptionElement = card.querySelector('p.ij-OfferCardContent-description-description');

            const title = titleElement?.innerText.trim() ?? 'N/A';
            const link = titleElement?.href ?? 'N/A';
            const company = companyElement?.innerText.trim() ?? 'N/A';
            const location = locationElement?.innerText.trim() ?? 'N/A';
            const description = descriptionElement?.innerText.trim() ?? 'N/A';

            return { title, company, location, description, link };
        });
    });

    console.log(`✅ Found ${jobs.length} jobs:`);
    console.log(jobs);

    await browser.close();
    console.log('→ Browser closed.');
}

scrapeInfoJobs();
