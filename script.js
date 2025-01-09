import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, get, update, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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

// Add client
clientForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('client-name').value;
  const steps = document.getElementById('steps').value;
  const deadline = document.getElementById('deadline').value;

  const clientId = Date.now(); // Unique ID for client
  const link = `${window.location.origin}/client.html?id=${clientId}`;
  
  await set(ref(db, `clients/${clientId}`), {
    name,
    steps: parseInt(steps),
    progress: 0,
    deadline,
    link
  });

  displayClients();
  clientForm.reset();
});

// Display clients
async function displayClients() {
  const snapshot = await get(ref(db, 'clients'));
  const clients = snapshot.val();
  clientList.innerHTML = '';

  for (const id in clients) {
    const { name, link, progress, steps } = clients[id];

    const clientDiv = document.createElement('div');
    clientDiv.innerHTML = `
      <span>${name}</span>
      <button onclick="deleteClient('${id}')">Delete</button>
      <a href="${link}" target="_blank">View Progress</a>
      <input type="range" min="0" max="${steps}" value="${progress}" onchange="updateProgress('${id}', this.value)">
    `;
    clientList.appendChild(clientDiv);
  }
}

// Update progress
async function updateProgress(clientId, value) {
  await update(ref(db, `clients/${clientId}`), { progress: parseInt(value) });
}

// Delete client
async function deleteClient(clientId) {
  await remove(ref(db, `clients/${clientId}`));
  displayClients();
}

// Load client progress for unique links
if (window.location.pathname.includes('client.html')) {
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get('id');
  
  get(ref(db, `clients/${clientId}`)).then(snapshot => {
    const data = snapshot.val();
    document.getElementById('client-name').textContent = data.name;
    document.getElementById('deadline').textContent = `Deadline: ${data.deadline}`;
    document.getElementById('progress-bar').style.width = `${(data.progress / data.steps) * 100}%`;
  });
}

// Initialize
if (window.location.pathname.includes('admin.html')) {
  displayClients();
}
