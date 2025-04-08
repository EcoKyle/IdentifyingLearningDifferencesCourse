// 🧠 Message Generator Activity (Drag-and-Drop Summary Builder)
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
  title.textContent = "Message Generator Activity";
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
      longDescription:
        "Riley participates eagerly in class discussions and shares ideas with peers. However, he avoids open-ended writing tasks, often pushing them aside or asking to skip them. He sometimes shuts down when directions are only given verbally, and transitions between activities or settings often lead to confusion or frustration. Riley thrives when tasks are broken into manageable steps and when instructions are provided both verbally and in writing. This message is intended to guide a collaborative teacher team conversation about Riley’s classroom supports.",
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
      ],
      message:
        "Riley participates actively in group discussions and demonstrates strong verbal reasoning. However, he struggles with transitions, often appearing frustrated or confused. Riley avoids open-ended writing tasks and may miss steps when instructions are only delivered verbally. Strategies that support his success include chunking tasks, offering graphic organizers, and providing instructions in both written and verbal formats."
    },
    {
      id: "jamie",
      name: "Jamie",
      description:
        "Jamie is an energetic, hands-on learner who participates enthusiastically in group discussions. They may need help getting started on independent tasks and remembering multi-step directions.",
      longDescription:
        "Jamie loves to build, explore, and talk through ideas. They often jump into group projects with excitement and enjoy hands-on learning. However, they can become overwhelmed when starting independent work and sometimes rush through without checking their work. Multi-step directions may be forgotten unless supported by a checklist or verbal cue. This message is meant to open a strengths-based conversation with Jamie’s caregiver about helpful strategies at school and home.",
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
      ],
      message:
        "Jamie is an energetic learner who thrives in hands-on, collaborative settings. They participate enthusiastically in discussions and enjoy exploring new ideas. Jamie may benefit from written checklists and verbal prompts to support transitions into independent work. Breaking down multi-step tasks has also shown to increase their success and focus."
    },
    {
      id: "kai",
      name: "Kai",
      description:
        "Kai finishes work quickly and enjoys tackling complex problems. However, transitions and organization can be a challenge, especially when tasks are long or abstract.",
      longDescription:
        "Kai thrives when engaged in complex, high-level problem solving. While quick to complete work, he may rush or overlook directions. He frequently loses materials and seems unsure during transition periods. Longer or unstructured assignments can lead to frustration. This message supports planning with an IEP or 504 team to explore organizational tools and enrichment options tailored to Kai’s strengths.",
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
      ],
      message:
        "Kai enjoys complex thinking and often finishes assignments quickly when engaged. He may struggle with organization and transitions between tasks or settings. Kai benefits from visual schedules and planning supports. Offering optional challenge activities has helped keep him engaged and confident."
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
  title.textContent = `Message Planning Practice: ${scenario.name}`;
  container.appendChild(title);

  const scenarioSummary = document.createElement("p");
  scenarioSummary.className = "scenario-long-description";
  scenarioSummary.textContent = scenario.longDescription || "";
  container.appendChild(scenarioSummary);

  const prompt = document.createElement("p");
  prompt.textContent = `Sort the cards into categories based on ${scenario.name}'s profile. Then generate a sample message using your selections.`;
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
  generateBtn.textContent = "Generate Message";
  generateBtn.className = "button";
  generateBtn.addEventListener("click", () => {
    const allCards = container.querySelectorAll(".draggable");
    let allCorrect = true;

    allCards.forEach((card) => {
      card.classList.remove("incorrect-placement");
      const parentId = card.parentElement.id;
      const correctType = card.dataset.type;
      if (parentId !== correctType) {
        card.classList.add("incorrect-placement");
        allCorrect = false;
      }
    });

    if (!allCorrect) {
      const warning = document.createElement("p");
      warning.className = "capstone-feedback";
      warning.style.backgroundColor = "#fff3cd";
      warning.style.borderLeft = "4px solid #ffa500";
      warning.textContent = "❌ Some cards are in the wrong category. Please double-check your sorting before generating a message.";
      container.appendChild(warning);
      return;
    }

    const feedback = document.createElement("div");
    feedback.className = "capstone-feedback";
    feedback.innerHTML = `<p>${scenario.message}</p>`;
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

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }
} 