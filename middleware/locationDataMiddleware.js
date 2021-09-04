const LocationModel = require('../models/LocationModel');
const User = require('../models/User');
const serialport = require('serialport');


const locationDataMiddleware = () => {
    

    let locationArray = [
        {
            locationName : "Trichy",
            subscribedNumbers : []
        },
        {
            locationName : "Coimbatore",
            subscribedNumbers : []
        },
        {
            locationName : "Bangalore",
            subscribedNumbers : []
        },
        {
            locationName : "Chennai",
            subscribedNumbers : []
        },
        {
            locationName : "Hyderabad",
            subscribedNumbers : []
        },
        {
            locationName : "Cochin",
            subscribedNumbers : []
        }
    ]

    locationArray.forEach(object => {
        LocationModel.findOneAndUpdate({
            locationName : object.locationName
        },
        {
            lastTransmitted : 0
        },
        {
            upsert : true
        },
        (error) => {
    
            if(error)
                console.log("Error in creating / updating data in cloud in locationDataMiddleware", error.message);
        })
    })
    

    const MCUSerialPort = new serialport("COM4",{
        baudRate : 9600
    }, (error) => {
        if(error)
            console.log("MCU Error in establishing COM port communication", error);
        else
            console.log("MCU Serial port connection established");
    })



    const MCUParser = new serialport.parsers.Readline();
    MCUSerialPort.pipe(MCUParser);

    MCUParser.on("data", (data) => {
        let sensorData;
        try{
            sensorData = JSON.parse(data);
        }
        catch(error){
            console.log(error.message);
        }
        let {flowRate, waterTemperature, distance, humidity, temperature} = sensorData;
        flowRate = flowRate || 0;
        waterTemperature = waterTemperature || 30;
        distance = distance || 50;
        humidity = humidity || 50;
        temperature = temperature || 30;

        locationArray.forEach((object,index) => {
            
            if(index == 0){

                let flow = flowRate;
                let water = waterTemperature;
                let dist = distance;
                let humi = humidity;
                let temp = temperature;
                flow = flow.toFixed(2);
                water = water.toFixed(2);
                dist = dist.toFixed(2);
                humi = humi.toFixed(2);
                temp = temp.toFixed(2);

                const newSensorData = {
                    flowRate : flow,
                    waterTemperature : water,
                    distance : dist,
                    humidity : humi,
                    temperature : temp
                };

                object.sensorData = newSensorData;
            
            }
            else if(index%2==0){

                let flow = (index/2 + 1) * flowRate;
                let water = (index/2) + waterTemperature;
                let dist = (index/2) + distance;
                let humi = (index/2) + humidity;
                let temp = (index/2) + temperature;
                flow = flow.toFixed(2);
                water = water.toFixed(2);
                dist = dist.toFixed(2);
                humi = humi.toFixed(2);
                temp = temp.toFixed(2);

                const newSensorData = {
                    flowRate : flow,
                    waterTemperature : water,
                    distance : dist,
                    humidity : humi,
                    temperature : temp
                };

                object.sensorData = newSensorData;
            
            }
            else{

                let flow = (index/2) * flowRate;
                let water = (index/2) * waterTemperature;
                let dist = (index/2) * distance;
                let humi = (index/2) * humidity;
                let temp = (index/2) * temperature;
                flow = flow.toFixed(2);
                water = water.toFixed(2);
                dist = dist.toFixed(2);
                humi = humi.toFixed(2);
                temp = temp.toFixed(2);

                const newSensorData = {
                    flowRate : flow,
                    waterTemperature : water,
                    distance : dist,
                    humidity : humi,
                    temperature : temp
                };

                object.sensorData = newSensorData;
            }
            
            const {locationName, sensorData, subscribedNumbers} = object;

            LocationModel.findOneAndUpdate({
                locationName
            },
            {
                sensorData
            },
            {
                upsert : true
            },
            (error) => {
        
                if(error)
                    console.log("Error in creating / updating data in cloud in locationDataMiddleware", error.message);
            })
        
        })
    })
}


module.exports = { locationDataMiddleware }