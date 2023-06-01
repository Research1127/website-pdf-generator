document.addEventListener('DOMContentLoaded', function() {
  const search = document.querySelector('.input-group input');
  const tableRows = document.querySelectorAll('tbody tr');
  const filters = document.querySelectorAll('.table-filter');

  // Populate the filters
  populateFilters();

  // Listen for filter changes
  filters.forEach(filter => filter.addEventListener('change', filterTable));

  // Listen for search input
  search.addEventListener('input', searchTable);

  function populateFilters() {
    const uniqueValues = new Map(); // map was used to store the data that have unique value
    tableRows.forEach(row => {
      row.querySelectorAll('td').forEach((cell, index) => {
        const value = cell.textContent.trim();
        if (!uniqueValues.has(index)) {
          uniqueValues.set(index, new Set([value]));
        } else {
          uniqueValues.get(index).add(value);
        }
      });
    });

    filters.forEach((filter, index) => {
      uniqueValues.get(index).forEach(value => {
        const option = document.createElement('option');
        option.text = value;
        option.value = value;
        filter.add(option);
      });
    });
  }

  function searchTable() {
    const searchText = search.value.trim().toLowerCase();
    tableRows.forEach(row => {
      const rowData = Array.from(row.querySelectorAll('td')).map(cell =>
        cell.textContent.trim().toLowerCase()
      );
      const visible = rowData.some(data => data.includes(searchText));
      row.classList.toggle('hide', !visible);
    });
  }

  function filterTable() {
    const filters = {};
    document.querySelectorAll('.table-filter').forEach(select => {
      const column = select.parentElement.cellIndex;
      filters[column] = select.value;
    });

    tableRows.forEach(row => {
      let visible = true;
      for (const [column, value] of Object.entries(filters)) {
        if (value !== 'All' && row.cells[column].textContent !== value) {
          visible = false;
          break;
        }
      }
      row.classList.toggle('hide', !visible);
    });
  }

  // _______________________________________________________________ Part Download PDF ________________________________________________

  // Get all the download buttons
  const downloadButtons = document.querySelectorAll('.download-btn');

  // Attach click event listener to each button
  downloadButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        // Get the row element of the clicked button
        const row = button.parentNode.parentNode;
    
        // Get the values of the row
        const values = Array.from(row.getElementsByTagName('td')).map(td => td.innerText);
    
        // Create an object representing the row
        const rowObject = {
          // Assign named properties to the row object
          column1: values[0],
          column2: values[1],
          column3: values[2],
          column4: values[3],
          column5: values[4],
          column6: values[5],
          column7: values[6],
          column8: values[7],
          column9: values[8],
          column10: values[9],
          column11: values[10],
          column12: values[11],
          column13: values[12],
          column14: values[13],
          // Add more columns as needed
        };
    
        // Convert the row object to JSON string
        const rowJson = JSON.stringify(rowObject);
    
        // Create a form dynamically
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/process_row';
        form.target = '_blank'; // Open PDF in a new tab
    
        // Create an input field to store the row JSON
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'rowJson';
        input.value = rowJson;
    
        // Append the input field to the form
        form.appendChild(input);
    
        // Append the form to the document and submit it
        document.body.appendChild(form);
        form.submit();
      });
    });
  

  
  // _______________________________________________________________ Part Rows Count ______________________________________________________

  let totalRowCount = tableRows.length; // Initialize total row count

  function filterTable() {
    const filters = {};
    document.querySelectorAll('.table-filter').forEach(select => {
        const column = select.parentElement.cellIndex;
        filters[column] = select.value;
    });

    let filteredRowCount = 0; // Initialize filtered row count

    tableRows.forEach(row => {
        let visible = true;
        for (const [column, value] of Object.entries(filters)) {
            if (value !== 'All' && row.cells[column].textContent !== value) {
                visible = false;
                break;
            }
        }
        row.classList.toggle('hide', !visible);

        if (visible) {
            filteredRowCount++; // Increment filtered row count
        }
    });

    // Update the summary section with the filtered row count
    const summarySection = document.getElementById('summary-section');
    summarySection.textContent = 'Count of Rows: ' + filteredRowCount;
  }

  
  filterTable(); // Call the filterTable function to display the initial row count
  

  // _______________________________________________________________ Part Status Count ______________________________________________________

  // Get the table element
  const table = document.getElementById("myTable");

  // Get the index of the "Status" column
  const statusColumnIndex = Array.from(table.getElementsByTagName("th")).findIndex(
    (th) => th.dataset.filter === "status"
  );

  // Get the status counts table
  const statusCountsTable = document.querySelector(".statusCountsTable");

  // Function to calculate and display status counts
  function displayStatusCounts() {
    // Clear the existing rows in the status counts table
    statusCountsTable.innerHTML = "";

    // Get all the unique status values and their counts
    const statusCounts = getStatusCounts();

    // Create table rows for each unique status value and its count
    for (const status in statusCounts) {
      const count = statusCounts[status];
      const row = document.createElement("tr");
      row.innerHTML = `<td>${status}</td><td>${count}</td>`;
      statusCountsTable.appendChild(row);
    }
  }

  // Function to get the status counts based on the filtered data
  function getStatusCounts() {
    // Get the filtered rows
    const filteredRows = Array.from(table.querySelectorAll("tbody tr:not(.hide)"));

    // Create a Set to store unique status values
    const uniqueStatusValues = new Set();

    // Iterate over the filtered rows and collect unique status values
    filteredRows.forEach((row) => {
      const statusCell = row.querySelector(`td:nth-child(${statusColumnIndex + 1})`);
      uniqueStatusValues.add(statusCell.textContent);
    });

    // Count the occurrences of each unique status value
    const statusCounts = {};
    uniqueStatusValues.forEach((statusValue) => {
      statusCounts[statusValue] = Array.from(filteredRows).reduce((count, row) => {
        const statusCell = row.querySelector(`td:nth-child(${statusColumnIndex + 1})`);
        if (statusCell.textContent === statusValue) {
          return count + 1;
        }
        return count;
      }, 0);
    });

    return statusCounts;
  }

  // Event listener for filter changes
  document.querySelectorAll(".table-filter").forEach((filter) => {
    filter.addEventListener("change", () => {
      filterTable();
      displayStatusCounts();
    });
  });

  // Call the displayStatusCounts function initially to populate the status counts table
  displayStatusCounts();

  

// ______________________________________________________________ Part Name Involved _______________________________________________________

// Get the table element
const nameTable = document.getElementById("myTable");

// Get the index of the "Name" column
const nameColumnIndex = Array.from(nameTable.getElementsByTagName("th")).findIndex(
  (th) => th.dataset.filter === "name"
);

// Get the name counts table
const nameCountsTable = document.querySelector(".nameCountsTable");

// Function to calculate and display name counts
function displayNameCounts() {
  // Clear the existing rows in the name counts table
  nameCountsTable.innerHTML = "";

  // Get all the unique name values and their counts
  const nameCounts = getNameCounts();

  // Create table rows for each unique name value and its count
  for (const name in nameCounts) {
    const count = nameCounts[name];
    const row = document.createElement("tr");
    row.innerHTML = `<td>${name}</td><td>${count}</td>`;
    nameCountsTable.appendChild(row);
  }
}

// Function to get the name counts based on the filtered data
function getNameCounts() {
  // Get the filtered rows
  const filteredRows = Array.from(nameTable.querySelectorAll("tbody tr:not(.hide)"));

  // Create a Set to store unique name values
  const uniqueNameValues = new Set();

  // Iterate over the filtered rows and collect unique name values
  filteredRows.forEach((row) => {
    const nameCell = row.querySelector(`td:nth-child(${nameColumnIndex + 1})`);
    uniqueNameValues.add(nameCell.textContent);
  });

  // Count the occurrences of each unique name value
  const nameCounts = {};
  uniqueNameValues.forEach((nameValue) => {
    nameCounts[nameValue] = Array.from(filteredRows).reduce((count, row) => {
      const nameCell = row.querySelector(`td:nth-child(${nameColumnIndex + 1})`);
      if (nameCell.textContent === nameValue) {
        return count + 1;
      }
      return count;
    }, 0);
  });

  return nameCounts;
}

// Event listener for filter changes
document.querySelectorAll(".table-filter").forEach((filter) => {
  filter.addEventListener("change", () => {
    filterTable();
    displayNameCounts();
  });
});

// Call the displayNameCounts function initially to populate the name counts table
displayNameCounts();


// ______________________________________________________________ Part Priority Involved _______________________________________________________

// Get the table element
const priorityTable = document.getElementById("myTable");

// Get the index of the "Priority" column
const priorityColumnIndex = Array.from(priorityTable.getElementsByTagName("th")).findIndex(
  (th) => th.dataset.filter === "priority"
);

// Get the priority counts table
const priorityCountsTable = document.querySelector(".priorityCountsTable");

// Function to calculate and display priority counts
function displayPriorityCounts() {
  // Clear the existing rows in the priority counts table
  priorityCountsTable.innerHTML = "";

  // Get all the unique priority values and their counts
  const priorityCounts = getPriorityCounts();

  // Create table rows for each unique priority value and its count
  for (const priority in priorityCounts) {
    const count = priorityCounts[priority];
    const row = document.createElement("tr");
    row.innerHTML = `<td>${priority}</td><td>${count}</td>`;
    priorityCountsTable.appendChild(row);
  }
}

// Function to get the priority counts based on the filtered data
function getPriorityCounts() {
  // Get the filtered rows
  const filteredRows = Array.from(nameTable.querySelectorAll("tbody tr:not(.hide)"));

  // Create a Set to store unique priority values
  const uniquePriorityValues = new Set();

  // Iterate over the filtered rows and collect unique priority values
  filteredRows.forEach((row) => {
    const priorityCell = row.querySelector(`td:nth-child(${priorityColumnIndex + 1})`);
    uniquePriorityValues.add(priorityCell.textContent);
  });

  // Count the occurrences of each unique priority value
  const priorityCounts = {};
  uniquePriorityValues.forEach((priorityValue) => {
    priorityCounts[priorityValue] = Array.from(filteredRows).reduce((count, row) => {
      const priorityCell = row.querySelector(`td:nth-child(${priorityColumnIndex + 1})`);
      if (priorityCell.textContent === priorityValue) {
        return count + 1;
      }
      return count;
    }, 0);
  });

  return priorityCounts;
}

// Event listener for filter changes
document.querySelectorAll(".table-filter").forEach((filter) => {
  filter.addEventListener("change", () => {
    filterTable();
    displayPriorityCounts();
  });
});

// Call the displayPriorityCounts function initially to populate the priority counts table
displayPriorityCounts();


});
