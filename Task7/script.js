// ===================================================
// Task 7: Interactive Web Form (Frontend Only)
// No Backend/Database Required - Uses LocalStorage
// ===================================================

// ===================================================
// 1. REUSABLE VALIDATION FUNCTIONS
// ===================================================

function validateName(name) {
    if (!name || name.trim().length === 0) {
        return { valid: false, message: "❌ Name is required" };
    }
    if (name.length < 3) {
        return { valid: false, message: "❌ Name must be at least 3 characters" };
    }
    if (name.length > 50) {
        return { valid: false, message: "❌ Name must be less than 50 characters" };
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return { valid: false, message: "❌ Name can only contain letters" };
    }
    return { valid: true, message: "✅ Valid name" };
}

function validateEmail(email) {
    if (!email || email.trim().length === 0) {
        return { valid: false, message: "❌ Email is required" };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, message: "❌ Invalid email format" };
    }
    return { valid: true, message: "✅ Valid email" };
}

function validatePhone(phone) {
    if (!phone || phone.trim().length === 0) {
        return { valid: false, message: "❌ Phone is required" };
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        return { valid: false, message: "❌ Phone must be exactly 10 digits" };
    }
    return { valid: true, message: "✅ Valid phone number" };
}

function validateRating(rating) {
    if (!rating || rating === "") {
        return { valid: false, message: "❌ Please select a rating" };
    }
    return { valid: true, message: "✅ Rating selected" };
}

function validateCategory(category) {
    if (!category || category === "") {
        return { valid: false, message: "❌ Please select a category" };
    }
    return { valid: true, message: "✅ Category selected" };
}

function validateComments(comments) {
    if (!comments || comments.trim().length === 0) {
        return { valid: false, message: "❌ Comments are required" };
    }
    if (comments.length < 10) {
        return { valid: false, message: `❌ Comments must be at least 10 characters (${comments.length}/10)` };
    }
    if (comments.length > 500) {
        return { valid: false, message: "❌ Comments must be less than 500 characters" };
    }
    return { valid: true, message: "✅ Valid comments" };
}

function showValidation(fieldId, validation) {
    const msgElement = document.getElementById(`${fieldId}-msg`);
    const inputElement = document.getElementById(fieldId);
    
    if (validation.valid) {
        msgElement.textContent = validation.message;
        msgElement.className = "validation-msg success";
        inputElement.classList.remove("invalid");
        inputElement.classList.add("valid");
    } else {
        msgElement.textContent = validation.message;
        msgElement.className = "validation-msg error";
        inputElement.classList.remove("valid");
        inputElement.classList.add("invalid");
    }
}

// ===================================================
// 2. REAL-TIME VALIDATION ON KEYPRESS/INPUT
// ===================================================

document.addEventListener("DOMContentLoaded", function () {

    // Name field - validate on keypress
    const nameField = document.getElementById("name");
    nameField.addEventListener("keyup", function () {
        const validation = validateName(this.value);
        showValidation("name", validation);
    });

    // Email field - validate on keypress
    const emailField = document.getElementById("email");
    emailField.addEventListener("keyup", function () {
        const validation = validateEmail(this.value);
        showValidation("email", validation);
    });

    // Phone field - validate on keypress (only allow numbers)
    const phoneField = document.getElementById("phone");
    phoneField.addEventListener("keypress", function (e) {
        // Allow only numbers
        if (!/[0-9]/.test(e.key)) {
            e.preventDefault();
        }
    });
    phoneField.addEventListener("keyup", function () {
        const validation = validatePhone(this.value);
        showValidation("phone", validation);
    });

    // Rating field - validate on change
    const ratingField = document.getElementById("rating");
    ratingField.addEventListener("change", function () {
        const validation = validateRating(this.value);
        showValidation("rating", validation);
    });

    // Category field - validate on change
    const categoryField = document.getElementById("category");
    categoryField.addEventListener("change", function () {
        const validation = validateCategory(this.value);
        showValidation("category", validation);
    });

    // Comments field - validate on keyup and show character count
    const commentsField = document.getElementById("comments");
    const charCount = document.getElementById("char-count");
    
    commentsField.addEventListener("keyup", function () {
        const validation = validateComments(this.value);
        showValidation("comments", validation);
        charCount.textContent = this.value.length;
        
        // Change color based on length
        if (this.value.length < 10) {
            charCount.style.color = "red";
        } else if (this.value.length < 100) {
            charCount.style.color = "orange";
        } else {
            charCount.style.color = "green";
        }
    });

    // ===================================================
    // 3. HOVER EFFECTS (Additional to CSS)
    // ===================================================

    const allInputs = document.querySelectorAll("input, textarea, select");
    
    allInputs.forEach(input => {
        // Mouse enter - minimal highlight
        input.addEventListener("mouseenter", function () {
            const formGroup = this.closest(".form-group");
            if (formGroup) {
                const label = formGroup.querySelector("label");
                if (label) {
                    label.style.color = "#e0e0e0";
                    label.style.transition = "color 0.2s ease";
                }
            }
        });

        // Mouse leave - reset label
        input.addEventListener("mouseleave", function () {
            const formGroup = this.closest(".form-group");
            if (formGroup) {
                const label = formGroup.querySelector("label");
                if (label) {
                    label.style.color = "#c0c0c0";
                }
            }
        });

        // Focus - shake animation for invalid fields
        input.addEventListener("focus", function () {
            if (this.classList.contains("invalid")) {
                this.style.animation = "shake 0.3s";
                setTimeout(() => {
                    this.style.animation = "";
                }, 300);
            }
        });
    });

    // ===================================================
    // 4. DOUBLE-CLICK SUBMIT CONFIRMATION
    // ===================================================

    const submitBtn = document.getElementById("submitBtn");
    let clickCount = 0;
    let clickTimer = null;

    submitBtn.addEventListener("click", function (e) {
        e.preventDefault();
        
        clickCount++;
        
        if (clickCount === 1) {
            // First click
            submitBtn.textContent = "🖱️ Click Again to Confirm!";
            submitBtn.style.background = "#ff9800";
            
            // Reset after 2 seconds if not clicked again
            clickTimer = setTimeout(() => {
                clickCount = 0;
                submitBtn.textContent = "🖱️ Double-Click to Submit";
                submitBtn.style.background = "#4a4a62";
            }, 2000);
            
        } else if (clickCount === 2) {
            // Second click - submit form
            clearTimeout(clickTimer);
            clickCount = 0;
            submitBtn.textContent = "✅ Submitting...";
            submitBtn.style.background = "#4caf50";
            
            // Validate and submit
            handleFormSubmit();
        }
    });

    // ===================================================
    // 5. FORM SUBMISSION HANDLER
    // ===================================================

    function handleFormSubmit() {
        // Get all values
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const rating = document.getElementById("rating").value;
        const category = document.getElementById("category").value;
        const comments = document.getElementById("comments").value;

        // Validate all fields
        const nameVal = validateName(name);
        const emailVal = validateEmail(email);
        const phoneVal = validatePhone(phone);
        const ratingVal = validateRating(rating);
        const categoryVal = validateCategory(category);
        const commentsVal = validateComments(comments);

        // Show validations
        showValidation("name", nameVal);
        showValidation("email", emailVal);
        showValidation("phone", phoneVal);
        showValidation("rating", ratingVal);
        showValidation("category", categoryVal);
        showValidation("comments", commentsVal);

        // Check if all valid
        if (nameVal.valid && emailVal.valid && phoneVal.valid && 
            ratingVal.valid && categoryVal.valid && commentsVal.valid) {
            
            // Create feedback object
            const feedback = {
                id: Date.now(),
                name, email, phone, rating, category, comments,
                timestamp: new Date().toISOString()
            };

            // Save to localStorage
            saveFeedback(feedback);
            
            showMessage("✅ Thank you! Your feedback has been submitted successfully.", "success");
            document.getElementById("feedbackForm").reset();
            clearAllValidations();
            document.getElementById("char-count").textContent = "0";
            
            // Reload feedbacks
            setTimeout(() => {
                loadFeedbacks();
                loadStatistics();
            }, 1000);
        } else {
            showMessage("❌ Please fix all validation errors before submitting", "error");
        }

        resetSubmitButton();
    }

    function clearAllValidations() {
        const allMsgs = document.querySelectorAll(".validation-msg");
        allMsgs.forEach(msg => {
            msg.textContent = "";
            msg.className = "validation-msg";
        });

        const allFields = document.querySelectorAll("input, textarea, select");
        allFields.forEach(field => {
            field.classList.remove("valid", "invalid");
        });
    }

    function resetSubmitButton() {
        setTimeout(() => {
            submitBtn.textContent = "🖱️ Double-Click to Submit";
            submitBtn.style.background = "#4a4a62";
        }, 1500);
    }

    function showMessage(message, type) {
        const msgBox = document.getElementById("responseMessage");
        msgBox.textContent = message;
        msgBox.className = "message " + type;
        msgBox.style.display = "block";

        setTimeout(() => {
            msgBox.style.display = "none";
        }, 5000);
    }

    // ===================================================
    // 6. LOCALSTORAGE FUNCTIONS
    // ===================================================

    function saveFeedback(feedback) {
        let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
        feedbacks.push(feedback);
        localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
    }

    function getFeedbacks() {
        return JSON.parse(localStorage.getItem("feedbacks")) || [];
    }

    // ===================================================
    // 7. LOAD AND DISPLAY FEEDBACKS
    // ===================================================

    loadFeedbacks();
    loadStatistics();

});

function loadFeedbacks() {
    const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    const feedbacksList = document.getElementById("feedbacksList");
    const feedbackCount = document.getElementById("feedbackCount");

    feedbackCount.textContent = feedbacks.length;

    if (feedbacks.length === 0) {
        feedbacksList.innerHTML = '<p style="text-align: center; color: #999;">No feedbacks yet</p>';
        return;
    }

    feedbacksList.innerHTML = "";

    // Sort by timestamp (latest first)
    feedbacks.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    feedbacks.forEach((feedback, index) => {
        const feedbackCard = document.createElement("div");
        feedbackCard.className = "feedback-item";
        feedbackCard.innerHTML = `
            <div class="feedback-header">
                <h4>👤 ${feedback.name}</h4>
                <span class="rating-badge">${getRatingStars(feedback.rating)}</span>
            </div>
            <p><strong>📧 Email:</strong> ${feedback.email}</p>
            <p><strong>📱 Phone:</strong> ${feedback.phone}</p>
            <p><strong>🏷️ Category:</strong> ${feedback.category}</p>
            <p><strong>💬 Comments:</strong> ${feedback.comments}</p>
            <p class="feedback-time">⏰ ${new Date(feedback.timestamp).toLocaleString()}</p>
            <button class="btn-delete-small" onclick="deleteFeedback(${feedback.id})">🗑️ Delete</button>
        `;
        feedbacksList.appendChild(feedbackCard);
    });
}

function loadStatistics() {
    const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

    if (feedbacks.length > 0) {
        const total = feedbacks.length;
        const avgRating = (feedbacks.reduce((sum, f) => sum + parseInt(f.rating), 0) / total).toFixed(1);
        const excellentCount = feedbacks.filter(f => parseInt(f.rating) === 5).length;

        document.getElementById("totalFeedbacks").textContent = total;
        document.getElementById("avgRating").textContent = avgRating;
        document.getElementById("excellentCount").textContent = excellentCount;
    } else {
        document.getElementById("totalFeedbacks").textContent = "0";
        document.getElementById("avgRating").textContent = "0.0";
        document.getElementById("excellentCount").textContent = "0";
    }
}

function getRatingStars(rating) {
    const stars = "⭐".repeat(parseInt(rating));
    return stars + ` (${rating}/5)`;
}

function deleteFeedback(id) {
    if (confirm("Are you sure you want to delete this feedback?")) {
        let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
        feedbacks = feedbacks.filter(f => f.id !== id);
        localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
        loadFeedbacks();
        loadStatistics();
    }
}

function clearAllFeedbacks() {
    if (confirm("Are you sure you want to delete ALL feedbacks? This cannot be undone!")) {
        localStorage.removeItem("feedbacks");
        loadFeedbacks();
        loadStatistics();
        alert("✅ All feedbacks have been cleared!");
    }
}
