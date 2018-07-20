const express = require('express');
const ejs  = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

let userData = fs.readFileSync('./userData.json');
let tipData = fs.readFileSync('./tips.json');
let opdrachtData = fs.readFileSync('./opdrachten.json');

userData = JSON.parse(userData);
tipData = JSON.parse(tipData);
opdrachtData = JSON.parse(opdrachtData);

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

    res.render('tips.ejs', {
        "logged_in": req.session.loggedIn,
        "title": "Speelpleinweekend 3018 - Tips",
        "user": user,
        "tips": tipData.tips
    });
});

app.get('/opdrachten', (req, res) => {
    let user = {
        "_id": null,
        "name": "Anonymous",
        "character": "Unknown",
        "costume": "Unknown",
        "description": "Unknown",
        "is_admin": false
    }

    if(req.session.user) {
        user = req.session.user
    }

    res.render('opdrachten.ejs', {
        "logged_in": req.session.loggedIn,
        "title": "Speelpleinweekend 3018 - Opdrachten",
        "user": user,
        "opdrachten": opdrachtData
    });
});

app.get('/tips/create', (req, res) => {
    res.statusCode = 403;
    res.send("You shouldn't be here!");
});

app.post('/tips/create', (req, res) => {
    let tip = req.body.tip;

    if(tip) {
        tipData.tips.push({
            "_id": tipData.tips.length,
            "tip": tip
        });
        let dataToBeSaved = JSON.stringify(tipData);
        fs.writeFile('./tips.json', dataToBeSaved, (err) => {
            tipData = fs.readFileSync('./tips.json');
            tipData = JSON.parse(tipData);
            res.redirect('/admin/tips');
        });
    } else {
        res.redirect('/tips');
    }
});

app.get('/tips/delete/:id', (req, res) => {
    tipData.tips.splice(req.params.id, 1);
    let dataToBeSaved = JSON.stringify(tipData);
    fs.writeFile('./tips.json', dataToBeSaved, (err) => {
        tipData = fs.readFileSync('./tips.json');
        tipData = JSON.parse(tipData);
        res.redirect('/admin/tips');
    });
});

app.get('/admin', (req, res) => {
    let user = {
        "_id": null,
        "name": "Anonymous",
        "character": "Unknown",
        "costume": "Unknown",
        "description": "Unknown",
        "is_admin": false
    }

    if(req.session.user) {
        user = req.session.user;
        if(user.is_admin) {     
            res.render('admin.ejs', {
                "logged_in": req.session.logged_in,
                "title": "Admin page",
                "user": user,
                "list": ""
            });
        }
    } else {
        res.redirect('/');
    }
})

app.get('/admin/users', (req, res) => {
    let user = {
        "_id": null,
        "name": "Anonymous",
        "character": "Unknown",
        "costume": "Unknown",
        "description": "Unknown",
        "is_admin": false
    }

    if(req.session.user) {
        user = req.session.user;
        if(user.is_admin) {     
            res.render('admin.ejs', {
                "logged_in": req.session.logged_in,
                "title": "Admin page",
                "user": user,
                "list": "users",
                "userslist": userData.users
            });
        }
    } else {
        res.redirect('/');
    }
});

app.get('/admin/tips', (req, res) => {
    let user = {
        "_id": null,
        "name": "Anonymous",
        "character": "Unknown",
        "costume": "Unknown",
        "description": "Unknown",
        "is_admin": false
    }

    if(req.session.user) {
        user = req.session.user;
        if(user.is_admin) {     
            res.render('admin.ejs', {
                "logged_in": req.session.logged_in,
                "title": "Admin page",
                "user": user,
                "list": "tips",
                "tipslist": tipData.tips
            });
        }
    } else {
        res.redirect('/');
    }
});

app.get('/admin/opdrachten', (req, res) => {
    let user = {
        "_id": null,
        "name": "Anonymous",
        "character": "Unknown",
        "costume": "Unknown",
        "description": "Unknown",
        "is_admin": false
    }

    if(req.session.user) {
        user = req.session.user;
        if(user.is_admin) {     
            res.render('admin.ejs', {
                "title": "Admin page",
                "user": user,
                "logged_in": req.session.logged_in,
                "list": "opdrachten",
                "opdrachtenlist": opdrachtData.opdrachten
            });
        }
    } else {
        res.redirect('/');
    }
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
                "description": userData.users[uid].description,
                "is_admin": userData.users[uid].is_admin
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

app.post('/user/create', (req, res) => {
    let fName = req.body.f_name;
    let lName = req.body.l_name;
    let costume = req.body.costume;
    let character = req.body.character;
    let description = req.body.description;
    let pass = req.body.pass;
    
    userData.users.push({
        "_id": userData.users.length,
        "f_name": fName,
        "l_name": lName,
        "pass": pass,
        "character": character,
        "costume": costume,
        "description": description,
        "is_admin": false
    });
    let dataToBeSaved = JSON.stringify(userData);
    fs.writeFile('./userData.json', dataToBeSaved, (err) => {
        userData = fs.readFileSync('./userData.json');
        userData = JSON.parse(userData);
        res.redirect('/admin/users');
    });
});


app.listen(3000, () => {
    console.log('server started at port 3000');
});