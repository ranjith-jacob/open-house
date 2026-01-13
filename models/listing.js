// models/listing.js

const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');

const listingSchema = new mongoose.Schema({
streetAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  size: {
    type: Number,
    required: true,
    min: 0,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
module.exports = router;
