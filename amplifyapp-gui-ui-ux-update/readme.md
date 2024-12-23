# Infrastructure Overview
The system is built with a serverless architecture; AWS services

> AWS API Gateway
> AWS Lambda
> AWS DynamoDB
> Firebase Authentication



# Firebase Authentication
We use Firebase Authentication to handle user sign-ups, logins, and authentication flows. Firebase SDK to handle sign-in and token generation.

> Email/Password Authentication: Allows users to register and log in using their email and password.
> Session Management: Tokens issued by Firebase are used to verify user identity and provide secure access to APIs.




# File Structure
1. CSS Directory -> Contains styling for different pages
2. JavaScript Directory
-> env.js: Stores authorizationToken and apiGatewayUrl.
-> <FileName1> contains core JS logic for all JS files like fetch, listners, edit, modify, translation logic, sort etc
-> <FileName2> contains Firebase authentication and related logic for each file



# Different Components and Their Relationships

## INDEX 
1. Left Panel: Purely presentational; no functional relationships.
2. Right Panel: Sign Up Form (#registerForm), Sign In Form (#loginForm)

### Core functionality is implemented in index.js and Firebase initialization logic
### Language translation and form-switching logic`

index.html	    Defines the structure and layout of the user interface.
index.js	    Implements logic for language management, form toggling, password validation, and user flow.
env.js	        Configures sensitive environment variables (apiGatewayUrl, authorizationToken).
Firebase SDK	Provides authentication (getAuth) and database (getFirestore) functionalities.


## REPORT REVIEW
Main user interface for viewing and searching sales reports.

### Frontend Components:
1. Header: language switch, profile dropdown, new report creation button. Language toggle invokes the switchLanguage() function, updating labels dynamically.
2. Search Bar: Combines dropdown and input field for parameterized searching. Also Utilizes debounce() to reduce API calls during typing.

->> fetchReports() retrieves data, while showSuggestions() displays potential matches.

3. Table:
Columns are sortable using sortData()

report_review1.js	<-->    Handles core functionalities like fetching, searching, sorting
report_review2.js	<-->    Modular logic for advanced or reusable components.


## DETAILS
Fetches report details from the backend using the report ID.

### User Actions:
View/Navigate back to the report review page.

### JavaScript Functions
1. Multi-Language Support
2. Fetch Report Details
3. Display Report Details: Renders the report details in a structured layout


## UPDATE
Allows to edit/ delete a specify report using report id

1. Edit Report: Redirects the user to the Edit Report page with the current report ID <> `confirmReplacement()` function
2. Delete Report: Deletes the current report <> `deleteReport()` function


## SALES REPORT
Allows user to input Create Sales Report

-> Key Functions:
1. callAPI(): Sends a POST request to the API.
2. showConfirmation(): Displays a confirmation dialog for submission.
3. confirmSubmission(): Submits the form data and resets the form.

salesreport1.js	<--> Handles form interactions, API calls, and report submission logic.
salesreport2.js <--> Module for handling language switching, dynamic text updates, and date formatting.

