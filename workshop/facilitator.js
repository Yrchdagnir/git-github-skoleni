import { chapters, steps } from "./content.js";

const baseInput = document.querySelector("#base-url");
const container = document.querySelector("#facilitator-steps");
const toast = document.querySelector("#toast");
const defaultBase = new URL("./", window.location.href).href;
baseInput.value = defaultBase;

function unlockUrl(id) {
  const value = baseInput.value.trim() || defaultBase;
  const url = new URL(value, window.location.href);
  url.searchParams.set("unlock", id);
  return url.href;
}

let toastTimeout;
async function copy(value) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  clearTimeout(toastTimeout);
  toast.textContent = "Odemykací odkaz zkopírován";
  toast.hidden = false;
  toastTimeout = window.setTimeout(() => { toast.hidden = true; }, 2200);
}

chapters.forEach(chapter => {
  const section = document.createElement("section");
  section.className = "facilitator-chapter";
  const heading = document.createElement("h2");
  heading.textContent = `${chapter.number} · ${chapter.name.cs}`;
  const list = document.createElement("div");
  list.className = "facilitator-list";
  steps.forEach((step, index) => {
    if (step.chapter !== chapter.id) return;
    const row = document.createElement("div");
    row.className = "facilitator-step";
    row.dataset.stepId = step.id;
    const number = document.createElement("span");
    number.textContent = String(index + 1).padStart(2, "0");
    const description = document.createElement("div");
    description.innerHTML = `<strong>${step.content.cs.title}</strong><small>${step.duration} min · ${step.id}</small>`;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Kopírovat odkaz";
    button.addEventListener("click", () => copy(unlockUrl(step.id)));
    row.append(number, description, button);
    list.append(row);
  });
  section.append(heading, list);
  container.append(section);
});

document.querySelector("#copy-current").addEventListener("click", () => copy(unlockUrl(steps[0].id)));
