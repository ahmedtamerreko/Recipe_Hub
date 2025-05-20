document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); 

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("Confirmed_pass").value;
    let email = document.getElementById("Email").value.trim();
    let isUser = document.querySelector('input[name="is_user"]:checked').value;

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

    let users = JSON.parse(localStorage.getItem("Users")) || [];

    let usernameExists = users.some(user => user.username === username);
    if (usernameExists) {
        alert("Username already exists. Please choose a different one.");
        return;
    }

  
    let newUser = {
        username: username,
        email: email,
        password: password, 
        isUser: isUser
    };

    users.push(newUser);

    if(isUser === "yes"){
        localStorage.setItem("Users", JSON.stringify(users));
    }

    if (isUser === "no") {
        alert("Then You Will Be Redirected To User Sign In Page ");
        window.location.href = "../../Admin/Html/adminSign-in.html"; 
    } else {
        alert("User account created successfully!");
        window.location.href = "UserSign-in.html"; 
    }
});
