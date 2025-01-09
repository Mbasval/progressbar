// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Check if it's the admin page or client page
const isAdminPage = document.body.id === 'adminPage';
const isClientPage = document.body.id === 'clientPage';

// Admin page logic
if (isAdminPage) {
    function updateClientList(clientData) {
        const clientList = document.getElementById("clientList");
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
        const clientRef = database.ref("clients");
        clientRef.on('value', (snapshot) => {
            const clientData = snapshot.val();
            updateClientList(clientData);  // Function to update your UI with the data
        });
    }

    // Save client data to Firebase
    function saveClientDataToFirebase(clientData) {
        const clientRef = database.ref("clients");
        clientRef.set(clientData);
    }

    // Fetch client data when the page loads
    window.onload = getClientDataFromFirebase;
}

// Client page logic
if (isClientPage) {
    // Get the client name from the URL query
    const urlParams = new URLSearchParams(window.location.search);
    const clientName = urlParams.get('clientName');

    // Fetch the client data from Firebase using the clientName
    const clientRef = firebase.database().ref(`clients/${clientName}`);
    clientRef.on('value', (snapshot) => {
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
}
