# Školitelský balíček

Tento repozitář je připravený jako praktický sandbox pro výuku lokálního Gitu, spolupráce přes GitHub a GitHub Actions. Účastníci pracují na společném archivu lektvarů, takže si procvičí skutečný tok změny bez nutnosti programovat.

## Co už je připravené

- 23 lekcí v češtině a slovenštině, celkem přibližně 500 minut obsahu.
- Krokový [průvodce účastníka](https://yrchdagnir.github.io/git-github-skoleni/workshop/).
- Živý [archiv lektvarů](https://yrchdagnir.github.io/git-github-skoleni/).
- Webové [facilitátorské poznámky](https://yrchdagnir.github.io/git-github-skoleni/workshop/facilitator.html).
- Automatické testy, kontrola názvu pull requestu, release workflow a nasazení na GitHub Pages.
- Diagnostický příkaz `npm run doctor` a kompletní kontrola `npm run trainer:check`.

## Doporučený formát

Obsah rozděl do tří workshopů po přibližně třech hodinách. Ideální skupina je 6 až 10 lidí; nad 8 účastníků se hodí druhý člověk na technickou podporu. GitHub část dělejte ve dvojicích, aby každý jednou otevřel pull request a jednou provedl review.

Podrobný harmonogram je v [docs/skolitel/02-scenar-tri-workshopu.md](docs/skolitel/02-scenar-tri-workshopu.md).

## Než pozveš účastníky

1. Projdi [přípravu a provoz](docs/skolitel/01-priprava-a-provoz.md).
2. Rozhodni, kdo má mít přístup do sdíleného repozitáře.
3. Ověř pravidla větve `main`, povinné kontroly a GitHub Pages.
4. Pošli účastníkům hotovou [zprávu s přípravou](docs/skolitel/04-zprava-ucastnikum.md).
5. V čistém klonu spusť:

```bash
npm ci
npx playwright install chromium
npm run trainer:check
```

## Důležitý model přístupu

Průvodce aktuálně počítá s tím, že účastník vytvoří větev `participant/<github-user>/<tema>` a pošle ji přímo do tohoto repozitáře. Doporučený model pro školení proto je:

- předem přidat všechny účastníky jako spolupracovníky s oprávněním **Write**,
- vyžadovat pull request pro změny v `main`,
- zakázat přímé pushování do `main`,
- vyžadovat alespoň jedno schválení a zelené kontroly.

Forky jsou možné, ale současný průvodce na ně není napsaný. Bez úpravy instrukcí by účastníci pracovali s jiným `origin`, než jaký lekce očekávají.

## Co při zkracování nevynechávat

- rozdíl pracovní strom, staging area a commit,
- `git status` jako první diagnostický krok,
- vytvoření a bezpečné sloučení větve,
- konflikt a jeho vědomé vyřešení,
- pull request, review a automatické kontroly,
- bezpečnost: žádná hesla, tokeny, force push do `main` ani plošné destruktivní příkazy.

Při časovém skluzu zkrať nejdřív `blame`, tagování, release a samostatné psaní workflow. Zachovej praktickou práci se stagingem, větvemi, konfliktem a pull requestem.

## Během školení

- Otevři účastnický průvodce na projektoru a facilitátorské poznámky u sebe.
- Každý blok začni krátkou ukázkou, potom nech účastníky pracovat a zakonči společným debriefem.
- Po třech minutách bez postupu použij [záchranný tahák](docs/skolitel/03-zachranny-tahak.md).
- Před destruktivním krokem vždy nejdřív zachyť `git status`, aktuální větev a krátkou historii.

## Po školení

Zruš nepotřebné přístupy, smaž cvičné větve a issues, ověř stav `main` a ponech účastníkům odkazy na průvodce. Veřejný repozitář nemá automaticky vyřešená licenční pravidla; před školením mimo vlastní tým zvaž doplnění licence.
