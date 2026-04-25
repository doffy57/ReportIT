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

// ===== COPY TO CLIPBOARD (for hotline numbers) =====
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast("Number copied: " + text, "success");
    }).catch(() => {
        // fallback
        const el = document.createElement("textarea");
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
        showToast("Number copied: " + text, "success");
    });
}

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
        <p class="report-location"><i class="bi bi-geo-alt-fill"></i> ${location}</p>
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
                    <span class="stat-icon"><i class="bi bi-heart-fill"></i></span>
                    <span class="stat-label">0 Likes</span>
                </span>
                <span class="stat">
                    <span class="stat-icon"><i class="bi bi-eye"></i></span>
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
        const analyticsSection = document.getElementById("analyticsSection");
        if (analyticsSection) analyticsSection.style.display = "none";
        const manageReportsSection = document.getElementById("manageReportsSection");
        if (manageReportsSection) manageReportsSection.style.display = "none";
        const manageUsersSection = document.getElementById("manageUsersSection");
        if (manageUsersSection) manageUsersSection.style.display = "none";
        const manageNewsSection = document.getElementById("manageNewsSection");
        if (manageNewsSection) manageNewsSection.style.display = "none";
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

    // ===== ADMIN PANEL SIDEBAR NAVIGATION =====
    const adminPanelLabel = document.getElementById("adminPanelLabel");
    const sidebarManageReports = document.getElementById("sidebarManageReports");
    const sidebarManageUsers = document.getElementById("sidebarManageUsers");
    const sidebarManageNews = document.getElementById("sidebarManageNews");
    const sidebarAnalytics = document.getElementById("sidebarAnalytics");

    if (sidebarManageReports) {
        sidebarManageReports.addEventListener("click", function (e) {
            e.preventDefault();
            hideAllSections();
            document.getElementById("manageReportsSection").style.display = "block";
            setActiveSidebarLink("sidebarManageReports");
        });
    }

    if (sidebarManageUsers) {
        sidebarManageUsers.addEventListener("click", function (e) {
            e.preventDefault();
            hideAllSections();
            document.getElementById("manageUsersSection").style.display = "block";
            setActiveSidebarLink("sidebarManageUsers");
        });
    }

    if (sidebarManageNews) {
        sidebarManageNews.addEventListener("click", function (e) {
            e.preventDefault();
            hideAllSections();
            document.getElementById("manageNewsSection").style.display = "block";
            setActiveSidebarLink("sidebarManageNews");
        });
    }

    if (sidebarAnalytics) {
        sidebarAnalytics.addEventListener("click", function (e) {
            e.preventDefault();
            hideAllSections();
            const analyticsSection = document.getElementById("analyticsSection");
            if (analyticsSection) analyticsSection.style.display = "block";
            setActiveSidebarLink("sidebarAnalytics");
        });
    }

    // Show/hide admin panel based on login state
    function updateAdminPanel() {
        const isAdmin = loggedInName.toLowerCase() === "admin";
        if (adminPanelLabel) adminPanelLabel.style.display = isAdmin ? "block" : "none";
        if (sidebarManageReports) sidebarManageReports.style.display = isAdmin ? "flex" : "none";
        if (sidebarManageUsers) sidebarManageUsers.style.display = isAdmin ? "flex" : "none";
        if (sidebarManageNews) sidebarManageNews.style.display = isAdmin ? "flex" : "none";
        if (sidebarAnalytics) sidebarAnalytics.style.display = isAdmin ? "flex" : "none";
    }

    // Patch login to call updateAdminPanel
    const originalLoginBtn = document.getElementById("loginBtn");
    if (originalLoginBtn) {
        originalLoginBtn.addEventListener("click", function () {
            setTimeout(updateAdminPanel, 100);
        });
    }

    // Patch logout to hide admin panel
    const origLogout = document.getElementById("logout");
    const origSidebarLogout = document.getElementById("sidebarLogout");
    [origLogout, origSidebarLogout].forEach(btn => {
        if (btn) btn.addEventListener("click", function () {
            setTimeout(updateAdminPanel, 100);
        });
    });

    // Init — hide admin panel by default until logged in as admin
    updateAdminPanel();

    // ===== ADMIN PANEL — MANAGE REPORTS =====
    let adminEditReportRow = null;

    window.adminViewReport = function(btn) {
        const row = btn.closest("tr");
        document.getElementById("av-id").textContent = row.dataset.id;
        document.getElementById("av-category").textContent = row.dataset.category;
        document.getElementById("av-location").textContent = row.dataset.location;
        document.getElementById("av-description").textContent = row.dataset.description;
        document.getElementById("av-date").textContent = row.dataset.date;
        const statusEl = document.getElementById("av-status");
        const s = row.dataset.status;
        const sLabel = s === "progress" ? "In Progress" : s === "pending" ? "Pending" : "Resolved";
        statusEl.innerHTML = `<span class="status ${s}">${sLabel}</span>`;
        document.getElementById("adminViewReportModal").classList.add("active");
    };

    window.adminEditReport = function(btn) {
        adminEditReportRow = btn.closest("tr");
        document.getElementById("er-id").value = adminEditReportRow.dataset.id;
        document.getElementById("er-title").value = adminEditReportRow.dataset.title;
        document.getElementById("er-category").value = adminEditReportRow.dataset.category;
        document.getElementById("er-location").value = adminEditReportRow.dataset.location;
        document.getElementById("er-status").value = adminEditReportRow.dataset.status;
        document.getElementById("er-description").value = adminEditReportRow.dataset.description;
        document.getElementById("adminEditReportModal").classList.add("active");
    };

    window.adminDeleteReport = function(btn) {
        const row = btn.closest("tr");
        const id = row.dataset.id;
        if (confirm(`Delete report ${id}? This action cannot be undone.`)) {
            row.remove();
            showToast(`Report ${id} deleted.`, "info");
        }
    };

    document.getElementById("adminSaveReportBtn").addEventListener("click", function() {
        if (!adminEditReportRow) return;
        const title = document.getElementById("er-title").value.trim();
        const category = document.getElementById("er-category").value.trim();
        const location = document.getElementById("er-location").value.trim();
        const status = document.getElementById("er-status").value;
        const description = document.getElementById("er-description").value.trim();
        if (!title || !location) { showToast("Title and Location are required.", "error"); return; }
        adminEditReportRow.dataset.title = title;
        adminEditReportRow.dataset.category = category;
        adminEditReportRow.dataset.location = location;
        adminEditReportRow.dataset.status = status;
        adminEditReportRow.dataset.description = description;
        const sLabel = status === "progress" ? "In Progress" : status === "pending" ? "Pending" : "Resolved";
        const cells = adminEditReportRow.querySelectorAll("td");
        cells[1].innerHTML = `<strong>${title}</strong><br><small>${category}</small>`;
        cells[2].textContent = location;
        cells[3].innerHTML = `<span class="status ${status}">${sLabel}</span>`;
        document.getElementById("adminEditReportModal").classList.remove("active");
        showToast("Report updated successfully!", "success");
    });

    ["adminViewReportClose","adminViewReportClose2"].forEach(id => {
        document.getElementById(id).addEventListener("click", () => document.getElementById("adminViewReportModal").classList.remove("active"));
    });
    ["adminEditReportClose","adminEditReportClose2"].forEach(id => {
        document.getElementById(id).addEventListener("click", () => document.getElementById("adminEditReportModal").classList.remove("active"));
    });
    document.getElementById("adminViewReportModal").addEventListener("click", e => { if(e.target===document.getElementById("adminViewReportModal")) document.getElementById("adminViewReportModal").classList.remove("active"); });
    document.getElementById("adminEditReportModal").addEventListener("click", e => { if(e.target===document.getElementById("adminEditReportModal")) document.getElementById("adminEditReportModal").classList.remove("active"); });

    // Search + filter for Manage Reports
    function filterManageReports() {
        const q = document.getElementById("manageReportSearch").value.toLowerCase();
        const f = document.getElementById("manageReportFilter").value;
        let count = 0;
        document.querySelectorAll("#manageReportsTbody tr").forEach(row => {
            const matchSearch = !q || row.dataset.id.toLowerCase().includes(q) || row.dataset.title.toLowerCase().includes(q);
            const matchFilter = f === "all" || row.dataset.status === f;
            row.style.display = (matchSearch && matchFilter) ? "" : "none";
            if (matchSearch && matchFilter) count++;
        });
        document.getElementById("manageReportsNoResult").style.display = count === 0 ? "block" : "none";
    }
    document.getElementById("manageReportSearch").addEventListener("input", filterManageReports);
    document.getElementById("manageReportFilter").addEventListener("change", filterManageReports);

    // ===== ADMIN PANEL — MANAGE USERS =====
    let adminEditUserRow = null;

    window.adminViewUser = function(btn) {
        const row = btn.closest("tr");
        const name = row.dataset.name;
        const email = row.dataset.email;
        const role = row.dataset.role;
        const status = row.dataset.status;
        document.getElementById("av-user-avatar").textContent = name.charAt(0).toUpperCase();
        document.getElementById("av-user-name").textContent = name;
        document.getElementById("av-user-email").textContent = email;
        const roleClass = role === "admin" ? "role-admin" : "role-user";
        const roleLabel = role === "admin" ? "Admin" : "User";
        document.getElementById("av-user-role-badge").innerHTML = `<span class="role-badge ${roleClass}">${roleLabel}</span>`;
        document.getElementById("av-user-name2").textContent = name;
        document.getElementById("av-user-role2").textContent = roleLabel;
        document.getElementById("av-user-email2").textContent = email;
        document.getElementById("av-user-status2").textContent = status.charAt(0).toUpperCase() + status.slice(1);
        document.getElementById("adminViewUserModal").classList.add("active");
    };

    window.adminEditUser = function(btn) {
        adminEditUserRow = btn.closest("tr");
        document.getElementById("eu-name").value = adminEditUserRow.dataset.name;
        document.getElementById("eu-email").value = adminEditUserRow.dataset.email;
        document.getElementById("eu-role").value = adminEditUserRow.dataset.role;
        document.getElementById("eu-status").value = adminEditUserRow.dataset.status;
        document.getElementById("adminEditUserModal").classList.add("active");
    };

    window.adminDeleteUser = function(btn) {
        const row = btn.closest("tr");
        const name = row.dataset.name;
        if (name === "admin") { showToast("Cannot delete the admin account.", "error"); return; }
        if (confirm(`Delete user "${name}"? This cannot be undone.`)) {
            row.remove();
            showToast(`User "${name}" deleted.`, "info");
        }
    };

    document.getElementById("adminSaveUserBtn").addEventListener("click", function() {
        if (!adminEditUserRow) return;
        const email = document.getElementById("eu-email").value.trim();
        const role = document.getElementById("eu-role").value;
        const status = document.getElementById("eu-status").value;
        if (!email) { showToast("Email is required.", "error"); return; }
        adminEditUserRow.dataset.email = email;
        adminEditUserRow.dataset.role = role;
        adminEditUserRow.dataset.status = status;
        const roleClass = role === "admin" ? "role-admin" : "role-user";
        const roleLabel = role === "admin" ? "Admin" : "User";
        const statusClass = status === "active" ? "active" : "suspended";
        const cells = adminEditUserRow.querySelectorAll("td");
        cells[2].textContent = email;
        cells[3].innerHTML = `<span class="role-badge ${roleClass}">${roleLabel}</span>`;
        cells[4].innerHTML = `<span class="user-status ${statusClass}">● ${status.charAt(0).toUpperCase()+status.slice(1)}</span>`;
        document.getElementById("adminEditUserModal").classList.remove("active");
        showToast("User updated successfully!", "success");
    });

    ["adminViewUserClose","adminViewUserClose2"].forEach(id => {
        document.getElementById(id).addEventListener("click", () => document.getElementById("adminViewUserModal").classList.remove("active"));
    });
    ["adminEditUserClose","adminEditUserClose2"].forEach(id => {
        document.getElementById(id).addEventListener("click", () => document.getElementById("adminEditUserModal").classList.remove("active"));
    });
    document.getElementById("adminViewUserModal").addEventListener("click", e => { if(e.target===document.getElementById("adminViewUserModal")) document.getElementById("adminViewUserModal").classList.remove("active"); });
    document.getElementById("adminEditUserModal").addEventListener("click", e => { if(e.target===document.getElementById("adminEditUserModal")) document.getElementById("adminEditUserModal").classList.remove("active"); });

    // Search + filter for Manage Users
    function filterManageUsers() {
        const q = document.getElementById("manageUserSearch").value.toLowerCase();
        const f = document.getElementById("manageUserFilter").value;
        let count = 0;
        document.querySelectorAll("#manageUsersTbody tr").forEach(row => {
            const matchSearch = !q || row.dataset.name.toLowerCase().includes(q) || row.dataset.email.toLowerCase().includes(q);
            const matchFilter = f === "all" || row.dataset.role === f;
            row.style.display = (matchSearch && matchFilter) ? "" : "none";
            if (matchSearch && matchFilter) count++;
        });
        document.getElementById("manageUsersNoResult").style.display = count === 0 ? "block" : "none";
    }
    document.getElementById("manageUserSearch").addEventListener("input", filterManageUsers);
    document.getElementById("manageUserFilter").addEventListener("change", filterManageUsers);

    // ===== ADMIN PANEL — MANAGE NEWS =====
    let adminEditNewsRow = null;
    let isAddingNews = false;

    window.adminViewNews = function(btn) {
        const row = btn.closest("tr");
        document.getElementById("an-title").textContent = row.dataset.title;
        document.getElementById("an-category").textContent = row.dataset.category;
        document.getElementById("an-author").textContent = row.dataset.author;
        document.getElementById("an-likes").innerHTML = '<i class="bi bi-heart-fill"></i> ' + row.dataset.likes;
        document.getElementById("an-content").textContent = row.dataset.content;
        const badge = row.dataset.badge.toLowerCase().replace(" ", "-");
        document.getElementById("an-badge").innerHTML = `<span class="news-badge-pill ${badge}">${row.dataset.badge}</span>`;
        document.getElementById("adminViewNewsModal").classList.add("active");
    };

    window.adminEditNews = function(btn) {
        isAddingNews = false;
        adminEditNewsRow = btn.closest("tr");
        document.getElementById("adminNewsModalTitle").textContent = "✏ Edit Article";
        document.getElementById("en-title").value = adminEditNewsRow.dataset.title;
        document.getElementById("en-category").value = adminEditNewsRow.dataset.category;
        document.getElementById("en-author").value = adminEditNewsRow.dataset.author;
        document.getElementById("en-badge").value = adminEditNewsRow.dataset.badge;
        document.getElementById("en-content").value = adminEditNewsRow.dataset.content;
        document.getElementById("adminEditNewsModal").classList.add("active");
    };

    window.adminDeleteNews = function(btn) {
        const row = btn.closest("tr");
        if (confirm(`Delete this article? This cannot be undone.`)) {
            row.remove();
            showToast("Article deleted.", "info");
        }
    };

    document.getElementById("openAddNewsBtn").addEventListener("click", function() {
        isAddingNews = true;
        adminEditNewsRow = null;
        document.getElementById("adminNewsModalTitle").textContent = "+ Add New Article";
        document.getElementById("en-title").value = "";
        document.getElementById("en-category").value = "";
        document.getElementById("en-author").value = "LGU Pasig City";
        document.getElementById("en-badge").value = "Announcement";
        document.getElementById("en-content").value = "";
        document.getElementById("adminEditNewsModal").classList.add("active");
    });

    document.getElementById("adminSaveNewsBtn").addEventListener("click", function() {
        const title = document.getElementById("en-title").value.trim();
        const category = document.getElementById("en-category").value.trim();
        const author = document.getElementById("en-author").value.trim();
        const badge = document.getElementById("en-badge").value;
        const content = document.getElementById("en-content").value.trim();
        if (!title || !content) { showToast("Title and Content are required.", "error"); return; }
        const badgeClass = badge.toLowerCase().replace(" ", "-");
        const badgeHtml = `<span class="news-badge-pill ${badgeClass}">${badge}</span>`;
        if (isAddingNews) {
            const tbody = document.getElementById("manageNewsTbody");
            const newRow = document.createElement("tr");
            newRow.dataset.title = title;
            newRow.dataset.category = category;
            newRow.dataset.author = author;
            newRow.dataset.badge = badge;
            newRow.dataset.content = content;
            newRow.dataset.likes = "0";
            newRow.innerHTML = `
                <td><strong>${title}</strong></td>
                <td>${category}</td>
                <td>${author}</td>
                <td>${badgeHtml}</td>
                <td><i class="bi bi-heart-fill"></i> 0</td>
                <td class="tbl-actions">
                    <button class="tbl-btn view-btn" onclick="adminViewNews(this)"><i class="bi bi-eye"></i> View</button>
                    <button class="tbl-btn edit-btn" onclick="adminEditNews(this)"><i class="bi bi-pencil"></i> Edit</button>
                    <button class="tbl-btn delete-btn" onclick="adminDeleteNews(this)"><i class="bi bi-trash"></i> Delete</button>
                </td>`;
            tbody.prepend(newRow);
            showToast("Article added successfully!", "success");
        } else if (adminEditNewsRow) {
            adminEditNewsRow.dataset.title = title;
            adminEditNewsRow.dataset.category = category;
            adminEditNewsRow.dataset.author = author;
            adminEditNewsRow.dataset.badge = badge;
            adminEditNewsRow.dataset.content = content;
            const cells = adminEditNewsRow.querySelectorAll("td");
            cells[0].innerHTML = `<strong>${title}</strong>`;
            cells[1].textContent = category;
            cells[2].textContent = author;
            cells[3].innerHTML = badgeHtml;
            showToast("Article updated successfully!", "success");
        }
        document.getElementById("adminEditNewsModal").classList.remove("active");
    });

    ["adminViewNewsClose","adminViewNewsClose2"].forEach(id => {
        document.getElementById(id).addEventListener("click", () => document.getElementById("adminViewNewsModal").classList.remove("active"));
    });
    ["adminEditNewsClose","adminEditNewsClose2"].forEach(id => {
        document.getElementById(id).addEventListener("click", () => document.getElementById("adminEditNewsModal").classList.remove("active"));
    });
    document.getElementById("adminViewNewsModal").addEventListener("click", e => { if(e.target===document.getElementById("adminViewNewsModal")) document.getElementById("adminViewNewsModal").classList.remove("active"); });
    document.getElementById("adminEditNewsModal").addEventListener("click", e => { if(e.target===document.getElementById("adminEditNewsModal")) document.getElementById("adminEditNewsModal").classList.remove("active"); });

    // Search for Manage News
    document.getElementById("manageNewsSearch").addEventListener("input", function() {
        const q = this.value.toLowerCase();
        let count = 0;
        document.querySelectorAll("#manageNewsTbody tr").forEach(row => {
            const match = !q || row.dataset.title.toLowerCase().includes(q) || row.dataset.category.toLowerCase().includes(q);
            row.style.display = match ? "" : "none";
            if (match) count++;
        });
        document.getElementById("manageNewsNoResult").style.display = count === 0 ? "block" : "none";
    });

    // Also wire up Analytics admin tool card buttons
    const analyticsToolBtns = document.querySelectorAll(".atc-btn");
    if (analyticsToolBtns.length >= 4) {
        analyticsToolBtns[0].addEventListener("click", () => { hideAllSections(); document.getElementById("manageReportsSection").style.display="block"; setActiveSidebarLink("sidebarManageReports"); });
        analyticsToolBtns[1].addEventListener("click", () => { hideAllSections(); document.getElementById("manageUsersSection").style.display="block"; setActiveSidebarLink("sidebarManageUsers"); });
        analyticsToolBtns[2].addEventListener("click", () => { hideAllSections(); document.getElementById("manageNewsSection").style.display="block"; setActiveSidebarLink("sidebarManageNews"); });
        analyticsToolBtns[3].addEventListener("click", () => { hideAllSections(); document.getElementById("analyticsSection").style.display="block"; setActiveSidebarLink("sidebarAnalytics"); });
    }

    // ===== INITIALIZE =====
    showHome();
});