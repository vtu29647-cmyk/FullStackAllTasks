require('dotenv').config({ path: '../.env' });

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME_TASK1
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    console.log("⚠️ Server will run, but database operations will fail");
    console.log("📝 Make sure MySQL is running and database 'login_db' exists");
  } else {
    console.log("✅ Database connected successfully");
  }
});

// Login API
app.post("/login", (req, res) => {
 
  const name = req.body.name;
  const email = req.body.email;
  const dob=req.body.dob;
  const department=req.body.department;
  const phone=req.body.phone;

  const sql = "INSERT INTO participants (name,email,phone,dob,department) VALUES (?,?,?,?,?)";
  db.query(sql, [name,email,phone,dob,department], (err, result) => {
    if (err) {
        console.log("mysql error:"+err);
      return res.json({ message: "error inserting data" });
    } else {
      res.json({ message: "Data inserted successfully" });
    }
  });
});


// GET API - Retrieve all students
app.get("/participants", (req, res) => {

  const sql = "SELECT * FROM participants";

  db.query(sql, (err, result) => {
    if (err) {
      console.log("MySQL Error: " + err);
      return res.json({ message: "Error fetching data" });
    } else {
      res.json(result);   // sends all rows to frontend
    }
  });

});


// START SERVER (MOST IMPORTANT)
app.listen(3000, () => {
  console.log("🚀 Server started on http://localhost:3000");
  console.log("📄 Open: http://localhost:3000/index.html");
  console.log("📋 View participants: http://localhost:3000/participants");
});
