// Learning Progress System - FIXED VERSION
console.log('🚀 Loading learning progress system...');

let learningProgress = {
    modules: {
        tempo: { completed: false, exercises: { 'tempo-1': false, 'tempo-2': false, 'tempo-3': false } },
        turns: { completed: false, exercises: { 'turns-1': false, 'turns-2': false, 'turns-3': false } },
        'action-waves': { completed: false, exercises: { 'waves-1': false, 'waves-2': false, 'waves-3': false } },
        'action-plan': { completed: false, exercises: { 'plan-1': false, 'plan-2': false, 'plan-3': false } },
        weekly: { completed: false, exercises: { 'weekly-1': false, 'weekly-2': false, 'weekly-3': false } },
        advanced: { completed: false, exercises: { 'advanced-1': false, 'advanced-2': false, 'advanced-3': false } }
    }
};

// Module definitions with exercises
const moduleDefinitions = {
    tempo: {
        id: 'tempo',
        title: 'Tempo Fundamentals',
        description: 'Learn to control game pacing and initiative',
        icon: '⚡',
        duration: '15 min read',
        difficulty: 'Beginner',
        exercises: [
            {
                id: 'tempo-1',
                title: 'Tempo Recognition',
                objective: 'Identify 3 tempo shifts in a single game',
                instructions: 'Play a ranked game and note the exact time stamps when tempo shifts occur. Write down what caused each shift and which team gained advantage.',
                requirements: [
                    'Identify 3 different tempo shifts',
                    'Note the exact time stamps',
                    'Explain what caused each shift'
                ]
            },
            {
                id: 'tempo-2',
                title: 'One-for-One Practice',
                objective: 'Successfully apply the "one action for one action" rule',
                instructions: 'In your next 3 games, every time you get a kill or force a recall, immediately use that tempo for exactly one meaningful action.',
                requirements: [
                    'Apply the rule 5 times across 3 games',
                    'Document each application',
                    'No tempo waste (staying for extra actions)'
                ]
            },
            {
                id: 'tempo-3',
                title: 'Proactive Tempo Creation',
                objective: 'Create tempo advantages through proactive play',
                instructions: 'In 2 games, create tempo by roaming, invading, or setting up objectives without waiting for kills first.',
                requirements: [
                    'Create 3 proactive tempo plays',
                    'Lead to successful team advantages',
                    'Document the setup and execution'
                ]
            }
        ]
    },
    turns: {
        id: 'turns',
        title: 'Turns & Rounds',
        description: 'Master lane priority and timing windows',
        icon: '🎯',
        duration: '20 min read',
        difficulty: 'Beginner',
        exercises: [
            {
                id: 'turns-1',
                title: 'Priority Recognition',
                objective: 'Identify when you have lane priority and act on it',
                instructions: 'In 3 games, call out every time you gain priority and immediately use it for one meaningful action.',
                requirements: [
                    'Identify priority windows 10 times',
                    'Use priority for roaming or objective setup',
                    'Track success rate of priority usage'
                ]
            },
            {
                id: 'turns-2',
                title: 'Turn Optimization',
                objective: 'Maximize value from each turn',
                instructions: 'Focus on getting maximum value from every turn you have between waves.',
                requirements: [
                    'Plan your turn usage before each wave',
                    'Execute 5 high-value turns per game',
                    'Document turn outcomes'
                ]
            },
            {
                id: 'turns-3',
                title: 'Round Management',
                objective: 'Coordinate multiple turns within a single round',
                instructions: 'Plan and execute coordinated sequences of turns from base to base.',
                requirements: [
                    'Plan 3 complete rounds',
                    'Execute turn sequences successfully',
                    'Show improvement in round efficiency'
                ]
            }
        ]
    },
    'action-waves': {
        id: 'action-waves',
        title: 'Action Waves',
        description: 'Coordinate team plays with minion waves',
        icon: '📊',
        duration: '25 min read',
        difficulty: 'Intermediate',
        exercises: [
            {
                id: 'waves-1',
                title: 'Wave Calculation',
                objective: 'Calculate action waves for objectives accurately',
                instructions: 'Use the action wave formula to plan 5 different objectives across multiple games.',
                requirements: [
                    'Calculate waves for 5 objectives',
                    'Execute on calculated timing',
                    'Achieve 80% accuracy in timing'
                ]
            },
            {
                id: 'waves-2',
                title: 'Team Synchronization',
                objective: 'Coordinate team movement using action waves',
                instructions: 'Lead your team using action wave callouts for dragon and herald plays.',
                requirements: [
                    'Lead 3 action wave plays',
                    'Get team buy-in on timing',
                    'Execute with proper coordination'
                ]
            },
            {
                id: 'waves-3',
                title: 'Multi-Lane Coordination',
                objective: 'Sync action waves across multiple lanes',
                instructions: 'Coordinate different lane speeds and action wave timings for complex plays.',
                requirements: [
                    'Coordinate bot and mid lane waves',
                    'Account for different lane speeds',
                    'Execute 2 successful multi-lane plays'
                ]
            }
        ]
    },
    'action-plan': {
        id: 'action-plan',
        title: '5-Step Action Plan',
        description: 'Systematic approach to team coordination',
        icon: '✅',
        duration: '30 min read',
        difficulty: 'Intermediate',
        exercises: [
            {
                id: 'plan-1',
                title: 'Step Implementation',
                objective: 'Execute all 5 steps for a single objective',
                instructions: 'Use the complete 5-step process for one dragon or herald attempt.',
                requirements: [
                    'Complete all 5 steps in order',
                    'Document each step execution',
                    'Achieve successful objective control'
                ]
            },
            {
                id: 'plan-2',
                title: 'Multiple Objectives',
                objective: 'Apply the 5-step plan to 3 different objectives',
                instructions: 'Use the systematic approach for dragon, herald, and baron plays.',
                requirements: [
                    'Execute 5-step plan 3 times',
                    'Adapt timing for different objectives',
                    'Maintain team coordination'
                ]
            },
            {
                id: 'plan-3',
                title: 'Advanced Coordination',
                objective: 'Lead team through complex multi-objective sequences',
                instructions: 'Chain multiple objectives using the 5-step approach.',
                requirements: [
                    'Plan 2-objective sequences',
                    'Maintain team coordination throughout',
                    'Execute with minimal time waste'
                ]
            }
        ]
    },
    weekly: {
        id: 'weekly',
        title: 'Weekly Focus Program',
        description: 'Track your 6-week learning journey',
        icon: '📅',
        duration: '6 weeks',
        difficulty: 'Advanced',
        exercises: [
            {
                id: 'weekly-1',
                title: 'Week 1-2 Integration',
                objective: 'Combine tempo and turns concepts in practice',
                instructions: 'Apply both tempo fundamentals and turn optimization in ranked games.',
                requirements: [
                    'Demonstrate tempo control',
                    'Optimize turn usage',
                    'Show consistent improvement'
                ]
            },
            {
                id: 'weekly-2',
                title: 'Week 3-4 Mastery',
                objective: 'Master action wave coordination',
                instructions: 'Lead team plays using action waves consistently.',
                requirements: [
                    'Execute action wave plays',
                    'Coordinate team effectively',
                    'Maintain high success rate'
                ]
            },
            {
                id: 'weekly-3',
                title: 'Week 5-6 Leadership',
                objective: 'Become team shot-caller using all concepts',
                instructions: 'Take shot-calling responsibility using the complete framework.',
                requirements: [
                    'Lead team macro decisions',
                    'Use systematic approach',
                    'Show measurable team improvement'
                ]
            }
        ]
    },
    advanced: {
        id: 'advanced',
        title: 'Advanced Applications',
        description: 'Complex scenarios and mastery techniques',
        icon: '🏆',
        duration: '35 min read',
        difficulty: 'Advanced',
        exercises: [
            {
                id: 'advanced-1',
                title: 'Deficit Recovery',
                objective: 'Apply framework when behind',
                instructions: 'Use tempo, turns, and action waves to recover from early deficits.',
                requirements: [
                    'Recover from 3 deficit games',
                    'Use framework systematically',
                    'Document recovery strategies'
                ]
            },
            {
                id: 'advanced-2',
                title: 'Split Push Coordination',
                objective: 'Coordinate split push with action waves',
                instructions: 'Execute split push strategies using the framework.',
                requirements: [
                    'Coordinate 1-3-1 compositions',
                    'Time split push with objectives',
                    'Maximize map pressure'
                ]
            },
            {
                id: 'advanced-3',
                title: 'Championship Application',
                objective: 'Apply all concepts in tournament setting',
                instructions: 'Use the complete framework in competitive matches.',
                requirements: [
                    'Perform in tournament/scrim',
                    'Show mastery of all concepts',
                    'Lead team to victory'
                ]
            }
        ]
    }
};

// Helper function to get current user reliably
function getCurrentUser() {
    return window.currentUser || (window.auth ? window.auth.currentUser : null);
}

// Initialize learning progress system - WORKING VERSION
window.initializeLearningProgress = async function() {
    console.log('🎯 Initializing learning progress system...');
    
    let user = getCurrentUser();
    
    if (!user) {
        console.log('⏳ Waiting for user authentication...');
        for (let attempt = 0; attempt < 50; attempt++) {
            await new Promise(resolve => setTimeout(resolve, 100));
            user = getCurrentUser();
            if (user) {
                console.log(`✅ User authenticated: ${user.email}`);
                break;
            }
        }
    }

    if (!user) {
        console.log('❌ No user found - rendering basic UI');
        renderBasicModulesGrid();
        return;
    }

    try {
        console.log('🔄 Loading progress from Firebase...');
        await loadLearningProgress();
        
        console.log('🎨 Rendering modules grid...');
        renderModulesGrid();
        updateOverallProgress();
        
        console.log('✅ Learning progress system initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing learning progress:', error);
        renderBasicModulesGrid();
        updateOverallProgress();
    }
};

// Load progress from Firebase
async function loadLearningProgress() {
    const user = getCurrentUser();
    if (!user) {
        console.log('No user available for loading progress');
        return;
    }

    try {
        if (!window.getDoc || !window.doc || !window.db) {
            console.log('Firebase functions not available yet, using defaults');
            return;
        }

        const progressDoc = await window.getDoc(window.doc(window.db, 'learningProgress', user.uid));
        
        if (progressDoc.exists()) {
            const savedProgress = progressDoc.data();
            if (savedProgress.modules) {
                learningProgress = savedProgress;
                console.log('✅ Loaded existing progress from Firebase');
            }
        } else {
            console.log('No existing progress found, using defaults');
            await saveLearningProgress();
        }
    } catch (error) {
        console.error('Error loading learning progress:', error);
    }
}

// Save progress to Firebase
async function saveLearningProgress() {
    const user = getCurrentUser();
    if (!user) {
        console.log('No user available for saving progress');
        return;
    }

    try {
        if (!window.setDoc || !window.doc || !window.db || !window.serverTimestamp) {
            console.log('Firebase functions not available for saving');
            return;
        }

        await window.setDoc(window.doc(window.db, 'learningProgress', user.uid), {
            ...learningProgress,
            lastUpdated: window.serverTimestamp()
        });
        console.log('✅ Learning progress saved to Firebase');
    } catch (error) {
        console.error('❌ Error saving learning progress:', error);
    }
}

// Render modules grid - WORKING VERSION
function renderModulesGrid() {
    console.log('🎨 Rendering modules grid...');
    const container = document.getElementById('modules-grid');
    if (!container) {
        console.log('❌ modules-grid container not found');
        return;
    }

    container.innerHTML = '';
    
    Object.values(moduleDefinitions).forEach((module, index) => {
        const moduleProgress = learningProgress.modules[module.id];
        const previousModule = index > 0 ? Object.values(moduleDefinitions)[index - 1] : null;
        const isPreviousCompleted = !previousModule || learningProgress.modules[previousModule.id].completed;
        
        let status = 'locked';
        let statusText = '🔒 Locked';
        
        if (index === 0 || isPreviousCompleted) {
            if (moduleProgress.completed) {
                status = 'completed';
                statusText = '✅ Completed';
            } else {
                status = 'current';
                statusText = '⭐ Current';
            }
        }

        const completedExercises = Object.values(moduleProgress.exercises).filter(Boolean).length;
        const totalExercises = Object.keys(moduleProgress.exercises).length;

        const moduleCard = document.createElement('div');
        moduleCard.className = `learning-module ${status}`;
        
        if (status !== 'locked') {
            moduleCard.onclick = () => showPage(module.id);
        } else {
            moduleCard.onclick = () => alert('Complete the previous modules to unlock this content!');
        }

        moduleCard.innerHTML = `
            <div class="module-header">
                <div class="module-icon ${status}">${module.icon}</div>
                <div class="module-status">${statusText}</div>
            </div>
            <h3>${module.title}</h3>
            <p>${module.description}</p>
            <div class="module-meta">
                <span>📖 ${module.duration}</span>
                <span>🎯 ${module.difficulty}</span>
            </div>
            <div class="module-exercise-progress">
                <span>${completedExercises}/${totalExercises} exercises completed</span>
                <div class="progress-bar" style="margin-top: 0.5rem;">
                    <div class="progress-fill" style="width: ${(completedExercises / totalExercises) * 100}%"></div>
                </div>
            </div>
            <button class="module-btn ${status}">
                ${status === 'completed' ? 'Review Module' : 
                  status === 'current' ? 'Continue Learning' : 
                  'Complete Previous Modules'}
            </button>
        `;

        container.appendChild(moduleCard);
    });
    
    console.log('✅ Modules grid rendered successfully');
}

// Fallback basic rendering
function renderBasicModulesGrid() {
    const container = document.getElementById('modules-grid');
    if (!container) return;

    container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #9ca3af;">
            <h3>Learning Modules</h3>
            <p>Please sign in to track your progress and access exercises.</p>
        </div>
    `;
}

// Update overall progress
function updateOverallProgress() {
    const completedModules = Object.values(learningProgress.modules).filter(module => module.completed).length;
    const totalModules = Object.keys(learningProgress.modules).length;
    const progressPercentage = (completedModules / totalModules) * 100;

    const progressBar = document.getElementById('overall-progress');
    const progressText = document.getElementById('progress-text');

    if (progressBar) {
        progressBar.style.width = progressPercentage + '%';
    }

    if (progressText) {
        progressText.textContent = `${completedModules} of ${totalModules} modules completed`;
    }
}

// Toggle exercise completion - WORKING VERSION
window.toggleExercise = async function(exerciseId) {
    console.log('🔄 Toggling exercise:', exerciseId);
    
    const user = getCurrentUser();
    if (!user) {
        alert('Please sign in to track your progress');
        return;
    }

    // Find which module this exercise belongs to
    let moduleId = null;
    for (const [id, module] of Object.entries(moduleDefinitions)) {
        if (module.exercises.some(ex => ex.id === exerciseId)) {
            moduleId = id;
            break;
        }
    }

    if (!moduleId) {
        console.error('Module not found for exercise:', exerciseId);
        return;
    }

    const moduleProgress = learningProgress.modules[moduleId];
    const currentStatus = moduleProgress.exercises[exerciseId];
    
    // Check if previous exercises are completed
    const moduleExercises = moduleDefinitions[moduleId].exercises;
    const exerciseIndex = moduleExercises.findIndex(ex => ex.id === exerciseId);
    
    if (exerciseIndex > 0) {
        const previousExercise = moduleExercises[exerciseIndex - 1];
        if (!moduleProgress.exercises[previousExercise.id]) {
            alert('Complete the previous exercise first!');
            return;
        }
    }

    // Toggle exercise status
    moduleProgress.exercises[exerciseId] = !currentStatus;
    console.log(`Exercise ${exerciseId} is now ${moduleProgress.exercises[exerciseId] ? 'completed' : 'not completed'}`);

    // Check if all exercises in module are completed
    const allExercisesCompleted = Object.values(moduleProgress.exercises).every(Boolean);
    if (allExercisesCompleted && !moduleProgress.completed) {
        moduleProgress.completed = true;
        
        // Show completion message
        const completionDiv = document.getElementById(`${moduleId}-completion`);
        if (completionDiv) {
            completionDiv.style.display = 'block';
        }
        
        alert(`🎉 Congratulations! You've completed the ${moduleDefinitions[moduleId].title} module!`);
    }

    // Update UI
    updateExerciseUI(exerciseId, moduleProgress.exercises[exerciseId]);
    updateModuleProgress(moduleId);
    renderModulesGrid();
    updateOverallProgress();

    // Save to Firebase
    await saveLearningProgress();
};

// Update exercise UI
function updateExerciseUI(exerciseId, completed) {
    const exerciseCard = document.querySelector(`[data-exercise="${exerciseId}"]`);
    if (!exerciseCard) return;

    const toggleBtn = exerciseCard.querySelector('.exercise-toggle');
    if (!toggleBtn) return;

    if (completed) {
        toggleBtn.innerHTML = '<span class="exercise-status" style="color: #10b981;">✅ Completed</span>';
        exerciseCard.classList.add('completed');
    } else {
        toggleBtn.innerHTML = '<span class="exercise-status" style="color: #6b7280;">⭕ Not Started</span>';
        exerciseCard.classList.remove('completed');
    }
}

// Update module progress display
function updateModuleProgress(moduleId) {
    const moduleProgress = learningProgress.modules[moduleId];
    const completedExercises = Object.values(moduleProgress.exercises).filter(Boolean).length;
    const totalExercises = Object.keys(moduleProgress.exercises).length;
    const progressPercentage = (completedExercises / totalExercises) * 100;

    const progressBar = document.getElementById(`${moduleId}-progress`);
    const progressText = document.getElementById(`${moduleId}-progress-text`);

    if (progressBar) {
        progressBar.style.width = progressPercentage + '%';
    }

    if (progressText) {
        progressText.textContent = `${completedExercises} of ${totalExercises} exercises completed`;
    }
}

// Check if exercise should be locked
function isExerciseLocked(exerciseId, moduleId) {
    const moduleExercises = moduleDefinitions[moduleId].exercises;
    const exerciseIndex = moduleExercises.findIndex(ex => ex.id === exerciseId);
    
    if (exerciseIndex === 0) return false; // First exercise is never locked
    
    const previousExercise = moduleExercises[exerciseIndex - 1];
    return !learningProgress.modules[moduleId].exercises[previousExercise.id];
}

// Render exercises for a specific module - WORKING VERSION
window.renderModuleExercises = function(moduleId) {
    console.log('🎯 Rendering exercises for module:', moduleId);
    
    const module = moduleDefinitions[moduleId];
    if (!module) {
        console.log('Module not found:', moduleId);
        return;
    }
    
    const moduleProgress = learningProgress.modules[moduleId];
    
    module.exercises.forEach((exercise, index) => {
        const isLocked = isExerciseLocked(exercise.id, moduleId);
        const isCompleted = moduleProgress.exercises[exercise.id];
        
        console.log(`Exercise ${exercise.id}: locked=${isLocked}, completed=${isCompleted}`);
        
        // Update exercise UI based on status
        updateExerciseUI(exercise.id, isCompleted);
        
        // Update lock state
        const exerciseCard = document.querySelector(`[data-exercise="${exercise.id}"]`);
        if (exerciseCard) {
            const toggleBtn = exerciseCard.querySelector('.exercise-toggle');
            if (toggleBtn) {
                if (isLocked) {
                    toggleBtn.innerHTML = '<span class="exercise-status" style="color: #6b7280;">🔒 Locked</span>';
                    toggleBtn.onclick = () => alert('Complete the previous exercise first!');
                } else {
                    toggleBtn.onclick = () => window.toggleExercise(exercise.id);
                }
            }
        }
    });
    
    // Update module progress
    updateModuleProgress(moduleId);
};

// Export for global access
window.learningProgress = learningProgress;
window.moduleDefinitions = moduleDefinitions;

console.log('✅ Learning progress system loaded and ready');