const router = require('express').Router();
const bcrypt = require('bcrypt');
const { registerValidation, loginValidation} = require("../validation");
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// /register
router.post("/register", async(req, res) => {
        // NPM install joi

        // Validate user input
        const { error } = registerValidation(req.body)
        // const error = registerValidation(req.body).error

        if (error) {
            // early return berfungsi untuk memastikan eksekusi respons sekali saja, karena dikeluarkan dengan return
            return res.status(400).send({
                error: error.details[0].message
            })
        }

        
        // Check is the email already registered or not
        
        const emailExist = await User.findOne({ email: req.body.email});

        if (emailExist){
            return res.status(400).json({ error: "Email already exist"})
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
            return res.json({ error: null, data: savedUser._id})

        } catch (error) {
            return res.status(400).json({ error: error})
        }

})

// /login
router.post("/login", async(req, res) => {
    // validate user input
    const { error } = loginValidation(req.body)

    if (error) {
        return res.status(400).json({
            error: error
        })
    }

    // if login valid, find user
    const user = await User.findOne({ email: req.body.email });

    // throw error if email does not exist
    if (!user) {
        return res.status(400).json({ error: "User with email " + req.body.email + " is not found"})
    }

    // check password is true or not

    const validPassword = await bcrypt.compare(req.body.password, user.password)

    if (!validPassword) {
        return res.status(400).json({ error: "Password is not valid"})
    }

    // create authentication token

    const token = jwt.sign(
        // payload
        {
            name: user.name,
            id: user._id
        },
        // TOKEN_SECRET
        process.env.TOKEN_SECRET,

        // EXPIRATION TIME
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        },
    );

    // attach auth token to header
    return res.header("auth-token", token).json(
        {
            error: null,
            data: { token }
        });

})

module.exports = router