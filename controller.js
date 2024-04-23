"user strict";
import { userGroup } from "./View.js";
import { userCblGroup } from "./View.js";
import View from "./View.js";
import { timetableFilter } from "./model.js";
import { getFormattedTimetable } from "./model.js";

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

async function init() {
  // Render dropdownds
  view.renderDropdowns();
  // Get formatted timetable
  const formattedTimetable = await getFormattedTimetable();
  // Filter the timetable
  const filteredTimetable = timetableFilter(formattedTimetable);
  // Render the timetable
  const markup = view.generateTable(filteredTimetable);
  view.renderTable(markup);
}
init();

export { groups };
export { cblGroups };
export { userGroup };
export { userCblGroup };
export { init };
