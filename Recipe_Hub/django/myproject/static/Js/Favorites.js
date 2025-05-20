document.addEventListener("DOMContentLoaded", function() {
    loadFavoriteRecipes();
    document.querySelector(".inputsearch").addEventListener("input", filterRecipes);
    document.getElementById("category-filter").addEventListener("change", filterRecipes);
});

function loadFavoriteRecipes() {
    const favoriteRecipes = JSON.parse(localStorage.getItem("favorites")) || [];
    const favoriteList = document.getElementById("favorite-list");

    favoriteList.innerHTML = "";

    if (favoriteRecipes.length === 0) {
        favoriteList.innerHTML = "<p>No favorite recipes yet!</p>";
        return;
    }

    favoriteRecipes.forEach((recipe) => {
        const li = document.createElement("li");
        li.dataset.category = recipe.category;  // Store category for filtering purposes
        li.innerHTML = `
        <img src="${recipe.image}" alt="Recipe Image">
        <div class="recipe-info">
        <a href="recipeDetails.html">
                <h3>${recipe.name} (${recipe.category})</h3>
                <p>Recipe ID: ${recipe.id}</p>
                <p>${recipe.description}</p>
                </a>
            </div>
            <button class="remove-favorite">Remove</button>
        `;

        li.querySelector(".remove-favorite").addEventListener("click", () => {
            removeFromFavorites(recipe.id);
            loadFavoriteRecipes();
        });

        favoriteList.appendChild(li);
    });

    filterRecipes();
}

function removeFromFavorites(recipeId) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter(recipe => recipe.id !== recipeId);
    localStorage.setItem("favorites", JSON.stringify(favorites));

    loadFavoriteRecipes();
}

function filterRecipes() {
    const filterText = document.querySelector(".inputsearch").value.toUpperCase();
    const selectedCategory = document.getElementById("category-filter").value;
    const favoriteList = document.getElementById("favorite-list");
    const li = favoriteList.getElementsByTagName("li");

    for (let i = 0; i < li.length; i++) {
        const recipeName = li[i].querySelector(".recipe-info h3").textContent.toUpperCase();
        const recipeCategory = li[i].dataset.category;

        const matchesText = recipeName.includes(filterText);
        const matchesCategory = selectedCategory === "All" || recipeCategory === selectedCategory;

        li[i].style.display = matchesText && matchesCategory ? "" : "none";
    }
}
const signout=document.querySelector(".sign-out");
signout.addEventListener("click",function(){
    window.location.href="../../adminOrUser.html";
})