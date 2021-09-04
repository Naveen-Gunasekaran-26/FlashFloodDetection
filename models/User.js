const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({

    username : {
        type : String,
        required : [true, "Please enter a username"]
    },

    email : {
        type : String,
        required : [true, "Please enter a email"],
        validate : [validator.isEmail, "Please enter a valid email"],
        unique : [true, "This email already exists"]
    },

    phonenumber : {
        type : String,
        required : [true, "Please enter a phone number"],
        validate : [validator.isMobilePhone, "Please enter a valid phone number"],
        unique : [true, "This phone number already exists"]
    },

    password : {
        type : String,
        required : [true, "Please enter a password"],
        minLength : [6, "Password should be atleast of 6 characters"]
    },

    locations : [String]
    
});


UserSchema.statics.login = async function(phonenumber, password){

    const user = await this.findOne({phonenumber});
    
    if(user){

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(isPasswordCorrect){
            return user;
        }
        else
            throw Error("Incorrect password");
    }
    else
        throw Error("This number is not registered");
}


UserSchema.statics.updateUserLocations = async function(currentUserNumber, locationsChecked){

    const user = await this.findOne({phonenumber : currentUserNumber});

    if(user){
        await this.findOneAndUpdate({
            phonenumber : currentUserNumber
        },
        {
            locations : locationsChecked
        },
        (error)=>{
            if(error)
                console.log("Error in updateUserLocations() in User.js", error);
        })
    }
    else{
        console.log(`There is no such user with this number ${currentUserNumber}`);
    }
    
    return user;
}


UserSchema.pre("save", async function(next){
    
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});



const User = mongoose.model('UserData',UserSchema, "UserData");
module.exports = User;