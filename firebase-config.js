// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    getFirestore, 
    doc, 
    setDoc, 
    getDoc,
    updateDoc 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { 
    getAnalytics 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAoS1MSD3nSFN5xUyXbjYHUVk_eplrqFIw",
    authDomain: "apmlolportal.firebaseapp.com",
    projectId: "apmlolportal",
    storageBucket: "apmlolportal.firebasestorage.app",
    messagingSenderId: "282155636225",
    appId: "1:282155636225:web:368a38514d4882ded61200",
    measurementId: "G-XWJ1CP433E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

// Make auth and db available globally
window.auth = auth;
window.db = db;
window.analytics = analytics;
window.googleProvider = googleProvider;

// Authentication functions
window.signInWithEmailAndPassword = signInWithEmailAndPassword;
window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
window.signInWithPopup = signInWithPopup;
window.signOut = signOut;
window.onAuthStateChanged = onAuthStateChanged;
window.updateProfile = updateProfile;

// Firestore functions
window.doc = doc;
window.setDoc = setDoc;
window.getDoc = getDoc;
window.updateDoc = updateDoc;

// User management functions
window.saveUserData = async (uid, userData) => {
    try {
        await setDoc(doc(db, 'users', uid), {
            ...userData,
            createdAt: new Date(),
            lastLogin: new Date()
        });
        console.log('User data saved successfully');
    } catch (error) {
        console.error('Error saving user data:', error);
        throw error;
    }
};

window.getUserData = async (uid) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            console.log('No user data found');
            return null;
        }
    } catch (error) {
        console.error('Error getting user data:', error);
        throw error;
    }
};

window.updateUserData = async (uid, updateData) => {
    try {
        await updateDoc(doc(db, 'users', uid), {
            ...updateData,
            lastUpdated: new Date()
        });
        console.log('User data updated successfully');
    } catch (error) {
        console.error('Error updating user data:', error);
        throw error;
    }
};

// Weekly progress functions
window.saveWeeklyProgress = async (uid, weekData) => {
    try {
        await setDoc(doc(db, 'weeklyProgress', uid), weekData);
        console.log('Weekly progress saved');
    } catch (error) {
        console.error('Error saving weekly progress:', error);
        throw error;
    }
};

window.getWeeklyProgress = async (uid) => {
    try {
        const progressDoc = await getDoc(doc(db, 'weeklyProgress', uid));
        if (progressDoc.exists()) {
            return progressDoc.data();
        } else {
            return { currentWeek: 1, completedWeeks: [] };
        }
    } catch (error) {
        console.error('Error getting weekly progress:', error);
        return { currentWeek: 1, completedWeeks: [] };
    }
};

// Initialize auth state listener when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Firebase initialized with your config');
    
    // Listen for authentication state changes
    onAuthStateChanged(auth, async (user) => {
        const loadingScreen = document.getElementById('loading-screen');
        const authModal = document.getElementById('auth-modal');
        const appContainer = document.getElementById('app-container');
        
        if (user) {
            console.log('User signed in:', user.email);
            
            // Update last login
            try {
                await updateUserData(user.uid, { lastLogin: new Date() });
            } catch (error) {
                console.log('Could not update last login:', error);
            }
            
            // Load user data and progress
            await loadUserSession(user);
            
            // Hide auth modal and show app
            authModal.classList.add('hidden');
            appContainer.classList.remove('hidden');
            
        } else {
            console.log('User signed out');
            // Show auth modal
            appContainer.classList.add('hidden');
            authModal.classList.remove('hidden');
        }
        
        // Hide loading screen
        loadingScreen.classList.add('hidden');
    });
});

// Load user session data
window.loadUserSession = async (user) => {
    try {
        // Get user data from Firestore
        const userData = await getUserData(user.uid);
        
        // Update UI with user info
        const userName = userData?.displayName || user.displayName || user.email.split('@')[0];
        const userAvatar = userData?.photoURL || user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563eb&color=fff`;
        
        document.getElementById('user-name').textContent = userName;
        document.getElementById('user-avatar').src = userAvatar;
        document.getElementById('welcome-name').textContent = userName;
        document.getElementById('user-welcome').classList.remove('hidden');
        
        // Load weekly progress
        const progress = await getWeeklyProgress(user.uid);
        if (window.updateWeeklyProgressFromFirebase) {
            window.updateWeeklyProgressFromFirebase(progress);
        }
        
    } catch (error) {
        console.error('Error loading user session:', error);
    }
};

console.log('Firebase configuration loaded successfully');