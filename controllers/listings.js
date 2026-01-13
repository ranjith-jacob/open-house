// controllers/listings.js

const express = require('express');
const router = express.Router();

const Listing = require('../models/listing.js');

app.get("/listings", async (req, res) => {
    const allListings = await Listing.find();
    console.log("all of the listings", allListings); // not working yet
    // res.send("“Listings index page”");
});

module.exports = router;
