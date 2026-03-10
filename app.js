const firebaseConfig = {
  apiKey: "AIzaSyABBiZ665TxQktlPynC9DAZtB8d0U_QJ8w",
  authDomain: "daily-practice-tracker.firebaseapp.com",
  databaseURL: "https://daily-practice-tracker-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "daily-practice-tracker",
  storageBucket: "daily-practice-tracker.firebasestorage.app",
  messagingSenderId: "149600530913",
  appId: "1:149600530913:web:b7478144c0fc051fb8a2a0",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- Authentication ---
const PASSCODE = "202011056254"; // CHANGE THIS to your desired password
const AUTH_EXPIRY_DAYS = 30;

function checkAuthStatus() {
  const authData = localStorage.getItem("trackerAuth");
  let isAuthenticated = false;
  if (authData) {
    try {
      const parsed = JSON.parse(authData);
      const now = Date.now();
      const expiryMs = AUTH_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
      if (now - parsed.timestamp < expiryMs) {
        document.getElementById("authOverlay").style.display = "none";
        isAuthenticated = true;
      }
    } catch (e) {
      console.error("Auth verify error", e);
    }
  }

  if (!isAuthenticated) {
    const overlay = document.getElementById("authOverlay");
    if (overlay) overlay.style.display = "flex";
    setTimeout(() => {
      const el = document.getElementById("authPasswordInput");
      if (el) el.focus();
    }, 100);
  }
  return isAuthenticated;
}

function submitAuth() {
  const input = document.getElementById("authPasswordInput").value;
  if (input === PASSCODE) {
    localStorage.setItem("trackerAuth", JSON.stringify({ timestamp: Date.now() }));
    const overlay = document.getElementById("authOverlay");
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.style.display = "none";
    }, 300);
    document.getElementById("authErrorMsg").classList.add("hidden");
  } else {
    document.getElementById("authErrorMsg").classList.remove("hidden");
    document.getElementById("authPasswordInput").value = "";
    document.getElementById("authPasswordInput").focus();
  }
}

// --- Data Definitions ---
const INITIAL_TASKS = [];

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
      const completedTasks = appState.tasks.filter((t) => t.status === "DONE").length;

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
  const stateRef = db.ref("trackerState");

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
        appState.tasks = [];
      }

      checkDailyReset();
      // Push initial state to Firebase
      saveState();
    }
  });
}

function saveState() {
  db.ref("trackerState").set(appState);
  localStorage.setItem("practiceTrackerState", JSON.stringify(appState));
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
    <div class="${colorClass} font-bold text-xs flex items-center gap-1.5 px-2.5 py-1 rounded-full border">
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

  document.getElementById("emptyTodoState").classList.toggle("hidden", todoTasks.length > 0);
  document.getElementById("emptyDoneState").classList.toggle("hidden", doneTasks.length > 0);

  // Render TODOs
  todoContainer.innerHTML = todoTasks
    .map(
      (t, index) => `
          <div class="glass-panel task-card rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 group" style="animation: slideUp 0.3s ease-out forwards; animation-delay: ${index * 0.05}s; opacity: 0; transform: translateY(10px);">
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
              <div class="shrink-0 w-full sm:w-auto mt-2 sm:mt-0 flex justify-end gap-2 sm:ml-1">
                  <button onclick="deleteTask('${t.id}')" class="flex sm:w-10 sm:h-10 w-full py-2.5 sm:py-0 shrink-0 rounded-xl sm:rounded-full bg-slate-50 border border-slate-200 text-slate-400 items-center justify-center focus:outline-none hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50 shadow-sm transition-all focus:ring-4 focus:ring-rose-100 font-semibold sm:font-normal gap-2 sm:gap-0" title="Delete Task">
                      <i data-lucide="trash-2" class="w-4 h-4"></i> <span class="sm:hidden text-sm">Delete</span>
                  </button>
                  <button onclick="openTimeModal('${t.id}')" class="flex sm:w-10 sm:h-10 w-full py-2.5 sm:py-0 shrink-0 rounded-xl sm:rounded-full bg-slate-50 border border-slate-200 text-slate-400 items-center justify-center focus:outline-none hover:border-emerald-400 hover:text-emerald-500 hover:bg-emerald-50 shadow-sm transition-all focus:ring-4 focus:ring-emerald-100 font-semibold sm:font-normal gap-2 sm:gap-0" title="Mark Done">
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
          <div class="glass-panel rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 opacity-80 hover:opacity-100 transition-opacity bg-white/40 group relative" style="animation: slideUp 0.3s ease-out forwards; animation-delay: ${index * 0.05}s; opacity: 0; transform: translateY(10px);">
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
              <div class="shrink-0 w-full sm:w-auto mt-2 sm:mt-0 flex justify-end gap-2 sm:ml-1">
                   <button onclick="deleteTask('${t.id}')" class="flex sm:w-10 sm:h-10 w-full py-2.5 sm:py-0 shrink-0 rounded-xl sm:rounded-full bg-white/50 border border-slate-200 text-slate-400 items-center justify-center focus:outline-none hover:border-rose-400 hover:text-rose-500 hover:bg-rose-50 shadow-sm transition-all focus:ring-4 focus:ring-rose-100 font-semibold sm:font-normal gap-2 sm:gap-0" title="Delete Task">
                      <i data-lucide="trash-2" class="w-4 h-4"></i> <span class="sm:hidden text-sm">Delete</span>
                  </button>
                   <button onclick="undoTask('${t.id}')" title="Undo" class="flex sm:w-10 sm:h-10 w-full py-2.5 sm:py-0 shrink-0 items-center justify-center gap-2 sm:gap-0 text-slate-400 font-semibold sm:font-normal hover:text-indigo-500 transition-colors rounded-xl sm:rounded-full hover:bg-white/50 border border-transparent hover:border-slate-200 shadow-sm">
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
  const percentage = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);
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
    daysRecorded === 0 ? todayTime : Math.round((totalEverTime + todayTime) / (daysRecorded + 1));

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

  const taskIndex = appState.tasks.findIndex((t) => t.id === currentActiveTaskId);
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
const AVAILABLE_ICONS = [
  "star",
  "zap",
  "compass",
  "book",
  "coffee",
  "sun",
  "heart",
  "moon",
  "music",
  "smile",
  "pen-tool",
  "target",
  "flag",
  "code",
  "film",
  "book-open",
  "bot",
  "graduation-cap",
  "headphones",
  "video",
  "phone-call",
  // Goals & Productivity
  "trending-up",
  "check-circle",
  "award",
  "medal",
  "flame",
  "activity",
  "crosshair",
  "dumbbell",
  "calendar",
  // Students
  "pencil",
  "edit",
  "library",
  "backpack",
  "microscope",
  "calculator",
  "book-open-check",
  "file-text",
  "brain",
  // Office Workers
  "briefcase",
  "monitor",
  "keyboard",
  "mail",
  "pie-chart",
  "bar-chart",
  "presentation",
  "users",
  "file-spreadsheet",
  "inbox",
  "printer",
  "wallet"
];
let selectedNewTaskIcon = AVAILABLE_ICONS[0];
let isIconSelectorExpanded = false;

function renderIconSelector() {
  const container = document.getElementById("iconSelectorContainer");
  if (!container) return;
  
  const displayIcons = isIconSelectorExpanded ? AVAILABLE_ICONS : AVAILABLE_ICONS.slice(0, 13);
  let html = displayIcons.map(
    (icon) => `
    <button onclick="selectNewTaskIcon('${icon}')" type="button" class="w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all shrink-0 ${
      selectedNewTaskIcon === icon
        ? "border-brand-500 bg-brand-50 text-brand-600 cursor-default shadow-sm"
        : "border-slate-200 bg-white text-slate-400 hover:border-brand-300 hover:text-brand-500 hover:bg-slate-50 cursor-pointer shadow-sm"
    }">
      <i data-lucide="${icon}" class="w-5 h-5"></i>
    </button>
  `,
  ).join("");
  
  if (!isIconSelectorExpanded && AVAILABLE_ICONS.length > 13) {
    html += `
      <button onclick="toggleIconSelector()" type="button" class="w-auto px-3 h-10 rounded-xl flex items-center justify-center border-2 border-slate-200 bg-slate-50 text-slate-500 hover:text-brand-600 hover:border-brand-300 transition-all shadow-sm font-semibold text-xs cursor-pointer shrink-0">
        +${AVAILABLE_ICONS.length - 13} More
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
  document.getElementById("addTaskName").value = "";
  document.getElementById("addTaskTime").value = "";
  document.getElementById("addTaskDesc").value = "";
  document.getElementById("addTaskModal").style.display = "flex";

  selectedNewTaskIcon = AVAILABLE_ICONS[0];
  isIconSelectorExpanded = false; // Reset to collapsed view on open
  renderIconSelector();

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
  checkAuthStatus();

  // Initial render for dates immediately before data loads
  const bdTime = getBDTime();
  if (window.dateFns && document.getElementById("currentDateText")) {
    document.getElementById("currentDateText").innerText = window.dateFns.format(
      bdTime,
      "EEEE, MMMM d, yyyy",
    );
  } else if (document.getElementById("currentDateText")) {
    document.getElementById("currentDateText").innerText = bdTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  loadState();

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
window.submitAuth = submitAuth;
window.openTimeModal = openTimeModal;
window.closeModal = closeModal;
window.submitTaskCompletion = submitTaskCompletion;
window.undoTask = undoTask;
window.deleteTask = deleteTask;
window.openAddTaskModal = openAddTaskModal;
window.closeAddTaskModal = closeAddTaskModal;
window.submitNewTask = submitNewTask;
window.selectNewTaskIcon = selectNewTaskIcon;
window.toggleIconSelector = toggleIconSelector;
