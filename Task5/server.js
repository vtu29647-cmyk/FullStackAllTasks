require('dotenv').config({ path: '../.env' });

const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const app = express();

app.use(express.json());

// ==============================
// CORS Headers
// ==============================
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    next();
});

// ==============================
// Serve Static Files
// ==============================
app.use(express.static(path.join(__dirname)));

// ==============================
// Database Connection
// ==============================
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME_TASK5
});

db.connect(err => {
    if (err) {
        console.error("❌ MySQL Connection Error:", err.message);
        console.log("⚠️ Server will still run, but payment processing will fail");
        console.log("📝 Make sure MySQL is running and database 'fsTaskDb' exists");
    } else {
        console.log("✅ Connected to MySQL");
    }
});

// ==============================
// Health Check Endpoint
// ==============================
app.get("/health", (req, res) => {
    res.json({ status: "Server is running", port: 3000 });
});

// ==============================
// Get Account Balance
// ==============================
app.get("/balance/:id", (req, res) => {
    const accountId = req.params.id;
    
    db.query("SELECT id, name, balance FROM Accounts WHERE id = ?", [accountId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database Error" });
        }
        
        if (result.length === 0) {
            return res.status(404).json({ error: "Account not found" });
        }
        
        res.json(result[0]);
    });
});

// ==============================
// Get Balances of Both Accounts
// ==============================
app.post("/balances", (req, res) => {
    const { userId, merchantId } = req.body;
    
    db.query("SELECT id, name, balance FROM Accounts WHERE id IN (?, ?)", [userId, merchantId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Database Error" });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: "One or both accounts not found" });
        }
        
        const userAccount = results.find(r => r.id == userId);
        const merchantAccount = results.find(r => r.id == merchantId);
        
        res.json({
            user: userAccount || { id: userId, balance: 0, name: "Not Found" },
            merchant: merchantAccount || { id: merchantId, balance: 0, name: "Not Found" }
        });
    });
});

// ==============================
// Transaction-Based Payment API
// ==============================
app.post("/pay", (req, res) => {

    const { userId, merchantId, amount } = req.body;

    // Check if database is connected
    if (!db) {
        return res.status(500).json({ message: "Payment Failed: Database not connected" });
    }

    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ message: "Payment Failed: Transaction Error - " + err.message });
        }

        // Step 1: Deduct from User
        db.query(
            "UPDATE Accounts SET balance = balance - ? WHERE id = ? AND balance >= ?",
            [amount, userId, amount],
            (err, result) => {

                if (err) {
                    return db.rollback(() => {
                        res.json({ message: "Payment Failed: Database Error" });
                    });
                }

                if (result.affectedRows === 0) {
                    return db.rollback(() => {
                        res.json({ message: "Payment Failed: Insufficient Balance" });
                    });
                }

                // Step 2: Add to Merchant
                db.query(
                    "UPDATE Accounts SET balance = balance + ? WHERE id = ?",
                    [amount, merchantId],
                    (err) => {

                        if (err) {
                            return db.rollback(() => {
                                res.json({ message: "Payment Failed: Merchant Error" });
                            });
                        }

                        // Step 3: Commit
                        db.commit(err => {
                            if (err) {
                                return db.rollback(() => {
                                    res.json({ message: "Commit Failed" });
                                });
                            }

                            // Fetch updated balances
                            db.query("SELECT id, name, balance FROM Accounts WHERE id IN (?, ?)", [userId, merchantId], (err, results) => {
                                if (err) {
                                    return res.json({ message: "Payment Successful ✅" });
                                }
                                
                                const userAccount = results.find(r => r.id == userId);
                                const merchantAccount = results.find(r => r.id == merchantId);
                                
                                res.json({ 
                                    message: "Payment Successful ✅",
                                    userBalance: userAccount ? userAccount.balance : 0,
                                    merchantBalance: merchantAccount ? merchantAccount.balance : 0
                                });
                            });
                        });
                    }
                );
            }
        );
    });
});

// ==============================
// Route Handler
// ==============================
app.listen(3000, () => {
    
    console.log("📄 Open: http://localhost:3000/payment.html");
    
});