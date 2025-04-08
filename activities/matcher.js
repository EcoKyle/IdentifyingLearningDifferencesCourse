(function tryInitMatcher() {
  const container = document.getElementById("matcher-container");

  if (!container) {
    console.warn("⚠️ matcher-container not found. Retrying...");
    return setTimeout(tryInitMatcher, 100);
  }

  console.log("✅ matcher-container found. Initializing matcher activity.");
  initMatcherActivity(container);
})();

function initMatcherActivity(container) {
  const config = {
    prompt: "Match each learning term to its description.",
    pairs: [
      {
        label: "Executive Function",
        definitions: [
          "Mental skills that help plan, focus, and manage tasks.",
          "Includes organization, time management, and self-control."
        ]
      },
      {
        label: "Working Memory",
        definitions: [
          "Holding and using information briefly (e.g., remembering directions).",
          "Short-term mental storage for steps and sequences."
        ]
      },
      {
        label: "Decoding",
        definitions: [
          "Figuring out written words based on letter-sound rules.",
          "The process of sounding out unfamiliar written words."
        ]
      },
      {
        label: "Processing Speed",
        definitions: [
          "How quickly a student can take in and respond to information.",
          "The pace at which a student processes written or spoken input."
        ]
      },
      {
        label: "Flexible Thinking",
        definitions: [
          "Adjusting to change or seeing things in new ways.",
          "Being able to shift perspectives or problem-solving approaches."
        ]
      },
      {
        label: "Self-Regulation",
        definitions: [
          "Managing emotions and actions to meet goals or stay calm.",
          "Using strategies to stay focused, calm, or organized."
        ]
      },
      {
        label: "Sensory Processing",
        definitions: [
          "How the brain handles sights, sounds, and other sensory input.",
          "Students may react strongly or avoid certain sensory experiences."
        ]
      },
      {
        label: "Task Initiation",
        definitions: [
          "Starting work without delay or needing lots of prompts.",
          "The ability to begin a task even when it's challenging."
        ]
      },
      {
        label: "Attention Shifting",
        definitions: [
          "Moving focus from one thing to another (like activities or ideas).",
          "Helps students adapt when routines or topics change."
        ]
      },
      {
        label: "Learning Profile",
        definitions: [
          "A summary of how a student learns best, including strengths and needs.",
          "Helps teachers choose strategies that match student preferences."
        ]
      }
    ]
  };

  // ⬇️ All matching logic goes here, INSIDE the function

  const finalPairs = config.pairs.map(pair => ({
    label: pair.label,
    definition: pair.definitions[Math.floor(Math.random() * pair.definitions.length)]
  }));

  const shuffledDefs = [...finalPairs]
    .map(pair => ({ ...pair, id: crypto.randomUUID() }))
    .sort(() => Math.random() - 0.5);

  const promptEl = document.createElement("p");
  promptEl.textContent = config.prompt;
  container.appendChild(promptEl);

  const grid = document.createElement("div");
  grid.className = "match-grid";

  finalPairs.forEach(pair => {
    const row = document.createElement("div");
    row.className = "match-row";

    const label = document.createElement("div");
    label.className = "match-label";
    label.textContent = pair.label;

    const dropzone = document.createElement("div");
    dropzone.className = "match-dropzone";
    dropzone.setAttribute("role", "button");
    dropzone.setAttribute("tabindex", "0");
    dropzone.setAttribute("aria-label", `Drop zone for ${pair.label}`);
    dropzone.dataset.correct = pair.definition;
    dropzone.textContent = "Drop definition here";

    row.append(label, dropzone);
    grid.appendChild(row);
  });

  container.appendChild(grid);

  const dragArea = document.createElement("div");
  dragArea.className = "match-draggables";

  shuffledDefs.forEach(pair => {
    const defCard = document.createElement("div");
    defCard.className = "draggable-definition";
    defCard.textContent = pair.definition;
    defCard.draggable = true;
    defCard.dataset.definition = pair.definition;
    defCard.dataset.id = pair.id;

    defCard.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", pair.definition);
    });

    dragArea.appendChild(defCard);
  });

  container.appendChild(dragArea);

  const dropzones = container.querySelectorAll(".match-dropzone");
  dropzones.forEach(zone => {
    zone.addEventListener("dragover", e => e.preventDefault());
    zone.addEventListener("drop", e => {
      e.preventDefault();
      const def = e.dataTransfer.getData("text/plain");
      const dropped = container.querySelector(`[data-definition="${def}"]`);
      if (dropped) {
        zone.textContent = def;
        zone.dataset.selected = def;
        dropped.remove();
        zone.classList.add("filled");
        if (isComplete()) checkMatch();
      }
    });
  });

  const feedback = document.createElement("p");
  feedback.id = "match-feedback";
  feedback.setAttribute("aria-live", "polite");
  feedback.className = "profile-feedback";
  container.appendChild(feedback);

  const tryAgainBtn = document.createElement("button");
  tryAgainBtn.textContent = "Try Again";
  tryAgainBtn.style.display = "none";
  tryAgainBtn.onclick = resetActivity;
  container.appendChild(tryAgainBtn);

  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Reset Activity";
  resetBtn.onclick = resetActivity;
  container.appendChild(resetBtn);

  function isComplete() {
    return Array.from(dropzones).every(zone => zone.dataset.selected);
  }

  function checkMatch() {
    let allCorrect = true;
    dropzones.forEach(zone => {
      zone.classList.remove("incorrect-match");
      if (zone.dataset.selected !== zone.dataset.correct) {
        allCorrect = false;
        zone.classList.add("incorrect-match");
      }
    });

    feedback.textContent = allCorrect
      ? "✅ Great job! All matches are correct."
      : "❌ Some matches are incorrect. Try again.";
    tryAgainBtn.style.display = allCorrect ? "none" : "inline-block";
  }

  function resetActivity() {
    container.innerHTML = "";
    initMatcherActivity(container);
  }
}
