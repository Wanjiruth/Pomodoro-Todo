function triggerWalkingCharacter() {
  const tomato = document.getElementById('walkingCharacter');
  
  console.log('Kawaii tomato triggered!'); // Debug log
  
  // Random tomato reactions for variety
  const actions = ['happy', 'excited', 'celebrating'];
  const randomAction = actions[Math.floor(Math.random() * actions.length)];
  
  // Reset tomato state
  tomato.className = 'kawaii-tomato';
  
  // Show tomato with bounce effect
  setTimeout(() => {
    tomato.classList.add('appear', randomAction);
    
    // Create sparkle effects if celebrating
    if (randomAction === 'celebrating') {
      createSparkleEffects();
    }
    
    console.log(`Tomato is ${randomAction}!`);
    
    // Tomato stays visible for different durations based on action
    const duration = randomAction === 'celebrating' ? 3500 : 
                    randomAction === 'excited' ? 2000 : 2500;
    
    setTimeout(() => {
      tomato.classList.remove('appear', randomAction);
      console.log('Tomato disappeared');
    }, duration);
    
  }, 300);
}

function createSparkleEffects() {
  const sparklesContainer = document.querySelector('.sparkles');
  
  // Create sparkle particles
  for (let i = // ---------- TODO FUNCTIONALITY ----------

let todos = [];
let todoId = 0;

function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  if (text === '') return;
  const todo = { id: todoId++, text: text, completed: false };
  todos.push(todo);
  input.value = '';
  renderTodos();
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) {
    const wasCompleted = todo.completed;
    todo.completed = !todo.completed;
    renderTodos();
    
    // Trigger walking character when a task is completed (not uncompleted)
    if (!wasCompleted && todo.completed) {
      console.log('Task completed! Triggering character...'); // Debug log
      triggerWalkingCharacter();
    }
    
    checkAllCompleted();
  }
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  renderTodos();
}

function checkAllCompleted() {
  // Check if all todos are completed (and there's at least one todo)
  if (todos.length > 0 && todos.every(todo => todo.completed)) {
    showCompletionMessage();
  }
}

function showCompletionMessage() {
  const messageEl = document.getElementById('completionMessage');
  const eveningMessageEl = document.getElementById('eveningMessage');
  
  // Get current hour to determine time of day
  const hour = new Date().getHours();
  let message = '';
  
  if (hour >= 5 && hour < 12) {
    message = "🌅 Amazing morning productivity! All tasks crushed before noon!";
  } else if (hour >= 12 && hour < 17) {
    message = "☀️ Afternoon champion! You've conquered your todo list!";
  } else if (hour >= 17 && hour < 21) {
    message = "🌆 Perfect evening! All tasks done. Time to unwind and relax!";
  } else {
    message = "🌙 Night owl productivity! All done ! Now get some well-deserved rest!";
  }
  
  eveningMessageEl.textContent = message;
  messageEl.classList.add('show');
  
  // Create confetti effect
  createConfetti();
  
  // Play a sound
  document.getElementById('bellSound').play();
  
  // Also use speech synthesis for extra celebration
  const utterance = new SpeechSynthesisUtterance(message);
  speechSynthesis.speak(utterance);
}

function triggerWalkingCharacter() {
  const tomato = document.getElementById('walkingCharacter');
  
  console.log('Kawaii tomato triggered!'); // Debug log
  
  // Random tomato reactions for variety
  const actions = ['happy', 'excited', 'celebrating'];
  const randomAction = actions[Math.floor(Math.random() * actions.length)];
  
  // Reset tomato state
  tomato.className = 'kawaii-tomato';
  
  // Show tomato with bounce effect
  setTimeout(() => {
    tomato.classList.add('appear', randomAction);
    
    // Create sparkle effects if celebrating
    if (randomAction === 'celebrating') {
      createSparkleEffects();
    }
    
    console.log(`Tomato is ${randomAction}!`);
    
    // Tomato stays visible for different durations based on action
    const duration = randomAction === 'celebrating' ? 3500 : 
                    randomAction === 'excited' ? 2000 : 2500;
    
    setTimeout(() => {
      tomato.classList.remove('appear', randomAction);
      console.log('Tomato disappeared');
    }, duration);
    
  }, 300);
}

function createSparkleEffects() {
  const sparklesContainer = document.querySelector('.sparkles');
  
  // Create sparkle particles
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.textContent = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)];
      sparkle.style.left = (Math.random() * 60 - 30) + 'px';
      sparkle.style.top = (Math.random() * 40 - 20) + 'px';
      sparkle.style.animationDelay = (Math.random() * 0.5) + 's';
      
      sparklesContainer.appendChild(sparkle);
      
      // Remove sparkle after animation
      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      }, 2000);
    }, i * 150);
  }
}

function closeCompletionMessage() {
  document.getElementById('completionMessage').classList.remove('show');
}

function createConfetti() {
  const colors = ['#ff69b4', '#ff1493', '#ffb6c1', '#fff', '#ffd700'];
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 1 + 's';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 3000);
    }, i * 30);
  }
}

function renderTodos() {
  const list = document.getElementById('todoList');
  list.innerHTML = '';
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.innerHTML = `
      <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" onclick="toggleTodo(${todo.id})"></div>
      <span class="todo-text">${todo.text}</span>
      <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
    `;
    list.appendChild(li);
  });
}

// ---------- TIMER FUNCTIONALITY ----------

let timeLeft = 40 * 60; 
let timerId = null;
let isRunning = false;
let currentMode = 'work';
let sessionCount = 0;
let timerEndTime = null;

const modes = { work: 40*60, short: 5*60, long: 15*60 };

function setMode(mode) {
  if (isRunning) return;
  currentMode = mode;
  timeLeft = modes[mode];
  timerEndTime = null;
  document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.mode-btn[data-mode="${mode}"]`).classList.add('active');
  document.getElementById('currentMode').textContent =
    mode === 'work' ? 'Work' : mode === 'short' ? 'Short Break' : 'Long Break';
  updateDisplay();
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  if (!timerEndTime) {
    timerEndTime = Date.now() + timeLeft * 1000;
  }
  document.getElementById('startBtn').textContent = 'Running...';
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
  document.getElementById('startBtn').textContent = 'Start';
}

function resetTimer() {
  isRunning = false;
  clearInterval(timerId);
  timeLeft = modes[currentMode];
  timerEndTime = null;
  document.getElementById('startBtn').textContent = 'Start';
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
  document.getElementById('startBtn').textContent = 'Start';
  document.getElementById('bellSound').play();

  if (currentMode === 'work') {
    speechSynthesis.speak(new SpeechSynthesisUtterance("Congratulations You Amazing Human! Time for a break."));
  }
  if (currentMode === 'work') {
    const nextMode = sessionCount % 4 === 0 ? 'long' : 'short';
    setTimeout(() => setMode(nextMode), 1000);
  }
  alert(`${currentMode === 'work' ? 'Work' : 'Break'} session completed!`);
}

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById('timerDisplay').textContent =
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const totalTime = modes[currentMode];
  const progress = ((totalTime - timeLeft) / totalTime) * 360;
  document.getElementById('progressCircle').style.background =
    `conic-gradient(var(--primary) ${progress}deg, #e0e0e0 ${progress}deg)`;
}

// ---------- EVENT LISTENERS ----------

document.addEventListener('visibilitychange', () => {
  if (isRunning && document.visibilityState === 'visible') updateTimer();
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

// ---------- INITIALIZATION ----------

updateDisplay();