let fullTimetable;

// Function to fetch data from a file path
async function fetchData(filePath) {
  try {
    // Fetch the file data
    const response = await fetch(filePath);
    const blob = await response.blob();

    // Read the file data as binary
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsBinaryString(blob);
    });
  } catch (error) {
    console.error("Error occurred while fetching data:", error);
    throw error;
  }
}

// Function to parse workbook data
async function parseWorkbook(data) {
  try {
    // Parse the workbook data
    const workbook = XLSX.read(data, { type: "binary" });

    // Extract data from each sheet into an array
    const fullTimetable = workbook.SheetNames.flatMap((sheet) =>
      XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet])
    );

    return fullTimetable;
  } catch (error) {
    console.error("Error occurred while parsing workbook:", error);
    throw error;
  }
}

// Main function to orchestrate the process
async function main() {
  const fileName = "Year2_GERR_Timetable.xlsx";
  const filePath = fileName;

  try {
    // Fetch data from the specified file
    const data = await fetchData(filePath);

    // Parse the workbook data
    fullTimetable = await parseWorkbook(data);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Call the main function to start the process
await main();
// export full timetable
export { fullTimetable };

const getRecipe = async function () {
  try {
    const res = await fetch(
      "https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604691c37cdc054bd00c"
    );
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    console.log(res, data);
  } catch (err) {
    alert(err);
  }
};

getRecipe();
