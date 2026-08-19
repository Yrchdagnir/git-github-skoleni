# Zpráva účastníkům

Doplň datum a termín. První verzi pošli českým účastníkům, druhou slovenským.

## Česká verze

Ahoj,

dne **[DATUM A ČAS]** začínáme praktické školení Gitu, GitHubu a GitHub Actions. Budeme pracovat ve společném cvičném repozitáři, proto prosím dokonči přípravu nejpozději **[TERMÍN]**.

Pošli mi své přesné GitHub uživatelské jméno. Až dostaneš pozvánku do repozitáře, přijmi ji.

Nainstaluj si:

- Git for Windows včetně Git Bash,
- aktuální Node.js LTS,
- moderní webový prohlížeč.

V Git Bash spusť:

```bash
git clone https://github.com/Yrchdagnir/git-github-skoleni.git
cd git-github-skoleni
npm ci
npx playwright install chromium
npm run doctor
npm test
```

Pracuj ve složce mimo OneDrive nebo jinou synchronizovanou složku. Po úspěšné přípravě mi pošli pouze poslední řádek z `npm run doctor`, který končí `READY`. Pokud příkaz selže, pošli text chybové hlášky bez hesel a přihlašovacích údajů.

Heslo, přístupový token ani screenshot správce přihlašovacích údajů nikomu neposílej. Kód během školení psát nemusíš; budeme upravovat připravené textové a JSON soubory.

Odkazy:

- repozitář: <https://github.com/Yrchdagnir/git-github-skoleni>
- průvodce: <https://yrchdagnir.github.io/git-github-skoleni/workshop/>

## Slovenská verzia

Ahoj,

dňa **[DÁTUM A ČAS]** začíname praktické školenie Gitu, GitHubu a GitHub Actions. Budeme pracovať v spoločnom cvičnom repozitári, preto prosím dokonči prípravu najneskôr **[TERMÍN]**.

Pošli mi svoje presné používateľské meno na GitHube. Keď dostaneš pozvánku do repozitára, prijmi ju.

Nainštaluj si:

- Git for Windows vrátane Git Bash,
- aktuálny Node.js LTS,
- moderný webový prehliadač.

V Git Bash spusti:

```bash
git clone https://github.com/Yrchdagnir/git-github-skoleni.git
cd git-github-skoleni
npm ci
npx playwright install chromium
npm run doctor
npm test
```

Pracuj v priečinku mimo OneDrive alebo iného synchronizovaného priečinka. Po úspešnej príprave mi pošli iba posledný riadok z `npm run doctor`, ktorý končí `READY`. Ak príkaz zlyhá, pošli text chybovej hlášky bez hesiel a prihlasovacích údajov.

Heslo, prístupový token ani snímku správcu prihlasovacích údajov nikomu neposielaj. Kód počas školenia písať nemusíš; budeme upravovať pripravené textové a JSON súbory.

Odkazy:

- repozitár: <https://github.com/Yrchdagnir/git-github-skoleni>
- sprievodca: <https://yrchdagnir.github.io/git-github-skoleni/workshop/>
