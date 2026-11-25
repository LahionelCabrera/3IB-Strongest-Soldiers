using System;
using System.Threading;

Random rnd = new Random();

/*void LavoroA()
{
    Console.WriteLine("LavoroA: start");
    for (int i = 0; i < 7; i++)
    {
        Console.WriteLine("LavoroA: " + i);
        Thread.Sleep(rnd.Next(1, 20) * 100);
    }
    Console.WriteLine("LavoroA: end");
}
void LavoroB()
{
    Console.WriteLine("LavoroB: start");
    for (int i = 0; i < 7; i++)
    {
        Console.WriteLine("LavoroB: " + i);
        Thread.Sleep(rnd.Next(1, 20) * 100);
    }
    Console.WriteLine("LavoroB: end");
}

Thread t1 = new Thread(LavoroA);
Thread t2 = new Thread(LavoroB);

t1.Start();
t2.Start();*/

void corridore1()
{
    
    Console.WriteLine("corridore1: start");
    for (int i = 1; i <= 10; i++)
    {
        
        Thread.Sleep(rnd.Next(100, 500));
        Console.WriteLine("corridore1: " + i*10);
    }
    Console.WriteLine("corridore1: end");

}

void corridore2()
{
    Console.WriteLine("corridore2: start");
    for (int i = 1; i <= 10; i++)
    {
        
        Thread.Sleep(rnd.Next(100, 500));
        Console.WriteLine("corridore2: " + i * 10);
    }
    Console.WriteLine("corridore2: end");
}

Thread t2 = new Thread(corridore2);
Thread t1 = new Thread(corridore1);

t1.Start();
t2.Start();

t1.Join();
t2.Join();

Console.WriteLine("Fine gara");