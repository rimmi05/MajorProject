const mongoose = require("mongoose");
const Schema = mongoose.Schema; //to not write M.s again & again

const listingSchema = new Schema({
    title: {
       type: String,
       require: true,
    },
    description: String,
    image: {
      url: String,
      filename: String,
    },
    //image: {
    //filename: {
    //type: String,
    //default: "listingimage"
 // },
 // url: {
   // type: String,
   // default: "https://unsplash.com/photos/a-small-pond-in-the-middle-of-a-grassy-field-5qQcxcXMInQ",
   // set: (v) => v === "" ? "https://unsplash.com/photos/a-small-pond-in-the-middle-of-a-grassy-field-5qQcxcXMInQ" : v
//  }

    price: Number,
    location: String,
    country: String,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Reviews",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
});
const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;