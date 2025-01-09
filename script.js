import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, get, update, remove, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQDrZD_BGyXtvCJwhMNX0eOywLLObA-xo",
  authDomain: "progress-bar-e1b94.firebaseapp.com",
  projectId: "progress-bar-e1b94",
  storageBucket: "progress-bar-e1b94.appspot.com",
  messagingSenderId: "1038468595103",
  appId: "1:1038468595103:web:7f1a8291298c2b025f91aa",
  databaseURL: "https://progress-bar-e1b94-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// DOM elements
const clientForm = document.getElementById('add-client-form');
const clientList = document.getElementById('client-list');

// Add a client
clientForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('client-name').value;
  const steps = document.getElementById('steps').value;
  const deadline = document.getElementById('deadline').value;

  const clientId = Date.now(); // Unique client ID
  const link = `${window.location.origin}/client.html?id=${clientId}`;
  
  await set(ref(db, `clients/${clientId}`), {
    name,
    steps: parseInt(steps),
    progress: 0,
    deadline,
    link
  });

  clientForm.reset();
  displayClients();
});

// Display all clients
function displayClients() {
  const clientsRef = ref(db, 'clients');
  onValue(clientsRef, (snapshot) => {
    const clients = snapshot.val();
    clientList.innerHTML = ''; // Clear previous list

    if (clients) {
      for (const id in clients) {
        const { name, link, progress, steps, deadline } = clients[id];

        const clientDiv = document.createElement('div');
        clientDiv.classList.add('client');

        clientDiv.innerHTML = `
          <div class="client-info">
            <strong>${name}</strong>
            <p>Deadline: ${deadline}</p>
            <a href="${link}" target="_blank">View Progress</a>
          </div>
          <div class="client-controls">
            <input type="range" min="0" max="${steps}" value="${progress}" onchange="updateProgress('${id}', this.value)">
            <span>${progress}/${steps}</span>
            <button onclick="deleteClient('${id}')">Delete</button>
          </div>
        `;
        clientList.appendChild(clientDiv);
      }
    } else {
      clientList.innerHTML = '<p>No clients added yet.</p>';
    }
  });
}

// Update progress
window.updateProgress = async function(clientId, value) {
  const clientRef = ref(db, `clients/${clientId}`);
  await update(clientRef, { progress: parseInt(value) });
  displayClients();
};

// Delete a client
window.deleteClient = async function(clientId) {
  const clientRef = ref(db, `clients/${clientId}`);
  await remove(clientRef);
  displayClients();
};

// Load client progress for unique links
if (window.location.pathname.includes('client.html')) {
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get('id');
  
  const clientRef = ref(db, `clients/${clientId}`);
  get(clientRef).then(snapshot => {
    const data = snapshot.val();
    if (data) {
      document.getElementById('client-name').textContent = data.name;
      document.getElementById('deadline').textContent = `Deadline: ${data.deadline}`;
      const progressBar = document.getElementById('progress-bar');
      progressBar.style.width = `${(data.progress / data.steps) * 100}%`;
    } else {
      document.body.innerHTML = '<h1>Client not found</h1>';
    }
  });
}

// Initialize displayClients for Admin Page
if (window.location.pathname.includes('admin.html')) {
  displayClients();
}
