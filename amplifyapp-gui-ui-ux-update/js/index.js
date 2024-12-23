document.getElementById('lang-jp').addEventListener('click', () => {
  setLanguage('ja'); // Switch to Japanese
});

document.getElementById('lang-en').addEventListener('click', () => {
  setLanguage('en'); // Switch to English
});

// Function to handle language setting and storing in localStorage
function setLanguage(lang) {
  localStorage.setItem('CurrLang', lang); // Store language using 'CurrLang' key
  // Toggle active button
  document.getElementById('lang-jp').classList.remove('active');
  document.getElementById('lang-en').classList.remove('active');

  if (lang === 'ja') {
    document.getElementById('lang-jp').classList.add('active');
    translateToJapanese();
  } else {
    document.getElementById('lang-en').classList.add('active');
    translateToEnglish();
  }
}

// Translate page content to Japanese
function translateToJapanese() {
  // document.querySelector('.company-name').textContent = '三洋鋼材株式会社';
  document.querySelector('#registerForm h1').textContent = '新規登録';

  document.querySelector('.system-title').textContent = '営業報告システム';
  document.querySelector('.system-title2').textContent = '-PiNO-';

  document.getElementById('registerName').placeholder = '氏名を入力';
  document.getElementById('registerEmail').placeholder = 'メールアドレスを入力';
  document.getElementById('registerPassword').placeholder = 'パスワードを入力';
  document.getElementById('registerConfirmPassword').placeholder = 'パスワードを入力（確認用）';
  document.querySelector('.passwordRequirementsOnesentence').textContent =
    'パスワードは12文字以上、大文字、数字、記号を含む必要があります。';
  // document.getElementById('lengthRequirement').textContent = '少なくとも12文字';
  // document.getElementById('uppercaseRequirement').textContent = '少なくとも1つの大文字';
  // document.getElementById('numberRequirement').textContent = '少なくとも1つの数字';
  // document.getElementById('specialCharRequirement').textContent = '少なくとも1つの特殊文字';
  document.getElementById('signupsubmit').textContent = '登録する';
  document.getElementById('loginButton').textContent = 'ログイン';
  document.getElementById('forgotPasswordLink').textContent = 'パスワードを忘れましたか？';
  document.getElementById('toggleToSignIn').textContent = '戻る';
  document.getElementById('toggleToSignUp').textContent = '新規登録';
  document.querySelector('#loginForm h1').textContent = 'ログイン';
  document.getElementById('registerMessage').textContent = 'パスワードが要件を満たしてません。';
  document.getElementById("forgotPasswordLink").textContent =
      "パスワードを忘れましたか？";
  document.getElementById("forgot_header").textContent = "パスワード再設定";
  document.getElementById("forgot_para").textContent =
    "入力したメールアドレスに、パスワード再設定のご案内をお送りします。";
  document.getElementById("emailInput").placeholder =
    "メールアドレスを入力してください";
  document.getElementById("backtologin").textContent = "ログイン画面に戻る";
  document.getElementById("sendEmailButton").textContent = "送信する";
  document.getElementById("successMessage").textContent =
  "パスワードリセット用のリンクを以下のメールアドレスに送信しました";
  const email = document.getElementById("emailInput").value;
  document.getElementById("emailAddress").textContent = email;
  document
  .getElementById("sendEmailButton")
  .addEventListener("click", function () {
    // Perform translation to Japanese as an example
    translateToJapanese();
  });
  document.getElementById('toastMessage').textContent = 'ユーザー登録が完了しました';

  // Clear the registerMessage content and reset its styling
  const messageElement = document.getElementById('registerMessage');
  if (messageElement) {
    messageElement.textContent = ''; // Clear the message
    messageElement.classList.remove('message-error'); // Remove error styling
  }
}

// Translate page content to English
function translateToEnglish() {
  // document.querySelector('.company-name').textContent = 'Sanyo Steel Co.Ltd.';
  document.querySelector('#registerForm h1').textContent = 'Create an Account';

  document.querySelector('.system-title').textContent = 'Sales Reporting System';
  document.querySelector('.system-title2').textContent = '-PiNO-';
  document.getElementById('registerName').placeholder = 'Name';
  document.getElementById('registerEmail').placeholder = 'Email';
  document.getElementById('registerPassword').placeholder = 'Password';
  document.getElementById('registerConfirmPassword').placeholder = 'Confirm Password';
  document.querySelector('.passwordRequirementsOnesentence').textContent =
    'At least 12 characters, Capital letter, Number, and special symboles like @,#,%.';
  // document.getElementById('lengthRequirement').textContent = 'At least 12 characters';
  // document.getElementById('uppercaseRequirement').textContent = 'At least 1 uppercase letter';
  // document.getElementById('numberRequirement').textContent = 'At least 1 number';
  // document.getElementById('specialCharRequirement').textContent = 'At least 1 special character';
  document.getElementById('signupsubmit').textContent = 'Sign Up';
  document.getElementById('loginButton').textContent = 'Sign In';
  document.getElementById('forgotPasswordLink').textContent = 'Forgot your password?';
  document.getElementById('toggleToSignIn').textContent = 'Go to Login';
  document.getElementById('toggleToSignUp').textContent = 'Go to Sign Up';
  document.querySelector('#loginForm h1').textContent = 'Sign In';
  document.getElementById('registerMessage').textContent = 'Password must meet all the requirements.';
  document.getElementById("forgotPasswordLink").textContent = "Forgot Password?";
  document.getElementById("forgot_header").textContent = "Reset Password";
  document.getElementById("forgot_para").textContent = "We will send instructions to reset your password to the entered email address.";
  document.getElementById("emailInput").placeholder = "Enter your email address";
  document.getElementById("backtologin").textContent = "Return to Login";
  document.getElementById("sendEmailButton").textContent = "Send";
  document.getElementById("successMessage").textContent = "A password reset link has been sent to the email address below.";
  const email = document.getElementById("emailInput").value;
  document.getElementById("emailAddress").textContent = email;
  document
  .getElementById("sendEmailButton")
  .addEventListener("click", function () {
    // Perform translation to Japanese as an example
    translateToEnglish();
  });
  document.getElementById('toastMessage').textContent = 'User registered successfully!';
  // Clear the registerMessage content and reset its styling
  const messageElement = document.getElementById('registerMessage');
  if (messageElement) {
    messageElement.textContent = ''; // Clear the message
    messageElement.classList.remove('message-error'); // Remove error styling
  }
}

// Set the language based on localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('CurrLang') || 'ja'; // Default to Japanese
  setLanguage(savedLang); // Set the language based on the saved value
});

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  query,
  collection,
  where,
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { isEmpty } from 'https://cdn.skypack.dev/lodash';

async function initializeFirebase() {
  try {
    const response = await fetch(apiGatewayUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authorizationToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const firebaseConfig = JSON.parse(data.body)[0];

    const firebaseConfigObj = {
      apiKey: firebaseConfig.apiKey,
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
      appId: firebaseConfig.appId,
    };

    const app = initializeApp(firebaseConfigObj);
    const auth = getAuth(app);
    const db = getFirestore(app);

    console.log('Firebase initialized with dynamic config');
    setupForms(auth, db);
  } catch (error) {
    console.error('Error fetching Firebase config:', error);
  }
}

initializeFirebase();

// This function contains the form handling logic that requires Firebase services
function setupForms(auth, db) {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');
  const toggleToSignIn = document.getElementById('toggleToSignIn');
  const toggleToSignUp = document.getElementById('toggleToSignUp');

  function setActiveButton(activeButton) {
    toggleToSignIn.classList.remove('active');
    toggleToSignUp.classList.remove('active');
    activeButton.classList.add('active');
  }

  // Clear form inputs and disable required fields when switching forms
  function clearAndDisableForm(form) {
    Array.from(form.elements).forEach((input) => {
      if (input.type !== 'submit') {
        input.value = '';
        input.disabled = true; // Disable required inputs in the hidden form
      }
    });
  }

  function enableFormFields(form) {
    Array.from(form.elements).forEach((input) => {
      if (input.type !== 'submit') {
        input.disabled = false; // Re-enable required inputs in the visible form
      }
    });
  }

  toggleToSignIn.addEventListener('click', () => {
    clearAndDisableForm(registerForm);
    enableFormFields(loginForm);
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
    setActiveButton(toggleToSignIn);
  });

  toggleToSignUp.addEventListener('click', () => {
    clearAndDisableForm(loginForm);
    enableFormFields(registerForm);
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    setActiveButton(toggleToSignUp);

    // Clear the registerMessage content and reset its styling
    const messageElement = document.getElementById('registerMessage');
    if (messageElement) {
      messageElement.textContent = ''; // Clear the message
      messageElement.classList.remove('message-error'); // Remove error styling
    }
  });

  // Function to toggle password visibility
  function togglePasswordVisibility(inputId) {
    const passwordField = document.getElementById(inputId);
    const eyeIcon = passwordField.nextElementSibling.querySelector('i'); // Get the <i> element inside the span

    if (passwordField.type === "password") {
      passwordField.type = "text"; // Show password
      eyeIcon.classList.remove('fa-eye'); // Change eye icon to open
      eyeIcon.classList.add('fa-eye-slash'); // Change to the eye-slash icon
    } else {
      passwordField.type = "password"; // Hide password
      eyeIcon.classList.remove('fa-eye-slash'); // Remove eye-slash icon
      eyeIcon.classList.add('fa-eye'); // Change back to the eye icon
    }
  }
  // Add event listeners to toggle password visibility
  document.getElementById('togglePassword1').addEventListener('click', function() {
    togglePasswordVisibility('registerPassword');
  });

  document.getElementById('togglePassword2').addEventListener('click', function() {
    togglePasswordVisibility('registerConfirmPassword');
  });
  
  document.getElementById('togglePassword3').addEventListener('click',function(){
    togglePasswordVisibility('loginPassword');
  });

  
  // Attach the togglePasswordVisibility function to the password toggle button
  document.getElementById('registerPassword').addEventListener('click', togglePasswordVisibility);

  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const messageElement = document.getElementById('registerMessage');
    console.log('toast');
    const toastElement = document.getElementById('toast-container');
    messageElement.classList.remove('message-error');
    messageElement.textContent='';

    if (!validatePassword(password)) {
      const messageElement = document.getElementById('registerMessage');
      messageElement.textContent =
        localStorage.getItem('CurrLang') === 'ja'
          ? 'パスワードはすべての要件を満たしている必要があります。'
          : 'Password must meet all the requirements.';
      return;
    }
    if (password !== confirmPassword) {
      messageElement.textContent = 'Passwords do not match!';
      messageElement.classList.add('message-error');
      return;
    }

    try {
      const userQuery = await getDocs(query(collection(db, 'users'), where('name', '==', name)));
      if (!isEmpty(userQuery.docs)) {
        throw new Error('Username already taken!');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
      });

      messageElement.textContent = 'User registered successfully!';

      toastElement.classList.remove('hidden');
      setTimeout(() => {
        toastElement.classList.add('hidden');
      }, 3000);
    } catch (error) {
      messageElement.textContent = error.message;
      messageElement.classList.add('message-error');
    }
  });

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const loginMessage = document.getElementById('loginMessage');
    loginMessage.textContent = ''; // Clear previous messages
    loginMessage.classList.remove('message-error');

    const startTime = performance.now(); // Start timing

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const endTime = performance.now(); // End timing
      const timeTaken = endTime - startTime;

      // Store the timing in localStorage
      localStorage.setItem('loginTime', timeTaken);

      console.log(`Login completed in ${timeTaken} ms`);

      // Redirect to the report page
      window.location.href = 'report_review.html';
    } catch (error) {
      console.error('Error logging in user', error);

      const endTime = performance.now(); // End timing for error case
      const timeTaken = endTime - startTime;

      console.log(`Login failed in ${timeTaken} ms`);
      loginMessage.textContent = 'Login failed. Please try again.';
      loginMessage.classList.add('message-error');
    }
  });

  
  document
      .getElementById("forgotPasswordLink")
      .addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("popupOverlay").style.display = "flex";
      });
  
    document.getElementById("popupClose").addEventListener("click", () => {
      document.getElementById("popupOverlay").style.display = "none";
    });
    document.getElementById("backtologin").addEventListener("click", () => {
      document.getElementById("popupOverlay").style.display = "none";
    });
  
    document
      .getElementById("sendEmailButton")
      .addEventListener("click", async () => {
        const email = document.getElementById("emailInput").value;
  
        if (email) {
          try {
            await sendPasswordResetEmail(auth, email);
            document.getElementById("successPopup").style.display = "block";
          } catch (error) {
            console.error("Error sending password reset email", error);
            alert(error.message);
          }
        } else {
          alert("Please enter your email address.");
        }
      });
    document.getElementById("closePopup").addEventListener("click", function () {
      // Hide the popup
      document.getElementById("successPopup").style.display = "none";
    });
      
}

function validatePassword(password) {
  const minLength = 12;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return password.length >= minLength && hasUpperCase && hasNumber && hasSpecialChar;
}
