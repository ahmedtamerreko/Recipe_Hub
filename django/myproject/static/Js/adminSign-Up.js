document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("Confirmed_pass").value;
    let email = document.getElementById("Email").value.trim();
    let isAdmin = document.querySelector('input[name="is_admin"]:checked').value;

    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (username === "" || password === "" || confirmPassword === "" || email === "") {
        alert("All fields are required.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("adminUsers")) || [];

    let usernameExists = users.some(user => user.username === username);
    if (usernameExists) {
        alert("Username already exists. Please choose a different one.");
        return;
    }

  
    let newUser = {
        username: username,
        email: email,
        password: password, 
        isAdmin: isAdmin
    };

    users.push(newUser);

    if(isAdmin === "yes"){
        localStorage.setItem("adminUsers", JSON.stringify(users));
    }

    if (isAdmin === "no") {
        alert("Then You Will Be Redirected To User Sign In Page ");
        window.location.href = "../../User/Html/UserSign-in.html"; 
    } else {
        alert("Admin account created successfully!");
        window.location.href = "adminSign_in.html"; 
    }
});
