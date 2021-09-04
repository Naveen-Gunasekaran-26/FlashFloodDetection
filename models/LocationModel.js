const mongoose = require('mongoose');


const locationSchema = new mongoose.Schema({
    locationName : String,
    sensorData : Object,
    subscribedNumbers : [String],
    lastTransmitted : Date
})



locationSchema.statics.updateLocationName = async function(object){
    
    const {oldLocationName, newLocationName} = object;
    const location = await this.findOne({locationName : oldLocationName});

    
    if(location){
        
        await this.findOneAndUpdate({
            locationName : oldLocationName
        },
        {
            locationName : newLocationName
        })
    }
    else
        console.log("Location " + oldLocationName + " doesn't exist");
}


locationSchema.statics.deleteLocationName = async function(object){

    const { locationName } = object;
    const locationExists = await this.findOne({locationName});

    if(locationExists){

        await this.deleteOne({locationName});
        console.log("Location " + locationName + " has been deleted");
    }
    else
        console.log("Location name : " + locationName ,"There is no such location or related data stored in the database");
}



const LocationModel = mongoose.model("LocationData", locationSchema, "LocationData");
module.exports = LocationModel;