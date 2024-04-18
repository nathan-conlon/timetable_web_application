import { filteredTimetable } from "./prepareData.js";
import { fullTimetable } from "./model.js";
import { groups } from "./prepareData.js";
import { cblGroups } from "./prepareData.js";
import { userGroup } from "./prepareData.js";
import { userCblGroup } from "./prepareData.js";

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

// Call the function to populate dropdowns when the page loads
window.addEventListener("DOMContentLoaded", populateDropdowns());
