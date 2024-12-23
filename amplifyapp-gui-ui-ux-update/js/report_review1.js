document.addEventListener('DOMContentLoaded', () => {
  const loginTime = localStorage.getItem('loginTime');
  if (loginTime) {
    console.log(`Time taken for successful login: ${loginTime} ms`);

    // Clear the stored time after retrieving it
    localStorage.removeItem('loginTime');
  }
});

var fetchedData = []; // Store fetched data globally
var sortedData = []; // Store sorted data globally
let currentLanguage = localStorage.getItem('CurrLang') || 'en';
const fields = {
  en: ['date', 'meeting_title', 'company', 'report_contents'],
  ja: ['date', 'meeting_title', 'company', 'report_contents'],
};

const headers = {
  en: ['Date', 'Title', 'Customer Name', 'Contents'],
  ja: ['日付', 'タイトル', '顧客名', '内容'],
};

var fetchReports = () => {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  fetch('https://nb8i9zluk4.execute-api.us-east-2.amazonaws.com/Dev/search', requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result && result.statusCode === 200) {
        fetchedData = JSON.parse(result.body); // Parse the body to convert it to an array
        sortData('date', 'newest'); // Sort by date (newest to oldest) by default
      } else {
        console.error('Error fetching data:', result);
      }
    })
    .catch((error) => console.error('error', error));
};

var debounceTimeout = null;

var debounce = (func, delay) => {
  return function () {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => func.apply(this, arguments), delay);
  };
};

var showSuggestions = debounce(() => {
  fetchReports(); // Ensure this is called to fetch the data before typing in the search

  var searchParam = document.getElementById('search_parameter').value;
  var searchValue = document.getElementById('search_value').value.trim().toLowerCase();
  var suggestionsDiv = document.getElementById('suggestions');
  suggestionsDiv.innerHTML = '';

  if (fetchedData && fetchedData.length > 0) {
    var filteredData = fetchedData.filter((report) => report[searchParam]?.S?.toLowerCase().includes(searchValue));

    if (filteredData.length > 0 && searchValue.length > 0) {
      // Show suggestions only if searchValue is not empty
      var suggestionList = document.createElement('ul');

      filteredData.forEach((item) => {
        var suggestionItem = document.createElement('li');
        suggestionItem.textContent = item[searchParam]?.S || '';
        suggestionItem.onclick = () => {
          document.getElementById('search_value').value = item[searchParam]?.S || '';
          suggestionsDiv.innerHTML = ''; // Clear suggestions when a suggestion is clicked
        };
        suggestionList.appendChild(suggestionItem);
      });

      suggestionsDiv.appendChild(suggestionList);
    }
  }
}, 300);

window.onload = function () {
  sortedData = [...fetchedData]; // Copy the fetched data
  sortData(sortBy, sortOrder); // Sort by date (newest) by default
};

var sortData = (column, order) => {
  sortBy = column;
  sortOrder = order;

  sortedData = [...fetchedData]; // Ensure we are always sorting original data

  if (column === 'date') {
    sortedData.sort((a, b) => {
      var dateA = new Date(a.date.S);
      var dateB = new Date(b.date.S);
      return order === 'newest' ? dateB - dateA : dateA - dateB;
    });
  } else {
    sortedData.sort((a, b) => {
      var textA = a[column]?.S?.toLowerCase() || '';
      var textB = b[column]?.S?.toLowerCase() || '';
      return order === 'asc' ? textA.localeCompare(textB) : textB.localeCompare(textA);
    });
  }

  displayData(sortedData); // Re-render the table with sorted data
};

var currentPage = 1; // Track current page
var itemsPerPage = 8; // Max 8 reports per page

// Modify the displayData function to only show the current page
var displayData = (data) => {
  var resultDiv = document.getElementById('results');
  resultDiv.innerHTML = ''; // Clear previous results

  if (data.length > 0) {
    var table = document.createElement('table');

    // Table header
    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
    // Add the "Serial No" column header first
    var serialHeader = document.createElement('th');
    serialHeader.textContent = currentLanguage === 'en' ? '' : ''; // gocha 2024 Nov 21, to match to the customer request.
    //gocha serialHeader.textContent = currentLanguage === 'en' ? "Serial No" : "シリアル番号";
    headerRow.appendChild(serialHeader);
    headers[currentLanguage].forEach((header, index) => {
      var th = document.createElement('th');
      var field = fields[currentLanguage][index];

      var thContainer = document.createElement('div');
      thContainer.className = 'th-container';

      // Assign a unique ID to each th-container
      thContainer.id = `column-header-${index + 1}`; // e.g., column-header-1, column-header-2, etc.

      if (field === 'date') {
        // Only allow sorting for the "date" column
        if (field === sortBy) {
          thContainer.classList.add('sorted');
          let sortOrderText =
            sortOrder === 'newest' ? textContent[currentLanguage].newest : textContent[currentLanguage].oldest;

          thContainer.textContent = header;
        } else {
          thContainer.textContent = header;
        }

        // Add sorting functionality to the "date" column container
        thContainer.onclick = () => {
          let newSortOrder = sortOrder === 'newest' ? 'oldest' : 'newest';
          sortData(field, newSortOrder);
        };
      } else {
        thContainer.textContent = header; // Non-sortable columns
      }

      th.appendChild(thContainer);
      headerRow.appendChild(th);
    });

    // Add column header for "Actions"
    var th = document.createElement('th');
    th.textContent = currentLanguage === 'en' ? textContent[currentLanguage].actions : ''; // Updated for customer's request
    headerRow.appendChild(th);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Table body
    var tbody = document.createElement('tbody');

    // Determine the data to display for the current page
    var start = (currentPage - 1) * itemsPerPage;
    var paginatedData = data.slice(start, start + itemsPerPage);

    paginatedData.forEach((item, index) => {
      var row = document.createElement('tr');

      // Add Serial No cell
      var serialCell = document.createElement('td');
      serialCell.textContent = start + index + 1; // Start serial number from 1
      serialCell.classList.add('center-align'); // Apply center alignment
      row.appendChild(serialCell);

      // Make the entire row clickable
      row.style.cursor = 'pointer';
      row.onclick = () => viewDetails(item.ID.S);

      // Add other data cells dynamically
      fields[currentLanguage].forEach((field) => {
        var cell = document.createElement('td');
        if (field === 'date' && item[field] && item[field].S) {
          // Convert date from YYYY-MM-DD to YY/MM/DD
          const originalDate = item[field].S;
          const formattedDate = originalDate.slice(2).replace(/-/g, '/'); // Slice to remove the first two characters and replace dashes with slashes
          cell.textContent = formattedDate;
        } else if (field === 'report_contents' && item[field] && item[field].S) {
          let content = item[field].S;
          if (content.length > 100) {
            const previewText = content.substring(0, 100);
            const readMoreSpan = document.createElement('span');
            readMoreSpan.textContent = previewText + '... ';

            cell.appendChild(readMoreSpan);
          } else {
            cell.textContent = content;
          }
        } else {
          cell.textContent = item[field] && item[field].S ? item[field].S : textContent[currentLanguage].nullValue;
        }
        row.appendChild(cell);
      });

      var actionCell = document.createElement('td');
      actionCell.classList.add('actions');

      // Create the edit button
      var editButton = document.createElement('button');
      editButton.classList.add('edit-button');

      // Style the button for a round shape
      editButton.style.width = '40px';
      editButton.style.height = '40px';
      editButton.style.borderRadius = '50%';
      editButton.style.backgroundColor = '#007BFF';
      editButton.style.display = 'flex';
      editButton.style.alignItems = 'center';
      editButton.style.justifyContent = 'center';
      editButton.style.border = 'none';
      editButton.style.cursor = 'pointer';

      // Create and style the icon
      var editIcon = document.createElement('i');
      editIcon.className = 'fas fa-edit'; // Font Awesome icon for "edit"
      editIcon.style.color = '#FFFFFF'; // Set icon color to white
      editButton.appendChild(editIcon);

      // Add click event
      editButton.onclick = (event) => {
        event.stopPropagation(); // Prevent the row's click event
        editReport(item.ID.S); // Call the edit function
      };

      // Append to the action cell
      actionCell.appendChild(editButton);
      row.appendChild(actionCell);
      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    resultDiv.appendChild(table);

    // Call pagination
    displayPagination(data.length);
  } else {
    resultDiv.innerHTML = textContent[currentLanguage].noItemsFound;
  }
};
// Function to display pagination controls
function displayPagination(totalItems) {
  var resultsDiv = document.getElementById('results');

  // Remove existing pagination if any
  var existingPagination = document.querySelector('.pagination-container');
  if (existingPagination) {
    existingPagination.remove();
  }

  var paginationContainer = document.createElement('div');
  paginationContainer.className = 'pagination-container';

  // Left section: Items range label
  var itemsRangeLabel = document.createElement('span');
  var startItem = (currentPage - 1) * itemsPerPage + 1;
  var endItem = Math.min(currentPage * itemsPerPage, totalItems);
  itemsRangeLabel.className = 'items-range-label';
  itemsRangeLabel.textContent = `${totalItems}件中${startItem}～${endItem}件を表示`;
  paginationContainer.appendChild(itemsRangeLabel);

  // Right section: Pagination buttons
  var buttonsContainer = document.createElement('div');

  // Previous button
  var prevButton = document.createElement('button');
  prevButton.innerHTML = '&laquo;';
  prevButton.disabled = currentPage === 1;
  prevButton.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      displayData(sortedData); // Refresh table with current page data
    }
  };
  buttonsContainer.appendChild(prevButton);

  // Page number buttons
  var totalPages = Math.ceil(totalItems / itemsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    var pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.className = i === currentPage ? 'active' : '';
    pageButton.onclick = () => {
      currentPage = i;
      displayData(sortedData);
    };
    buttonsContainer.appendChild(pageButton);
  }

  // Next button
  var nextButton = document.createElement('button');
  nextButton.innerHTML = '&raquo;';
  nextButton.disabled = currentPage === totalPages;
  nextButton.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      displayData(sortedData); // Refresh table with current page data
    }
  };
  buttonsContainer.appendChild(nextButton);

  // Append the buttons container to the main container
  paginationContainer.appendChild(buttonsContainer);

  // Append the pagination container below the table
  resultsDiv.appendChild(paginationContainer);
}

// Edit report function
function editReport(id) {
  window.location.href = `update.html?id=${id}`; // Redirect to update page with the report ID
}

// Delete report function
async function deleteReport(id) {
  if (!id) {
    alert(currentLanguage === 'en' ? 'ID is missing.' : 'IDが見つかりません。');
    return;
  }

  // Ask for confirmation
  const confirmed = confirm(
    currentLanguage === 'en' ? 'Are you sure you want to delete the report?' : '本当にレポートを削除しますか？',
  );

  if (!confirmed) {
    return; // If user cancels, do nothing
  }

  const url = `https://nb8i9zluk4.execute-api.us-east-2.amazonaws.com/Dev/search/${id}/delete`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      alert(currentLanguage === 'en' ? 'Report deleted successfully!' : 'レポートが正常に削除されました！');
      window.location.reload(); // Reload the page after deletion
    } else {
      const errorResponse = await response.json();
      alert(
        currentLanguage === 'en'
          ? `Failed to delete report: ${errorResponse.message}`
          : `レポートの削除に失敗しました：${errorResponse.message}`,
      );
    }
  } catch (error) {
    console.error('Error:', error);
    alert(
      currentLanguage === 'en'
        ? 'An error occurred while deleting the report.'
        : 'レポートの削除中にエラーが発生しました。',
    );
  }
}

var searchReports = () => {
  // console.log('searching');
  var searchParam = document.getElementById('search_parameter').value;
  var searchValue = document.getElementById('search_value').value.trim().toLowerCase();

  var filteredData = fetchedData.filter((report) => report[searchParam]?.S?.toLowerCase().includes(searchValue));

  if (filteredData.length > 0) {
    displayData(filteredData);
  } else {
    document.getElementById('results').innerHTML = currentLanguage === 'en' ? 'No items found' : '項目が見つかりません';
  }
};

var clearSearch = () => {
  document.getElementById('search_value').value = '';
  displayData(fetchedData);
};

var viewDetails = (id) => {
  // Find the report with the given ID from fetchedData
  var report = fetchedData.find((item) => item.ID.S === id);

  if (report) {
    // Construct the URL with query parameters
    var queryParams = new URLSearchParams({
      id: report.ID.S,
    }).toString();

    // Redirect to the report_details.html page with query parameters
    window.location.href = `details.html?${queryParams}`;
  } else {
    console.error('Report not found:', id);
  }
};

var viewPreviousVersion = (prevID) => {
  // Redirect to the details.html page with the prevID as the query parameter
  window.location.href = `details.html?id=${prevID}`;
};

function switchLanguage(language) {
  currentLanguage = language;
  localStorage.setItem('CurrLang', currentLanguage); // Store the current language in localStorage
  updateContent(currentLanguage); // Update page content based on selected language

  // Update the active state on the language buttons
  highlightLanguageButton();
}

// Function to highlight the correct language button
function highlightLanguageButton() {
  const langJP = document.getElementById('lang-jp');
  const langEN = document.getElementById('lang-en');

  // Remove active class from both buttons
  langJP.classList.remove('active');
  langEN.classList.remove('active');

  // Add active class to the currently selected language
  if (currentLanguage === 'ja') {
    langJP.classList.add('active');
  } else {
    langEN.classList.add('active');
  }
}

// Execute on page load to persist selected language and highlight button
document.addEventListener('DOMContentLoaded', function () {
  currentLanguage = localStorage.getItem('CurrLang') || 'en';
  highlightLanguageButton(); // Highlight the correct button
  updateContent(currentLanguage); // Update the page content to reflect the selected language
});

const textContent = {
  en: {
    companyName: 'Sanyo Steel Co ltd',
    reviewButton: 'Sales report system',
    newreportbtn: 'New Report',
    formHeader: 'Sales Report List',
    logoutButton: 'Logout',
    searchParameter: 'Search Parameter:',
    searchValue: 'Search Value:',
    search: 'Search',
    searchPlaceholder: 'Search Value',
    clear: 'Clear',
    salesReport: 'Sales Report System',
    languageSelector: 'Language:',
    switchButton: 'Switch to Japanese',
    header: 'Report Review System',
    //gocha_2024nov21 actions: "Actions",
    actions: '', //gocha_2024nov21
    viewDetails: 'View Details',
    previousVersion: 'Previous Version',
    noItemsFound: 'No items found',
    languageSwitchButton: '日本語に切り替える',
    nullValue: 'null',
    asc: 'A to Z',
    desc: 'Z to A',
    newest: 'Newest First',
    oldest: 'Oldest First',
  },
  ja: {
    companyName: '三洋鋼材株式会社',
    reviewButton: '営業報告システム',

    newreportbtn: '新規作成',
    logoutButton: 'ログアウト',
    formHeader: '営業報告一覧',
    searchParameter: '検索対象:',
    searchValue: '検索値:',
    search: '検索',
    searchPlaceholder: '検索',
    clear: 'クリア',
    salesReport: '営業報告システム',
    languageSelector: '言語',
    switchButton: 'Switch to English',
    header: '営業報告閲覧システム',
    actions: '行動',
    viewDetails: '詳細を見る',
    previousVersion: '前のバージョン',
    noItemsFound: '項目が見つかりません',
    languageSwitchButton: 'Switch to English',
    nullValue: 'なし',
    asc: '昇順',
    desc: '降順',
    newest: '新しい順',
    oldest: '古い順',
  },
};

var updateContent = (language) => {
  currentLanguage = language;

  function monitorDropdown() {
    const selectElement = document.getElementById('search_parameter');

    // Function to update dropdown options
    const updateOptions = () => {
      const selectedValue = selectElement.value;
      const options = selectElement.options;

      for (let i = 0; i < options.length; i++) {
        const option = options[i];

        const baseText =
          currentLanguage === 'en'
            ? option.value === 'company'
              ? 'Company'
              : option.value === 'counter_part_at_customer_side'
              ? 'Counterpart'
              : option.value === 'date'
              ? 'Date'
              : option.value === 'meeting_title'
              ? 'Title'
              : option.value === 'report_contents'
              ? 'Contents'
              : option.value === 'sales_rep'
              ? 'Sales Rep'
              : option.textContent
            : option.value === 'company'
            ? '会社名'
            : option.value === 'counter_part_at_customer_side'
            ? '顧客名'
            : option.value === 'date'
            ? '日付'
            : option.value === 'meeting_title'
            ? 'タイトル'
            : option.value === 'report_contents'
            ? '内容'
            : option.value === 'sales_rep'
            ? '営業担当'
            : option.textContent;

        // If this option is selected, prepend "Search Parameter:"
        if (option.value === selectedValue) {
          option.innerHTML = currentLanguage === 'en' ? `Search Parameter: ${baseText}` : `検索対象: ${baseText}`;
        } else {
          option.textContent = baseText;
        }
      }
    };

    // Initial update when the page loads
    updateOptions();
    selectElement.addEventListener('change', updateOptions);
  }

  monitorDropdown();
  // Actuate the function when the website reloads
  window.addEventListener('load', monitorDropdown);

  // Update text content of various elements
  const elements = [
    { id: 'company-name', key: 'companyName' },
    { id: 'report-review', key: 'reviewButton' },
    { id: 'search_label_parameter', key: 'searchParameter' },
    { id: 'search_value', key: 'searchValue' },
    { id: 'clearvalue', key: 'clear' },
    { id: 'salesreportrevert', key: 'salesReport' },
    { id: 'salesreportrevert2', key: 'salesReport' },
    { id: 'logout-button', key: 'logoutButton' },
    { id: 'logout-button2', key: 'logoutButton' },
    { id: 'languageselector', key: 'languageSelector' },
    { id: 'header', key: 'header' },
    { id: 'language-switch-button', key: 'languageSwitchButton' },
    { id: 'new-report-text', key: 'newreportbtn' },
    { id: 'logout-text', key: 'logoutButton' },
    { id: 'form-header-text', key: 'formHeader' }, // Added new entry for form header
  ];

  elements.forEach((element) => {
    const domElement = document.getElementById(element.id);
    if (domElement) {
      domElement.textContent = textContent[language][element.key];
    }
  });

  // Update placeholder for input fields
  const placeholders = [{ id: 'search_value', key: 'searchPlaceholder' }];

  placeholders.forEach((placeholder) => {
    const domElement = document.getElementById(placeholder.id);
    if (domElement) {
      domElement.setAttribute('placeholder', textContent[language][placeholder.key]);
    }
  });
  // Display the data in the selected language
  displayData(fetchedData);
};

document.addEventListener('DOMContentLoaded', function () {
  updateContent(currentLanguage);
});

module.exports = {
  sortData,
};
