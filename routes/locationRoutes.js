const router = require("express").Router();
const locationController = require("../controllers/locationController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/locations/:id", authMiddleware.isAuthorized, locationController.GET_LOCATION);

module.exports = router;