const express = require('express');
const router = express.Router();
const config = require('config');
const { check, validationResult } = require('express-validator');

const auth = require('../middleware/auth');
const Profile = require('../models/Profile');
const User = require('../models/User');

// @route GET api/profile/me
// @desc Get current user's profile
// @access Private
router.get('/', auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate(
            'user',
            ['name', 'avatar']
        );

        if(!profile){
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route POST api/profile
// @desc Create or Update Profile
// @access Private
router.post('/',
    [
        auth,
        [

        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            city,
            classroom,
            year,
            college,
            bio,
            youtube,
            twitter,
            facebook,
            linkedin,
            instagram,
            github
        } = req.body;

        // Create Profile Object
        const profileFields = {};
        profileFields.user = req.user.id;
        if(city) profileFields.city = city;
        if(classroom) profileFields.classroom = classroom;
        if(year) profileFields.year = year;
        if(college) profileFields.college = college;
        if(bio) profileFields.bio = bio;

        // Create Social Object
        profileFields.social = {};
        if(youtube) profileFields.social.youtube = youtube;
        if(twitter) profileFields.social.twitter = twitter;
        if(facebook) profileFields.social.facebook = facebook;
        if(linkedin) profileFields.social.linkedin = linkedin;
        if(instagram) profileFields.social.instagram = instagram;
        if(github) profileFields.social.github = github;

        try {
            // Upsert option creates new Doc if no match is found !!
            let profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new: true, upsert: true}
            );
            res.json(profile);
        } catch(err){
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });


// @route GET api/profile
// @desc Get all profiles
// @access Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
});

// @route GET api/profile/user/:user_id
// @desc Get profile by user_id
// @access Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])

        if (!profile) return res.status(400).json({ msg: "There is no prfile" })
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: "There is no prfile" })
        }
        res.status(500).send('Server Error')
    }
});

// @route DELETE api/profile
// @desc Delete profile user & posts
// @access Private
router.delete('/', auth, async (req, res) => {
    try {
        // Remove Profile
        await Profile.findOneAndRemove({ user: req.user.id })
        // Remove user
        await User.findOneAndRemove({ _id: req.user.id })
        res.json({ msg: "User deleted." })
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
});

module.exports = router;