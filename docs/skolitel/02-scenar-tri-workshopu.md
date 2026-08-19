# Scénář tří workshopů

Celý obsah má přibližně 500 minut. Scénář přidává přestávky, úvod a debrief, proto počítej se třemi bloky po třech až třech a čtvrt hodinách a s přípravou před prvním setkáním.

## Příprava účastníků předem, 45 minut

- instalace Gitu, Node.js a prohlížeče,
- přijetí pozvánky do repozitáře,
- clone přes HTTPS,
- `npm ci` a instalace Chromium,
- `npm run doctor` a `npm test`,
- krátké seznámení s terminálem a pracovní složkou.

Výsledek: každý má funkční lokální kopii a nemusí během workshopu řešit instalaci.

## Workshop 1: Lokální Git, 180 minut

| Čas | Blok | Výsledek |
| --- | --- | --- |
| 00:00-00:10 | Cíl, bezpečnost, mentální model | Účastník rozliší soubory, staging a historii. |
| 00:10-00:30 | Repozitář a `git status` | Umí poznat aktuální stav a větev. |
| 00:30-00:55 | Změna, staging a commit | Vytvoří malý, pojmenovaný commit. |
| 00:55-01:15 | Historie a diff | Najde změnu a vysvětlí její obsah. |
| 01:15-01:25 | Přestávka |  |
| 01:25-01:50 | Bezpečné vracení změn | Rozliší unstaged, staged a commitnutou změnu. |
| 01:50-02:15 | Větve | Vytvoří větev a sloučí ji do cíle. |
| 02:15-02:40 | Konflikt | Vědomě vyřeší konflikt a ověří výsledek. |
| 02:40-02:50 | Tag jako orientační bod | Vytvoří a přečte lokální tag. |
| 02:50-03:00 | Debrief a kontrola | Popíše bezpečný lokální pracovní tok. |

Při skluzu vynech podrobné `blame` a zkrať tagování. Nezkracuj staging, větve ani konflikt.

Debrief otázky:

- Co přesně ukazuje `git status`?
- Kdy změna ještě není součástí historie?
- Jak poznáš, že řešíš konflikt na správné větvi?
- Který vratný krok je bezpečný pro sdílenou historii?

## Workshop 2: Spolupráce přes GitHub, 195 minut

| Čas | Blok | Výsledek |
| --- | --- | --- |
| 00:00-00:15 | Rekapitulace a remote | Rozliší lokální repozitář a GitHub. |
| 00:15-00:40 | Clone, fetch, pull, push | Synchronizuje změny a čte stav remote větví. |
| 00:40-01:05 | Vlastní recept ve větvi | Připraví validní změnu bez zásahu do `main`. |
| 01:05-01:15 | Přestávka |  |
| 01:15-01:45 | Pull request | Otevře PR se správným názvem a popisem. |
| 01:45-02:15 | Review ve dvojicích | Dá konkrétní komentář, reaguje a schválí změnu. |
| 02:15-02:45 | Řízený konflikt | Aktualizuje větev a vyřeší konflikt. |
| 02:45-03:05 | Merge a úklid | Sloučí PR a odstraní lokální i vzdálenou větev. |
| 03:05-03:15 | Debrief | Vysvětlí týmový tok od změny po `main`. |

Rozděl účastníky do dvojic. Nech nejdřív sloučit první PR z dvojice; druhý účastník pak aktualizuje větev a dostane realistickou příležitost ke konfliktu. Konflikt vyvolej v cvičném souboru, ne v konfiguraci workflow.

Debrief otázky:

- Jaký je rozdíl mezi `fetch` a `pull`?
- Které informace musí obsahovat dobrý pull request?
- Co má review ověřit kromě toho, že testy svítí zeleně?
- Proč má `main` přijímat změny přes PR?

## Workshop 3: GitHub Actions a dodání změny, 180 minut

| Čas | Blok | Výsledek |
| --- | --- | --- |
| 00:00-00:20 | Model workflow, job, step | Umí přečíst základní strukturu YAML workflow. |
| 00:20-00:40 | Lokální build a test | Ověří změnu před pushnutím. |
| 00:40-01:05 | Čtení existujícího CI | Najde trigger, prostředí a testovací příkaz. |
| 01:05-01:15 | Přestávka |  |
| 01:15-01:45 | Rozbij a oprav CI | Najde první relevantní chybu v logu a opraví ji. |
| 01:45-02:10 | Povinné kontroly a PR titul | Zažije blokovaný merge a napraví příčinu. |
| 02:10-02:35 | Release a Pages | Propojí merge, release, tag a nasazený web. |
| 02:35-02:50 | Samostatná závěrečná změna | Provede celý tok bez krokového diktování. |
| 02:50-03:00 | Debrief | Umí popsat cestu změny do produkovaného artefaktu. |

Při skluzu nech účastníky workflow hlavně číst a opravovat. Psaní celého YAML od nuly a detail semantic-release může být pouze ukázka.

Debrief otázky:

- Proč lokální zelený test nestačí jako týmová kontrola?
- Kde v Actions hledáš první užitečnou chybu?
- Co je rozdíl mezi workflow, povinnou kontrolou a pravidlem větve?
- Jak Conventional Commits ovlivňují release?

## Závěrečná kontrola dovedností

Účastník bez nápovědy:

- zjistí stav repozitáře a aktuální větev,
- vytvoří větev podle konvence,
- připraví malý commit a zkontroluje diff,
- bezpečně synchronizuje vzdálené změny,
- otevře pull request a požádá o review,
- přečte neúspěšné workflow a opraví příčinu,
- vyřeší běžný konflikt,
- vysvětlí, proč neposílá hesla ani tokeny do repozitáře nebo chatu.
