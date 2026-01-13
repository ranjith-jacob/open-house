// controllers/listings.js

const express = require('express');
const router = express.Router();

const Listing = require('../models/listing.js');

router.get("/", async (req, res) => { // changed "/listings" to "/"
    try {const allListings = await Listing.find();
    console.log("all of the listings", allListings);
    // res.send("Listings index page");
    res.render("./listings/index.ejs"); // completes Listings Landing pg
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;
