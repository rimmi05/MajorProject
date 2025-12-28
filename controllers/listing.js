const Listing = require("../models/listing");

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}; 

module.exports.renderNewForm = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({ 
        path: "reviews",
        populate: { path: "author"}
    })
    .populate("owner");
    console.log("Listing owner:", listing.owner ? listing.owner.username: "no owner");
    let isOwner = false;

  if (req.user && listing.owner) {
    isOwner = req.user._id.equals(listing.owner._id);
  }

  res.render("listings/show", { listing, currUser: req.user, isOwner });
};

module.exports.createListing = async (req, res, next) => {
    try {
        const { listing } = req.body; // destructure your nested form data
        const newListing = new Listing(listing);

        newListing.owner = req.user._id;

        // Only add image if a file was uploaded
        if (req.file) {
            newListing.image = {
                url: req.file.path,
                filename: req.file.filename,
            };
        } else if (listing.image && listing.image.url) {
            // If user entered an image URL
            newListing.image = {
                url: listing.image.url,
                filename: '', // no filename from upload
            };
        }

        await newListing.save();
        req.flash("success", "New Listing Created");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
};

module.exports.renderEditForm = async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
};

module.exports.updateListing = async (req,res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated!");
    res.redirect("/listings");
};

module.exports.destroyListing =  async (req,res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};