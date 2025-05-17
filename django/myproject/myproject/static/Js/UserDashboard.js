document.addEventListener("DOMContentLoaded", () => {
    loadUserRecipes();
    
    document.querySelector(".inputsearch").addEventListener("keyup", filterRecipes);
    document.getElementById("category-filter").addEventListener("change", filterRecipes);
});

function filterRecipes() {
    let filterText = document.querySelector(".inputsearch").value.toUpperCase();
    let selectedCategory = document.getElementById("category-filter").value;
    let recipeList = document.getElementById("recipe-list");
    let li = recipeList.getElementsByTagName("li");

    for (let i = 0; i < li.length; i++) {
        let recipeName = li[i].querySelector(".recipe-info h3").textContent.toUpperCase();
        let recipeId = li[i].querySelector(".recipe-id").textContent.toUpperCase();
        let recipeCategory = li[i].dataset.category;
        let matchesText = recipeName.includes(filterText)||recipeId.includes(filterText);
        let matchesCategory = selectedCategory === "All" || recipeCategory === selectedCategory
        li[i].style.display = matchesText && matchesCategory ? "" : "none";
    }
}

function loadUserRecipes() {
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const recipeList = document.getElementById("recipe-list");

    

    recipes.forEach((recipe) => {
        const isFavorite = favorites.some(fav => fav.id === recipe.id);

        const li = document.createElement("li");
        li.dataset.category = recipe.category;
        li.innerHTML = `
            <img src="${recipe.image}" alt="Recipe Image">
            <div class="recipe-info">
                <h3>${recipe.name} (${recipe.category})</h3>
                <p class="recipe-id">Recipe ID: ${recipe.id}</p>
                <p>${recipe.description}</p>
            </div>
            <label class="favorite-container">
                <input type="checkbox" class="favorite-checkbox" style="display: none;">
                <span class="favorite-star">${isFavorite ? "⭐" : "☆"}</span>
            </label>
        `;
        li.style="cursor:pointer;"
        li.addEventListener("click", function (e) {
            if(!e.target.classList.contains("favorite-star")&&!e.target.classList.contains("favorite-checkbox")){
            localStorage.setItem("selectedRecipe", JSON.stringify(recipe));
            window.location.href = "../Html/recipeDetails.html";
    }});

        li.querySelector(".favorite-star").addEventListener("click", function () {
            toggleFavorite(recipe, this);
        });

        recipeList.appendChild(li);
    });
}

function toggleFavorite(recipe, starElement) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const index = favorites.findIndex(fav => fav.id === recipe.id);

    if (index === -1) {
        favorites.push(recipe);
        starElement.textContent = "⭐"; 
    } else {
        favorites.splice(index, 1);
        starElement.textContent = "☆"; 
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
}
let fav = document.querySelector("#fav")
fav.addEventListener("click",function(){
    window.location.href="../Html/Favorite.html";
})
const signoutButton=document.querySelector(".sign-out");
signoutButton.addEventListener("click",function(){
    window.location.href="../../adminOrUser.html"
})
const firstrecipe=document.querySelector(".firstrecipe");
firstrecipe.addEventListener("click",function(){
    window.location.href="recipe1.html";
})
firstrecipe.style="cursor:pointer";