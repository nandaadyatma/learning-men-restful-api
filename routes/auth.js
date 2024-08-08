const router = require('express').Router();
const bcrypt = require('bcrypt');
const { registerValidation, loginValidation} = require("../validation");
const User = require('../models/user');


// /register
router.post("/register", async(req, res) => {
        // NPM install joi

        // Validate user input
        const { error } = registerValidation(req.body)
        // const error = registerValidation(req.body).error

        if (error) {
            res.status(400).send({
                error: error.details[0].message
            })
        }

        
        // Check is the email already registered or not
        
        const emailExist = await User.findOne({ email: req.body.email});

        if (emailExist){
            res.status(400).json({ error: "Email already exist"})
        }

        // hash the password
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);

        // create user obj and save it  
        const userObject = new User(
            {
                name: req.body.name,
                email: req.body.email,
                password: password
            }
        );

        try {
            
            const savedUser = await userObject.save();
            res.json({ error: null, data: savedUser._id})

        } catch (error) {
            res.status(400).json({ error: error})
        }

})

// /login
router.post("/login", async(req, res) => {
    // validate user input
    const { error } = loginValidation(req.body)

    if (error) {
        res.status(400).json({
            error: error
        })
    }

    // if login valid, find user
    const user = await User.findOne({ email: req.body.email });

    // throw error if email does not exist
    if (!user) {
        res.status(400).json({ error: "User with email " + req.body.email + " is not found"})
    }

    // check password is true or not

    const validPassword = await bcrypt.compare(req.body.password, user.password)

    if (!validPassword) {
        res.status(400).json({ error: "Password is not valid"})
    }

    // create authentication token

    // attach auth token to header
})

module.exports = router