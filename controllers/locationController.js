const LocationModel = require("../models/LocationModel");

module.exports.GET_LOCATION = (req, res) => {

    const locationName = req.params.id;
    res.render("location", {locationName});
}
