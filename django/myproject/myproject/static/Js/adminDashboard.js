document.addEventListener("DOMContentLoaded", loadRecipes);

const recipeForm = document.querySelector("#recipe-form");
const recipeList = document.querySelector("#admin-recipe-list");
const recipeId = document.querySelector("#recipe-id");
const recipeName = document.querySelector("#recipe-name");
const recipeCategory = document.querySelector("#recipe-category");
const recipeDescription = document.querySelector("#recipe-description");
const recipeImage = document.querySelector("#recipe-image");
const saveRecipeButton = document.querySelector("#save-recipe");

saveRecipeButton.addEventListener("click", saveRecipe);

function loadRecipes() {
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    recipeList.innerHTML = "";
    recipes.forEach((recipe, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <img src="${recipe.image}" alt="Recipe Image">
            <div>
                <h3>${recipe.name} (${recipe.category})</h3>
                <p>${recipe.description}</p>
            </div>
            <button onclick="editRecipe(${index})">Edit</button>
            <button onclick="deleteRecipe(${index})">Delete</button>
        `;
        recipeList.appendChild(li);
    });
}

function saveRecipe() {
    let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    
    const newRecipe = {
        id: recipes.length + 1, 
        name: recipeName.value.trim(),
        category: recipeCategory.value, 
        description: recipeDescription.value.trim(),
        image: ""
    };

    if (recipeImage.files.length > 0) {
        const reader = new FileReader();
        reader.onload = function(event) {
            newRecipe.image = event.target.result;
            saveToLocalStorage(newRecipe);
        };
        reader.readAsDataURL(recipeImage.files[0]);
    } else {
        saveToLocalStorage(newRecipe);
    }
}


function saveToLocalStorage(recipe) {
    let recipes = JSON.parse(localStorage.getItem("recipes")) || [];

    if (recipeId.value === "") {
        recipes.push(recipe);
    } else {
        recipes[parseInt(recipeId.value)] = recipe;
    }

    localStorage.setItem("recipes", JSON.stringify(recipes));
    loadRecipes();
    clearForm();
}

function editRecipe(index) {
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    recipeId.value = index;
    recipeName.value = recipes[index].name;
    recipeCategory.value = recipes[index].category;
    recipeDescription.value = recipes[index].description;
}

function deleteRecipe(index) {
    const recipes = JSON.parse(localStorage.getItem("recipes")) || [];
    recipes.splice(index, 1);
    localStorage.setItem("recipes", JSON.stringify(recipes));
    loadRecipes();
}

function clearForm() {
    recipeId.value = "";
    recipeName.value = "";
    recipeCategory.value = "";
    recipeDescription.value = "";
    recipeImage.value = "";
    document.querySelector("#preview-image").src = "../Image/default.jpg";
}

document.querySelector("#recipe-image").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.querySelector("#preview-image").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});
document.getElementById("sign-out-button").addEventListener("click", function() {
    window.location.href = "../../adminOrUser.html";
});
