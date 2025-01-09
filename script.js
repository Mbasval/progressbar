// Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, get, update, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase config
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

// --- Admin-side logic ---

// Add client
document.getElementById("addClientBtn").addEventListener("click", function () {
    const clientName = document.getElementById("clientName").value;
    const clientDeadline = document.getElementById("clientDeadline").value;
    const steps = document.getElementById("steps").value;
    
    if (clientName && clientDeadline && steps) {
        const clientRef = ref(db, 'clients/' + clientName);
        set(clientRef, {
            name: clientName,
            deadline: clientDeadline,
            steps: steps,
            progress: 0,
            link: generateClientLink(clientName)
        }).then(() => {
            alert('Client added successfully!');
            displayClients(); // Update the client list
        }).catch((error) => {
            console.error(error);
            alert('Error adding client!');
        });
    } else {
        alert('Please fill in all fields!');
    }
});

// Generate unique client link (just for display purposes in the admin)
function generateClientLink(clientName) {
    return `${window.location.origin}/client.html?client=${clientName}`;
}

// Display all clients in the admin panel
function displayClients() {
    const clientsRef = ref(db, 'clients/');
    get(clientsRef).then((snapshot) => {
        const clientList = document.getElementById('clientList');
        clientList.innerHTML = ''; // Clear the list before updating
        snapshot.forEach((childSnapshot) => {
            const clientData = childSnapshot.val();
            const clientDiv = document.createElement('div');
            clientDiv.innerHTML = `
                <p>${clientData.name} - ${clientData.deadline}</p>
                <p>Link: <a href="${clientData.link}" target="_blank">${clientData.link}</a></p>
                <button onclick="updateProgress('${clientData.name}')">Update Progress</button>
                <button onclick="deleteClient('${clientData.name}')">Delete Client</button>
            `;
            clientList.appendChild(clientDiv);
        });
    });
}

// Update client progress
function updateProgress(clientName) {
    const clientRef = ref(db, 'clients/' + clientName);
    get(clientRef).then((snapshot) => {
        const clientData = snapshot.val();
        const newProgress = clientData.progress + 1;

        // Update the progress
        update(clientRef, { progress: newProgress }).then(() => {
            alert(`Progress for ${clientName} updated!`);
            // Optionally: Call displayClients() here to refresh the list (if needed)
        }).catch((error) => {
            console.error(error);
        });
    });
}

// Delete client
function deleteClient(clientName) {
    const clientRef = ref(db, 'clients/' + clientName);
    remove(clientRef).then(() => {
        alert(`Client ${clientName} deleted!`);
        displayClients(); // Update the client list after deletion
    }).catch((error) => {
        console.error(error);
    });
}

// Call displayClients to load the list on page load
window.onload = displayClients;

// --- Client-side logic ---

// Get client name from URL and display progress
const urlParams = new URLSearchParams(window.location.search);
const clientName = urlParams.get('client');

if (clientName) {
    const clientRef = ref(db, 'clients/' + clientName);
    get(clientRef).then((snapshot) => {
        const clientData = snapshot.val();
        if (clientData) {
            // Display client name and deadline
            document.getElementById("clientName").textContent = clientData.name;
            document.getElementById("clientDeadline").textContent = `Deadline: ${clientData.deadline}`;

            // Set the progress bar width
            const progressPercent = (clientData.progress / clientData.steps) * 100;
            document.getElementById("progressBar").style.width = `${progressPercent}%`;
        } else {
            alert('Client not found!');
        }
    }).catch((error) => {
        console.error(error);
        alert('Error fetching client data!');
    });
} else {
    alert('No client specified!');
}
