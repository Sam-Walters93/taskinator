var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var taskIdCounter = 0;
var tasks = [];

var pageContentEl = document.querySelector("#page-content");

function taskButtonHandler(event) {
    var targetEl = event.target;
    
    if (targetEl.matches('.edit-btn')) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    else if (targetEl.matches(".delete-btn")) {
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    };
};

// other logic...

pageContentEl.addEventListener("click", taskButtonHandler);

function createTaskEl(taskDataObj) {
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    // give it a class name
    taskInfoEl.className = "task-info";
    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);

    saveTasks();

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    taskIdCounter++;
};

function createTaskActions(taskId) {
    //create button container and edit classname
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button 
    var editButtonEl = document.createElement('button');
    //set button text, class, and attr.
    editButtonEl.textContent = 'Edit';
    editButtonEl.className = 'btn edit-btn';
    editButtonEl.setAttribute('data-task-id', taskId);
    
    //append button to local button container 
    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    //set button text, class, and attr.
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    //append button to local button container
    actionContainerEl.appendChild(deleteButtonEl);

    //create dropdown selector
    var statusSelectEl = document.createElement('select');
    //set dropdown text, class, and attr
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (i=0;i<statusChoices.length;i++) {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        statusSelectEl.appendChild(statusOptionEl);
    };    

    //append dropdown to local button container
    actionContainerEl.appendChild(statusSelectEl);

    return actionContainerEl;
};

function deleteTask(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")
    taskSelected.remove();

    var updatedTaskArr = [];

    for (i=0;i<tasks.length;i++) {
        if (tasks[i].id === parseInt(taskId)) {
            return tasks.splice(indexOf(tasks[i]));
        }
    }

    saveTasks();
};

function editTask(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")

    var taskName = taskSelected.querySelector("h3.task-name").textContent;

    var taskType = taskSelected.querySelector("span.task-type").textContent;


    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);
};

function completeEditTask(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    for (i=0;i<tasks.length;i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        };
    }

    saveTasks();

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";

    alert("Task Updated!");
} 

function taskFormHandler() {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");
   
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
    }


    if (isEdit) {
        var taskId =  formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    else { 
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

        createTaskEl(taskDataObj);
    };
};

function taskStatusChangeHandler(event) {
    var taskId = event.target.getAttribute("data-task-id");

    var statusValue = event.target.value.toLowerCase();

    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === 'to do') {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === 'in progress') {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === 'completed') {
        tasksCompletedEl.appendChild(taskSelected);
    }

    for (i=0;i<tasks.length;i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue; 
        }
    }

    saveTasks();
};

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    console.log(tasks);
};

function loadTasks() {
    //get tasks from local storage 
    tasks = localStorage.getItem("tasks", tasks);

    if (tasks === null) {
        tasks =[];
        return false;
    }
    
    //convert task from sting back into array of obj
    tasks = JSON.parse(tasks);

    console.log(tasks.length);

    //iterate over task arr and create task elements to put on page
    for (var i = 0; i < tasks.length; i++) {
        var listItemEl = document.createElement("li");
        listItemEl.className = 'task-item';
        listItemEl.setAttribute('data-task-id', tasks[i].id);

        var taskInfoEl = document.createElement("div");
        taskInfoEl.className = "task-info";
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
        
        listItemEl.appendChild(taskInfoEl);
        tasksActionsEl = createTaskActions(tasks[i].id);

        listItemEl.appendChild(tasksActionsEl);

        if (tasks[i].status === 'to do') {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = '0';
            tasksToDoEl.appendChild(listItemEl);
        } 
        if (tasks[i].status === 'in progress') {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = '1';
            tasksInProgressEl.appendChild(listItemEl);
        }
        if (tasks[i].status === 'completed') {
            listItemEl.querySelector("select[name='status-change']").selectedIndex = '2';
            tasksCompletedEl.appendChild(listItemEl);
        }

        taskIdCounter++
        console.log(listItemEl);
    }
  

};

//EVENT LISTENERS
formEl.addEventListener('submit', taskFormHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);

loadTasks();



