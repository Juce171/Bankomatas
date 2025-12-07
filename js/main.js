// Load or create user database
let users = JSON.parse(localStorage.getItem("atm_users")) || {};
let currentUser = null;
let currentAction = null;

// Save data to localStorage
function saveDB() {
    localStorage.setItem("atm_users", JSON.stringify(users));
}

// -------- REGISTER --------
function registerUser() {
    let user = username.value.trim();
    let password = pin.value;

    if (!user || !password) return alert("Enter username and PIN!");

    if (users[user]) return alert("User already exists!");

    users[user] = { pin: password, balance: 0, history: [] };
    saveDB();
    alert("Account created successfully!");
}

// -------- LOGIN --------
function login() {
    let user = username.value.trim();
    let password = pin.value;

    if (users[user] && users[user].pin === password) {
        currentUser = user;
        document.getElementById("auth").classList.add("hide");
        document.getElementById("menu").classList.remove("hide");
        document.getElementById("result").innerHTML = "Login successful!";
        welcome.innerHTML = "Welcome, " + user + "!";
    } else {
        document.getElementById("result").innerHTML =
            "Wrong username or PIN";
    }
}


// --------- Actions ----------
function startDeposit() {
    currentAction = "deposit";
    openAmountInput("Deposit Amount:");
}

function startWithdraw() {
    currentAction = "withdraw";
    openAmountInput("Withdraw Amount:");
}

function openAmountInput(text) {
    document.getElementById("action-title").innerHTML = text;
    document.getElementById("amount").value = "";

    document.getElementById("menu").classList.add("hide");
    document.getElementById("input-area").classList.remove("hide");
}


// Keypad actions
function num(n) { amount.value += n; }
function clearAmount() { amount.value = ""; }

// Confirm deposit/withdraw
function confirmAmount() {
    let value = Number(amount.value);

    if (value <= 0 || isNaN(value)) return alert("Invalid amount!");

    if (currentAction === "deposit") {
        users[currentUser].balance += value;
        users[currentUser].history.push("Deposited " + value + "€");

        // --- CASH SOUND ---
        document.getElementById("cashSound").play();

        setTimeout(() => {
            cash.classList.add("hide");
        }, 2000);
    }

    if (currentAction === "withdraw") {
        if (value > users[currentUser].balance) {
            document.getElementById("result").innerHTML = "Not enough funds!";
            return;
        }

        users[currentUser].balance -= value;
        users[currentUser].history.push("Withdrew " + value + "€");

        // --- CASH SOUND ---
        document.getElementById("cashSound").play();

        setTimeout(() => {
            cash.classList.add("hide");
        }, 2000);
    }


    saveDB();

    document.getElementById("input-area").classList.add("hide");
    document.getElementById("menu").classList.remove("hide");

    document.getElementById("result").innerHTML =
        "Done! Amount: " + value + "€";
}


// Show balance
function showBalance() {
    result.innerHTML = "Balance: " + users[currentUser].balance + "€";
}

// Show history
function showHistory() {
    let h = users[currentUser].history;
    result.innerHTML = h.length ? h.join("<br>") : "No transactions";
}

// Logout
function logout() {
    currentUser = null;
    menu.classList.add("hide");
    auth.classList.remove("hide");
    result.innerHTML = "";
}
