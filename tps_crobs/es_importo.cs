using System;
using System.Threading;

/*Un cinema dispone di 20 posti ancora disponibili. Tre sportelli vendono contemporaneamente i biglietti per lo stesso spettacolo.
Ogni sportello è rappresentato da un thread indipendente, mentre il numero di posti disponibili è
rappresentato da una variabile condivisa.
Ogni sportello deve effettuare 10 tentativi di prenotazione. Per ogni tentativo deve:
Attendere un intervallo casuale compreso tra 100 e 500 millisecondi (usate: Random.Shared.Next(100, 501) che genera 
un numero intero casuale compreso tra 100 e 500 inclusi) e poi Thread.Sleep() che  sospende il thread corrente per il numero 
di millisecondi specificato.
Richiedere un numero casuale di biglietti compreso tra 1 e 3.
Verificare che siano disponibili abbastanza posti.
Se la disponibilità è sufficiente, effettuare la vendita e aggiornare il numero di posti disponibili.
Altrimenti, comunicare che la prenotazione non può essere effettuata.
Il programma principale deve attendere la terminazione dei tre thread e stampare il numero di biglietti venduti e quello 
dei posti rimanenti.*/

int posti = 20;
bool locked = false;

void Blocca()
{
    
    while (locked)
    {
        Thread.Sleep(1);
    }
    
    locked = true;
}

void Sblocca()
{
    locked = false;
}

void Cinema()
{
    
    for (int i = 1; i <= 10; i++)
    {
        
        Thread.Sleep(Random.Shared.Next(100, 501));

        
        int biglietti = Random.Shared.Next(1, 4);

        Blocca();

        if (biglietti <= posti)
        {
            posti -= biglietti;
        }
        else
        {
            Console.WriteLine($"no");
        }

        
        Sblocca();
    }
}

Thread t1 = new Thread(Cinema);
Thread t2 = new Thread(Cinema);
Thread t3 = new Thread(Cinema);

t1.Start();
t2.Start();
t3.Start();

t1.Join();
t2.Join();
t3.Join();

Console.WriteLine($"Biglietti venduti: {20 - posti}");
Console.WriteLine($"Posti rimanenti: {posti}");
