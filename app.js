// Import the necessary libraries
const nodemailer = require('nodemailer');
const express=require('express')
const http=require("http")
const path =require('path');
const { receiveMessageOnPort } = require('worker_threads');
bodyParser = require("body-parser")


const ejs = require('ejs');

//for sensitive info
require('dotenv').config({ path: 'info.env' });
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

const app = express();

const PORT=500

app.set("port",PORT)
app.use(express.json())


// Middleware to parse incoming request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Set the views directory to 'frontend'
app.set("views", path.join(__dirname, "frontend"));

// Set the view engine to EJS
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render('main'); // Assuming you have an index.ejs file in your 'frontend' directory
  });

// Create a mail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: emailUser, 
      pass: emailPass 
  },
//Custom options  , additional features offered by Nodemailer
//It provides the ability to have more fine-grained control over the Nodemailer library
  priority: 'high', // Set email priority to high
  disableFileAccess: true, // Disable file access
  disableUrlAccess: true, // Disable URL access
  tls: {
      rejectUnauthorized: false // Ignore untrusted TLS certificates
  }
});

// Handle routing of outgoing emails
app.post("/send_email",function(req, response) {
  var from = req.body.from;
  var to = req.body.recipient;
  var subject = req.body.subject;
  var message = req.body.message;

  // Render email template
  ejs.renderFile(path.join(__dirname, 'views', 'emailTemplate.ejs'), {
      from: from,
      to: to,
      subject: subject,
      message: message
  }, function(err, data) {
      if (err) {
          console.log('Error rendering template:', err);
          response.redirect("/");
      } else {
          // Set mail options
          var mailOptions = {
              from: from,
              to: to,
              subject: subject,
              html: data // HTML content rendered using ejs
          };

          // send email
          transporter.sendMail(mailOptions, function(error, info){
              if(error){
                  console.log(error);
              } else {
                  console.log("Email Send: " + info.response);
              }
              response.redirect("/");
          });
      }
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});