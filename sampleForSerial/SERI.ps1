$GSMPORT = New-Object System.IO.Ports.SerialPort COM5,9600;
IF($GSMPORT.IsOpen){
    Write-Output "Open"
}
else {
        Write-Output "Close"
        $GSMPORT.Open();
        # $GSMPORT.WriteLine("AT+CMGF=1");
        # $GSMPORT.WriteLine("AT+CMGS=`"8124480667`"");
        # $GSMPORT.WriteLine("MESSAGED");
        # $GSMPORT.WriteLine("\032");
        $GSMPORT.Write("Fire\nHello;");
        Write-Output $GSMPORT.IsOpen;
        $GSMPORT.Close();
}