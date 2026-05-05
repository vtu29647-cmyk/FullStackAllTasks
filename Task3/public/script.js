document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const userError = document.getElementById("userError");
    const passError = document.getElementById("passError");
    const serverMessage = document.getElementById("serverMessage");

    userError.textContent = "";
    passError.textContent = "";
    serverMessage.textContent = "";

    let valid = true;

    if (username === "") {
        userError.textContent = "Username is required";
        valid = false;
    }

    if (password === "") {
        passError.textContent = "Password is required";
        valid = false;
    } else if (password.length < 6) {
        passError.textContent = "Password must be at least 6 characters";
        valid = false;
    }

    if (!valid) return;

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        serverMessage.textContent = data.message;

        if (response.ok) {
            serverMessage.style.color = "green";
        } else {
            serverMessage.style.color = "red";
        }

    } catch (error) {
        serverMessage.textContent = "Server error!";
        serverMessage.style.color = "red";
    }
});