const serialport = require('serialport');

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
    // if(!data.includes("AT")){
    //     console.log(data)
    // }
})

const numbers = ["8124480667","9789214990"];


// const customDelay = (seconds) => {
//     var waitTill = new Date(new Date().getTime() + seconds * 1000);
//     while(waitTill > new Date()){}
// }

// async function foo() { 
//   console.log("before"); 
//   await sleep(5 * 1000); 
//   console.log("after"); 
// } 
// foo()




// let firstIteration = true;
// let returnedData = "";

// numbers.forEach(number => {
    
//     if(firstIteration || returnedData.includes("+CMGS:")){
        
//         firstIteration = false;
//         GSMSerialPort.write("AT+CMGF=1\n");
//         GSMSerialPort.write(`AT+CMGS=\"${number}\"\n`);
//         GSMSerialPort.write("Alert\n");
//         GSMSerialPort.write("\032");
//         console.log("Sent to " + number);
//         GSMParser.on("data", data => returnedData = data)
//         console.log(returnedData, "YEAH");
//     }

// })
