import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, set, get, update, remove, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCQDrZD_BGyXtvCJwhMNX0eOywLLObA-xo",
    authDomain: "progress-bar-e1b94.firebaseapp.com",
    databaseURL: "https://progress-bar-e1b94-default-rtdb.firebaseio.com",
    projectId: "progress-bar-e1b94",
    storageBucket: "progress-bar-e1b94.firebasestorage.app",
    messagingSenderId: "1038468595103",
    appId: "1:1038468595103:web:7f1a8291298c2b025f91aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const isAdminPage = window.location.pathname.includes('admin.html');
const isClientPage = window.location.pathname.includes('client.html');

// Add client (Admin Page)
if (isAdminPage) {
  const clientForm = document.getElementById('add-client-form');
  const clientList = document.getElementById('client-list');

  clientForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('client-name').value;
    const steps = parseInt(document.getElementById('steps').value);
    const deadline = document.getElementById('deadline').value;
    const clientId = Date.now().toString();
    const clientLink = `${window.location.origin}/client.html?id=${clientId}`;

    await set(ref(db, `clients/${clientId}`), {
      name,
      steps,
      progress: 0,
      deadline,
      link: clientLink
    });

    clientForm.reset();
    displayClients();
  });

  function displayClients() {
    const clientsRef = ref(db, 'clients');
    onValue(clientsRef, (snapshot) => {
      const clients = snapshot.val();
      clientList.innerHTML = ''; // Clear list
      if (clients) {
        Object.keys(clients).forEach((id) => {
          const { name, progress, steps, link } = clients[id];
          const clientDiv = document.createElement('div');
          clientDiv.classList.add('client');
          clientDiv.innerHTML = `
            <div>
              <h3>${name}</h3>
              <a href="${link}" target="_blank">View Progress</a>
            </div>
            <div>
              <input type="range" min="0" max="${steps}" value="${progress}" onchange="updateProgress('${id}', this.value)">
              <span>${progress}/${steps}</span>
              <button onclick="deleteClient('${id}')">Delete</button>
            </div>
          `;
          clientList.appendChild(clientDiv);
        });
      } else {
        clientList.innerHTML = '<p>No clients added yet.</p>';
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

// Display progress (Client Page)
if (isClientPage) {
  const urlParams = new URLSearchParams(window.location.search);
  const clientId = urlParams.get('id');

  const clientRef = ref(db, `clients/${clientId}`);
  get(clientRef).then((snapshot) => {
    if (snapshot.exists()) {
      const { name, steps, progress, deadline } = snapshot.val();
      document.getElementById('client-name').textContent = name;
      document.getElementById('deadline').textContent = `Deadline: ${deadline}`;
      const progressBar = document.getElementById('progress-bar');
      progressBar.style.width = `${(progress / steps) * 100}%`;
    } else {
      document.body.innerHTML = '<h1>Client not found</h1>';
    }
  });
}
