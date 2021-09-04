const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');


const authRouter = express.Router();



authRouter.get("/", authMiddleware.isAuthorized, authController.GET_DASHBOARD);
authRouter.get("/index",authController.GET_INDEX);
authRouter.get("/login",authController.GET_LOGIN);
authRouter.get("/register", authController.GET_REGISTER);
authRouter.get("/logout",authController.GET_LOGOUT);
authRouter.get("/dashboard", authMiddleware.isAuthorized, authController.GET_DASHBOARD);



authRouter.post("/login",authController.POST_LOGIN);
authRouter.post("/register",authController.POST_REGISTER);
authRouter.post("/selectLocations", authMiddleware.isAuthorized, authController.POST_SELECT_LOCATIONS);



module.exports = authRouter;