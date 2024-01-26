# 1. Opis funkcjonalności tej części projektu

- ekran oczekiwania na drugiego gracza widoczny do czasu kiedy ten się zaloguje
- pierwszy gracz dostaje informację o zalogowaniu drugiego
- zaznaczenie własnego pionka (obiekt klasy Pawn) przy jego kliknięciu
- gracz może poruszać tylko swoimi pionkami
- gracz może poruszać pionkami tylko po czarnych polach

# 2. serwer - logika logowania - plik net.js - dokończenie:

- po zalogowaniu pierwszego gracza, musi on wiedzieć kiedy zaloguje się drugi
- zaraz po zalogowaniu pierwszemu wyświetla się informacja "czekam..."
- oraz za pomocą setInterval() wysyła on na serwer zapytanie fetchem np co 1000ms, sprawdzające czy tablica na serwerze ma jednego czy dwu userów
- jeśli tablica ma dwu userów, czyli drugi gracz wszedł do gry, to ekran oczekiwania znika i dowiadujemy się kto jest zalogowany  
