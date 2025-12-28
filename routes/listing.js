const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");


const listingController = require("../controllers/listing.js");
const { isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index and Create Routes
router
  .route("/")
  .get(wrapAsync(listingController.index)) // Show all listings
  .post(
    isLoggedIn,
    upload.single("image"),
    validateListing,
    wrapAsync(listingController.createListing) // Create new listing
  );

// New Route - render form to create listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show, Update, Delete Routes
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) // Show single listing
  .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing) // Update listing
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing) // Delete listing
  );

// Edit Route - render edit form
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
