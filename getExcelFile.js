const puppeteer = require("puppeteer");
const path = require("path");

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "C:/Program files (x86)/Microsoft/Edge/Application/msedge.exe",
    userDataDir: "./data",
  });

  const page = await browser.newPage(); // Open new page

  await page._client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath:
      "C:/Users/3057234/OneDrive - Queen's University Belfast/Pictures",
  });

  //   const downloadFolderPath = path.resolve(
  //     __dirname,
  //     "C:/Users/3057234/OneDrive - Queen's University Belfast/Pictures"
  //   );

  //   // Set download options
  //   await page._client.send("Page.setDownloadBehavior", {
  //     behavior: "allow",
  //     downloadPath: downloadFolderPath,
  //   });

  await page.goto(
    "https://qubstudentcloud-my.sharepoint.com//personal//1324764_ads_qub_ac_uk//_layouts//15//download.aspx?UniqueId=%7B0a91ec72%2D9ee2%2D47df%2D9314%2De6a2a70df4a8%7D"
  );

  // You can add further actions here, such as taking a screenshot or scraping data
}

main();
