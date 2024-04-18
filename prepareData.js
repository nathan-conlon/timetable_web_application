"user strict";
// import full timetable (stage 1)
import { fullTimetable } from "./model.js";
// declare user inputs

let userGroup = "A01";
let userCblGroup = "CBL01";

document.addEventListener("DOMContentLoaded", function () {
  // Function to call when DOM content is loaded
  console.log("DOM content loaded");

  // Call the function when the DOM content is loaded
  // You can replace the function name "onLoadFunction" with your own function name
  onLoadFunction();
});

document
  .getElementById("group-selector")
  .addEventListener("change", function () {
    // Get the selected option
    var selectedOption = this.value;

    // Call the function passing the selected option
    // You can replace the function name "onChangeFunction" with your own function name
    onChangeFunction(selectedOption);
  });

function onLoadFunction() {
  console.log("Function called when DOM content is loaded");
}

// Define the function to be called when the user changes the option
function onChangeFunction(selectedOption) {
  userGroup = selectedOption;
  console.log("User group:", userGroup);
  groupFilter(userGroup, userCblGroup);
  console.log(filteredTimetable);
  generateScheduleContent(filteredTimetable);
}

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

// format times

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

// format dates

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

// format timetable (stage 2)
let formattedTimetable = fullTimetable.map((entry) => {
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

// filter the timetable (stage 3)
let filteredTimetable;
const groupFilter = function (userGroup, userCblGroup) {
  filteredTimetable = formattedTimetable.filter(
    (entries) =>
      entries.Group.includes(userGroup) || entries.Group.includes(userCblGroup)
  );
  generateScheduleContent(filteredTimetable);
};
groupFilter(userGroup, userCblGroup);

function generateScheduleContent(data) {
  const scheduleDiv = document.getElementById("schedule");

  // Clear existing content
  scheduleDiv.innerHTML = "";

  // Create table element
  const table = document.createElement("table");
  table.classList.add("schedule-table");

  // Define the keys you want to include in the table
  const keysToInclude = [
    "Start Date",
    "Start Time",
    "Group",
    "Location",
    "Subject",
    "Description",
  ];

  // Create table header
  const tableHeader = document.createElement("thead");
  const headerRow = document.createElement("tr");
  keysToInclude.forEach((key) => {
    const th = document.createElement("th");
    th.textContent = key;
    headerRow.appendChild(th);
  });
  tableHeader.appendChild(headerRow);
  table.appendChild(tableHeader);

  // Create table body
  const tableBody = document.createElement("tbody");
  data.forEach((item) => {
    const row = document.createElement("tr");
    keysToInclude.forEach((key) => {
      const cell = document.createElement("td");
      cell.textContent = item[key] || ""; // Set cell content to item[key], or empty string if the key doesn't exist
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });
  table.appendChild(tableBody);

  // Append table to schedule div
  scheduleDiv.appendChild(table);
}

// Call the function with filteredData

// export timetable (stage 4)
export { filteredTimetable };
export { groups };
export { cblGroups };
export { userGroup };
export { userCblGroup };
export { generateScheduleContent };
