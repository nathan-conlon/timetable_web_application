const puppeteer = require("puppeteer");

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath:
      "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    userDataDir: "./data",
  });

  const page = await browser.newPage();

  const client = await page.target().createCDPSession();

  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: __dirname,
  });

  await page.goto(
    "https://qubstudentcloud-my.sharepoint.com/personal/1324764_ads_qub_ac_uk/_layouts/15/download.aspx?UniqueId=%7B0a91ec72-9ee2-47df-9314-e6a2a70df4a8%7D"
  );

  // Add any additional actions here, such as taking a screenshot or scraping data

  // Close the browser when done with this iteration
  await browser.close();

  console.log("Successfully executed main function.");

  // Return a promise resolved after a short delay (simulating a 10-second interval)
  return new Promise((resolve) => setTimeout(resolve, 10000));
}

// Function to run main function every 10 seconds
async function runEvery10Seconds() {
  while (true) {
    await main().catch(console.error);
  }
}

runEvery10Seconds();
