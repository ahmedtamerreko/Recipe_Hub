document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();
    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value;
    let users = JSON.parse(localStorage.getItem("Users")) || [];
    let foundUser = users.find(user => user.username === username && user.password === password);
    if (foundUser) {
        alert("Login successfully You Will Be directed to user dashboard...");
        window.location.href = "UserDashboard.html";
    } else {
        alert("Invalid username or password, Please try again.");
    }
});