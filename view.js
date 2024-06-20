import { getTableHTML, changeDate, dateInfo } from "./controller.js";

let userGroup;
let userCblGroup;

// Local storage
const persistGroup = function () {
  localStorage.setItem("userGroup", userGroup);
};
const persistCblGroup = function () {
  localStorage.setItem("userCblGroup", userCblGroup);
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
    this.applyLocalStorageInfo();
    this.handleResize();
    this.adjustImageOpacity();
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
  applyLocalStorageInfo() {
    const groupSelector = document.getElementById("group-selector");
    const cblGroupSelector = document.getElementById("cbl-group-selector");
    groupSelector.innerHTML = userGroup + '<span style="float: right">></span>';
    cblGroupSelector.innerHTML =
      userCblGroup + '<span style="float: right">></span>';
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
        item.style.backgroundColor = "#90dbf4";
      }
      if (subject === "Practical") {
        item.style.backgroundColor = "#f1c0e8";
      }
      if (subject === "Tutorial") {
        item.style.backgroundColor = "#98f5e1";
      }
      if (subject === "Other") {
        item.style.backgroundColor = "#e5e5e5";
      }
      if (subject === "Workshop") {
        item.style.backgroundColor = "#ff8fa3";
      }
    });
  }

  // function to dynamically control logo opacity

  adjustImageOpacity() {
    const image = document.getElementById("logo");
    const maxViewportWidth = window.innerWidth; // Get the current viewport width
    const minViewportWidth = 700; // Define the minimum viewport width for opacity scaling

    if (maxViewportWidth > minViewportWidth) {
      const newOpacity =
        (maxViewportWidth - minViewportWidth) / maxViewportWidth;
      image.style.opacity = newOpacity;
    } else {
      image.style.opacity = 0.0; // Set a minimum opacity when the viewport width is very small
    }
  }

  // function to handle group changes
  selectGroup(selectedOption, id) {
    if (id === "popup") {
      userGroup = selectedOption;
      const popup = document.getElementById("popup");
      persistGroup();
      const groupSelector = document.getElementById("group-selector");
      groupSelector.innerHTML =
        userGroup + '<span style="float: right">></span>';
      document.getElementById("group-selector").style.display = "block";
      this.updateTable();
    }
    if (id === "cbl-popup") {
      userCblGroup = selectedOption;
      const cblPopup = document.getElementById("cbl-popup");
      persistCblGroup();
      const cblGroupSelector = document.getElementById("cbl-group-selector");
      cblGroupSelector.innerHTML =
        userCblGroup + '<span style="float: right">></span>';
      document.getElementById("cbl-group-selector").style.display = "block";
      this.updateTable();
    }
  }
  handleResize() {
    var overlay = document.getElementById("overlay");
    overlay.classList.remove("active");
    var iconQuestions = document.getElementsByClassName("icon-question");
    Array.from(iconQuestions).forEach((q) => q.classList.remove("active"));
    const timetableContainers = document.querySelectorAll(
      ".timetable-container"
    );
    document.getElementById("cbl-transformer").classList.remove("active");
    document.getElementById("transformer").classList.remove("active");
    document.getElementById("popup").classList.remove("active");
    document.getElementById("cbl-popup").classList.remove("active");
    document.getElementById("group-selector").style.display = "block";
    document.getElementById("cbl-group-selector").style.display = "block";
    document.getElementById("popup-header").classList.remove("active");
    document.getElementById("cbl-popup-header").classList.remove("active");

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
  handleDateClickVisual(e) {
    if (e.target.id === "previous") {
      const prevBtn = document.getElementById("previous");
      prevBtn.classList.add("clicked");
      setTimeout(function () {
        prevBtn.classList.remove("clicked");
      }, 150);
    }
    if (e.target.id === "next") {
      const nextBtn = document.getElementById("next");
      nextBtn.classList.add("clicked");
      setTimeout(function () {
        nextBtn.classList.remove("clicked");
      }, 100);
    }
  }
  // add event listeners to dropdown menu
  addEventListeners() {
    function updateEventListeners() {
      var groupContainer = document.getElementById("group-container");

      if (window.innerWidth <= 768) {
        groupContainer.addEventListener("click", handleClick);
      } else {
        groupContainer.removeEventListener("click", handleClick);
      }
    }

    // Define the event handler function separately
    function handleClick(e) {
      if (e.target.classList.contains("icon-question")) {
        document.getElementById("overlay").classList.toggle("active");
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
    }
    // Initial check and setup
    updateEventListeners();
    // Update event listeners on window resize
    window.addEventListener("resize", updateEventListeners);

    const selectGroup = this.selectGroup.bind(this);
    document.getElementById("popup").addEventListener("click", function (e) {
      // Get the selected option
      var id = this.id;
      var selectedOption = e.target.textContent;
      // required formats for selected option
      const format = /^[A-Z][0-9]{2}$/;
      if (format.test(selectedOption)) {
        selectGroup(selectedOption, id);
        document.getElementById("overlay").classList.toggle("active");
        document.getElementById("transformer").classList.toggle("active");
        document.getElementById("popup").classList.toggle("active");
        document.getElementById("popup-header").classList.toggle("active");
      }
    });

    document
      .getElementById("cbl-popup")
      .addEventListener("click", function (e) {
        // Get the selected option
        var id = this.id;
        var selectedOption = e.target.textContent;
        // required formats for selected option
        const cblFormat = /^[A-Z]{3}[0-9]{2}$/;
        if (cblFormat.test(selectedOption)) {
          selectGroup(selectedOption, id);
          document.getElementById("overlay").classList.toggle("active");
          document.getElementById("cbl-transformer").classList.toggle("active");
          document.getElementById("cbl-popup").classList.toggle("active");
          document
            .getElementById("cbl-popup-header")
            .classList.toggle("active");
        }
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
    document
      .getElementById("group-selector")
      .addEventListener("click", function () {
        document.getElementById("overlay").classList.toggle("active");
        document.getElementById("transformer").classList.toggle("active");
        document.getElementById("popup-header").classList.toggle("active");
        document.getElementById("group-selector").style.display = "none";
        document.getElementById("popup").classList.toggle("active");
      });
    document
      .getElementById("cbl-group-selector")
      .addEventListener("click", function () {
        document.getElementById("overlay").classList.toggle("active");
        document.getElementById("cbl-transformer").classList.toggle("active");
        document.getElementById("cbl-popup-header").classList.toggle("active");
        document.getElementById("cbl-group-selector").style.display = "none";
        document.getElementById("cbl-popup").classList.toggle("active");
      });
    document.getElementById("date-buttons").addEventListener("click", (e) => {
      this.handleDateClickVisual(e);
    });
    document.addEventListener("DOMContentLoaded", function () {
      const closeBtn = document.querySelector(".close");
      const iconQuestion = document.querySelector(".q");
      closeBtn.addEventListener("click", function () {
        iconQuestion.classList.toggle("active");
        document.getElementById("overlay").classList.toggle("active");
      });
    });
    document.addEventListener("DOMContentLoaded", function () {
      const closeBtn = document.querySelector(".cbl-close");
      const iconQuestion = document.querySelector(".cbl-q");
      closeBtn.addEventListener("click", function () {
        iconQuestion.classList.toggle("active");
        document.getElementById("overlay").classList.toggle("active");
      });
    });
    window.addEventListener("resize", this.handleResize);
    window.addEventListener("resize", this.adjustImageOpacity);
  }
}

export { userGroup, userCblGroup };
