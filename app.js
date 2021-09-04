const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const locationRoutes = require('./routes/locationRoutes');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const http = require('http');
const httpServer = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(httpServer);
const serialport = require('serialport');
const { locationDataMiddleware } = require('./middleware/locationDataMiddleware');
const LocationModel = require('./models/LocationModel');
const UserModel = require('./models/User');



// Middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());





// Socket
io.on("connection", async (socket) => {
    // console.log("A user has connected");

    let locationDataForUser;

    socket.emit("EstablishConnection");

    socket.on("UserConnected", async (data) => {
        try{
            setInterval( async () => {
                const doc = await LocationModel.findOne({locationName : data})
                locationDataForUser = doc.sensorData;
                socket.emit("locationDataForUser", locationDataForUser);
            }, 500);
        }
        catch(error){
            console.log(error);
        }
    })

})




// Database
const dbURI = "mongodb+srv://gn2601:PEWDIEPIEGN@cluster0.zxfzz.mongodb.net/FinalYearProject?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser : true, useUnifiedTopology : true, useFindAndModify : false, useCreateIndex : true }, (err) => {
    if(err)
        console.log("DB Error !", err.message);
    else{
        console.log("DB Started");
        locationDataMiddleware();
    }
});




const GSMSerialPort = new serialport("COM8",{
    baudRate : 9600
}, (error) => {
    if(error)
        console.log("GSM Error in establishing COM port communication", error);
    else
        console.log("GSM Serial port connection established");
})


const GSMParser = new serialport.parsers.Readline();
GSMSerialPort.pipe(GSMParser);
GSMParser.on("data", data => {
    console.log("Data : " , data);
})




// GSM

// GSMSerialPort.write("AT+CMGF=1\n");
// GSMSerialPort.write("AT+CMGS=\"" + number + "\"\n");
// GSMSerialPort.write("-------------------------------\n");
// GSMSerialPort.write(" Flash Flood Alert !!!  \n");
// GSMSerialPort.write("-------------------------------\n");
// GSMSerialPort.write("    A sudden rise in the stream XXXXXX in " + locationName + " has been captured. ");
// GSMSerialPort.write("Please take necessary safety precautions.");
// GSMSerialPort.write("\032");



// Routers
app.use(authRoutes)
app.use(locationRoutes)




const PORT_NUMBER = 5000;
httpServer.listen(PORT_NUMBER, () => console.log(`Server started on Port ${PORT_NUMBER}`));




// Message Interval in seconds
const MESSAGE_INTERVAL = 24 * 60 * 60;
let lastSent = false;
let sensorDataArray = [];
let currentlyExecuting = false;
let time = 0;

setInterval(() => {
    
    LocationModel.find({},(error, doc) => {
        
        if(error)
            console.log("Error retrieving sensorData in app.js line 56", error);
        
        sensorDataArray = doc;
        

        if(!currentlyExecuting){
            currentlyExecuting = true;
            sensorDataArray.forEach(element => {
                
                let locationName = element.locationName;
                let subscribedNumbers = element.subscribedNumbers;
                let sensorData = element.sensorData;
                let distance = parseInt(sensorData.distance);
                let flowRate = parseInt(sensorData.flowRate);
                let thresholdReached = (distance < 10);
                let recentlyTransmitted = ((Date.now() - element.lastTransmitted)/1000) < MESSAGE_INTERVAL;
                
                
                if(thresholdReached && !recentlyTransmitted && subscribedNumbers.length){
                    LocationModel.findOneAndUpdate({locationName},
                        {
                            lastTransmitted : Date.now()
                        },
                        (error) => {
                            if(error)
                                console.log(error);
                            
                            subscribedNumbers.forEach((number) => {
                                setTimeout(() => {
                                    
                                    console.log("Location : " + locationName, "Phone number : " + number);

                                    GSMSerialPort.write("AT+CMGF=1\n");
                                    GSMSerialPort.write("AT+CMGS=\"" + number + "\"\n");
                                    GSMSerialPort.write("-------------------------------\n");
                                    GSMSerialPort.write(" Flash Flood Alert !!!  \n");
                                    GSMSerialPort.write("-------------------------------\n");
                                    GSMSerialPort.write("    A sudden rise in the stream XXXXXX in " + locationName + " has been captured. ");
                                    GSMSerialPort.write("Please take necessary safety precautions.");
                                    GSMSerialPort.write("\032");

                                }, time);
                                time += 10000;
                            });

                            setTimeout(() => currentlyExecuting = false, time);
                        });
                }
            })
            currentlyExecuting = false;
        }
        

    })
}, 1000)
