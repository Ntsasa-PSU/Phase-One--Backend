# Phase-One Backend

This backend is built with **Node.js**, **Express**, and **MongoDB** (using Mongoose). It supports user authentication, goal management, and transaction tracking.

Reason for the shift from storing locally in JSON files:
1. JSON is not encrypted.....so the user's bank info will be stored locally via plain text.
   1. a "hacker" can just hit F12 and inspect the code on the FE and see the routes to where the JSON is and open it.
2. Standard JSON files do not support access conrol like most other features we utilize in Javascript/Typescript (most features are under the hood) making is so there is no built-in way to limit who can read/write to these files (code injection/tampering)
3. Google it and read the results, some horro stories about it.

---

## Table of Contents
- [Phase-One Backend](#phase-one-backend)
  - [Table of Contents](#table-of-contents)
  - [Project Structure](#project-structure)
  - [Folder \& File Overview](#folder--file-overview)
      - [app.ts](#appts)
      - [config/db.ts](#configdbts)
      - [controllers/](#controllers)
      - [models/](#models)
      - [routes/](#routes)
      - [server.ts](#serverts)
      - [old/](#old)

---

## Project Structure

Phase-One--Backend/src
├── app.ts
├── config
│ └── db.ts
├── controllers
│ ├── goalsController.ts
│ ├── transactionController.ts
│ └── userController.ts
├── models
│ ├── Goal.ts
│ ├── Transaction.ts
│ └── User.ts
├── old
│ ├── Financial.ts
│ ├── Financials
│ │ ├── All_Transactions.ts
│ │ ├── Goals.ts
│ │ └── Transactions.ts
│ └── Users
│ ├── User.ts
│ └── Users.ts
├── routes
│ ├── goalRoutes.ts
│ ├── transactionRoutes.ts
│ └── userRoutes.ts
└── server.ts

## Folder & File Overview

#### app.ts 
- Initializes the Express application.
- Loads environment variables and connects to the MongoDB database.
- Applies middleware (e.g., express.json()) to parse incoming JSON requests.
- Mounts all route handlers (/api/users, /api/users/:userId/goals, and /api/transactions).
- Exports the configured app for use in server.ts.

#### config/db.ts
- Contains MongoDB connection logic using Mongoose.
- Reads the connection URI from environment variables.

#### controllers/
- Contains business logic for handling requests and interacting with the database.
- userController.ts: Handles user signup and login with password hashing and JWT token generation.
- goalsController.ts: CRUD operations for user goals.
- transactionController.ts: CRUD operations for user transactions.

#### models/
- Defines Mongoose schemas and models.
- User.ts: User schema with embedded arrays of Goals and Transactions.
- Goal.ts: Goal schema.
- Transaction.ts: Transaction schema.

#### routes/
- Defines Express routers and maps HTTP methods to controller functions.
- userRoutes.ts: Routes for user authentication (/signup, /login).
- goalRoutes.ts: Routes for goal management (/:userId/goals and specific goal operations).
- transactionRoutes.ts: Routes for transactions management (/api/transactions).


#### server.ts
- Imports the app from app.ts.
- Reads the port from the environment or defaults to 5000.
- Starts the Express server and listens on the specified port.
- Responsible only for bootstrapping the server — keeps startup logic clean and separate from app configuration.
  
#### old/
Contains legacy or deprecated code files.

_________________________________________________________________________
*** Plaid ***
1. Initialize the Plaid Client
    You need to configure a client that connects to Plaid’s environment (sandbox, development, or production) using your Client ID and Secret. This client will be used across your backend to call Plaid APIs.

2. Create a Link Token (POST /create_link_token)
    This endpoint is used to:
        - Generate a link token that your frontend can use to open the Plaid Link UI.
        - This method requires identifying a user (e.g. using their ID) and specifying products like "transactions".

    The link token is short-lived, and it’s passed to the frontend where Plaid's UI is shown to the user.

3. Exchange the Public Token (POST /exchange_public_token)
    Once a user finishes the Plaid flow on the frontend, you'll get a public token.

    Need this route to:
        Exchange the public token for a permanent access token and an item ID (both are secrets and must be securely stored).

        The access token is required for fetching account/transaction data later.

4. Fetch Transactions (POST /transactions)
method allows:
    Use the access token to pull real transaction data for the user.

    Have to specify a date range (e.g., last 30 days) and get detailed info like transaction names, amounts, and categories.

    This step helps populate your database with the user’s banking activity.

1. Store Access Tokens
    Save the access_token securely in your database, associated with the correct user.

    This enables you to re-fetch updated transactions or account info later without asking the user to go through Plaid again.

*** Frontend ↔ Backend Flow Summary ***
   1. Frontend requests /create_link_token → receives link_token.

   2. Frontend initializes Plaid Link with link_token.

   3. After success, frontend sends public_token to backend via /exchange_public_token.

   4. Backend exchanges it for access_token, stores it securely.

   5. Backend uses access_token to fetch transactions via /transactions.

_________________________________

Google Gemani 
- set up GCP Project in google cloud
  -  Enable Vertex AI API.
  -  create API key and store in .env file for project
         GEMINI_API_KEY=our_gemini_api_key
- npm install axios dotenv (required plugin )
- add chat route/controllers/register route in app.ts

    Postmand test example:

    POST /api/chat
    {
    "message": "What is the weather like on Mars?"
    }

    expected response:
    {
    "reply": "On Mars, the weather is cold and dry..."
    }

    possible features:
    save previous responses in MongoDB per user (for repeated questions )


Gemini + Plaid Integration:

1. Create a Plaid developer
   1. Get your API keys: Client ID and secret
   2. store in .env 
        PLAID_CLIENT_ID=our_plaid_client_id
        PLAID_SECRET=our_plaid_secret
        PLAID_ENV=plaid_env_var_called_sandbox

2. create a Plaid service module to configure/initialize 
3. add routes/controllers/register route in app.ts 
4. FE Note:
    // Send to /api/chat 
    // will have to use Plaid access token to send requests 
    {
    message: "Did I spend more at restaurants or groceries?",
    access_token: "<PLAID_ACCESS_TOKEN>"
    }

    *** in this example we can see ***
    1. Request coming from the FE that to verify authentication to user's bank information 
    2. Banckend (w/ express and typescript)  fetches transaction data via Plaid SDK
    3. Gemani will analyze the queries and bank data context and then provide our AI based response to the question 

BUT Plaid is not a chat model! I will just allow us to securely fetch (with user permission):
- Acccount Balances
- Recent Transactions
- Spending categories
- Direct Deposit info
- Liabilitis such as loans and credit 
- Investment data 

How I see it being used in this application:
- User will link accounds using secure Plaid widget 
- we get the access_token in the backend for the user (store in MongoDB so it is secure and will allow us to call on it!)
- can utiilize (will need a little massaging) our /src/controllers/transactionController.ts to grab the user's financial data 
- Then feed that data to Gemini with said prompt to do all the evaluation and provide a intelligent response to user based on their question!!! 