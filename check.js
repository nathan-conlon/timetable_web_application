const fs = require("fs");

const filePath = "Year1_FoCS_Timetable.xlsx";

function checkFileStats() {
  try {
    const stats = fs.statSync(filePath);
    console.log(`Last modified time: ${stats.mtime}`);
  } catch (error) {
    console.error(`Error fetching file stats: ${error.message}`);
  }
}

// Run the checkFileStats function every 10 seconds (10000 milliseconds)
setInterval(checkFileStats, 10000);
