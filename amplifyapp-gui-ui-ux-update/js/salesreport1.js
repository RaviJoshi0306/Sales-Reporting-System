// Your existing Firebase configuration and other scripts

var callAPI = function (date, meeting_title, company, sales_rep, counter_part_at_customer_side, report_contents) {
  var myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  var raw = JSON.stringify({
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
  return fetch('https://nb8i9zluk4.execute-api.us-east-2.amazonaws.com/dev', requestOptions)
    .then((response) => response.text())

    .catch((error) => console.log('error', error));
};

function showConfirmation() {
  // Disable input fields and show confirmation buttons
  document.querySelectorAll('input, textarea').forEach(function (elem) {
    elem.disabled = true;
  });
  document.getElementById('submitButton').style.display = 'none';
  document.getElementById('backButtonMain').style.display = 'none';
  document.getElementById('confirmDiv').style.display = 'flex';
}

function goBack() {
  // Enable input fields and show the submit button again
  document.querySelectorAll('input, textarea').forEach(function (elem) {
    elem.disabled = false;
  });
  document.getElementById('sales_rep').disabled = true; // Ensure sales rep field remains disabled
  document.getElementById('submitButton').style.display = 'block';
  document.getElementById('backButtonMain').style.display = 'block';
  document.getElementById('confirmDiv').style.display = 'none';
}

function confirmSubmission() {
  // Validate the form data
  if (
    document.getElementById('date').value &&
    document.getElementById('meeting_title').value &&
    document.getElementById('company').value &&
    document.getElementById('report_contents').value
  ) {
    // Call the API with the form data
    callAPI(
      document.getElementById('date').value,
      document.getElementById('meeting_title').value,
      document.getElementById('company').value,
      document.getElementById('sales_rep').value,
      document.getElementById('counter_part_at_customer_side').value,
      document.getElementById('report_contents').value,
    );

    // Reset the form
    resetForm();

    // Show the toast notification with an appropriate message
    const toastMessage = currentLanguage === 'ja' ? '送信が完了しました。' : 'Report submitted';
    showToast(toastMessage);

    // Optionally, navigate to another page after the toast is shown
    setTimeout(() => {
      window.location.href = 'report_review.html';
    }, 3000); // 3 seconds delay to give the user time to read the toast
  } else {
    alert('Please fill out all required fields before submitting the report.');
  }
}
function showToast(message) {
  const toastContainer = document.getElementById('toast-container');
  const toastMessage = document.getElementById('toastMessage');

  // Update the message
  toastMessage.textContent = message;

  // Show the toast
  toastContainer.style.display = 'flex'; // Ensure proper display

  // Automatically hide the toast after 3 seconds
  setTimeout(() => {
    toastContainer.style.display = 'none';
  }, 3000);
}

function closeToast() {
  const toastContainer = document.getElementById('toast-container');
  toastContainer.style.display = 'none';
}
window.onload = function () {
  document.getElementById('toast-container').style.display = 'none';
};

function resetForm() {
  // Reset all input fields
  document.querySelectorAll('input, textarea').forEach(function (elem) {
    if (elem.id !== 'sales_rep') {
      // Do not reset the sales_rep field
      elem.value = '';
    }
    elem.disabled = false;
  });
  // Ensure sales rep field remains pre-filled and read-only
  document.getElementById('sales_rep').disabled = true;
  // Show the submit button and hide the confirmation div
  document.getElementById('submitButton').style.display = 'block';
  document.getElementById('confirmDiv').style.display = 'none';
}

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
    reviewbutton: 'Sales report system',
    newreportbtn: 'New Report',
    formtitle: 'Create Sales Report',
    welcomeMessage: 'Welcome, ',
    dateLabel: 'Date:',
    titleLabel: 'Title:',
    customerLabel: 'Company:',
    salesRepLabel: 'SALES PERSON:',
    counterPartLabel: 'Counterpart:',
    contentsLabel: 'Contents:',
    submitButton: 'Submit',
    backButton: 'BACK TO EDIT',
    confirmButton: 'CONFIRM',
    reviewButton: 'Report review system',
    logoutButton: 'Logout',
    titlePlaceholder: 'Please enter a title',
    companyPlaceholder: 'Enter business partner name',
    counterPartPlaceholder: 'Please enter customer contact',
    contentsPlaceholder: 'Please enter the content',
    reviewbackButton: 'Back',
  },
  ja: {
    companyName: '三洋鋼材株式会社',
    title: '営業報告システム',
    reviewbutton: '営業報告システム',
    newreportbtn: '新規作成',
    formtitle: '営業報告作成',
    welcomeMessage: 'ようこそ',
    dateLabel: '日付：',
    titleLabel: 'タイトル:',
    customerLabel: '顧客名:',
    salesRepLabel: '営業担当者：',
    counterPartLabel: '顧客先担当者：',
    contentsLabel: '内容：',
    submitButton: '確認画面へ',
    backButton: '戻る',
    confirmButton: '送信',
    reviewButton: '報告書レビューシステム',
    logoutButton: 'ログアウト',
    titlePlaceholder: 'タイトルを入力',
    companyPlaceholder: '顧客名を入力',
    counterPartPlaceholder: '顧客先担当者を入力',
    contentsPlaceholder: '内容を入力',
    reviewbackButton: '戻る',
  },
};

function redirectToReview() {
  window.location.href = 'report_review.html';
}

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
  const newReportbtn = document.getElementById('new-report-text');
  const welcomeMessageElement = document.getElementById('welcomeMessage');
  const dateLabelElement = document.querySelector('label[for="date"]');
  const titleLabelElement = document.querySelector('label[for="meeting_title"]');
  const customerLabelElement = document.querySelector('label[for="company"]');
  const salesRepLabelElement = document.querySelector('label[for="sales_rep"]');
  const counterPartLabelElement = document.querySelector('label[for="counter_part_at_customer_side"]');
  const contentsLabelElement = document.querySelector('label[for="report_contents"]');
  const submitButtonElement = document.getElementById('submitButton');
  const backButtonElement = document.querySelector('#confirmDiv button:nth-of-type(2)');
  const confirmButtonElement = document.querySelector('#confirmDiv button:nth-of-type(1)');
  const reviewButtonElement = document.querySelector('.reviewButton');
  const logoutElement = document.getElementById('logout-text');

  const reviewBackElement = document.getElementById('backButtonMain');

  const titleInput = document.getElementById('meeting_title');
  const companyInput = document.getElementById('company');
  const counterPartInput = document.getElementById('counter_part_at_customer_side');
  const contentsTextarea = document.getElementById('report_contents');

  if (companyName) companyName.textContent = textContent[language].companyName;
  if (titleElement) document.title = textContent[language].title;
  if (newReportbtn) newReportbtn.textContent = textContent[language].newreportbtn;
  if (SalesreportElement) SalesreportElement.textContent = textContent[language].reviewbutton;

  if (formTitlElement) {
    // Update the text while preserving the icon
    const iconElement = formTitlElement.querySelector('i'); // Find the existing icon
    const newText = textContent[language].formtitle; // Get the new title text

    // Clear current text but keep the icon
    formTitlElement.innerHTML = ''; // Clear existing content
    if (iconElement) {
      formTitlElement.appendChild(iconElement); // Re-add the icon element
    }

    const textNode = document.createTextNode(` ${newText}`); // Add a space and the new text
    formTitlElement.appendChild(textNode);
  }
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
  if (reviewBackElement) reviewBackElement.textContent = textContent[language].reviewbackButton;
  if (confirmButtonElement) confirmButtonElement.textContent = textContent[language].confirmButton;
  if (reviewButtonElement) reviewButtonElement.textContent = textContent[language].reviewButton;
  if (logoutElement) logoutElement.textContent = textContent[language].logoutButton;

  if (titleInput) titleInput.placeholder = textContent[language].titlePlaceholder;
  if (companyInput) companyInput.placeholder = textContent[language].companyPlaceholder;
  if (counterPartInput) counterPartInput.placeholder = textContent[language].counterPartPlaceholder;
  if (contentsTextarea) contentsTextarea.placeholder = textContent[language].contentsPlaceholder;
}

// On page load
document.addEventListener('DOMContentLoaded', function () {
  updateContent(currentLanguage);
  highlightActiveLanguage();
});

module.exports = {
  setDefaultTitle,
  switchToJapanese,
  switchToEnglish,
  navigateToReportReview,
  resetForm,
  confirmSubmission,
  goBack,
};
