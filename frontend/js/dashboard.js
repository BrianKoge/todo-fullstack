// ==============================
// CHECK LOGIN
// ==============================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}


// ==============================
// USER INFORMATION
// ==============================

const user = JSON.parse(
    localStorage.getItem("user")
);

if (user) {

    document.getElementById("userName").textContent =
        user.name;

    document.getElementById("welcomeMessage").textContent =
        `Welcome, ${user.name}!`;
}


// ==============================
// ELEMENTS
// ==============================

const taskList =
    document.getElementById("taskList");

const totalTasks =
    document.getElementById("totalTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

const completedTasks =
    document.getElementById("completedTasks");

const overdueTasks =
    document.getElementById("overdueTasks");

const taskModal =
    document.getElementById("taskModal");

const taskForm =
    document.getElementById("taskForm");

const taskFilter =
    document.getElementById("taskFilter");

const searchTasks =
    document.getElementById("searchTasks");

const categoryFilter =
    document.getElementById("categoryFilter");

// Store tasks
let tasks = [];

function openTaskModal() {
    taskModal.style.display = "flex";
    document.body.classList.add("modal-open");
    setTimeout(() => document.getElementById("taskTitle").focus(), 0);
}

function closeTaskModal() {
    taskModal.style.display = "none";
    document.body.classList.remove("modal-open");
}


// ==============================
// LOAD TASKS
// ==============================

async function loadTasks() {

    try {

        const data =
            await apiRequest("/tasks");

        tasks = data.tasks;

        displayTasks();

        updateStatistics();

    } catch (error) {

        console.error(error);

        if (
            error.message.includes("token") ||
            error.message.includes("access")
        ) {
            logout();
        }

        taskList.innerHTML =
            `<p>${error.message}</p>`;
    }
}


// ==============================
// DISPLAY TASKS
// ==============================

function displayTasks() {

    let filteredTasks = [...tasks];

    const filter =
        taskFilter.value;

    const category =
        categoryFilter.value;

    const search =
        searchTasks.value.toLowerCase().trim();


    // Status filter
    if (filter === "pending") {

        filteredTasks =
            filteredTasks.filter(task =>
                !task.completed
            );
    }


    if (filter === "completed") {

        filteredTasks =
            filteredTasks.filter(task =>
                task.completed
            );
    }


    // Category filter
    if (category !== "all") {

        filteredTasks =
            filteredTasks.filter(task =>
                task.category === category
            );
    }


    // Search
    if (search) {

        filteredTasks =
            filteredTasks.filter(task =>

                task.title
                    .toLowerCase()
                    .includes(search)

                ||

                (task.description || "")
                    .toLowerCase()
                    .includes(search)

            );
    }


    if (filteredTasks.length === 0) {

        taskList.innerHTML =
            `<p class="empty-state">
                <strong>No tasks found</strong>
                Try changing your search or filters, or add a new task.
             </p>`;

        return;
    }


    taskList.innerHTML =
        filteredTasks.map(task => {

            const completedClass =
                task.completed
                    ? "task-completed"
                    : "";

            const overdue =
                isOverdue(task);


            return `

                <div class="task-card ${completedClass}">

                    <div class="task-info">

                        <h3>
                            ${escapeHTML(task.title)}
                        </h3>

                        <p>
                            ${escapeHTML(
                                task.description || ""
                            )}
                        </p>

                        <div class="task-meta">

                            <span class="priority priority-${task.priority}">
                                ${task.priority.toUpperCase()}
                            </span>

                            <span class="category">
                                ${escapeHTML(
                                    task.category || "General"
                                )}
                            </span>

                            ${
                                task.due_date
                                ? `
                                    <span class="${
                                        overdue
                                        ? "overdue"
                                        : "due-date"
                                    }">
                                        ${
                                            overdue
                                            ? "⚠ Overdue: "
                                            : "Due: "
                                        }
                                        ${formatDate(task.due_date)}
                                    </span>
                                `
                                : ""
                            }

                        </div>

                    </div>


                    <div class="task-actions">

                        <button
                            class="complete-btn"
                            onclick="toggleTask(${task.id})"
                        >
                            ${
                                task.completed
                                ? "Undo"
                                : "Complete"
                            }
                        </button>

                        <button
                            class="edit-btn"
                            onclick="editTask(${task.id})"
                        >
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteTask(${task.id})"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            `;

        }).join("");
}


// ==============================
// STATISTICS
// ==============================

function updateStatistics() {

    const total =
        tasks.length;

    const completed =
        tasks.filter(task =>
            task.completed
        ).length;

    const pending =
        total - completed;

    const overdue =
        tasks.filter(task =>
            isOverdue(task)
        ).length;


    totalTasks.textContent =
        total;

    pendingTasks.textContent =
        pending;

    completedTasks.textContent =
        completed;

    overdueTasks.textContent =
        overdue;
}


// ==============================
// OPEN ADD TASK MODAL
// ==============================

document.getElementById("addTaskBtn")
    .addEventListener("click", () => {

        taskForm.reset();

        document.getElementById("taskId").value = "";

        document.getElementById("modalTitle").textContent =
            "Add Task";

        openTaskModal();
    });


// ==============================
// CLOSE MODAL
// ==============================

document.getElementById("closeModal")
    .addEventListener("click", () => {

        closeTaskModal();

    });


// ==============================
// CREATE / UPDATE TASK
// ==============================

taskForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const taskId =
        document.getElementById("taskId").value;

    const taskData = {

        title:
            document.getElementById("taskTitle").value,

        description:
            document.getElementById("taskDescription").value,

        priority:
            document.getElementById("taskPriority").value,

        category:
            document.getElementById("taskCategory").value,

        due_date:
            document.getElementById("taskDueDate").value || null
    };


    try {

        if (taskId) {

            await apiRequest(
                `/tasks/${taskId}`,
                {
                    method: "PUT",

                    body: JSON.stringify(taskData)
                }
            );

        } else {

            await apiRequest(
                "/tasks",
                {
                    method: "POST",

                    body: JSON.stringify(taskData)
                }
            );

        }


        closeTaskModal();

        await loadTasks();

    } catch (error) {

        alert(error.message);

    }

});


// ==============================
// EDIT TASK
// ==============================

function editTask(id) {

    const task =
        tasks.find(task =>
            task.id === id
        );

    if (!task) return;


    document.getElementById("taskId").value =
        task.id;

    document.getElementById("taskTitle").value =
        task.title;

    document.getElementById("taskDescription").value =
        task.description || "";

    document.getElementById("taskPriority").value =
        task.priority;

    document.getElementById("taskCategory").value =
        task.category || "General";

    document.getElementById("taskDueDate").value =
        task.due_date || "";


    document.getElementById("modalTitle").textContent =
        "Edit Task";


    openTaskModal();
}

taskModal.addEventListener("click", (event) => {
    if (event.target === taskModal) closeTaskModal();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && taskModal.style.display === "flex") {
        closeTaskModal();
    }
});


// ==============================
// COMPLETE TASK
// ==============================

async function toggleTask(id) {

    try {

        await apiRequest(
            `/tasks/${id}/complete`,
            {
                method: "PATCH"
            }
        );

        await loadTasks();

    } catch (error) {

        alert(error.message);

    }
}


// ==============================
// DELETE TASK
// ==============================

async function deleteTask(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this task?"
        );

    if (!confirmed) return;


    try {

        await apiRequest(
            `/tasks/${id}`,
            {
                method: "DELETE"
            }
        );

        await loadTasks();

    } catch (error) {

        alert(error.message);

    }
}


// ==============================
// FILTER
// ==============================

taskFilter.addEventListener(
    "change",
    displayTasks
);

categoryFilter.addEventListener(
    "change",
    displayTasks
);

searchTasks.addEventListener(
    "input",
    displayTasks
);

// ==============================
// LOGOUT
// ==============================

document.getElementById("logoutBtn")
    .addEventListener("click", logout);


function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href =
        "login.html";
}


// ==============================
// HELPERS
// ==============================

function formatDate(date) {

    return new Date(date)
        .toLocaleDateString();
}


function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}

function isOverdue(task) {

    if (!task.due_date || task.completed) {
        return false;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const dueDate =
        new Date(task.due_date);

    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
}
// ==============================
// START
// ==============================

loadTasks();
