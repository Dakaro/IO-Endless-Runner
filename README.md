# IO-Endless-Runner
## to run this app locally on your own device:
  - download node.js
  - download mongoDB
  - run: npm init to set up npm package
  - in main folder create .env file, with global variables:
     - DATABASE_URL="here: database location (e.g. mongodb:http://localhost/DB_NAME)"
     - SESSION_SECRET="here: express-session secret key"
     - EMAIL_ADDRESS="here: email address used for sendig and receiving error messages (nodeamailer module)"
     - EMAIL_ACCOUNT_PASSWORD="here: email address password"
  - run: npm run devStart
  - open http://localhost:3000/ in your browser
