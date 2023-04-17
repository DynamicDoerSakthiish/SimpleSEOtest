const puppeteer = require('puppeteer');
const axeCore = require('axe-core');

const pages = [
  'https://www.doerscircle.com/solutions',
  "https://www.doerscircle.com/solutions?_gl=1*1ew4o89*_ga*MzExMzM1NzEzLjE2Nzc2MzI3MTI.*_ga_7T8T71LXL9*MTY3ODg3MTU3NS4yMC4xLjE2Nzg4NzQzOTAuMC4wLjA.",
  "https://sit.doerscircle.com/solutions/incorporation",
  "https://sit.doerscircle.com/solutions/incorporation-foreigner-freelancer",
  "https://sit.doerscircle.com/solutions/incorporation-foreigner-sme",
  "https://sit.doerscircle.com/solutions/thai-incorporation",
  "https://sit.doerscircle.com/solutions/registered-business-address",
  "https://sit.doerscircle.com/solutions/corporate-advisory",
  "https://sit.doerscircle.com/account/profile",
  "https://www.doerscircle.com/benefits",
  "https://www.doerscircle.com/about",
  "https://www.doerscircle.com/freelance",
  "https://www.doerscircle.com/freelance-th",
  "https://www.doerscircle.com/membership",
  "https://www.doerscircle.com/enterprise",
  "https://www.doerscircle.com",
  "https://www.work-buddy.com/singapore-coworking"
];

const runAccessibilityAndSpeedTests = async () => {
  const browser = await puppeteer.launch();

  for (const url of pages) {
    const page = await browser.newPage();
    const startTime = new Date().getTime();
    await page.goto(url);
    const endTime = new Date().getTime();
    const loadTime = (endTime - startTime) / 1000;

    console.log(`Page load time for ${url}: ${loadTime.toFixed(2)} seconds`);

    // Inject axe-core into the page
    await page.addScriptTag({ content: axeCore.source });

    // Run the accessibility tests
    const results = await page.evaluate(() => {
      return axe.run();
    });

    console.log(`Accessibility violations for ${url}:`);
    for (const violation of results.violations) {
      console.log(`  Violation: ${violation.help}`);
      console.log(`  Impact: ${violation.impact}`);
      console.log(`  More information: ${violation.helpUrl}`);
      console.log('  Affected elements:');

      for (const node of violation.nodes) {
        console.log(`    - ${node.target}`);
        console.log(`      Element HTML: ${node.html}`);
      }
    }

    console.log('\n');
    await page.close();
  }

  await browser.close();
};

runAccessibilityAndSpeedTests();
