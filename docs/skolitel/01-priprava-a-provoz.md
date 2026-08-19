# Příprava a provoz školení

## Týden před školením

### GitHub

Ověř nastavení repozitáře `Yrchdagnir/git-github-skoleni`:

- repozitář je veřejný a GitHub Actions jsou povolené,
- GitHub Pages nasazuje workflow `Deploy Potion Archive`,
- existuje label `exercise`,
- větev `main` vyžaduje pull request,
- pull request vyžaduje alespoň jedno schválení,
- povinné kontroly mají přesné názvy `Playwright tests` a `Semantic PR title`,
- přímý push a force push do `main` jsou zakázané,
- pro výuku je povolený **Create a merge commit** a vypnutý squash i rebase merge,
- po sloučení se automaticky maže zdrojová větev.

Zelené workflow samo o sobě není povinnou kontrolou. Je potřeba ho přidat do pravidla větve nebo rulesetu. Ověř to testovacím pull requestem, ne pouze pohledem na seznam workflow.

### Přístupy

1. Sesbírej GitHub uživatelská jména.
2. Pozvi všechny účastníky jako spolupracovníky s oprávněním **Write**.
3. Nech je pozvánku přijmout ještě před školením.
4. Rozděl je do dvojic pro review a konflikt.
5. Měj připravený vlastní testovací účet nebo dobrovolníka pro ukázku.

Průvodce očekává push větví přímo do sdíleného repozitáře. Pokud nechceš přidělovat Write, je nutné předem přepsat lekce na workflow s forky.

### Technické minimum účastníka

- Git for Windows a Git Bash,
- Node.js LTS 20 nebo novější a npm,
- moderní prohlížeč,
- GitHub účet s ověřeným e-mailem,
- pracovní složka mimo OneDrive a jiné synchronizované adresáře,
- stabilní internet a možnost přístupu na GitHub.

## Tři dny před školením

Pošli [přípravnou zprávu](04-zprava-ucastnikum.md). Od každého chtěj pouze poslední řádek výstupu `npm run doctor`, ne screenshot celého terminálu. Nikdo neposílá heslo, token ani obsah správce přihlašovacích údajů.

Neúspěšnou přípravu vyřeš předem v krátkém individuálním hovoru. Prvních 30 minut workshopu nemá být instalace nástrojů.

## Den před školením

V nové složce proveď čistou zkoušku:

```bash
git clone https://github.com/Yrchdagnir/git-github-skoleni.git
cd git-github-skoleni
npm ci
npx playwright install chromium
npm run trainer:check
```

Očekávej úspěšný doctor, sestavení šesti jazykových variant receptů a 16 zelených Playwright testů. Potom otevři:

- <http://127.0.0.1:4173/workshop/>
- <http://127.0.0.1:4173/workshop/facilitator.html>
- <http://127.0.0.1:4173/>

Zkontroluj češtinu, slovenštinu, mobilní zobrazení a navigaci mezi lekcemi.

## Třicet minut před začátkem

- otevři prezentovaný průvodce a soukromé facilitátorské poznámky,
- připrav odkaz na repozitář, Pages a videohovor do jednoho Discord příspěvku,
- ověř Actions a testovací pull request,
- připrav breakout dvojice,
- otevři časomíru a parkoviště otázek,
- spusť `npm run dev` a ověř port `4173`,
- zaznamenej čistý stav přes `git status`.

## Rytmus jedné lekce

1. **Kontext, 2 až 4 minuty:** proč se příkaz používá a co se má změnit.
2. **Ukázka, 3 až 6 minut:** jeden průchod se slovním popisem stavu.
3. **Praxe, 8 až 15 minut:** účastníci pracují samostatně nebo ve dvojici.
4. **Kontrola, 2 minuty:** všichni ukážou očekávaný výsledek.
5. **Debrief, 3 až 5 minut:** co se změnilo v pracovním stromu, historii nebo na GitHubu.

Používej jednoduchý signál **HELP** do Discord chatu. Po třech minutách bez postupu přejdi na diagnostiku ze záchranného taháku, aby se skupina nerozpadla na několik různých temp.

## Po každém workshopu

- zkontroluj otevřené pull requesty a červená workflow,
- označ cvičné issues labelem `exercise`,
- zapiš místa, kde se skupina zdržela,
- pošli odkazy na dokončené lekce a přípravu dalšího bloku,
- cvičné větve maž až po ověření, že je nikdo nepotřebuje pro navazující lekci.

## Po skončení celé série

- odeber dočasná oprávnění, která už nejsou potřeba,
- zavři nebo smaž cvičné issues a větve,
- ověř zelený `main`, Pages a poslední release,
- archivuj zpětnou vazbu a uprav časování scénáře,
- neměň ochranu `main` zpět na slabší nastavení jen kvůli úklidu.
