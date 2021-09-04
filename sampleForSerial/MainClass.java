import javax.print.DocFlavor.STRING;

import java.util.Scanner;

enum Enums
{
    A, B, C, D;
 
    private Enums()
    {
        System.out.println(10);
    }
}
 
public class MainClass
{
    public static void main(String[] args)
    {
        EduProgram[] inputArray = new EduProgram[4];
        Phone[] phones = new Phone[7];
        phones[0] = new Phone(20000, "Xperia");
        phones[1] = new Phone(24000, "POCO");
        phones[2] = new Phone(15000, "MotoG4");
        phones[3] = new Phone(17000, "Samsung");
        phones[4] = new Phone(40000, "IPhone");
        phones[5] = new Phone(330000, "Cone");
        phones[6] = new Phone(350000, "Bone");

        Phone result = getSecondCostliestPhone(phones);
        System.out.println("The second costliest phone is " + result.getModel() + " which is Rs." + result.getPrice());

    }
    
    public static Phone getSecondCostliestPhone(Phone[] phones){
            
        int firstCostliest = Integer.MIN_VALUE;
        Phone firstCostliestPhone = null, secondCostliestPhone = null;

        for(Phone current : phones){
            
            if(current.getPrice() > firstCostliest){
                
                secondCostliestPhone = firstCostliestPhone;
                firstCostliestPhone = current;
                firstCostliest = current.getPrice();

            }
        }

        return secondCostliestPhone;
    }
}

class Phone{
    private int price;
    private String model;

    public Phone(int price, String model){
        this.price = price;
        this.model = model;
    }

    public void setPrice(int price){ this.price = price; }
    public int getPrice(){ return this.price; }
    public void setModel(String model){ this.model = model; }
    public String getModel(){ return this.model; }
}

class Sony extends Phone{

    Sony(int price, String model){
        super(price, model);
    }
}

class EduProgram{
    private String name;
    EduProgram(String name){this.name = name;}
}