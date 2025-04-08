// --- 1. STORAGE UTILITIES ---
function saveCourseSection(value) {
  localStorage.setItem("course_section", value);
}

function getSavedCourseSection() {
  return parseInt(localStorage.getItem("course_section"));
}

// --- 2. GLOBAL STATE INIT ---
let savedSection = getSavedCourseSection();
let currentSection = Number.isInteger(savedSection) && savedSection > 0 ? savedSection : 1;
const totalSections = 17;
let maxVisited = currentSection;

const progressBar = document.getElementById("progress");
const progressText = document.getElementById("progress-text");

// --- 3. UI FUNCTIONS ---
function updateProgress() {
  const progress = ((maxVisited - 1) / (totalSections - 1)) * 100;
  progressBar.style.width = progress + "%";
  progressText.textContent = Math.round(progress) + "%";
  progressBar.setAttribute("aria-valuenow", Math.round(progress));
}

async function loadSectionContent(sectionNumber) {
  const container = document.getElementById("section-container");
  if (!container) return;

  try {
    const response = await fetch(`sections/section${sectionNumber}.html`);
    if (!response.ok) throw new Error(`Fetch error: ${response.status}`);
    const html = await response.text();

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    const scripts = tempDiv.querySelectorAll("script[src]");
    scripts.forEach(script => script.remove());

    container.innerHTML = tempDiv.innerHTML;

    scripts.forEach(oldScript => {
      const newScript = document.createElement("script");
      newScript.src = oldScript.src + `?v=${Date.now()}`;
      newScript.type = oldScript.type || "text/javascript";
      document.body.appendChild(newScript);
    });

  } catch (err) {
    container.innerHTML = `<p style="color:red;">⚠️ Error loading section ${sectionNumber}. Please check the file path or folder structure.</p>`;
  }
}

function updateNavButtons() {
  document.getElementById("prevBtn").disabled = currentSection === 1;
  document.getElementById("nextBtn").disabled = currentSection === totalSections;
}

async function showSection(sectionNumber) {
  currentSection = sectionNumber;
  saveCourseSection(currentSection);
  if (sectionNumber > maxVisited) maxVisited = sectionNumber;

  await loadSectionContent(sectionNumber);
  updateProgress();
  updateNavButtons();

  const activeSection = document.getElementById("section-container");
  activeSection.classList.remove("fade-in");
  void activeSection.offsetWidth;
  activeSection.classList.add("fade-in");

  if (sectionNumber === totalSections) logCompletionIfNeeded();
}

// --- 4. NAVIGATION HANDLERS ---
function nextSection() {
  if (currentSection < totalSections) {
    showSection(currentSection + 1);
  }
}

function prevSection() {
  if (currentSection > 1) {
    showSection(currentSection - 1);
  }
}

// --- 5. COMPLETION TRACKING ---
function logCompletionIfNeeded() {
  const alreadyCompleted = localStorage.getItem("course_completed");
  if (!alreadyCompleted) {
    const timestamp = new Date().toISOString();
    localStorage.setItem(
      "course_completed",
      JSON.stringify({
        completed: true,
        timestamp: timestamp,
        lastSection: totalSections
      })
    );
  }
}

// --- 6. RESET SUPPORT ---
function clearProgress() {
  localStorage.clear(); // clears everything in your course scope
  window.location.href = window.location.origin + window.location.pathname; // clean refresh
}

// --- 7. DOM READY ---
document.addEventListener("DOMContentLoaded", function () {
  showSection(currentSection);

  const resetBtn = document.getElementById("clearProgressBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", clearProgress);
  }

  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");

  if (nextBtn) nextBtn.addEventListener("click", nextSection);
  if (prevBtn) prevBtn.addEventListener("click", prevSection);
});

// --- 8. KEYBOARD NAVIGATION ---
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowRight" && !document.getElementById("nextBtn").disabled) {
    nextSection();
  } else if (event.key === "ArrowLeft" && !document.getElementById("prevBtn").disabled) {
    prevSection();
  }
});
