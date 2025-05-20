document.addEventListener("DOMContentLoaded", loadRecipes);

const recipeForm = document.querySelector("#recipe-form");
const recipeList = document.querySelector("#admin-recipe-list");
const recipeId = document.querySelector("#recipe-id");
const recipeName = document.querySelector("#recipe-name");
const recipeCategory = document.querySelector("#recipe-category");
const recipeDescription = document.querySelector("#recipe-description");
const recipeImage = document.querySelector("#recipe-image");
const saveRecipeButton = document.querySelector("#save-recipe");

saveRecipeButton.addEventListener("click", function (e) {
  e.preventDefault();
  saveRecipe();
});

async function loadRecipes() {
  const res = await fetch('/api/recipes/');
  const recipes = await res.json();

  recipeList.innerHTML = "";
  recipes.forEach((recipe) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${recipe.image}" alt="Recipe Image" onerror="this.src='{% static 'Image/default.jpg' %}';">
      <div>
        <h3>${recipe.name} (${recipe.category})</h3>
        <p>${recipe.description}</p>
      </div>
      <button onclick="editRecipe(${recipe.id})">Edit</button>
      <button onclick="deleteRecipe(${recipe.id})">Delete</button>
    `;
    recipeList.appendChild(li);
  });
}

async function saveRecipe() {
  const formData = new FormData();
  formData.append("name", recipeName.value.trim());
  formData.append("category", recipeCategory.value);
  formData.append("description", recipeDescription.value.trim());

  if (recipeImage.files.length > 0) {
    formData.append("image", recipeImage.files[0]);
  }

  const method = recipeId.value ? "PUT" : "POST";
  const endpoint = recipeId.value ? `/api/recipes/${recipeId.value}/` : "/api/recipes/";

  await fetch(endpoint, {
    method: method,
    body: formData,
    headers: {
      "X-CSRFToken": getCookie("csrftoken")
    }
  });

  loadRecipes();
  clearForm();
}

async function editRecipe(id) {
  const res = await fetch(`/api/recipes/${id}/`);
  const recipe = await res.json();

  recipeId.value = recipe.id;
  recipeName.value = recipe.name;
  recipeCategory.value = recipe.category;
  recipeDescription.value = recipe.description;
  document.querySelector("#preview-image").src = recipe.image || '{% static "Image/default.jpg" %}';
}

async function deleteRecipe(id) {
  await fetch(`/api/recipes/${id}/`, {
    method: "DELETE",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
      "Content-Type": "application/json"
    }
  });
  loadRecipes();
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function clearForm() {
  recipeId.value = "";
  recipeName.value = "";
  recipeCategory.value = "Main Course";
  recipeDescription.value = "";
  recipeImage.value = "";
  document.querySelector("#preview-image").src = '{% static "Image/default.jpg" %}';
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
