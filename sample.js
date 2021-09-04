const serialport = require("serialport");

const GSMSerialPort = new serialport("COM9",{
    baudRate : 9600
}, (error) => {
    if(error)
        console.log("GSM Error in establishing COM port communication", error);
    else{
        console.log("GSM Serial port connection established");
        
        for(let i=0; i<10; i++){
            
            setTimeout(() => {
                
                GSMSerialPort.write("AT\n");
                GSMSerialPort.write("AT+CMGF=1\n");    
                GSMSerialPort.write("AT+CMGS=\"8124480667\"\n");
                GSMSerialPort.write("We live in a twilight world " + (1+i) + "\n\032");

            }, (i+1)*8000);
            // sleep(7000);
        
            console.log("Sent " + (1+i));
        }
    }
})


const GSMParser = new serialport.parsers.Readline();
GSMSerialPort.pipe(GSMParser);
GSMParser.on("data", data => {
    console.log("Data : " , data);
})

function sleep( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
}
