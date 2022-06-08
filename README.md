<p align="center">
<img src="https://github.com/araignee19/IO-Endless-Runner/blob/main/public/img/favicon.ico" width="20rem">
<img src="https://github.com/araignee19/IO-Endless-Runner/blob/main/public/img/favicon.ico" width="20rem">
<img src="https://github.com/araignee19/IO-Endless-Runner/blob/main/public/img/favicon.ico" width="20rem">
</p>

# Coin Hunter

An endless runner game focused on collecting coins, which can later be exchanged for items in the shop.  
Available at **https://io-coin-hunter.herokuapp.com/**


## Tech Stack

* Node.js
* Express
* Mongoose
* Passport
* Bcrypt
* Nodemailer


## Run Locally

To run this project install:
* **Node.js** from https://nodejs.org/en/download/  
* **MongoDB** (if you're using a local database) from https://www.mongodb.com/try/download/community   

You will need a MongoDB database, either a local or a cloud one. For guides on how to create one check the following links:  
https://www.mongodb.com/basics/create-database  
https://medium.com/create-a-clocking-in-system-on-react/creating-a-local-mongodb-database-and-insert-a-document-c6a4a2102a22


Clone the project

```bash
  git clone https://github.com/araignee19/IO-Endless-Runner.git
```

Create a `.env` file in the main directory containing the following variables
* `DATABASE_URL=[connection link to database]`, e.g. `DATABASE_URL=mongodb://localhost/DB_NAME`
* `SESSION_SECRET` - express session secret  

To be able to receive error messages through the form available on the website you need to have an email account you can link in the `.env` file. If you have one, add the following variables to the `.env` file:
* `EMAIL_ADDRESS`- email address used for sending and receiving error report messages (nodemailer module)
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
**Congratulations, you've finished setting up the project!**
