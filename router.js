// Import express
const express = require('express');
// Create a router object
const router = express.Router();

// default credentials for authentication
const users = [
    { email: process.env.USER1_EMAIL, password: process.env.USER1_PASS },
    { email: process.env.USER2_EMAIL, password: process.env.USER2_PASS }
];




// check if the user is authenticated (middleware)
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next(); // Proceed to the next route handler
    } else {
        res.redirect('/route/login'); 
    }
};

const isAdminin = (req, res, next) => {
    
    const adm = req.body.email; 
    const eml = "admin@gmail.com";
    console.log(adm);
    if(adm === eml){
        console.log("admin")
        
    }else{
        console.log("not admin")
    }
    next();
}
 
// POST request to '/login'
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(process.env.USER2_EMAIL)
    // Check if provided credentials match any user in the users array
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        // If credentials match, set user session and redirect to dashboard
        req.session.user = user.email;
        console.log(req.session);
        res.redirect('/route/dashboard');
    } else {
        // If credentials don't match, render the login page with an error message
        res.render('base', { title: "Login System", error: 'Invalid username or password' });
    }
});

//  GET request to '/login'
router.get('/login', (req, res) => {
    // Render the login page
    // res.render('base', { title: "Login System" });
    res.redirect('/');
});

// GET request to '/dashboard'
router.get('/dashboard', isAuthenticated, isAdminin, (req, res) => {
    // Render the dashboard page if the user is authenticated
    res.render('dashboard', { user: req.session.user });
});

// GET request to '/logout'
router.get('/logout', (req, res) => {
    // Destroy the session wwhen the user logs out
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
            res.send('Error');
        } else {
            res.redirect('/');
        }
    });
});

// Export the router
module.exports = router;
