const express = require('express');
const exphbs  = require('express-handlebars');

const app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

//default route  
app.get('/', function(req, res){
    res.render('index');
});

app.post('/settings ', function(req, res){
 
});

app.get('/action ', function(req, res){

});

app.get('/action/:type ', function(req, res){

});

app.post('/actions ', function(req, res){

});

const PORT = process.env.PORT || 3011;

app.listen(PORT, function (){
    console.log("App started at port:", PORT)
});