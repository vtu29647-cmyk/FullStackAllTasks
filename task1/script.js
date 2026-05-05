function login() {
  const name = document.getElementById("name").value;
  const dob = document.getElementById("dob").value;
  const email = document.getElementById("email").value;
  const department = document.getElementById("department").value;
  const phone = document.getElementById("phone").value;

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name,
      dob: dob,
      email: email,
      department: department,
      phone: phone
    })
  })
  .then(response => response.json())
  .then(data => {
    alert(data.message);
    // Optionally reset the form
    document.getElementById("studentForm").reset();
  })
  .catch(error => {
    console.log(error);
  });
}

// Add event listener to the form
document.getElementById('studentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  login();
});