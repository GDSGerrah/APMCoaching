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
    updateDoc,
    onSnapshot,
    serverTimestamp,
    deleteDoc,
    collection
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
window.onSnapshot = onSnapshot;
window.serverTimestamp = serverTimestamp;
window.deleteDoc = deleteDoc;
window.collection = collection;

// User management functions
window.saveUserData = async (uid, userData, options = {}) => {
    try {
        await setDoc(doc(db, 'users', uid), {
            ...userData,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
        }, options);
        console.log('User data saved successfully');
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

// Draft Room Functions
window.createDraftRoom = async (roomCode, creatorUid, initialData) => {
    try {
        if (!creatorUid) {
            throw new Error('User not authenticated');
        }
        
        const cleanRoomCode = roomCode?.toString().trim().toUpperCase() || 'ROOM' + Date.now();
        
        const draftRoomData = {
            roomCode: cleanRoomCode,
            createdBy: creatorUid,
            createdAt: serverTimestamp(),
            lastUpdated: serverTimestamp(),
            lastUpdatedBy: creatorUid,
            champions: initialData?.champions || [],
            strategy: initialData?.strategy || {},
            participants: [creatorUid]
        };
        
        // Use direct approach without collection
        await setDoc(doc(db, 'draftRooms', cleanRoomCode), draftRoomData);
        
        return draftRoomData;
    } catch (error) {
        console.error('Error creating draft room:', error);
        throw error;
    }
};

window.joinDraftRoom = async (roomCode, userUid) => {
    try {
        const roomRef = doc(db, 'draftRooms', roomCode);
        const roomDoc = await getDoc(roomRef);
        
        if (!roomDoc.exists()) {
            throw new Error('Room not found');
        }
        
        const roomData = roomDoc.data();
        
        if (!roomData.participants.includes(userUid)) {
            await updateDoc(roomRef, {
                participants: [...roomData.participants, userUid],
                lastUpdated: serverTimestamp(),
                lastUpdatedBy: userUid
            });
        }
        
        console.log('Joined draft room:', roomCode);
        return roomData;
    } catch (error) {
        console.error('Error joining draft room:', error);
        throw error;
    }
};

window.updateDraftRoom = async (roomCode, updateData, userUid) => {
    try {
        await updateDoc(doc(db, 'draftRooms', roomCode), {
            ...updateData,
            lastUpdated: serverTimestamp(),
            lastUpdatedBy: userUid
        });
        console.log('Draft room updated:', roomCode);
    } catch (error) {
        console.error('Error updating draft room:', error);
        throw error;
    }
};

window.listenToDraftRoom = (roomCode, callback) => {
    const roomRef = doc(db, 'draftRooms', roomCode);
    
    const unsubscribe = onSnapshot(roomRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data());
        } else {
            console.log('Draft room no longer exists');
            callback(null);
        }
    }, (error) => {
        console.error('Error listening to draft room:', error);
        callback(null);
    });
    
    return unsubscribe;
};

window.deleteDraftRoom = async (roomCode, userUid) => {
    try {
        const roomDoc = await getDoc(doc(db, 'draftRooms', roomCode));
        
        if (!roomDoc.exists()) {
            throw new Error('Room not found');
        }
        
        const roomData = roomDoc.data();
        
        if (roomData.createdBy !== userUid) {
            throw new Error('Only the room creator can delete the room');
        }
        
        await deleteDoc(doc(db, 'draftRooms', roomCode));
        console.log('Draft room deleted:', roomCode);
    } catch (error) {
        console.error('Error deleting draft room:', error);
        throw error;
    }
};

// Exercise tracking functions
window.updateExerciseProgress = async (uid, moduleId, exerciseId, completed) => {
    try {
        const progressRef = doc(db, 'learningProgress', uid);
        const progressDoc = await getDoc(progressRef);
        
        let currentProgress;
        if (progressDoc.exists()) {
            currentProgress = progressDoc.data();
        } else {
            currentProgress = await window.getLearningProgress(uid);
        }
        
        // Update the specific exercise
        currentProgress.modules[moduleId].exercises[exerciseId] = completed;
        
        // Check if all exercises in the module are completed
        const moduleExercises = currentProgress.modules[moduleId].exercises;
        const allCompleted = Object.values(moduleExercises).every(Boolean);
        currentProgress.modules[moduleId].completed = allCompleted;
        
        // Save updated progress
        await setDoc(progressRef, {
            ...currentProgress,
            lastUpdated: serverTimestamp()
        });
        
        console.log('Exercise progress updated:', { moduleId, exerciseId, completed });
        return currentProgress;
    } catch (error) {
        console.error('Error updating exercise progress:', error);
        throw error;
    }
};

// Get user's overall learning statistics
window.getUserLearningStats = async (uid) => {
    try {
        const progress = await window.getLearningProgress(uid);
        
        const stats = {
            totalModules: Object.keys(progress.modules).length,
            completedModules: Object.values(progress.modules).filter(m => m.completed).length,
            totalExercises: 0,
            completedExercises: 0,
            moduleStats: {}
        };
        
        Object.entries(progress.modules).forEach(([moduleId, moduleData]) => {
            const exercises = Object.values(moduleData.exercises);
            const completedCount = exercises.filter(Boolean).length;
            
            stats.totalExercises += exercises.length;
            stats.completedExercises += completedCount;
            
            stats.moduleStats[moduleId] = {
                completed: moduleData.completed,
                exercisesCompleted: completedCount,
                totalExercises: exercises.length,
                progress: exercises.length > 0 ? (completedCount / exercises.length) * 100 : 0
            };
        });
        
        stats.overallProgress = stats.totalExercises > 0 ? (stats.completedExercises / stats.totalExercises) * 100 : 0;
        
        return stats;
    } catch (error) {
        console.error('Error getting user learning stats:', error);
        throw error;
    }
};

// Global flag to prevent multiple initializations
let learningInitialized = false;

// Initialize auth state listener when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Firebase configuration loaded successfully');
    
    // THIS IS NOW THE SINGLE SOURCE OF TRUTH FOR AUTHENTICATION STATE
    onAuthStateChanged(auth, async (user) => {
        const loadingScreen = document.getElementById('loading-screen');
        const authModal = document.getElementById('auth-modal');
        const appContainer = document.getElementById('app-container');
        
        // Update the global currentUser variable in script.js
        if (window.setCurrentUser) {
            window.setCurrentUser(user);
        }
        
        // CRITICAL: Set the global user variable immediately
        window.currentUser = user;

        if (user) {
            // User is signed in
            console.log('User is signed in:', user.email);
            console.log('Setting window.currentUser to:', user.email);
            
            // Try to update last login, but don't fail if document doesn't exist
            try {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    await updateUserData(user.uid, { lastLogin: serverTimestamp() });
                } else {
                    console.log('User document not found, will be created during session load');
                }
            } catch (error) {
                console.log('Could not update last login timestamp:', error.message);
            }
            
            await loadUserSession(user);
            
            // Initialize learning progress if on learning page - ONE TIME ONLY
            if (!learningInitialized && (window.location.pathname.includes('learning.html') || window.location.pathname === '/learning.html' || window.location.href.includes('learning.html'))) {
                learningInitialized = true;
                console.log('🎯 On learning page - initializing learning progress...');
                
                // Wait for all scripts to load
                setTimeout(async () => {
                    if (window.initializeLearningProgress) {
                        console.log('🚀 Calling initializeLearningProgress...');
                        try {
                            await window.initializeLearningProgress();
                        } catch (error) {
                            console.error('❌ Error in learning progress initialization:', error);
                        }
                    } else {
                        console.log('⚠️ initializeLearningProgress not available, retrying...');
                        setTimeout(async () => {
                            if (window.initializeLearningProgress) {
                                try {
                                    await window.initializeLearningProgress();
                                } catch (error) {
                                    console.error('❌ Error in learning progress initialization (retry):', error);
                                }
                            } else {
                                console.error('❌ Learning progress system not available after retries');
                            }
                        }, 2000);
                    }
                }, 1000);
            }
            
            if (authModal) authModal.classList.add('hidden');
            if (appContainer) appContainer.classList.remove('hidden');
            
        } else {
            // User is signed out
            console.log('User is signed out');
            window.currentUser = null;
            learningInitialized = false; // Reset flag
            
            if (appContainer) appContainer.classList.add('hidden');
            if (authModal) authModal.classList.remove('hidden');
        }
        
        if (loadingScreen) loadingScreen.classList.add('hidden');
    });
});

// Load user session data
window.loadUserSession = async (user) => {
    try {
        let userData = await getUserData(user.uid);
        
        // If no user data exists, create it
        if (!userData) {
            console.log('No user data found, creating default user data...');
            const defaultUserData = {
                displayName: user.displayName || user.email.split('@')[0],
                email: user.email,
                photoURL: user.photoURL,
                role: 'Player'
            };
            
            await saveUserData(user.uid, defaultUserData);
            userData = defaultUserData;
        }
        
        const userName = userData?.displayName || user.displayName || user.email.split('@')[0];
        const userAvatar = userData?.photoURL || user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563eb&color=fff`;
        
        const elementsToUpdate = {
            'welcome-name': userName,
            'sidebar-username': userName,
            'sidebar-role': userData?.role || 'Player'
        };
        
        Object.entries(elementsToUpdate).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            } else {
                console.warn(`Element with ID '${id}' not found (this is normal on some pages).`);
            }
        });
        
        const avatarElements = ['user-avatar', 'sidebar-avatar'];
        avatarElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.src = userAvatar;
                element.alt = userName;
            }
        });
        
        const userWelcome = document.getElementById('user-welcome');
        if (userWelcome) userWelcome.classList.remove('hidden');
        
        // Load legacy weekly progress for dashboard
        const progress = await getWeeklyProgress(user.uid);
        if (window.updateWeeklyProgressFromFirebase) {
            window.updateWeeklyProgressFromFirebase(progress);
        }
        
        // Update last login now that document exists
        await updateUserData(user.uid, { lastLogin: serverTimestamp() });
        
    } catch (error) {
        console.error('Error loading user session:', error);
    }
};

console.log('Firebase configuration loaded with complete functionality including learning progress');) {
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
        // Check if document exists first
        const userDoc = await getDoc(doc(db, 'users', uid));
        
        if (userDoc.exists()) {
            await updateDoc(doc(db, 'users', uid), {
                ...updateData,
                lastUpdated: serverTimestamp()
            });
            console.log('User data updated successfully');
        } else {
            // If document doesn't exist, create it instead of updating
            console.log('User document does not exist, creating it...');
            await setDoc(doc(db, 'users', uid), {
                ...updateData,
                lastUpdated: serverTimestamp(),
                createdAt: serverTimestamp()
            });
            console.log('User document created successfully');
        }
    } catch (error) {
        console.error('Error updating user data:', error);
        throw error;
    }
};

// Learning Progress Functions
window.saveLearningProgress = async (uid, progressData) => {
    try {
        await setDoc(doc(db, 'learningProgress', uid), {
            ...progressData,
            lastUpdated: serverTimestamp()
        });
        console.log('Learning progress saved');
    } catch (error) {
        console.error('Error saving learning progress:', error);
        throw error;
    }
};

window.getLearningProgress = async (uid) => {
    try {
        const progressDoc = await getDoc(doc(db, 'learningProgress', uid));
        if (progressDoc.exists()) {
            return progressDoc.data();
        } else {
            // Return default progress structure
            return {
                modules: {
                    tempo: { completed: false, exercises: { 'tempo-1': false, 'tempo-2': false, 'tempo-3': false } },
                    turns: { completed: false, exercises: { 'turns-1': false, 'turns-2': false, 'turns-3': false } },
                    'action-waves': { completed: false, exercises: { 'waves-1': false, 'waves-2': false, 'waves-3': false } },
                    'action-plan': { completed: false, exercises: { 'plan-1': false, 'plan-2': false, 'plan-3': false } },
                    weekly: { completed: false, exercises: { 'weekly-1': false, 'weekly-2': false, 'weekly-3': false } },
                    advanced: { completed: false, exercises: { 'advanced-1': false, 'advanced-2': false, 'advanced-3': false } }
                }
            };
        }
    } catch (error) {
        console.error('Error getting learning progress:', error);
        return {
            modules: {
                tempo: { completed: false, exercises: { 'tempo-1': false, 'tempo-2': false, 'tempo-3': false } },
                turns: { completed: false, exercises: { 'turns-1': false, 'turns-2': false, 'turns-3': false } },
                'action-waves': { completed: false, exercises: { 'waves-1': false, 'waves-2': false, 'waves-3': false } },
                'action-plan': { completed: false, exercises: { 'plan-1': false, 'plan-2': false, 'plan-3': false } },
                weekly: { completed: false, exercises: { 'weekly-1': false, 'weekly-2': false, 'weekly-3': false } },
                advanced: { completed: false, exercises: { 'advanced-1': false, 'advanced-2': false, 'advanced-3': false } }
            }
        };
    }
};

// Weekly progress functions (legacy support)
window.saveWeeklyProgress = async (uid, weekData) => {
    try {
        await setDoc(doc(db, 'weeklyProgress', uid), {
            ...weekData,
            lastUpdated: serverTimestamp()
        });
        console.log('Weekly progress saved');
    } catch (error)