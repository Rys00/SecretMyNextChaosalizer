# Układ chaotyczne

#### Przygotowali:

Mateusz Ogniewski 331413
Mateusz Wawrzyniak 331450

## Jak uruchomić?

Na początku zaznaczę, że własne uruchamianie jest opcjonalne, gdyż nasz projekt jest publicznie dostępny pod adresem [http://31.178.119.223:8080](http://31.178.119.223:8080) i można go tam zobaczyć (gdyby serwer nie działał prosilibyśmy o kontakt).
Gdyby jednak była potrzeba własnego hostowania to kroki są następujące:

- Najpierw jeżeli nie posiadamy środowiska **NodeJS** wraz z menadżerem pakietów **npm** instalujemy go zgodnie z [link](https://nodejs.org/en/download) (dla linuxa tak jak poniżej):

```sh
curl -o- https://fnm.vercel.app/install | bash
fnm install 22
# weryfikujemy pakiety
node -v
npm -v
```

- Następnie wchodzimy do folderu naszego projektu i wywołujemy:

```sh
npm install # instalujemy wszystkie dependency
npm run dev # startujemy lokalny serwer
```

- Jeżeli wszystko przebiegło pomyślnie nasza aplikacja powinna być dostępna pod adresem [localhost:3000](http://localhost:3000)

## Gdzie się znajduje sedno projektu

Sedno projektu (kod odpowiedzialny za wyliczanie krzywych do wizualizacji układów Lorenza i Rosslera) znajduje się w pliku [utils/rk4.ts](utils/rk4.ts). Wyliczanie kolejnych punktów odbywa się przy pomocy metody Runge–Kutta (4 rzędu) w funkcji genNextPoint(). Klasa RK4Curve jest generyczna i sama nie reprezentuje żadnego systemu, poszczególnie implementacje układów Lorenza i Rosslera dziedziczą po tej klasie i znajdują się odpowiednio w plikach [utils/lorenz.ts](utils/lorenz.ts) oraz [utils/rossler.ts](utils/rossler.ts).
Kod odpowiedzialny za renderowanie systemów znajduje się w pliku [utils/systemSimulationObject.ts](utils/systemSimulationObject.ts)
Pozostałe pliki służą jedynie do przedstawienia wyników działania algorytmu.

## Dokumentacja działania układów chaotycznych

W projekcie jest dostępna dokumentacja opisująca działanie układów chaotycznych a w szczególności układów Lorenza i Rosslera. Znajduje się w pliku [docs.pdf](docs.pdf)
