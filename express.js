const express=require('express');
const app=express();

app.use(express.static(__dirname + '/public'));
app.set('views',__dirname + '/views');
app.set('view engine','ejs');

app.get('/index',function(req,res){
    res.render('index');
});
app.get('/login',function(req,res){
    res.render('login');
})
app.get('/register',function(req,res){
    res.render('register');
})
app.get('/insApply',function(req,res){
    res.render('insApply');
})

app.listen(3000);