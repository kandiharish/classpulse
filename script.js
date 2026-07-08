/**
 * ClassPulse - Smart Attendance. Instantly Shared.
 * Full Single Page Application (SPA) Controller with top/bottom responsive nav tabs.
 */

// Application State
let state = {
  activeTab: "home",
  year: "IV",
  class: "CSE",
  section: "B",
  className: "IV CSE - B",
  date: new Date().toISOString().split('T')[0], // Defaults to today
  theme: "light",
  attendance: {}, // hallTicket -> boolean
  specialPermissions: [], // Array of { hallTicket, name, type, note }
  history: [], // Array of past logs
  mentorName: "Chandrashekar",
  mentorMobile: "+91 77994 06422",
  cr1Name: "Sunil",
  cr1Mobile: "+91 80198 13064",
  cr2Name: "Kavya",
  cr2Mobile: "+91 80962 20090",
  cr3Name: "Shruthi",
  cr3Mobile: "+91 84639 55053",
  cr4Name: "harish kandi",
  cr4Mobile: "6303138807",
  unlocked: true
};

// Global students database reference (loaded from students.js)
let activeStudents = typeof students !== 'undefined' ? students : [];

// Local cache variables
let selectedPermissionStudent = null;

// DOM Elements
const splashScreen = document.getElementById("splash-screen");
const accessGate = document.getElementById("access-gate");
const accessForm = document.getElementById("access-form");
const gateRole = document.getElementById("gate-role");
const gateYear = document.getElementById("gate-year");
const gateClass = document.getElementById("gate-class");
const gateSection = document.getElementById("gate-section");
const gateIdRoll = document.getElementById("gate-id-roll");
const gatePassword = document.getElementById("gate-password");
const gateIdLabel = document.getElementById("gate-id-label");

// Header elements
const headerDateEl = document.getElementById("header-date");
const headerTimeEl = document.getElementById("header-time");
const darkModeToggle = document.getElementById("dark-mode-toggle");

// Home tab elements
const displayDashboardDate = document.getElementById("display-dashboard-date");
const displayDashboardClass = document.getElementById("display-dashboard-class");
const homeStatPresent = document.getElementById("home-stat-present");
const homeStatAbsent = document.getElementById("home-stat-absent");
const homeStatPermission = document.getElementById("home-stat-permission");
const homeStatTotal = document.getElementById("home-stat-total");
const homePercentageValue = document.getElementById("home-percentage-value");
const homeProgressIndicator = document.getElementById("home-progress-indicator");
const homeAbsenteesChips = document.getElementById("home-absentees-chips");
const btnViewAbsenteesList = document.getElementById("btn-view-absentees-list");

// Students tab elements
const studentsClassTitle = document.getElementById("students-class-title");
const studentsTotalLabel = document.getElementById("students-total-label");
const btnStudentsPresentAll = document.getElementById("btn-students-present-all");
const btnStudentsAbsentAll = document.getElementById("btn-students-absent-all");
const btnStudentsInvert = document.getElementById("btn-students-invert");
const btnStudentsGenerate = document.getElementById("btn-students-generate");
const btnStudentsCopy = document.getElementById("btn-students-copy");
const btnStudentsWhatsapp = document.getElementById("btn-students-whatsapp");
const btnStudentsPrintOfficial = document.getElementById("btn-students-print-official");
const studentsReportCard = document.getElementById("students-report-card");
const studentsReportText = document.getElementById("students-report-text");
const studentsSearchInput = document.getElementById("students-search-input");
const btnClearStudentsSearch = document.getElementById("btn-clear-students-search");
const studentsListContainer = document.getElementById("students-list-container");
const filterCountAll = document.getElementById("filter-count-all");
const filterCountPresent = document.getElementById("filter-count-present");
const filterCountAbsent = document.getElementById("filter-count-absent");

// Permissions tab elements
const permStudentSearch = document.getElementById("perm-student-search");
const btnClearPermSearch = document.getElementById("btn-clear-perm-search");
const permStudentSuggestions = document.getElementById("perm-student-suggestions");
const permTypeSelect = document.getElementById("perm-type-select");
const permNoteInput = document.getElementById("perm-note-input");
const permissionEntryForm = document.getElementById("permission-entry-form");
const permissionsCardsContainer = document.getElementById("permissions-cards-container");

// History tab elements
const historyReportsContainer = document.getElementById("history-reports-container");
const reportSection = document.getElementById("report-section");
const reportTextPreview = document.getElementById("report-text-preview");
const btnCopyReport = document.getElementById("btn-copy-report");
const btnWhatsappShare = document.getElementById("btn-whatsapp-share");
const btnDownloadTxt = document.getElementById("btn-download-txt");
const btnPrintReport = document.getElementById("btn-print-report");
const btnPrintOfficial = document.getElementById("btn-print-official");

// Settings tab elements
const settingsDisplayClassname = document.getElementById("settings-display-classname");
const settingsDisplayStrength = document.getElementById("settings-display-strength");
const settingsDarkmodeToggle = document.getElementById("settings-darkmode-toggle");
const btnEditClassname = document.getElementById("btn-edit-classname");



// Contacts edit modal
const editContactModal = document.getElementById("edit-contact-modal");
const editContactForm = document.getElementById("edit-contact-form");
const editContactTarget = document.getElementById("edit-contact-target");
const editContactName = document.getElementById("edit-contact-name");
const editContactMobile = document.getElementById("edit-contact-mobile");
const editModalTitle = document.getElementById("edit-modal-title");
const btnCloseEditModal = document.getElementById("btn-close-edit-modal");

// Display names cards
const displayMentorName = document.getElementById("display-mentor-name");
const displayMentorMobile = document.getElementById("display-mentor-mobile");
const linkMentorPhone = document.getElementById("link-mentor-phone");
const avatarMentor = document.getElementById("avatar-mentor");

const displayCr1Name = document.getElementById("display-cr1-name");
const displayCr1Mobile = document.getElementById("display-cr1-mobile");
const linkCr1Phone = document.getElementById("link-cr1-phone");
const avatarCr1 = document.getElementById("avatar-cr1");

const displayCr2Name = document.getElementById("display-cr2-name");
const displayCr2Mobile = document.getElementById("display-cr2-mobile");
const linkCr2Phone = document.getElementById("link-cr2-phone");
const avatarCr2 = document.getElementById("avatar-cr2");

const displayCr3Name = document.getElementById("display-cr3-name");
const displayCr3Mobile = document.getElementById("display-cr3-mobile");
const linkCr3Phone = document.getElementById("link-cr3-phone");
const avatarCr3 = document.getElementById("avatar-cr3");

const displayCr4Name = document.getElementById("display-cr4-name");
const displayCr4Mobile = document.getElementById("display-cr4-mobile");
const linkCr4Phone = document.getElementById("link-cr4-phone");
const avatarCr4 = document.getElementById("avatar-cr4");

// Mobile FAB
const btnMobileFab = document.getElementById("btn-mobile-fab");

// Circle Circumference for percentage indicator gauge
const CIRCUMFERENCE = 2 * Math.PI * 40;

/* ==========================================================================
   Initialization & Routing
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialise Clock & Timer
  updateClock();
  setInterval(updateClock, 1000);

  // 2. Hide Splash Screen after loading animation completes
  setTimeout(() => {
    if (splashScreen) {
      splashScreen.style.opacity = "0";
      setTimeout(() => {
        splashScreen.style.display = "none";
      }, 500);
    }
  }, 1800);

  // 3. Load App State from LocalStorage
  loadData();

  // 4. Initialise Router & Tab events
  initRouter();

  // 5. Setup Action Event Listeners
  initEventListeners();

  // If not unlocked, pop open the access gate overlay
  if (!state.unlocked) {
    accessGate.style.display = "flex";
  } else {
    // Populate stats
    updateCounts();
    renderStudents();
    renderPermissionCards();
    renderHistoryLogs();
    renderCalendarStrip();
  }
});

function initRouter() {
  const allNavBtns = document.querySelectorAll(".nav-btn");
  
  allNavBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      triggerHaptic();
      const targetTab = btn.getAttribute("data-tab");
      switchTab(targetTab);
    });
  });

  // Mobile FAB quick navigates to Exemption tab
  if (btnMobileFab) {
    btnMobileFab.addEventListener("click", () => {
      triggerHaptic();
      switchTab("permissions");
    });
  }

  // Quick link from home screen absentees banner to student list
  if (btnViewAbsenteesList) {
    btnViewAbsenteesList.addEventListener("click", () => {
      triggerHaptic();
      switchTab("students");
      // Set student filter to Absent
      const filterBtn = document.querySelector('.filter-chip[data-filter="absent"]');
      if (filterBtn) filterBtn.click();
    });
  }
}

function switchTab(tabId) {
  state.activeTab = tabId;
  
  // Update nav buttons active style
  document.querySelectorAll(".nav-btn").forEach(btn => {
    if (btn.getAttribute("data-tab") === tabId) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Switch display panel
  document.querySelectorAll(".tab-panel").forEach(panel => {
    panel.classList.remove("active");
  });
  const activePanel = document.getElementById(`tab-${tabId}`);
  if (activePanel) {
    activePanel.classList.add("active");
  }

  saveData();
}

/* ==========================================================================
   State & Storage Managers
   ========================================================================== */

function saveData() {
  const localData = {
    activeTab: state.activeTab,
    year: state.year,
    class: state.class,
    section: state.section,
    className: state.className,
    date: state.date,
    theme: state.theme,
    attendance: state.attendance,
    specialPermissions: state.specialPermissions,
    history: state.history,
    unlocked: state.unlocked
  };
  localStorage.setItem("classpulse_attendance_state", JSON.stringify(localData));
}

function loadData() {
  const raw = localStorage.getItem("classpulse_attendance_state");
  if (!raw) {
    // Default theme based on preferred system scheme
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    state.theme = prefersDark ? "dark" : "light";
    setTheme(state.theme);
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    state.activeTab = parsed.activeTab || "home";
    state.year = parsed.year || "IV";
    state.class = parsed.class || "CSE";
    state.section = parsed.section || "B";
    state.className = parsed.className || "IV CSE - B";
    state.date = parsed.date || state.date;
    state.theme = parsed.theme || "light";
    state.attendance = parsed.attendance || {};
    state.specialPermissions = parsed.specialPermissions || [];
    state.history = parsed.history || [];
    state.unlocked = true; // Always unlocked now

    // Apply UI elements
    setTheme(state.theme);
    switchTab(state.activeTab);
    
    // Sync class config labels
    settingsDisplayClassname.textContent = state.className;
    settingsDisplayStrength.textContent = `${activeStudents.length} Students`;
    
    // Load keyed class contacts
    loadClassContacts();
  } catch (err) {
    console.error("Failed to parse app state", err);
  }
}

function loadClassContacts() {
  const key = `classpulse_contacts_${state.year}_${state.class}_${state.section}`;
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      state.mentorName = parsed.mentorName || "";
      state.mentorMobile = parsed.mentorMobile || "";
      state.cr1Name = parsed.cr1Name || "";
      state.cr1Mobile = parsed.cr1Mobile || "";
      state.cr2Name = parsed.cr2Name || "";
      state.cr2Mobile = parsed.cr2Mobile || "";
      state.cr3Name = parsed.cr3Name || "";
      state.cr3Mobile = parsed.cr3Mobile || "";
      state.cr4Name = parsed.cr4Name || "";
      state.cr4Mobile = parsed.cr4Mobile || "";
    } catch (e) {
      console.error("Failed to load contacts for class", e);
    }
  } else {
    // defaults
    state.mentorName = "Chandrashekar";
    state.mentorMobile = "+91 77994 06422";
    state.cr1Name = "Sunil";
    state.cr1Mobile = "+91 80198 13064";
    state.cr2Name = "Kavya";
    state.cr2Mobile = "+91 80962 20090";
    state.cr3Name = "Shruthi";
    state.cr3Mobile = "+91 84639 55053";
    state.cr4Name = "harish kandi";
    state.cr4Mobile = "6303138807";
  }
  renderContacts();
}

function saveClassContacts() {
  const key = `classpulse_contacts_${state.year}_${state.class}_${state.section}`;
  const data = {
    mentorName: state.mentorName,
    mentorMobile: state.mentorMobile,
    cr1Name: state.cr1Name,
    cr1Mobile: state.cr1Mobile,
    cr2Name: state.cr2Name,
    cr2Mobile: state.cr2Mobile,
    cr3Name: state.cr3Name,
    cr3Mobile: state.cr3Mobile,
    cr4Name: state.cr4Name,
    cr4Mobile: state.cr4Mobile
  };
  localStorage.setItem(key, JSON.stringify(data));
}

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function renderContacts() {
  // Sync Mentor
  displayMentorName.textContent = state.mentorName || "Not Assigned";
  displayMentorMobile.textContent = state.mentorMobile || "--";
  avatarMentor.textContent = getInitials(state.mentorName || "M");
  linkMentorPhone.href = state.mentorMobile ? `tel:${state.mentorMobile}` : "#";

  // Sync CR 1
  displayCr1Name.textContent = state.cr1Name || "Not Assigned";
  displayCr1Mobile.textContent = state.cr1Mobile || "--";
  avatarCr1.textContent = getInitials(state.cr1Name || "C1");
  linkCr1Phone.href = state.cr1Mobile ? `tel:${state.cr1Mobile}` : "#";

  // Sync CR 2
  displayCr2Name.textContent = state.cr2Name || "Not Assigned";
  displayCr2Mobile.textContent = state.cr2Mobile || "--";
  avatarCr2.textContent = getInitials(state.cr2Name || "C2");
  linkCr2Phone.href = state.cr2Mobile ? `tel:${state.cr2Mobile}` : "#";

  // Sync CR 3
  displayCr3Name.textContent = state.cr3Name || "Not Assigned";
  displayCr3Mobile.textContent = state.cr3Mobile || "--";
  avatarCr3.textContent = getInitials(state.cr3Name || "C3");
  linkCr3Phone.href = state.cr3Mobile ? `tel:${state.cr3Mobile}` : "#";

  // Sync CR 4
  displayCr4Name.textContent = state.cr4Name || "Not Assigned";
  displayCr4Mobile.textContent = state.cr4Mobile || "--";
  avatarCr4.textContent = getInitials(state.cr4Name || "C4");
  linkCr4Phone.href = state.cr4Mobile ? `tel:${state.cr4Mobile}` : "#";

  // Sync welcome card header greeting based on time of day
  updateGreeting();
}

/* ==========================================================================
   Unlock & Login Controller
   ========================================================================== */

function handleUnlock(e) {
  e.preventDefault();
  triggerHaptic();

  const role = gateRole.value;
  const year = gateYear.value;
  const classVal = gateClass.value.trim().toUpperCase();
  const section = gateSection.value.trim().toUpperCase();
  const idRoll = gateIdRoll.value.trim();
  const password = gatePassword.value;

  if (!role || !year || !classVal || !section || !idRoll || !password) {
    showToast("Please fill in all inputs!", "error");
    return;
  }

  // Simple hardcoded checks
  if (role === "cr" && password !== "cr123") {
    showToast("Invalid CR Password! (Try: cr123)", "error");
    return;
  } else if (role === "mentor" && password !== "mentor123") {
    showToast("Invalid Mentor Password! (Try: mentor123)", "error");
    return;
  }

  state.year = year;
  state.class = classVal;
  state.section = section;
  state.className = `${year} ${classVal} - ${section}`;

  loadClassContacts();

  // Set logged in CR/Mentor name if field is empty
  if (role === "cr" && !state.cr1Name) {
    state.cr1Name = idRoll;
  } else if (role === "mentor" && !state.mentorName) {
    state.mentorName = idRoll;
  }

  state.unlocked = true;

  // Sync UI labels
  settingsDisplayClassname.textContent = state.className;
  settingsDisplayStrength.textContent = `${activeStudents.length} Students`;
  
  saveClassContacts();
  saveData();
  renderContacts();
  renderStudents();
  renderPermissionCards();
  updateCounts();

  // Access screen fade out transition
  accessGate.style.transition = "opacity 0.3s ease-out";
  accessGate.style.opacity = 0;
  setTimeout(() => {
    accessGate.style.display = "none";
    showToast(`Unlocked successfully as ${role === 'cr' ? 'CR' : 'Mentor'}!`);
  }, 300);
}

/* ==========================================================================
   Analytics & Calculations
   ========================================================================== */

function calculateStats() {
  let present = 0;
  let absent = 0;
  let permission = state.specialPermissions.length;

  activeStudents.forEach(student => {
    const isExempted = state.specialPermissions.some(p => p.hallTicket === student.hallTicket);
    if (!isExempted) {
      if (state.attendance[student.hallTicket] !== false) {
        present++;
      } else {
        absent++;
      }
    }
  });

  const total = activeStudents.length;
  // Calculate percentage excluding permission students from denominator
  const denominator = total - permission;
  const rate = denominator > 0 ? ((present / denominator) * 100).toFixed(1) : "0.0";

  return { present, absent, permission, total, rate };
}

function updateCounts() {
  const stats = calculateStats();

  // 1. Sync dashboard metric displays
  homeStatPresent.textContent = stats.present;
  homeStatAbsent.textContent = stats.absent;
  homeStatPermission.textContent = stats.permission;
  homeStatTotal.textContent = stats.total;

  homePercentageValue.textContent = `${stats.rate}%`;
  
  // Radial circular gauge stroke dashoffset
  const offset = CIRCUMFERENCE - (stats.rate / 100) * CIRCUMFERENCE;
  if (homeProgressIndicator) {
    homeProgressIndicator.style.strokeDashoffset = offset;
  }

  // 2. Sync Student tab filter labels
  filterCountAll.textContent = stats.total;
  filterCountPresent.textContent = stats.present + stats.permission;
  filterCountAbsent.textContent = stats.absent;

  // 3. Render Today's Absentees chips on Home view
  renderTodayAbsenteesChips();

  // 4. Update dynamic dates
  displayDashboardDate.textContent = formatDateString(state.date);
  displayDashboardClass.textContent = state.className;

  // 5. Auto-update report preview text
  const reportContent = generateReportText();
  if (reportTextPreview) {
    reportTextPreview.textContent = reportContent;
  }
  if (studentsReportText) {
    studentsReportText.textContent = reportContent;
  }
}

function renderTodayAbsenteesChips() {
  homeAbsenteesChips.innerHTML = "";
  
  const absentees = activeStudents.filter(s => {
    const isExempt = state.specialPermissions.some(p => p.hallTicket === s.hallTicket);
    return !isExempt && state.attendance[s.hallTicket] === false;
  });

  if (absentees.length === 0) {
    const clearChip = document.createElement("div");
    clearChip.className = "absent-chip";
    clearChip.style.background = "var(--success-light)";
    clearChip.style.color = "var(--success)";
    clearChip.style.borderColor = "var(--success-border)";
    clearChip.textContent = "🎉 100% Attendance Today";
    homeAbsenteesChips.appendChild(clearChip);
    return;
  }

  absentees.forEach(student => {
    // Get short roll number (last 2 digits)
    const shortRoll = student.hallTicket.slice(-2);
    
    const chip = document.createElement("div");
    chip.className = "absent-chip";
    chip.textContent = `${shortRoll} ${student.name}`;
    homeAbsenteesChips.appendChild(chip);
  });
}

/* ==========================================================================
   Students Attendance Controller
   ========================================================================== */

function renderStudents(filter = "all", query = "") {
  studentsListContainer.innerHTML = "";
  studentsClassTitle.textContent = state.className;
  studentsTotalLabel.textContent = `${activeStudents.length} Students`;

  const q = query.toLowerCase().trim();

  // Filter list
  const filtered = activeStudents.filter(student => {
    const isExempt = state.specialPermissions.some(p => p.hallTicket === student.hallTicket);
    const isPresent = !isExempt && state.attendance[student.hallTicket] !== false;
    
    // Search match
    const shortRoll = student.hallTicket.slice(-2);
    const matchesSearch = student.name.toLowerCase().includes(q) || 
                          student.hallTicket.toLowerCase().includes(q) ||
                          shortRoll.includes(q);

    if (!matchesSearch) return false;

    if (filter === "present") return isPresent || isExempt;
    if (filter === "absent") return !isPresent && !isExempt;
    return true;
  });

  if (filtered.length === 0) {
    const emptyMsg = document.createElement("div");
    emptyMsg.className = "card";
    emptyMsg.style.textAlign = "center";
    emptyMsg.style.padding = "40px";
    emptyMsg.style.gridColumn = "span 2";
    emptyMsg.innerHTML = `
      <span class="material-symbols-outlined" style="font-size: 48px; color: var(--text-muted);">search_off</span>
      <p style="margin-top: 10px; color: var(--text-secondary); font-weight: 500;">No students match this query.</p>
    `;
    studentsListContainer.appendChild(emptyMsg);
    return;
  }

  filtered.forEach(student => {
    const isExempt = state.specialPermissions.some(p => p.hallTicket === student.hallTicket);
    const isPresent = !isExempt && state.attendance[student.hallTicket] !== false;

    // Card Wrapper
    const card = document.createElement("div");
    
    let cardClass = "student-card present";
    let statusText = "Present";
    if (isExempt) {
      cardClass = "student-card internship";
      statusText = "Exempted";
    } else if (!isPresent) {
      cardClass = "student-card absent";
      statusText = "Absent";
    }

    card.className = cardClass;

    // Short roll number representation (last 2 digits)
    const shortRoll = student.hallTicket.slice(-2);

    card.innerHTML = `
      <div class="student-card-left">
        <label class="checkbox-container">
          <input type="checkbox" ${isPresent && !isExempt ? "checked" : ""} ${isExempt ? "disabled" : ""}>
          <span class="checkmark"></span>
        </label>
        <div class="student-info">
          <span class="student-roll">${shortRoll} • ${student.hallTicket}</span>
          <span class="student-name">${student.name}</span>
        </div>
      </div>
      <span class="student-status-badge ${isExempt ? 'internship' : isPresent ? 'present' : 'absent'}">${statusText}</span>
    `;

    // Click logic (except for exempted permission students)
    card.addEventListener("click", (e) => {
      if (isExempt) return;
      
      // If clicking checkbox label directly, prevent duplicate fires
      if (e.target.closest("label")) return;

      triggerHaptic();
      const checkbox = card.querySelector('input[type="checkbox"]');
      checkbox.checked = !checkbox.checked;
      state.attendance[student.hallTicket] = checkbox.checked;

      if (checkbox.checked) {
        card.className = "student-card present";
        card.querySelector(".student-status-badge").className = "student-status-badge present";
        card.querySelector(".student-status-badge").textContent = "Present";
      } else {
        card.className = "student-card absent";
        card.querySelector(".student-status-badge").className = "student-status-badge absent";
        card.querySelector(".student-status-badge").textContent = "Absent";
      }

      updateCounts();
      saveData();
    });

    // checkbox sync change event
    card.querySelector('input[type="checkbox"]').addEventListener("change", (e) => {
      state.attendance[student.hallTicket] = e.target.checked;
      updateCounts();
      saveData();
    });

    studentsListContainer.appendChild(card);
  });
}

function studentsMarkAllPresent() {
  triggerHaptic();
  activeStudents.forEach(s => {
    state.attendance[s.hallTicket] = true;
  });
  renderStudents();
  updateCounts();
  saveData();
  showToast("All active students marked Present ✔️");
}

function studentsMarkAllAbsent() {
  triggerHaptic();
  activeStudents.forEach(s => {
    state.attendance[s.hallTicket] = false;
  });
  renderStudents();
  updateCounts();
  saveData();
  showToast("All active students marked Absent ❌");
}

function studentsInvertSelection() {
  triggerHaptic();
  activeStudents.forEach(s => {
    const current = state.attendance[s.hallTicket] !== false;
    state.attendance[s.hallTicket] = !current;
  });
  renderStudents();
  updateCounts();
  saveData();
  showToast("Attendance selection inverted 🔄");
}

/* ==========================================================================
   Permissions Exemption Controller
   ========================================================================== */

function handlePermissionSearch(val) {
  const query = val.toLowerCase().trim();
  if (!query) {
    permStudentSuggestions.style.display = "none";
    btnClearPermSearch.style.display = "none";
    return;
  }

  btnClearPermSearch.style.display = "block";

  // Filter matches
  const matches = activeStudents.filter(s => {
    const isAlreadyExempt = state.specialPermissions.some(p => p.hallTicket === s.hallTicket);
    const shortRoll = s.hallTicket.slice(-2);
    return !isAlreadyExempt && 
           (s.name.toLowerCase().includes(query) || 
            s.hallTicket.toLowerCase().includes(query) ||
            shortRoll.includes(query));
  }).slice(0, 5); // Limit 5

  if (matches.length === 0) {
    permStudentSuggestions.innerHTML = `<li style="color: var(--text-muted); cursor: default;">No unexempted students found</li>`;
  } else {
    permStudentSuggestions.innerHTML = matches.map(s => `
      <li data-ticket="${s.hallTicket}">
        <span>${s.name}</span>
        <strong style="color: var(--primary);">${s.hallTicket.slice(-2)}</strong>
      </li>
    `).join("");
  }

  permStudentSuggestions.style.display = "block";
}

function selectPermissionStudent(ticket) {
  const student = activeStudents.find(s => s.hallTicket === ticket);
  if (student) {
    selectedPermissionStudent = student;
    permStudentSearch.value = `${student.hallTicket.slice(-2)} - ${student.name}`;
    permStudentSuggestions.style.display = "none";
  }
}

function addPermissionExemption(e) {
  e.preventDefault();
  triggerHaptic();

  if (!selectedPermissionStudent) {
    showToast("Please search and select a student first!", "error");
    return;
  }

  const type = permTypeSelect.value;
  const note = permNoteInput.value.trim();

  state.specialPermissions.push({
    hallTicket: selectedPermissionStudent.hallTicket,
    name: selectedPermissionStudent.name,
    type: type,
    note: note
  });

  // reset form
  permStudentSearch.value = "";
  permNoteInput.value = "";
  selectedPermissionStudent = null;
  btnClearPermSearch.style.display = "none";

  renderPermissionCards();
  renderStudents();
  updateCounts();
  saveData();

  showToast("Exemption added successfully!");
}

function removePermissionExemption(ticket) {
  triggerHaptic();
  state.specialPermissions = state.specialPermissions.filter(p => p.hallTicket !== ticket);
  
  renderPermissionCards();
  renderStudents();
  updateCounts();
  saveData();
  
  showToast("Exemption removed successfully.");
}

function renderPermissionCards() {
  permissionsCardsContainer.innerHTML = "";
  
  if (state.specialPermissions.length === 0) {
    const emptyCard = document.createElement("div");
    emptyCard.className = "card";
    emptyCard.style.gridColumn = "span 2";
    emptyCard.style.textAlign = "center";
    emptyCard.style.padding = "30px";
    emptyCard.innerHTML = `
      <span class="material-symbols-outlined" style="font-size: 36px; color: var(--text-muted);">verified_user</span>
      <p style="margin-top: 8px; color: var(--text-secondary); font-size: 0.8rem; font-weight: 500;">No students currently have active permissions.</p>
    `;
    permissionsCardsContainer.appendChild(emptyCard);
    return;
  }

  state.specialPermissions.forEach(perm => {
    const shortRoll = perm.hallTicket.slice(-2);
    const card = document.createElement("div");
    card.className = "permission-item-card";

    let tagClass = "other";
    if (perm.type === "Internship") tagClass = "internship";
    else if (perm.type === "Medical Leave") tagClass = "medical";
    else if (perm.type === "Placement Drive") tagClass = "placement";

    card.innerHTML = `
      <div class="permission-item-left">
        <span class="permission-item-title">
          ${shortRoll} • ${perm.name}
          <span class="permission-tag ${tagClass}">${perm.type}</span>
        </span>
        <span class="permission-reason-text">Exempted Exemption Session</span>
        <span class="permission-note-text">Reason: ${perm.note || 'No description note'}</span>
      </div>
      <button class="btn-delete-permission" aria-label="Remove Exemption">
        <span class="material-symbols-outlined">delete</span>
      </button>
    `;

    card.querySelector(".btn-delete-permission").addEventListener("click", () => {
      removePermissionExemption(perm.hallTicket);
    });

    permissionsCardsContainer.appendChild(card);
  });
}

/* ==========================================================================
   Report Generation & Share Controllers
   ========================================================================== */

function generateReportText() {
  const stats = calculateStats();
  const dateStr = formatDateString(state.date);

  // Absentees list
  const absentees = [];
  activeStudents.forEach(s => {
    const isExempt = state.specialPermissions.some(p => p.hallTicket === s.hallTicket);
    if (!isExempt && state.attendance[s.hallTicket] === false) {
      absentees.push(s.hallTicket.slice(-2));
    }
  });

  // Exempted list details
  let permissionSection = "";
  if (state.specialPermissions.length > 0) {
    const exemptedStr = state.specialPermissions.map(p => {
      return `${p.hallTicket.slice(-2)} (${p.type})`;
    }).join(", ");
    permissionSection = `\nPERMISSION STUDENTS:\n${exemptedStr}\n`;
  }

  // Classic formal attendance format
  return `Date: ${dateStr}
Class Name: ${state.className}
Total number of students: ${stats.total}
Present: ${stats.present}
Absent: ${stats.absent}

ABSENTEES:
${absentees.join(",") || "Nil"}${permissionSection}
Percentage: ${stats.rate}%`;
}

function getFormattedDateShort(dateVal) {
  const d = new Date(dateVal);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

function generateOfficialAbsenteeReport() {
  const dateStr = getFormattedDateShort(state.date);

  // Normalize Class Name to uppercase and hyphenated, e.g. "IV-CSE-B"
  const formattedClassName = state.className
    .toUpperCase()
    .replace(/\s+/g, '-')
    .replace(/-+-/g, '-')
    .replace(/^-|-$/g, '');

  // Get absentees
  const absentees = [];
  activeStudents.forEach(s => {
    const isExempt = state.specialPermissions.some(p => p.hallTicket === s.hallTicket);
    if (!isExempt && state.attendance[s.hallTicket] === false) {
      absentees.push(s);
    }
  });

  // Sort by roll number/hall ticket number
  absentees.sort((a, b) => a.hallTicket.localeCompare(b.hallTicket));

  let tableRows = "";
  if (absentees.length === 0) {
    tableRows = `<tr><td colspan="3" style="text-align: center; font-style: italic; color: #64748b; padding: 20px;">No Absentees (Nil)</td></tr>`;
  } else {
    absentees.forEach((student, index) => {
      tableRows += `
        <tr>
          <td>${index + 1}</td>
          <td>${student.hallTicket}</td>
          <td>${student.name.toUpperCase()}</td>
        </tr>
      `;
    });
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    showToast("⚠️ Popup blocker prevented opening print window. Please allow popups.", "error");
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${formattedClassName} ABSENTEES LIST - ${dateStr}</title>
      <base href="${window.location.href}">
      <style>
        * {
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #000;
          background-color: #f1f5f9;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        .no-print-bar {
          background-color: #2563eb;
          color: white;
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 0;
          margin-bottom: 0;
          font-size: 13px;
          font-weight: 500;
          font-family: 'Poppins', sans-serif;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .print-btn {
          background-color: white;
          color: #2563eb;
          border: none;
          padding: 6px 14px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .print-btn:hover {
          background-color: #f8fafc;
          transform: translateY(-1px);
        }

        .report-container {
          max-width: 800px;
          margin: 30px auto;
          background-color: #fff;
          padding: 40px;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
          border: 1px solid #cbd5e1;
          border-radius: 4px;
        }
        
        .header-banner {
          width: 100%;
          text-align: center;
          margin-bottom: 20px;
        }
        
        .header-banner img {
          max-width: 100%;
          height: auto;
        }
        
        .title-banner {
          background-color: #f8fafc;
          border: 1px solid #cbd5e1;
          text-align: center;
          padding: 10px;
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 0.5px;
          margin-bottom: 20px;
          color: #000;
          text-transform: uppercase;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        
        th, td {
          border: 1px solid #cbd5e1;
          padding: 10px 12px;
          text-align: left;
          font-size: 13px;
        }
        
        th {
          background-color: #f8fafc;
          color: #000;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.5px;
        }
        
        td {
          color: #000;
          background-color: #fff;
        }
        
        @media print {
          body {
            background-color: #fff !important;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
          .report-container {
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          .title-banner {
            background-color: #f8fafc !important;
            border-color: #cbd5e1 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          th {
            background-color: #f8fafc !important;
            border-color: #cbd5e1 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          td {
            background-color: #fff !important;
            border-color: #cbd5e1 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <div class="no-print-bar no-print">
        <span>📄 GNIT Absentees Sheet Preview. Ready to print or save as PDF.</span>
        <button class="print-btn" onclick="window.print()">Print / Save PDF</button>
      </div>
      <div class="report-container">
        <div class="header-banner">
          <img src="gnit logo.png" alt="GNIT Logo Banner">
        </div>
        <div class="title-banner">
          ${formattedClassName} ABSENTEES LIST - ${dateStr}
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 12%; text-align: center;">S. No.</th>
              <th style="width: 38%;">Roll Number</th>
              <th style="width: 50%;">Name</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
}

function handleGenerateReport() {
  triggerHaptic();
  const text = generateReportText();
  reportTextPreview.textContent = text;
  reportSection.style.display = "flex";

  // Auto-scroll to report box
  reportSection.scrollIntoView({ behavior: "smooth" });
  
  // Add to history list if not duplicate
  const dateStr = formatDateString(state.date);
  const exists = state.history.some(h => h.date === dateStr && h.className === state.className);
  if (!exists) {
    const stats = calculateStats();
    state.history.unshift({
      id: Date.now(),
      date: dateStr,
      className: state.className,
      present: stats.present,
      absent: stats.absent,
      permission: stats.permission,
      rate: stats.rate,
      reportText: text
    });
    saveData();
    renderHistoryLogs();
  }

  showToast("📊 Attendance report generated!");
}

function renderHistoryLogs() {
  historyReportsContainer.innerHTML = "";
  
  if (state.history.length === 0) {
    historyReportsContainer.innerHTML = `
      <div class="card" style="text-align: center; padding: 24px;">
        <p style="color: var(--text-secondary); font-size: 0.78rem; font-weight: 500;">No past attendance logs saved yet.</p>
      </div>
    `;
    return;
  }

  state.history.forEach(log => {
    const card = document.createElement("div");
    card.className = "history-item";
    card.innerHTML = `
      <div class="history-item-header">
        <span class="history-title">${log.className}</span>
        <span class="history-date">${log.date}</span>
      </div>
      <div class="history-item-stats">
        <span>Pres: <strong style="color: var(--success);">${log.present}</strong></span>
        <span>Abs: <strong style="color: var(--danger);">${log.absent}</strong></span>
        <span>Rate: <strong style="color: var(--primary);">${log.rate}%</strong></span>
      </div>
      <div class="history-item-actions">
        <button class="btn btn-outline success btn-sm btn-hist-copy">Copy</button>
        <button class="btn btn-primary btn-sm btn-hist-view">View</button>
      </div>
    `;
    card.querySelector(".btn-hist-copy").addEventListener("click", (e) => {
      e.stopPropagation();
      triggerHaptic();
      copyToClipboard(log.reportText).then(() => {
        showToast("📋 Report copied to clipboard!");
      }).catch(err => {
        console.error(err);
        showToast("Copy failed, please copy manually", "error");
      });
    });

    card.querySelector(".btn-hist-view").addEventListener("click", () => {
      triggerHaptic();
      reportTextPreview.textContent = log.reportText;
      reportSection.style.display = "flex";
      reportSection.scrollIntoView({ behavior: "smooth" });
    });

    historyReportsContainer.appendChild(card);
  });
}

/* ==========================================================================
   Action & Event Listeners
   ========================================================================== */

function initEventListeners() {
  // Gate Unlock role select sync
  accessForm.addEventListener("submit", handleUnlock);
  gateRole.addEventListener("change", () => {
    if (gateRole.value === "cr") {
      gateIdLabel.textContent = "Roll Number";
      gateIdRoll.placeholder = "Enter your Roll Number";
    } else {
      gateIdLabel.textContent = "Mentor ID";
      gateIdRoll.placeholder = "Enter your Mentor ID";
    }
  });

  // Students list Quick Action buttons
  btnStudentsPresentAll.addEventListener("click", studentsMarkAllPresent);
  btnStudentsAbsentAll.addEventListener("click", studentsMarkAllAbsent);
  btnStudentsInvert.addEventListener("click", studentsInvertSelection);
  btnStudentsGenerate.addEventListener("click", () => {
    handleGenerateReport(); // Also registers in History log
    
    // Toggle the inline report card on Students tab
    if (studentsReportText && studentsReportCard) {
      studentsReportText.textContent = generateReportText();
      studentsReportCard.style.display = "flex";
      studentsReportCard.scrollIntoView({ behavior: "smooth" });
    }
  });

  btnStudentsCopy.addEventListener("click", () => {
    triggerHaptic();
    const text = studentsReportText ? studentsReportText.textContent : generateReportText();
    copyToClipboard(text).then(() => {
      showToast("📋 Report copied to clipboard!");
    }).catch(err => {
      console.error(err);
      showToast("Copy failed, please copy manually", "error");
    });
  });

  btnStudentsWhatsapp.addEventListener("click", () => {
    triggerHaptic();
    const text = encodeURIComponent(studentsReportText ? studentsReportText.textContent : generateReportText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  });

  btnStudentsPrintOfficial.addEventListener("click", () => {
    triggerHaptic();
    generateOfficialAbsenteeReport();
  });

  // Student Search input keyup
  studentsSearchInput.addEventListener("input", (e) => {
    const val = e.target.value;
    btnClearStudentsSearch.style.display = val ? "block" : "none";
    
    const activeFilter = document.querySelector(".filter-chip.active").getAttribute("data-filter");
    renderStudents(activeFilter, val);
  });

  btnClearStudentsSearch.addEventListener("click", () => {
    triggerHaptic();
    studentsSearchInput.value = "";
    btnClearStudentsSearch.style.display = "none";
    const activeFilter = document.querySelector(".filter-chip.active").getAttribute("data-filter");
    renderStudents(activeFilter);
  });

  // Filter Chips event listeners
  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      triggerHaptic();
      document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      
      const filter = chip.getAttribute("data-filter");
      renderStudents(filter, studentsSearchInput.value);
    });
  });

  // Add Exemption Permission Search Suggestions
  permStudentSearch.addEventListener("input", (e) => {
    handlePermissionSearch(e.target.value);
  });

  btnClearPermSearch.addEventListener("click", () => {
    triggerHaptic();
    permStudentSearch.value = "";
    btnClearPermSearch.style.display = "none";
    permStudentSuggestions.style.display = "none";
    selectedPermissionStudent = null;
  });

  permStudentSuggestions.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (li && li.hasAttribute("data-ticket")) {
      selectPermissionStudent(li.getAttribute("data-ticket"));
    }
  });

  // Click outside to dismiss suggestion lists
  document.addEventListener("click", (e) => {
    if (!e.target.closest("#perm-student-search") && !e.target.closest("#perm-student-suggestions")) {
      permStudentSuggestions.style.display = "none";
    }
  });

  permissionEntryForm.addEventListener("submit", addPermissionExemption);

  // Edit Contact Pen button click triggers
  document.querySelectorAll(".edit-contact-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      triggerHaptic();
      const target = btn.getAttribute("data-target");
      editContactTarget.value = target;

      let titleText = "Edit Details";
      let currentName = "";
      let currentMobile = "";

      if (target === "mentor") {
        titleText = "Edit Class Mentor Details";
        currentName = state.mentorName;
        currentMobile = state.mentorMobile;
      } else if (target === "cr1") {
        titleText = "Edit CR 1 Details";
        currentName = state.cr1Name;
        currentMobile = state.cr1Mobile;
      } else if (target === "cr2") {
        titleText = "Edit CR 2 Details";
        currentName = state.cr2Name;
        currentMobile = state.cr2Mobile;
      } else if (target === "cr3") {
        titleText = "Edit CR 3 Details";
        currentName = state.cr3Name;
        currentMobile = state.cr3Mobile;
      } else if (target === "cr4") {
        titleText = "Edit CR 4 Details";
        currentName = state.cr4Name;
        currentMobile = state.cr4Mobile;
      }

      editModalTitle.textContent = titleText;
      editContactName.value = currentName;
      editContactMobile.value = currentMobile;
      editContactModal.style.display = "flex";
    });
  });

  btnCloseEditModal.addEventListener("click", () => {
    triggerHaptic();
    editContactModal.style.display = "none";
  });

  editContactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    triggerHaptic();

    const target = editContactTarget.value;
    const newName = editContactName.value.trim();
    const newMobile = editContactMobile.value.trim();

    if (target === "mentor") {
      state.mentorName = newName;
      state.mentorMobile = newMobile;
    } else if (target === "cr1") {
      state.cr1Name = newName;
      state.cr1Mobile = newMobile;
    } else if (target === "cr2") {
      state.cr2Name = newName;
      state.cr2Mobile = newMobile;
    } else if (target === "cr3") {
      state.cr3Name = newName;
      state.cr3Mobile = newMobile;
    } else if (target === "cr4") {
      state.cr4Name = newName;
      state.cr4Mobile = newMobile;
    }

    saveClassContacts();
    renderContacts();
    editContactModal.style.display = "none";
    showToast("💾 Contact profile updated!");
  });

  // Settings config listeners
  btnEditClassname.addEventListener("click", () => {
    triggerHaptic();
    const newVal = prompt("Enter Class Name (e.g. IV CSE - B):", state.className);
    if (newVal !== null && newVal.trim() !== "") {
      state.className = newVal.trim();
      settingsDisplayClassname.textContent = state.className;
      displayDashboardClass.textContent = state.className;
      studentsClassTitle.textContent = state.className;
      saveData();
      updateCounts();
      showToast("Class name updated!");
    }
  });

  // Settings dark mode toggle switch
  settingsDarkmodeToggle.addEventListener("change", (e) => {
    triggerHaptic();
    state.theme = e.target.checked ? "dark" : "light";
    setTheme(state.theme);
    saveData();
  });

  darkModeToggle.addEventListener("click", () => {
    triggerHaptic();
    state.theme = state.theme === "dark" ? "light" : "dark";
    setTheme(state.theme);
    settingsDarkmodeToggle.checked = state.theme === "dark";
    saveData();
  });

  // Report Actions
  btnCopyReport.addEventListener("click", () => {
    triggerHaptic();
    const text = reportTextPreview.textContent;
    copyToClipboard(text).then(() => {
      showToast("📋 Report copied to clipboard!");
    }).catch(err => {
      console.error(err);
      showToast("Copy failed, please copy manually", "error");
    });
  });

  btnWhatsappShare.addEventListener("click", () => {
    triggerHaptic();
    const text = encodeURIComponent(reportTextPreview.textContent);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  });

  btnDownloadTxt.addEventListener("click", () => {
    triggerHaptic();
    const text = reportTextPreview.textContent;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_report_${state.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("⬇️ Downloaded report TXT file");
  });

  btnPrintReport.addEventListener("click", () => {
    triggerHaptic();
    window.print();
  });

  btnPrintOfficial.addEventListener("click", () => {
    triggerHaptic();
    generateOfficialAbsenteeReport();
  });

  // Mock Settings Utilities
  document.getElementById("btn-export-data").addEventListener("click", () => {
    triggerHaptic();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const a = document.createElement("a");
    a.setAttribute("href", dataStr);
    a.setAttribute("download", "classpulse_backup.json");
    a.click();
    showToast("💾 Exported config database backup");
  });

  document.getElementById("btn-import-data").addEventListener("click", () => {
    triggerHaptic();
    showToast("ℹ️ Ready to import 73 students list database");
  });

  document.getElementById("btn-backup-restore").addEventListener("click", () => {
    triggerHaptic();
    showToast("🔄 Config database restoration loaded");
  });

  document.getElementById("btn-about-app").addEventListener("click", () => {
    triggerHaptic();
    alert("ClassPulse v1.0.0\nSmart Offline Attendance Tracker.\nDesigned by Harish & Class Coordinators.");
  });
}

/* ==========================================================================
   Utility Helpers
   ========================================================================== */

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const icon = darkModeToggle.querySelector(".material-symbols-outlined");
  if (icon) {
    icon.textContent = theme === "dark" ? "light_mode" : "dark_mode";
  }
  settingsDarkmodeToggle.checked = theme === "dark";
}

function updateClock() {
  const now = new Date();
  
  // Date format: 07 May 2025, Wed
  if (headerDateEl) {
    headerDateEl.textContent = formatDateString(now);
  }

  // Time format: HH:MM:SS
  if (headerTimeEl) {
    headerTimeEl.textContent = now.toTimeString().split(' ')[0];
  }
}

function formatDateString(dateVal) {
  const d = new Date(dateVal);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const dateNum = String(d.getDate()).padStart(2, '0');
  const monthStr = months[d.getMonth()];
  const yearNum = d.getFullYear();
  const dayStr = days[d.getDay()];

  return `${dateNum} ${monthStr} ${yearNum}, ${dayStr}`;
}

function triggerHaptic() {
  if (navigator.vibrate) {
    navigator.vibrate(8);
  }
}

function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toast-container");
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  const iconName = type === "success" ? "check_circle" : "error";
  toast.innerHTML = `
    <span class="material-symbols-outlined toast-icon">${iconName}</span>
    <span>${message}</span>
  `;

  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for HTTP / non-secure contexts
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      const successful = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (successful) {
        return Promise.resolve();
      } else {
        return Promise.reject("Copy command was unsuccessful");
      }
    } catch (err) {
      document.body.removeChild(textarea);
      return Promise.reject(err);
    }
  }
}

function renderCalendarStrip() {
  const strip = document.querySelector(".calendar-days-strip");
  const monthTitle = document.querySelector(".calendar-month-title");
  if (!strip) return;

  strip.innerHTML = "";
  const today = new Date();
  
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  if (monthTitle) {
    monthTitle.textContent = `${months[today.getMonth()]} ${today.getFullYear()}`;
  }

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = -3; i <= 3; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);

    const dayItem = document.createElement("div");
    dayItem.className = `calendar-day-item${i === 0 ? " active" : ""}`;
    dayItem.setAttribute("data-date", d.toISOString().split('T')[0]);

    dayItem.innerHTML = `
      <span>${days[d.getDay()]}</span>
      <strong>${d.getDate()}</strong>
    `;

    dayItem.addEventListener("click", () => {
      triggerHaptic();
      document.querySelectorAll(".calendar-day-item").forEach(item => item.classList.remove("active"));
      dayItem.classList.add("active");

      const dateKey = formatDateString(d);
      const found = state.history.find(h => h.date === dateKey && h.className === state.className);
      
      const textPreview = document.getElementById("report-text-preview");
      const repSection = document.getElementById("report-section");
      
      if (found) {
        textPreview.textContent = found.reportText;
        repSection.style.display = "flex";
      } else {
        textPreview.textContent = `No report available for user on that date`;
        repSection.style.display = "flex";
      }
    });

    strip.appendChild(dayItem);
  }
}

function updateGreeting() {
  const greetingEl = document.getElementById("home-greeting-text");
  if (!greetingEl) return;

  const hour = new Date().getHours();
  let text = "Good Morning";
  if (hour >= 12 && hour < 17) {
    text = "Good Afternoon";
  } else if (hour >= 17 || hour < 4) {
    text = "Good Evening";
  }
  greetingEl.textContent = `${text} 👋`;
}
