require('dotenv').config({ path: '../.env' });

//server.js (Backend – Node + Express + MySQL)

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MySQL connection

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME_TASK3
});

db.connect(err => {
  if (err) {
    console.log("Database connection failed");
  } else {
    console.log("Connected to MySQL");
  }
});

// ADD STUDENT
app.post("/login", (req, res) => {
  const { name, department, joiningDate } = req.body;
  const sql = "INSERT INTO StuDash (Name, Department, Joining_Date) VALUES (?, ?, ?)";
  db.query(sql, [name, department, joiningDate], (err, result) => {
    if (err) {
      res.json({ message: "Error adding student", error: err });
    } else {
      res.json({ message: "Student added successfully!" });
    }
  });
});

// GET ALL STUDENTS
app.get("/students", (req, res) => {
  const sql = "SELECT * FROM StuDash";
  db.query(sql, (err, result) => {
    if (err) {
      res.json([]);
    } else {
      res.json(result);
    }
  });
});

// FILTER
app.get("/filter", (req, res) => {
  const department = req.query.department;

  const sql = "SELECT * FROM StuDash WHERE Department = ?";
  db.query(sql, [department], (err, result) => {
    if (err) {
      res.json([]);
    } else {
      res.json(result);
    }
  });
});

// SORT
app.get("/sort", (req, res) => {
  const sortBy = req.query.by;

  let sql = "";

  if (sortBy === "name") {
    sql = "SELECT * FROM StuDash ORDER BY Name ASC";
  } else if (sortBy === "date") {
    sql = "SELECT * FROM StuDash ORDER BY Joining_Date ASC";
  }

  db.query(sql, (err, result) => {
    if (err) {
      res.json([]);
    } else {
      res.json(result);
    }
  });
});

// COUNT BY DEPARTMENT
app.get("/count", (req, res) => {
  const sql = "SELECT Department, COUNT(*) as count FROM StuDash GROUP BY Department";
  db.query(sql, (err, result) => {
    if (err) {
      res.json([]);
    } else {
      res.json(result);
    }
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});