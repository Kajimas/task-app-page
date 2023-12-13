"use strict";

// Endpoint URL
const apiUrl = "https://task-app-server-ss87.onrender.com/api/tasks";

// Fetch all tasks
async function fetchTasks() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const tasks = await response.json();
    displayTasks(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

// Create a new task
async function createTask(task) {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Clear the input field after the task has been created
    document.getElementById("task-title-input").value = "";
  } catch (error) {
    console.error("Error:", error);
  }
}

// Update a task
async function updateTask(id, task) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Success:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Delete a task
async function deleteTask(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("Success:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Display tasks in the DOM
function displayTasks(tasks) {
  const taskList = document.getElementById("tasks-list");
  taskList.innerHTML = ""; // clear the container

  for (const task of tasks) {
    const taskElement = document.createElement("div");
    taskElement.className = "simple-task";
    taskElement.textContent = task.title; // or task.description if you want to display the description
    taskList.appendChild(taskElement);
  }
}

// Call the fetchTasks function when the window loads
window.addEventListener("load", function () {
  fetchTasks().catch((error) => console.error("Error fetching tasks:", error));
});

document
  .getElementById("submit-button")
  .addEventListener("click", function (event) {
    event.preventDefault(); // prevent the form from being submitted

    const taskTitle = document.getElementById("task-input").value;

    if (!taskTitle.trim()) {
      alert("Please enter a task.");
    } else {
      const task = {
        title: taskTitle,
        description: "", // add description here if needed
      };
      createTask(task)
        .then(() => {
          document.getElementById("task-title-input").value = ""; // clear the input field
          return fetchTasks(); // re-fetch tasks
        })
        .catch((error) => console.error("Error:", error));
    }
  });
