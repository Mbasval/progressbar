// Example project data
const projectData = {
  clientName: "John Doe",
  projectName: "Website Redesign",
  deadline: "2025-01-31",
  steps: [
    { name: "Initial Meeting", completed: true },
    { name: "Wireframe Design", completed: true },
    { name: "Prototype Development", completed: false },
    { name: "Final Review", completed: false },
    { name: "Deployment", completed: false },
  ],
  progress: 40, // Progress starts at 40% (based on completed steps)
};

// Display project details and progress
function displayProject(data) {
  const container = document.getElementById("projectContainer");

  container.innerHTML = `
    <h2>Client: ${data.clientName}</h2>
    <p>Project: ${data.projectName}</p>
    <p>Deadline: ${data.deadline}</p>
    <div class="progress-bar">
      <div class="progress" style="width: ${data.progress}%;">${data.progress}%</div>
    </div>
    <h3>Steps</h3>
    <ul>
      ${data.steps
        .map(
          (step) =>
            `<li style="text-decoration: ${step.completed ? "line-through" : "none"};">
              ${step.name}
            </li>`
        )
        .join("")}
    </ul>
  `;
}

// Update project progress
function updateProgress(data) {
  const completedSteps = data.steps.filter((step) => step.completed).length;
  data.progress = Math.round((completedSteps / data.steps.length) * 100);
  displayProject(data);
}

// Move to the next step
function moveToNextStep(data) {
  const nextStep = data.steps.find((step) => !step.completed);
  if (nextStep) {
    if (confirm(`Do you want to mark "${nextStep.name}" as completed?`)) {
      nextStep.completed = true;
      updateProgress(data);
    }
  } else {
    alert("All steps are already completed!");
  }
}

// Initial setup
document.addEventListener("DOMContentLoaded", () => {
  displayProject(projectData);

  const nextStepButton = document.getElementById("nextStepButton");
  nextStepButton.addEventListener("click", () => moveToNextStep(projectData));
});
// Example project data
const projectData = {
  clientName: "John Doe",
  projectName: "Website Redesign",
  deadline: "2025-01-31",
  steps: [
    { name: "Initial Meeting", completed: true },
    { name: "Wireframe Design", completed: true },
    { name: "Prototype Development", completed: false },
    { name: "Final Review", completed: false },
    { name: "Deployment", completed: false },
  ],
  progress: 40, // Progress starts at 40% (based on completed steps)
};

// Display project details and progress
function displayProject(data) {
  const container = document.getElementById("projectContainer");

  container.innerHTML = `
    <h2>Client: ${data.clientName}</h2>
    <p>Project: ${data.projectName}</p>
    <p>Deadline: ${data.deadline}</p>
    <div class="progress-bar">
      <div class="progress" style="width: ${data.progress}%;">${data.progress}%</div>
    </div>
    <h3>Steps</h3>
    <ul>
      ${data.steps
        .map(
          (step) =>
            `<li style="text-decoration: ${step.completed ? "line-through" : "none"};">
              ${step.name}
            </li>`
        )
        .join("")}
    </ul>
  `;
}

// Update project progress
function updateProgress(data) {
  const completedSteps = data.steps.filter((step) => step.completed).length;
  data.progress = Math.round((completedSteps / data.steps.length) * 100);
  displayProject(data);
}

// Move to the next step
function moveToNextStep(data) {
  const nextStep = data.steps.find((step) => !step.completed);
  if (nextStep) {
    if (confirm(`Do you want to mark "${nextStep.name}" as completed?`)) {
      nextStep.completed = true;
      updateProgress(data);
    }
  } else {
    alert("All steps are already completed!");
  }
}

// Initial setup
document.addEventListener("DOMContentLoaded", () => {
  displayProject(projectData);

  const nextStepButton = document.getElementById("nextStepButton");
  nextStepButton.addEventListener("click", () => moveToNextStep(projectData));
});
