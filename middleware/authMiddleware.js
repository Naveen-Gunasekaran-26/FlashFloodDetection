const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAuthorized = (req,res,next) => {

    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, "GN26SECRET", async(error, decodedToken) => {

            if(error){

                console.log("Error in verifying token", error);
                res.locals.user = null;
                res.redirect("/login");
            }
            else{
                try{
                    const user = await User.findById(decodedToken.id);
                    // console.log("User Object : ", user);
                    res.locals.user = user;
                    res.locals.phoneNumber = user.phoneNumber;
                    next();
                }
                catch(error){
                    console.log(error.message);
                    if(error.message.includes("Cannot read property 'phoneNumber' of null")){
                        res.cookie("jwt", "", { maxAge : 0 });
                        res.redirect("/");
                    }
                }
            }
        })
    }
    else{

        res.locals.user = null;
        res.redirect("/index");
    }

}


module.exports = {
    isAuthorized
}