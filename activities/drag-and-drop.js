(function tryInitSorter() {
  const container = document.getElementById("drag-drop-container");

  if (!container) {
    console.warn("⚠️ drag-drop-container not found. Retrying...");
    return setTimeout(tryInitSorter, 100);
  }

  console.log("✅ drag-drop-container found. Initializing activity.");
  initBehaviorSorter(container);
})();

function initBehaviorSorter(container) {
  const ITEMS_PER_CATEGORY = 6;

  const config = {
    prompt: "Sort each student statement into either observable behaviors or subjective interpretations.",
    categories: [
      { id: "observable", label: "✅ Observable Behaviors" },
      { id: "subjective", label: "🚫 Subjective Labels" }
    ],
    items: [
      // Observable behaviors
      { text: "Student looked around the room for 10 seconds before starting the task.", category: "observable" },
      { text: "Student taps their pencil rhythmically on the desk.", category: "observable" },
      { text: "Student asks for help after reading instructions silently.", category: "observable" },
      { text: "Student avoids eye contact when addressed directly.", category: "observable" },
      { text: "Student contributes rich ideas during group discussions but avoids writing tasks.", category: "observable" },
      { text: "Student uses a graphic organizer to break down steps before writing.", category: "observable" },
      { text: "Student rereads material multiple times before answering.", category: "observable" },

      // Subjective labels
      { text: "Student is lazy and doesn't try.", category: "subjective" },
      { text: "Student lacks motivation and doesn’t care about learning.", category: "subjective" },
      { text: "Student is disrespectful because they avoid eye contact.", category: "subjective" },
      { text: "Student is resistant and refuses to cooperate.", category: "subjective" },
      { text: "Student just doesn’t want to learn.", category: "subjective" },
      { text: "Student is always off-task and unprepared.", category: "subjective" },
      { text: "Student shows no interest and gives up quickly.", category: "subjective" }
    ]
  };

  function selectBalancedItems() {
    const grouped = {
      observable: [],
      subjective: []
    };

    config.items.forEach(item => grouped[item.category].push({ ...item, id: crypto.randomUUID() }));

    return [...grouped.observable.sort(() => 0.5 - Math.random()).slice(0, ITEMS_PER_CATEGORY),
            ...grouped.subjective.sort(() => 0.5 - Math.random()).slice(0, ITEMS_PER_CATEGORY)]
            .sort(() => Math.random() - 0.5);
  }

  let sessionItems = [];

  function saveProgress() {
    const placements = {};
    config.categories.forEach(cat => {
      const zone = document.getElementById(cat.id);
      const items = zone.querySelectorAll(".draggable");
      placements[cat.id] = Array.from(items).map(item => ({
        id: item.dataset.id,
        text: item.textContent,
        category: item.dataset.category
      }));
    });
    localStorage.setItem("behavior-sorter-progress", JSON.stringify(placements));
  }

  function loadProgress() {
    const saved = localStorage.getItem("behavior-sorter-progress");
    return saved ? JSON.parse(saved) : null;
  }

  function initActivity() {
    container.innerHTML = "";

    const prompt = document.createElement("p");
    prompt.textContent = config.prompt;
    container.appendChild(prompt);

    const dropzoneContainer = document.createElement("div");
    dropzoneContainer.classList.add("dropzones-wrapper");

    config.categories.forEach(cat => {
      const zone = document.createElement("div");
      zone.className = "dropzone";
      zone.id = cat.id;
      zone.dataset.category = cat.id;
      zone.dataset.label = cat.label;
      zone.setAttribute("aria-label", cat.label);
      zone.setAttribute("role", "region");
      zone.setAttribute("tabindex", "0");
      zone.innerHTML = `<strong>${cat.label}</strong>`;
      dropzoneContainer.appendChild(zone);
    });

    container.appendChild(dropzoneContainer);

    const dragItemsWrapper = document.createElement("div");
    dragItemsWrapper.id = "draggable-items";
    dragItemsWrapper.className = "draggables-container";

    sessionItems.forEach(item => {
      const el = document.createElement("div");
      el.className = "draggable";
      el.draggable = true;
      el.textContent = item.text;
      el.dataset.category = item.category;
      el.dataset.id = item.id;
      el.setAttribute("aria-label", item.text);
      dragItemsWrapper.appendChild(el);
    });

    container.appendChild(dragItemsWrapper);

    const feedback = document.createElement("p");
    feedback.id = "behavior-feedback";
    feedback.className = "profile-feedback";
    feedback.setAttribute("aria-live", "polite");
    container.appendChild(feedback);

    const tryAgainBtn = document.createElement("button");
    tryAgainBtn.textContent = "Try Again";
    tryAgainBtn.style.display = "none";
    tryAgainBtn.onclick = () => {
      localStorage.removeItem("behavior-sorter-progress");
      resetActivity();
    };
    container.appendChild(tryAgainBtn);

    const resetButton = document.createElement("button");
    resetButton.textContent = "Reset Activity";
    resetButton.onclick = () => {
      localStorage.removeItem("behavior-sorter-progress");
      resetActivity();
    };
    container.appendChild(resetButton);

    enableDragDrop(dragItemsWrapper, dropzoneContainer, feedback, tryAgainBtn);

    const saved = loadProgress();
    if (saved) {
      for (const catId in saved) {
        const zone = document.getElementById(catId);
        saved[catId].forEach(itemData => {
          const el = document.querySelector(`.draggable[data-id="${itemData.id}"]`);
          if (el) zone.appendChild(el);
        });
      }
      if (checkAllPlaced()) validateAnswers(dropzoneContainer.querySelectorAll(".dropzone"), feedback, tryAgainBtn);
    }
  }

  function enableDragDrop(dragItemsWrapper, dropzoneContainer, feedback, tryAgainBtn) {
    const draggables = dragItemsWrapper.querySelectorAll(".draggable");
    const dropzones = dropzoneContainer.querySelectorAll(".dropzone");

    draggables.forEach(draggable => {
      draggable.addEventListener("dragstart", event => {
        event.dataTransfer.setData("text/plain", draggable.dataset.id);
      });
    });

    dropzones.forEach(zone => {
      zone.addEventListener("dragover", event => event.preventDefault());

      zone.addEventListener("drop", event => {
        event.preventDefault();
        const draggedId = event.dataTransfer.getData("text/plain");
        const dragged = document.querySelector(`.draggable[data-id="${draggedId}"]`);
        if (dragged) {
          dragged.classList.remove("incorrect-behavior");
          zone.appendChild(dragged);
          zone.classList.add("filled");
          saveProgress();
        }

        if (checkAllPlaced()) validateAnswers(dropzones, feedback, tryAgainBtn);
      });
    });
  }

  function checkAllPlaced() {
    return document.querySelectorAll("#draggable-items .draggable").length === 0;
  }

  function validateAnswers(dropzones, feedback, tryAgainBtn) {
    let allCorrect = true;

    dropzones.forEach(zone => {
      const expected = zone.dataset.category;
      const items = zone.querySelectorAll(".draggable");

      items.forEach(item => {
        item.classList.remove("incorrect-behavior");
        if (item.dataset.category !== expected) {
          item.classList.add("incorrect-behavior");
          allCorrect = false;
        }
      });
    });

    feedback.textContent = allCorrect
      ? "✅ Great job! All behaviors are sorted correctly."
      : "❌ Some items are in the wrong category. Try again.";
    tryAgainBtn.style.display = allCorrect ? "none" : "inline-block";
  }

  function resetActivity() {
    sessionItems = selectBalancedItems();
    initActivity();
  }

  sessionItems = selectBalancedItems();
  initActivity();
}
