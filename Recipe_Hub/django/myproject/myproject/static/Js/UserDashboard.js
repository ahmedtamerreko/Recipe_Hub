document.addEventListener("DOMContentLoaded", () => {
    loadUserRecipes();
    document.querySelector(".inputsearch").addEventListener("keyup", filterRecipes);
    document.getElementById("category-filter").addEventListener("change", filterRecipes);
});

let recipes = [];

async function loadUserRecipes() {
    try {
        const filterText = document.querySelector(".inputsearch").value.trim();
        const selectedCategory = document.getElementById("category-filter").value;

        let url = "/api/recipes/?";
        if (filterText) url += `search=${encodeURIComponent(filterText)}&`;
        if (selectedCategory && selectedCategory !== "All") url += `category=${encodeURIComponent(selectedCategory)}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to load recipes: ${res.status}`);
        recipes = await res.json();
        displayRecipes(recipes);
    } catch (err) {
        console.error(err);
        document.getElementById("recipe-list").innerHTML = `<li>${err.message}</li>`;
    }
}


function displayRecipes(list) {
    const recipeList = document.getElementById("recipe-list");
    recipeList.innerHTML = "";

    if (list.length === 0) {
        recipeList.innerHTML = "<li>لا توجد وصفات مطابقة.</li>";
        return;
    }

    list.forEach(recipe => {
        const li = document.createElement("li");
        li.dataset.category = recipe.category;
        li.style.cursor = "pointer";
        li.innerHTML = `
            <img src="${recipe.image ? recipe.image : '/static/images/placeholder.jpg'}" alt="Recipe Image">
            <div class="recipe-info">
                <h3>${recipe.name} (${recipe.category})</h3>
                <p class="recipe-id">Recipe ID: ${recipe.id}</p>
                <p>${recipe.description}</p>
            </div>
            <button class="favorite-btn" data-recipe-id="${recipe.id}">
        ${recipe.is_favorite ? "★" : "☆"}
    </button>
        `;

        li.addEventListener("click", () => {
            window.location.href = `/recipe_details/${recipe.id}/`;
        });
        

        recipeList.appendChild(li);
    });
}

function filterRecipes() {
    const filterText = document.querySelector(".inputsearch").value.toUpperCase();
    const selectedCategory = document.getElementById("category-filter").value;
    const filtered = recipes.filter(r => {
        const matchesText = r.name.toUpperCase().includes(filterText) || r.description.toUpperCase().includes(filterText);
        const matchesCategory = selectedCategory === "All" || r.category === selectedCategory;
        return matchesText && matchesCategory;
    });
    displayRecipes(filtered);
}
const signout=document.querySelector(".sign-out");
signout.addEventListener("click",function(){
    window.location.href="../../adminOrUser.html";
})
const recipeList = document.querySelector("#recipe-list");
const favoriteButtons = document.querySelectorAll(".favorite-btn");
favoriteButtons.forEach(button => {
    button.addEventListener("click", async (e) => {
        e.stopPropagation();
        const recipeId = button.dataset.recipeId;
        const isFavorite = button.textContent === "★";
        await toggleFavorite(recipeId, !isFavorite);
        button.textContent = isFavorite ? "☆" : "★";
    });
});
async function toggleFavorite(recipeId, isFavorite) {
    const method = isFavorite ? "POST" : "DELETE";
    await fetch(`/api/favorites/${recipeId}/`, {
        method: method,
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        }
    });
}

