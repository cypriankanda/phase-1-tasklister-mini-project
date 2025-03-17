// Wait for DOM to fully load before executing code
document.addEventListener('DOMContentLoaded', () => {
  // Get references to key DOM elements
  const taskForm = document.getElementById('create-task-form');
  const taskInput = document.getElementById('new-task-description');
  const taskList = document.querySelector('#tasks') || createTaskList();
  const prioritySelect = createPrioritySelect();
  const sortButton = createSortButton();
  
  let tasks = [];
  let sortDirection = 'asc';

  // Add event listener for form submission
  taskForm.addEventListener('submit', handleFormSubmit);

  // Create and insert priority dropdown before submit button
  function createPrioritySelect() {
    const priorityLabel = document.createElement('label');
    priorityLabel.setAttribute('for', 'task-priority');
    priorityLabel.textContent = 'Priority: ';
    
    const select = document.createElement('select');
    select.id = 'task-priority';
    select.name = 'task-priority';
    
    const priorities = [
      { value: 'high', text: 'High', color: '#ff5252' },
      { value: 'medium', text: 'Medium', color: '#ffb142' },
      { value: 'low', text: 'Low', color: '#78e08f' }
    ];
    
    priorities.forEach(priority => {
      const option = document.createElement('option');
      option.value = priority.value;
      option.textContent = priority.text;
      select.appendChild(option);
    });
    
    // Insert priority dropdown before the submit button
    const submitButton = taskForm.querySelector('input[type="submit"]');
    taskForm.insertBefore(priorityLabel, submitButton);
    taskForm.insertBefore(select, submitButton);
    taskForm.insertBefore(document.createElement('br'), submitButton);
    
    return select;
  }

  // Create sort button and add to the page
  function createSortButton() {
    const button = document.createElement('button');
    button.id = 'sort-button';
    button.textContent = 'Sort by Priority';
    button.style.marginLeft = '10px';
    
    button.addEventListener('click', () => {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      button.textContent = `Sort by Priority (${sortDirection === 'asc' ? 'Low-High' : 'High-Low'})`;
      sortTasks();
    });
    
    // Append button after the form
    taskForm.parentNode.insertBefore(button, taskForm.nextSibling);
    
    return button;
  }

  // Create the tasks container if it doesn't exist
  function createTaskList() {
    const taskSection = document.createElement('section');
    taskSection.id = 'tasks';
    
    const heading = document.createElement('h2');
    heading.textContent = 'Tasks';
    taskSection.appendChild(heading);
    
    const ul = document.createElement('ul');
    ul.id = 'tasks-list';
    taskSection.appendChild(ul);
    
    // Append to body or a specific container
    document.body.appendChild(taskSection);
    
    return taskSection;
  }

  // Handle form submission
  function handleFormSubmit(event) {
    // Prevent the default form submission
    event.preventDefault();
    
    // Get the value from the input field
    const taskDescription = taskInput.value.trim();
    const priority = prioritySelect.value;
    
    // Only add task if description is not empty
    if (taskDescription !== '') {
      // Create a new task object
      const newTask = {
        id: Date.now(), // Unique ID for the task
        description: taskDescription,
        priority: priority,
        completed: false,
        createdAt: new Date()
      };
      
      // Add task to our array
      tasks.push(newTask);
      
      // Add task to the DOM
      addTaskToDOM(newTask);
      
      // Clear the input field
      taskInput.value = '';
      
      // Focus back on the input field
      taskInput.focus();
    }
  }

  // Add a task to the DOM
  function addTaskToDOM(task) {
    // Get the task list element
    const tasksList = document.getElementById('tasks-list') || createTasksList();
    
    // Create a list item for the task
    const listItem = document.createElement('li');
    listItem.setAttribute('data-id', task.id);
    listItem.setAttribute('data-priority', task.priority);
    listItem.classList.add('task-item');
    
    // Set task text color based on priority
    const priorityColors = {
      high: '#ff5252',
      medium: '#ffb142',
      low: '#78e08f'
    };
    
    // Create task content
    const taskSpan = document.createElement('span');
    taskSpan.textContent = task.description;
    taskSpan.style.color = priorityColors[task.priority];
    taskSpan.classList.add('task-text');
    
    // Add the task's priority as a badge
    const priorityBadge = document.createElement('span');
    priorityBadge.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
    priorityBadge.classList.add('priority-badge');
    priorityBadge.style.backgroundColor = priorityColors[task.priority];
    priorityBadge.style.color = '#fff';
    priorityBadge.style.borderRadius = '3px';
    priorityBadge.style.padding = '2px 6px';
    priorityBadge.style.fontSize = '0.8em';
    priorityBadge.style.marginLeft = '10px';
    
    // Create edit button
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-btn');
    editButton.style.marginLeft = '10px';
    
    // Create delete button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.style.marginLeft = '5px';
    
    // Add event listener to delete button
    deleteButton.addEventListener('click', () => {
      // Remove from the array
      tasks = tasks.filter(t => t.id !== task.id);
      // Remove from the DOM
      listItem.remove();
    });
    
    // Add event listener to edit button
    editButton.addEventListener('click', () => {
      const currentText = taskSpan.textContent;
      const editInput = document.createElement('input');
      editInput.type = 'text';
      editInput.value = currentText;
      editInput.style.width = '60%';
      
      // Create save button
      const saveButton = document.createElement('button');
      saveButton.textContent = 'Save';
      saveButton.style.marginLeft = '5px';
      
      // Replace the task text with the edit field
      listItem.innerHTML = '';
      listItem.appendChild(editInput);
      listItem.appendChild(saveButton);
      
      // Focus on the input
      editInput.focus();
      
      // Handle save button click
      saveButton.addEventListener('click', () => {
        const newText = editInput.value.trim();
        if (newText !== '') {
          // Update in our array
          const taskToUpdate = tasks.find(t => t.id === task.id);
          if (taskToUpdate) {
            taskToUpdate.description = newText;
          }
          
          // Update in DOM
          taskSpan.textContent = newText;
          
          // Restore the original list item structure
          listItem.innerHTML = '';
          listItem.appendChild(taskSpan);
          listItem.appendChild(priorityBadge);
          listItem.appendChild(editButton);
          listItem.appendChild(deleteButton);
        }
      });
    });
    
    // Append all elements to the list item
    listItem.appendChild(taskSpan);
    listItem.appendChild(priorityBadge);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    
    // Append the list item to the task list
    tasksList.appendChild(listItem);
  }
  
  // Create tasks list if it doesn't exist
  function createTasksList() {
    const ul = document.createElement('ul');
    ul.id = 'tasks-list';
    
    // If the tasks section exists, append to it
    const tasksSection = document.getElementById('tasks');
    if (tasksSection) {
      tasksSection.appendChild(ul);
    } else {
      // Create tasks section if it doesn't exist
      const section = document.createElement('section');
      section.id = 'tasks';
      
      const heading = document.createElement('h2');
      heading.textContent = 'Tasks';
      section.appendChild(heading);
      section.appendChild(ul);
      
      document.body.appendChild(section);
    }
    
    return ul;
  }
  
  // Sort tasks based on priority
  function sortTasks() {
    const tasksList = document.getElementById('tasks-list');
    const items = Array.from(tasksList.children);
    
    // Define priority order
    const priorityOrder = {
      'high': 3,
      'medium': 2,
      'low': 1
    };
    
    // Sort the items
    items.sort((a, b) => {
      const aPriority = a.getAttribute('data-priority');
      const bPriority = b.getAttribute('data-priority');
      
      if (sortDirection === 'asc') {
        return priorityOrder[aPriority] - priorityOrder[bPriority];
      } else {
        return priorityOrder[bPriority] - priorityOrder[aPriority];
      }
    });
    
    // Clear and re-append in sorted order
    tasksList.innerHTML = '';
    items.forEach(item => tasksList.appendChild(item));
  }
});