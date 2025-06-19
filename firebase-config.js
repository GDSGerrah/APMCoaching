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
    deleteDoc
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

// User management functions
window.saveUserData = async (uid, userData) => {
    try {
        await setDoc(doc(db, 'users', uid), {
            ...userData,
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
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
            lastUpdated: serverTimestamp()
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
        await setDoc(doc(db, 'weeklyProgress', uid), {
            ...weekData,
            lastUpdated: serverTimestamp()
        });
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

// Complete Draft Room Functions
window.createDraftRoom = async (roomCode, creatorUid, initialData) => {
   try {
       const { collection } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
       
       const cleanRoomCode = roomCode?.toString().trim().toUpperCase() || 'ROOM' + Date.now();
       
       // Fix: Check if creatorUid exists
       if (!creatorUid) {
           throw new Error('User not authenticated');
       }
       
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
       
       const docRef = doc(collection(db, 'draftRooms'), cleanRoomCode);
       await setDoc(docRef, draftRoomData);
       
       return draftRoomData;
   } catch (error) {
       console.error('Error:', error);
       throw error;
   }
};


window.joinDraftRoom = async (roomCode, userUid) => {
    try {
        const roomDoc = await getDoc(doc(db, 'draftRooms', roomCode));
        
        if (!roomDoc.exists()) {
            throw new Error('Room not found');
        }
        
        const roomData = roomDoc.data();
        
        // Add user to participants if not already there
        if (!roomData.participants.includes(userUid)) {
            await updateDoc(doc(db, 'draftRooms', roomCode), {
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
            throw new Error('Only room creator can delete');
        }
        
        await deleteDoc(doc(db, 'draftRooms', roomCode));
        console.log('Draft room deleted:', roomCode);
    } catch (error) {
        console.error('Error deleting draft room:', error);
        throw error;
    }
};

// Initialize auth state listener when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Firebase initialized with complete draft room support');
    
    // Listen for authentication state changes
    onAuthStateChanged(auth, async (user) => {
        const loadingScreen = document.getElementById('loading-screen');
        const authModal = document.getElementById('auth-modal');
        const appContainer = document.getElementById('app-container');
        
        if (user) {
            console.log('User signed in:', user.email);
            
            // Update last login
            try {
                await updateUserData(user.uid, { lastLogin: serverTimestamp() });
            } catch (error) {
                console.log('Could not update last login:', error);
            }
            
            // Load user data and progress
            await loadUserSession(user);
            
            // Hide auth modal and show app
            if (authModal) authModal.classList.add('hidden');
            if (appContainer) appContainer.classList.remove('hidden');
            
        } else {
            console.log('User signed out');
            // Show auth modal
            if (appContainer) appContainer.classList.add('hidden');
            if (authModal) authModal.classList.remove('hidden');
        }
        
        // Hide loading screen
        if (loadingScreen) loadingScreen.classList.add('hidden');
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
        
        // Update main header elements
        const elements = {
            'user-name': userName,
            'welcome-name': userName,
            'sidebar-username': userName,
            'sidebar-role': userData?.role || 'Player'
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
        
        // Update avatar elements
        const avatarElements = ['user-avatar', 'sidebar-avatar'];
        avatarElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.src = userAvatar;
        });
        
        // Show user welcome
        const userWelcome = document.getElementById('user-welcome');
        if (userWelcome) userWelcome.classList.remove('hidden');
        
        // Load weekly progress
        const progress = await getWeeklyProgress(user.uid);
        if (window.updateWeeklyProgressFromFirebase) {
            window.updateWeeklyProgressFromFirebase(progress);
        }
        
    } catch (error) {
        console.error('Error loading user session:', error);
    }
};

console.log('Firebase configuration loaded successfully with complete functionality');