// Helper function to get stored data or initialize it
function getClientsData() {
  const storedData = localStorage.getItem("clientsData");
  return storedData ? JSON.parse(storedData) : {};
}

// Save data to localStorage
function saveClientsData(data) {
  localStorage.setItem("clientsData", JSON.stringify(data));
}

// ADMIN PAGE
document.addEventListener("DOMContentLoaded", () => {
  const clientsData = getClientsData();

  // Admin Page: Add a New Client
  const addClientButton = document.getElementById("addClientButton");
  const clientList = document.getElementById("clientList");

  // Update client list
  function updateClientList() {
    clientList.innerHTML = ''; // Reset the list
    for (const clientName in clientsData) {
      const client = clientsData[clientName];

      // Create client list item with progress slider and delete button
      const listItem = document.createElement("li");
      listItem.innerHTML = `
        <strong>${clientName}</strong> - Progress: 
        <input type="range" min="0" max="${client.steps}" value="${client.currentStep}" class="progressSlider" data-client="${clientName}">
        <span class="progressLabel">${client.currentStep} / ${client.steps}</span>
        <button class="deleteClientButton" data-client="${clientName}">Delete Client</button>
        <br><br>
        <input type="text" value="${window.location.origin}/client.html?clientName=${encodeURIComponent(clientName)}" readonly>
      `;

      // Event listener for progress slider
      const progressSlider = listItem.querySelector(".progressSlider");
      progressSlider.addEventListener("input", (e) => {
        const clientName = e.target.dataset.client;
        const newProgress = parseInt(e.target.value);
        clientsData[clientName].currentStep = newProgress;
        saveClientsData(clientsData);

        // Update the progress label dynamically
        listItem.querySelector(".progressLabel").textContent = `${newProgress} / ${client.steps}`;
      });

      // Event listener for delete button
      const deleteButton = listItem.querySelector(".deleteClientButton");
      deleteButton.addEventListener("click", () => {
        delete clientsData[clientName];
        saveClientsData(clientsData);
        updateClientList(); // Refresh the client list
      });

      // Append to the list
      clientList.appendChild(listItem);
    }
  }

  if (addClientButton) {
    addClientButton.addEventListener("click", () => {
      const clientName = document.getElementById("clientNameInput").value;
      const deadline = document.getElementById("deadlineInput").value;
      const steps = parseInt(document.getElementById("stepsInput").value);

      if (!clientName || !deadline || steps < 1) {
        alert("Please fill out all fields.");
        return;
      }

      // Create new client object
      clientsData[clientName] = {
        deadline,
        steps,
        currentStep: 0,
      };

      saveClientsData(clientsData);
      alert(`Client "${clientName}" added!`);

      // Generate the link for the client
      const clientLink = `${window.location.origin}/client.html?clientName=${encodeURIComponent(clientName)}`;
      document.getElementById("clientLink").value = clientLink;

      // Update the client list
      updateClientList();
    });
  }

  // Initial population of the client list
  updateClientList();
});

// CLIENT PAGE
document.addEventListener("DOMContentLoaded", () => {
  const storedData = getClientsData();

  // Get the client name from the URL query string
  const urlParams = new URLSearchParams(window.location.search);
  const clientName = urlParams.get('clientName');

  if (clientName && storedData[clientName]) {
    const client = storedData[clientName];

    // Display client data
    document.getElementById("clientName").textContent = clientName;
    document.getElementById("deadline").textContent = client.deadline;
    document.getElementById("steps").textContent = client.steps;

    // Update progress bar based on the steps completed
    const progressBar = document.getElementById("progressBar");
    const progressPercentage = (client.currentStep / client.steps) * 100 || 0;
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.textContent = `${Math.round(progressPercentage)}%`;
  } else {
    alert("Client data not found.");
  }
});
