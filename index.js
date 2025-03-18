document.addEventListener("DOMContentLoaded", () => {
  // your code here
  const newTaskDescription = document.getElementById("new-task-description");
  const theList = document.getElementById("tasks");
  
  const createNewTask = event => { 
    event.preventDefault(); 
    const newTask = document.createElement('li');
  
    newTask.textContent = newTaskDescription.value;
    createButton(newTask);
    theList.appendChild(newTask);
  
    event.target.reset();
  };
  
  const createButton = task => {
     const btn = document.createElement('button');
      btn.textContent = "X";
  
      task.appendChild(btn);
      btn.addEventListener('click',  (e) => deleteTask(e));
  }
  
  const deleteTask = (e) => {
    const selectedTask = e.target.parentElement;
    theList.removeChild(selectedTask);
  }
  
  document.querySelector('#create-task-form').addEventListener("submit", (e) => createNewTask(e))
});