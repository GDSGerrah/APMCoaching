// Global state
let currentPage = 'dashboard';
let gameTimer = 0;
let isTimerRunning = false;
let timerInterval = null;
let adminMode = false;
let currentWeek = 1;
let completedWeeks = [];
let currentUser = null;

// Draft room state
let currentDraftRoom = null;
let draftListener = null;
let selectedSlot = null;
let champions = [];
let currentFilter = 'all';

// Central function to update the user state from firebase-config.js
window.setCurrentUser = (user) => {
    currentUser = user;
    if (user) {
        console.log('User state updated in script.js:', user.email);
    } else {
        console.log('User state cleared in script.js');
    }
};


// Complete champion database
const championData = [
    // Top Laners
    {id: 'aatrox', name: 'Aatrox', roles: ['Top']},
    {id: 'akali', name: 'Akali', roles: ['Top', 'Mid']},
    {id: 'ambessa', name: 'Ambessa', roles: ['Top']},
    {id: 'camille', name: 'Camille', roles: ['Top']},
    {id: 'chogath', name: 'Cho\'Gath', roles: ['Top']},
    {id: 'darius', name: 'Darius', roles: ['Top']},
    {id: 'drmundo', name: 'Dr. Mundo', roles: ['Top']},
    {id: 'fiora', name: 'Fiora', roles: ['Top']},
    {id: 'gangplank', name: 'Gangplank', roles: ['Top']},
    {id: 'garen', name: 'Garen', roles: ['Top']},
    {id: 'gnar', name: 'Gnar', roles: ['Top']},
    {id: 'gragas', name: 'Gragas', roles: ['Top', 'Jungle']},
    {id: 'gwen', name: 'Gwen', roles: ['Top']},
    {id: 'illaoi', name: 'Illaoi', roles: ['Top']},
    {id: 'irelia', name: 'Irelia', roles: ['Top', 'Mid']},
    {id: 'jax', name: 'Jax', roles: ['Top']},
    {id: 'jayce', name: 'Jayce', roles: ['Top']},
    {id: 'kayle', name: 'Kayle', roles: ['Top']},
    {id: 'kennen', name: 'Kennen', roles: ['Top']},
    {id: 'kled', name: 'Kled', roles: ['Top']},
    {id: 'malphite', name: 'Malphite', roles: ['Top']},
    {id: 'maokai', name: 'Maokai', roles: ['Top']},
    {id: 'mordekaiser', name: 'Mordekaiser', roles: ['Top']},
    {id: 'nasus', name: 'Nasus', roles: ['Top']},
    {id: 'ornn', name: 'Ornn', roles: ['Top']},
    {id: 'pantheon', name: 'Pantheon', roles: ['Top', 'Mid', 'Support']},
    {id: 'poppy', name: 'Poppy', roles: ['Top']},
    {id: 'renekton', name: 'Renekton', roles: ['Top']},
    {id: 'riven', name: 'Riven', roles: ['Top']},
    {id: 'rumble', name: 'Rumble', roles: ['Top']},
    {id: 'sett', name: 'Sett', roles: ['Top']},
    {id: 'shen', name: 'Shen', roles: ['Top']},
    {id: 'singed', name: 'Singed', roles: ['Top']},
    {id: 'sion', name: 'Sion', roles: ['Top']},
    {id: 'sylas', name: 'Sylas', roles: ['Mid', 'Top']},
    {id: 'teemo', name: 'Teemo', roles: ['Top']},
    {id: 'trundle', name: 'Trundle', roles: ['Top']},
    {id: 'tryndamere', name: 'Tryndamere', roles: ['Top']},
    {id: 'urgot', name: 'Urgot', roles: ['Top']},
    {id: 'vladimir', name: 'Vladimir', roles: ['Top', 'Mid']},
    {id: 'volibear', name: 'Volibear', roles: ['Top', 'Jungle']},
    {id: 'warwick', name: 'Warwick', roles: ['Top', 'Jungle']},
    {id: 'yorick', name: 'Yorick', roles: ['Top']},

    // Junglers
    {id: 'amumu', name: 'Amumu', roles: ['Jungle']},
    {id: 'belveth', name: 'Bel\'Veth', roles: ['Jungle']},
    {id: 'briar', name: 'Briar', roles: ['Jungle']},
    {id: 'diana', name: 'Diana', roles: ['Jungle', 'Mid']},
    {id: 'ekko', name: 'Ekko', roles: ['Jungle', 'Mid']},
    {id: 'elise', name: 'Elise', roles: ['Jungle']},
    {id: 'evelynn', name: 'Evelynn', roles: ['Jungle']},
    {id: 'fiddlesticks', name: 'Fiddlesticks', roles: ['Jungle']},
    {id: 'graves', name: 'Graves', roles: ['Jungle']},
    {id: 'hecarim', name: 'Hecarim', roles: ['Jungle']},
    {id: 'ivern', name: 'Ivern', roles: ['Jungle']},
    {id: 'jarvaniv', name: 'Jarvan IV', roles: ['Jungle']},
    {id: 'karthus', name: 'Karthus', roles: ['Jungle']},
    {id: 'kayn', name: 'Kayn', roles: ['Jungle']},
    {id: 'khazix', name: 'Kha\'Zix', roles: ['Jungle']},
    {id: 'kindred', name: 'Kindred', roles: ['Jungle']},
    {id: 'leesin', name: 'Lee Sin', roles: ['Jungle']},
    {id: 'lillia', name: 'Lillia', roles: ['Jungle']},
    {id: 'masteryi', name: 'Master Yi', roles: ['Jungle']},
    {id: 'nidalee', name: 'Nidalee', roles: ['Jungle']},
    {id: 'nocturne', name: 'Nocturne', roles: ['Jungle']},
    {id: 'nunu', name: 'Nunu & Willump', roles: ['Jungle']},
    {id: 'olaf', name: 'Olaf', roles: ['Jungle', 'Top']},
    {id: 'rammus', name: 'Rammus', roles: ['Jungle']},
    {id: 'reksai', name: 'Rek\'Sai', roles: ['Jungle']},
    {id: 'rengar', name: 'Rengar', roles: ['Jungle', 'Top']},
    {id: 'sejuani', name: 'Sejuani', roles: ['Jungle']},
    {id: 'shaco', name: 'Shaco', roles: ['Jungle']},
    {id: 'shyvana', name: 'Shyvana', roles: ['Jungle']},
    {id: 'skarner', name: 'Skarner', roles: ['Jungle']},
    {id: 'taliyah', name: 'Taliyah', roles: ['Jungle', 'Mid']},
    {id: 'udyr', name: 'Udyr', roles: ['Jungle']},
    {id: 'viego', name: 'Viego', roles: ['Jungle']},
    {id: 'vi', name: 'Vi', roles: ['Jungle']},
    {id: 'wukong', name: 'Wukong', roles: ['Jungle', 'Top']},
    {id: 'xinzhao', name: 'Xin Zhao', roles: ['Jungle']},
    {id: 'zac', name: 'Zac', roles: ['Jungle']},

    // Mid Laners
    {id: 'ahri', name: 'Ahri', roles: ['Mid']},
    {id: 'anivia', name: 'Anivia', roles: ['Mid']},
    {id: 'annie', name: 'Annie', roles: ['Mid']},
    {id: 'aurelionsol', name: 'Aurelion Sol', roles: ['Mid']},
    {id: 'aurora', name: 'Aurora', roles: ['Mid']},
    {id: 'azir', name: 'Azir', roles: ['Mid']},
    {id: 'brand', name: 'Brand', roles: ['Mid', 'Support']},
    {id: 'cassiopeia', name: 'Cassiopeia', roles: ['Mid']},
    {id: 'corki', name: 'Corki', roles: ['Mid']},
    {id: 'fizz', name: 'Fizz', roles: ['Mid']},
    {id: 'galio', name: 'Galio', roles: ['Mid']},
    {id: 'heimerdinger', name: 'Heimerdinger', roles: ['Mid']},
    {id: 'hwei', name: 'Hwei', roles: ['Mid']},
    {id: 'kassadin', name: 'Kassadin', roles: ['Mid']},
    {id: 'katarina', name: 'Katarina', roles: ['Mid']},
    {id: 'leblanc', name: 'LeBlanc', roles: ['Mid']},
    {id: 'lissandra', name: 'Lissandra', roles: ['Mid']},
    {id: 'lux', name: 'Lux', roles: ['Mid', 'Support']},
    {id: 'malzahar', name: 'Malzahar', roles: ['Mid']},
    {id: 'morgana', name: 'Morgana', roles: ['Mid', 'Support']},
    {id: 'neeko', name: 'Neeko', roles: ['Mid']},
    {id: 'orianna', name: 'Orianna', roles: ['Mid']},
    {id: 'qiyana', name: 'Qiyana', roles: ['Mid']},
    {id: 'ryze', name: 'Ryze', roles: ['Mid']},
    {id: 'swain', name: 'Swain', roles: ['Mid', 'Support']},
    {id: 'syndra', name: 'Syndra', roles: ['Mid']},
    {id: 'twistedfate', name: 'Twisted Fate', roles: ['Mid']},
    {id: 'veigar', name: 'Veigar', roles: ['Mid']},
    {id: 'velkoz', name: 'Vel\'Koz', roles: ['Mid', 'Support']},
    {id: 'viktor', name: 'Viktor', roles: ['Mid']},
    {id: 'xerath', name: 'Xerath', roles: ['Mid', 'Support']},
    {id: 'yasuo', name: 'Yasuo', roles: ['Mid']},
    {id: 'yone', name: 'Yone', roles: ['Mid']},
    {id: 'zed', name: 'Zed', roles: ['Mid']},
    {id: 'ziggs', name: 'Ziggs', roles: ['Mid']},
    {id: 'zilean', name: 'Zilean', roles: ['Mid', 'Support']},
    {id: 'zoe', name: 'Zoe', roles: ['Mid']},

    // ADCs
    {id: 'aphelios', name: 'Aphelios', roles: ['ADC']},
    {id: 'ashe', name: 'Ashe', roles: ['ADC']},
    {id: 'caitlyn', name: 'Caitlyn', roles: ['ADC']},
    {id: 'draven', name: 'Draven', roles: ['ADC']},
    {id: 'ezreal', name: 'Ezreal', roles: ['ADC']},
    {id: 'jhin', name: 'Jhin', roles: ['ADC']},
    {id: 'jinx', name: 'Jinx', roles: ['ADC']},
    {id: 'kaisa', name: 'Kai\'Sa', roles: ['ADC']},
    {id: 'kalista', name: 'Kalista', roles: ['ADC']},
    {id: 'kogmaw', name: 'Kog\'Maw', roles: ['ADC']},
    {id: 'lucian', name: 'Lucian', roles: ['ADC']},
    {id: 'missfortune', name: 'Miss Fortune', roles: ['ADC']},
    {id: 'nilah', name: 'Nilah', roles: ['ADC']},
    {id: 'samira', name: 'Samira', roles: ['ADC']},
    {id: 'senna', name: 'Senna', roles: ['ADC', 'Support']},
    {id: 'sivir', name: 'Sivir', roles: ['ADC']},
    {id: 'smolder', name: 'Smolder', roles: ['ADC']},
    {id: 'tristana', name: 'Tristana', roles: ['ADC']},
    {id: 'twitch', name: 'Twitch', roles: ['ADC']},
    {id: 'varus', name: 'Varus', roles: ['ADC']},
    {id: 'vayne', name: 'Vayne', roles: ['ADC']},
    {id: 'xayah', name: 'Xayah', roles: ['ADC']},
    {id: 'zeri', name: 'Zeri', roles: ['ADC']},

    // Supports
    {id: 'alistar', name: 'Alistar', roles: ['Support']},
    {id: 'bard', name: 'Bard', roles: ['Support']},
    {id: 'blitzcrank', name: 'Blitzcrank', roles: ['Support']},
    {id: 'braum', name: 'Braum', roles: ['Support']},
    {id: 'janna', name: 'Janna', roles: ['Support']},
    {id: 'karma', name: 'Karma', roles: ['Support']},
    {id: 'leona', name: 'Leona', roles: ['Support']},
    {id: 'lulu', name: 'Lulu', roles: ['Support']},
    {id: 'milio', name: 'Milio', roles: ['Support']},
    {id: 'nami', name: 'Nami', roles: ['Support']},
    {id: 'nautilus', name: 'Nautilus', roles: ['Support']},
    {id: 'pyke', name: 'Pyke', roles: ['Support']},
    {id: 'rakan', name: 'Rakan', roles: ['Support']},
    {id: 'rell', name: 'Rell', roles: ['Support']},
    {id: 'renata', name: 'Renata Glasc', roles: ['Support']},
    {id: 'seraphine', name: 'Seraphine', roles: ['Support']},
    {id: 'sona', name: 'Sona', roles: ['Support']},
    {id: 'soraka', name: 'Soraka', roles: ['Support']},
    {id: 'tahmkench', name: 'Tahm Kench', roles: ['Support', 'Top']},
    {id: 'taric', name: 'Taric', roles: ['Support']},
    {id: 'thresh', name: 'Thresh', roles: ['Support']},
    {id: 'yuumi', name: 'Yuumi', roles: ['Support']},
    {id: 'zyra', name: 'Zyra', roles: ['Support']}
];


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
        
        await window.updateProfile(user, { displayName: name });
        
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
        
        await window.saveUserData(user.uid, {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            provider: 'google'
        }, { merge: true }); // Use merge to not overwrite existing data like role
        
        console.log('Google sign-in successful:', user.email);
    } catch (error) {
        console.error('Google sign-in error:', error);
        alert(getErrorMessage(error.code));
    }
}

async function handleLogout() {
    try {
        await window.signOut(window.auth);
        
        // Clean up draft room
        if (draftListener) {
            draftListener();
            draftListener = null;
        }
        currentDraftRoom = null;
        
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
    if (dropdown) {
        dropdown.classList.toggle('hidden');
    }
}

function showProfile() {
    alert('Profile page coming soon!');
    if (toggleUserDropdown) toggleUserDropdown();
}

// Page navigation
function showPage(page) {
    // Update sidebar navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const navItem = document.querySelector(`[data-page="${page}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }

    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    
    // Show selected page
    const pageElement = document.getElementById(page + '-page');
    if (pageElement) {
        pageElement.classList.remove('hidden');
    }
    
    // Update breadcrumb
    const pageName = document.getElementById('current-page-name');
    if (pageName) {
        pageName.textContent = getPageTitle(page);
    }
    
    currentPage = page;
    
    // Initialize page-specific content
    if (page === 'weekly') {
        renderWeeklyProgram();
        updateWeeklyStatus();
    } else if (page === 'draft') {
        initializeDraftTool();
    }
    
    // Close sidebar on mobile and close user dropdown
    if (window.innerWidth <= 1024) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('open');
    }
    
    const dropdown = document.getElementById('user-dropdown-menu');
    if (dropdown) dropdown.classList.add('hidden');
}

// Page title helper
function getPageTitle(page) {
    const titles = {
        'dashboard': 'Dashboard',
        'tempo': 'Tempo',
        'turns': 'Turns & Rounds',
        'action-waves': 'Action Waves',
        'action-plan': '5-Step Action Plan',
        'weekly': 'Weekly Focus',
        'draft': 'Draft Tool',
        'calculator': 'Wave Calculator'
    };
    return titles[page] || page.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Sidebar functions
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

function showNotifications() {
    alert('No new notifications');
}

// Quick action functions
function createQuickDraft() {
    showPage('draft');
    setTimeout(() => {
        // Corrected to call the renamed function
        handleCreateDraftRoomClick();
    }, 100);
}

function startQuickTimer() {
    showPage('calculator');
    setTimeout(() => {
        if (!isTimerRunning) {
            toggleTimer();
        }
    }, 100);
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
    
    const results = document.getElementById('calc-results');
    if (results) {
        results.classList.remove('hidden');
        document.getElementById('execute-wave').textContent = `Wave ${executeWave}`;
        document.getElementById('execute-time').textContent = formatTime(executeTime);
        document.getElementById('setup-waves').textContent = `Waves ${setupWaves.join(' & ')}`;
    }
}

// Timer functions
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateTimer() {
    const display = document.getElementById('timer-display');
    const waveDisplay = document.getElementById('current-wave');
    
    if (display) display.textContent = formatTime(gameTimer);
    if (waveDisplay) {
        const currentWave = Math.max(1, Math.floor((gameTimer - 90) / 30) + 1);
        waveDisplay.textContent = currentWave;
    }
}

function toggleTimer() {
    const btn = document.getElementById('timer-btn');
    
    if (isTimerRunning) {
        clearInterval(timerInterval);
        if (btn) {
            btn.textContent = 'Start';
            btn.className = 'btn btn-success';
        }
        isTimerRunning = false;
    } else {
        timerInterval = setInterval(() => {
            gameTimer++;
            updateTimer();
        }, 1000);
        if (btn) {
            btn.textContent = 'Pause';
            btn.className = 'btn btn-danger';
        }
        isTimerRunning = true;
    }
}

function resetTimer() {
    clearInterval(timerInterval);
    gameTimer = 0;
    isTimerRunning = false;
    updateTimer();
    const btn = document.getElementById('timer-btn');
    if (btn) {
        btn.textContent = 'Start';
        btn.className = 'btn btn-success';
    }
}

// Draft Tool Functions
function initializeDraftTool() {
    champions = championData.map(champ => ({
        ...champ,
         imageUrl: `/APMCoaching/COACHING/images/${champ.id}_0.jpg`,
        banned: false,
        picked: false,
        team: null
    }));
    
    renderChampions();
    updateChampionCount();
    setupStrategyListeners();
}

function renderChampions() {
    const grid = document.getElementById('champion-grid');
    if (!grid) return;
    
    const search = document.getElementById('champion-search')?.value.toLowerCase() || '';
    
    let filteredChampions = champions.filter(champ => {
        const matchesSearch = champ.name.toLowerCase().includes(search);
        const matchesRole = currentFilter === 'all' || champ.roles.includes(currentFilter);
        return matchesSearch && matchesRole;
    });

    grid.innerHTML = filteredChampions.map(champ => `
        <div class="champion-card ${champ.banned ? 'banned' : ''} ${champ.picked ? 'picked' : ''}" 
             onclick="selectChampion('${champ.id}')"
             title="${champ.name} (${champ.roles.join(', ')})">
            <img src="${champ.imageUrl}" 
                 alt="${champ.name}" 
                 onerror="this.parentElement.innerHTML = '<div class=\'champion-card-fallback\'>${champ.name.substring(0,3)}</div>'">
            <div class="champion-name">${champ.name}</div>
        </div>
    `).join('');
}

function updateChampionCount() {
    const search = document.getElementById('champion-search')?.value.toLowerCase() || '';
    let filteredChampions = champions.filter(champ => {
        const matchesSearch = champ.name.toLowerCase().includes(search);
        const matchesRole = currentFilter === 'all' || champ.roles.includes(currentFilter);
        return matchesSearch && matchesRole;
    });
    
    const countElement = document.getElementById('champion-count');
    if (countElement) {
        countElement.textContent = `${filteredChampions.length} champions available`;
    }
}

function filterByRole(role) {
    currentFilter = role;
    document.querySelectorAll('.role-filter').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderChampions();
    updateChampionCount();
}

function filterChampions() {
    renderChampions();
    updateChampionCount();
}

function selectSlot(slot) {
    document.querySelectorAll('.champion-slot, .ban-slot').forEach(s => s.classList.remove('selected'));
    slot.classList.add('selected');
    selectedSlot = slot;
}

function selectChampion(championId) {
    if (!selectedSlot) {
        alert('Please select a slot first by clicking on a pick or ban slot');
        return;
    }

    const champion = champions.find(c => c.id === championId);
    if (!champion) return;

    const team = selectedSlot.dataset.team;
    const slot = selectedSlot.dataset.slot;
    const type = selectedSlot.dataset.type;

    if (type === 'ban') {
        if (champion.banned) {
            alert('This champion is already banned!');
            return;
        }
        champion.banned = true;
        selectedSlot.innerHTML = `<img src="${champion.imageUrl}" alt="${champion.name}">`;
        selectedSlot.classList.add('filled');
        
    } else if (type === 'pick') {
        if (champion.banned) {
            alert('This champion is banned!');
            return;
        }
        if (champion.picked) {
            alert('This champion is already picked!');
            return;
        }
        champion.picked = true;
        champion.team = team;
        selectedSlot.innerHTML = `<img src="${champion.imageUrl}" alt="${champion.name}">`;
        selectedSlot.classList.add('filled');
    }

    selectedSlot.classList.remove('selected');
    selectedSlot = null;
    renderChampions();
    updateDraftInFirebase();
}

function clearSlot(slot) {
    event.preventDefault(); // Prevent context menu
    if (!slot.classList.contains('filled')) return;
    
    const img = slot.querySelector('img');
    if (img && img.alt) {
        const championName = img.alt;
        const champion = champions.find(c => c.name === championName);
        if (champion) {
            const type = slot.dataset.type;
            if (type === 'ban') {
                champion.banned = false;
            } else {
                champion.picked = false;
                champion.team = null;
            }
        }
    }
    
    slot.classList.remove('filled');
    const slotNum = parseInt(slot.dataset.slot) + 1;
    if (slot.dataset.type === 'pick') {
        slot.innerHTML = `<span>Pick ${slotNum}</span>`;
    } else {
        slot.innerHTML = `B${slotNum}`;
    }
    
    renderChampions();
    updateDraftInFirebase();
}

function switchStrategyTab(tabName) {
    document.querySelectorAll('.strategy-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.strategy-content').forEach(content => content.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tabName + '-strategy').classList.add('active');
}

function resetDraft() {
    champions.forEach(champ => {
        champ.banned = false;
        champ.picked = false;
        champ.team = null;
    });
    
    document.querySelectorAll('.champion-slot, .ban-slot').forEach(slot => {
        slot.classList.remove('filled');
        const slotNum = parseInt(slot.dataset.slot) + 1;
        if (slot.dataset.type === 'pick') {
            slot.innerHTML = `<span>Pick ${slotNum}</span>`;
        } else {
            slot.innerHTML = `B${slotNum}`;
        }
    });
    
    renderChampions();
    updateDraftInFirebase();
}

function clearAll() {
    if (confirm('Are you sure you want to clear the entire draft board?')) {
        resetDraft();
        
        document.querySelectorAll('.strategy-input').forEach(input => {
            input.value = '';
        });
        
        updateDraftInFirebase();
    }
}

// ======================= FIX WAS APPLIED HERE =======================
// The function createDraftRoom() was renamed to handleCreateDraftRoomClick()
// to avoid a name conflict with a function in firebase-config.js.
// ====================================================================
function handleCreateDraftRoomClick() {
    if (!currentUser) {
        alert('Please sign in to create a draft room.');
        return;
    }
    
    if (!champions || champions.length === 0) {
        initializeDraftTool();
    }
    
    const roomCode = generateRoomCode();
    
    if (!roomCode || typeof roomCode !== 'string' || roomCode.trim() === '') {
        console.error('Failed to generate valid room code:', roomCode);
        alert('Failed to generate room code. Please try again.');
        return;
    }
    
    const cleanRoomCode = roomCode.trim().toUpperCase();
    currentDraftRoom = cleanRoomCode;
    initializeDraftRoom(cleanRoomCode);
    updateDraftRoomUI(cleanRoomCode, true);
}

function handleJoinDraftRoomClick() { 
    if (!currentUser) {
        alert('Please sign in to join a draft room.');
        return;
    }
    
    const roomCode = prompt('Enter room code:');
    if (roomCode && roomCode.trim()) {
        currentDraftRoom = roomCode.trim().toUpperCase();
        joinExistingDraftRoom(currentDraftRoom);
    }
}

function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

async function initializeDraftRoom(roomCode) {
    try {
        console.log('Initializing draft room:', roomCode);
        const draftData = {
            champions: [],
            strategy: {
                winCondition: '',
                enemyWeakness: '',
                drakePlan: '',
                heraldPlan: '',
                customTime: '',
                customPlan: '',
                draftNotes: '',
                banNotes: ''
            }
        };
        await window.createDraftRoom(roomCode, currentUser.uid, draftData);
        setupDraftListener(roomCode);
    } catch (error) {
        console.error('Error creating draft room:', error);
        alert('Failed to create draft room: ' + error.message);
    }
}

async function joinExistingDraftRoom(roomCode) {
    try {
        const roomData = await window.joinDraftRoom(roomCode, currentUser.uid);
        if (roomData) {
            loadDraftData(roomData);
            setupDraftListener(roomCode);
            updateDraftRoomUI(roomCode, false);
        }
    } catch (error) {
        console.error('Error joining draft room:', error);
        alert('Room not found or could not be joined.');
    }
}

function setupDraftListener(roomCode) {
    if (draftListener) {
        draftListener();
    }
    draftListener = window.listenToDraftRoom(roomCode, (roomData) => {
        if (roomData) {
            loadDraftData(roomData);
        }
    });
}

function loadDraftData(roomData) {
    if (roomData.champions) {
        champions.forEach(champ => {
            champ.banned = false;
            champ.picked = false;
            champ.team = null;
        });
        
        roomData.champions.forEach(savedChamp => {
            const champ = champions.find(c => c.id === savedChamp.id);
            if (champ) {
                champ.banned = savedChamp.banned;
                champ.picked = savedChamp.picked;
                champ.team = savedChamp.team;
            }
        });
    }
    
    updateSlotsFromChampions();
    
    if (roomData.strategy) {
        const strategy = roomData.strategy;
        const inputs = {
            'win-condition': strategy.winCondition,
            'enemy-weakness': strategy.enemyWeakness,
            'drake-plan': strategy.drakePlan,
            'herald-plan': strategy.heraldPlan,
            'custom-time': strategy.customTime,
            'custom-plan': strategy.customPlan,
            'draft-notes': strategy.draftNotes,
            'ban-notes': strategy.banNotes
        };
        
        Object.entries(inputs).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element && element.value !== value) {
                element.value = value || '';
            }
        });
    }
    
    renderChampions();
}

function updateSlotsFromChampions() {
    document.querySelectorAll('.champion-slot, .ban-slot').forEach(slot => {
        slot.classList.remove('filled');
        const slotNum = parseInt(slot.dataset.slot) + 1;
        if (slot.dataset.type === 'pick') {
            slot.innerHTML = `<span>Pick ${slotNum}</span>`;
        } else {
            slot.innerHTML = `B${slotNum}`;
        }
    });
    
    const picks = { blue: [], red: [] };
    const bans = { blue: [], red: [] };

    champions.forEach(champ => {
        if (champ.picked && champ.team) picks[champ.team].push(champ);
        if (champ.banned) bans.blue.push(champ); // Simplified
    });

    ['blue', 'red'].forEach(team => {
        picks[team].forEach((champ, index) => {
            const slot = document.querySelector(`.champion-slot[data-team="${team}"][data-slot="${index}"]`);
            if(slot) {
                slot.innerHTML = `<img src="${champ.imageUrl}" alt="${champ.name}">`;
                slot.classList.add('filled');
            }
        });
        bans[team].forEach((champ, index) => {
             const slot = document.querySelector(`.ban-slot[data-team="${team}"][data-slot="${index}"]`);
             if(slot) {
                slot.innerHTML = `<img src="${champ.imageUrl}" alt="${champ.name}">`;
                slot.classList.add('filled');
            }
        });
    });
}

async function updateDraftInFirebase() {
    if (!currentDraftRoom || !currentUser) return;
    
    try {
        const strategy = {
            winCondition: document.getElementById('win-condition')?.value || '',
            enemyWeakness: document.getElementById('enemy-weakness')?.value || '',
            drakePlan: document.getElementById('drake-plan')?.value || '',
            heraldPlan: document.getElementById('herald-plan')?.value || '',
            customTime: document.getElementById('custom-time')?.value || '',
            customPlan: document.getElementById('custom-plan')?.value || '',
            draftNotes: document.getElementById('draft-notes')?.value || '',
            banNotes: document.getElementById('ban-notes')?.value || ''
        };
        
        await window.updateDraftRoom(currentDraftRoom, {
            champions: champions.filter(c => c.banned || c.picked).map(c => ({
                id: c.id,
                banned: c.banned,
                picked: c.picked,
                team: c.team
            })),
            strategy: strategy
        }, currentUser.uid);
        
    } catch (error) {
        console.error('Error updating draft:', error);
    }
}

function setupStrategyListeners() {
    const strategyInputs = [
        'win-condition', 'enemy-weakness', 'drake-plan', 
        'herald-plan', 'custom-time', 'custom-plan', 
        'draft-notes', 'ban-notes'
    ];
    
    strategyInputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', () => {
                clearTimeout(element.updateTimeout);
                element.updateTimeout = setTimeout(() => {
                    updateDraftInFirebase();
                }, 500);
            });
        }
    });
}

function updateDraftRoomUI(roomCode, isCreator) {
    const roomInfo = document.getElementById('room-info');
    const roomCodeElement = document.getElementById('room-code');
    const connectionText = document.getElementById('connection-text');
    const connectionStatus = document.getElementById('connection-status');
    
    if (roomCode) {
        if (roomInfo) roomInfo.classList.remove('hidden');
        if (roomCodeElement) roomCodeElement.textContent = roomCode;
        if (connectionText) connectionText.textContent = isCreator ? 'Connected - You are the host' : 'Connected - Joined room';
        if (connectionStatus) connectionStatus.classList.remove('disconnected');
    } else {
        if (roomInfo) roomInfo.classList.add('hidden');
        if (connectionText) connectionText.textContent = 'Not connected';
        if (connectionStatus) connectionStatus.classList.add('disconnected');
    }
}

// Weekly program functions
function toggleAdmin() {
    adminMode = !adminMode;
    const panel = document.getElementById('admin-panel');
    const indicator = document.getElementById('admin-indicator');
    const toggle = document.getElementById('admin-toggle');
    
    if (panel && indicator && toggle) {
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
    }
    
    renderWeeklyProgram();
}

async function resetProgram() {
    currentWeek = 1;
    completedWeeks = [];
    updateWeeklyStatus();
    renderWeeklyProgram();
    
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
    
    const elements = {
        'completed-weeks': `${completedCount}/6`,
        'current-week-display': `Week ${currentWeek > 6 ? 'Done' : currentWeek}`,
        'progress-percentage': `${progress}%`,
        'remaining-weeks': remaining,
        'admin-current-week': currentWeek,
        'admin-completed-count': completedCount
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    });
    
    const backBtn = document.getElementById('back-week-btn');
    if (backBtn) {
        backBtn.style.display = currentWeek <= 1 ? 'none' : 'inline-block';
    }
    
    const description = document.getElementById('program-description');
    if (description) {
        if (currentWeek > 6) {
            description.innerHTML = '<div style="background-color: #14532d; padding: 1rem; border-radius: 0.5rem;"><h3 style="color: #86efac; font-size: 1.25rem; font-weight: bold; margin-bottom: 0.5rem;">🎉 Program Complete!</h3><p style="color: #d1d5db;">Congratulations! You\'ve mastered all the core concepts.</p></div>';
        } else {
            description.textContent = 'Each week builds on the previous...';
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
                    ${adminMode && status === 'current' && week.week <= 6 ? 
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

window.updateWeeklyProgressFromFirebase = (progress) => {
    currentWeek = progress.currentWeek || 1;
    completedWeeks = progress.completedWeeks || [];
    updateWeeklyStatus();
    renderWeeklyProgram();
};

document.addEventListener('DOMContentLoaded', function() {
    showPage('dashboard');
    updateTimer();
    
    document.addEventListener('click', (event) => {
        const dropdown = document.getElementById('user-dropdown-menu');
        const dropdownBtn = event.target.closest('.user-dropdown-btn');
        
        if (dropdown && !dropdownBtn && !dropdown.contains(event.target)) {
            dropdown.classList.add('hidden');
        }
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) sidebar.classList.remove('open');
        }
    });
});

console.log('Complete APM Portal script loaded successfully');