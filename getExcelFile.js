const puppeteer = require("puppeteer");

async function main() {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath:
      "C:/Program files (x86)/Microsoft/Edge/Application/msedge.exe",
    userDataDir: "./data",
  });

  const page = await browser.newPage(); // Open new page

  const client = await page.target().createCDPSession();

  // Delete the existing file before triggering the download
  // const downloadFilePath = path.join(__dirname, "filename.ext"); // Adjust the filename and extension as needed
  // try {
  //   await fs.unlink(downloadFilePath); // Attempt to delete the file
  //   console.log(`Deleted existing file: ${downloadFilePath}`);
  // } catch (error) {
  //   // If the file does not exist or there's an error deleting it, ignore the error
  //   console.log(`No existing file to delete: ${downloadFilePath}`);
  // }

  // Set download behavior to allow and specify download path
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: __dirname,
  });

  await page.goto(
    "https://qubstudentcloud-my.sharepoint.com//personal//1324764_ads_qub_ac_uk//_layouts//15//download.aspx?UniqueId=%7B0a91ec72%2D9ee2%2D47df%2D9314%2De6a2a70df4a8%7D"
  );
}

main().catch(console.error);
