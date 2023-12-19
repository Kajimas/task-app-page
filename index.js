"use strict";

// Endpoint URL
const apiUrl = "https://task-app-server-ss87.onrender.com/api/tasks";

// Fetch all tasks
async function fetchTasks() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${data.message}`
      );
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
    console.log("Creating task:", task);
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${data.message}`
      );
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
      const data = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${data.message}`
      );
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
    console.log(`Response: ${response}`);
    console.log(`Response status: ${response.status}`);
    if (!response.ok) {
      const data = await response.json();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${data.message}`
      );
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
    console.log(task);

    const listItem = document.createElement("li");

    const taskName = document.createElement("span");
    taskName.className = "simple-task";
    taskName.addEventListener("click", function () {
      // When the task name is clicked, turn it into an editable input field
      const input = document.createElement("input");
      input.type = "text";
      input.value = task.title;
      input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          // When the user presses enter, update the task name on the server
          updateTask(task._id, { title: input.value })
            .then(fetchTasks) // re-fetch tasks after updating
            .catch((error) => console.error("Error:", error));
        }
      });
      listItem.replaceChild(input, taskName); // Replace the task name with the input field
      input.focus(); // Focus the input field
    });
    listItem.appendChild(taskName);
    
    // Create a delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
      console.log(`Deleting task ID: ${task.id}`);
      deleteTask(task.id)
        .then(fetchTasks) // re-fetch tasks after deleting
        .catch((error) => console.error("Error:", error));
    });

    // Append the delete button to the task element
    listItem.appendChild(deleteButton);

    taskList.appendChild(listItem);
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

    const taskTitle = document.getElementById("task-title-input").value;

    if (!taskTitle.trim()) {
      alert("Please enter a task.");
    } else {
      const task = {
        title: taskTitle,
        description: "", // add description here if needed
        completed: false,
      };
      createTask(task)
        .then(() => {
          document.getElementById("task-title-input").value = ""; // clear the input field
          return fetchTasks(); // re-fetch tasks
        })
        .catch((error) => console.error("Error:", error));
    }
  });
