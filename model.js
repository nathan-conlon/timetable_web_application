import { groups } from "./controller.js";
import { cblGroups } from "./controller.js";
import { userGroup } from "./controller.js";
import { userCblGroup } from "./controller.js";

let fullTimetable;
let formattedTimetable;

// Function to fetch data from a file path
async function fetchData(filePath) {
  try {
    // Fetch the file data
    const response = await fetch(filePath);
    const blob = await response.blob();

    // Read the file data as binary
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsBinaryString(blob);
    });
  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    throw error;
  }
}

// Function to parse workbook data
async function parseWorkbook(data) {
  try {
    // Parse the workbook data
    const workbook = XLSX.read(data, { type: "binary" });

    // Extract data from each sheet into an array
    const fullTimetable = workbook.SheetNames.flatMap((sheet) =>
      XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet])
    );

    return fullTimetable;
  } catch (error) {
    console.error("Error occurred while parsing workbook:", error);
    throw error;
  }
}

// function to format times
function excelTimeToReadable(excelTime) {
  // Convert Excel fractional time to milliseconds (24 hours in a day, 60 minutes in an hour, 60 seconds in a minute, 1000 milliseconds in a second)
  var milliseconds = excelTime * 24 * 60 * 60 * 1000;

  // Create a new Date object with the milliseconds
  var date = new Date(milliseconds);

  // Extract hours and minutes
  var hours = date.getUTCHours();
  var minutes = date.getUTCMinutes();

  // Format the time
  var formattedTime =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0");

  return formattedTime;
}

// function to format dates
function excelDateToReadable(excelDate) {
  // Excel stores dates as the number of days since January 0, 1900 (with January 1, 1900, as day 1).
  // But it incorrectly treats 1900 as a leap year, so we need to compensate for that.
  var msPerDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  var excelEpoch = new Date(Date.UTC(1900, 0, 1));
  var epochAsUnixTimestamp = excelEpoch.getTime();
  var msSinceExcelEpoch = (excelDate - 1) * msPerDay; // Subtract 1 to account for Excel's base date being January 0, 1900

  var utcTimeStamp = epochAsUnixTimestamp + msSinceExcelEpoch;

  // Create a new Date object with the calculated timestamp
  var date = new Date(utcTimeStamp);

  // Extract year, month, and day
  var year = date.getUTCFullYear();
  var month = (date.getUTCMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed, so add 1
  var day = date.getUTCDate().toString().padStart(2, "0");

  // Format the date
  var formattedDate = day + "/" + month + "/" + year;

  return formattedDate;
}

// Main function to orchestrate the process
async function getFormattedTimetable() {
  const fileName = "Year2_GERR_Timetable.xlsx";
  const filePath = fileName;

  try {
    // Fetch data from the specified file
    const data = await fetchData(filePath);

    // Parse the workbook data
    fullTimetable = await parseWorkbook(data);
  } catch (error) {
    console.error("An error occurred:", error);
  }
  formattedTimetable = fullTimetable.map((entry) => {
    // Remove whitespace from keys
    Object.keys(entry).forEach((key) => {
      const trimmedKey = key.trim();
      if (key !== trimmedKey) {
        entry[trimmedKey] = entry[key];
        delete entry[key];
      }
    });

    // Split the groups into string iterations
    let string = entry.Group.split("-");
    // Remove whitespace from string iterations
    string = string.map((str) => str.trim());
    // Turn entry.groups into an empty array
    entry.Group = [];

    // Define the reference groups based on the condition
    const referenceGroups = string[0][0] !== "C" ? groups : cblGroups;

    // Loop through reference groups and fill the emptied groups array
    entry.Group = referenceGroups.slice(
      referenceGroups.indexOf(string[0]),
      referenceGroups.indexOf(string[1]) + 1
    );

    // convert timestamps
    entry["Start Date"] = excelDateToReadable(entry["Start Date"]);
    entry["Start Time"] = excelTimeToReadable(entry["Start Time"]);
    entry["End Time"] = excelTimeToReadable(entry["End Time"]);

    return entry; // Return the modified entry
  });
  return formattedTimetable;
}

// filter function
function timetableFilter(formattedTimetable) {
  let filteredTimetable = formattedTimetable.filter(
    (entries) =>
      entries.Group.includes(userGroup) || entries.Group.includes(userCblGroup)
  );
  return filteredTimetable;
}

export { getFormattedTimetable };
export { timetableFilter };
