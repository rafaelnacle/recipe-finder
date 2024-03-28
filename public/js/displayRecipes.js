async function displayRecipes() {
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('query');
  const recipeContainer = document.getElementById('recipes-container');

  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();
    if (query === '') return;

    try {
      const response = await fetch(`/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const recipes = await response.json();
      renderRecipes(recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  });

  function renderRecipes(recipes) {
    recipeContainer.innerHTML = '';

    if (recipes.length === 0) {
      const messageElement = document.createElement('p');
      messageElement.classList.add('text-center', 'text-gray-500', 'mt-4');
      messageElement.textContent = 'No recipes found.';
      recipeContainer.appendChild(messageElement);
      return;
    }

    recipes.forEach(recipe => {
      const recipeElement = document.createElement('div');
      recipeElement.classList.add('recipe', 'bg-indigo-100', 'text-black', 'p-4', 'mb-4', 'rounded', 'shadow-md');

      const titleElement = document.createElement('h2');
      titleElement.textContent = recipe.label;
      titleElement.classList.add('text-xl', 'font-bold', 'mb-2');
      recipeElement.appendChild(titleElement);

      const ingredientsList = document.createElement('ul');
      ingredientsList.classList.add('list-disc', 'list-inside', 'mb-4');
      recipe.ingredients.forEach(ingredient => {
        const ingredientItem = document.createElement('li');
        ingredientItem.textContent = ingredient.text;
        ingredientsList.appendChild(ingredientItem);
      });
      recipeElement.appendChild(ingredientsList);

      recipeContainer.appendChild(recipeElement);
    });
  }
}

displayRecipes();
