import { chapters, cheatSheet, steps } from "./content.js";

const STORAGE = {
  locale: "git-workshop.locale",
  completed: "git-workshop.completed"
};

const ui = {
  cs: {
    documentTitle: "Průvodce školením | Git a GitHub",
    brandContext: "Alchymistická dílna",
    progress: "Postup",
    reset: "Resetovat postup",
    resetConfirm: "Opravdu chceš smazat všechny dokončené kroky?",
    lessonView: "Kapitola",
    cheatView: "Tahák",
    theory: "Nejdřív si ujasníme",
    commands: "Příkazy",
    task: "Praktický úkol",
    expected: "Očekávaný výsledek",
    errors: "Když se něco nedaří",
    check: "Kontrolní otázka",
    complete: "Tomuto kroku rozumím",
    previous: "Předchozí",
    next: "Další",
    minutes: value => `${value} min`,
    cheatEyebrow: "Po ruce",
    cheatTitle: "Git tahák",
    search: "Hledat v taháku",
    searchPlaceholder: "Hledat příkaz…",
    empty: "Žádný příkaz neodpovídá hledání.",
    copy: "Kopírovat příkaz",
    copied: "Příkaz zkopírován",
    copyFailed: "Kopírování se nezdařilo",
    warning: "Pozor",
    chapterLabel: "Kapitoly školení",
    lessonNav: "Pohyb mezi kroky"
  },
  sk: {
    documentTitle: "Sprievodca školením | Git a GitHub",
    brandContext: "Alchymistická dielňa",
    progress: "Postup",
    reset: "Resetovať postup",
    resetConfirm: "Naozaj chceš zmazať všetky dokončené kroky?",
    lessonView: "Kapitola",
    cheatView: "Ťahák",
    theory: "Najprv si ujasníme",
    commands: "Príkazy",
    task: "Praktická úloha",
    expected: "Očakávaný výsledok",
    errors: "Keď sa niečo nedarí",
    check: "Kontrolná otázka",
    complete: "Tomuto kroku rozumiem",
    previous: "Predchádzajúci",
    next: "Ďalší",
    minutes: value => `${value} min`,
    cheatEyebrow: "Poruke",
    cheatTitle: "Git ťahák",
    search: "Hľadať v ťaháku",
    searchPlaceholder: "Hľadať príkaz…",
    empty: "Žiadny príkaz nezodpovedá hľadaniu.",
    copy: "Kopírovať príkaz",
    copied: "Príkaz skopírovaný",
    copyFailed: "Kopírovanie sa nepodarilo",
    warning: "Pozor",
    chapterLabel: "Kapitoly školenia",
    lessonNav: "Pohyb medzi krokmi"
  }
};

const elements = {
  brandContext: document.querySelector("#brand-context"),
  chapterNav: document.querySelector("#chapter-nav"),
  chapterSidebar: document.querySelector(".chapter-sidebar"),
  lessonPanel: document.querySelector("#lesson-panel"),
  cheatPanel: document.querySelector("#cheatsheet-panel"),
  progressLabel: document.querySelector("#progress-label"),
  progressValue: document.querySelector("#progress-value"),
  progressBar: document.querySelector("#progress-bar"),
  reset: document.querySelector("#reset-progress"),
  lessonChapter: document.querySelector("#lesson-chapter"),
  lessonTitle: document.querySelector("#lesson-title"),
  lessonDuration: document.querySelector("#lesson-duration"),
  lessonSummary: document.querySelector("#lesson-summary"),
  theoryTitle: document.querySelector("#theory-title"),
  theory: document.querySelector("#lesson-theory"),
  commandsSection: document.querySelector("#commands-section"),
  commandsTitle: document.querySelector("#commands-title"),
  commands: document.querySelector("#lesson-commands"),
  taskTitle: document.querySelector("#task-title"),
  task: document.querySelector("#lesson-task"),
  expectedTitle: document.querySelector("#expected-title"),
  expected: document.querySelector("#lesson-expected"),
  errorsTitle: document.querySelector("#errors-title"),
  errors: document.querySelector("#lesson-errors"),
  checkLabel: document.querySelector("#check-label"),
  checkTitle: document.querySelector("#check-title"),
  complete: document.querySelector("#complete-step"),
  completeLabel: document.querySelector("#complete-label"),
  previous: document.querySelector("#previous-step"),
  next: document.querySelector("#next-step"),
  cheatEyebrow: document.querySelector("#cheatsheet-eyebrow"),
  cheatTitle: document.querySelector("#cheatsheet-title"),
  searchLabel: document.querySelector("#search-label"),
  search: document.querySelector("#cheatsheet-search"),
  cheatContent: document.querySelector("#cheatsheet-content"),
  cheatEmpty: document.querySelector("#cheatsheet-empty"),
  toast: document.querySelector("#toast"),
  mobileButtons: [...document.querySelectorAll("[data-mobile-view]")],
  languageButtons: [...document.querySelectorAll("[data-locale]")]
};

function safeCompleted() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE.completed) ?? "[]");
    return new Set(Array.isArray(parsed) ? parsed.filter(id => steps.some(step => step.id === id)) : []);
  } catch {
    return new Set();
  }
}

const storedLocale = localStorage.getItem(STORAGE.locale);
const state = {
  locale: storedLocale === "sk" ? "sk" : "cs",
  completed: safeCompleted(),
  currentIndex: 0,
  mobileView: "lesson"
};

function saveCompleted() {
  localStorage.setItem(STORAGE.completed, JSON.stringify([...state.completed]));
}

function cleanLegacyUnlockParameter() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("unlock")) return;
  url.searchParams.delete("unlock");
  history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

function readLessonHash() {
  const id = window.location.hash.slice(1);
  const index = steps.findIndex(step => step.id === id);
  if (index >= 0) state.currentIndex = index;
}

function paragraphList(target, paragraphs) {
  target.replaceChildren(...paragraphs.map(text => {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    return paragraph;
  }));
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    showToast(ui[state.locale].copied);
  } catch {
    const input = document.createElement("textarea");
    input.value = value;
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    const succeeded = document.execCommand("copy");
    input.remove();
    showToast(succeeded ? ui[state.locale].copied : ui[state.locale].copyFailed);
  }
}

let toastTimeout;
function showToast(message) {
  clearTimeout(toastTimeout);
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  toastTimeout = window.setTimeout(() => { elements.toast.hidden = true; }, 2200);
}

function copyButton(code) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "copy-button";
  button.setAttribute("aria-label", ui[state.locale].copy);
  button.title = ui[state.locale].copy;
  button.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M15 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h3"/></svg>';
  button.addEventListener("click", () => copyText(code));
  return button;
}

function commandCard(item, compact = false) {
  const wrapper = document.createElement("div");
  wrapper.className = `${compact ? "cheat-command" : "command-card"}${item.warning ? " warning-command" : ""}`;
  const codeRow = document.createElement("div");
  codeRow.className = "code-row";
  const code = document.createElement("code");
  code.textContent = item.code;
  codeRow.append(code, copyButton(item.code));
  const description = document.createElement("p");
  description.textContent = item.description[state.locale];
  wrapper.append(codeRow, description);
  if (item.warning) {
    const warning = document.createElement("span");
    warning.className = "warning-label";
    warning.textContent = ui[state.locale].warning;
    wrapper.prepend(warning);
  }
  return wrapper;
}

function renderNavigation() {
  elements.chapterNav.replaceChildren();
  chapters.forEach(chapter => {
    const section = document.createElement("section");
    section.className = "chapter-group";
    const heading = document.createElement("div");
    heading.className = "chapter-heading";
    heading.innerHTML = `<span>${chapter.number}</span><div><strong>${chapter.name[state.locale]}</strong><small>${chapter.description[state.locale]}</small></div>`;
    const list = document.createElement("ol");
    steps.forEach((step, index) => {
      if (step.chapter !== chapter.id) return;
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.stepId = step.id;
      button.className = "step-link";
      if (index === state.currentIndex) button.setAttribute("aria-current", "step");
      const marker = state.completed.has(step.id) ? "✓" : String(index + 1).padStart(2, "0");
      button.innerHTML = `<span class="step-marker" aria-hidden="true">${marker}</span><span>${step.content[state.locale].title}</span>`;
      button.addEventListener("click", () => selectStep(index));
      item.append(button);
      list.append(item);
    });
    section.append(heading, list);
    elements.chapterNav.append(section);
  });
}

function renderLesson() {
  const step = steps[state.currentIndex];
  const content = step.content[state.locale];
  const chapter = chapters.find(item => item.id === step.chapter);
  elements.lessonChapter.textContent = `${chapter.number} · ${chapter.name[state.locale]}`;
  elements.lessonTitle.textContent = content.title;
  elements.lessonDuration.textContent = ui[state.locale].minutes(step.duration);
  elements.lessonSummary.textContent = content.summary;
  paragraphList(elements.theory, content.theory);
  paragraphList(elements.task, content.task);
  paragraphList(elements.expected, content.expected);
  paragraphList(elements.errors, content.errors);
  elements.checkTitle.textContent = content.question;
  elements.commands.replaceChildren(...step.commands.map(item => commandCard(item)));
  elements.commandsSection.hidden = step.commands.length === 0;
  elements.complete.checked = state.completed.has(step.id);
  elements.previous.disabled = state.currentIndex === 0;
  elements.next.disabled = state.currentIndex === steps.length - 1;
}

function renderProgress() {
  elements.progressValue.textContent = `${state.completed.size} / ${steps.length}`;
  elements.progressBar.max = steps.length;
  elements.progressBar.value = state.completed.size;
}

function renderCheatSheet() {
  const query = elements.search.value.trim().toLocaleLowerCase(state.locale);
  let visibleCount = 0;
  elements.cheatContent.replaceChildren(...cheatSheet.map(category => {
    const matches = category.items.filter(item => {
      const haystack = `${item.code} ${item.description[state.locale]} ${category.name[state.locale]}`.toLocaleLowerCase(state.locale);
      return !query || haystack.includes(query);
    });
    if (!matches.length) return null;
    visibleCount += matches.length;
    const details = document.createElement("details");
    details.className = "cheat-group";
    details.open = Boolean(query) || ["state", "changes"].includes(category.id);
    const summary = document.createElement("summary");
    summary.innerHTML = `<span>${category.name[state.locale]}</span><span>${matches.length}</span>`;
    const body = document.createElement("div");
    body.replaceChildren(...matches.map(item => commandCard(item, true)));
    details.append(summary, body);
    return details;
  }).filter(Boolean));
  elements.cheatEmpty.hidden = visibleCount > 0;
}

function renderLabels() {
  const text = ui[state.locale];
  document.documentElement.lang = state.locale;
  document.title = text.documentTitle;
  elements.brandContext.textContent = text.brandContext;
  elements.progressLabel.textContent = text.progress;
  elements.reset.textContent = text.reset;
  elements.theoryTitle.textContent = text.theory;
  elements.commandsTitle.textContent = text.commands;
  elements.taskTitle.textContent = text.task;
  elements.expectedTitle.textContent = text.expected;
  elements.errorsTitle.textContent = text.errors;
  elements.checkLabel.textContent = text.check;
  elements.completeLabel.textContent = text.complete;
  elements.previous.textContent = `← ${text.previous}`;
  elements.next.textContent = `${text.next} →`;
  elements.cheatEyebrow.textContent = text.cheatEyebrow;
  elements.cheatTitle.textContent = text.cheatTitle;
  elements.searchLabel.textContent = text.search;
  elements.search.placeholder = text.searchPlaceholder;
  elements.cheatEmpty.textContent = text.empty;
  elements.chapterSidebar.setAttribute("aria-label", text.chapterLabel);
  document.querySelector(".lesson-pagination").setAttribute("aria-label", text.lessonNav);
  elements.mobileButtons[0].textContent = text.lessonView;
  elements.mobileButtons[1].textContent = text.cheatView;
  elements.languageButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.locale === state.locale)));
}

function render() {
  renderLabels();
  renderNavigation();
  renderLesson();
  renderProgress();
  renderCheatSheet();
}

function selectStep(index) {
  if (index < 0 || index >= steps.length) return;
  state.currentIndex = index;
  history.replaceState({}, "", `${window.location.pathname}${window.location.search}#${steps[index].id}`);
  renderNavigation();
  renderLesson();
  if (window.matchMedia("(max-width: 820px)").matches) setMobileView("lesson");
  elements.lessonPanel.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setMobileView(view) {
  state.mobileView = view;
  document.body.dataset.mobileView = view;
  elements.mobileButtons.forEach(button => button.setAttribute("aria-selected", String(button.dataset.mobileView === view)));
}

elements.complete.addEventListener("change", () => {
  const id = steps[state.currentIndex].id;
  if (elements.complete.checked) state.completed.add(id);
  else state.completed.delete(id);
  saveCompleted();
  renderNavigation();
  renderProgress();
});

elements.previous.addEventListener("click", () => selectStep(state.currentIndex - 1));
elements.next.addEventListener("click", () => selectStep(state.currentIndex + 1));
elements.search.addEventListener("input", renderCheatSheet);
elements.reset.addEventListener("click", () => {
  if (!window.confirm(ui[state.locale].resetConfirm)) return;
  state.currentIndex = 0;
  state.completed.clear();
  localStorage.removeItem(STORAGE.completed);
  history.replaceState({}, "", `${window.location.pathname}${window.location.search}`);
  render();
});
elements.languageButtons.forEach(button => button.addEventListener("click", () => {
  state.locale = button.dataset.locale;
  localStorage.setItem(STORAGE.locale, state.locale);
  render();
}));
elements.mobileButtons.forEach(button => button.addEventListener("click", () => setMobileView(button.dataset.mobileView)));

cleanLegacyUnlockParameter();
localStorage.removeItem("git-workshop.maxUnlocked");
readLessonHash();
setMobileView("lesson");
render();
