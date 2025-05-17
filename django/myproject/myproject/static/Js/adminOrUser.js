document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".Admin").addEventListener("click", function () {
        window.location.href = "/admin-signin/";
    });

    document.querySelector(".User").addEventListener("click", function () {
        window.location.href = "/user_signin/";
    });
});
