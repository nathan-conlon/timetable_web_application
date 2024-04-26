import { getTableHTML, changeDate } from "./controller.js";

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
  // updateViewDate(date) {
  //   const dateSelector = document.getElementById("date-selector");
  //   dateSelector.value = date;

  // generate the HTML for the dropdown menus
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
    // Define the keys you want to include in the table
    const keysToInclude = [
      "Start Date",
      "Start Time",
      "Group",
      "Location",
      "Subject",
      "Description",
    ];

    // Generate table header HTML
    const tableHeaderHTML = `
      <thead>
        <tr>
          ${keysToInclude.map((key) => `<th>${key}</th>`).join("")}
        </tr>
      </thead>
    `;

    // Generate table body HTML
    const tableBodyHTML = `
      <tbody>
        ${data
          .map(
            (item) => `
          <tr>
            ${keysToInclude
              .map((key) => `<td>${item[key] || ""}</td>`)
              .join("")}
          </tr>
        `
          )
          .join("")}
      </tbody>
    `;

    // Generate complete table HTML
    const tableHTML = `
      <table class="schedule-table">
        ${tableHeaderHTML}
        ${tableBodyHTML}
      </table>
    `;

    return tableHTML;
  }
  // append the table to the DOM
  renderTable(markup) {
    // Clear existing content
    this.parentElement.innerHTML = "";
    // Append markup to schedule div
    this.parentElement.innerHTML = markup;
  }
  updateTable() {
    getTableHTML()
      .then((result) => {
        const newMarkup = result;
        const newDOM = document
          .createRange()
          .createContextualFragment(newMarkup);
        const newElements = Array.from(newDOM.querySelectorAll("*"));
        const curElements = Array.from(
          this.parentElement.querySelectorAll("*")
        );
        newElements.forEach((newEl, i) => {
          const curEl = curElements[i];
          // Updates changed TEXT
          if (
            !newEl.isEqualNode(curEl) &&
            newEl.firstChild?.nodeValue.trim() !== ""
          ) {
            curEl.textContent = newEl.textContent;
            curEl.style.backgroundColor = "green";
          }

          // Updates changed ATTRIBUES
          if (!newEl.isEqualNode(curEl))
            Array.from(newEl.attributes).forEach((attr) =>
              curEl.setAttribute(attr.name, attr.value)
            );
        });
      })
      .catch((error) => {
        console.error("Error while getting table HTML:", error);
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
    document.getElementById("previous").addEventListener("click", function () {
      changeDate("previous");
    });
    document.getElementById("next").addEventListener("click", function () {
      changeDate("next");
    });
  }
}

export { userGroup, userCblGroup };
