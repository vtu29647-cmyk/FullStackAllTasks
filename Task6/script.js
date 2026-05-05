// ===================================================
// Task 6: Automated Logging using Triggers & Views
// Frontend JavaScript
// ===================================================

// Load all data on page load
document.addEventListener("DOMContentLoaded", function () {
    loadAccounts();
    loadLogs();
    loadDailyReport();
    loadAccountSummary();

    // Form submission
    const addAccountForm = document.getElementById("addAccountForm");
    addAccountForm.addEventListener("submit", function (e) {
        e.preventDefault();
        addAccount();
    });

    // Auto-refresh data every 5 seconds
    setInterval(() => {
        loadAccounts();
        loadLogs();
        loadDailyReport();
        loadAccountSummary();
    }, 5000);
});

// ===================================================
// 1. ADD NEW ACCOUNT (Triggers INSERT log)
// ===================================================
async function addAccount() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const balance = parseFloat(document.getElementById("balance").value) || 0;
    const messageBox = document.getElementById("addMessage");

    if (!name || !email) {
        showMessage(messageBox, "❌ Name and email are required", "error");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/accounts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                balance: balance
            })
        });

        const data = await response.json();

        if (data.message) {
            showMessage(messageBox, `✅ ${data.message} (ID: ${data.id})`, "success");
            document.getElementById("addAccountForm").reset();
            
            // Reload all data
            setTimeout(() => {
                loadAccounts();
                loadLogs();
                loadDailyReport();
                loadAccountSummary();
            }, 500);
        } else {
            showMessage(messageBox, `❌ ${data.error}`, "error");
        }
    } catch (error) {
        console.error("Error:", error);
        showMessage(messageBox, "❌ Server connection failed", "error");
    }
}

// ===================================================
// 2. LOAD ALL ACCOUNTS
// ===================================================
async function loadAccounts() {
    try {
        const response = await fetch("http://localhost:3000/accounts");
        const accounts = await response.json();
        
        const tbody = document.getElementById("accountsBody");
        
        if (!accounts || accounts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No accounts yet</td></tr>';
            return;
        }

        tbody.innerHTML = "";
        
        accounts.forEach(account => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${account.id}</td>
                <td><strong>${account.name}</strong></td>
                <td>${account.email}</td>
                <td>₹${parseFloat(account.balance).toFixed(2)}</td>
                <td>${new Date(account.created_at).toLocaleString()}</td>
                <td>
                    <button class="btn-edit" onclick="editAccount(${account.id}, '${account.name}', '${account.email}', ${account.balance})">Edit</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading accounts:", error);
        document.getElementById("accountsBody").innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error loading accounts</td></tr>';
    }
}

// ===================================================
// 3. EDIT ACCOUNT (Triggers UPDATE log)
// ===================================================
function editAccount(id, name, email, balance) {
    const newName = prompt(`Edit name for ID ${id}:`, name);
    if (newName === null) return;
    
    const newEmail = prompt(`Edit email for ID ${id}:`, email);
    if (newEmail === null) return;
    
    const newBalance = prompt(`Edit balance for ID ${id}:`, balance);
    if (newBalance === null) return;

    updateAccount(id, newName, newEmail, parseFloat(newBalance));
}

async function updateAccount(id, name, email, balance) {
    try {
        const response = await fetch(`http://localhost:3000/accounts/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                balance: balance
            })
        });

        const data = await response.json();

        if (data.message) {
            alert(`✅ ${data.message}`);
            
            // Reload all data
            setTimeout(() => {
                loadAccounts();
                loadLogs();
                loadDailyReport();
                loadAccountSummary();
            }, 500);
        } else {
            alert(`❌ ${data.error}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("❌ Server connection failed");
    }
}

// ===================================================
// 4. LOAD AUDIT LOGS
// ===================================================
async function loadLogs() {
    try {
        const response = await fetch("http://localhost:3000/logs");
        const logs = await response.json();
        
        const tbody = document.getElementById("logsBody");
        
        if (!logs || logs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No logs yet</td></tr>';
            return;
        }

        tbody.innerHTML = "";
        
        logs.forEach(log => {
            const row = document.createElement("tr");
            
            // Determine old and new values
            let oldValue = "N/A";
            let newValue = "N/A";
            
            if (log.operation_type === "INSERT") {
                newValue = `${log.new_name} (Balance: ₹${parseFloat(log.new_balance).toFixed(2)})`;
                row.className = "log-insert";
            } else if (log.operation_type === "UPDATE") {
                oldValue = `${log.old_name} (Balance: ₹${parseFloat(log.old_balance).toFixed(2)})`;
                newValue = `${log.new_name} (Balance: ₹${parseFloat(log.new_balance).toFixed(2)})`;
                row.className = "log-update";
            }
            
            row.innerHTML = `
                <td>${log.log_id}</td>
                <td>${log.account_id}</td>
                <td><strong>${log.operation_type}</strong></td>
                <td>${oldValue}</td>
                <td>${newValue}</td>
                <td>${new Date(log.action_time).toLocaleString()}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading logs:", error);
        document.getElementById("logsBody").innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error loading logs</td></tr>';
    }
}

// ===================================================
// 5. LOAD DAILY ACTIVITY REPORT (Using View)
// ===================================================
async function loadDailyReport() {
    try {
        const response = await fetch("http://localhost:3000/daily-report");
        const reports = await response.json();
        
        const tbody = document.getElementById("reportBody");
        
        if (!reports || reports.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #999;">No activity yet</td></tr>';
            return;
        }

        tbody.innerHTML = "";
        
        reports.forEach(report => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><strong>${new Date(report.Activity_Date).toDateString()}</strong></td>
                <td>${report.Operation}</td>
                <td><strong>${report.Total_Operations}</strong></td>
                <td>${report.Unique_Accounts}</td>
                <td>${new Date(report.First_Action).toLocaleTimeString()}</td>
                <td>${new Date(report.Last_Action).toLocaleTimeString()}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading daily report:", error);
        document.getElementById("reportBody").innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Error loading report</td></tr>';
    }
}

// ===================================================
// 6. LOAD ACCOUNT ACTIVITY SUMMARY (Using View)
// ===================================================
async function loadAccountSummary() {
    try {
        const response = await fetch("http://localhost:3000/account-summary");
        const summaries = await response.json();
        
        const tbody = document.getElementById("summaryBody");
        
        if (!summaries || summaries.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: #999;">No accounts yet</td></tr>';
            return;
        }

        tbody.innerHTML = "";
        
        summaries.forEach(summary => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${summary.id}</td>
                <td><strong>${summary.name}</strong></td>
                <td>${summary.email}</td>
                <td>₹${parseFloat(summary.balance).toFixed(2)}</td>
                <td><strong>${summary.Total_Changes || 0}</strong></td>
                <td style="color: green;">${summary.Insert_Count || 0}</td>
                <td style="color: orange;">${summary.Update_Count || 0}</td>
                <td>${summary.Last_Modified ? new Date(summary.Last_Modified).toLocaleString() : "N/A"}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error("Error loading account summary:", error);
        document.getElementById("summaryBody").innerHTML = '<tr><td colspan="8" style="text-align: center; color: red;">Error loading summary</td></tr>';
    }
}

// ===================================================
// HELPER: Show Messages
// ===================================================
function showMessage(element, message, type) {
    element.textContent = message;
    element.className = "message " + type;

    setTimeout(() => {
        element.className = "message";
    }, 4000);
}