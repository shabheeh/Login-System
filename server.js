const express = require('express');
const app = express();
const path = require('path');
const bodyparser = require('body-parser');
const session = require('express-session');
const { v4: uuidv4 } = require('uuid');
const nocache = require('nocache');
require('dotenv').config()

app.use(nocache());




const port = process.env.PORT || 3000;

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// set view engine 
app.set('view engine', 'ejs');


 

// load static assets
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: false
}));

// Import and use router
const router = require('./router');
app.use('/route', router);



// home route
app.get('/', (req, res) => {
    if (!req.session.user) {
        console.log(req.session);
        res.render('base', { title: "Login System", error: null });
    } else {
        res.redirect('/route/dashboard');
    }
}); 

app.listen(port, () => {
    console.log(`Listening to the server on http://localhost:${port}`);
});
