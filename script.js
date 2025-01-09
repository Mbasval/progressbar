import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Add new client
function addNewClient(clientId, name, deadline, totalSteps) {
    const clientRef = ref(db, 'clients/' + clientId);
    set(clientRef, {
        name: name,
        deadline: deadline,
        totalSteps: totalSteps,
        completedSteps: 0
    })
    .then(() => {
        alert('Client added successfully!');
        displayClients();
    })
    .catch((error) => {
        console.error('Error adding client: ', error);
    });
}

// Display clients in the list
function displayClients() {
    const clientsList = document.getElementById("clients-list");
    get(ref(db, 'clients')).then((snapshot) => {
        clientsList.innerHTML = ''; // Clear existing list
        if (snapshot.exists()) {
            const clients = snapshot.val();
            for (const clientId in clients) {
                const client = clients[clientId];
                const li = document.createElement("li");
                li.textContent = `${client.name} - Deadline: ${client.deadline}, Steps: ${client.totalSteps}`;
                clientsList.appendChild(li);
            }
        } else {
            clientsList.textContent = "No clients found.";
        }
    });
}

// Fetch client data based on client ID
function fetchClientData(clientId) {
    const clientRef = ref(db, 'clients/' + clientId);
    get(clientRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                document.getElementById('client-name').textContent = data.name;
                document.getElementById('client-deadline').textContent = data.deadline;
                document.getElementById('steps-completed').textContent = data.completedSteps;

                // Update progress bar
                const progressBar = document.getElementById('progress-bar');
                const progress = (data.completedSteps / data.totalSteps) * 100;
                progressBar.style.width = progress + '%';
            }
        })
        .catch((error) => {
            console.error('Error fetching client data: ', error);
        });
}

// Handle form submission to add a new client
document.getElementById('client-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const clientName = document.getElementById('client-name').value;
    const clientDeadline = document.getElementById('client-deadline').value;
    const clientSteps = document.getElementById('client-steps').value;
    const clientId = `client_${Date.now()}`;

    addNewClient(clientId, clientName, clientDeadline, clientSteps);
});

// Initial display of clients
displayClients();

// Client page logic
const urlParams = new URLSearchParams(window.location.search);
const clientId = urlParams.get('client');
if (clientId) {
    fetchClientData(clientId);
}
