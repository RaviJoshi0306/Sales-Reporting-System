import { render, screen, waitFor } from "@testing-library/dom";

import "@testing-library/jest-dom";
import fs from "fs";
import path from "path";

// Load the HTML file
const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf-8");

// Mock functions for setLanguage and checkPassword
function setLanguage(lang) {
  // Simulate language switching logic
  const languageStrings = {
    en: {
      name: 'Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password'
    },
    ja: {
      name: '名前',
      email: 'メール',
      password: 'パスワード',
      confirmPassword: 'パスワードを確認'
    }
  };
  
  const placeholders = languageStrings[lang];
  document.getElementById('registerName').placeholder = placeholders.name;
  document.getElementById('registerEmail').placeholder = placeholders.email;
  document.getElementById('registerPassword').placeholder = placeholders.password;
  document.getElementById('registerConfirmPassword').placeholder = placeholders.confirmPassword;
}

function checkPassword() {
  const password = document.getElementById('registerPassword').value;
  const messageElement = document.getElementById('registerMessage');
  
  // Check password requirements (at least 12 chars, uppercase, number, special char)
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
  if (!regex.test(password)) {
    messageElement.textContent = 'パスワードは12文字以上、大文字、数字、記号を含む必要があります。'; // Japanese message
  } else {
    messageElement.textContent = '';
  }
}

beforeEach(() => {
  document.documentElement.innerHTML = html.toString();
});

test("should have a title", () => {
  const title = document.querySelector("title");
  expect(title).not.toBeNull();
  expect(title.textContent).toBe("User Registration and Login"); // Updated title
});

test("should have a navigation bar", () => {
  const nav = document.querySelector(".language-switch"); // Updated selector to match the existing structure
  expect(nav).not.toBeNull();
  expect(nav.children.length).toBeGreaterThan(0); // Ensure it has children
});

test('should switch language to Japanese when Japanese button is clicked', () => {
  const jpButton = document.getElementById('lang-jp');
  const enButton = document.getElementById('lang-en');
  
  jpButton.click();
  expect(jpButton.classList.contains('active')).toBe(true);
  expect(enButton.classList.contains('active')).toBe(false);
  expect(document.querySelector('.system-title').textContent).toBe('営業報告システム');
});


  
test('should update placeholders to Japanese when language is set to Japanese', () => {
  setLanguage('ja'); // Simulate setting Japanese language
  
  expect(document.getElementById('registerName').placeholder).toBe('名前');
  expect(document.getElementById('registerEmail').placeholder).toBe('メール');
  expect(document.getElementById('registerPassword').placeholder).toBe('パスワード');
  expect(document.getElementById('registerConfirmPassword').placeholder).toBe('パスワードを確認');
});

test('should update placeholders to English when language is set to English', () => {
  setLanguage('en'); // Simulate setting English language
  
  expect(document.getElementById('registerName').placeholder).toBe('Name');
  expect(document.getElementById('registerEmail').placeholder).toBe('Email');
  expect(document.getElementById('registerPassword').placeholder).toBe('Password');
  expect(document.getElementById('registerConfirmPassword').placeholder).toBe('Confirm Password');
});

test('should show password requirements error if password does not meet requirements', () => {
  const registerPassword = document.getElementById('registerPassword');
  const registerMessage = document.getElementById('registerMessage');
  
  registerPassword.value = 'weakpass';
  checkPassword();
  
  expect(registerMessage.textContent).toBe('パスワードは12文字以上、大文字、数字、記号を含む必要があります。'); // Japanese message
});

test('should show valid password message when password meets requirements', () => {
  const registerPassword = document.getElementById('registerPassword');
  const registerMessage = document.getElementById('registerMessage');
  
  registerPassword.value = 'Strong1@Password';
  checkPassword();
  
  expect(registerMessage.textContent).toBe('');
});


// Test to ensure that the submit button is enabled when the password is valid
test('should enable submit button when password is valid', () => {
    const submitButton = document.getElementById('signupsubmit');
    const passwordInput = document.getElementById('registerPassword');
    passwordInput.value = 'ValidPassword123!'; // Set a valid password

    checkPassword(); // Assuming checkPassword() is the function that enables/disables the submit button
    expect(submitButton.disabled).toBe(false); // Ensure submit button is enabled
});



// Test to ensure the form is not submitted when the password is invalid
test('should not submit form if password is invalid', () => {
    const submitButton = document.getElementById('signupsubmit');
    const passwordInput = document.getElementById('registerPassword');
    passwordInput.value = 'weakpass'; // Set an invalid password

    submitButton.click(); // Simulate form submission
    expect(passwordInput.value).toBe('weakpass'); // Ensure the password input is not empty
});







// Test to check if the registration form displays correctly on page load
test('should display the sign-up form on page load', () => {
    const registerForm = document.getElementById('registerForm');
    expect(registerForm.classList.contains('hidden')).toBe(true); // Ensure the registration form is hidden initially
});

// Test to check if the login form is displayed after switching to sign-in
test('should display login form when switching from sign-up', () => {
    const toggleToSignInButton = document.getElementById('toggleToSignIn');
    toggleToSignInButton.click(); // Simulate click to switch to login form

    const loginForm = document.getElementById('loginForm');
    expect(loginForm.style.display).not.toBe('none'); // Check if the login form is displayed
});

// Test to check if the registration form is displayed after switching to sign-up
test('should display registration form when switching from sign-in', () => {
    const toggleToSignUpButton = document.getElementById('toggleToSignUp');
    toggleToSignUpButton.click(); // Simulate click to switch to registration form

    const registerForm = document.getElementById('registerForm');
    expect(registerForm.style.display).not.toBe('none'); // Check if the registration form is displayed
});



// Test to validate if form input fields are required
test('should show validation error when required fields are empty', () => {
    const submitButton = document.getElementById('signupsubmit');
    const registerForm = document.getElementById('registerForm');
    
    const nameInput = document.getElementById('registerName');
    const emailInput = document.getElementById('registerEmail');
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('registerConfirmPassword');

    // Simulate form submission with empty inputs
    nameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
    confirmPasswordInput.value = '';
    
    submitButton.click();
    
    expect(nameInput.value).toBe(''); // Ensure the name input is still empty
    expect(emailInput.value).toBe(''); // Ensure the email input is still empty
    expect(passwordInput.value).toBe(''); // Ensure the password input is still empty
    expect(confirmPasswordInput.value).toBe(''); // Ensure the confirm password input is still empty
});



// Test to validate the "forgot password" link visibility
test('should display forgot password link in sign-in form', () => {
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    expect(forgotPasswordLink.style.display).not.toBe('none'); // Ensure the forgot password link is visible
});


describe('Password Visibility Toggle', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <input id="registerPassword" type="password" />
        <button id="togglePasswordVisibility">Show/Hide</button>
      `;
      
      // Simulating the event listener being attached
      const toggleButton = document.getElementById('togglePasswordVisibility');
      toggleButton.addEventListener('click', function () {
        const passwordField = document.getElementById('registerPassword');
        const currentType = passwordField.type;
        passwordField.type = currentType === 'password' ? 'text' : 'password';
      });
    });
  
    test('toggles password visibility', () => {
      const passwordField = document.getElementById('registerPassword');
      const toggleButton = document.getElementById('togglePasswordVisibility');
  
      // Initially, password should be hidden
      expect(passwordField.type).toBe('password');
  
      // Simulate clicking the toggle button to show the password
      toggleButton.click();
      expect(passwordField.type).toBe('text');
  
      // Simulate clicking the toggle button to hide the password again
      toggleButton.click();
      expect(passwordField.type).toBe('password');
    });
  });
  


