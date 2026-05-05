require('dotenv').config({ path: '../.env' });

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME_TASK3
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL");
    }
});
// GET ALL data
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, result) => {
    if (err) {
      res.json([]);
    } else {
      res.json(result);
    }
  });
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    console.log("Incoming:", username, password);

    if (!username || !password) {
        return res.status(400).json({ message: "All fields required" });
    }

    db.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        async (err, results) => {

            if (err) {
                console.log("DB ERROR:", err);
                return res.status(500).json({ message: "Server error" });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: "Invalid Username or Password" });
            }

            const user = results[0];

            if (user.password === password) {
                res.json({ message: "Login Successful!" });
            } else {
                res.status(401).json({ message: "Invalid Username or Password" });
            }
        }
    );
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});