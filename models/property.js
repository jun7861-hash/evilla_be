const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const propertySchema = new Schema(
  {
    propertyId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
      sparse: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Array,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    gallery: {
      type: Array,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    condition: {
      type: Array,
      required: true,
    },
    amenities: {
      type: Array,
      required: true,
    },
    video: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    agreeToTerms: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model("Property", propertySchema);
module.exports = Property;
