const express = require('express');
const request = require("request");
const app = express();

//database 연결 설정
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    user: "team4",
    password: "team4",
    database: "team4",
  });
connection.connect();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.get('/index', function(req, res){
    res.render('index');
});
app.get('/login', function(req, res){
    res.render('login');
});
app.get('/register', function(req, res){
    res.render('register');
});

app.post('/register', function(req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var bank = req.body.bank;
    var account = req.body.account;

    var userInsertSql = "INSERT INTO user (`username`, `email`, `password`, `bank`, `account`) VALUES (?, ?, ?, ?, ?);"

    connection.query(userInsertSql, [username, email, password, bank, account], function (error, results, fields) {
        if (error) throw error;
        else {
            res.json(1);
        }
      });

    console.log(req.body);
})

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
              if(password == storedPassword) {
                //로그인 성공
                res.json(1);
                console.log("로그인 성공");
              }
              else {
                //로그인 실패
                res.json(2);
              }
          }
        }
     });
});

app.listen(3000);