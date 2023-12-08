"use strict"

// This function fetches tasks from the backend and updates the DOM
function fetchTasks() {
    // Endpoint URL
    const apiUrl = 'https://task-app-server-ss87.onrender.com/api/tasks';
  
    // Use fetch API to get tasks
    fetch(apiUrl)
      .then(response => {
        // Check if the request was successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse JSON body of the response
      })
      .then(tasks => {
        // If successful, process the tasks array
        const tasksContainer = document.getElementById('tasks-container'); // The container where tasks will be displayed
        
        // Clear existing tasks
        tasksContainer.innerHTML = '';
  
        // Append each task to the container
        tasks.forEach(task => {
          const taskElement = document.createElement('div');
          taskElement.className = 'task';
          taskElement.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description}</p>
          `;
          tasksContainer.appendChild(taskElement);
        });
      })
      .catch(error => {
        console.error('There was an error fetching the tasks:', error);
      });
  }
  
  // Call the function when the window loads
  window.onload = fetchTasks;
  
