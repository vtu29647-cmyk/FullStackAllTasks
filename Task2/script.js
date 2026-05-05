function loadStudents() {
  fetch("http://localhost:3000/students")
    .then(res => res.json())
    .then(data => {
      renderTable(data);
      loadCount();
    });
}

function renderTable(data){
    const tableBody=document.querySelector("#studentTable tbody");
    tableBody.innerHTML="";
    data.forEach(student=>{
        const row=document.createElement("tr");
        // Format date to show only date part (YYYY-MM-DD)
        const dateOnly = student.Joining_Date ? student.Joining_Date.split('T')[0] : '';
        row.innerHTML=`
        <td>${student.Name}</td>
        <td>${student.Department}</td>
        <td>${dateOnly}</td>
        `;
        tableBody.appendChild(row);
    });
}


function login() {
  const name = document.getElementById("name").value;
  const department = document.getElementById("department").value;
  const joiningDate = document.getElementById("joiningDate").value;

  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, department, joiningDate })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message);
    document.getElementById("studentForm").reset();
    loadStudents();   // 🔥 refresh table automatically
  });
}

// COUNT
function loadCount() {
  fetch("http://localhost:3000/count")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("countList");
      list.innerHTML = "";
      data.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.Department} - ${item.count}`;
        list.appendChild(li);
      });
    });
}

document.addEventListener("DOMContentLoaded", function () {
  loadStudents();
  loadCount();

  // Fetch filtered data
  document.getElementById("filterDepartment").addEventListener("change", function() {
     if (this.value === "all") {
      loadStudents();  // Load all students
    } else {
      fetch(`http://localhost:3000/filter?department=${this.value}`)
        .then(res => res.json())
        .then(data => renderTable(data));
    }
  });

  // SORT NAME
  document.getElementById("sortName").addEventListener("click", function() {
    fetch("http://localhost:3000/sort?by=name")
      .then(res => res.json())
      .then(data => renderTable(data));
  });

  // SORT DATE
  document.getElementById("sortDate").addEventListener("click", function() {
    fetch("http://localhost:3000/sort?by=date")
      .then(res => res.json())
      .then(data => renderTable(data));
  });
});