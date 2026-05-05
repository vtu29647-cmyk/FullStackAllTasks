require('dotenv').config({ path: '../.env' });

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME_TASK4
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed");
    console.log(err);
  } else {
    console.log("Database connected");
  }
});

// ============================================
// 1️⃣ Display Customer Order History (JOIN)
// ============================================
app.get("/order-history", (req, res) => {

    const query = `
        SELECT 
    c.name,
    p.product_name,
    o.quantity,
    (p.price * o.quantity) AS total_amount,
    o.order_date
FROM Orders o
JOIN Customers c ON o.customer_id = c.customer_id
JOIN Products p ON o.product_id = p.product_id
ORDER BY o.order_date DESC;
    `;

    db.query(query, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});


// ============================================
// 2️⃣ Highest Value Order (Subquery)
// ============================================
app.get("/highest-order", (req, res) => {

    const query = `
       SELECT *
FROM Orders o
JOIN Products p ON o.product_id = p.product_id
WHERE (p.price * o.quantity) = (
    SELECT MAX(p2.price * o2.quantity)
    FROM Orders o2
    JOIN Products p2 ON o2.product_id = p2.product_id
)
    `;

    db.query(query, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});


// ============================================
// 3️⃣ Most Active Customer (Subquery)
// ============================================
app.get("/most-active-customer", (req, res) => {

    const query = `
       SELECT customer_id, COUNT(*) AS total_orders
FROM Orders
GROUP BY customer_id
ORDER BY total_orders DESC
LIMIT 1;
    `;

    db.query(query, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});



// START SERVER (MOST IMPORTANT)
app.listen(3000, () => {
  console.log("Server started on port 3000");
});