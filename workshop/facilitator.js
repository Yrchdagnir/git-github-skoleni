import { chapters, steps } from "./content.js";

const notesContainer = document.querySelector("#facilitator-notes");
const chapterNav = document.querySelector("#facilitator-chapter-nav");
const search = document.querySelector("#notes-search");
const empty = document.querySelector("#notes-empty");

document.querySelector("#step-count").textContent = String(steps.length);
document.querySelector("#duration-total").textContent = String(steps.reduce((total, step) => total + step.duration, 0));

function textBlock(title, paragraphs, className = "") {
  const section = document.createElement("section");
  section.className = `note-block ${className}`.trim();
  const heading = document.createElement("h3");
  heading.textContent = title;
  section.append(heading);
  paragraphs.forEach(text => {
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    section.append(paragraph);
  });
  return section;
}

function commandsBlock(commands) {
  if (!commands.length) return null;
  const section = document.createElement("section");
  section.className = "note-block note-commands";
  const heading = document.createElement("h3");
  heading.textContent = "Příkazy k demonstraci";
  section.append(heading);
  commands.forEach(command => {
    const item = document.createElement("div");
    item.className = command.warning ? "note-command warning" : "note-command";
    const code = document.createElement("code");
    code.textContent = command.code;
    const description = document.createElement("p");
    description.textContent = command.description.cs;
    item.append(code, description);
    section.append(item);
  });
  return section;
}

function lessonNote(step, index) {
  const content = step.content.cs;
  const details = document.createElement("details");
  details.className = "lesson-note";
  details.dataset.stepId = step.id;
  details.dataset.search = [content.title, content.summary, ...content.theory, ...content.task, ...content.expected, ...content.errors, content.question, ...step.commands.flatMap(item => [item.code, item.description.cs])].join(" ").toLocaleLowerCase("cs");

  const summary = document.createElement("summary");
  summary.innerHTML = `<span class="note-number">${String(index + 1).padStart(2, "0")}</span><span class="note-summary-text"><strong>${content.title}</strong><small>${content.summary}</small></span><span class="note-duration">${step.duration} min</span>`;

  const body = document.createElement("div");
  body.className = "lesson-note-body";
  const theory = textBlock("Hlavní myšlenka", content.theory);
  const task = textBlock("Aktivita účastníků", content.task, "task-note");
  const expected = textBlock("Očekávaný výsledek", content.expected, "success-note");
  const errors = textBlock("Na co si dát pozor", content.errors, "warning-note");
  const debrief = textBlock("Debrief", [content.question], "debrief-note");
  const commands = commandsBlock(step.commands);

  const footer = document.createElement("footer");
  footer.className = "lesson-note-footer";
  const link = document.createElement("a");
  link.href = `./#${step.id}`;
  link.textContent = "Otevřít lekci v průvodci";
  footer.append(link);

  body.append(theory, task, expected, errors, debrief);
  if (commands) body.append(commands);
  body.append(footer);
  details.append(summary, body);
  return details;
}

function render() {
  const query = search.value.trim().toLocaleLowerCase("cs");
  let visibleCount = 0;
  notesContainer.replaceChildren();
  chapterNav.replaceChildren();

  chapters.forEach(chapter => {
    const chapterSteps = steps.map((step, index) => ({ step, index })).filter(({ step }) => step.chapter === chapter.id && (!query || lessonNoteSearch(step).includes(query)));
    if (!chapterSteps.length) return;
    visibleCount += chapterSteps.length;

    const navLink = document.createElement("a");
    navLink.href = `#notes-${chapter.id}`;
    navLink.textContent = `${chapter.number} ${chapter.name.cs}`;
    chapterNav.append(navLink);

    const section = document.createElement("section");
    section.className = "notes-chapter";
    section.id = `notes-${chapter.id}`;
    const heading = document.createElement("div");
    heading.className = "notes-chapter-heading";
    heading.innerHTML = `<span>${chapter.number}</span><div><h2>${chapter.name.cs}</h2><p>${chapter.description.cs}</p></div>`;
    const list = document.createElement("div");
    list.className = "notes-list";
    chapterSteps.forEach(({ step, index }) => list.append(lessonNote(step, index)));
    section.append(heading, list);
    notesContainer.append(section);
  });

  empty.hidden = visibleCount > 0;
  if (query) document.querySelectorAll(".lesson-note").forEach(note => { note.open = true; });
}

function lessonNoteSearch(step) {
  const content = step.content.cs;
  return [content.title, content.summary, ...content.theory, ...content.task, ...content.expected, ...content.errors, content.question, ...step.commands.flatMap(item => [item.code, item.description.cs])].join(" ").toLocaleLowerCase("cs");
}

search.addEventListener("input", render);
document.querySelector("#expand-all").addEventListener("click", () => document.querySelectorAll(".lesson-note").forEach(note => { note.open = true; }));
document.querySelector("#collapse-all").addEventListener("click", () => document.querySelectorAll(".lesson-note").forEach(note => { note.open = false; }));

render();
