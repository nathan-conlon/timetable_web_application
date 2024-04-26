import {
  groups,
  cblGroups,
  userGroup,
  userCblGroup,
  dateInfo,
} from "./controller.js";

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
  var year = date.getUTCFullYear().toString().substr(-2);
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
function timetableFilter(data) {
  let filteredTimetable = data.filter(
    (entries) =>
      entries.Group.includes(userGroup) || entries.Group.includes(userCblGroup)
  );
  return filteredTimetable;
}

// DATE FILTER NEEDS WORK

function dateFilter(data) {
  let filteredTimetable = data.filter((entries) =>
    entries["Start Date"].includes(dateInfo.viewDate)
  );
  return filteredTimetable;
}

// Generate an array of dates in the calendar year
function getDatesArray(startYear, endYear) {
  var startDate = new Date(startYear, 8, 1); // September is month 8 (0-indexed)
  var endDate = new Date(endYear, 4, 1); // May is month 4 (0-indexed)
  var datesArray = [];

  while (startDate < endDate) {
    var day = startDate.getDate();
    var month = startDate.getMonth() + 1;
    var year = String(startDate.getFullYear()).slice(2);

    // Add leading zeros if needed
    var formattedDay = day < 10 ? "0" + day : day;
    var formattedMonth = month < 10 ? "0" + month : month;

    var formattedDate = `${formattedDay}/${formattedMonth}/${year}`;
    datesArray.push(formattedDate);
    startDate.setDate(startDate.getDate() + 1);
  }

  return datesArray;
}

// Get current date
function getCurrentDate() {
  var currentDate = new Date();
  var year = String(currentDate.getFullYear()).slice(-2); // Extract last two digits of the year
  var month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  var day = String(currentDate.getDate()).padStart(2, "0");

  return `${day}/${month}/${year}`;
}

// Generate an object with all date information
function getDateInfo() {
  let dateInfo = {
    datesArray: getDatesArray(2023, 2024),
    currentDate: getCurrentDate(),
    currentDateIndex: "",
    viewDate: "",
    viewDateIndex: "",
    updadeViewDate: function (dateInfo) {
      dateInfo.datesArray.forEach((date, i) => {
        if (i === dateInfo.viewDateIndex) dateInfo.viewDate = date;
      });
    },
  };
  dateInfo.datesArray.forEach((date, i) => {
    if (date === dateInfo.currentDate) {
      dateInfo.currentDateIndex = i;
      dateInfo.viewDate = date;
      dateInfo.viewDateIndex = i;
    }
  });
  return dateInfo;
}

export { getFormattedTimetable, timetableFilter, dateFilter, getDateInfo };
