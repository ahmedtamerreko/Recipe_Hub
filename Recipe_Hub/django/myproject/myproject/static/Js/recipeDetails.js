document.addEventListener("DOMContentLoaded", function () {
    const recipeDetails = JSON.parse(localStorage.getItem("selectedRecipe"));

    if (recipeDetails) {
        document.getElementById("recipe-image").src = recipeDetails.image || "../Image/default.jpg";
        document.getElementById("recipe-name").textContent = recipeDetails.name;
        document.getElementById("recipe-category").textContent = recipeDetails.category;
        document.getElementById("recipe-description").textContent = recipeDetails.description;
    } else {
        document.getElementById("recipe-name").textContent = "No Recipe Selected";
    }
});
