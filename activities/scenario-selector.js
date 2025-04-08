// 🧠 Learning Support Planner (Drag-and-Drop Summary Builder)
console.log("🧠 learning-support-planner.js is running");

(function tryInitPlanner() {
  const container = document.getElementById("planner-container");

  if (!container) {
    console.warn("⚠️ planner-container not found. Retrying...");
    return setTimeout(tryInitPlanner, 100);
  }

  console.log("✅ planner-container found. Initializing tool.");
  initScenarioPicker(container);
})();

function initScenarioPicker(container) {
  container.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = "Learning Support Planner";
  container.appendChild(title);

  const intro = document.createElement("p");
  intro.textContent = "Choose a student scenario to begin planning.";
  container.appendChild(intro);

  const scenarioList = [
    {
      id: "riley",
      name: "Riley",
      description:
        "Riley often shines in verbal tasks and collaborative group work but can seem frustrated with transitions or open-ended writing. He thrives when instructions are clear and steps are chunked.",
      strengths: [
        "Strong verbal reasoning",
        "Engages well in group discussions",
        "Responds well to chunked tasks"
      ],
      challenges: [
        "Avoids writing tasks",
        "Struggles with transitions",
        "Forgets instructions unless written"
      ],
      supports: [
        "Offer graphic organizers for writing",
        "Use visual schedules for transitions",
        "Provide written and verbal instructions"
      ]
    },
    {
      id: "jamie",
      name: "Jamie",
      description:
        "Jamie is an energetic, hands-on learner who participates enthusiastically in group discussions. They may need help getting started on independent tasks and remembering multi-step directions.",
      strengths: [
        "Participates enthusiastically in group discussions",
        "Grasps spatial concepts quickly using manipulatives"
      ],
      challenges: [
        "Struggles to begin writing assignments without verbal prompts",
        "Often forgets multi-step instructions unless written down"
      ],
      supports: [
        "Use written checklists",
        "Provide verbal prompts to initiate tasks",
        "Break down assignments into smaller steps"
      ]
    },
    {
      id: "kai",
      name: "Kai",
      description:
        "Kai finishes work quickly and enjoys tackling complex problems. However, transitions and organization can be a challenge, especially when tasks are long or abstract.",
      strengths: [
        "Finishes tasks early and asks for more challenges",
        "Excels when exploring topics of personal interest"
      ],
      challenges: [
        "Struggles to organize materials",
        "Looks confused during transitions",
        "Difficulty with multi-step tasks"
      ],
      supports: [
        "Offer advanced extensions for early finishers",
        "Provide visual schedules",
        "Use graphic organizers for planning"
      ]
    }
  ];

  scenarioList.forEach((scenario) => {
    const card = document.createElement("div");
    card.className = "vocab-card";
    card.innerHTML = `<h4>${scenario.name}</h4><p>${scenario.description}</p>`;

    const btn = document.createElement("button");
    btn.textContent = `Start Planning for ${scenario.name}`;
    btn.className = "button";
    btn.addEventListener("click", () => initSupportPlanner(container, scenario));
    card.appendChild(btn);

    container.appendChild(card);
  });
}

function initSupportPlanner(container, scenario) {
  container.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = `Support Plan Practice: ${scenario.name}`;
  container.appendChild(title);

  const prompt = document.createElement("p");
  prompt.textContent = `Sort the cards into categories based on ${scenario.name}'s profile. Then generate a sample support plan using your selections.`;
  container.appendChild(prompt);

  const dropzonesWrapper = document.createElement("div");
  dropzonesWrapper.className = "dropzones-wrapper";

  const categories = [
    { id: "strengths", label: "Strengths" },
    { id: "challenges", label: "Challenges" },
    { id: "supports", label: "Suggested Supports" }
  ];

  categories.forEach((cat) => {
    const zone = document.createElement("div");
    zone.className = "dropzone";
    zone.id = cat.id;
    zone.innerHTML = `<strong>${cat.label}</strong>`;
    dropzonesWrapper.appendChild(zone);
  });

  container.appendChild(dropzonesWrapper);

  const bank = document.createElement("div");
  bank.className = "draggables-container";
  container.appendChild(bank);

  const items = [
    ...scenario.strengths.map((text) => ({ text, type: "strengths" })),
    ...scenario.challenges.map((text) => ({ text, type: "challenges" })),
    ...scenario.supports.map((text) => ({ text, type: "supports" }))
  ];

  shuffle(items).forEach((item, i) => {
    const card = document.createElement("div");
    card.className = "draggable";
    card.draggable = true;
    card.textContent = item.text;
    card.dataset.type = item.type;
    card.dataset.id = `item-${i}`;
    card.setAttribute("aria-label", item.text);
    bank.appendChild(card);

    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", card.dataset.id);
    });
  });

  const dropzones = container.querySelectorAll(".dropzone");
  dropzones.forEach((zone) => {
    zone.addEventListener("dragover", (e) => e.preventDefault());
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain");
      const card = container.querySelector(`[data-id="${id}"]`);
      if (card) zone.appendChild(card);
    });
  });

  const generateBtn = document.createElement("button");
  generateBtn.textContent = "Generate Support Plan";
  generateBtn.className = "button";
  generateBtn.addEventListener("click", () => {
    const summary = [];
    const selectedStrengths = getTexts("strengths");
    const selectedChallenges = getTexts("challenges");
    const selectedSupports = getTexts("supports");

    if (!selectedStrengths.length && !selectedChallenges.length && !selectedSupports.length) {
      alert("Please drag items into at least one category.");
      return;
    }

    summary.push(`${scenario.name} shows strength in ${selectedStrengths.join(", ") || "[add strengths]"}.`);
    summary.push(`Areas of challenge may include ${selectedChallenges.join(", ") || "[add challenges]"}.`);
    summary.push(`Supports that may help include ${selectedSupports.join(", ") || "[add supports]"}.`);

    const feedback = document.createElement("div");
    feedback.className = "capstone-feedback";
    feedback.innerHTML = `<p>${summary.join(" ")}</p>`;
    container.appendChild(feedback);
  });

  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Reset Activity";
  resetBtn.className = "button";
  resetBtn.addEventListener("click", () => initSupportPlanner(container, scenario));

  const backBtn = document.createElement("button");
  backBtn.textContent = "← Back to Scenarios";
  backBtn.className = "button";
  backBtn.addEventListener("click", () => initScenarioPicker(container));

  const btnWrapper = document.createElement("div");
  btnWrapper.className = "capstone-buttons";
  btnWrapper.append(generateBtn, resetBtn, backBtn);
  container.appendChild(btnWrapper);

  function getTexts(id) {
    return Array.from(document.getElementById(id).children)
      .filter((el) => el.classList.contains("draggable"))
      .map((el) => el.textContent.trim());
  }

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }
}