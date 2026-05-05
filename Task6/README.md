# Task 6: Automated Logging using Triggers & Views

## 📋 Description
This system demonstrates **automated audit logging** using MySQL triggers and views. Every INSERT or UPDATE operation on the Accounts table is automatically logged, and views provide real-time activity reports.

## 🎯 Features Implemented

### 1. **Triggers**
- ✅ `account_insert_log` - Logs every INSERT into Accounts table
- ✅ `account_update_log` - Logs every UPDATE on Accounts table

### 2. **Views**
- ✅ `Daily_Activity_Report` - Shows daily activity statistics
- ✅ `Account_Activity_Summary` - Shows account modification history

### 3. **API Endpoints**
- `GET /accounts` - Get all accounts
- `POST /accounts` - Create new account (triggers INSERT log)
- `PUT /accounts/:id` - Update account (triggers UPDATE log)
- `GET /logs` - Get all audit logs
- `GET /daily-report` - Get daily activity report (view)
- `GET /account-summary` - Get account activity summary (view)

### 4. **Frontend Features**
- ➕ Add new accounts
- ✏️ Edit existing accounts
- 📜 View all audit logs
- 📊 Daily activity reports
- 📈 Account activity summary

---

## 🗄️ SQL Setup

### Option 1: Direct MySQL Execution (RECOMMENDED)

1. **Login to MySQL:**
```bash
mysql -u root -p
```

2. **Select Database:**
```sql
USE fsTaskDb;
```

3. **Copy & Paste the entire SQL from `database.sql` file:**

The `database.sql` file contains:
- Table creation for `Accounts` and `Account_Log`
- Two triggers for INSERT and UPDATE logging
- Two views for reporting
- Sample data insertion

### Option 2: Using Command Line

```bash
mysql -u root -p fsTaskDb < database.sql
```

---

## 📝 SQL Code Breakdown

### 1. **Accounts Table**
```sql
CREATE TABLE Accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    balance DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. **Audit Log Table**
```sql
CREATE TABLE Account_Log (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    account_id INT,
    operation_type VARCHAR(20),
    old_name VARCHAR(100),
    old_email VARCHAR(100),
    old_balance DECIMAL(10, 2),
    new_name VARCHAR(100),
    new_email VARCHAR(100),
    new_balance DECIMAL(10, 2),
    action_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES Accounts(id)
);
```

### 3. **INSERT Trigger**
```sql
CREATE TRIGGER account_insert_log
AFTER INSERT ON Accounts
FOR EACH ROW
BEGIN
    INSERT INTO Account_Log (
        account_id, operation_type, new_name, new_email, new_balance, action_time
    ) VALUES (
        NEW.id, 'INSERT', NEW.name, NEW.email, NEW.balance, CURRENT_TIMESTAMP
    );
END;
```

### 4. **UPDATE Trigger**
```sql
CREATE TRIGGER account_update_log
AFTER UPDATE ON Accounts
FOR EACH ROW
BEGIN
    INSERT INTO Account_Log (
        account_id, operation_type,
        old_name, old_email, old_balance,
        new_name, new_email, new_balance, action_time
    ) VALUES (
        NEW.id, 'UPDATE',
        OLD.name, OLD.email, OLD.balance,
        NEW.name, NEW.email, NEW.balance, CURRENT_TIMESTAMP
    );
END;
```

### 5. **Daily Activity Report View**
```sql
CREATE VIEW Daily_Activity_Report AS
SELECT
    DATE(action_time) as Activity_Date,
    operation_type as Operation,
    COUNT(*) as Total_Operations,
    COUNT(DISTINCT account_id) as Unique_Accounts,
    MIN(action_time) as First_Action,
    MAX(action_time) as Last_Action
FROM Account_Log
GROUP BY DATE(action_time), operation_type
ORDER BY Activity_Date DESC, operation_type;
```

### 6. **Account Activity Summary View**
```sql
CREATE VIEW Account_Activity_Summary AS
SELECT
    a.id, a.name, a.email, a.balance,
    COUNT(l.log_id) as Total_Changes,
    SUM(CASE WHEN l.operation_type = 'INSERT' THEN 1 ELSE 0 END) as Insert_Count,
    SUM(CASE WHEN l.operation_type = 'UPDATE' THEN 1 ELSE 0 END) as Update_Count,
    MAX(l.action_time) as Last_Modified
FROM Accounts a
LEFT JOIN Account_Log l ON a.id = l.account_id
GROUP BY a.id, a.name, a.email, a.balance;
```

---

## 🚀 How to Run

### 1. **Setup Database**
- Run the `database.sql` file in MySQL (see SQL Setup section)

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Start Server**
```bash
npm start
```

### 4. **Open in Browser**
```
http://localhost:3000/index.html
```

---

## 📊 What You'll See

### Dashboard Panels:

1. **➕ Add New Account**
   - Create new accounts (triggers INSERT log)
   - Auto-logged to Account_Log table

2. **📋 All Accounts**
   - View all accounts
   - Edit button to modify accounts (triggers UPDATE log)

3. **📜 Audit Logs**
   - Shows last 100 operations
   - Color-coded: Green for INSERT, Yellow for UPDATE
   - Old vs New values comparison

4. **📊 Daily Activity Report**
   - View from Daily_Activity_Report
   - Daily statistics for INSERT/UPDATE operations
   - Shows unique accounts modified per day

5. **📈 Account Activity Summary**
   - View from Account_Activity_Summary
   - Total changes per account
   - Insert/Update counts
   - Last modification timestamp

---

## 🔄 Real-Time Usage

The frontend **auto-refreshes every 5 seconds**, so you'll see:
- New logs appearing instantly
- Daily reports updating
- Account summaries changing in real-time

---

## 🧪 Testing Workflow

1. **Add Account** → See INSERT log appear
2. **Edit Account** → See UPDATE log appear
3. **Check Daily Report** → See statistics updated
4. **Check Account Summary** → See change counts updated

---

## 📚 Database Concepts Covered

✅ **Triggers** - Automatic audit logging
✅ **Views** - Real-time reporting
✅ **Foreign Keys** - Relational integrity
✅ **Aggregation Functions** - COUNT, SUM, GROUP BY
✅ **Date Functions** - DATE(), MIN(), MAX()
✅ **CASE Statements** - Conditional aggregation

---

## Real-Time Usage Examples

- **Banking Systems** - Every transaction is logged
- **E-commerce Platforms** - Product updates tracked
- **Healthcare Systems** - Patient record changes audited
- **Enterprise Software** - Compliance and audit trails

---

## 📞 Key Points to Remember

- Triggers run **automatically after** INSERT/UPDATE
- Views are **virtual tables** (no physical storage)
- Logs are **immutable** for audit compliance
- Views can be **queried like regular tables**
- Data is **real-time** without manual intervention

---

**© 2026 Task 6 - DBMS Mini Project | VelTech**
