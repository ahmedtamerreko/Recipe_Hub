document.addEventListener("DOMContentLoaded", () => {
    loadUserRecipes();

    const inputSearch = document.querySelector(".inputsearch");
    const categoryFilter = document.getElementById("category-filter");

    if (inputSearch) inputSearch.addEventListener("keyup", filterRecipes);
    if (categoryFilter) categoryFilter.addEventListener("change", filterRecipes);

    const favButton = document.querySelector("#fav");
    if (favButton) {
        favButton.addEventListener("click", () => {
            window.location.href = "../Html/Favorite.html";
        });
    }

    const signoutButton = document.querySelector(".sign-out");
    if (signoutButton) {
        signoutButton.addEventListener("click", () => {
            window.location.href = "../../adminOrUser.html";
        });
    }

    const firstRecipe = document.querySelector(".firstrecipe");
    if (firstRecipe) {
        firstRecipe.style.cursor = "pointer";
        firstRecipe.addEventListener("click", () => {
            window.location.href = "recipe1.html";
        });
    }
});

let allRecipes = [];
let favorites = [];

async function loadUserRecipes() {
    try {
        const response = await fetch("/api/recipes/");
        if (!response.ok) throw new Error("Failed to fetch recipes from server.");
        allRecipes = await response.json();

        // تحميل المفضلات من localStorage (يمكن استبدالها ب API مستقبلاً)
        favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        renderRecipes(allRecipes);
    } catch (error) {
        console.error(error);
        alert("Error loading recipes.");
    }
}

function renderRecipes(recipes) {
    const recipeList = document.getElementById("recipe-list");
    if (!recipeList) return;
    recipeList.innerHTML = "";

    recipes.forEach(recipe => {
        const isFavorite = favorites.some(fav => fav.id === recipe.id);

        const li = document.createElement("li");
        li.dataset.category = recipe.category || "";
        li.style.cursor = "pointer";

        li.innerHTML = `
            <img src="${recipe.image}" alt="Recipe Image" />
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

        li.addEventListener("click", (e) => {
            if (!e.target.classList.contains("favorite-star") && !e.target.classList.contains("favorite-checkbox")) {
                localStorage.setItem("selectedRecipe", JSON.stringify(recipe));
                window.location.href = "../Html/recipeDetails.html";
            }
        });

        const starElement = li.querySelector(".favorite-star");
        starElement.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleFavorite(recipe, starElement);
        });

        recipeList.appendChild(li);
    });
}

function filterRecipes() {
    const filterText = (document.querySelector(".inputsearch")?.value || "").toUpperCase();
    const selectedCategory = document.getElementById("category-filter")?.value || "All";

    const filtered = allRecipes.filter(recipe => {
        const name = recipe.name.toUpperCase();
        const id = String(recipe.id).toUpperCase();
        const category = recipe.category;

        const matchesText = name.includes(filterText) || id.includes(filterText);
        const matchesCategory = selectedCategory === "All" || category === selectedCategory;

        return matchesText && matchesCategory;
    });

    renderRecipes(filtered);
}

function toggleFavorite(recipe, starElement) {
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
