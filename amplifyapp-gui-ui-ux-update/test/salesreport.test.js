
const { setDefaultTitle,switchToJapanese,switchToEnglish,navigateToReportReview, resetForm,confirmSubmission,goBack } = require('../js/salesreport1.js'); // Adjust the path as needed




  
 
test('generates default meeting title based on date and company', () => {
    document.body.innerHTML = `
      <input type="date" id="date" value="2024-12-01" />
      <input type="text" id="company" value="Test Company" />
      <input type="text" id="meeting_title" />
    `;

    setDefaultTitle();

    const meetingTitle = document.getElementById('meeting_title').value;
    expect(meetingTitle).toBe('2024/12/01面談：Test Company');
});




test('updates UI content when switching to Japanese', () => {
    document.body.innerHTML = `
      <h1 id="company-name"></h1>
      <label for="date"></label>
      <label for="meeting_title"></label>
      <label for="company"></label>
      <label for="sales_rep"></label>
      <label for="counter_part_at_customer_side"></label>
      <label for="report_contents"></label>
      <button id="submitButton"></button>
      <button id="lang-jp"></button>
      <button id="lang-en"></button>
    `;

    switchToJapanese();

    expect(document.getElementById('company-name').textContent).toBe("三洋鋼材株式会社");
    expect(document.querySelector('label[for="date"]').textContent).toBe("日付：");
    expect(document.querySelector('label[for="meeting_title"]').textContent).toBe("タイトル:");
    expect(document.querySelector('label[for="company"]').textContent).toBe("顧客名:");
    expect(document.querySelector('label[for="sales_rep"]').textContent).toBe("営業担当者：");
    expect(document.querySelector('label[for="counter_part_at_customer_side"]').textContent).toBe("顧客先担当者：");
    expect(document.querySelector('label[for="report_contents"]').textContent).toBe("内容：");
    expect(document.getElementById('submitButton').textContent).toBe("確認画面へ");
});


test('highlights the active language button', () => {
    document.body.innerHTML = `
      <button id="lang-jp"></button>
      <button id="lang-en"></button>
    `;

    switchToJapanese();
    expect(document.getElementById('lang-jp').classList.contains('active')).toBe(true);
    expect(document.getElementById('lang-en').classList.contains('active')).toBe(false);

    switchToEnglish();
    expect(document.getElementById('lang-jp').classList.contains('active')).toBe(false);
    expect(document.getElementById('lang-en').classList.contains('active')).toBe(true);
});


test('navigates to report review with sales rep in URL', () => {
    document.body.innerHTML = `<input type="text" id="sales_rep" value="Test Sales Rep" />`;

    // Mock `window.location.href`
    delete global.window.location; // Remove the existing location object
    global.window.location = { href: '' }; // Mock location object

    // Call the function
    navigateToReportReview();

    // Assert that `window.location.href` was updated correctly
    expect(window.location.href).toBe('report_review.html?sales_rep=Test Sales Rep');
});



test('resets the form after submission', () => {
    document.body.innerHTML = `
      <input type="date" id="date" value="2024-12-01" />
      <input type="text" id="meeting_title" value="Test Meeting" />
      <input type="text" id="company" value="Test Company" />
      <input type="text" id="sales_rep" value="Sales Rep" disabled />
      <input type="text" id="counter_part_at_customer_side" value="Customer" />
      <textarea id="report_contents">Test Contents</textarea>
      <div id="submitButton" style="display: none;"></div>
      <div id="confirmDiv" style="display: flex;"></div>
    `;

    resetForm();

    expect(document.getElementById('date').value).toBe('');
    expect(document.getElementById('meeting_title').value).toBe('');
    expect(document.getElementById('company').value).toBe('');
    expect(document.getElementById('counter_part_at_customer_side').value).toBe('');
    expect(document.getElementById('report_contents').value).toBe('');
    expect(document.getElementById('sales_rep').disabled).toBe(true);
    expect(document.getElementById('submitButton').style.display).toBe('block');
    expect(document.getElementById('confirmDiv').style.display).toBe('none');
});


test('makes an API call with correct data on confirmation', async () => {
  // Mock the fetch function
  global.fetch = jest.fn().mockResolvedValue({ text: () => 'OK' });

  // Set up the DOM elements required for the test
  document.body.innerHTML = `
    <input type="date" id="date" value="2024-12-01" />
    <input type="text" id="meeting_title" value="Test Meeting" />
    <input type="text" id="company" value="Test Company" />
    <input type="text" id="sales_rep" value="Sales Rep" />
    <input type="text" id="counter_part_at_customer_side" value="Customer" />
    <textarea id="report_contents">Test Contents</textarea>
    <button id="submitButton" style="display: none;"></button>
    <div id="confirmDiv" style="display: block;"></div>
    <!-- Add the toast-container and toastMessage elements for the showToast function -->
    <div id="toast-container" style="display: none;">
        <span id="toastMessage"></span>
    </div>
  `;

  // Call the function
  confirmSubmission();

  // Assert that fetch was called with the correct data
  expect(global.fetch).toHaveBeenCalledWith(
      "https://nb8i9zluk4.execute-api.us-east-2.amazonaws.com/dev",
      expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
              date: '2024-12-01',
              meeting_title: 'Test Meeting',
              company: 'Test Company',
              sales_rep: 'Sales Rep',
              counter_part_at_customer_side: 'Customer',
              report_contents: 'Test Contents',
          }),
      })
  );

  // Assert that the toast message is displayed correctly
  const toastMessage = document.getElementById('toastMessage');
  expect(toastMessage.textContent).toBe('Report submitted');

  // Clean up the mock
  global.fetch.mockRestore();
});


beforeAll(() => {
    global.alert = jest.fn(); // Mock alert
});


