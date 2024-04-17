import { filteredTimetable } from "./prepareData.js";
import { fullTimetable } from "./script.js";

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
generateScheduleContent(filteredTimetable);
