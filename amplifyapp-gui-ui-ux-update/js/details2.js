import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Declare global variables for auth and db
let auth;
let db;

// Function to initialize Firebase with fetched credentials
async function initializeFirebase() {
  try {
    // Fetch Firebase credentials from the API Gateway
    const response = await fetch(apiGatewayUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authorizationToken}`, // Make sure the token is prefixed with Bearer
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();

    // Parse the JSON response (as the data is wrapped in a 'body' key)
    const firebaseConfig = JSON.parse(data.body)[0];

    // Firebase configuration object
    const firebaseConfigObj = {
      apiKey: firebaseConfig.apiKey,
      authDomain: firebaseConfig.authDomain,
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
      appId: firebaseConfig.appId,
    };

    // Initialize Firebase with the fetched config
    const app = initializeApp(firebaseConfigObj);
    auth = getAuth(app); // Initialize the global auth variable
    db = getFirestore(app); // Initialize the global db variable

    console.log('Firebase initialized with dynamic config');

    // Call your authentication handler
    handleAuthState(auth, db);
  } catch (error) {
    console.error('Error fetching Firebase config:', error);
  }
}

// Call this function on page load or when appropriate
initializeFirebase();

// Function to handle Firebase authentication state
async function handleAuthState(auth, db) {
  onAuthStateChanged(auth, async function (user) {
    if (user) {
      try {
        // Fetch user document from Firestore using the UID of the logged-in user
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const salesRepName = userData.name; // Assuming 'name' contains the sales rep's name

          // Display the sales rep's name in the profile section or header
          document.getElementById('salesRepName').textContent = salesRepName;
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error getting document:', error);
      }
    } else {
      // Redirect to login if not authenticated
      window.location.href = 'index.html';
    }
  });
}

// Function to toggle the dropdown visibility and rotate arrow
window.toggleDropdown = function (event) {
  const dropdownMenu = document.getElementById('dropdownMenu');
  const dropdownArrow = document.getElementById('dropdownArrow');

  // Prevent event from bubbling up to the button click
  event.stopPropagation();

  // Toggle the dropdown visibility
  if (dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '') {
    dropdownMenu.style.display = 'block'; // Show the dropdown
    dropdownArrow.classList.add('rotate'); // Rotate the arrow
  } else {
    dropdownMenu.style.display = 'none'; // Hide the dropdown
    dropdownArrow.classList.remove('rotate'); // Reset the arrow rotation
  }
};

// Function for logout button
window.logout = function () {
  // Firebase sign-out
  auth
    .signOut()
    .then(() => {
      // Redirect to index.html after successful sign-out
      window.location.href = 'index.html';
    })
    .catch((error) => {
      // Handle any errors during sign-out
      console.error('Error during logout:', error);
    });
};

// Close the dropdown if the user clicks outside of it
document.addEventListener('click', function (event) {
  const dropdownMenu = document.getElementById('dropdownMenu');
  const dropdownButton = document.getElementById('profileButton');

  // If the click was outside the dropdown button and menu, close the menu
  if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
    dropdownMenu.style.display = 'none';
    dropdownArrow.classList.remove('rotate');
  }
});

// Hide the dropdown when clicking outside of it
window.onclick = function (event) {
  if (!event.target.matches('#profileDropdown')) {
    var dropdowns = document.getElementsByClassName('dropdown-menu');
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.style.display === 'block') {
        openDropdown.style.display = 'none';
      }
    }
  }
};
