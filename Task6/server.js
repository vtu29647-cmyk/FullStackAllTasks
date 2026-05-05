require('dotenv').config({ path: '../.env' });

const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// ==============================
// CORS Headers
// ==============================
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
    next();
});

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME_TASK6
});

db.connect(err => {
    if (err) {
        console.error("❌ MySQL Connection Error:", err.message);
        console.log("⚠️ Make sure MySQL is running and database 'fsTaskDb' exists");
    } else {
        console.log("✅ MySQL Connected");
    }
});

// ==============================
// GET ALL ACCOUNTS
// ==============================
app.get("/accounts", (req, res) => {
    db.query("SELECT * FROM AccountsT6 ORDER BY id DESC", 
    (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database Error" });
        }
        res.json(result);
    });
});

// ==============================
// GET ALL LOGS
// ==============================
app.get("/logs", (req, res) => {
    db.query("SELECT * FROM Account_Log ORDER BY action_time DESC LIMIT 100", 
    (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database Error" });
        }
        res.json(result);
    });
});

// ==============================
// GET LOGS FOR SPECIFIC DATE
// ==============================
app.get("/logs/date/:date", (req, res) => {
    const date = req.params.date;
    db.query("SELECT * FROM Account_Log WHERE DATE(action_time) = ? ORDER BY action_time DESC", 
    [date],
    (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database Error" });
        }
        res.json(result);
    });
});

// ==============================
// GET DAILY REPORT (View)
// ==============================
app.get("/daily-report", (req, res) => {
    db.query("SELECT * FROM Daily_Activity_Report", 
    (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database Error" });
        }
        res.json(result);
    });
});

// ==============================
// GET ACCOUNT ACTIVITY SUMMARY (View)
// ==============================
app.get("/account-summary", (req, res) => {
    db.query("SELECT * FROM Account_Activity_Summary ORDER BY Total_Changes DESC", 
    (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database Error" });
        }
        res.json(result);
    });
});

// ==============================
// INSERT NEW ACCOUNT (Triggers INSERT log)
// ==============================
app.post("/accounts", (req, res) => {
    const { name, email, balance } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: "Name and email required" });
    }

    db.query("INSERT INTO AccountsT6 (name, email, balance) VALUES (?, ?, ?)",
    [name, email, balance || 0],
    (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database Error: " + err.message });
        }
        res.json({ 
            message: "✅ Account created",
            id: result.insertId,
            name: name,
            email: email,
            balance: balance || 0
        });
    });
});

// ==============================
// UPDATE ACCOUNT (Triggers UPDATE log)
// ==============================
app.put("/accounts/:id", (req, res) => {
    const { name, email, balance } = req.body;
    const id = req.params.id;

    db.query("UPDATE AccountsT6 SET name = ?, email = ?, balance = ? WHERE id = ?",
    [name, email, balance, id],
    (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database Error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Account not found" });
        }
        res.json({ message: "✅ Account updated", id: id });
    });
});

// ==============================
// HEALTH CHECK
// ==============================
app.get("/health", (req, res) => {
    res.json({ status: "Server is running", port: 3000 });
});

app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
    console.log("📄 Open: http://localhost:3000/index.html");
    console.log("🏥 Health Check: http://localhost:3000/health");
});