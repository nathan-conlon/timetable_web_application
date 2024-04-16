"user strict";
// import full timetable (stage 1)
import { fullTimetable } from "./script.js";

// declare user inputs
let userGroup = "A01";
let userCblGroup = "CBL01";

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

// format timetable (stage 2)
let formattedTimetable = fullTimetable.map((entry) => {
  // Remove whitespace from keys
  Object.keys(entry).forEach((key) => {
    const trimmedKey = key.trim();
    if (key !== trimmedKey) {
      entry[trimmedKey] = entry[key];
      delete entry[key];
    }
  });

  // Split the groups into string iterations
  let string = entry.Group.split("-");
  // Remove whitespace from string iterations
  string = string.map((str) => str.trim());
  // Turn entry.groups into an empty array
  entry.Group = [];

  // Define the reference groups based on the condition
  const referenceGroups = string[0][0] !== "C" ? groups : cblGroups;

  // Loop through reference groups and fill the emptied groups array
  entry.Group = referenceGroups.slice(
    referenceGroups.indexOf(string[0]),
    referenceGroups.indexOf(string[1]) + 1
  );

  return entry; // Return the modified entry
});

// filter the timetable (stage 3)
let filteredTimetable;
const groupFilter = function (userGroup, userCblGroup) {
  filteredTimetable = formattedTimetable.filter(
    (entries) =>
      entries.Group.includes(userGroup) || entries.Group.includes(userCblGroup)
  );
};
groupFilter(userGroup, userCblGroup);

// export timetable (stage 4)
export { filteredTimetable };

console.log(formattedTimetable);
