const Listing = require("./models/listing");
const { listingSchema } = require("./schemas"); 
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) { // checks if user is logged in or not
        req.session.redirectUrl = req.originalUrl; // save original URL
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; 
        delete req.session.redirectUrl; // clear it after using
    } else { //Condition if we are doing login from listing page
        res.locals.redirectUrl = "/listings"; // 👈 fallback
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "Only Owner of Listing can Edit & Delete");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body.listing); // 👈 remove .listing
    if (error) {
        const msg = error.details.map(el => el.message).join(",");
        req.flash("error", msg);
        return res.redirect("/listings/new");
    }
    next();
};
