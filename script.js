// Variables to store points, coins, and timer values
let points = 0;
let highestPoints = localStorage.getItem("highestPoints") 
                    ? parseInt(localStorage.getItem("highestPoints")) 
                    : 0;
let coins = 0;
let totalSeconds = 0;
let globalTimer;

// **Start the Global Timer** when a task is added
function startGlobalTimer() {
    if (!globalTimer) {
        globalTimer = setInterval(() => {
            totalSeconds++; // Increment time every second
            document.getElementById("globalTimer").textContent = `${totalSeconds}s`; // Update UI
        }, 1000);
    }
}

// **Function to Add a Task**
function addTask() {
    const taskInput = document.getElementById("taskInput"); // Get input field
    const taskList = document.getElementById("taskList"); // Get task list container

    if (taskInput.value.trim() === "") return; // Prevent adding empty tasks

    startGlobalTimer(); // Start timer when the first task is added

    // Create a new task element
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task"); // Add task styling class

    taskDiv.innerHTML = `
        <span>${taskInput.value}</span>
        <button onclick="completeTask(this)">Complete</button>  <!-- Complete button -->
    `;

    taskList.appendChild(taskDiv); // Add task to the list
    taskInput.value = ""; // Clear input field after adding a task
}

// **Function to Mark Task as Completed**
function completeTask(button) {
    const taskDiv = button.parentElement;
    taskDiv.classList.add("completed");
    button.disabled = true;

    points += 5;
    coins++;

    if (points > highestPoints) {
        highestPoints = points; // Update highest points if current points exceed it
        localStorage.setItem("highestPoints", highestPoints); // Store in localStorage
    }

    updateUI();
}


// **Function to Update Points & Coins UI**
// Update Points & Coins UI
function updateUI() {
    document.getElementById("points").textContent = points;
    document.getElementById("coinCount").textContent = coins;
    document.getElementById("highestPoints").textContent = highestPoints; // Update highest points UI
}


// **Reset Function**
function resetTaskManager() {
    clearInterval(globalTimer);
    globalTimer = null;
    totalSeconds = 0;
    document.getElementById("globalTimer").textContent = "0s";
    document.getElementById("taskList").innerHTML = ""; // Clear tasks

    points = 0;  // Reset points only
    updateUI();  // Update UI without changing highest points
}


// **Music Toggle Functionality**
const music = document.getElementById("bg-music"); // Get music element
const musicButton = document.getElementById("music-button"); // Get music button

musicButton.addEventListener("click", function () {
    if (music.paused) {
        music.play(); // Play music
        musicButton.innerText = "🎵"; // Change button icon
    } else {
        music.pause(); // Pause music
        musicButton.innerText = "🎵"; // Keep same icon
    }
});

// **Marketplace Logic for Buying Backgrounds**
document.querySelectorAll(".buy-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
        let price = parseInt(this.parentElement.getAttribute("data-price")); // Get price of background
        let image = this.parentElement.getAttribute("data-image"); // Get image path

        // Check if user has enough coins and hasn't already purchased the background
        if (coins >= price && !purchasedBackgrounds.includes(image)) {
            coins -= price; // Deduct coins
            purchasedBackgrounds.push(image); // Add background to purchased list
            localStorage.setItem("purchasedBackgrounds", JSON.stringify(purchasedBackgrounds)); // Save to localStorage
            alert("Background purchased!"); // Notify user
            updateMarketplace(); // Update UI
        } else if (purchasedBackgrounds.includes(image)) {
            alert("You already own this background!"); // Notify if already owned
        } else {
            alert("Not enough coins!"); // Notify if not enough coins
        }
    });
});

// **Update Marketplace UI**
function updateMarketplace() {
    document.querySelectorAll(".buy-btn").forEach((btn) => {
        let image = btn.parentElement.getAttribute("data-image");
        if (purchasedBackgrounds.includes(image)) {
            btn.textContent = "Owned"; // Change button text
            btn.disabled = true; // Disable button
        }
    });
}
updateMarketplace(); // Call function to initialize marketplace UI

// **Display Owned Backgrounds**
function showOwnedBackgrounds() {
    let container = document.getElementById("owned-backgrounds"); // Get container
    container.innerHTML = ""; // Clear previous content

    // Loop through purchased backgrounds and display them
    purchasedBackgrounds.forEach((image) => {
        let bgDiv = document.createElement("div");
        bgDiv.classList.add("bg-thumb"); // Add thumbnail styling
        bgDiv.style.backgroundImage = `url(${image})`; // Set background image

        bgDiv.addEventListener("click", function () {
            document.body.style.backgroundImage = `url(${image})`; // Set background
            localStorage.setItem("selectedBackground", image); // Save selected background
        });

        container.appendChild(bgDiv); // Add to container
    });
}

// **Apply Saved Background on Page Load**
let savedBg = localStorage.getItem("selectedBackground"); // Get saved background
if (savedBg) {
    document.body.style.backgroundImage = `url(${savedBg})`; // Apply background
}

showOwnedBackgrounds(); // Show purchased backgrounds

// **Function to Set Background**
function setBackground(imagePath) {
    document.body.style.backgroundImage = `url('${imagePath}')`; // Change background
    document.body.style.backgroundSize = "cover"; // Ensure full screen
    document.body.style.backgroundPosition = "center"; // Center background
}
