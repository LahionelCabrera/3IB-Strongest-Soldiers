using System;
using System.Threading;
using System.Diagnostics;
/*
Un programma deve simulare l'elaborazione di tre file. Ogni elaborazione richiede un tempo differente:
elaborazione file A: 2 secondi,
elaborazione file B: 4 secondi,
elaborazione file C: 3 secondi.
Per il calcolo del tempo trascorso, usare:

Stopwatch sw = Stopwatch.StartNew();
...
sw.Stop();
Console.WriteLine($"Elapsed: {sw.Elapsed}");

Fatto ciò, esamina i punti successivi:
Creare tre metodi ElaboraA(), ElaboraB() ed ElaboraC(). Ciascun metodo deve stampare un messaggio iniziale, attendere il tempo previsto mediante Thread.Sleep() e stampare un messaggio finale. I metodi dovranno essere eseguiti in maniera NON concorrente (sequenziale).
Modificare il programma affinché le tre elaborazioni siano eseguite mediante tre thread differenti. Il programma principale deve attendere la conclusione di tutti i thread prima di stampare il tempo complessivo.
Ora rispondi a queste domande:
Perché la versione sequenziale impiega un tempo differente da quella concorrente?
Se aggiungi un quarto file D, con durata di 5 secondi, quali saranno i tempi per il caso sequenziale e per quello concorrente?
Infine, modifica il programma affinché vengano avviati prima A e B, attesa la conclusione di entrambi, e soltanto dopo avviati C e D.
*/


//Segueniale
/*
void stampa_file_sequenziale(){
    Stopwatch sw = Stopwatch.StartNew();
    Console.WriteLine("elaborazione file A: 2 secondi");
    Thread.Sleep(2000);
    Console.WriteLine("elaborazione file B: 4 secondi");
    Thread.Sleep(4000);
    Console.WriteLine("elaborazione file C: 3 secondi");
    Thread.Sleep(3000);
    sw.Stop();
    Console.WriteLine($"Elapsed: {sw.Elapsed}");
}
stampa_file_sequenziale();
*/

/*es1
void ElaboraA(string nome, int t)
{
    Console.WriteLine($"elaborazione file {nome}: {t} secondi");
    Thread.Sleep(t);
}



Thread t1 = new Thread(() => ElaboraA("A", 2000));
Thread t2 = new Thread(() => ElaboraA("B", 4000));
Thread t3 = new Thread(() => ElaboraA("C", 3000));
Stopwatch sw1 = Stopwatch.StartNew();

t1.Start();
t2.Start();
t3.Start();

t1.Join();
t2.Join();
t3.Join();

sw1.Stop();
Console.WriteLine($"Elapsed: {sw1.Elapsed}");*/

//es2
/*
void ElaboraA(string nome, int t)
{
    Console.WriteLine($"elaborazione file {nome}: {t} secondi");
    Thread.Sleep(t);
}



Thread t1 = new Thread(() => ElaboraA("A", 2000));
Thread t2 = new Thread(() => ElaboraA("B", 4000));
Thread t3 = new Thread(() => ElaboraA("C", 3000));
Thread t4 = new Thread(() => ElaboraA("D", 5000));
Stopwatch sw1 = Stopwatch.StartNew();

t1.Start();
t2.Start();
t3.Start();
t4.Start();

t1.Join();
t2.Join();
t3.Join();
t4.Join();

sw1.Stop();
Console.WriteLine($"Elapsed: {sw1.Elapsed}");*/


//es3
/*
void ElaboraA(string nome, int t)
{
    Console.WriteLine($"elaborazione file {nome}: {t} secondi");
    Thread.Sleep(t);
}



Thread t1 = new Thread(() => ElaboraA("A", 2000));
Thread t2 = new Thread(() => ElaboraA("B", 4000));
Thread t3 = new Thread(() => ElaboraA("C", 3000));
Thread t4 = new Thread(() => ElaboraA("D", 5000));
Stopwatch sw1 = Stopwatch.StartNew();

t1.Start();
t2.Start();

t1.Join();
t2.Join();


t3.Start();
t4.Start();

t3.Join();
t4.Join();

sw1.Stop();
Console.WriteLine($"Elapsed: {sw1.Elapsed}");*/