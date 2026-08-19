# Git a GitHub: školicí sandbox

Veřejný cvičný repozitář pro tři navazující workshopy:

1. lokální Git,
2. spolupráce přes GitHub,
3. GitHub Actions a Playwright.

Repo neobsahuje žádná interní týmová data. Archiv lektvarů je malá statická aplikace, do které se přidávají recepty. Účastník nemusí programovat: zkopíruje JSON šablonu, doplní texty a volitelně přidá obrázek.

Rozhraní i startovní recepty lze přepínat mezi češtinou a slovenštinou.

## Veřejný web

- [Krokový průvodce školením](https://yrchdagnir.github.io/git-github-skoleni/workshop/)
- [Archiv lektvarů](https://yrchdagnir.github.io/git-github-skoleni/)
- [Facilitátorské poznámky](https://yrchdagnir.github.io/git-github-skoleni/workshop/facilitator.html)

Průvodce je plně česky a slovensky a všechny lekce jsou stále dostupné. Dokončené kroky a jazyk se ukládají pouze v prohlížeči účastníka. Facilitátorská stránka obsahuje cíle, aktivity, očekávané výsledky, rizika a debrief otázky ke každé lekci.

## Příprava

Potřebuješ Git for Windows, Git Bash, aktuální Node.js LTS a npm.

```bash
git clone https://github.com/Yrchdagnir/git-github-skoleni.git
cd git-github-skoleni
npm ci
npx playwright install chromium
npm run doctor
npm test
```

## Přidej vlastní lektvar

1. Zkopíruj `recipes/_template.json` jako `recipes/<tvuj-login>-<lektvar>.json`.
2. V poli `locale` ponech `cs`, nebo zapiš `sk` pro slovenský recept.
3. Doplň `slug`, `name`, `effect`, `limitation` a alespoň dvě ingredience.
   - `slug` smí obsahovat jen malá písmena, číslice a pomlčky, například `ada-lektvar-soustredeni`.
   - Textová pole ani jednotlivé ingredience nesmějí být prázdné nebo obsahovat prázdný řádek.
4. Bez obrázku nech `"image": null`.
5. S obrázkem ulož soubor do `assets/potions/` a do `image` zapiš jeho cestu.

Příklad:

```json
{
  "locale": "cs",
  "slug": "ada-potion-of-focus",
  "name": "Lektvar soustředění",
  "effect": "Pomůže alchymistce dopsat jeden recept bez vyrušení.",
  "limitation": "Účinek trvá jen deset minut.",
  "ingredients": ["šalvěj", "kapka rosy"],
  "image": null
}
```

Pro překlad přidej druhý soubor se stejným `slug`, ale s `"locale": "sk"`. Každá kombinace jazyka a slugu musí být jedinečná.

Kontrola receptu:

```bash
npm run build
npm test
```

## Aplikace

```bash
npm run dev
```

Otevři <http://127.0.0.1:4173>.

## Testy

```bash
npm test
npm run test:headed
```

Testy ověřují sestavení receptů, přepnutí jazyka, obrázek, rozbalení ingrediencí a mobilní zobrazení.

## Větve pro cvičení

```text
participant/<github-user>/<tema>
```

Do `main` se neposílá přímo. Změna jde přes pull request, review a automatické kontroly.

## Conventional Commits

Povolené typy názvu PR:

```text
feat: fix: docs: test: ci: chore: refactor:
```

Pracovní commity i názvy PR používají Conventional Commits. PR se slučují volbou **Create a merge commit** a `semantic-release` čte skutečné commity v historii:

- `fix:` -> patch,
- `feat:` -> minor,
- `!` nebo `BREAKING CHANGE:` -> major.

## Actions

- `CI` spouští Playwright a při chybě ukládá report.
- `Semantic PR title` kontroluje název pull requestu.
- `Release` vytváří tag a GitHub Release.
- `Deploy Potion Archive` po testech publikuje web na GitHub Pages.

## Bezpečnost cvičení

- Nepoužívej skutečná hesla, tokeny ani produkční data.
- `reset --hard` patří jen do zahoditelného lokálního repa.
- Nepoužívej force push na `main`.
- Při problému začni `git status` a přečtením historie.
