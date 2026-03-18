const firebaseConfig = {
  apiKey: "AIzaSyABBiZ665TxQktlPynC9DAZtB8d0U_QJ8w",
  authDomain: "daily-practice-tracker.firebaseapp.com",
  databaseURL:
    "https://daily-practice-tracker-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "daily-practice-tracker",
  storageBucket: "daily-practice-tracker.firebasestorage.app",
  messagingSenderId: "149600530913",
  appId: "1:149600530913:web:b7478144c0fc051fb8a2a0",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- Authentication ---
let currentUser = null;
let isGuest = localStorage.getItem("isGuestTracker") === "true";

function continueAsGuest() {
  isGuest = true;
  localStorage.setItem("isGuestTracker", "true");

  document.getElementById("authOverlay").style.display = "none";
  const loader = document.getElementById("globalLoader");
  if (loader) loader.style.display = "none";

  const profile = document.getElementById("userProfile");
  if (profile) {
    profile.classList.add("hidden");
    profile.classList.remove("flex");
  }

  const guestProfile = document.getElementById("guestProfile");
  if (guestProfile) {
    guestProfile.classList.remove("hidden");
    guestProfile.classList.add("flex");
  }

  loadState();
}

function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase
    .auth()
    .signInWithPopup(provider)
    .catch((error) => {
      console.error("Auth error:", error);
      alert("Authentication failed: " + error.message);
    });
}

function signOutUser() {
  firebase.auth().signOut();
}

// --- State Management ---
let appState = {
  tasks: [],
  history: [], // Array of { dateKey: 'YYYY-MM-DD', totalTime: 0, completedTasks: 0, totalTasks: 8 }
  lastResetTime: null, // Timestamp of the last reset (based on 6AM BD time relative logic)
};

let currentActiveTaskId = null;

// --- Utility Functions ---

// Get current time in Bangladesh (UTC+6)
function getBDTime() {
  const now = new Date();
  // Convert to UTC+6 offset manually to be perfectly safe regardless of user local tz
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * 6);
}

// Get a string key for the BD date (YYYY-MM-DD), adjusted for the 6AM boundary.
// If it's before 6 AM, it counts as the previous day.
function getEffectiveBDDateStr() {
  const bdTime = getBDTime();
  // If before 6 AM, subtract 1 day
  if (bdTime.getHours() < 6) {
    bdTime.setDate(bdTime.getDate() - 1);
  }
  return `${bdTime.getFullYear()}-${String(bdTime.getMonth() + 1).padStart(2, "0")}-${String(bdTime.getDate()).padStart(2, "0")}`;
}

// Check if a reset is required based on the effective date string
function checkDailyReset() {
  const currentDateStr = getEffectiveBDDateStr();
  let didReset = false;

  if (appState.lastResetTime !== currentDateStr) {
    console.log("New day detected. Resetting tasks/history.");

    // If we have previous tasks, save their stats to history before resetting
    if (appState.tasks.length > 0 && appState.lastResetTime) {
      const totalTime = appState.tasks.reduce(
        (sum, t) => sum + (t.status === "DONE" ? t.actualTime || 0 : 0),
        0,
      );
      const completedTasks = appState.tasks.filter(
        (t) => t.status === "DONE",
      ).length;

      appState.history.push({
        dateKey: appState.lastResetTime,
        totalTime: totalTime,
        completedTasks: completedTasks,
        totalTasks: appState.tasks.length,
      });
    }

    // Reset tasks to TODO, preserving their dynamic properties
    appState.tasks = appState.tasks.map((t) => ({
      ...t,
      status: "TODO",
      actualTime: 0,
      completedAt: null,
    }));

    appState.lastResetTime = currentDateStr;
    didReset = true;
  }
  return didReset;
}

function loadState() {
  if (isGuest) {
    const saved = localStorage.getItem("guestTrackerState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        appState.tasks = (parsed.tasks || []).map((t) => t);
        appState.history = parsed.history || [];
        appState.lastResetTime = parsed.lastResetTime || null;
      } catch (e) {}
    }

    if (!appState.tasks || appState.tasks.length === 0) {
      appState.tasks = INITIAL_TASKS.map((t) => ({
        ...t,
        status: "TODO",
        actualTime: 0,
        completedAt: null,
      }));
    }

    const didReset = checkDailyReset();
    if (didReset) {
      saveState();
    } else {
      updateUI();
    }
    return;
  }

  if (!currentUser) return;
  const stateRef = db.ref(`users/${currentUser.uid}/trackerState`);

  stateRef.on("value", (snapshot) => {
    if (snapshot.exists()) {
      const parsed = snapshot.val();
      appState.tasks = (parsed.tasks || []).map((t) => {
        return t;
      });
      appState.history = parsed.history || [];
      appState.lastResetTime = parsed.lastResetTime || null;

      const didReset = checkDailyReset();
      if (didReset) {
        saveState();
      } else {
        updateUI();
      }
    } else {
      // First time loading from Firebase, try to migrate from old localStorage
      const saved = localStorage.getItem("practiceTrackerState");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          appState.tasks = (parsed.tasks || []).map((t) => {
            return t;
          });
          appState.history = parsed.history || [];
          appState.lastResetTime = parsed.lastResetTime || null;
        } catch (e) {}
      }

      if (!appState.tasks || appState.tasks.length === 0) {
        appState.tasks = INITIAL_TASKS.map((t) => ({
          ...t,
          status: "TODO",
          actualTime: 0,
          completedAt: null,
        }));
      }

      checkDailyReset();
      // Push initial state to Firebase
      saveState();
    }
  });
}

function saveState() {
  if (isGuest) {
    localStorage.setItem("guestTrackerState", JSON.stringify(appState));
    updateUI();
    return;
  }

  if (!currentUser) return;
  db.ref(`users/${currentUser.uid}/trackerState`).set(appState);
  updateUI();
}

// --- UI Rendering ---

function updateUI() {
  renderHeaderDate();
  renderTasks();
  updateStatistics();

  // Render icons safely after DOM updates
  if (window.lucide) {
    lucide.createIcons();
  }
}

function renderHeaderDate() {
  const bdTime = getBDTime();
  const dateEl = document.getElementById("currentDateText");
  // Using date-fns as requested by global rules
  if (dateEl && window.dateFns) {
    dateEl.innerText = window.dateFns.format(bdTime, "EEEE, MMMM d, yyyy");
  } else if (dateEl) {
    // Fallback just in case CDN is blocked
    dateEl.innerText = bdTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
}

function getTaskTimeBadge(targetStr) {
  let icon = "clock";
  let colorClass = "text-amber-500 bg-amber-50 border-amber-100";
  if (targetStr === "Unlimited") {
    icon = "infinity";
    colorClass = "text-indigo-500 bg-indigo-50 border-indigo-100";
  } else if (targetStr === "Sometimes") {
    icon = "shuffle";
    colorClass = "text-rose-500 bg-rose-50 border-rose-100";
  }
  return `
    <div class="${colorClass} font-semibold text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-full border">
        <i data-lucide="${icon}" class="w-3.5 h-3.5"></i> ${targetStr}
    </div>
  `;
}

function renderTasks() {
  const todoContainer = document.getElementById("todoList");
  const doneContainer = document.getElementById("doneList");
  if (!todoContainer || !doneContainer) return;

  const todoTasks = appState.tasks.filter((t) => t.status === "TODO");
  const doneTasks = appState.tasks
    .filter((t) => t.status === "DONE")
    .sort((a, b) => b.completedAt - a.completedAt);

  document.getElementById("todoCountBadge").innerText = todoTasks.length;
  document.getElementById("doneCountBadge").innerText = doneTasks.length;

  document
    .getElementById("emptyTodoState")
    .classList.toggle("hidden", todoTasks.length > 0);
  document
    .getElementById("emptyDoneState")
    .classList.toggle("hidden", doneTasks.length > 0);

  // Render TODOs
  todoContainer.innerHTML = todoTasks
    .map(
      (t, index) => `
          <div class="bg-white border border-slate-200 task-card rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 group" style="animation: slideUp 0.3s ease-out forwards; animation-delay: ${index * 0.05}s; opacity: 0; transform: translateY(10px);">
              <div class="shrink-0 w-12 h-12 rounded-xl ${t.colorClass} flex items-center justify-center shadow-sm">
                  <i data-lucide="${t.icon}" class="w-6 h-6"></i>
              </div>
              <div class="flex-1 min-w-0 w-full">
                  <div class="flex flex-wrap sm:flex-nowrap justify-between items-start gap-2 mb-0.5">
                      <h3 class="font-bold text-slate-800 text-base leading-tight group-hover:text-brand-700 transition-colors truncate">${t.name}</h3>
                      <div class="shrink-0 sm:ml-2">
                          ${getTaskTimeBadge(t.targetStr)}
                      </div>
                  </div>
                  <p class="text-slate-500 text-sm leading-relaxed truncate group-hover:text-slate-600 transition-colors">${t.desc}</p>
              </div>
              <div class="shrink-0 w-full sm:w-auto mt-3 sm:mt-0 flex justify-between sm:justify-end gap-2 sm:ml-1 items-center">
               <div class="shrink-0 flex gap-2">
                  <button onclick="editTask('${t.id}')" class="flex w-8 h-8 sm:w-6 sm:h-6 shrink-0 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 items-center justify-center focus:outline-none hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 shadow-sm transition-all focus:ring-2 focus:ring-indigo-100" title="Edit Task">
                      <i data-lucide="edit-2" class="w-4 h-4 sm:w-2.5 sm:h-2.5"></i>
                  </button>
                  <button onclick="deleteTask('${t.id}')" class="flex w-8 h-8 sm:w-6 sm:h-6 shrink-0 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 items-center justify-center focus:outline-none hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50 shadow-sm transition-all focus:ring-2 focus:ring-rose-100" title="Delete Task">
                      <i data-lucide="trash-2" class="w-4 h-4 sm:w-2.5 sm:h-2.5"></i>
                  </button>
               </div>
               <button onclick="openTimeModal('${t.id}')" class="flex-1 sm:flex-none flex sm:w-10 sm:h-10 py-2.5 sm:py-0 shrink-0 rounded-xl sm:rounded-full bg-slate-50 border border-slate-200 text-slate-400 items-center justify-center focus:outline-none hover:border-emerald-400 hover:text-emerald-500 hover:bg-emerald-50 shadow-sm transition-all focus:ring-4 focus:ring-emerald-100 font-semibold sm:font-normal gap-2 sm:gap-0" title="Mark Done">
                   <i data-lucide="check" class="w-5 h-5"></i> <span class="sm:hidden text-sm">Mark Done</span>
               </button>
              </div>
          </div>
      `,
    )
    .join("");

  // Render DONEs
  doneContainer.innerHTML = doneTasks
    .map(
      (t, index) => `
          <div class="bg-slate-50 border border-slate-200 shadow-sm rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 opacity-80 hover:opacity-100 transition-opacity group relative" style="animation: slideUp 0.3s ease-out forwards; animation-delay: ${index * 0.05}s; opacity: 0; transform: translateY(10px);">
              <div class="shrink-0 w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center">
                  <i data-lucide="check" class="w-6 h-6"></i>
              </div>
              <div class="flex-1 min-w-0 w-full">
                  <div class="flex flex-wrap sm:flex-nowrap justify-between items-start gap-2 mb-0.5">
                      <h3 class="font-bold text-slate-500 text-base line-through leading-tight truncate w-full sm:w-auto">${t.name}</h3>
                      <div class="text-emerald-600 font-bold text-xs flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 shrink-0 sm:ml-2">
                          <i data-lucide="timer" class="w-3.5 h-3.5"></i> ${t.actualTime} min
                      </div>
                  </div>
                  <p class="text-slate-400 text-sm leading-relaxed truncate">${t.desc}</p>
              </div>
              <div class="shrink-0 w-full sm:w-auto mt-3 sm:mt-0 flex justify-between sm:justify-end gap-2 sm:ml-1 items-center">
               <div class="shrink-0 flex gap-2">
                  <button onclick="editTask('${t.id}')" class="flex w-8 h-8 sm:w-6 sm:h-6 shrink-0 rounded-lg bg-white/50 border border-slate-200 text-slate-400 items-center justify-center focus:outline-none hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 shadow-sm transition-all focus:ring-2 focus:ring-indigo-100" title="Edit Task">
                      <i data-lucide="edit-2" class="w-4 h-4 sm:w-2.5 sm:h-2.5"></i>
                  </button>
                  <button onclick="deleteTask('${t.id}')" class="flex w-8 h-8 sm:w-6 sm:h-6 shrink-0 rounded-lg bg-white/50 border border-slate-200 text-slate-400 items-center justify-center focus:outline-none hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50 shadow-sm transition-all focus:ring-2 focus:ring-rose-100" title="Delete Task">
                      <i data-lucide="trash-2" class="w-4 h-4 sm:w-2.5 sm:h-2.5"></i>
                  </button>
               </div>
               <button onclick="undoTask('${t.id}')" title="Undo" class="flex-1 sm:flex-none flex sm:w-10 sm:h-10 py-2.5 sm:py-0 shrink-0 items-center justify-center gap-2 sm:gap-0 text-slate-400 font-semibold sm:font-normal hover:text-indigo-500 transition-colors rounded-xl sm:rounded-full hover:bg-white/50 border border-transparent hover:border-slate-200 shadow-sm">
                   <i data-lucide="rotate-ccw" class="w-4 h-4"></i> <span class="sm:hidden text-sm">Undo</span>
               </button>
              </div>
          </div>
      `,
    )
    .join("");
}

function updateStatistics() {
  const totalTasks = appState.tasks.length;
  const doneTasks = appState.tasks.filter((t) => t.status === "DONE");
  const completedCount = doneTasks.length;

  let todayTime = 0;
  doneTasks.forEach((t) => (todayTime += t.actualTime || 0));

  // Today's Stats
  document.getElementById("statTasksDone").innerText = completedCount;
  document.getElementById("statTasksTotal").innerText = totalTasks;
  document.getElementById("statTimeSpent").innerText = todayTime;

  // Progress Ring
  const percentage =
    totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);
  document.getElementById("progressPercentage").innerText = `${percentage}%`;

  const circle = document.getElementById("progressRing");
  const radius = circle.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = offset;

  // Historical Stats Analysis
  calculateHistoricalStats(todayTime);
}

// --- Advanced Analytics ---
function calculateHistoricalStats(todayTime) {
  const currentEffectiveDate = getEffectiveBDDateStr();
  const bdTime = getBDTime();
  // Treat hours < 6 as previous day for calculation boundaries
  if (bdTime.getHours() < 6) bdTime.setDate(bdTime.getDate() - 1);

  const history = appState.history;
  let totalEverTime = 0;
  let daysRecorded = history.length;

  let rolling7Total = todayTime; // include today
  let rolling30Total = todayTime;

  const todayObj = new Date(currentEffectiveDate);

  history.forEach((record) => {
    totalEverTime += record.totalTime;

    const recDate = new Date(record.dateKey);
    // Calculate difference in milliseconds, convert to days
    const diffTime = Math.abs(todayObj - recDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) rolling7Total += record.totalTime;
    if (diffDays <= 30) rolling30Total += record.totalTime;
  });

  // Calculate Avg
  // Include today in average if we have done anything or if it's late in the day.
  // Average over (history.length + 1) days
  const overallAvg =
    daysRecorded === 0
      ? todayTime
      : Math.round((totalEverTime + todayTime) / (daysRecorded + 1));

  document.getElementById("statAvgDaily").innerText = overallAvg;
  document.getElementById("statTotalWeekly").innerText = rolling7Total;
  document.getElementById("statTotalMonthly").innerText = rolling30Total;

  // Update bars (visual only, max constraints for layout)
  // Example targets: 120min/day avg, 840min/week, 3600min/month
  const avgPct = Math.min((overallAvg / 120) * 100, 100);
  const weekPct = Math.min((rolling7Total / 840) * 100, 100);
  const monthPct = Math.min((rolling30Total / (120 * 30)) * 100, 100);

  // Add width via timeout to allow initial render 0 to animate to final
  setTimeout(() => {
    document.getElementById("barDaily").style.width = `${avgPct}%`;
    document.getElementById("barWeekly").style.width = `${weekPct}%`;
    document.getElementById("barMonthly").style.width = `${monthPct}%`;
  }, 100);
}

// --- Interaction Logic ---

function openTimeModal(taskId) {
  currentActiveTaskId = taskId;
  const task = appState.tasks.find((t) => t.id === taskId);

  document.getElementById("modalTaskName").innerText = task.name;
  const input = document.getElementById("timeInput");
  const helper = document.getElementById("modalTargetTimeHelper");

  if (task.targetTime) {
    input.value = task.targetTime;
    helper.innerHTML = `<i data-lucide="target" class="w-3 h-3 inline mr-1 -mt-0.5"></i> Target was ${task.targetTime} minutes.`;
  } else {
    input.value = "";
    helper.innerText = "No specific time target. Enter your actual time.";
  }

  lucide.createIcons(); // Refresh inline icon

  const modal = document.getElementById("timeModal");
  modal.style.display = "flex";

  // Focus input after modal animation starts
  setTimeout(() => input.focus(), 50);
}

function closeModal() {
  document.getElementById("timeModal").style.display = "none";
  currentActiveTaskId = null;
}

function submitTaskCompletion() {
  if (!currentActiveTaskId) return;

  const inputVal = document.getElementById("timeInput").value;
  // Default to 0 if empty
  const timeSpent = parseInt(inputVal, 10) || 0;

  const taskIndex = appState.tasks.findIndex(
    (t) => t.id === currentActiveTaskId,
  );
  if (taskIndex !== -1) {
    appState.tasks[taskIndex].status = "DONE";
    appState.tasks[taskIndex].actualTime = timeSpent;
    appState.tasks[taskIndex].completedAt = Date.now();
    saveState();
  }

  closeModal();
  triggerSuccessFeedback();
}

function undoTask(taskId) {
  const taskIndex = appState.tasks.findIndex((t) => t.id === taskId);
  if (taskIndex !== -1) {
    appState.tasks[taskIndex].status = "TODO";
    appState.tasks[taskIndex].actualTime = 0;
    appState.tasks[taskIndex].completedAt = null;
    saveState();
  }
}

function deleteTask(taskId) {
  if (confirm("Are you sure you want to permanently delete this task?")) {
    appState.tasks = appState.tasks.filter((t) => t.id !== taskId);
    saveState();
  }
}

// Add Task Modal Logic
let selectedNewTaskIcon = AVAILABLE_ICONS[0];
let isIconSelectorExpanded = false;
let editingTaskId = null;

function renderIconSelector() {
  const container = document.getElementById("iconSelectorContainer");
  if (!container) return;

  const displayIcons = isIconSelectorExpanded
    ? AVAILABLE_ICONS
    : AVAILABLE_ICONS.slice(0, 22);
  let html = displayIcons
    .map(
      (icon) => `
    <button onclick="selectNewTaskIcon('${icon}')" type="button" class="w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all shrink-0 ${
      selectedNewTaskIcon === icon
        ? "border-brand-500 bg-brand-50 text-brand-600 cursor-default shadow-sm"
        : "border-slate-200 bg-white text-slate-400 hover:border-brand-300 hover:text-brand-500 hover:bg-slate-50 cursor-pointer shadow-sm"
    }">
      <i data-lucide="${icon}" class="w-5 h-5"></i>
    </button>
  `,
    )
    .join("");

  if (!isIconSelectorExpanded && AVAILABLE_ICONS.length > 22) {
    html += `
      <button onclick="toggleIconSelector()" type="button" class="w-auto px-3 h-10 rounded-xl flex items-center justify-center border-2 border-slate-200 bg-slate-50 text-slate-500 hover:text-brand-600 hover:border-brand-300 transition-all shadow-sm font-semibold text-xs cursor-pointer shrink-0">
        +${AVAILABLE_ICONS.length - 22} More
      </button>
    `;
  } else if (isIconSelectorExpanded) {
    html += `
      <button onclick="toggleIconSelector()" type="button" class="w-auto px-3 h-10 rounded-xl flex items-center justify-center border-2 border-slate-200 bg-slate-50 text-slate-500 hover:text-brand-600 hover:border-brand-300 transition-all shadow-sm font-semibold text-xs cursor-pointer shrink-0">
        Show Less
      </button>
    `;
  }

  container.innerHTML = html;
  if (window.lucide) lucide.createIcons();
}

function toggleIconSelector() {
  isIconSelectorExpanded = !isIconSelectorExpanded;
  renderIconSelector();
}

function selectNewTaskIcon(icon) {
  selectedNewTaskIcon = icon;
  renderIconSelector();
}

function openAddTaskModal() {
  editingTaskId = null;
  const titleEl = document.getElementById("addTaskModalTitle");
  if (titleEl) titleEl.innerText = "New Task";
  const btnEl =
    document.getElementById("submitTaskBtn") ||
    document.querySelector("#addTaskModal button[onclick='submitNewTask()']");
  if (btnEl) btnEl.innerText = "Create Task";

  document.getElementById("addTaskName").value = "";
  document.getElementById("addTaskTime").value = "";
  document.getElementById("addTaskDesc").value = "";
  document.getElementById("addTaskModal").style.display = "flex";

  selectedNewTaskIcon = AVAILABLE_ICONS[0];
  isIconSelectorExpanded = false; // Reset to collapsed view on open
  renderIconSelector();

  setTimeout(() => document.getElementById("addTaskName").focus(), 50);
}

function editTask(taskId) {
  const task = appState.tasks.find((t) => t.id === taskId);
  if (!task) return;

  editingTaskId = taskId;
  const titleEl = document.getElementById("addTaskModalTitle");
  if (titleEl) titleEl.innerText = "Edit Task";
  const btnEl =
    document.getElementById("submitTaskBtn") ||
    document.querySelector("#addTaskModal button[onclick='submitNewTask()']");
  if (btnEl) btnEl.innerText = "Save Changes";

  document.getElementById("addTaskName").value = task.name;
  document.getElementById("addTaskTime").value = task.targetTime || "";
  document.getElementById("addTaskDesc").value = task.desc || "";

  selectedNewTaskIcon = task.icon || AVAILABLE_ICONS[0];
  isIconSelectorExpanded = false;
  renderIconSelector();

  document.getElementById("addTaskModal").style.display = "flex";
  setTimeout(() => document.getElementById("addTaskName").focus(), 50);
}

function closeAddTaskModal() {
  document.getElementById("addTaskModal").style.display = "none";
}

function submitNewTask() {
  const name = document.getElementById("addTaskName").value.trim();
  const timeVal = document.getElementById("addTaskTime").value.trim();
  const desc = document.getElementById("addTaskDesc").value.trim();

  if (!name) return; // name is required

  const targetTime = timeVal ? parseInt(timeVal, 10) : null;
  const targetStr = targetTime ? `${targetTime} min` : "Unlimited";

  // Pick a random color and icon for custom tasks
  const colors = [
    "bg-indigo-50 text-indigo-600",
    "bg-emerald-50 text-emerald-600",
    "bg-sky-50 text-sky-600",
    "bg-blue-50 text-blue-600",
    "bg-purple-50 text-purple-600",
    "bg-fuchsia-50 text-fuchsia-600",
    "bg-red-50 text-red-600",
    "bg-orange-50 text-orange-600",
  ];
  const colorClass = colors[Math.floor(Math.random() * colors.length)];

  // Use the selected icon instead of random
  const icon = selectedNewTaskIcon || AVAILABLE_ICONS[0];

  if (editingTaskId) {
    const taskIndex = appState.tasks.findIndex((t) => t.id === editingTaskId);
    if (taskIndex !== -1) {
      appState.tasks[taskIndex].name = name;
      appState.tasks[taskIndex].targetTime = targetTime;
      appState.tasks[taskIndex].targetStr = targetStr;
      appState.tasks[taskIndex].desc = desc || "No description provided.";
      appState.tasks[taskIndex].icon = icon;
    }
  } else {
    // Pick a random color for custom tasks
    const colors = [
      "bg-indigo-50 text-indigo-600",
      "bg-emerald-50 text-emerald-600",
      "bg-sky-50 text-sky-600",
      "bg-blue-50 text-blue-600",
      "bg-purple-50 text-purple-600",
      "bg-fuchsia-50 text-fuchsia-600",
      "bg-red-50 text-red-600",
      "bg-orange-50 text-orange-600",
    ];
    const colorClass = colors[Math.floor(Math.random() * colors.length)];

    const newTask = {
      id: "task_" + Date.now(),
      name: name,
      targetTime: targetTime,
      targetStr: targetStr,
      icon: icon,
      colorClass: colorClass,
      desc: desc || "No description provided.",
      status: "TODO",
      actualTime: 0,
      completedAt: null,
    };

    appState.tasks.push(newTask);
  }

  saveState();
  closeAddTaskModal();
}

// Simple visual feedback
function triggerSuccessFeedback() {
  const ring = document.getElementById("progressRing");
  ring.classList.add("text-emerald-400");
  ring.classList.remove("text-brand-500");
  setTimeout(() => {
    ring.classList.add("text-brand-500");
    ring.classList.remove("text-emerald-400");
  }, 800);

  // Check achievements after a brief delay to let stats update
  setTimeout(() => checkAchievements(), 300);
}

// --- Achievement System ---
const shownAchievements = new Set(
  JSON.parse(sessionStorage.getItem("shownAchievements") || "[]"),
);

/**
 * Gathers current stats and checks all achievement milestones.
 * Triggers celebration for newly unlocked achievements.
 */
function checkAchievements() {
  const doneTasks = appState.tasks.filter((t) => t.status === "DONE");
  const todayTime = doneTasks.reduce((sum, t) => sum + (t.actualTime || 0), 0);
  const todayCompleted = doneTasks.length;
  const todayTotal = appState.tasks.length;

  // Calculate weekly and monthly totals (same logic as calculateHistoricalStats)
  const currentEffectiveDate = getEffectiveBDDateStr();
  const todayObj = new Date(currentEffectiveDate);
  let weeklyTime = todayTime;
  let monthlyTime = todayTime;

  appState.history.forEach((record) => {
    const recDate = new Date(record.dateKey);
    const diffTime = Math.abs(todayObj - recDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 7) weeklyTime += record.totalTime;
    if (diffDays <= 30) monthlyTime += record.totalTime;
  });

  const stats = {
    todayTime,
    todayCompleted,
    todayTotal,
    weeklyTime,
    monthlyTime,
  };

  // Check each achievement
  for (const achievement of ACHIEVEMENTS) {
    if (shownAchievements.has(achievement.id)) continue;
    if (achievement.check(stats)) {
      shownAchievements.add(achievement.id);
      sessionStorage.setItem(
        "shownAchievements",
        JSON.stringify([...shownAchievements]),
      );
      triggerCelebration(achievement);
      return; // Show one at a time
    }
  }
}

/**
 * Triggers the full celebration effect: confetti firecrackers + achievement toast.
 * @param {object} achievement - The unlocked achievement object.
 */
function triggerCelebration(achievement) {
  // Fire multiple confetti bursts like firecrackers
  fireConfettiBurst();

  // Show achievement toast
  showAchievementToast(achievement);
}

/**
 * Creates a spectacular multi-burst confetti firecracker effect
 * lasting ~5 seconds from multiple positions across the screen.
 */
function fireConfettiBurst() {
  const BURST_COLORS = [
    ["#ff0000", "#ff6600", "#ffcc00"],
    ["#00ccff", "#0066ff", "#6600ff"],
    ["#ff00cc", "#ff0066", "#ff3399"],
    ["#00ff66", "#00cc44", "#66ff00"],
    ["#ffcc00", "#ff9900", "#ff6600"],
  ];

  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0.6,
    decay: 0.94,
    startVelocity: 30,
    zIndex: 9999,
  };

  /**
   * Fires a single confetti burst at a given origin.
   * @param {number} x - Horizontal origin (0-1).
   * @param {number} y - Vertical origin (0-1).
   * @param {number} count - Number of particles.
   * @param {string[]} colors - Color palette.
   * @param {number} velocity - Start velocity override.
   * @param {number} size - Scalar size override.
   */
  const burst = (x, y, count, colors, velocity = 30, size = 1) => {
    confetti({
      ...defaults,
      particleCount: count,
      origin: { x, y },
      colors,
      startVelocity: velocity,
      scalar: size,
    });
  };

  // Wave 1: Center explosion (0ms)
  burst(0.5, 0.4, 80, BURST_COLORS[0], 35, 1.2);

  // Wave 2: Side bursts (300-600ms)
  setTimeout(() => burst(0.2, 0.5, 50, BURST_COLORS[1], 30, 1), 300);
  setTimeout(() => burst(0.8, 0.5, 50, BURST_COLORS[2], 30, 1), 600);

  // Wave 3: Corner bursts (900-1200ms)
  setTimeout(() => burst(0.1, 0.2, 40, BURST_COLORS[3], 25, 0.8), 900);
  setTimeout(() => burst(0.9, 0.2, 40, BURST_COLORS[4], 25, 0.8), 1200);

  // Wave 4: Mid bursts (1500-2000ms)
  setTimeout(() => burst(0.3, 0.3, 60, BURST_COLORS[2], 30, 1.1), 1500);
  setTimeout(() => burst(0.7, 0.7, 60, BURST_COLORS[3], 30, 1.1), 2000);

  // Wave 5: Random scattered bursts (2300-3200ms)
  setTimeout(() => burst(0.15, 0.7, 35, BURST_COLORS[0], 28, 0.9), 2300);
  setTimeout(() => burst(0.85, 0.3, 35, BURST_COLORS[4], 28, 0.9), 2600);
  setTimeout(() => burst(0.5, 0.6, 50, BURST_COLORS[1], 32, 1), 2900);
  setTimeout(() => burst(0.4, 0.2, 40, BURST_COLORS[2], 26, 0.85), 3200);

  // Wave 6: Dual side finale (3600-4000ms)
  setTimeout(() => burst(0.25, 0.4, 55, BURST_COLORS[3], 35, 1.1), 3600);
  setTimeout(() => burst(0.75, 0.4, 55, BURST_COLORS[0], 35, 1.1), 4000);

  // Wave 7: Grand finale center explosion (4500ms)
  setTimeout(() => {
    confetti({
      ...defaults,
      particleCount: 150,
      origin: { x: 0.5, y: 0.45 },
      colors: [
        "#ff0000",
        "#ffcc00",
        "#00ccff",
        "#ff00cc",
        "#00ff66",
        "#6600ff",
      ],
      spread: 360,
      startVelocity: 45,
      scalar: 1.5,
      ticks: 120,
    });
  }, 4500);
}

/**
 * Displays the achievement message in the right sidebar
 * between Today's Progress and Performance Analytics.
 * @param {object} achievement - The unlocked achievement object.
 */
function showAchievementToast(achievement) {
  const container = document.getElementById("achievementContainer");
  if (!container) return;

  container.classList.remove("hidden");
  container.innerHTML = `
    <div class="rounded-3xl p-5 text-center border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-sm"
         style="animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;">
      <div class="text-4xl mb-2">${achievement.label.split(" ")[0]}</div>
      <h3 class="text-base font-display font-bold text-slate-900 mb-1">${achievement.label}</h3>
      <p class="text-xs text-slate-500 font-medium">${achievement.desc}</p>
    </div>
  `;
}

// Support pressing Enter in inputs
const timeInputEl = document.getElementById("timeInput");
if (timeInputEl) {
  timeInputEl.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      submitTaskCompletion();
    }
  });
}

const authInputEl = document.getElementById("authPasswordInput");
if (authInputEl) {
  authInputEl.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      submitAuth();
    }
  });
}

// --- Initialization ---
window.addEventListener("DOMContentLoaded", () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = user;

      const wasGuest = isGuest;
      isGuest = false;
      localStorage.removeItem("isGuestTracker");

      // Sync guest data to database if they were a guest
      if (wasGuest) {
        const savedGuestData = localStorage.getItem("guestTrackerState");
        if (savedGuestData) {
          try {
            db.ref(`users/${currentUser.uid}/trackerState`).set(
              JSON.parse(savedGuestData),
            );
          } catch (e) {
            console.error("Failed to sync guest data to db", e);
          }
        }
        localStorage.removeItem("guestTrackerState");
      }

      document.getElementById("authOverlay").style.display = "none";
      const loader = document.getElementById("globalLoader");
      if (loader) loader.style.display = "none";

      const guestProfile = document.getElementById("guestProfile");
      if (guestProfile) {
        guestProfile.classList.add("hidden");
        guestProfile.classList.remove("flex");
      }

      const btn = document.getElementById("signOutBtn");
      const profile = document.getElementById("userProfile");
      if (profile) {
        profile.classList.remove("hidden");
        profile.classList.add("flex");
        document.getElementById("userAvatar").src =
          user.photoURL ||
          "https://ui-avatars.com/api/?name=" +
            encodeURIComponent(user.displayName || "User") +
            "&background=random";
        document.getElementById("userName").innerText =
          user.displayName || "User";
      }
      loadState();
    } else {
      currentUser = null;
      const loader = document.getElementById("globalLoader");
      if (loader) loader.style.display = "none";

      const profile = document.getElementById("userProfile");
      if (profile) {
        profile.classList.add("hidden");
        profile.classList.remove("flex");
      }

      if (isGuest) {
        document.getElementById("authOverlay").style.display = "none";
        const guestProfile = document.getElementById("guestProfile");
        if (guestProfile) {
          guestProfile.classList.remove("hidden");
          guestProfile.classList.add("flex");
        }
        loadState();
      } else {
        document.getElementById("authOverlay").style.display = "flex";
        appState.tasks = [];
        appState.history = [];
        updateUI();
      }
    }
  });

  // Initial render for dates immediately before data loads
  const bdTime = getBDTime();
  if (window.dateFns && document.getElementById("currentDateText")) {
    document.getElementById("currentDateText").innerText =
      window.dateFns.format(bdTime, "EEEE, MMMM d, yyyy");
  } else if (document.getElementById("currentDateText")) {
    document.getElementById("currentDateText").innerText =
      bdTime.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  }

  // Check for reset every minute while tab is open just in case they leave it open through 6 AM
  setInterval(() => {
    checkDailyReset();
    // Keep date fresh, but checking if the element exists
    if (document.getElementById("currentDateText")) {
      renderHeaderDate();
    }
  }, 60000);
});

// --- Export for HTML Inline Event Handlers ---
// Note: The instruction implies adding a delete button in renderTasks,
// but the renderTasks function is not provided in the given content.
// Assuming renderTasks exists and will be modified elsewhere to include the button.
window.signInWithGoogle = signInWithGoogle;
window.signOutUser = signOutUser;
window.continueAsGuest = continueAsGuest;
window.openTimeModal = openTimeModal;
window.closeModal = closeModal;
window.submitTaskCompletion = submitTaskCompletion;
window.undoTask = undoTask;
window.deleteTask = deleteTask;
window.editTask = editTask;
window.openAddTaskModal = openAddTaskModal;
window.closeAddTaskModal = closeAddTaskModal;
window.submitNewTask = submitNewTask;
window.selectNewTaskIcon = selectNewTaskIcon;
window.toggleIconSelector = toggleIconSelector;
