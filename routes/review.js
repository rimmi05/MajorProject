const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Reviews = require("../models/reviews.js");
const reviewController = require("../controllers/reviews.js");
const { isLoggedIn } = require("../middleware.js");

//Post Route
router.post("/",isLoggedIn, reviewController.createReview);
//Delete Route
// Delete Review Route
router.delete("/:reviewId", reviewController.destroyReview);

module.exports = router;