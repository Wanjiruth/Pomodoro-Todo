// ---------- THEME CONFIGURATIONS ----------
const themeConfigs = {
  'theme-pink': {
    headerTitle: "LET'S SLAY QUEEN",
    headerSubtitle: "Stay focused, stay fabulous ✨",
    themeDescription: "",
    todoSectionTitle: "Today's Tasks",
    todoPlaceholder: "What magic will you create today? ✨",
    completionMessage: "You clocked that, Queen! 👑✨",
    completionTitle: " QUEEN ENERGY ACTIVATED! "
  },
  'theme-blue': {
    headerTitle: "GRIND MODE ACTIVATED",
    headerSubtitle: "Stay focused, stay strong 💪",
    themeDescription: "No grind, no shine💪",
    todoSectionTitle: "Today's Tasks",
    todoPlaceholder: "What will you crush today? 💪",
    completionMessage: "You crushed it, mad respect! ",
    completionTitle: "🔥 CRUSHED IT! 🔥"
  },
  'theme-mint': {
    headerTitle: "FLOW STATE VIBES",
    headerSubtitle: "Work in flow, growth will show 🌿",
    themeDescription: "",
    todoSectionTitle: "What seed will you plant today?",
    todoPlaceholder: "What will you nurture today? 🌱",
    completionMessage: "You aligned, you thrived! 🌿✨",
    completionTitle: " PERFECTLY ALIGNED! "
  },
  'theme-purple': {
    headerTitle: "Luxury is built in little actions.",
    headerSubtitle: "Stay poised, stay radiant ✨",
    themeDescription: "",
    todoSectionTitle: "Today's Tasks",
    todoPlaceholder: " Which royal moves do you wanna make?",
    completionMessage: "Exquisite effort today!",
    completionTitle: "You handled it with distinction!"
  }
};

// ---------- GLOBAL VARIABLES ----------
let todos = [];
let todoId = 0;
let timeLeft = 40 * 60; 
let timerId = null;
let isRunning = false;
let currentMode = 'work';
let sessionCount = 0;
let timerEndTime = null;
let currentTheme = 'theme-purple';

const modes = { 
  work: 40 * 60, 
  short: 5 * 60, 
  long: 15 * 60 
};

// ---------- TODO FUNCTIONALITY ----------
function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  if (text === '') return;
  
  const todo = { id: todoId++, text: text, completed: false };
  todos.push(todo);
  input.value = '';
  renderTodos();
  updateTodoStats();
  saveTodos();
  
  // Add a subtle animation to the new todo
  setTimeout(() => {
    const newTodoElement = document.querySelector(`[data-todo-id="${todo.id}"]`);
    if (newTodoElement) {
      newTodoElement.style.animation = 'checkBounce 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    }
  }, 100);
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    const wasCompleted = todo.completed;
    todo.completed = !todo.completed;
    renderTodos();
    updateTodoStats();
    saveTodos();
    
    // Trigger walking character when a task is completed
    if (!wasCompleted && todo.completed) {
      triggerWalkingCharacter();
    }
    
    checkAllCompleted();
  }
}

function deleteTodo(id) {
  const todoElement = document.querySelector(`[data-todo-id="${id}"]`);
  if (todoElement) {
    todoElement.style.animation = 'fadeOut 0.3s ease-out forwards';
    setTimeout(() => {
      todos = todos.filter(t => t.id !== id);
      renderTodos();
      updateTodoStats();
      saveTodos();
    }, 300);
  }
}

function updateTodoStats() {
  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;
  const statsElement = document.getElementById('todoStats');
  statsElement.textContent = `${completedCount} of ${totalCount} complete`;
  
  // Update stats color based on progress
  if (completedCount === totalCount && totalCount > 0) {
    statsElement.style.background = 'var(--success)';
    statsElement.style.color = 'white';
  } else {
    statsElement.style.background = 'var(--accent)';
    statsElement.style.color = 'var(--text)';
  }
}

function checkAllCompleted() {
  if (todos.length > 0 && todos.every(todo => todo.completed)) {
    showCompletionMessage();
  }
}

function showCompletionMessage() {
  const messageEl = document.getElementById('completionMessage');
  const textEl = document.getElementById('completion-text');
  const titleEl = document.getElementById('completion-title');
  
  const config = themeConfigs[currentTheme];
  
  titleEl.textContent = config.completionTitle;
  textEl.textContent = config.completionMessage;
  messageEl.classList.add('show');
  
  createConfetti();
  playBellSound();
  
  // Theme-specific speech synthesis
  if ('speechSynthesis' in window) {
    let speechMessage = config.completionMessage.replace(/[🎉👑✨🔥💪🌿🌱]/g, '');
    
    const utterance = new SpeechSynthesisUtterance(speechMessage);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    speechSynthesis.speak(utterance);
  }
}

function triggerWalkingCharacter() {
  const pet = document.getElementById('walkingCharacter');
  
  const actions = ['happy', 'excited', 'celebrating'];
  const randomAction = actions[Math.floor(Math.random() * actions.length)];
  
  pet.className = 'cute-pet';
  
  setTimeout(() => {
    pet.classList.add('appear', randomAction);
    
    if (randomAction === 'celebrating') {
      createHeartParticles();
    }
    
    const duration = randomAction === 'celebrating' ? 3000 : 
                    randomAction === 'excited' ? 2000 : 2500;
    
    setTimeout(() => {
      pet.classList.remove('appear', randomAction);
    }, duration);
    
  }, 300);
}

function createHeartParticles() {
  const heartsContainer = document.querySelector('.heart-particles');
  
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const heart = document.createElement('div');
      heart.className = 'heart';
      heart.textContent = '♥';
      heart.style.left = (Math.random() * 40 - 20) + 'px';
      heart.style.animationDelay = (Math.random() * 0.5) + 's';
      
      heartsContainer.appendChild(heart);
      
      setTimeout(() => {
        if (heart.parentNode) {
          heart.parentNode.removeChild(heart);
        }
      }, 2000);
    }, i * 200);
  }
}

function closeCompletionMessage() {
  document.getElementById('completionMessage').classList.remove('show');
}

function createConfetti() {
  const colors = ['#ff6b9d', '#ff8fab', '#ffa8cc', '#ffffff', '#ffd700', '#4ecdc4'];
  
  // Theme-specific confetti colors
  if (currentTheme === 'theme-blue') {
    colors.push('#1f2937', '#374151', '#10b981');
  } else if (currentTheme === 'theme-mint') {
    colors.push('#10b981', '#34d399', '#6ee7b7');
  } else if (currentTheme === 'theme-purple') {
    colors.push('#a855f7', '#c084fc', '#ddd6fe');
  }
  
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 1 + 's';
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 4000);
    }, i * 50);
  }
}

function renderTodos() {
  const list = document.getElementById('todoList');
  list.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.setAttribute('data-todo-id', todo.id);
    li.innerHTML = `
      <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" 
           onclick="toggleTodo(${todo.id})" 
           role="checkbox" 
           aria-checked="${todo.completed}"
           tabindex="0"
           onkeydown="if(event.key==='Enter'||event.key===' ') toggleTodo(${todo.id})"></div>
      <span class="todo-text">${escapeHtml(todo.text)}</span>
      <button class="delete-btn" 
              onclick="deleteTodo(${todo.id})" 
              aria-label="Delete task: ${escapeHtml(todo.text)}">🗑️</button>
    `;
    list.appendChild(li);
  });
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// ---------- TIMER FUNCTIONALITY ----------
function setMode(mode) {
  if (isRunning) return;
  currentMode = mode;
  timeLeft = modes[mode];
  timerEndTime = null;
  
  document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.mode-btn[data-mode="${mode}"]`).classList.add('active');
  
  const modeNames = {
    work: 'Work',
    short: 'Short Break',
    long: 'Long Break'
  };
  document.getElementById('currentMode').textContent = modeNames[mode];
  updateDisplay();
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  if (!timerEndTime) {
    timerEndTime = Date.now() + timeLeft * 1000;
  }
  document.getElementById('startBtn').innerHTML = '⏰ Running...';
  clearInterval(timerId);
  timerId = setInterval(updateTimer, 1000);
  updateTimer();
}

function pauseTimer() {
  if (!isRunning) return;
  isRunning = false;
  clearInterval(timerId);
  timeLeft = getCurrentTimeLeft();
  timerEndTime = null;
  document.getElementById('startBtn').innerHTML = '▶ Start';
}

function resetTimer() {
  isRunning = false;
  clearInterval(timerId);
  timeLeft = modes[currentMode];
  timerEndTime = null;
  document.getElementById('startBtn').innerHTML = '▶ Start';
  updateDisplay();
}

function getCurrentTimeLeft() {
  if (!timerEndTime) return timeLeft;
  const now = Date.now();
  return Math.max(0, Math.ceil((timerEndTime - now) / 1000));
}

function updateTimer() {
  timeLeft = getCurrentTimeLeft();
  updateDisplay();
  if (timeLeft <= 0) completeSession();
}

function completeSession() {
  isRunning = false;
  clearInterval(timerId);
  timerEndTime = null;
  sessionCount++;
  document.getElementById('sessionCount').textContent = sessionCount;
  document.getElementById('startBtn').innerHTML = '▶ Start';
  localStorage.setItem('pomodoro-session-count', sessionCount.toString());
  
  playBellSound();

  if (currentMode === 'work') {
    if ('speechSynthesis' in window) {
      let message = "Congratulations! Time for a well-deserved break.";
      switch(currentTheme) {
        case 'theme-pink':
          message = "Slay break time, Queen!";
          break;
        case 'theme-blue':
          message = "Break time! You earned it through the grind!";
          break;
        case 'theme-mint':
          message = "Flow into your break. Growth continues!";
          break;
      }
      const utterance = new SpeechSynthesisUtterance(message);
      speechSynthesis.speak(utterance);
    }
    
    // Auto-switch to break mode
    const nextMode = sessionCount % 4 === 0 ? 'long' : 'short';
    setTimeout(() => setMode(nextMode), 1000);
  } else {
    if ('speechSynthesis' in window) {
      let message = "Break time is over! Ready to focus again?";
      switch(currentTheme) {
        case 'theme-pink':
          message = "Break's over, Queen! Time to create more magic!";
          break;
        case 'theme-blue':
          message = "Back to the grind! Let's crush it!";
          break;
        case 'theme-mint':
          message = "Flow back into focus. Your growth awaits!";
          break;
      }
      const utterance = new SpeechSynthesisUtterance(message);
      speechSynthesis.speak(utterance);
    }
  }
  
  showTimerNotification();
}

function showTimerNotification() {
  const modeNames = {
    work: 'Work Session',
    short: 'Short Break',
    long: 'Long Break'
  };
  
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: white;
    padding: 20px 24px;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    font-weight: 600;
    animation: slideIn 0.3s ease-out;
  `;
  
  let emoji = '🎉';
  switch(currentTheme) {
    case 'theme-pink':
      emoji = '👑';
      break;
    case 'theme-blue':
      emoji = '💪';
      break;
    case 'theme-mint':
      emoji = '🌱';
      break;
    case 'theme-purple':
      emoji = '🌸';
      break;
  }
  
  notification.innerHTML = `${emoji} ${modeNames[currentMode]} Complete!`;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  document.getElementById('timerDisplay').textContent = timeString;
  
  const totalTime = modes[currentMode];
  const progress = ((totalTime - timeLeft) / totalTime) * 360;
  document.getElementById('progressRing').style.background = 
    `conic-gradient(var(--primary) ${progress}deg, rgba(255, 255, 255, 0.3) ${progress}deg)`;
  
  // Update page title with timer
  const config = themeConfigs[currentTheme];
  document.title = `${timeString} - ${config.headerTitle}`;
}

function playBellSound() {
  document.getElementById('bellSound').play().catch(() => {
    // Handle audio play failure gracefully
    console.log('Audio playback failed - this is normal in some browsers');
  });
}

// ---------- THEME FUNCTIONALITY ----------
function setTheme(themeName) {
  currentTheme = themeName;
  document.body.className = themeName;
  localStorage.setItem('pomodoro-theme', themeName);
  
  // Update theme-specific content
  updateThemeContent();
  
  // Add theme change animation
  document.body.style.animation = 'themeChange 0.5s ease-in-out';
  setTimeout(() => {
    document.body.style.animation = '';
  }, 500);
}

function updateThemeContent() {
  const config = themeConfigs[currentTheme];
  
  // Update header
  document.getElementById('headerTitle').textContent = config.headerTitle;
  document.getElementById('headerSubtitle').textContent = config.headerSubtitle;
  
  // Update theme description (only for blue theme has one)
  const themeDescEl = document.getElementById('themeDescription');
  if (config.themeDescription) {
    themeDescEl.textContent = config.themeDescription;
    themeDescEl.style.display = 'block';
  } else {
    themeDescEl.style.display = 'none';
  }
  
  // Update todo section title
  document.getElementById('todoSectionTitle').textContent = config.todoSectionTitle;
  
  // Update input placeholder
  document.getElementById('todoInput').placeholder = config.todoPlaceholder;
  
  // Update page title if timer is not running
  if (!isRunning) {
    document.title = config.headerTitle;
  }
}

// ---------- DATA PERSISTENCE ----------
function saveTodos() {
  localStorage.setItem('pomodoro-todos', JSON.stringify(todos));
}

function loadTodos() {
  const savedTodos = localStorage.getItem('pomodoro-todos');
  const savedSessionCount = localStorage.getItem('pomodoro-session-count');
  
  if (savedTodos) {
    try {
      todos = JSON.parse(savedTodos);
      todoId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 0;
    } catch (e) {
      console.error('Error loading todos:', e);
      todos = [];
      todoId = 0;
    }
  }
  
  if (savedSessionCount) {
    sessionCount = parseInt(savedSessionCount, 10) || 0;
    document.getElementById('sessionCount').textContent = sessionCount;
  }
}

// ---------- EVENT LISTENERS ----------
document.addEventListener('visibilitychange', () => {
  if (isRunning && document.visibilityState === 'visible') {
    updateTimer();
  }
});

window.addEventListener('focus', () => { 
  if (isRunning) updateTimer(); 
});

document.getElementById('todoInput').addEventListener('keypress', e => { 
  if (e.key === 'Enter') addTodo(); 
});

document.getElementById('startBtn').addEventListener('click', startTimer);
document.getElementById('pauseBtn').addEventListener('click', pauseTimer);
document.getElementById('resetBtn').addEventListener('click', resetTimer);

document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => setMode(btn.getAttribute('data-mode')));
});

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.ctrlKey || e.metaKey) {
    switch(e.key) {
      case 'Enter':
        e.preventDefault();
        if (isRunning) pauseTimer(); else startTimer();
        break;
      case 'r':
        e.preventDefault();
        resetTimer();
        break;
    }
  }
  
  // Escape key closes completion message
  if (e.key === 'Escape') {
    const completionMessage = document.getElementById('completionMessage');
    if (completionMessage.classList.contains('show')) {
      closeCompletionMessage();
    }
  }
});

// ---------- INITIALIZATION ----------
document.addEventListener('DOMContentLoaded', () => {
  // Load saved data
  loadTodos();
  
  // Load saved theme
  const savedTheme = localStorage.getItem('pomodoro-theme');
  if (savedTheme && themeConfigs[savedTheme]) {
    setTheme(savedTheme);
  } else {
    setTheme('theme-purple'); // Default theme
  }
  
  updateDisplay();
  updateTodoStats();
  renderTodos();
  updateThemeContent();
  
  // Initialize mode buttons
  document.querySelector('.mode-btn[data-mode="work"]').classList.add('active');
  
  // Add welcome animation
  setTimeout(() => {
    document.querySelector('.container').style.animation = 'fadeIn 0.8s ease-out';
  }, 100);
});

// ---------- UTILITY FUNCTIONS ----------
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Add additional keyframe animations
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; transform: scale(1); }
    to { opacity: 0; transform: scale(0.8); }
  }
  
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  @keyframes themeChange {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.1); }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// Add styles to head when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    document.head.appendChild(additionalStyles);
  });
} else {
  document.head.appendChild(additionalStyles);
}

// ---------- ERROR HANDLING ----------
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  
  // Show user-friendly error message
  const errorNotification = document.createElement('div');
  errorNotification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #ef4444;
    color: white;
    padding: 16px 24px;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    z-index: 2000;
    font-weight: 600;
    animation: slideIn 0.3s ease-out;
  `;
  errorNotification.innerHTML = '⚠️ Something went wrong. Please refresh the page.';
  document.body.appendChild(errorNotification);
  
  setTimeout(() => {
    errorNotification.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => {
      if (document.body.contains(errorNotification)) {
        document.body.removeChild(errorNotification);
      }
    }, 300);
  }, 5000);
});

// ---------- ACCESSIBILITY ENHANCEMENTS ----------
// Announce important changes to screen readers
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Enhanced keyboard navigation
document.addEventListener('keydown', (e) => {
  // Tab navigation improvements
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

// Add accessibility styles
const accessibilityStyles = document.createElement('style');
accessibilityStyles.textContent = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  .keyboard-nav *:focus {
    outline: 3px solid var(--primary) !important;
    outline-offset: 2px !important;
  }
`;

document.head.appendChild(accessibilityStyles);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addTodo,
    toggleTodo,
    deleteTodo,
    setTheme,
    startTimer,
    pauseTimer,
    resetTimer,
    themeConfigs
  };
}