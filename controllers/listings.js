// controllers/listings.js

const express = require('express');
const router = express.Router();

const Listing = require('../models/listing.js');

// get all the listings
router.get("/", async (req, res) => { // changed "/listings" to "/"
    try {const getAllListings = await Listing.find({}).populate("owner"); // changed const allListings to const getAllListings to stay consistent with class codealong
    console.log("all of the listings", getAllListings); // changed allListings to const getAllListings to stay consistent with class codealong
    // res.send("Listings index page");
    res.render("./listings/index.ejs"); // completes Listings Landing pg
    } catch (error) {
        console.log(error);
    }
});

router.get("/new", async (req, res) => {
    // res.send("hello I'm about");
    res.render("listings/new.ejs");
})

router.post("/", async (req, res) => {
    // console.log("Who is the user", req.session.user._id);
    req.body.owner = req.session.user._id; // assign signed in user to listing as owner
    // console.log("Form data received", req.body);
    await Listing.create(req.body);
    res.redirect("/listings");
})
module.exports = router;
