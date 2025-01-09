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
    });
  }
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

    // Update progress bar based on the steps completed
    const progressBar = document.getElementById("progressBar");
    const progressPercentage = (client.currentStep / client.steps) * 100 || 0;
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.textContent = `${Math.round(progressPercentage)}%`;
  } else {
    alert("Client data not found.");
  }
});
