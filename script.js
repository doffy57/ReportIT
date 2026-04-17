let loggedIn = false;
let loggedInName = "";
let reportCounter = 353;
let threadCounter = 1;
let sidebarTimeout = null;

// ===== MOCK USERS (demo only) =====
const mockUsers = [
    { name: "admin", password: "admin123", email: "admin@reportit.ph" },
    { name: "user1", password: "pass1", email: "user1@reportit.ph" },
    { name: "juan", password: "1234", email: "juan@reportit.ph" }
];

// ===== TOAST NOTIFICATION =====
function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ===== SIDEBAR AUTO-HIDE FUNCTIONALITY =====
function showSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.add("active");
    clearTimeout(sidebarTimeout);
}

function hideSidebarAfterDelay() {
    const sidebar = document.getElementById("sidebar");
    sidebarTimeout = setTimeout(() => {
        sidebar.classList.remove("active");
    }, 3000);
}

// ===== REPORT SECTION FUNCTIONS =====
function removePhoto() {
    document.getElementById("reportPhoto").value = "";
    document.getElementById("photoPreview").style.display = "none";
    document.getElementById("previewImg").src = "";
}

function cancelReport() {
    const loggedInHome = document.getElementById("loggedInHome");
    hideAllSections();
    loggedInHome.style.display = "block";
}

function addToRecentReports(id, title, location, description = "Report details...") {
    const recentList = document.getElementById("recentReportsList");
    const newReport = document.createElement("div");
    newReport.className = "recent-report-card";
    newReport.innerHTML = `
        <div class="recent-report-header">
            <div>
                <span class="report-id">${id}</span>
                <p>${title}</p>
            </div>
            <span class="status-badge pending">Pending</span>
        </div>
        <p class="report-location">📍 ${location}</p>
        <small>Submitted just now</small>
    `;
    recentList.insertBefore(newReport, recentList.firstChild);
}

// ===== REPORT DETAILS MODAL =====
function openReportModal(card) {
    const reportDetailsModal = document.getElementById("reportDetailsModal");
    const reportId = card.getAttribute("data-id");
    const title = card.getAttribute("data-title");
    const category = card.getAttribute("data-category");
    const location = card.getAttribute("data-location");
    const description = card.getAttribute("data-description");
    const status = card.getAttribute("data-status");
    const imageSrc = card.getAttribute("data-image") || "road.png";
    
    // Populate modal with report data
    document.getElementById("modalReportId").textContent = reportId;
    document.getElementById("modalReportImage").src = imageSrc;
    document.getElementById("modalReportTitle").textContent = title;
    document.getElementById("modalReportCategory").textContent = category;
    document.getElementById("modalReportLocation").textContent = location;
    document.getElementById("modalReportDescription").textContent = description;
    
    // Set status with proper styling
    const statusElement = document.getElementById("modalReportStatus");
    statusElement.className = `status ${status}`;
    const statusLabel = status === "progress" ? "In Progress" : status === "pending" ? "Pending" : "Resolved";
    statusElement.textContent = statusLabel;
    
    // Get current date
    const today = new Date();
    const dateString = today.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById("modalReportDate").textContent = dateString;
    
    // Open modal
    reportDetailsModal.classList.add("active");
}

// ===== ADD REPORT CARD TO DASHBOARD =====
function addReportCard(id, title, status, imgSrc = "road.png", location = "Location TBA", description = "Report details...") {
    const grid = document.getElementById("reportGrid");
    const card = document.createElement("div");
    card.className = "report-card-simple";
    card.setAttribute("data-status", status);
    card.setAttribute("data-id", id);
    card.setAttribute("data-title", title);
    card.setAttribute("data-category", title);
    card.setAttribute("data-location", location);
    card.setAttribute("data-description", description);
    card.setAttribute("data-image", imgSrc);
    card.setAttribute("onclick", "openReportModal(this)");
    
    const statusLabel = status === "pending" ? "Pending" : status === "progress" ? "In Progress" : "Resolved";
    
    card.innerHTML = `
        <div class="report-card-simple-top">
            <span class="report-id-badge">${id}</span>
            <span class="status ${status}">${statusLabel}</span>
        </div>
        <p class="report-card-simple-title">${title}</p>
    `;
    grid.prepend(card);
}

document.addEventListener("DOMContentLoaded", function () {
    // ===== ELEMENTS =====
    const loginOpen = document.getElementById("loginOpen");
    const logout = document.getElementById("logout");
    const loginModal = document.getElementById("loginModal");
    const loginClose = document.getElementById("loginClose");
    const createThreadModal = document.getElementById("createThreadModal");
    const createThreadClose = document.getElementById("createThreadClose");
    const reportDetailsModal = document.getElementById("reportDetailsModal");
    const reportDetailsClose = document.getElementById("reportDetailsClose");
    const reportDetailsClose2 = document.getElementById("reportDetailsClose2");

    const registerModal = document.getElementById("registerModal");
    const registerClose = document.getElementById("registerClose");
    const forgotModal = document.getElementById("forgotModal");
    const forgotClose = document.getElementById("forgotClose");

    const dashboardSection = document.getElementById("dashboardSection");
    const emergencySection = document.getElementById("emergencySection");
    const contactSection = document.getElementById("contactSection");
    const aboutSection = document.getElementById("aboutSection");
    const aboutReportITSection = document.getElementById("aboutReportITSection");
    const termsSection = document.getElementById("termsSection");
    const privacySection = document.getElementById("privacySection");
    const trackReportSection = document.getElementById("trackReportSection");
    const submitReportSection = document.getElementById("submitReportSection");
    const threadsSection = document.getElementById("threadsSection");
    const settingsSection = document.getElementById("settingsSection");

    const mainHeader = document.getElementById("mainHeader");
    const mainFooter = document.getElementById("mainFooter");
    const guestHome = document.getElementById("guestHome");
    const loggedInHome = document.getElementById("loggedInHome");
    const sidebar = document.getElementById("sidebar");

    const homeLink = document.getElementById("homeLink");
    const dashboardLink = document.getElementById("dashboardLink");
    const emergencyLink = document.getElementById("emergencyLink");
    const contactLink = document.getElementById("contactLink");
    const aboutLink = document.getElementById("aboutLink");
    const aboutReportITLink = document.getElementById("aboutReportITLink");
    const termsLink = document.getElementById("termsLink");
    const privacyLink = document.getElementById("privacyLink");
    const seeAllLink = document.getElementById("seeAllLink");
    const seeAllLoggedLink = document.getElementById("seeAllLoggedLink");

    const userMenu = document.getElementById("userMenu");
    const userNameDisplay = document.getElementById("userNameDisplay");
    const userAvatar = document.getElementById("userAvatar");
    const welcomeName = document.getElementById("welcomeName");

    // ===== SIDEBAR ELEMENTS =====
    const sidebarSubmitReport = document.getElementById("sidebarSubmitReport");
    const sidebarTrackReport = document.getElementById("sidebarTrackReport");
    const sidebarDashboard = document.getElementById("sidebarDashboard");
    const sidebarThreads = document.getElementById("sidebarThreads");
    const sidebarEmergency = document.getElementById("sidebarEmergency");
    const sidebarSettings = document.getElementById("sidebarSettings");
    const sidebarLogout = document.getElementById("sidebarLogout");
    const sidebarAvatar = document.getElementById("sidebarAvatar");
    const sidebarUserName = document.getElementById("sidebarUserName");

    // ===== SIDEBAR AUTO-HIDE LISTENERS =====
    document.addEventListener("mousemove", function(e) {
        if (loggedIn) {
            if (e.clientX < 20) {
                showSidebar();
            } else if (e.clientX < 300) {
                clearTimeout(sidebarTimeout);
            } else {
                hideSidebarAfterDelay();
            }
        }
    });

    document.addEventListener("mouseleave", function() {
        if (loggedIn) {
            hideSidebarAfterDelay();
        }
    });

    sidebar.addEventListener("mouseenter", function() {
        showSidebar();
        clearTimeout(sidebarTimeout);
    });

    sidebar.addEventListener("mouseleave", function() {
        hideSidebarAfterDelay();
    });

    // ===== SUBMIT REPORT FORM HANDLING =====
    const submitReportForm = document.getElementById("submitReportFormMain");
    const photoInput = document.getElementById("reportPhoto");

    if (photoInput) {
        photoInput.addEventListener("change", function(e) {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById("previewImg").src = e.target.result;
                    document.getElementById("photoPreview").style.display = "block";
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (submitReportForm) {
        submitReportForm.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const category = document.getElementById("reportCategory").value;
            const location = document.getElementById("reportLocation").value.trim();
            const description = document.getElementById("reportDescription").value.trim();
            const priority = document.getElementById("reportPriority").value;
            const contactName = document.getElementById("reportContactName").value.trim();
            const contactEmail = document.getElementById("reportContactEmail").value.trim();

            if (!category) {
                showToast("Please select a category.", "error");
                return;
            }
            if (!location) {
                showToast("Please enter the location.", "error");
                return;
            }
            if (!description) {
                showToast("Please enter a description.", "error");
                return;
            }

            const newId = `REP-0${reportCounter++}`;
            const file = photoInput.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    addReportCard(newId, category, "pending", e.target.result, location, description);
                    addToRecentReports(newId, category, location, description);
                };
                reader.readAsDataURL(file);
            } else {
                addReportCard(newId, category, "pending", "road.png", location, description);
                addToRecentReports(newId, category, location, description);
            }

            // Reset form
            submitReportForm.reset();
            document.getElementById("photoPreview").style.display = "none";
            
            showToast(`Report ${newId} submitted successfully! You can track it anytime.`, "success");
            
            // Show confirmation
            setTimeout(() => {
                hideAllSections();
                loggedInHome.style.display = "block";
            }, 1500);
        });
    }

    // ===== THREADS FUNCTIONALITY =====
    document.getElementById("createThreadBtn").addEventListener("click", function() {
        createThreadModal.classList.add("active");
    });

    createThreadClose.addEventListener("click", function() {
        createThreadModal.classList.remove("active");
    });

    createThreadModal.addEventListener("click", function(e) {
        if (e.target === createThreadModal) createThreadModal.classList.remove("active");
    });

    document.getElementById("createThreadBtn2").addEventListener("click", function() {
        const title = document.getElementById("threadTitle").value.trim();
        const category = document.getElementById("threadCategory").value;
        const description = document.getElementById("threadDescription").value.trim();

        if (!title || !category || !description) {
            showToast("Please fill in all fields", "error");
            return;
        }

        const newThread = document.createElement("div");
        newThread.className = "thread-item";
        newThread.innerHTML = `
            <div class="thread-header">
                <div class="thread-author">
                    <span class="author-avatar">${loggedInName.substring(0, 2).toUpperCase()}</span>
                    <div class="author-info">
                        <p class="author-name">${loggedInName}</p>
                        <small>Posted just now</small>
                    </div>
                </div>
                <span class="thread-category">${category}</span>
            </div>
            <div class="thread-body">
                <h3 class="thread-title">${title}</h3>
                <p class="thread-content">${description}</p>
            </div>
            <div class="thread-stats">
                <span class="stat">
                    <span class="stat-icon">💬</span>
                    <span class="stat-label">0 Replies</span>
                </span>
                <span class="stat">
                    <span class="stat-icon">❤️</span>
                    <span class="stat-label">0 Likes</span>
                </span>
                <span class="stat">
                    <span class="stat-icon">👁️</span>
                    <span class="stat-label">0 Views</span>
                </span>
            </div>
            <div class="thread-actions">
                <button class="action-btn">👍 Like</button>
                <button class="action-btn">💬 Reply</button>
                <button class="action-btn">🔗 Share</button>
            </div>
        `;

        document.getElementById("threadsList").insertBefore(newThread, document.getElementById("threadsList").firstChild);
        
        createThreadModal.classList.remove("active");
        document.getElementById("threadTitle").value = "";
        document.getElementById("threadCategory").value = "";
        document.getElementById("threadDescription").value = "";

        showToast("Thread created successfully!", "success");
    });

    document.getElementById("threadSearch").addEventListener("input", function() {
        const searchTerm = this.value.toLowerCase();
        const threads = document.querySelectorAll(".thread-item");

        threads.forEach(thread => {
            const title = thread.querySelector(".thread-title").textContent.toLowerCase();
            const content = thread.querySelector(".thread-content").textContent.toLowerCase();

            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                thread.style.display = "block";
            } else {
                thread.style.display = "none";
            }
        });
    });

    // ===== REPORT DETAILS MODAL =====
    reportDetailsClose.addEventListener("click", function() {
        reportDetailsModal.classList.remove("active");
    });

    reportDetailsClose2.addEventListener("click", function() {
        reportDetailsModal.classList.remove("active");
    });

    reportDetailsModal.addEventListener("click", function(e) {
        if (e.target === reportDetailsModal) reportDetailsModal.classList.remove("active");
    });

    // ===== HELPER: Close all modals =====
    function closeAllModals() {
        loginModal.classList.remove("active");
        registerModal.classList.remove("active");
        forgotModal.classList.remove("active");
    }

    // ===== UPDATE UI FOR LOGIN STATE =====
    function updateUIForLoginState() {
        if (loggedIn) {
            mainHeader.style.display = "none";
            mainFooter.style.display = "none";
            sidebar.classList.remove("active");
        } else {
            mainHeader.style.display = "flex";
            mainFooter.style.display = "block";
            sidebar.classList.remove("active");
        }
    }

    // ===== ACTIVE NAV =====
    function setActiveNav(activeId) {
        document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
        const el = document.getElementById(activeId);
        if (el) el.classList.add("active");
    }

    // ===== ACTIVE SIDEBAR LINK =====
    function setActiveSidebarLink(activeId) {
        document.querySelectorAll(".sidebar-link").forEach(link => link.classList.remove("active"));
        const el = document.getElementById(activeId);
        if (el) el.classList.add("active");
    }

    // ===== HIDE ALL SECTIONS =====
    function hideAllSections() {
        guestHome.style.display = "none";
        loggedInHome.style.display = "none";
        submitReportSection.style.display = "none";
        dashboardSection.style.display = "none";
        emergencySection.style.display = "none";
        contactSection.style.display = "none";
        aboutSection.style.display = "none";
        aboutReportITSection.style.display = "none";
        termsSection.style.display = "none";
        privacySection.style.display = "none";
        trackReportSection.style.display = "none";
        threadsSection.style.display = "none";
        settingsSection.style.display = "none";
    }

    // ===== SHOW HOME (respects login state) =====
    function showHome() {
        hideAllSections();
        if (loggedIn) {
            loggedInHome.style.display = "block";
        } else {
            guestHome.style.display = "block";
            setActiveNav("homeLink");
        }
        mainFooter.style.display = "block";
        updateUIForLoginState();
    }

    // ===== LOGIN ACTIONS =====
    loginOpen.addEventListener("click", function (e) {
        e.preventDefault();
        closeAllModals();
        loginModal.classList.add("active");
    });

    loginClose.addEventListener("click", function () {
        loginModal.classList.remove("active");
    });

    loginModal.addEventListener("click", function (e) {
        if (e.target === loginModal) loginModal.classList.remove("active");
    });

    document.getElementById("loginBtn").addEventListener("click", function () {
        const nameInput = document.getElementById("loginName").value.trim();
        const passwordInput = document.getElementById("loginPassword").value.trim();

        if (!nameInput || !passwordInput) {
            showToast("Please enter both Name and Password!", "error");
            return;
        }

        if (passwordInput.length < 4) {
            showToast("Password must be at least 4 characters.", "error");
            return;
        }

        const validUser = mockUsers.find(u => u.name.toLowerCase() === nameInput.toLowerCase() && u.password === passwordInput);
        if (!validUser) {
            showToast("Invalid name or password. Try: admin / admin123", "error");
            return;
        }

        loggedIn = true;
        loggedInName = nameInput;
        loginModal.classList.remove("active");
        showToast(`Welcome, ${nameInput}! You are now logged in.`, "success");

        document.getElementById("loginName").value = "";
        document.getElementById("loginPassword").value = "";

        const initials = nameInput.charAt(0).toUpperCase();
        sidebarAvatar.textContent = initials;
        sidebarUserName.textContent = nameInput.charAt(0).toUpperCase() + nameInput.slice(1);

        welcomeName.textContent = nameInput.charAt(0).toUpperCase() + nameInput.slice(1);

        updateUIForLoginState();
        showHome();
    });

    logout.addEventListener("click", function (e) {
        e.preventDefault();
        loggedIn = false;
        loggedInName = "";
        showToast("You have been logged out.", "info");
        updateUIForLoginState();
        showHome();
    });

    sidebarLogout.addEventListener("click", function (e) {
        e.preventDefault();
        loggedIn = false;
        loggedInName = "";
        showToast("You have been logged out.", "info");
        updateUIForLoginState();
        showHome();
    });

    // ===== SWITCH: Login -> Register =====
    document.getElementById("openRegisterLink").addEventListener("click", function (e) {
        e.preventDefault();
        closeAllModals();
        registerModal.classList.add("active");
    });

    // ===== SWITCH: Register -> Login =====
    document.getElementById("openLoginFromRegister").addEventListener("click", function (e) {
        e.preventDefault();
        closeAllModals();
        loginModal.classList.add("active");
    });

    // ===== REGISTER MODAL =====
    registerClose.addEventListener("click", function () {
        registerModal.classList.remove("active");
    });

    registerModal.addEventListener("click", function (e) {
        if (e.target === registerModal) registerModal.classList.remove("active");
    });

    document.getElementById("registerBtn").addEventListener("click", function () {
        const name = document.getElementById("registerName").value.trim();
        const email = document.getElementById("registerEmail").value.trim();
        const password = document.getElementById("registerPassword").value.trim();
        const confirmPassword = document.getElementById("registerConfirmPassword").value.trim();

        if (!name || !email || !password || !confirmPassword) {
            showToast("Please fill in all fields.", "error");
            return;
        }

        if (password.length < 4) {
            showToast("Password must be at least 4 characters.", "error");
            return;
        }

        if (password !== confirmPassword) {
            showToast("Passwords do not match.", "error");
            return;
        }

        const existingUser = mockUsers.find(u => u.name.toLowerCase() === name.toLowerCase());
        if (existingUser) {
            showToast("Username already exists. Please choose another.", "error");
            return;
        }

        mockUsers.push({ name, password, email });

        document.getElementById("registerName").value = "";
        document.getElementById("registerEmail").value = "";
        document.getElementById("registerPassword").value = "";
        document.getElementById("registerConfirmPassword").value = "";

        registerModal.classList.remove("active");
        showToast(`Account created! Welcome, ${name}! You can now log in.`, "success");

        setTimeout(() => {
            loginModal.classList.add("active");
        }, 400);
    });

    // ===== FORGOT PASSWORD LINK =====
    document.getElementById("forgotPasswordLink").addEventListener("click", function (e) {
        e.preventDefault();
        closeAllModals();
        document.getElementById("forgotStep1").style.display = "block";
        document.getElementById("forgotStep2").style.display = "none";
        document.getElementById("forgotName").value = "";
        document.getElementById("newPassword").value = "";
        document.getElementById("confirmNewPassword").value = "";
        forgotModal.classList.add("active");
    });

    forgotClose.addEventListener("click", function () {
        forgotModal.classList.remove("active");
    });

    forgotModal.addEventListener("click", function (e) {
        if (e.target === forgotModal) forgotModal.classList.remove("active");
    });

    document.getElementById("backToLoginFromForgot").addEventListener("click", function (e) {
        e.preventDefault();
        closeAllModals();
        loginModal.classList.add("active");
    });

    document.getElementById("forgotNextBtn").addEventListener("click", function () {
        const nameInput = document.getElementById("forgotName").value.trim();

        if (!nameInput) {
            showToast("Please enter your username.", "error");
            return;
        }

        const userExists = mockUsers.find(u => u.name.toLowerCase() === nameInput.toLowerCase());
        if (!userExists) {
            showToast("No account found with that username.", "error");
            return;
        }

        document.getElementById("forgotStep1").style.display = "none";
        document.getElementById("forgotStep2").style.display = "block";
        showToast(`Account found! Set your new password.`, "success");
    });

    document.getElementById("resetPasswordBtn").addEventListener("click", function () {
        const nameInput = document.getElementById("forgotName").value.trim();
        const newPass = document.getElementById("newPassword").value.trim();
        const confirmPass = document.getElementById("confirmNewPassword").value.trim();

        if (!newPass || !confirmPass) {
            showToast("Please fill in both password fields.", "error");
            return;
        }

        if (newPass.length < 4) {
            showToast("Password must be at least 4 characters.", "error");
            return;
        }

        if (newPass !== confirmPass) {
            showToast("Passwords do not match.", "error");
            return;
        }

        const user = mockUsers.find(u => u.name.toLowerCase() === nameInput.toLowerCase());
        if (user) {
            user.password = newPass;
        }

        forgotModal.classList.remove("active");
        showToast("Password reset successfully! You can now log in.", "success");

        setTimeout(() => {
            loginModal.classList.add("active");
        }, 400);
    });

    // ===== START REPORT (guest hero button) =====
    const startReportBtnGuest = document.getElementById("startReportBtn");
    if (startReportBtnGuest) {
        startReportBtnGuest.addEventListener("click", function () {
            loginModal.classList.add("active");
        });
    }

    // ===== SIDEBAR NAVIGATION =====
    sidebarSubmitReport.addEventListener("click", function (e) {
        e.preventDefault();
        hideAllSections();
        submitReportSection.style.display = "block";
        setActiveSidebarLink("sidebarSubmitReport");
    });

    sidebarTrackReport.addEventListener("click", function (e) {
        e.preventDefault();
        hideAllSections();
        trackReportSection.style.display = "block";
        setActiveSidebarLink("sidebarTrackReport");
    });

    sidebarDashboard.addEventListener("click", function (e) {
        e.preventDefault();
        hideAllSections();
        dashboardSection.style.display = "block";
        setActiveSidebarLink("sidebarDashboard");
    });

    sidebarThreads.addEventListener("click", function (e) {
        e.preventDefault();
        hideAllSections();
        threadsSection.style.display = "block";
        setActiveSidebarLink("sidebarThreads");
    });

    sidebarEmergency.addEventListener("click", function (e) {
        e.preventDefault();
        hideAllSections();
        emergencySection.style.display = "block";
        setActiveSidebarLink("sidebarEmergency");
    });

    sidebarSettings.addEventListener("click", function (e) {
        e.preventDefault();
        hideAllSections();
        settingsSection.style.display = "block";
        setActiveSidebarLink("sidebarSettings");
    });

    // ===== QUICK ACTION BUTTONS (logged-in home) =====
    document.getElementById("startReportBtnLogged").addEventListener("click", function () {
        hideAllSections();
        submitReportSection.style.display = "block";
        setActiveSidebarLink("sidebarSubmitReport");
    });

    document.getElementById("trackReportBtnLogged").addEventListener("click", function () {
        hideAllSections();
        trackReportSection.style.display = "block";
        setActiveSidebarLink("sidebarTrackReport");
    });

    document.getElementById("viewDashboardBtn").addEventListener("click", function () {
        hideAllSections();
        dashboardSection.style.display = "block";
        setActiveSidebarLink("sidebarDashboard");
    });

    document.getElementById("emergencyQaBtn").addEventListener("click", function () {
        hideAllSections();
        emergencySection.style.display = "block";
        setActiveSidebarLink("sidebarEmergency");
    });

    // ===== TRACK REPORT =====
    document.getElementById("trackSearchBtn").addEventListener("click", function () {
        const input = document.getElementById("trackInput").value.trim().toUpperCase();
        const resultBox = document.getElementById("trackResult");

        if (!input) {
            showToast("Please enter a Report ID.", "error");
            return;
        }

        const allCards = document.querySelectorAll(".report-card-simple");
        let found = null;

        allCards.forEach(card => {
            if (card.getAttribute("data-id") === input) {
                found = {
                    id: card.getAttribute("data-id"),
                    title: card.getAttribute("data-title"),
                    status: card.getAttribute("data-status")
                };
            }
        });

        if (found) {
            const statusLabel = found.status === "progress" ? "In Progress" : found.status === "pending" ? "Pending" : "Resolved";
            resultBox.style.display = "block";
            resultBox.innerHTML = `
                <div class="track-card">
                    <div class="track-id">${found.id}</div>
                    <div class="track-title">${found.title}</div>
                    <span class="status ${found.status}">${statusLabel}</span>
                </div>
            `;
            showToast(`Report ${found.id} found!`, "success");
        } else {
            resultBox.style.display = "block";
            resultBox.innerHTML = `<p class="track-not-found">No report found with ID "<strong>${input}</strong>". Please check and try again.</p>`;
            showToast("Report ID not found.", "error");
        }
    });

    // ===== SETTINGS PAGE =====
    document.getElementById("saveAccountBtn").addEventListener("click", function () {
        const name = document.getElementById("settingsName").value.trim();
        const email = document.getElementById("settingsEmail").value.trim();
        const phone = document.getElementById("settingsPhone").value.trim();

        if (!name || !email || !phone) {
            showToast("Please fill in all account fields.", "error");
            return;
        }

        showToast("Account settings saved successfully!", "success");
    });

    document.getElementById("saveNotificationsBtn").addEventListener("click", function () {
        showToast("Notification preferences saved!", "success");
    });

    document.getElementById("changePasswordBtn").addEventListener("click", function () {
        showToast("Password change feature coming soon!", "info");
    });

    document.getElementById("twoFactorBtn").addEventListener("click", function () {
        showToast("Two-Factor Authentication setup coming soon!", "info");
    });

    document.getElementById("activitiesBtn").addEventListener("click", function () {
        showToast("Login activities will be displayed here", "info");
    });

    document.getElementById("savePreferencesBtn").addEventListener("click", function () {
        showToast("Preferences saved successfully!", "success");
    });

    document.getElementById("deleteAccountBtn").addEventListener("click", function () {
        if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            loggedIn = false;
            showToast("Account deleted successfully.", "info");
            updateUIForLoginState();
            showHome();
        }
    });

    // ===== NAVIGATION =====
    homeLink.addEventListener("click", function (e) {
        e.preventDefault();
        showHome();
    });

    dashboardLink.addEventListener("click", function (e) {
        e.preventDefault();
        hideAllSections();
        dashboardSection.style.display = "block";
        setActiveNav("dashboardLink");
    });

    emergencyLink.addEventListener("click", function (e) {
        e.preventDefault();
        hideAllSections();
        emergencySection.style.display = "block";
        setActiveNav("emergencyLink");
    });

    contactLink.addEventListener("click", function (e) {
        e.preventDefault();
        hideAllSections();
        contactSection.style.display = "block";
        setActiveNav("contactLink");
    });

    aboutLink.addEventListener("click", function (e) {
        e.preventDefault();
        hideAllSections();
        aboutSection.style.display = "block";
    });

    aboutReportITLink.addEventListener("click", function (e) {
        e.preventDefault();
        hideAllSections();
        aboutReportITSection.style.display = "block";
    });

    termsLink.addEventListener("click", function (e) {
        e.preventDefault();
        hideAllSections();
        termsSection.style.display = "block";
    });

    privacyLink.addEventListener("click", function (e) {
        e.preventDefault();
        hideAllSections();
        privacySection.style.display = "block";
    });

    const contactFooterLink = document.getElementById("contactFooterLink");
    if (contactFooterLink) {
        contactFooterLink.addEventListener("click", function (e) {
            e.preventDefault();
            hideAllSections();
            contactSection.style.display = "block";
            setActiveNav("contactLink");
        });
    }

    if (seeAllLink) {
        seeAllLink.addEventListener("click", function (e) {
            e.preventDefault();
            hideAllSections();
            dashboardSection.style.display = "block";
            setActiveNav("dashboardLink");
        });
    }

    if (seeAllLoggedLink) {
        seeAllLoggedLink.addEventListener("click", function (e) {
            e.preventDefault();
            hideAllSections();
            dashboardSection.style.display = "block";
            setActiveSidebarLink("sidebarDashboard");
        });
    }

    // ===== FILTER FUNCTION =====
    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            document.querySelector(".filter-btn.active").classList.remove("active");
            button.classList.add("active");
            applyFilters();
        });
    });

    // ===== SEARCH FUNCTION =====
    document.getElementById("reportSearch").addEventListener("input", applyFilters);

    function applyFilters() {
        const activeStatus = document.querySelector(".filter-btn.active").getAttribute("data-status");
        const searchQuery = document.getElementById("reportSearch").value.toLowerCase();
        const cards = document.querySelectorAll(".report-card-simple");
        let visibleCount = 0;

        cards.forEach(card => {
            const matchesStatus = activeStatus === "all" || card.getAttribute("data-status") === activeStatus;
            const cardId = card.getAttribute("data-id").toLowerCase();
            const cardTitle = card.getAttribute("data-title").toLowerCase();
            const matchesSearch = !searchQuery || cardId.includes(searchQuery) || cardTitle.includes(searchQuery);

            if (matchesStatus && matchesSearch) {
                card.style.display = "flex";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        document.getElementById("noResults").style.display = visibleCount === 0 ? "block" : "none";
    }

    // ===== CONTACT FORM =====
    document.getElementById("contactForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const subject = document.getElementById("contactSubject").value.trim();
        const message = document.getElementById("contactMessage").value.trim();

        if (!name || !email || !subject || !message) {
            showToast("Please fill in all fields.", "error");
            return;
        }

        showToast("Message sent successfully! We'll get back to you soon.", "success");
        this.reset();
    });

    // ===== INITIALIZE =====
    showHome();
});