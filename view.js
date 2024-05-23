import { getTableHTML, changeDate, dateInfo } from "./controller.js";

let userGroup;
let userCblGroup;

// Local storage
const persistGroup = function () {
  localStorage.setItem("userGroup", JSON.stringify(userGroup));
};
const persistCblGroup = function () {
  localStorage.setItem("userCblGroup", JSON.stringify(userCblGroup));
};

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
    this.getLocalStorage();
    this.renderDropdowns();
    this.handleResize();
  }
  renderViewDate(date) {
    const dateSelector = document.getElementById("date-selector");
    dateSelector.value = date;
    const previousBtn = document.getElementById("previous");
    const nextBtn = document.getElementById("next");
    previousBtn.disabled =
      dateInfo.viewDateIndex ===
      dateInfo.datesArray.indexOf(dateInfo.datesArray[0])
        ? true
        : false;
    nextBtn.disabled =
      dateInfo.viewDateIndex === dateInfo.datesArray.length - 1 ? true : false;
  }
  getLocalStorage() {
    userGroup = localStorage.getItem("userGroup") || "A01";
    userCblGroup = localStorage.getItem("userCblGroup") || "CBL01";
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
    groupSelector.value = JSON.parse(userGroup);
    cblGroupSelector.value = JSON.parse(userCblGroup);
  }
  // generate the HTML for the schedule table
  generateTable(data) {
    // Define the keys you want to include in the flexbox divs
    const keys = [
      "Start Time",
      "End Time",
      "Location",
      "Subject",
      "Description",
    ];

    // Helper function to parse the time
    const parseTime = (timeStr) => new Date(`1970-01-01T${timeStr}:00`);

    // Sort the data array by the "Start Time"
    data.sort(
      (a, b) => parseTime(a["Start Time"]) - parseTime(b["Start Time"])
    );

    // Generate flexbox divs HTML
    const tableHTML = data
      // Iterate over each timetable entry
      .map(
        (item) => `
      <div class="timetable-container">
      ${keys
        // Iterate over each key
        .map(
          (key) => `
        <div class="timetable-item">
          <div class="timetable-item-value">${item[key] || ""}</div>
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
      const containers = document.querySelectorAll(".timetable-container");
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
        this.handleResize();
      })
      .catch((error) => {
        console.error("Error while getting table HTML:", error);
      });
  }

  applyColorCode() {
    let items = document.querySelectorAll(".timetable-container");
    items.forEach((item) => {
      let subject = item
        .querySelectorAll(".timetable-item")[3]
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
      persistGroup();
      this.updateTable();
    }
    if (id === "cbl-group-selector") {
      userCblGroup = selectedOption;
      persistCblGroup();
      this.updateTable();
    }
  }
  handleResize() {
    var iconQuestions = document.getElementsByClassName("icon-question");
    Array.from(iconQuestions).forEach((q) => q.classList.remove("active"));
    const timetableContainers = document.querySelectorAll(
      ".timetable-container"
    );

    timetableContainers.forEach((container) => {
      const children = container.children;

      if (window.innerWidth < 768) {
        // Hide the 2nd and 4th children
        children[1].style.display = "none"; // 2nd child
        children[3].style.display = "none"; // 4th child
      } else {
        // Show the 2nd and 4th children
        children[1].style.display = "block"; // 2nd child
        children[3].style.display = "block"; // 4th child
      }
    });
  }
  // add event listeners to dropdown menu
  addEventListeners() {
    if (window.innerWidth <= 480) {
      var groupContainer = document.getElementById("group-container");
      groupContainer.addEventListener("click", function (e) {
        if (e.target.classList.contains("icon-question")) {
          e.target.classList.toggle("active");

          // Get all elements inside groupContainer
          var elements = groupContainer.querySelectorAll(".icon-question");

          // Iterate through each element and remove 'active' class except for e.target
          elements.forEach(function (element) {
            if (element !== e.target && element.classList.contains("active")) {
              element.classList.remove("active");
            }
          });
        }
      });
    }
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
      this.updateTable();
    });
    document.getElementById("next").addEventListener("click", () => {
      changeDate("next");
      this.updateTable();
    });
    document.getElementById("date-selector").addEventListener("change", () => {
      changeDate("textEntry");
      this.updateTable();
    });
    window.addEventListener("resize", this.handleResize);
  }
}

export { userGroup, userCblGroup };
