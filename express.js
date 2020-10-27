const express = require('express');
const request = require("request");
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
var jwt = require('jsonwebtoken');

var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "team4",
    password: "team4",
    database: "team4",
  });
connection.connect();

// localStorage.setItem('item1', '10');
// localStorage.setItem('item2', 'new item');
// localStorage.setItem('item3', '0.543534');

//sessionStorage.setItem("name", "null");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
//login session settings
app.use(cookieParser());
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}));

app.set('views', __dirname + '/views');
app.set('view engine','ejs');

app.get('/index', function(req,res){
  if(!req.session.login){
    req.session.login = false
    req.session.idx = -1
} else {
    console.log(req.session);
}
    res.render('index');
});

app.get('/login', function(req,res){
    //res.render('login');
    let session = req.session;

    res.render('login', {
        session : session
    });
});

app.get('/register', function(req,res){
    res.render('register');
});

app.get('/privacy', function(req, res) {
    res.render('privacy');
});

app.get('/selling', function(req, res) {
    res.render('selling');
});

app.post('/register', function(req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var bank = req.body.bank;
    var account = req.body.account;

    var userInsertSql = "INSERT INTO user (`username`, `email`, `password`, `bank`, `account`) VALUES (?, ?, ?, ?, ?);";

    connection.query(userInsertSql, [username, email, password, bank, account], function (error, results, fields) {
        if (error) throw error;
        else {
            res.json(1);
            res.render('index');
        }
    });
    console.log(req.body);
});

app.post('/login', function(req, res) {
    console.log(req.body);

    var email = req.body.email;
    var password = req.body.password;

    var userCheckSql = "SELECT * FROM user WHERE email=?"
    connection.query(userCheckSql, [email], function (error, results, fields) {
        if (error) throw error;
        else {
          if(results.length == 0) {
              console.log("아이디나 비밀번호가 틀렸습니다.");
              res.json(2);
          }
          else {
            var storedPassword = results[0].password;
            if(password == storedPassword){
              var tokenKey = "fintech1234!" // 토큰키 추가
              jwt.sign(
                {
                  userId: results[0].id,
                  userEmail: results[0].email,
                },
                tokenKey,
                {
                  expiresIn: "1d",
                  issuer: "fintech.admin",
                  subject: "user.login.info",
                },
                function (err, token) {
                  console.log("로그인 성공", token);
                  res.json(token);
                }
              );
            }
            else {
              //로그인 불가
              res.json(2);
            }
          }
        }
     });
});

app.listen(3000);