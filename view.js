import { getTableHTML, changeDate, dateInfo } from "./controller.js";

let userGroup = "A01";
let userCblGroup = "CBL01";

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

export default class View {
  parentElement = document.getElementById("schedule");
  constructor() {
    this.addEventListeners();
    this.renderDropdowns();
  }
  renderViewDate(date) {
    const dateSelector = document.getElementById("date-selector");
    dateSelector.value = date;
  }
  renderDropdowns() {
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
  // generate the HTML for the schedule table
  generateTable(data) {
    // Define the keys you want to include in the flexbox divs
    const keys = [
      "Start Date",
      "Start Time",
      "Location",
      "Subject",
      "Description",
    ];

    // Generate flexbox divs HTML
    const tableHTML = data
      // Iterate over each timetable entry
      .map(
        (item) => `
    <div class="flexbox-container">
    ${keys
      // Iterate over each key
      .map(
        (key) => `
      <div class="flexbox-item">
        <div class="flexbox-item-value">${item[key] || ""}</div>
      </div>
    `
      )
      .join("")}
    </div>
`
      )
      .join("");

    return tableHTML;
  }

  // append the table to the DOM
  renderTable(markup) {
    // Clear existing content
    this.parentElement.innerHTML = "";
    // Append markup to schedule div
    this.parentElement.innerHTML = markup;

    // Function to add animation class to flexbox containers
    function animateContainers() {
      const containers = document.querySelectorAll(".flexbox-container");
      containers.forEach((container, index) => {
        setTimeout(() => {
          container.classList.add("show");
        }, (index + 1) * 15);
      });
    }
    // Call the animation function after the containers are injected into the DOM
    animateContainers();

    this.applyColorCode();
  }
  updateTable() {
    getTableHTML()
      .then((tableHTML) => {
        this.renderTable(tableHTML);
        this.renderViewDate(dateInfo.viewDate);
        this.applyColorCode();
      })
      .catch((error) => {
        console.error("Error while getting table HTML:", error);
      });
  }

  applyColorCode() {
    let items = document.querySelectorAll(".flexbox-container");
    items.forEach((item) => {
      let subject = item
        .querySelectorAll(".flexbox-item")[3]
        .textContent.trim();
      if (subject === "Case Based Tutorial") {
        item.style.backgroundColor = "#fde4cf";
      }
      if (subject === "Lecture") {
        item.style.backgroundColor = "#f1c0e8";
      }
      if (subject === "Practical") {
        item.style.backgroundColor = "#90dbf4";
      }
      if (subject === "Tutorial") {
        item.style.backgroundColor = "#98f5e1";
      }
    });
  }

  // function to handle group changes
  handleGroupChange(selectedOption, id) {
    if (id === "group-selector") {
      userGroup = selectedOption;
      this.updateTable();
    }
    if (id === "cbl-group-selector") {
      userCblGroup = selectedOption;
      this.updateTable();
    }
  }
  handleDateChange(date) {}
  // add event listeners to dropdown menu
  addEventListeners() {
    const handleGroupChange = this.handleGroupChange.bind(this);
    document
      .getElementById("group-selector")
      .addEventListener("change", function () {
        // Get the selected option
        var id = this.id;
        var selectedOption = this.value;

        // Call the function passing the selected option
        // You can replace the function name "handleGroupChange" with your own function name
        handleGroupChange(selectedOption, id);
      });

    document
      .getElementById("cbl-group-selector")
      .addEventListener("change", function () {
        // Get the selected option
        var id = this.id;
        var selectedOption = this.value;

        // Call the function passing the selected option
        // You can replace the function name "handleGroupChange" with your own function name
        handleGroupChange(selectedOption, id);
      });
    document.getElementById("previous").addEventListener("click", () => {
      changeDate("previous");
      this.updateTable(); // Use `this.updateTable()` here
    });
    document.getElementById("next").addEventListener("click", () => {
      changeDate("next");
      this.updateTable(); // Use `this.updateTable()` here
    });
  }
}

export { userGroup, userCblGroup };
