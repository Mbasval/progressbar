import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, get, update, remove, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQDrZD_BGyXtvCJwhMNX0eOywLLObA-xo",
  authDomain: "progress-bar-e1b94.firebaseapp.com",
  databaseURL: "https://progress-bar-e1b94-default-rtdb.firebaseio.com",
  projectId: "progress-bar-e1b94",
  storageBucket: "progress-bar-e1b94.appspot.com",
  messagingSenderId: "1038468595103",
  appId: "1:1038468595103:web:7f1a8291298c2b025f91aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const isAdminPage = window.location.pathname.includes("admin.html");
const isClientPage = window.location.pathname.includes("client.html");

// Admin Page Logic
if (isAdminPage) {
  const clientForm = document.getElementById("add-client-form");
  const clientList = document.getElementById("client-list");

  // Variables for Step-by-Step Navigation
  let totalSteps = 0;
  let currentStepIndex = 0;
  const stepDetails = [];

  document.getElementById("steps").addEventListener("change", (e) => {
    totalSteps = parseInt(e.target.value);
    if (totalSteps < 1) {
      alert("Please enter a valid number of steps.");
      return;
    }
    startStepSetup();
  });

  function startStepSetup() {
    const stepContainer = document.getElementById("step-details-container");
    stepContainer.innerHTML = `
      <div id="step-setup">
        <h3 id="step-title">Step 1 of ${totalSteps}</h3>
        <label for="step-name">Step Name:</label>
        <input type="text" id="step-name" placeholder="Step Name" required>
        <label for="step-description">Step Description:</label>
        <textarea id="step-description" placeholder="Step Description" required></textarea>
        <button id="prev-step" class="hidden">Back</button>
        <button id="next-step">Next</button>
      </div>
    `;

    const nextButton = document.getElementById("next-step");
    const prevButton = document.getElementById("prev-step");

    nextButton.addEventListener("click", handleNextStep);
    prevButton.addEventListener("click", handlePrevStep);
  }

  function handleNextStep() {
    const stepName = document.getElementById("step-name").value;
    const stepDescription = document.getElementById("step-description").value;

    if (!stepName || !stepDescription) {
      alert("Please fill out all fields.");
      return;
    }

    stepDetails[currentStepIndex] = { name: stepName, description: stepDescription };

    if (currentStepIndex + 1 === totalSteps) {
      finalizeSteps();
      return;
    }

    currentStepIndex++;
    updateStepUI();
  }

  function handlePrevStep() {
    if (currentStepIndex === 0) return;

    currentStepIndex--;
    updateStepUI();
  }

  function updateStepUI() {
    document.getElementById("step-title").textContent = `Step ${currentStepIndex + 1} of ${totalSteps}`;
    document.getElementById("step-name").value = stepDetails[currentStepIndex]?.name || "";
    document.getElementById("step-description").value = stepDetails[currentStepIndex]?.description || "";

    document.getElementById("prev-step").classList.toggle("hidden", currentStepIndex === 0);
  }

  function finalizeSteps() {
    alert("Steps configured successfully! You can now submit the client.");
    document.getElementById("step-details-container").innerHTML = `
      <h4>Steps Summary</h4>
      <ul>
        ${stepDetails.map((step, i) => `<li>Step ${i + 1}: ${step.name} - ${step.description}</li>`).join("")}
      </ul>
    `;
  }

  clientForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("client-name").value;
    const deadline = document.getElementById("deadline").value;

    if (!name || !deadline || stepDetails.length !== totalSteps) {
      alert("Please complete all fields and steps.");
      return;
    }

    const clientId = `${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now().toString()}`;
    const clientLink = `${window.location.origin}/client.html?id=${clientId}`;

    await set(ref(db, `clients/${clientId}`), {
      name,
      steps: totalSteps,
      stepDetails,
      progress: 0,
      deadline,
      link: clientLink,
    });

    clientForm.reset();
    stepDetails.length = 0;
    totalSteps = 0;
    currentStepIndex = 0;
    displayClients();
  });

  function displayClients() {
    const clientsRef = ref(db, "clients");
    onValue(clientsRef, (snapshot) => {
      const clients = snapshot.val();
      clientList.innerHTML = "";
      if (clients) {
        Object.keys(clients).forEach((id) => {
          const { name, progress, steps, link, deadline } = clients[id];
          const clientDiv = document.createElement("div");
          clientDiv.classList.add("client-card");
          clientDiv.innerHTML = `
            <div>
              <h3>${name}</h3>
              <p>Deadline: ${deadline}</p>
              <p>Progress: ${progress}/${steps}</p>
              <a href="${link}" target="_blank">View Progress</a>
            </div>
            <div>
              <input type="range" min="0" max="${steps}" value="${progress}" onchange="updateProgress('${id}', this.value)" class="slider">
              <button onclick="deleteClient('${id}')">Delete</button>
            </div>
          `;
          clientList.appendChild(clientDiv);
        });
      } else {
        clientList.innerHTML = "<p>No clients added yet.</p>";
      }
    });
  }

  displayClients();

  window.updateProgress = async (id, value) => {
    await update(ref(db, `clients/${id}`), { progress: parseInt(value) });
  };

  window.deleteClient = async (id) => {
    await remove(ref(db, `clients/${id}`));
  };
}

// Client Page Logic
if (isClientPage) {
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get("id");

  const clientRef = ref(db, `clients/${clientId}`);
  get(clientRef).then((snapshot) => {
    if (snapshot.exists()) {
      const { name, steps, progress, deadline, stepDetails } = snapshot.val();
      document.getElementById("client-name").textContent = name;
      document.getElementById("deadline").textContent = `Deadline: ${deadline}`;

      const progressBar = document.getElementById("progress-bar");
      progressBar.style.width = `${(progress / steps) * 100}%`;
      progressBar.innerHTML = `<span id='progress-text'>${Math.round((progress / steps) * 100)}%</span>`;

      const milestonesContainer = document.createElement("div");
      milestonesContainer.classList.add("milestones-container");

      for (let i = 1; i <= steps; i++) {
        const milestone = document.createElement("div");
        milestone.classList.add("milestone");
        milestone.style.left = `${(i / steps) * 100}%`;
        milestone.style.backgroundColor = progress >= i ? "#007bff" : "#ccc";
        milestonesContainer.appendChild(milestone);
      }

      progressBar.appendChild(milestonesContainer);

      const reportContainer = document.createElement("div");
      reportContainer.classList.add("report-container");

      const currentStep = stepDetails[progress] || { name: "All steps complete", description: "Great job!" };
      reportContainer.innerHTML = `
        <h3>Current Step: ${currentStep.name}</h3>
        <p>${currentStep.description}</p>
      `;
      document.querySelector("main").appendChild(reportContainer);
    } else {
      document.body.innerHTML = "<h1>Client not found</h1>";
    }
  });
}
