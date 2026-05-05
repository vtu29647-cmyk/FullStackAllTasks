// Transaction history
let transactionHistory = JSON.parse(localStorage.getItem("transactionHistory")) || [];

// Load transactions on page load
document.addEventListener("DOMContentLoaded", function () {
    loadTransactions();
    
    // Form submission
    const paymentForm = document.getElementById("paymentForm");
    paymentForm.addEventListener("submit", function (e) {
        e.preventDefault();
        processPayment();
    });

    // Show balances on input change
    document.getElementById("userId").addEventListener("blur", function () {
        const userId = this.value;
        if (userId) {
            fetchBalance(userId, "userBalance");
        }
    });

    document.getElementById("merchantId").addEventListener("blur", function () {
        const merchantId = this.value;
        if (merchantId) {
            fetchBalance(merchantId, "merchantBalance");
        }
    });
});

// Fetch balance of an account
async function fetchBalance(accountId, elementId) {
    try {
        const response = await fetch(`http://localhost:3000/balance/${accountId}`);
        const data = await response.json();
        
        if (data.error) {
            document.getElementById(elementId).textContent = "❌ Account not found";
        } else {
            document.getElementById(elementId).textContent = `Current Balance: ₹${parseFloat(data.balance).toFixed(2)}`;
        }
    } catch (error) {
        document.getElementById(elementId).textContent = "⚠️ Unable to fetch balance";
    }
}

// Process Payment Function
async function processPayment() {
    const userId = document.getElementById("userId").value;
    const merchantId = document.getElementById("merchantId").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const messageBox = document.getElementById("message");
    const balanceContainer = document.getElementById("balanceContainer");

    // Validate inputs
    if (!userId || !merchantId || !amount) {
        showMessage("❌ Please fill all fields", "error");
        balanceContainer.style.display = "none";
        return;
    }

    if (amount <= 0) {
        showMessage("❌ Amount must be greater than 0", "error");
        balanceContainer.style.display = "none";
        return;
    }

    if (userId === merchantId) {
        showMessage("❌ User ID and Merchant ID cannot be the same", "error");
        balanceContainer.style.display = "none";
        return;
    }

    try {
        // Send payment request to server
        const response = await fetch("http://localhost:3000/pay", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: parseInt(userId),
                merchantId: parseInt(merchantId),
                amount: amount
            })
        });

        const data = await response.json();

        // Add to transaction history
        const transaction = {
            status: data.message.includes("Successful") ? "✅ Success" : "❌ Failed",
            userId: userId,
            merchantId: merchantId,
            amountDeducted: data.message.includes("Successful") ? amount : 0,
            amountCredited: data.message.includes("Successful") ? amount : 0,
            result: data.message
        };

        transactionHistory.push(transaction);
        localStorage.setItem("transactionHistory", JSON.stringify(transactionHistory));

        // Update UI
        if (data.message.includes("Successful")) {
            showMessage(`✅ ${data.message}`, "success");
            
            // Show updated balances
            if (data.userBalance !== undefined && data.merchantBalance !== undefined) {
                document.getElementById("userNewBalance").textContent = parseFloat(data.userBalance).toFixed(2);
                document.getElementById("merchantNewBalance").textContent = parseFloat(data.merchantBalance).toFixed(2);
                balanceContainer.style.display = "block";
            }
        } else {
            showMessage(`❌ ${data.message}`, "error");
            balanceContainer.style.display = "none";
        }

        // Reload transactions table
        loadTransactions();

        // Clear form
        document.getElementById("paymentForm").reset();
        document.getElementById("userBalance").textContent = "";
        document.getElementById("merchantBalance").textContent = "";

    } catch (error) {
        console.error("Error:", error);
        showMessage("❌ Server connection failed. Check if server is running on port 3000", "error");
        balanceContainer.style.display = "none";

        // Still add to history for demonstration
        const transaction = {
            status: "❌ Failed",
            userId: userId,
            merchantId: merchantId,
            amountDeducted: 0,
            amountCredited: 0,
            result: "Connection Error: " + error.message
        };

        transactionHistory.push(transaction);
        localStorage.setItem("transactionHistory", JSON.stringify(transactionHistory));
        loadTransactions();
    }
}

// Load and display transactions
function loadTransactions() {
    const tableBody = document.getElementById("tableBody");

    if (transactionHistory.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No transactions yet</td></tr>';
        return;
    }

    tableBody.innerHTML = "";

    transactionHistory.forEach((transaction, index) => {
        const row = document.createElement("tr");
        row.className = transaction.status.includes("Success") ? "success" : "failed";

        row.innerHTML = `
            <td>${transaction.status}</td>
            <td>${transaction.userId}</td>
            <td>${transaction.merchantId}</td>
            <td><span class="danger">-₹${transaction.amountDeducted.toFixed(2)}</span></td>
            <td><span class="highlight">+₹${transaction.amountCredited.toFixed(2)}</span></td>
            <td>${transaction.result}</td>
        `;

        tableBody.appendChild(row);
    });
}

// Show message function
function showMessage(message, type) {
    const messageBox = document.getElementById("message");
    messageBox.textContent = message;
    messageBox.className = "message " + type;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageBox.className = "message";
    }, 5000);
}

// Clear transaction history
function clearHistory() {
    if (confirm("Are you sure you want to clear all transaction history?")) {
        transactionHistory = [];
        localStorage.removeItem("transactionHistory");
        loadTransactions();
        showMessage("✅ Transaction history cleared", "success");
    }
}
