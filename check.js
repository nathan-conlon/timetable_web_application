const fs = require("fs");

// Function to format dates consistently
function formatDate(date) {
  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Optional: If you prefer 24-hour time format
  });
}

// Get the current date and time when the page is loaded
var currentDate = new Date();
// Format the date and time as a string
var dateTimeString = formatDate(currentDate);
// Log the date and time to the console
console.log("Page loaded at: " + dateTimeString);

// Check the last modified property of the Excel file
const filePath = "Year1_FoCS_Timetable.xlsx";
function checkFileStats() {
  try {
    const stats = fs.statSync(filePath);
    const lastModified = new Date(stats.mtime);
    const formattedLastModified = formatDate(lastModified);
    console.log(`Last modified time: ${formattedLastModified}`);

    // Compare the two dates
    if (lastModified > currentDate) {
      console.log(
        "File has been modified after the page was loaded. Refreshing the page..."
      );
      location.reload(); // Refresh the page
    }
  } catch (error) {
    console.error(`Error fetching file stats: ${error.message}`);
  }
}

// Run the checkFileStats function every 10 seconds (10000 milliseconds)
setInterval(checkFileStats, 10000);
