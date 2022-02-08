const router = require("express").Router();
const { v4: uuidv4 } = require("uuid");
const verify = require("../user/verifyToken");
const Property = require("../../models/property");
const { propertyValidation } = require("./validation");

/* get all properties */
router.get("/property", verify, async (req, res) => {
  const match = {};
  const sort = {};

  /* sample filter */
  // if (req.query.role) {
  //   match.role = req.query.role === "1";
  // }

  /* sample sort by and order by */
  // if (req.query.sortby && req.query.orderby) {
  //   sort[req.query.sortby] = req.query.orderby === "desc" ? -1 : 1;
  // }

  try {
    const { page, limit } = req.query;

    const data = await Property.find()
      .limit(parseInt(limit) * 1)
      .skip((parseInt(page) - 1) * limit)
      .populate({
        path: "property",
        match,
        options: {
          sort,
        },
      })
      .exec();
    res.status(200).json({
      status: "success",
      name: "getAllProperties",
      method: "get",
      message: "Fetch successfully!",
      params: {
        name: "String",
        price: "Array",
        address: "String",
        type: "Array",
        gallery: "Array",
        tags: "Array",
        description: "String",
        condition: "Array",
        amenities: "Array",
        video: "String",
        location: "String",
      },
      data: data,
      total: data.length,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      name: "getAllProperties",
      method: "get",
      message: "Fetch failed",
      params: {
        name: "String",
        price: "Array",
        address: "String",
        type: "Array",
        gallery: "Array",
        tags: "Array",
        description: "String",
        condition: "Array",
        amenities: "Array",
        video: "String",
        location: "String",
      },
      error,
    });
  }
});

/* get property by propertyId */
router.get("/property/:propertyId", verify, async (req, res) => {
  try {
    const data = await User.findOne(req.params);
    res.status(200).json({
      status: "success",
      name: "getPropertyById",
      method: "get",
      message: "Fetch successfully!",
      params: {
        id: "String",
      },
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      name: "getPropertyById",
      method: "get",
      message: "Fetch failed",
      params: {
        id: "String",
      },
      error,
    });
  }
});

/* add property */
router.post("/property", verify, async (req, res) => {
  const { error } = propertyValidation.validate(req.body);
  if (error) return res.status(400).send({ message: error.details[0].message });
  const newProperty = new Property({
    propertyId: `property_${uuidv4()}`,
    name: req.body.name,
    price: req.body.price,
    address: req.body.address,
    type: req.body.type,
    gallery: req.body.gallery,
    tags: req.body.tags,
    description: req.body.description,
    condition: req.body.condition,
    amenities: req.body.amenities,
    video: req.body.video,
    location: req.body.location,
    agreeToterms: req.body.agreeToterms,
  });

  try {
    if (!newProperty.agreeToTerms) {
      return res.status(200).send({ message: "You must agree to terms." });
    }
    const addProperty = await newProperty.save();
    res.send(addProperty);
  } catch (err) {
    res.status(400).json({
      status: "failed",
      name: "addProperty",
      method: "post",
      message: "Add failed",
      params: {
        name: "String",
        price: "Array",
        address: "String",
        type: "Array",
        gallery: "Array",
        tags: "Array",
        description: "String",
        condition: "Array",
        amenities: "Array",
        video: "String",
        location: "String",
      },
      error,
    });
  }
});

module.exports = router;
