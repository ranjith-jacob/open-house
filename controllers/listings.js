// controllers/listings.js

const express = require('express');
const router = express.Router();

const Listing = require('../models/listing'); // is this supposed to be listing itself instead of listing.js?

// get all the listings
router.get("/", async (req, res) => { // changed "/listings" to "/"
    try {
        const getAllListings = await Listing.find({}).populate("owner"); // changed const allListings to const getAllListings to stay consistent with class codealong
        console.log("all of the listings", getAllListings); // changed allListings to const getAllListings to stay consistent with class codealong
        // res.send("Listings index page");
        res.render("./listings/index.ejs", {
            listings: getAllListings,
        }); // completes Listings Landing pg
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

router.get("/new", async (req, res) => {
    // res.send("hello I'm about");
    res.render("listings/new.ejs");
})

// create a new listing
// cannot post listings
// POST /listings
router.post("/", async (req, res) => {
    // console.log("Who is the user", req.session.user._id);
    req.body.owner = req.session.user._id; // assign signed in user to listing as owner
    // console.log("Form data received", req.body);
    await Listing.create(req.body);
    res.redirect("/listings");
})

// get a specific listing
router.get('/:listingId', async (req, res) => {
  try {
    const populatedListing = await Listing.findById(
      req.params.listingId
    ).populate('owner');
    res.render('listings/show.ejs', {
      listing: populatedListing,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
})

// DELETE /listing/:listingId
router.delete('/:listingId', async (req, res) => {
  try {
    // console.log('listingID', req.params.listingId);
    // locate listing in the db
    const listing = await Listing.findById(req.params.listingId);
    if (listing.owner.equals(req.session.user._id)) {
      console.log('permission granted')
      await listing.deleteOne();
      res.redirect('/listings');
    } else {
      res.send('You do not have the permission to delete this listing');
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
})

// edit the listing form
router.get('/:listingId/edit', async (req, res) => {
  try {
    const currentListing = await Listing.findById(req.params.listingId);
    res.render('listings/edit.ejs', {
      listing: currentListing,
    })
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
})

// update the listing 
router.put('/:listingId', async (req, res) => {
  try {
    const currentListing = await Listing.findById(req.params.listingId);
    if (currentListing.owner.equals(req.session.user._id)) {
      await currentListing.updateOne(req.body);
      res.redirect('/listings');
    } else {
      res.send('You do not have edit permissions');
    }
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
})

module.exports = router;
