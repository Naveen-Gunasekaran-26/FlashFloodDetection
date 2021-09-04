#include <iostream>
#include <windows.h>
#include <string>


HANDLE serialHandle;
const char* PORT = "COM4";

int main(){
    serialHandle = CreateFile(PORT,
                                GENERIC_READ | GENERIC_WRITE,
                                0,
                                0,
                                OPEN_EXISTING,
                                FILE_FLAG_OVERLAPPED,
                                0);

    if(serialHandle == INVALID_HANDLE_VALUE){
        if(GetLastError() == ERROR_FILE_NOT_FOUND){
            std::cout<<"Serial port ("<<PORT<<") does not exist\n";
        }
    }
    else{
        
        std::cout<<"Serial communication on port "<<PORT<<" has been established\n";
        DCB dcbSerialParams = {0};
        dcbSerialParams.DCBlength = sizeof(dcbSerialParams);
        
        if(!GetCommState(serialHandle, &dcbSerialParams)){
            std::cout<<"Error getting state\n";
        }

        dcbSerialParams.BaudRate = CBR_9600;
        dcbSerialParams.ByteSize = 8;
        dcbSerialParams.StopBits = ONESTOPBIT;
        dcbSerialParams.Parity = NOPARITY;

        if(!SetCommState(serialHandle, &dcbSerialParams)){
            std::cout<<"Error setting state\n";
        }

        COMMTIMEOUTS timeOuts = {0};
        timeOuts.ReadIntervalTimeout = 50;
        timeOuts.ReadTotalTimeoutConstant = 50;
        timeOuts.ReadTotalTimeoutMultiplier = 10;
        timeOuts.WriteTotalTimeoutConstant = 50;
        timeOuts.WriteTotalTimeoutMultiplier = 10;

        if(!SetCommTimeouts(serialHandle, &timeOuts)){
            std::cout<<"Error occured in setting timeouts\n";
        }

        int n=100;
        char szBuff[n+1] = {0};
        DWORD dwBytesRead, dwBytesWrote = 0;

        if(!WriteFile(serialHandle, "AT", 2, &dwBytesWrote, NULL)){
            std::cout<<"Error writing to PORT\n";
        }

        std::string keyStroke;
        while(1){
            
            if(!ReadFile(serialHandle, szBuff, n, &dwBytesRead, NULL)){
                std::cout<<"Error in ReadFile\n";
            }
            else{
                std::cout<<"Message : "<<szBuff<<", "<<dwBytesRead<<"\n";
            }
            std::cin>>keyStroke;
        }
    }
}