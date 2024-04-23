"user strict";
import View, { userGroup, userCblGroup } from "./View.js";
import { timetableFilter, getFormattedTimetable } from "./model.js";

const view = new View();

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

// INIT - WORKING CORRECTLY

async function getTableHTML() {
  // Get formatted timetable
  const formattedTimetable = await getFormattedTimetable();
  // Filter the timetable
  const filteredTimetable = timetableFilter(formattedTimetable);
  // Generate the timetable HTML
  const tableHTML = view.generateTable(filteredTimetable);
  // Append the HTML to the DOM
  return tableHTML;
}
getTableHTML().then((tableHTML) => view.renderTable(tableHTML));

export { groups, cblGroups, userGroup, userCblGroup, getTableHTML };
