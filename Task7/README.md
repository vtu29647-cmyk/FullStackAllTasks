# Task 7: Interactive Web Form with Events & Functions

## 📋 Description
An interactive customer feedback form demonstrating various JavaScript events, validation functions, and DOM manipulation techniques. The form provides real-time validation, hover effects, and a unique double-click submit mechanism.

---

## 🎯 Features Implemented

### 1. **Real-Time Validation (Keypress Events)**
- ✅ Name validation - Letters only, 3-50 characters
- ✅ Email validation - Proper email format
- ✅ Phone validation - Exactly 10 digits, numeric only
- ✅ Rating validation - Mandatory selection
- ✅ Category validation - Mandatory selection
- ✅ Comments validation - 10-500 characters with live counter

### 2. **Mouse Hover Effects**
- ✅ Input fields highlight on hover
- ✅ Labels animate when hovering over fields
- ✅ Smooth transitions and scaling effects
- ✅ Card elevation on hover

### 3. **Double-Click Submit Confirmation**
- ✅ First click shows "Click Again to Confirm"
- ✅ Changes button color to orange
- ✅ Resets after 2 seconds if not confirmed
- ✅ Second click submits the form
- ✅ Prevents accidental submissions

### 4. **Reusable Validation Functions**
- ✅ `validateName()` - Validates name fields
- ✅ `validateEmail()` - Validates email format
- ✅ `validatePhone()` - Validates phone numbers
- ✅ `validateRating()` - Validates rating selection
- ✅ `validateCategory()` - Validates category selection
- ✅ `validateComments()` - Validates comment length

### 5. **Visual Feedback**
- ✅ Green border & checkmark for valid fields
- ✅ Red border & shake animation for invalid fields
- ✅ Character counter for comments (color-coded)
- ✅ Real-time validation messages
- ✅ Success/Error messages on submission

### 6. **Database Integration**
- ✅ Store feedback in MySQL database
- ✅ Display all submitted feedbacks
- ✅ Show statistics (total, average rating, excellent count)
- ✅ Timestamp for each feedback

---

## 🗄️ SQL Setup

### Option 1: Direct MySQL Execution

```bash
mysql -u root -p
```

```sql
USE fsTaskDb;
source database.sql;
```

### Option 2: Command Line

```bash
mysql -u root -p fsTaskDb < database.sql
```

---

## 📝 Database Structure

### Feedbacks Table
```sql
CREATE TABLE feedbacks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    category VARCHAR(50) NOT NULL,
    comments TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 How to Run

### 1. Setup Database
```bash
mysql -u root -p fsTaskDb < database.sql
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Server
```bash
npm start
```
or
```bash
node server.js
```

### 4. Open in Browser
```
http://localhost:3000/index.html
```

---

## 🎨 Interactive Features Demonstration

### Feature 1: Real-Time Validation
1. **Start typing in name field** → Instant validation
2. **Type less than 3 characters** → Red error message
3. **Type valid name** → Green success message

### Feature 2: Hover Effects
1. **Hover over any input field** → Field scales and highlights
2. **Move mouse over fields** → Labels change color
3. **Hover over cards** → Cards elevate with shadow

### Feature 3: Character Counter
1. **Type in comments field** → Counter updates live
2. **Less than 10 characters** → Red color
3. **10-100 characters** → Orange color
4. **More than 100 characters** → Green color

### Feature 4: Double-Click Submit
1. **Click submit once** → Button turns orange "Click Again to Confirm"
2. **Wait 2 seconds** → Button resets
3. **Click twice quickly** → Form submits
4. **Prevents accidental submissions**

---

## 📊 API Endpoints

### POST /feedback
Submit new feedback
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "rating": "5",
  "category": "Product Quality",
  "comments": "Excellent service!"
}
```

### GET /feedbacks
Retrieve all feedbacks
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "rating": 5,
    "category": "Product Quality",
    "comments": "Excellent service!",
    "created_at": "2026-02-23T10:30:00.000Z"
  }
]
```

### GET /statistics
Get feedback statistics
```json
{
  "total": 10,
  "avg_rating": 4.2,
  "excellent_count": 5,
  "good_count": 8,
  "poor_count": 1
}
```

---

## 🔧 JavaScript Functions Breakdown

### Validation Functions
```javascript
validateName(name)       // Returns {valid: boolean, message: string}
validateEmail(email)     // Email format validation
validatePhone(phone)     // 10-digit numeric validation
validateRating(rating)   // Selection validation
validateCategory(cat)    // Selection validation
validateComments(text)   // Length validation (10-500 chars)
```

### Event Listeners
```javascript
keyup     // Real-time validation on typing
keypress  // Restrict input (e.g., numbers only for phone)
change    // Validate dropdown selections
mouseenter // Hover effects
mouseleave // Reset hover effects
focus     // Shake animation for invalid fields
click     // Double-click submit logic
```

### Helper Functions
```javascript
showValidation()     // Display validation messages
showMessage()        // Show success/error messages
resetSubmitButton()  // Reset submit button state
clearAllValidations() // Clear all validation states
loadFeedbacks()      // Fetch and display feedbacks
loadStatistics()     // Calculate and display stats
```

---

## 🎯 JavaScript Concepts Covered

✅ **Event Handling**
- `keyup`, `keypress`, `change`, `click`, `mouseenter`, `mouseleave`

✅ **DOM Manipulation**
- `getElementById()`, `querySelector()`, `createElement()`
- `classList.add/remove()`, `style` property

✅ **Form Validation**
- Regular expressions (regex)
- Pattern matching
- Length validation

✅ **Functions**
- Reusable validation functions
- Arrow functions
- Async/await functions

✅ **Event Prevention**
- `preventDefault()`
- Custom submit logic

✅ **Timers**
- `setTimeout()` for button reset
- `setInterval()` for auto-refresh

✅ **Fetch API**
- POST requests (submit data)
- GET requests (retrieve data)
- Error handling

---

## 🌐 Real-Time Usage Examples

### 1. **Customer Feedback Systems**
- E-commerce websites
- Service providers
- Product reviews

### 2. **Survey Forms**
- Market research
- Employee satisfaction
- Event feedback

### 3. **Contact Forms**
- Support tickets
- Inquiry forms
- Lead generation

### 4. **Complaint Management**
- Customer complaints
- Issue reporting
- Quality feedback

---

## 📚 Learning Outcomes

After completing this task, you will understand:

✅ Event-driven programming in JavaScript
✅ Real-time form validation techniques
✅ DOM manipulation and styling
✅ Reusable function design
✅ User experience enhancement
✅ RESTful API integration
✅ MySQL database operations
✅ Async/await and Promises
✅ CSS animations and transitions
✅ Responsive design principles

---

## 🎨 Design Highlights

- **Gradient Backgrounds** - Modern purple gradient theme
- **Card-based Layout** - Clean, organized sections
- **Smooth Animations** - Hover, focus, and validation effects
- **Color-coded Feedback** - Green for valid, red for invalid
- **Responsive Design** - Works on all screen sizes
- **Custom Scrollbar** - Gradient-themed scrollbar

---

## 🔍 Testing Checklist

- [ ] All fields show validation on keypress
- [ ] Hover effects work on all input fields
- [ ] Double-click submit mechanism works
- [ ] Character counter updates in real-time
- [ ] Success message appears after submission
- [ ] Feedbacks display correctly
- [ ] Statistics update automatically
- [ ] All validations prevent invalid data
- [ ] Error messages are clear and helpful
- [ ] Form resets after successful submission

---

## 📞 Key Concepts

**Form Validation** - Ensures data quality before submission
**Event Handling** - Makes forms interactive and responsive
**User Experience** - Visual feedback improves usability
**Reusability** - Functions can be used across multiple forms
**Database Integration** - Store and retrieve user data

---

**© 2026 Task 7 - Interactive Web Form | DBMS Mini Project | VelTech**
