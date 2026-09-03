function signup() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let user = {
        name: name,
        email: email,
        password: password
    };

    localStorage.setItem("user", JSON.stringify(user));

    alert("Sign Up Successful!");

    window.location.href = "login.html";
}


function login() {
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        alert("Please Sign Up First!");
        return;
    }

    if (user.email === email && user.password === password) {

        localStorage.setItem("isLoggedIn", "true");

        alert("Login Successful!");

        window.location.href = "index.html";

    } else {
        alert("Invalid Email or Password");
    }
}

function logout() {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "index.html";
}