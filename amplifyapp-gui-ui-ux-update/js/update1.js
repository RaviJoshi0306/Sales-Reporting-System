function fetchReportDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const idFromUrl = urlParams.get('id');

  // Get the id from local storage
  const storedId = localStorage.getItem('reportId');

  if (idFromUrl && idFromUrl !== storedId) {
    // Update local storage if the URL has a different id
    localStorage.setItem('reportId', idFromUrl);
  }

  const id = idFromUrl || storedId; // Use id from URL if present, otherwise fallback to local storage

  if (id) {
    fetch(`https://nb8i9zluk4.execute-api.us-east-2.amazonaws.com/Dev/search/${id}`, {
      method: 'GET',
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then((result) => {
        if (result && result.statusCode === 200) {
          const report = JSON.parse(result.body);
          // Populate form fields with report data
          document.getElementById('date').value = report.date;
          document.getElementById('meeting_title').value = report.meeting_title;
          document.getElementById('company').value = report.company;
          document.getElementById('sales_rep').value = report.sales_rep;
          document.getElementById('counter_part_at_customer_side').value = report.counter_part_at_customer_side;
          document.getElementById('report_contents').value = report.report_contents;
        } else {
          console.error('Error fetching report details:', result);
        }
      })
      .catch((error) => console.error('Error:', error));
  }
}

var callAPI = (prevID, date, meeting_title, company, sales_rep, counter_part_at_customer_side, report_contents) => {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  var raw = JSON.stringify({
    prevID: prevID,
    date: date,
    meeting_title: meeting_title,
    company: company,
    sales_rep: sales_rep,
    counter_part_at_customer_side: counter_part_at_customer_side,
    report_contents: report_contents,
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  return fetch('https://nb8i9zluk4.execute-api.us-east-2.amazonaws.com/Dev/updateReport', requestOptions)
    .then((response) => response.text())

    .catch((error) => console.log('error', error));
};

function showConfirmation() {
  document.querySelectorAll('input, textarea').forEach((elem) => (elem.disabled = true)); // Disable inputs
  document.getElementById('replaceButton').style.display = 'none'; // Hide replace button
  document.getElementById('confirmDiv').style.display = 'flex'; // Show confirmation div
}

// Function to go back to edit mode
function goBack() {
  document.querySelectorAll('input, textarea').forEach((elem) => (elem.disabled = false)); // Enable inputs
  document.getElementById('replaceButton').style.display = 'block'; // Show replace button
  document.getElementById('confirmDiv').style.display = 'none'; // Hide confirmation div
}

function confirmReplacement() {
  const urlParams = new URLSearchParams(window.location.search);
  const prevID = urlParams.get('id'); // Get the ID from the URL

  // Call the API with the updated form data
  callAPI(
    prevID,
    document.getElementById('date').value,
    document.getElementById('meeting_title').value,
    document.getElementById('company').value,
    document.getElementById('sales_rep').value,
    document.getElementById('counter_part_at_customer_side').value,
    document.getElementById('report_contents').value,
  );

  resetForm(); // Optionally reset form after updating
  alert('Report updated');
  window.location.href = 'report_review.html';
}
function resetForm() {
  document.querySelectorAll('input, textarea').forEach((elem) => {
    elem.value = '';  // Clear input fields
    elem.disabled = false;  // Enable input fields
  });

  // Show the 'replaceButton' and hide the confirmation div
  const replaceButton = document.getElementById('replaceButton');
  const confirmDiv = document.getElementById('confirmDiv');

  if (replaceButton) replaceButton.style.display = 'block';  // Show replace button
  if (confirmDiv) confirmDiv.style.display = 'none';  // Hide confirmation div
}

// Fetch the report details on page load
document.addEventListener('DOMContentLoaded', fetchReportDetails);

function navigateToReportReview() {
  var salesRep = document.getElementById('sales_rep').value;
  window.location.href = `report_review.html?sales_rep=${salesRep}`;
}

function setDateToJST() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const jstOffset = 9 * 60; // JST is UTC+9
  const jstDate = new Date(now.getTime() + (jstOffset - offset) * 60 * 1000);
  const formattedDate = jstDate.toISOString().split('T')[0];
  document.getElementById('date').value = formattedDate;
}

function setDefaultTitle() {
  const date = document.getElementById('date').value;
  const company = document.getElementById('company').value;

  if (date && company) {
    const [year, month, day] = date.split('-');
    const defaultTitle = `${year}/${month}/${day}面談：${company}`;
    document.getElementById('meeting_title').value = defaultTitle;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  setDateToJST();
  document.getElementById('date').addEventListener('input', setDefaultTitle);
  document.getElementById('company').addEventListener('input', setDefaultTitle);
});

const textContent = {
  en: {
    companyName: 'Sanyo Steel Co ltd',
    title: 'Sales Reporting System',
    newreportbtn: 'New Report',
    reviewbutton: 'Sales report system',
    replaceBtn: 'Replace',
    formtitle: 'Edit Sales Report',
    welcomeMessage: 'Welcome, ',
    dateLabel: 'DATE',
    titleLabel: 'TITLE',
    customerLabel: 'CUSTOMER',
    salesRepLabel: 'SALES PERSON',
    counterPartLabel: 'COUNTER PART AT CUSTOMER SIDE',
    contentsLabel: 'CONTENTS',
    submitButton: 'Submit',
    backButton: 'BACK TO EDIT',
    confirmButton: 'CONFIRM',
    reviewButton: 'Back',
    logoutButton: 'Logout',
    deleteButton: 'Delete',
    backbutton: 'Back',
    formHeader: 'Edit Sales Report',
    reportUpdated: 'Report updated',
    replacementModal: {
      title: 'Edit Sales Report',
      dateLabel: 'Date',
      meetingTitleLabel: 'Meeting Title',
      companyLabel: 'Company',
      salesRepLabel: 'Sales Representative',
      counterpartLabel: 'Counterpart',
      reportContentsLabel: 'Report Contents',
      closeButton: 'Back to Edit',
      confirmButton: 'Confirm',
    },
    deleteModal: {
      title: 'Delete Report',
      message: 'Are you sure you want to delete this report?',
      cancelButton: 'Cancel',
      confirmButton: 'Delete',
    }
  },
  ja: {
    companyName: '三洋鋼材株式会社',
    title: '営業報告システム',
    newreportbtn: '新規作成',
    reviewbutton: '営業報告システム',
    replaceBtn: '上書きする',
    formtitle: '販売レポートの編集',
    welcomeMessage: 'ようこそ',
    dateLabel: '日付',
    titleLabel: 'タイトル',
    customerLabel: '顧客名',
    salesRepLabel: '営業担当者',
    counterPartLabel: '顧客先担当者',
    contentsLabel: '内容',
    submitButton: '送信',
    backButton: '編集に戻る',
    confirmButton: '確認',
    reviewButton: '戻る',
    logoutButton: 'ログアウト',
    deleteButton: '削除',
    backbutton: '戻る',
    formHeader: '営業報告編集',
     reportUpdated: '上書きが完了しました。',
     replacementModal: {
      title: '営業報告編集',
      dateLabel: '日付',
      meetingTitleLabel: '会議のタイトル',
      companyLabel: '顧客名',
      salesRepLabel: '営業担当者',
      counterpartLabel: '顧客先担当者',
      reportContentsLabel: '報告内容',
      closeButton: '戻る',
      confirmButton: '送信',
    },
    deleteModal: {
      title: 'レポートの削除',
      message: 'このレポートを削除してもよろしいですか？',
      cancelButton: 'キャンセル',
      confirmButton: '削除する',
    }
  },
};

// Set Japanese as the default language
let currentLanguage = localStorage.getItem('CurrLang') || 'ja';

// Function to highlight the active language button
function highlightActiveLanguage() {
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

// Switch to Japanese
function switchToJapanese() {
  currentLanguage = 'ja';
  localStorage.setItem('CurrLang', currentLanguage);
  updateContent(currentLanguage);
  highlightActiveLanguage();
}

// Switch to English
function switchToEnglish() {
  currentLanguage = 'en';
  localStorage.setItem('CurrLang', currentLanguage);
  updateContent(currentLanguage);
  highlightActiveLanguage();
}
function updateContent(language) {
  const companyName = document.getElementById('company-name');
  const SalesreportElement = document.getElementById('report-review');
  const titleElement = document.getElementById('title');
  const formTitlElement = document.getElementById('formtitle');
  const replaceBtn = document.getElementById('replaceButton');
  const newReportbtn = document.getElementById('new-report-text');
  const welcomeMessageElement = document.getElementById('welcomeMessage');
  const dateLabelElement = document.querySelector('label[for="date"]');
  const titleLabelElement = document.querySelector('label[for="meeting_title"]');
  const customerLabelElement = document.querySelector('label[for="company"]');
  const salesRepLabelElement = document.querySelector('label[for="sales_rep"]');
  const counterPartLabelElement = document.querySelector('label[for="counter_part_at_customer_side"]');
  const contentsLabelElement = document.querySelector('label[for="report_contents"]');
  const submitButtonElement = document.getElementById('submitButton');
  const backButtonElement = document.querySelector('#confirmDiv button:nth-of-type(1)');
  const confirmButtonElement = document.querySelector('#confirmDiv button:nth-of-type(2)');
  const reviewButtonElement = document.querySelector('.reviewButton');
  const logoutElement = document.getElementById('logout-text');
  const deleteButtonElement = document.querySelector('.deleteButton');
  const backbutton = document.getElementById('backButton');
  const formHeaderElement = document.querySelector('.form-header h1');


  const modalTitle = document.querySelector('.form-header h1');
  const modalDateLabel = document.querySelector('label[for="modalDate"]');
  const modalMeetingTitleLabel = document.querySelector('label[for="modalMeetingTitle"]');
  const modalCompanyLabel = document.querySelector('label[for="modalCompany"]');
  const modalSalesRepLabel = document.querySelector('label[for="modalSalesRep"]');
  const modalCounterpartLabel = document.querySelector('label[for="modalCounterPart"]');
  const modalReportContentsLabel = document.querySelector('label[for="modalReportContents"]');
  const closeModalButton = document.getElementById('closeModalButton');
  const confirmReplacementButton = document.getElementById('confirmReplacementButton');
  const modalFormHeaderElement = document.querySelector('#replacementModal .form-header h1');

  // Update modal form header content
  if (modalFormHeaderElement) {
    const iconElement = modalFormHeaderElement.querySelector('i');
    // Ensure the icon stays the same while the text gets updated
    modalFormHeaderElement.innerHTML = `<i class="fas fa-edit"></i> ${textContent[language].replacementModal.title}`;
  }


  // Set the modal content based on the selected language
  if (modalTitle) modalTitle.textContent = textContent[language].replacementModal.title;
  if (modalDateLabel) modalDateLabel.textContent = textContent[language].replacementModal.dateLabel;
  if (modalMeetingTitleLabel) modalMeetingTitleLabel.textContent = textContent[language].replacementModal.meetingTitleLabel;
  if (modalCompanyLabel) modalCompanyLabel.textContent = textContent[language].replacementModal.companyLabel;
  if (modalSalesRepLabel) modalSalesRepLabel.textContent = textContent[language].replacementModal.salesRepLabel;
  if (modalCounterpartLabel) modalCounterpartLabel.textContent = textContent[language].replacementModal.counterpartLabel;
  if (modalReportContentsLabel) modalReportContentsLabel.textContent = textContent[language].replacementModal.reportContentsLabel;
  if (closeModalButton) closeModalButton.textContent = textContent[language].replacementModal.closeButton;
  if (confirmReplacementButton) confirmReplacementButton.textContent = textContent[language].replacementModal.confirmButton;

  if (titleElement) document.title = textContent[language].title;
  if (companyName) companyName.textContent = textContent[language].companyName;
  if (SalesreportElement) SalesreportElement.textContent = textContent[language].reviewbutton;
  if (newReportbtn) newReportbtn.textContent = textContent[language].newreportbtn;
  if (replaceBtn) replaceBtn.textContent = textContent[language].replaceBtn;
  if (backbutton) backbutton.textContent = textContent[language].backbutton;

  if (formTitlElement) formTitlElement.textContent = textContent[language].formtitle;
  if (welcomeMessageElement)
    welcomeMessageElement.textContent = textContent[language].welcomeMessage + loggedInUserName;
  if (dateLabelElement) dateLabelElement.textContent = textContent[language].dateLabel;
  if (titleLabelElement) titleLabelElement.textContent = textContent[language].titleLabel;
  if (customerLabelElement) customerLabelElement.textContent = textContent[language].customerLabel;
  if (salesRepLabelElement) salesRepLabelElement.textContent = textContent[language].salesRepLabel;
  if (counterPartLabelElement) counterPartLabelElement.textContent = textContent[language].counterPartLabel;
  if (contentsLabelElement) contentsLabelElement.textContent = textContent[language].contentsLabel;
  if (submitButtonElement) submitButtonElement.textContent = textContent[language].submitButton;
  if (backButtonElement) backButtonElement.textContent = textContent[language].backButton;
  if (confirmButtonElement) confirmButtonElement.textContent = textContent[language].confirmButton;
  if (reviewButtonElement) reviewButtonElement.textContent = textContent[language].reviewButton;
  if (logoutElement) logoutElement.textContent = textContent[language].logoutButton;
  if (deleteButtonElement) deleteButtonElement.textContent = textContent[language].deleteButton;
  if (formHeaderElement) {
    const iconElement = formHeaderElement.querySelector('i');
    // Keep the icon and update the header text separately
    formHeaderElement.innerHTML = `<i class="fas fa-edit"></i> ${textContent[language].formHeader}`;
  }



  const deleteModalTitle = document.querySelector('.delete-modal-title');
  const deleteModalText = document.querySelector('.delete-modal-text');
  const deleteCancelBtn = document.querySelector('.delete-cancel-btn');
  const deleteConfirmBtn = document.querySelector('.delete-confirm-btn');

  if (deleteModalTitle) deleteModalTitle.textContent = textContent[language].deleteModal.title;
  if (deleteModalText) deleteModalText.textContent = textContent[language].deleteModal.message;
  if (deleteCancelBtn) deleteCancelBtn.textContent = textContent[language].deleteModal.cancelButton;
  if (deleteConfirmBtn) deleteConfirmBtn.textContent = textContent[language].deleteModal.confirmButton;
}
let reportToDeleteId = null; // Store the report ID

document.addEventListener('DOMContentLoaded', () => {
  const deleteButton = document.querySelector('.deleteButton');
  
  if (deleteButton) {
    deleteButton.addEventListener('click', openDeleteModal);
  } else {
    console.error('Delete button not found!');
  }
});

// Show the delete modal
function openDeleteModal(event) {
  event.preventDefault();
  const id = localStorage.getItem('reportId');
  
  if (!id) {
    alert(currentLanguage === 'en' ? 'ID is missing.' : 'IDが見つかりません。');
    return;
  }

  reportToDeleteId = id; // Temporarily store the report ID
  document.getElementById('deleteModal').style.display = 'block';
}

// Close the delete modal
function closeDeleteModal() {
  document.getElementById('deleteModal').style.display = 'none';
  reportToDeleteId = null; // Reset the stored ID
}

  


function showDeleteToast(message) {
  const deleteToastContainer = document.getElementById('delete-toast-container');
  const deleteToastMessage = document.getElementById('deleteToastMessage');
  const deleteToastCloseBtn = document.getElementById('delete-toast-close-btn');

  // Update the message
  deleteToastMessage.textContent = message;

  // Show the toast
  deleteToastContainer.style.display = 'block';

  // Auto-hide the toast after 3 seconds
  setTimeout(() => {
    deleteToastContainer.style.display = 'none';
  }, 3000);

  // Allow manual close
  deleteToastCloseBtn.addEventListener('click', () => {
    deleteToastContainer.style.display = 'none';
  });
}

// Confirm and delete the report
async function confirmDeleteReport(event) {
  if (event) event.preventDefault(); // Prevent page reload

  if (!reportToDeleteId) {
    closeDeleteModal();
    return;
  }

  const url = `https://nb8i9zluk4.execute-api.us-east-2.amazonaws.com/Dev/search/${reportToDeleteId}/delete`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // Show toast message for successful deletion
      showDeleteToast(
        currentLanguage === 'en'
          ? 'Report deleted successfully'
          : '削除が完了しました。'
      );
    
      // Redirect after short delay
      setTimeout(() => {
        window.location.href = 'report_review.html';
      }, 3500); // Slight delay for visibility
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
  } finally {
    closeDeleteModal();
  }
}

function goBack() {
  window.location.href = 'report_review.html'; // Redirect to report_review.html
}

// Function to show modal with the replaced form
function showReplacementModal() {
  const modal = document.getElementById('replacementModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const mainmodal=document.getElementById('mainForm');

  // Check if modal and overlay exist
  if (modal && modalOverlay) {
    // Fill the modal with current form data
    document.getElementById('modalDate').value = document.getElementById('date').value;
    document.getElementById('modalMeetingTitle').value = document.getElementById('meeting_title').value;
    document.getElementById('modalCompany').value = document.getElementById('company').value;
    document.getElementById('modalSalesRep').value = document.getElementById('sales_rep').value;
    document.getElementById('modalCounterPart').value = document.getElementById('counter_part_at_customer_side').value;
    document.getElementById('modalReportContents').value = document.getElementById('report_contents').value;

    // Disable fields in modal
    document.querySelectorAll('#replacementModal input, #replacementModal textarea').forEach((elem) => {
      elem.disabled = true;
    });

    // Display modal and overlay
    modal.style.display = 'block';
    modalOverlay.style.display = 'block';
    mainmodal.style.display='none';
  }
}
function closeReplacementModal() {
  const modal = document.getElementById('replacementModal');
  const modalOverlay = document.getElementById('modalOverlay');
  const mainmodal=document.getElementById('mainForm');
  // Ensure both modal and overlay elements exist
  if (modal && modalOverlay) {
    modal.style.display = 'none';  // Hide the modal
    modalOverlay.style.display = 'none';  // Hide the overlay
    mainmodal.style.display='block';
  }
}
// Function to show the toast message
function showToast(messageKey) {
  const toastContainer = document.getElementById('toast-container');
  const toastMessage = document.getElementById('toastMessage');
  const closeButton = document.getElementById('toast-close-btn');

  // Debugging step to ensure the elements exist
  console.log('Toast Container:', toastContainer);
  console.log('Toast Message:', toastMessage);
  console.log('Close Button:', closeButton);

  // Check if the elements are found
  if (toastContainer && toastMessage && closeButton) {
    // Get the translated message based on the current language
    const message = textContent[currentLanguage][messageKey];

    // Set the message
    toastMessage.textContent = message;

    // Show the toast
    toastContainer.classList.remove('hidden');
    toastContainer.style.display = 'block';

    // Automatically hide after 5 seconds
    setTimeout(() => {
      toastContainer.classList.add('hidden');
      toastContainer.style.display = 'none';
    }, 3000); // Hide after 5 seconds

    // Close button functionality
    closeButton.addEventListener('click', () => {
      toastContainer.classList.add('hidden');
      toastContainer.style.display = 'none';
    });
  } else {
    console.error('Toast elements are missing.');
  }
}
let isFirstConfirmClick = true; // Flag to track the first click

function confirmReplacement() {
  const modalFormHeaderElement = document.querySelector('#replacementModal .form-header h1'); // Target the modal header
  const confirmationMessageElement = document.getElementById('confirmationMessage'); // The message element below the icon

  if (isFirstConfirmClick) {
    // First click: Change the header to show the check icon and message below it
    modalFormHeaderElement.innerHTML = `<i class="fas fa-check"></i> 営業報告編集`; // Keep original header text
    confirmationMessageElement.style.display = 'block'; // Show the confirmation message

    // Disable the input fields for the review (optional)
    document.querySelectorAll('#replacementModal input, #replacementModal textarea').forEach((elem) => {
      elem.disabled = true;
    });

    isFirstConfirmClick = false; // Set flag to false after first click
  } else {
    // Second click: Perform form submission logic

    // Call the API to submit the form data
    const urlParams = new URLSearchParams(window.location.search);
    const prevID = urlParams.get('id'); // Get the ID from the URL

    callAPI(
      prevID,
      document.getElementById('date').value,
      document.getElementById('meeting_title').value,
      document.getElementById('company').value,
      document.getElementById('sales_rep').value,
      document.getElementById('counter_part_at_customer_side').value,
      document.getElementById('report_contents').value,
    );

     // Optionally reset form after updating
    showToast('reportUpdated'); // Show the toast notification with the translated message

    // Close the modal after the confirmation and action
    closeReplacementModal();

    // Delay the redirect to allow the toast to appear
    setTimeout(() => {
      window.location.href = 'report_review.html'; // Redirect to the review page after 5 seconds
    }, 3000); // Redirect after 5 seconds to give enough time for the toast to be visible
  }
}


// Attach event listeners for modal buttons
document.addEventListener('DOMContentLoaded', () => {
  // Show modal when 'replaceButton' is clicked
  document.getElementById('replaceButton').addEventListener('click', showReplacementModal);

  // Close modal when 'closeModalButton' is clicked
  document.getElementById('closeModalButton').addEventListener('click', closeReplacementModal);

  // Confirm and close modal when 'confirmReplacementButton' is clicked
  document.getElementById('confirmReplacementButton').addEventListener('click', () => {
    confirmReplacement(); // Confirm and update report logic
  });
});




document.addEventListener('DOMContentLoaded', function () {
  updateContent(currentLanguage);
  highlightActiveLanguage();
});
