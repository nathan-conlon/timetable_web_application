import { filteredTimetable } from "./controller.js";
import { groups } from "./controller.js";
import { cblGroups } from "./controller.js";
import { groupFilter } from "./controller.js";

let userGroup = "A01";
let userCblGroup = "CBL01";

document
  .getElementById("group-selector")
  .addEventListener("change", function () {
    // Get the selected option
    var id = this.id;
    var selectedOption = this.value;

    // Call the function passing the selected option
    // You can replace the function name "onChangeFunction" with your own function name
    onChangeFunction(selectedOption, id);
  });

document
  .getElementById("cbl-group-selector")
  .addEventListener("change", function () {
    // Get the selected option
    var id = this.id;
    var selectedOption = this.value;

    // Call the function passing the selected option
    // You can replace the function name "onChangeFunction" with your own function name
    onChangeFunction(selectedOption, id);
  });

// Define the function to be called when the user changes the option
function onChangeFunction(selectedOption, id) {
  if (id === "group-selector") {
    userGroup = selectedOption;
    console.log("User group:", userGroup);
    groupFilter(userGroup, userCblGroup);
    generateScheduleContent(filteredTimetable);
  }
  if (id === "cbl-group-selector") {
    userCblGroup = selectedOption;
    console.log("CBL user group:", userCblGroup);
    groupFilter(userGroup, userCblGroup);
    generateScheduleContent(filteredTimetable);
  }
}

// dynamically add groups to html

function populateDropdowns() {
  const groupSelector = document.getElementById("group-selector");
  const cblGroupSelector = document.getElementById("cbl-group-selector");
  // Clear existing options
  groupSelector.innerHTML = "";
  cblGroupSelector.innerHTML = "";

  // Add options for groups
  groups.forEach((group) => {
    const option = document.createElement("option");
    option.text = group;
    option.value = group;
    groupSelector.appendChild(option);
  });

  // Add options for CBL groups
  cblGroups.forEach((cblGroup) => {
    const option = document.createElement("option");
    option.text = cblGroup;
    option.value = cblGroup;
    cblGroupSelector.appendChild(option);
  });
}

export function generateScheduleContent(data) {
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

export { userGroup };
export { userCblGroup };
export { groupFilter };
export { populateDropdowns };
