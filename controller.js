"user strict";
import View, { userGroup, userCblGroup } from "./View.js";
import {
  dateFilter,
  timetableFilter,
  getFormattedTimetable,
  getDateInfo,
} from "./model.js";

const view = new View();
const dateInfo = getDateInfo();

async function getTableHTML() {
  // Get formatted timetable
  const formattedTimetable = await getFormattedTimetable();
  // Filter the timetable
  const filteredTimetable = timetableFilter(formattedTimetable);
  // Apply date filter
  const dateFilteredTimetable = dateFilter(filteredTimetable);
  // Generate the timetable HTML
  const tableHTML = view.generateTable(dateFilteredTimetable);
  // Append the HTML to the DOM
  return tableHTML;
}
getTableHTML().then((tableHTML) => {
  view.renderTable(tableHTML);
  view.renderViewDate(dateInfo.currentDate);
});

function changeDate(direction) {
  dateInfo.viewDateIndex += direction === "previous" ? -1 : 1;
  dateInfo.updateViewDate(dateInfo);
  view.renderViewDate(dateInfo.viewDate);
  view.updateTable();
}

export { userGroup, userCblGroup, getTableHTML, dateInfo, changeDate };
