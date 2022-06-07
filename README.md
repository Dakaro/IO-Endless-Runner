
# Coin Hunter

An endless runner game focused on collecting coins, which can later be exchanged for items in the shop.


## Tech Stack

* Node.js
* Express
* Mongoose
* Passport


## Run Locally

To run this project install:
* **Node.js** from https://nodejs.org/en/download/  
* **MongoDB** from https://www.mongodb.com/try/download/community

Clone the project

```bash
  git clone https://github.com/araignee19/IO-Endless-Runner.git
```

Create a `.env` file in the main directory containing the following variables
* `DATABASE_URL=[connection link to database]`, e.g. `DATABASE_URL=mongodb://localhost/DB_NAME`
* `SESSION_SECRET` - express session secret
* `EMAIL_ADDRESS`- email address used for sending and receiving error messages (nodemailer module)
* `EMAIL_ACCOUNT_PASSWORD` - password for the email account

Go to the project directory

```bash
  cd IO-Endless-Runner
```

Install dependencies

```bash
  npm install
```

Set up the package file

```bash
  npm init
```

Start the server

```bash
  npm run start
```

In your browser open `http://localhost:3000`
