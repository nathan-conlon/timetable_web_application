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
        this.checkSchedule();
        this.renderViewDate(dateInfo.viewDate);
        this.applyColorCode();
        this.handleResize();
      })
      .catch((error) => {
        console.error("Error while getting table HTML:", error);
      });
  }

  checkSchedule() {
    const scheduleDiv = document.getElementById("schedule");
    const nothingToday = document.getElementById("nothing-today");
    if (scheduleDiv.innerHTML.trim() === "") {
      nothingToday.classList.add("active");
    }
    if (scheduleDiv.innerHTML.trim() !== "")
      nothingToday.classList.remove("active");
  }

  applyColorCode() {
    let items = document.querySelectorAll(".timetable-container");
    const colorMap = {
      "Case Based Tutorial": "#fde4cf",
      Lecture: "#90dbf4",
      Practical: "#f1c0e8",
      Tutorial: "#98f5e1",
      Other: "#e5e5e5",
      Workshop: "#ff8fa3",
    };

    items.forEach((item) => {
      let subjectElement = item.querySelectorAll(".timetable-item")[3];
      if (subjectElement) {
        let subject = subjectElement.textContent.trim();
        if (colorMap[subject]) {
          item.style.backgroundColor = colorMap[subject];
        }
      }
    });
  }

  // function to dynamically control logo opacity

  adjustImageOpacity() {
    const image = document.getElementById("logo");
    const maxViewportWidth = window.innerWidth; // Get the current viewport width
    const minViewportWidth = 769; // Define the minimum viewport width for opacity scaling

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
    let group, persistFunction, groupSelectorId;
    if (id === "popup") {
      userGroup = selectedOption;
      group = userGroup;
      persistFunction = persistGroup;
      groupSelectorId = "group-selector";
    } else if (id === "cbl-popup") {
      userCblGroup = selectedOption;
      group = userCblGroup;
      persistFunction = persistCblGroup;
      groupSelectorId = "cbl-group-selector";
    } else {
      return;
    }
    persistFunction();
    const groupSelector = document.getElementById(groupSelectorId);
    groupSelector.innerHTML = group + '<span style="float: right">></span>';
    groupSelector.style.display = "block";
    this.updateTable();
  }
  handleResize() {
    const overlay = document.getElementById("overlay");
    overlay.classList.remove("active");

    const iconQuestions = document.getElementsByClassName("icon-question");
    Array.from(iconQuestions).forEach((q) => q.classList.remove("active"));

    const timetableContainers = document.querySelectorAll(
      ".timetable-container"
    );

    const elementsToDeactivate = [
      "cbl-transformer",
      "transformer",
      "popup",
      "cbl-popup",
      "popup-header",
      "cbl-popup-header",
    ];

    elementsToDeactivate.forEach((id) => {
      document.getElementById(id).classList.remove("active");
    });

    document.getElementById("group-selector").style.display = "block";
    document.getElementById("cbl-group-selector").style.display = "block";

    timetableContainers.forEach((container) => {
      const children = container.children;
      if (window.innerWidth < 768) {
        // Hide the 2nd and 4th children
        if (children[1]) children[1].style.display = "none";
        if (children[3]) children[3].style.display = "none";
      } else {
        // Show the 2nd and 4th children
        if (children[1]) children[1].style.display = "block";
        if (children[3]) children[3].style.display = "block";
      }
    });
  }
  handleDateClickVisual(e) {
    const buttonId = e.target.id;
    if (buttonId === "previous" || buttonId === "next") {
      const button = document.getElementById(buttonId);
      button.classList.add("clicked");
      setTimeout(
        () => {
          button.classList.remove("clicked");
        },
        buttonId === "previous" ? 150 : 100
      );
    }
  }
  // add event listeners to dropdown menu
  addEventListeners() {
    function updateEventListeners() {
      const groupContainer = document.getElementById("group-container");

      if (window.innerWidth <= 768) {
        if (!groupContainer.classList.contains("click-listener-added")) {
          groupContainer.addEventListener("click", handleClick);
          groupContainer.classList.add("click-listener-added");
        }
      } else {
        if (groupContainer.classList.contains("click-listener-added")) {
          groupContainer.removeEventListener("click", handleClick);
          groupContainer.classList.remove("click-listener-added");
        }
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

    function handlePopupClick(
      e,
      id,
      format,
      overlayId,
      transformerId,
      popupId,
      headerId
    ) {
      const selectedOption = e.target.textContent;
      if (format.test(selectedOption)) {
        selectGroup(selectedOption, id);
        document.getElementById(overlayId).classList.toggle("active");
        document.getElementById(transformerId).classList.toggle("active");
        document.getElementById(popupId).classList.toggle("active");
        document.getElementById(headerId).classList.toggle("active");
      }
    }

    document.getElementById("popup").addEventListener("click", function (e) {
      handlePopupClick(
        e,
        "popup",
        /^[A-Z][0-9]{2}$/,
        "overlay",
        "transformer",
        "popup",
        "popup-header"
      );
    });

    document
      .getElementById("cbl-popup")
      .addEventListener("click", function (e) {
        handlePopupClick(
          e,
          "cbl-popup",
          /^[A-Z]{3}[0-9]{2}$/,
          "overlay",
          "cbl-transformer",
          "cbl-popup",
          "cbl-popup-header"
        );
      });

    function handleDateChange(direction) {
      changeDate(direction);
      this.updateTable();
    }

    document
      .getElementById("previous")
      .addEventListener("click", () => handleDateChange.call(this, "previous"));
    document
      .getElementById("next")
      .addEventListener("click", () => handleDateChange.call(this, "next"));
    document
      .getElementById("date-selector")
      .addEventListener("change", () =>
        handleDateChange.call(this, "textEntry")
      );

    function handleGroupSelectorClick(
      overlayId,
      transformerId,
      popupHeaderId,
      groupSelectorId,
      popupId
    ) {
      document.getElementById(overlayId).classList.toggle("active");
      document.getElementById(transformerId).classList.toggle("active");
      document.getElementById(popupHeaderId).classList.toggle("active");
      document.getElementById(groupSelectorId).style.display = "none";
      document.getElementById(popupId).classList.toggle("active");
    }

    document
      .getElementById("group-selector")
      .addEventListener("click", () =>
        handleGroupSelectorClick(
          "overlay",
          "transformer",
          "popup-header",
          "group-selector",
          "popup"
        )
      );

    document
      .getElementById("cbl-group-selector")
      .addEventListener("click", () =>
        handleGroupSelectorClick(
          "overlay",
          "cbl-transformer",
          "cbl-popup-header",
          "cbl-group-selector",
          "cbl-popup"
        )
      );
    document.getElementById("date-buttons").addEventListener("click", (e) => {
      this.handleDateClickVisual(e);
    });
    document.addEventListener("DOMContentLoaded", function () {
      function handleCloseButtonClick(closeBtnSelector, iconQuestionSelector) {
        const closeBtn = document.querySelector(closeBtnSelector);
        const iconQuestion = document.querySelector(iconQuestionSelector);
        closeBtn.addEventListener("click", function () {
          iconQuestion.classList.toggle("active");
          document.getElementById("overlay").classList.toggle("active");
        });
      }
      handleCloseButtonClick(".close", ".q");
      handleCloseButtonClick(".cbl-close", ".cbl-q");
    });
    window.addEventListener("resize", () => {
      this.handleResize();
      this.adjustImageOpacity();
    });
  }
}

export { userGroup, userCblGroup };
