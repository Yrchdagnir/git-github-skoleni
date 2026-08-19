# Záchranný tahák školitele

Nejdřív zjisti stav. Teprve potom opravuj.

```bash
pwd
git status
git branch --show-current
git remote -v
git log --oneline --graph --decorate --all -12
```

U účastníka si nech vysvětlit, co chtěl udělat, co zadal a co očekával. Chybovou hlášku čtěte od prvního konkrétního problému, ne pouze poslední řádek.

## Příkaz nebyl nalezen

- `git: command not found`: ověř instalaci Git for Windows a otevři nový Git Bash.
- `node: command not found`: ověř Node.js LTS a restartuj terminál.
- `npm: command not found`: npm je součástí Node.js; oprav instalaci nebo `PATH`.
- V PowerShellu může politika blokovat `npm.ps1`; použij Git Bash nebo `npm.cmd`.

## Přihlášení k GitHubu přes HTTPS

GitHub nepřijímá heslo účtu jako heslo pro Git operace. Na Windows použij přihlášení přes Git Credential Manager a dokonči otevřené okno prohlížeče. Token nikdy neposílej školiteli ani do Discordu.

```bash
git remote -v
git config --show-origin --get credential.helper
```

## Push hlásí nedostatečné oprávnění

1. Ověř správný repozitář v `git remote -v`.
2. Ověř GitHub uživatelské jméno přihlášeného účtu.
3. Zkontroluj, že účastník přijal pozvánku spolupracovníka.
4. Ověř, že neposílá přímo do `main`.

```bash
git branch --show-current
git push -u origin HEAD
```

## Author identity unknown

Nastav identitu jen pro aktuální repozitář, pokud účastník nechce globální nastavení:

```bash
git config user.name "Jméno Příjmení"
git config user.email "email-použitý-na-GitHubu@example.com"
```

Potom zopakuj commit. Nepřepisuj už vytvořenou historii bez důvodu.

## Účastník pracoval na špatné větvi

Pokud změny ještě nejsou commitnuté, vytvoř správnou větev přímo z aktuálního stavu:

```bash
git switch -c participant/<github-user>/<tema>
git status
```

Pokud už commit existuje, nejdřív vytvoř větev ukazující na tento commit. Čištění `main` řeš až potom a pouze s jistotou, že commit zůstal dosažitelný.

## Omylem přidaný soubor do stagingu

```bash
git restore --staged cesta/k/souboru
git status
```

Soubor zůstane v pracovním stromu. `git restore --staged` nemaže jeho obsah.

## Konflikt při merge nebo pull

```bash
git status
```

1. Otevři pouze soubory označené jako konfliktní.
2. Rozhodni výsledný obsah; nemaž značky mechanicky bez pochopení obou variant.
3. Spusť build nebo test.
4. Přidej vyřešený soubor a dokonči operaci.

```bash
git add cesta/k/souboru
git status
git commit
```

Když účastník ještě nic vědomě nevyřešil a potřebuje operaci vrátit, použij podle situace `git merge --abort` nebo `git rebase --abort`. Nehádej, nejdřív přečti `git status`.

## Pull request má neplatný název

Povolené prefixy jsou:

```text
feat: fix: docs: test: ci: chore: refactor:
```

Příklad: `feat: přidat lektvar soustředění`. Název lze upravit přímo v pull requestu; kvůli názvu není nutné vytvářet nový PR.

## GitHub Actions je červené

1. Otevři neúspěšný workflow run a konkrétní job.
2. Najdi první krok označený červeně.
3. Přečti první konkrétní chybovou hlášku v tomto kroku.
4. Reprodukuj ji lokálně přes `npm run build` nebo `npm test`.
5. Oprav příčinu, commitni a pushni do stejné větve.

Neopakuj workflow bez změny, pokud chyba není zjevně dočasná.

## Playwright nemá Chromium

```bash
npx playwright install chromium
npm test
```

Na firemním zařízení může instalaci blokovat proxy nebo bezpečnostní politika. V tom případě použij předem připravený počítač nebo párovou práci; nevypínej ochrany zařízení během workshopu.

## Port 4173 je obsazený

Nejdřív ověř, jestli na něm už neběží správná aplikace: <http://127.0.0.1:4173>. Pokud ano, použij ji. Jinak ve Windows zjisti PID:

```powershell
Get-NetTCPConnection -LocalPort 4173 | Select-Object LocalAddress,LocalPort,State,OwningProcess
Get-Process -Id <PID>
```

Ukončuj pouze proces, který jsi jednoznačně identifikoval jako starý školící server.

## Výpadek GitHubu nebo internetu

- pokračuj lokálními lekcemi se stagingem, historií, větvemi a konfliktem,
- pull request simulujte porovnáním dvou větví a `git diff main...větev`,
- Actions vysvětli nad uloženým screenshotem nebo předem otevřeným během,
- vzdálené kroky nepředstírej; dokončete je po obnovení služby.

## Když skupina nabírá skluz

Zkrať v tomto pořadí:

1. `git blame` a podrobnou historii,
2. tagování,
3. psaní workflow od nuly,
4. detail semantic-release.

Nevynechávej staging, `git status`, větve, konflikt, pull request, review a čtení chybného CI.

## Co nepoužívat jako univerzální záchranu

Bez přesného pochopení stavu nespouštěj:

```text
git reset --hard
git clean -fd
git push --force
git restore .
git checkout -- .
```

Tyto příkazy mohou odstranit práci. Nejprve vytvoř záchrannou větev nebo commit a ověř, že potřebná změna zůstává v historii.
