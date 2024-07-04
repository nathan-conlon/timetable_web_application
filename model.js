import { userGroup, userCblGroup, dateInfo } from "./controller.js";

// declare reference groupings
const groups = [
  "A01",
  "A02",
  "A03",
  "A04",
  "A05",
  "A06",
  "A07",
  "A08",
  "A09",
  "A10",
  "A11",
  "A12",
  "A13",
  "A14",
  "A15",
  "A16",
  "B01",
  "B02",
  "B03",
  "B04",
  "B05",
  "B06",
  "B07",
  "B08",
  "B09",
  "B10",
  "B11",
  "B12",
  "B13",
  "B14",
  "B15",
  "B16",
];
const cblGroups = [
  "CBL01",
  "CBL02",
  "CBL03",
  "CBL04",
  "CBL05",
  "CBL06",
  "CBL07",
  "CBL08",
  "CBL09",
  "CBL10",
  "CBL11",
  "CBL12",
  "CBL13",
  "CBL14",
  "CBL15",
  "CBL16",
  "CBL17",
  "CBL18",
  "CBL19",
  "CBL20",
  "CBL21",
  "CBL22",
  "CBL23",
  "CBL24",
];

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

// EXCEL DATE IMPORTS NEED WORK

// function to format times
function excelTimeToReadable(excelTime) {
  if (excelTime === "N/A") {
    return "N/A";
  } else if (typeof excelTime === "string") {
    let [time, indicator] = excelTime.split(/(?=[ap]m)/i);
    let [hours, minutes] = time.split(":");

    // Convert hours to 24-hour format
    if (indicator && /pm/i.test(indicator) && hours != "12") {
      hours = String(parseInt(hours, 10) + 12);
    } else if (indicator && /am/i.test(indicator) && hours === "12") {
      hours = "00";
    }

    // Format the hours and minutes
    hours = hours.padStart(2, "0");
    minutes = String(parseInt(minutes, 10)).padStart(2, "0");
    return `${hours}:${minutes}`;
  } else {
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
}

// function to capitalise first letter of each word only

function capitaliseFirstLetter(subject) {
  // Split the string into an array of words
  let words = subject.split(" ");

  // Iterate through the array and capitalize the first letter of each word
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    if (word.length > 0) {
      // Capitalize the first letter and convert the rest to lowercase
      words[i] = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
  }

  // Join the array back into a string and return
  return words.join(" ");
}

// function to format dates
function excelDateToReadable(excelDate) {
  // Excel stores dates as the number of days since January 0, 1900 (with January 1, 1900, as day 1).
  // But it incorrectly treats 1900 as a leap year, so we need to compensate for that.
  var msPerDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  var excelEpoch = new Date(Date.UTC(1899, 11, 30)); // Excel's epoch is December 30, 1899
  var epochAsUnixTimestamp = excelEpoch.getTime();
  var msSinceExcelEpoch = (excelDate - 1) * msPerDay; // Subtract 1 to account for Excel's base date being December 30, 1899
  if (excelDate > 60) {
    // Compensate for the 1900 leap year issue
    msSinceExcelEpoch += msPerDay;
  }

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
  const fileName = "Year1_FoCS_Timetable.xlsx";
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
    // Logic for formatting groups into an array
    if (entry.Group.includes("ALL")) entry.Group = entry.Group.trim();
    if (entry.Group.includes("-")) {
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
    } else if (entry.Group === "ALL") {
      entry.Group = [...groups, ...cblGroups];
    } else entry.Group === entry.Group;

    // convert timestamps
    entry["Start Date"] = excelDateToReadable(entry["Start Date"]);
    entry["Start Time"] = excelTimeToReadable(entry["Start Time"]);
    entry["Subject"] = capitaliseFirstLetter(entry["Subject"]);
    entry["End Time"] = excelTimeToReadable(entry["End Time"]);

    return entry; // Return the modified entry
  });
  console.log(formattedTimetable);
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

function dateFilter(data, viewDate) {
  let filteredTimetable = data.filter((entries) => {
    return entries["Start Date"].includes(viewDate);
  });
  return filteredTimetable;
}

// Generate an array of dates in the calendar year
function getDatesArray(startYear, endYear) {
  var startDate = new Date(startYear, 4, 1); // May is month 4 (0-indexed)
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
    datesArray: getDatesArray(2024, 2025),
    currentDate: getCurrentDate(),
    currentDateIndex: "",
    viewDate: "",
    viewDateIndex: "",
    updateViewDate: function (dateInfo) {
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
