// Admin Side Logic
const clientList = document.getElementById("clientList");
const database = getDatabase(app);

// Function to update the client list in Admin page
function updateClientList(clientData) {
    clientList.innerHTML = '';  // Clear the list

    for (const clientName in clientData) {
        const client = clientData[clientName];
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
            clientData[clientName].currentStep = newProgress;
            saveClientDataToFirebase(clientData);  // Update in Firebase
            listItem.querySelector(".progressLabel").textContent = `${newProgress} / ${client.steps}`;
        });

        // Event listener for delete button
        const deleteButton = listItem.querySelector(".deleteClientButton");
        deleteButton.addEventListener("click", () => {
            delete clientData[clientName];
            saveClientDataToFirebase(clientData);  // Update Firebase after deletion
            updateClientList(clientData);  // Refresh the list
        });

        clientList.appendChild(listItem);
    }
}

// Fetch clients from Firebase
function getClientDataFromFirebase() {
    const clientRef = ref(database, "clients");
    onValue(clientRef, (snapshot) => {
        const clientData = snapshot.val();
        updateClientList(clientData);  // Function to update your UI with the data
    });
}

// Save client data to Firebase
function saveClientDataToFirebase(clientData) {
    const clientRef = ref(database, "clients");
    set(clientRef, clientData);
}

// Client Side Logic
const urlParams = new URLSearchParams(window.location.search);
const clientName = urlParams.get('clientName');

// Fetch the client data from Firebase using the clientName
const clientRef = ref(database, `clients/${clientName}`);
onValue(clientRef, (snapshot) => {
    const clientData = snapshot.val();
    if (clientData) {
        document.getElementById('clientName').textContent = clientData.name;
        document.getElementById('clientDeadline').textContent = `Deadline: ${clientData.deadline}`;
        updateProgressBar(clientData.currentStep, clientData.steps);
    }
});

// Function to update the progress bar
function updateProgressBar(currentStep, totalSteps) {
    const progress = (currentStep / totalSteps) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}
