let lastModifiedDate;
function fetchHeader(url, wch) {
  try {
    var req = new XMLHttpRequest();
    req.open("HEAD", url, false);
    req.send(null);
    if (req.status == 200) {
      lastModifiedDate = formatDateString(req.getResponseHeader(wch));
      return lastModifiedDate;
    } else return false;
  } catch (er) {
    return er.message;
  }
}

// Function to format date string into a consistent format
function formatDateString(dateString) {
  // Example conversion: Fri Jul 05 2024 11:47:02 GMT+0100 (British Summer Time) to Fri, 05 Jul 2024 11:47:02 GMT
  let date = new Date(dateString);
  return date.toUTCString();
}

// Get current date in UTC to match the format
let pageLoadedAt = new Date().toUTCString();

// Compare dates
function compareDates() {
  lastModifiedDate = fetchHeader("Year1_FoCS_Timetable.xlsx", "Last-Modified");

  // Compare using UTC time to avoid timezone issues
  if (new Date(lastModifiedDate) > new Date(pageLoadedAt)) {
    // Force refresh the page
    location.reload();
  } else {
  }
}

setInterval(compareDates, 6000);
