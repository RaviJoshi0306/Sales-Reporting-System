var CurrLang = localStorage.getItem('CurrLang'); // Default language is English
console.log(CurrLang);

// Function to fetch report details
var fetchReportDetails = (language) => {
  var languageCode = language === 'ja' ? 'ja' : 'en';
  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id'); // Retrieve the id parameter

  fetch(`https://nb8i9zluk4.execute-api.us-east-2.amazonaws.com/Dev/search/${id}?lang=${languageCode}`, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      if (result && result.statusCode === 200) {
        const report = JSON.parse(result.body); // Parse the body to get the report object
        console.log(report);
        displayReportDetails(report, language);
      } else {
        console.error('Error fetching report details:', result);
      }
    })
    .catch((error) => console.error('Error:', error));
};

function switchLanguage(selectedLang) {
  // Set the new language to the selected one ('ja' or 'en')
  CurrLang = selectedLang;

  // Save the selected language in local storage
  localStorage.setItem('CurrLang', CurrLang);

  // Update the content language on the page
  updateContentLanguage(CurrLang);

  // Fetch the report details again using the new language
  fetchReportDetails(CurrLang);

  // Highlight the selected language in the switch
  highlightSelectedLanguage();
}

// Function to highlight the currently selected language in the switch
function highlightSelectedLanguage() {
  const langJP = document.getElementById('lang-jp');
  const langEN = document.getElementById('lang-en');

  // Remove active class from both buttons
  langJP.classList.remove('active');
  langEN.classList.remove('active');

  // Add active class to the currently selected language
  if (CurrLang === 'ja') {
    langJP.classList.add('active');
  } else {
    langEN.classList.add('active');
  }
}

function updateContentLanguage(language) {
  const pageTitle = document.getElementById('pageTitle');
  const editButton = document.getElementById('editButton');
  const deleteButton = document.getElementById('deleteButton');
  const backButton = document.getElementById('backButton');
  //const previousButton = document.getElementById('previousButton');
  const newReportText = document.getElementById('new-report-text');
  const logoutText = document.getElementById('logout-text');
  const companyName = document.getElementById('company-name');
  const SalesreportSystem = document.getElementById('report-review');

  // Only update elements if they exist in the DOM
  if (companyName) {
    companyName.textContent = language === 'en' ? 'Sanyo Steel Co ltd' : '三洋鋼材株式会社';
  }

  if (SalesreportSystem) {
    SalesreportSystem.textContent = language === 'en' ? 'Sales report system' : '営業報告システム';
  }

  if (pageTitle) {
    pageTitle.innerHTML = `<i class="fas fa-edit"></i> ${language === 'en' ? 'Sales report details' : '営業報告詳細'}`;
  }

  if (editButton) {
    editButton.textContent = language === 'en' ? 'Edit' : '編集';
  }

  if (deleteButton) {
    deleteButton.textContent = language === 'en' ? 'Delete' : '削除';
  }

  if (newReportText) {
    newReportText.textContent = language === 'en' ? 'New Report' : '新規作成';
  }

  if (logoutText) {
    logoutText.textContent = language === 'en' ? 'Logout' : 'ログアウト';
  }

  if (backButton) {
    backButton.textContent = language === 'en' ? 'Back' : '戻る';
  }

  // if (previousButton) {
  //     previousButton.textContent = language === 'en' ? 'Previous Version' : '以前のバージョン';
  // }
}

// Call this function once the page loads to ensure the correct language is highlighted
document.addEventListener('DOMContentLoaded', function () {
  // Get the current language from local storage or default to English
  CurrLang = localStorage.getItem('CurrLang') || 'en';

  // Highlight the correct language when the page loads
  highlightSelectedLanguage();

  // Fetch the report details in the current language
  fetchReportDetails(CurrLang);
  updateContentLanguage(CurrLang);
});

var displayReportDetails = (report, language) => {
  const reportDetailsDiv = document.getElementById('reportDetails');

  // Render the report details with proper field order and disabled input fields
  reportDetailsDiv.innerHTML = `
        <div class="details">
            <!-- First row: Date and Customer Name -->
            <div class="detail-item">
                <label><span class="circle"></span>${language === 'en' ? 'Date:' : '日付:'}</label>
                <input type="text" value="${report.date}" disabled>
            </div>
            <div class="detail-item">
                <label><span class="circle"></span>${language === 'en' ? 'Customer Name:' : '顧客名:'}</label>
                <input type="text" value="${report.company}" disabled>
            </div>

            <!-- Second row: Title -->
            <div class="detail-item full-width">
                <label><span class="circle"></span>${language === 'en' ? 'Title:' : 'タイトル:'}</label>
                <input type="text" value="${report.meeting_title}" disabled>
            </div>

            <!-- Third row: Sales Rep and Counterpart Name -->
            <div class="detail-item">
                <label><span class="circle"></span>${language === 'en' ? 'Sales Rep:' : '営業担当者:'}</label>
                <input type="text" value="${report.sales_rep}" disabled>
            </div>
            <div class="detail-item">
                <label><span class="circle"></span>${language === 'en' ? 'Counterpart Name:' : '顧客先担当者:'}</label>
                <input type="text" value="${report.counter_part_at_customer_side || ''}" disabled>
            </div>

            <!-- Fourth row: Contents -->
            <div class="detail-item full-width">
                <label><span class="circle"></span>${language === 'en' ? 'Contents:' : '内容:'}</label>
                <textarea rows="5" disabled>${report.report_contents}</textarea>
            </div>
        </div>
    `;
};

var viewPreviousReport = (previousReportID) => {
  const previousButton = document.getElementById('previousButton');

  if (previousReportID) {
    // If the previous report ID exists, redirect to that report
    window.location.href = `details.html?id=${previousReportID}`;
  } else {
    // If no previous report exists, show a message instead of redirecting
    const reportDetailsDiv = document.getElementById('reportDetails');
    const noPreviousText = document.createElement('p');

    // Remove any existing "no previous report" messages first (if there is one already)
    const existingMessage = document.getElementById('noPrevMessage');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Set the "No previous report exists" message
    noPreviousText.textContent = CurrLang === 'en' ? '' : '';
    noPreviousText.style.color = '#dc3545'; // Optional styling
    noPreviousText.id = 'noPrevMessage'; // Set an ID to manage this element later

    // Append the message to the report details div
    reportDetailsDiv.appendChild(noPreviousText);

    // Disable the previous button
    previousButton.disabled = true;
  }
};

// Edit report function
function editReport() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id'); // Retrieve the id parameter
  window.location.href = `update.html?id=${id}`;
}

// Delete report function
async function deleteReport() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id'); // Retrieve the id parameter

  if (!id) {
    alert(CurrLang === 'en' ? 'ID is missing.' : 'IDが見つかりません。');
    return;
  }

  // Ask for confirmation
  const confirmed = confirm(
    CurrLang === 'en' ? 'Are you sure you want to delete the report?' : '本当にレポートを削除しますか？',
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
      alert(CurrLang === 'en' ? 'Report deleted successfully!' : 'レポートが正常に削除されました！');
      // Clear the report details and update the message
      const reportDetailsDiv = document.getElementById('reportDetails');
      reportDetailsDiv.innerHTML = `<p>${
        CurrLang === 'en' ? 'Report deleted successfully.' : 'レポートが正常に削除されました。'
      }</p>`;

      // Hide the button container
      document.getElementById('buttonContainer').style.display = 'none';
      // Redirect back to report review page
      setTimeout(() => {
        window.location.href = 'report_review.html';
      }, 2000);
    } else {
      const errorResponse = await response.json();
      alert(
        CurrLang === 'en'
          ? `Failed to delete report: ${errorResponse.message}`
          : `レポートの削除に失敗しました：${errorResponse.message}`,
      );
    }
  } catch (error) {
    console.error('Error:', error);
    alert(
      CurrLang === 'en' ? 'An error occurred while deleting the report.' : 'レポートの削除中にエラーが発生しました。',
    );
  }
}
