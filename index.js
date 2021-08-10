const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const SettingsBill = require('./settings-bill');
const moment = require('moment');
const handlebarSetup = exphbs({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts',
    helpers: {
        'fixedTime': function () {
            return moment(this.timestamp).fromNow()
        }
    }
});


const app = express();
const settingsBill = SettingsBill();



app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//default route  
app.get('/', function (req, res) {
    if (settingsBill.hasReachedCriticalLevel()) {
        res.render('index', {
            settings: settingsBill.getSettings(),
            totals: settingsBill.totals(),
            color: "danger"

        });
    } else if (settingsBill.hasReachedWarningLevel()) {
        res.render('index', {
            settings: settingsBill.getSettings(),
            totals: settingsBill.totals(),
            color: "warning"

        });
    } else {
        res.render('index', {
            settings: settingsBill.getSettings(),
            totals: settingsBill.totals(),
        });
    }
    
});


app.post('/settings', function (req, res) {

    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    });


    res.redirect('/');
});

app.post('/action', function (req, res) {
    settingsBill.recordAction(req.body.actionType)
    res.redirect('/');
});

app.get('/actions', function (req, res) {
    res.render('actions', { actions: settingsBill.actions() });
});


app.get('/actions/:actionType', function (req, res) {
    const actionType = req.params.actionType;
    res.render('actions', { actions: settingsBill.actionsFor(actionType) });
});

app.post('/resetButton', function (req, res) {
    settingsBill.resetButton();
    res.redirect('/');
});



const PORT = process.env.PORT || 3012;

app.listen(PORT, function () {
    console.log("App started at port:", PORT)
});