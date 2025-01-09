let projectData = {
  clientName: "",
  deadline: "",
  steps: 0,
  currentStep: 0,
};

// Save project details from the Admin page
document.addEventListener("DOMContentLoaded", () => {
  const saveProjectButton = document.getElementById("saveProject");
  const nextStepButton = document.getElementById("nextStepButton");

  if (saveProjectButton) {
    saveProjectButton.addEventListener("click", () => {
      const clientNameInput = document.getElementById("clientNameInput").value;
      const deadlineInput = document.getElementById("deadlineInput").value;
      const stepsInput = parseInt(document.getElementById("stepsInput").value);

      projectData.clientName = clientNameInput;
      projectData.deadline = deadlineInput;
      projectData.steps = stepsInput;
      projectData.currentStep = 0;

      localStorage.setItem("projectData", JSON.stringify(projectData));
      alert("Project details saved!");
    });
  }

  // Move to the next step
  if (nextStepButton) {
    nextStepButton.addEventListener("click", () => {
      if (projectData.currentStep < projectData.steps) {
        projectData.currentStep++;
        localStorage.setItem("projectData", JSON.stringify(projectData));
        alert(`Moved to step ${projectData.currentStep}`);
      } else {
        alert("All steps are already completed!");
      }
    });
  }

  // Display progress on the Client page
  const clientPage = document.getElementById("clientName");
  if (clientPage) {
    const storedData = localStorage.getItem("projectData");
    if (storedData) {
      projectData = JSON.parse(storedData);

      document.getElementById("clientName").textContent = projectData.clientName;
      document.getElementById("deadline").textContent = projectData.deadline;

      const progressBar = document.getElementById("progressBar");
      const progressPercentage =
        (projectData.currentStep / projectData.steps) * 100 || 0;
      progressBar.style.width = `${progressPercentage}%`;
      progressBar.textContent = `${Math.round(progressPercentage)}%`;
    }
  }
});
