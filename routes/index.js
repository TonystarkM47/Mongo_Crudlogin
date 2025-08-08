var express = require('express');
var router = express.Router();
var user_info = require('../Models/User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/signup', function(req, res, next){
  res.render('signup');
});
router.post('/signup', function(req, res, next){
  if(!req.files || !req.files.Upload){
    return res.status(500).send("No File Was Uploaded");
  }

  let uploadedFile = req.files.Upload;
  let uploadPath = './public/Upload/' + uploadedFile.name;

  let signup = new user_info({
    user_name: req.body.txt1,
    user_dob: req.body.txt2,
    user_gender: req.body.txt3,
    user_mobile: req.body.txt4,
    user_email: req.body.txt5,
    user_password: req.body.txt6,
    user_isadmin: req.body.txt7,
    user_image: uploadedFile.name,
  });

  signup.save()
  .then(data => {
    uploadedFile.mv(uploadPath, function(err){
      if(err){
        console.log('Error In Uploading Image:- ' + err);
        return res.status(500).send(err);
      }
      res.redirect('/display');
    });
  })
  .catch(err => console.log('Error in Inserting Data:- ' + err));
});
router.get('/display', function(req, res, next){
  user_info.find()
  .then(function(db_user_array){
    res.render('display', {user_array : db_user_array})
  })
  .catch(err => console.log('Error in Display' + err))
});
router.get('/delete/:id', function(req, res, next){
  console.log(req.params.id)
  user_info.findByIdAndDelete(req.params.id)
  .then(() => {
    res.redirect('/display')
  })
  .catch(err => console.log("Error In Delete" + err));
});
router.get('/show/:id', function(req, res){
  console.log(req.params.id)
  user_info.findById(req.params.id)
  .then(function(db_user_array){
    res.render('single-record', {user_array : db_user_array})
  })
  .catch(err => console.log("Error in Showw" + err))
});
router.get('/login', function(req, res, next){
  res.render('login')
});
router.post('/login', function(req, res, next){
  console.log(req.body);
  var email = req.body.txt5;
  var password = req.body.txt6;
  user_info.findOne({"user_email":email})
  .then(function(db_user_array){
    console.log("Find One:- " + db_user_array);
    if(db_user_array){
      var db_email = db_user_array.user_email;
      var db_password = db_user_array.user_password;
    }

    console.log("db_user_array.user_email" + db_email);
    console.log("db_user_array.user_password" + db_password);
    if(db_email == null){
      console.log("If")
      res.end("Email Not Found")
    } else if(db_email == email && db_password == password){
      req.session.email = db_email;
      res.redirect('/home');
    } else {
      console.log("Credentials Wrong");
      res.end("Login Invalid");
    }
  });
});
router.get('/home', function(req, res, next){
  console.log("Home Called " + req.session.email);
  var myemail = req.session.email;
  console.log(myemail);
  if(!req.session.email){
    console.log("Email Session Is Set:- ");
    res.end("Login Required To Access This Page");
  } 
  res.render('home', {myemail : myemail});
});
router.get('/change-password', function(req, res, next){
  if(!req.session.email){
    console.log("Email Session Is Set:- ");
    res.redirect('/login')
  }
  res.render('change-password')
});
router.post('/change-password', function(req, res, next){
  if(!req.session.email){
    console.log("Email Session Is Set:- ");
    res.redirect('/login')
  }
  console.log("Home Called " + req.session.email);
  var myemail = req.session.email;
  var opass = req.body.opass;
  var npass = req.body.npass;
  var cpass = req.body.cpass;
  user_info.findOne({"user_email":myemail})
  .then(function(db_user_array){
    console.log(db_user_array);
    if(opass == db_user_array.user_password){
      if(opass == npass){
        res.send("New Password Must be Different then Old password");
      } else if(npass == cpass){
        user_info.findOneAndUpdate({"user_email" : myemail}, {$set:{"user_password" : npass}})
        .then(function(){
          res.send("Password Changed")
        });
      } else {
        res.send("New Password and Confirm Password not match");
      }
    } else {
      res.send("Old Password Not Match")
    }
  });
});
router.get('/logout', function(req, res, next){
  req.session.destroy()
  res.redirect('/login')
});
router.get('/forgot-password', function(req, res, next){
  res.render('forgot-password')
});
router.post('/forgot-password', function(req, res, next){
  var email = req.body.user_email;
  console.log(req.body);
  user_info.findOne({"user_email": email}, function(err, db_user_array){
    console.log("Find One" + db_user_array);

    if(db_user_array){
      var db_email = db_user_array.user_email;
      var db_password = db_user_array.user_password;
    }

    console.log("db_user_array.user_email" + db_email);
    console.log("db_user_array.user_password" + db_password);

    if(db_email == null){
      console.log("If")
      res.end("Email Not Found");
    } else if(db_email == email){
      // Pate Nodemailer Code
     const nodemailer = require("nodemailer");

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "harshprajapati4258@gmail.com",
    pass: "oypu nioo bdre dzts",
  },
});

// Wrap in an async IIFE so we can use await.
(async () => {
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch" <harshprajapati4258@gmail.com>',
    to: "kirtanthakkar1202@gmail.com",
    subject: "Hello ✔",
    text: "pass:- 1234", // plain‑text body
    html: "<b>Hello world?</b>", // HTML body
  });

  console.log("Message sent:", info.messageId);
})();
      }
    });
  });
module.exports = router;
console.log('http://127.0.0.1:3000');