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

// get a specific listing; this is the show controller
router.get('/:listingId', async (req, res) => {
  try {
    const populatedListing = await Listing.findById(
      req.params.listingId
    ).populate('owner');
    const userHasFavourited = populatedListing.favouritedByUsers.some ((user) => {
        // console.log("user", user);
        // console.log("user type", typeof user);
        // console.log("session id", typeof req.session.user._id);
        // user.equals(req.session.user._id); // returns boolean

        // convert the user from objectID to a string value, then do a strict equality
        // user.toString.equals(req.session.user._id) //! this is wrong, to do myself
        return user == req.session.user._id;
    }); // some - array method that returns boolean
    // console.log("user has favourited", userHasFavourited);
    // console.log("user ID from session", req.session.user._id);
    // console.log("user ID from favourited listing", populatedListing.favouritedByUsers);
    res.render('listings/show.ejs', {
      listing: populatedListing,
      userHasFavourited: userHasFavourited,
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

// add a favourite to a listing
router.post("/:listingId/favourited-by/:userId", async (req, res) => {
    try {
        // console.log("userId:", req.params.userId);
        //findByIdAndUpdate - this will be used to find the listing and updaated the favouritedByUsers array; it'll take two arguments
        //$push - this is mongo's push operator
        // console.log("listingId:", req.params.listingId);
        await Listing.findByIdAndUpdate(req.params.listingId, {
            $push: {favouritedByUsers: req.params.userId},
        })
        res.redirect(`/listings/${req.params.listingId}`);
        // res.send(`request to favourite ${req.params.listingId}`);
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
})

module.exports = router;

// <favourited by> route: POST, /listings/:listingId/favourited-by/:userId
