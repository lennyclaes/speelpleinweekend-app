const express = require('express');
const ejs  = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

let userData = fs.readFileSync('./userData.json');

userData = JSON.parse(userData);

let app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'tomberg21a',
    saveUninitialized: false,
    resave: false
}));


// Defining routes
app.get('/', (req, res) => {

    let user = {
        "_id": null,
        "name": "Anonymous",
        "character": "Unknown",
        "costume": "Unknown",
        "description": "Unknown"
    }

    if(req.session.user) {
        user = req.session.user
    }

    res.render('index.ejs', {
        "title": "Speelpleinweekend 3018",
        "user": user,
        "logged_in": req.session.loggedIn
    });
});

app.get('/uitnodiging', (req, res) => {

    let user = {
        "_id": null,
        "name": "Anonymous",
        "character": "Unknown",
        "costume": "Unknown",
        "description": "Unknown"
    }

    if(req.session.user) {
        user = req.session.user
    }

    res.render('uitnodiging.ejs', {
        "title": "Speelpleinweekend 3018 - Uitnodiging",
        "user": user,
        "logged_in": req.session.loggedIn,
        "err": req.session.err
    })
});

app.get('/tips', (req, res) => {
    res.render('tips.ejs', {
        "logged_in": req.session.loggedIn,
        "title": "Speelpleinweekend 3018 - Tips"
    });
});

app.get('/opdrachten', (req, res) => {
    res.render('opdrachten.ejs', {
        "logged_in": req.session.loggedIn,
        "title": "Speelpleinweekend 3018 - Opdrachten"
    });
});

app.get('/user/login', (req, res) => {
    res.statusCode = 403;
    res.send("You shouldn't be here!");
});

app.post('/user/login', (req, res) => {
    let name = req.body.name;
    let pass = req.body.pass;

    if(name && pass) {  
        let uid = 0;

        while(uid < userData.users.length && name != userData.users[uid].f_name) {
            uid++;
        }

        if(pass == userData.users[uid].pass) {
            req.session.loggedIn = true;
            req.session.user = {
                "_id": uid,
                "name": name + " " + userData.users[uid].l_name,
                "character": userData.users[uid].character,
                "costume": userData.users[uid].costume,
                "description": userData.users[uid].description
            };
            res.redirect('/uitnodiging');
        } else {
            req.session.loggedIn = false;
            res.redirect('/uitnodiging');
        }
    } else {
        req.session.loggedIn = false;
        res.redirect('/uitnodiging');
    }
});

app.get('/user/logout', (req, res) => {
    if(req.session.loggedIn) {
        req.session.destroy();
    }
    res.redirect('/');
});


app.listen(3000, () => {
    console.log('server started at port 3000');
});