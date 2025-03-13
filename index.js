document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("create-task-form");
    const taskList = document.getElementById("tasks");
  
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form from reloading the page
  
      const taskInput = document.getElementById("new-task-description");
      const taskValue = taskInput.value.trim();
  
      if (taskValue === "") {
        alert("Task cannot be empty!");
        return;
      }
  
      addTaskToDOM(taskValue);
      taskInput.value = ""; // Clear input field after adding task
    });
  
    function addTaskToDOM(task) {
      const li = document.createElement("li");
      li.textContent = task;
  
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "❌";
      deleteButton.style.marginLeft = "10px";
      deleteButton.addEventListener("click", () => li.remove());
  
      li.appendChild(deleteButton);
      taskList.appendChild(li);
    }
  });
  