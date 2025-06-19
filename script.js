// Global state
let currentPage = 'home';
let gameTimer = 0;
let isTimerRunning = false;
let timerInterval = null;
let adminMode = false;
let currentWeek = 1;
let completedWeeks = [];
let currentUser = null;

// Weekly program data
const weeklyProgram = [
    {
        week: 1,
        title: "Tempo Fundamentals",
        focus: "Understanding initiative and basic tempo swings",
        exercises: [
            "Track tempo changes every 2 minutes in-game",
            "Practice one-for-one action rule",
            "Identify 3 tempo opportunities per game",
            "VOD review: Mark tempo shifts with timestamps"
        ]
    },
    {
        week: 2,
        title: "Wave States & Priority",
        focus: "Mastering lane priority and turn usage",
        exercises: [
            "Call out wave states every wave",
            "Use priority for 1 meaningful action per turn",
            "Practice crashing waves at optimal timing",
            "Coordinate with jungle on priority windows"
        ]
    },
    {
        week: 3,
        title: "Action Wave Basics",
        focus: "Calculate and execute simple action waves",
        exercises: [
            "Calculate action waves for all major objectives",
            "Execute 2 coordinated plays using action waves",
            "Practice wave counting during games",
            "Use action wave communication in team fights"
        ]
    },
    {
        week: 4,
        title: "5-Step Action Plan",
        focus: "Implement the complete systematic approach",
        exercises: [
            "Run full 5-step plan for first drake",
            "Assign roles 2 minutes before objectives",
            "Practice vision control timing",
            "Execute backup action waves when needed"
        ]
    },
    {
        week: 5,
        title: "Multi-Lane Coordination",
        focus: "Synchronize action waves across all lanes",
        exercises: [
            "Coordinate offset action waves",
            "Practice action wave chains",
            "Execute plays through different primary lanes",
            "Master lane speed timing differences"
        ]
    },
    {
        week: 6,
        title: "Advanced Applications",
        focus: "Complex scenarios and adaptation",
        exercises: [
            "Adapt action waves when behind",
            "Use action waves for split push coordination",
            "Execute under enemy pressure",
            "Master tempo checks at objectives"
        ]
    }
];

// Authentication Functions
function showLogin() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
}

function showRegister() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
}

function closeAuthModal() {
    // Don't allow closing if not authenticated
    if (!currentUser) return;
    document.getElementById('auth-modal').classList.add('hidden');
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const userCredential = await window.signInWithEmailAndPassword(window.auth, email, password);
        console.log('Login successful:', userCredential.user.email);
    } catch (error) {
        console.error('Login error:', error);
        alert(getErrorMessage(error.code));
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    const role = document.getElementById('register-role').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    try {
        const userCredential = await window.createUserWithEmailAndPassword(window.auth, email, password);
        const user = userCredential.user;
        
        // Update user profile
        await window.updateProfile(user, { displayName: name });
        
        // Save additional user data to Firestore
        await window.saveUserData(user.uid, {
            displayName: name,
            email: email,
            role: role,
            registrationDate: new Date()
        });
        
        console.log('Registration successful:', user.email);
    } catch (error) {
        console.error('Registration error:', error);
        alert(getErrorMessage(error.code));
    }
}

async function signInWithGoogle() {
    try {
        const result = await window.signInWithPopup(window.auth, window.googleProvider);
        const user = result.user;
        
        // Save user data to Firestore
        await window.saveUserData(user.uid, {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            provider: 'google'
        });
        
        console.log('Google sign-in successful:', user.email);
    } catch (error) {
        console.error('Google sign-in error:', error);
        alert(getErrorMessage(error.code));
    }
}

async function handleLogout() {
    try {
        await window.signOut(window.auth);
        currentUser = null;
        
        // Reset app state
        currentWeek = 1;
        completedWeeks = [];
        adminMode = false;
        
        console.log('Logout successful');
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error signing out. Please try again.');
    }
}

function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/user-not-found': 'No account found with this email address.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password': 'Password should be at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later.'
    };
    
    return errorMessages[errorCode] || 'An error occurred. Please try again.';
}

// User Menu Functions
function toggleUserDropdown() {
    const dropdown = document.getElementById('user-dropdown-menu');
    dropdown.classList.toggle('hidden');
}

function showProfile() {
    // TODO: Implement profile page
    alert('Profile page coming soon!');
    toggleUserDropdown();
}

// Page navigation
function showPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    
    // Show selected page
    const pageElement = document.getElementById(page + '-page');
    if (pageElement) {
        pageElement.classList.remove('hidden');
    }
    
    // Update breadcrumb
    const breadcrumb = document.getElementById('breadcrumb');
    const pageName = document.getElementById('current-page-name');
    
    if (page === 'home') {
        breadcrumb.classList.add('hidden');
    } else {
        breadcrumb.classList.remove('hidden');
        pageName.textContent = page.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    currentPage = page;
    
    // Initialize page-specific content
    if (page === 'weekly') {
        renderWeeklyProgram();
        updateWeeklyStatus();
    }
    
    // Close user dropdown if open
    document.getElementById('user-dropdown-menu').classList.add('hidden');
}

// Action Wave Calculator
function calculateActionWave() {
    const input = document.getElementById('objective-time').value;
    if (!input) return;
    
    const [mins, secs] = input.split(':').map(Number);
    if (isNaN(mins) || isNaN(secs)) {
        alert('Please enter time in MM:SS format (e.g., 5:00)');
        return;
    }
    
    const totalSeconds = mins * 60 + secs;
    const executeTime = totalSeconds - 30;
    const executeWave = Math.floor((executeTime - 90) / 30) + 1;
    const setupWaves = [Math.max(1, executeWave - 3), Math.max(1, executeWave - 2)];
    
    // Show results
    document.getElementById('calc-results').classList.remove('hidden');
    document.getElementById('execute-wave').textContent = `Wave ${executeWave}`;
    document.getElementById('execute-time').textContent = formatTime(executeTime);
    document.getElementById('setup-waves').textContent = setupWaves.join(', ');
}

// Timer functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateTimer() {
    document.getElementById('timer-display').textContent = formatTime(gameTimer);
    const currentWave = Math.max(1, Math.floor((gameTimer - 90) / 30) + 1);
    document.getElementById('current-wave').textContent = currentWave;
}

function toggleTimer() {
    const btn = document.getElementById('timer-btn');
    
    if (isTimerRunning) {
        clearInterval(timerInterval);
        btn.textContent = 'Start';
        btn.className = 'btn btn-success';
        isTimerRunning = false;
    } else {
        timerInterval = setInterval(() => {
            gameTimer++;
            updateTimer();
        }, 1000);
        btn.textContent = 'Pause';
        btn.className = 'btn btn-danger';
        isTimerRunning = true;
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    gameTimer = 0;
    isTimerRunning = false;
    updateTimer();
    const btn = document.getElementById('timer-btn');
    btn.textContent = 'Start';
    btn.className = 'btn btn-success';
}

// Weekly program functions
function toggleAdmin() {
    adminMode = !adminMode;
    const panel = document.getElementById('admin-panel');
    const indicator = document.getElementById('admin-indicator');
    const toggle = document.getElementById('admin-toggle');
    
    if (adminMode) {
        panel.classList.remove('hidden');
        indicator.classList.remove('hidden');
        toggle.textContent = '🔓 Exit Admin';
        toggle.className = 'btn btn-danger';
    } else {
        panel.classList.add('hidden');
        indicator.classList.add('hidden');
        toggle.textContent = '🔧 Admin Mode';
        toggle.className = 'btn btn-warning';
    }
    
    renderWeeklyProgram();
}

async function resetProgram() {
    currentWeek = 1;
    completedWeeks = [];
    updateWeeklyStatus();
    renderWeeklyProgram();
    
    // Save to Firebase if user is logged in
    if (currentUser) {
        try {
            await window.saveWeeklyProgress(currentUser.uid, {
                currentWeek: 1,
                completedWeeks: []
            });
        } catch (error) {
            console.error('Error saving progress reset:', error);
        }
    }
}

async function goBackWeek() {
    if (currentWeek > 1) {
        completedWeeks = completedWeeks.filter(w => w < currentWeek - 1);
        currentWeek = currentWeek - 1;
        updateWeeklyStatus();
        renderWeeklyProgram();
        
        // Save to Firebase if user is logged in
        if (currentUser) {
            try {
                await window.saveWeeklyProgress(currentUser.uid, {
                    currentWeek,
                    completedWeeks
                });
            } catch (error) {
                console.error('Error saving progress:', error);
            }
        }
    }
}

async function completeWeek(week) {
    if (!completedWeeks.includes(week)) {
        completedWeeks.push(week);
        currentWeek = week + 1;
        updateWeeklyStatus();
        renderWeeklyProgram();
        
        // Save to Firebase if user is logged in
        if (currentUser) {
            try {
                await window.saveWeeklyProgress(currentUser.uid, {
                    currentWeek,
                    completedWeeks
                });
            } catch (error) {
                console.error('Error saving progress:', error);
            }
        }
    }
}

function updateWeeklyStatus() {
    const completedCount = completedWeeks.length;
    const progress = Math.round((completedCount / 6) * 100);
    const remaining = 6 - completedCount;
    
    document.getElementById('completed-weeks').textContent = `${completedCount}/6`;
    document.getElementById('current-week-display').textContent = `Week ${currentWeek}`;
    document.getElementById('progress-percentage').textContent = `${progress}%`;
    document.getElementById('remaining-weeks').textContent = remaining;
    
    document.getElementById('admin-current-week').textContent = currentWeek;
    document.getElementById('admin-completed-count').textContent = completedCount;
    
    // Update back button visibility
    const backBtn = document.getElementById('back-week-btn');
    if (backBtn) {
        if (currentWeek <= 1) {
            backBtn.style.display = 'none';
        } else {
            backBtn.style.display = 'inline-block';
        }
    }
    
    // Update program description
    const description = document.getElementById('program-description');
    if (description) {
        if (currentWeek > 6) {
            description.innerHTML = '<div style="background-color: #14532d; padding: 1rem; border-radius: 0.5rem;"><h3 style="color: #86efac; font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem;">🎉 Program Complete!</h3><p style="color: #d1d5db;">Congratulations! You\'ve mastered all the core concepts. Continue practicing and refining your skills in ranked games.</p></div>';
        } else {
            description.textContent = 'Each week builds on the previous, starting with fundamental concepts and progressing to advanced team coordination. Complete all exercises before moving to the next week for best results.';
        }
    }
}

function renderWeeklyProgram() {
    const container = document.getElementById('weekly-challenges');
    if (!container) return;
    
    container.innerHTML = '';
    
    weeklyProgram.forEach(week => {
        const status = completedWeeks.includes(week.week) ? 'completed' : 
                      week.week === currentWeek ? 'current' : 'upcoming';
        
        const weekCard = document.createElement('div');
        weekCard.className = `week-card ${status}`;
        
        weekCard.innerHTML = `
            <div class="week-header">
                <div class="week-info">
                    <div class="week-icon ${status}">
                        ${status === 'completed' ? '🏆' : status === 'current' ? '⭐' : '📅'}
                    </div>
                    <div>
                        <h3 class="week-title">Week ${week.week}: ${week.title}</h3>
                        <p class="week-focus">${week.focus}</p>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    ${status === 'current' ? '<span class="status-badge">Current</span>' : ''}
                    ${adminMode && status === 'current' ? 
                        `<button onclick="completeWeek(${week.week})" class="btn btn-primary" style="padding: 0.25rem 0.75rem; font-size: 0.875rem;">Mark Complete</button>` : ''}
                </div>
            </div>
            <ul class="week-exercises">
                ${week.exercises.map(exercise => `
                    <li>
                        <span class="exercise-check ${status === 'completed' ? 'completed' : ''}">✓</span>
                        <span>${exercise}</span>
                    </li>
                `).join('')}
            </ul>
        `;
        
        container.appendChild(weekCard);
    });
}

// Function to update weekly progress from Firebase
window.updateWeeklyProgressFromFirebase = (progress) => {
    currentWeek = progress.currentWeek || 1;
    completedWeeks = progress.completedWeeks || [];
    updateWeeklyStatus();
    renderWeeklyProgram();
};

// Listen for auth state changes
window.addEventListener('load', () => {
    if (window.onAuthStateChanged) {
        window.onAuthStateChanged(window.auth, (user) => {
            currentUser = user;
            if (user) {
                console.log('User authenticated:', user.email);
            }
        });
    }
});

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    showPage('home');
    updateTimer();
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        const dropdown = document.getElementById('user-dropdown-menu');
        const dropdownBtn = event.target.closest('.user-dropdown-btn');
        
        if (!dropdownBtn && !dropdown.contains(event.target)) {
            dropdown.classList.add('hidden');
        }
    });
});

console.log('Main application script loaded');