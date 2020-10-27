const express=require('express');
const app=express();

const request = require("request");

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "dlthdus0518",
  database: "team4",
});

connection.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

app.set('views',__dirname + '/views');
app.set('view engine','ejs');

app.get('/index', function(req,res){
    res.render('index');
});
app.get('/login', function(req,res){
    res.render('login');
});
app.get('/register', function(req,res){
    res.render('register');
});

app.post('/signup', function(req, res) {
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
})

app.listen(3000);