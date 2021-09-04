const User = require('../models/User');
const LocationModel = require('../models/LocationModel');
const jwt = require('jsonwebtoken');
let currentUser;
let availableLocations = [];


const handleErrors = (error) => {

    let errors = {
        username : "",
        email : "",
        phonenumber : "",
        password : "",
        password2 : ""
    };

    console.log("\n",error.message);

    if(error.message == "Passwords did not match"){
        errors.password2 = error.message;
    }

    if(error.message == "This number is not registered"){
        errors.phonenumber = error.message;
    }
    
    if(error.message == "Please enter a valid number"){
        errors.phonenumber = error.message;
    }

    if(error.message == "Incorrect password"){
        errors.password = error.message;
    }

    if(error.code === 11000){

        if(error.message.includes("email_1 dup key")){
            errors.email = "This email has already been registered";
        }
        
        if(error.message.includes("phonenumber_1 dup key")){
            errors.phonenumber = "This phonenumber has already been registered";
        }
    }

    if(error.message.includes("UserData validation failed")){
        // console.log("entered")
        Object.values(error.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    }

    return errors;
}


const MAX_AGE = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({id}, "GN26SECRET", {
        expiresIn : MAX_AGE
    });
}




module.exports.GET_INDEX = (req,res) => {
    res.render("index");
}


module.exports.GET_LOGIN = (req,res) => {
    res.render("login");
}


module.exports.GET_REGISTER = (req,res) => {
    res.render("register");
}


module.exports.GET_DASHBOARD = async (req,res) => {

    currentUser = res.locals.user.username;
    const location = await LocationModel.find({});
    availableLocations = location.map(location => location.locationName);
    res.locals.availableLocations = availableLocations;
    res.render("dashboard");

}


module.exports.GET_LOGOUT = (req,res) => {
    
    res.cookie("jwt", "", { maxAge : 0 });
    res.redirect("/index");
}


module.exports.POST_REGISTER = async (req,res) => {
    
    const {username, email, phonenumber, password, password2} = req.body;
    
    try{
        
        if(password !== password2)
            throw Error("Passwords did not match");

        const user = await User.create({username, email, phonenumber, password});
        const token = createToken(user._id);
        console.log("\nNew user has been created successfully", user.username);
        res.cookie("jwt", token, { httpOnly : true, maxAge : MAX_AGE * 1000 });
        res.status(200).json({user});
    }
    catch(error){

        console.log("Error catched in POST_REGISTER");
        const errors = handleErrors(error);
        res.status(400).json({errors});
    }
}

module.exports.POST_LOGIN = async (req,res) => {
    
    const {phonenumber, password} = req.body;
    
    try{
        
        if(phonenumber == "")
            throw new Error("Please enter a valid number");

        const user = await User.login(phonenumber, password);
        const token = createToken(user._id);
        console.log(`\nUser ${user.username} has logged in`);
        res.cookie("jwt", token, { httpOnly : true, maxAge : MAX_AGE * 1000 });
        res.status(200).json({user});
    }
    catch(error){

        console.log("Error catched in POST_LOGIN");
        const errors = handleErrors(error);
        res.status(400).json({errors});
    }
}


module.exports.POST_SELECT_LOCATIONS = async (req,res) => {

    const { currentUserNumber, locationsChecked } = req.body;

    try{

        const user = await User.updateUserLocations(currentUserNumber, locationsChecked);
        if(!user)
            console.log("Something went wrong in updating locations ---> in POST_SELECT_LOCATIONS");
        
        availableLocations.forEach(async location => {
            let locationData = await LocationModel.findOne({locationName : location}, (error) => {
                if(error) throw error;
            });
            let subscribedNumbers = locationData.subscribedNumbers;
    
            if(locationsChecked.includes(location)){

                if(!subscribedNumbers.includes(currentUserNumber))
                    subscribedNumbers.push(currentUserNumber);

                await LocationModel.findOneAndUpdate({locationName : location},{
                    subscribedNumbers : subscribedNumbers
                })

            }
            else{
                
                if(subscribedNumbers.includes(currentUserNumber)){
                    subscribedNumbers = subscribedNumbers.filter(number => {return number != currentUserNumber});
                }
                
                await LocationModel.findOneAndUpdate({locationName : location},{
                    subscribedNumbers
                },
                {
                    upsert : true
                })
            }
        })
        
        res.status(200).json({user});

    }
    catch(error){

        console.log("Error catched in POST_SELECT_LOCATIONS", error);
        res.status(400).json({error});

    }
}

module.exports.CURRENT_USER = currentUser;