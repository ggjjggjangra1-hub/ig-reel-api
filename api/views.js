
const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

module.exports = async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({error:"Missing url"});

    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2", timeout: 0 });

    const html = await page.content();
    const match = html.match(/view_count[^0-9]*([0-9]+)/i);
    const views = match ? match[1] : "Not Found";

    await browser.close();

    res.json({
      views,
      updated: new Date().toLocaleTimeString()
    });
  } catch (e) {
    res.status(500).json({views:"Error", updated:"Failed"});
  }
};
