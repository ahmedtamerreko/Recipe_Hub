document.addEventListener("DOMContentLoaded", function() {
    loadFavoriteRecipes();
    document.querySelector(".inputsearch").addEventListener("input", filterRecipes);
    document.getElementById("category-filter").addEventListener("change", filterRecipes);
});

async function loadFavoriteRecipes() {
    try {
        const response = await fetch('/favorites/api/list/'); // رابط ال API في Django لإرجاع الوصفات المفضلة بصيغة JSON
        if (!response.ok) throw new Error('Failed to fetch favorites');
        const favoriteRecipes = await response.json();

        const favoriteList = document.getElementById("favorite-list");
        favoriteList.innerHTML = "";

        if (favoriteRecipes.length === 0) {
            favoriteList.innerHTML = "<p>No favorite recipes yet!</p>";
            return;
        }

        favoriteRecipes.forEach((recipe) => {
            const li = document.createElement("li");
            li.dataset.category = recipe.category;
            li.innerHTML = `
                <img src="${recipe.image}" alt="Recipe Image">
                <div class="recipe-info">
                    <a href="/recipeDetails/${recipe.id}/">
                        <h3>${recipe.name} (${recipe.category})</h3>
                        <p>Recipe ID: ${recipe.id}</p>
                        <p>${recipe.description}</p>
                    </a>
                </div>
                <button class="remove-favorite" data-id="${recipe.id}">Remove</button>
            `;

            li.querySelector(".remove-favorite").addEventListener("click", () => {
                removeFromFavorites(recipe.id);
            });

            favoriteList.appendChild(li);
        });

        filterRecipes();

    } catch (error) {
        console.error(error);
    }
}

async function removeFromFavorites(recipeId) {
    try {
        const response = await fetch(`/favorites/api/remove/${recipeId}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCookie('csrftoken'),  // تأكد من إرسال توكن CSRF لـ Django
            },
        });

        if (!response.ok) throw new Error('Failed to remove favorite');

        loadFavoriteRecipes();

    } catch (error) {
        console.error(error);
    }
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

// دالة لجلب CSRF Token من الكوكيز (ضروري في طلبات POST/DELETE مع Django)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // تحقق هل الكوكيز تبدأ بالاسم المطلوب
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const signout = document.querySelector(".sign-out");
signout.addEventListener("click", function() {
    window.location.href = "../../adminOrUser.html";
});
