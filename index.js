// Important variables
let input = document.querySelector('.meal_input');
let mealList = document.querySelector('#list');
let errorTxt = document.querySelector('#error-In-Input');
let submit = document.querySelector('.search');
let favList = document.querySelector('.fav-list');

// Autocomplete function
input.addEventListener('input', function() {
  let searchInputTxt = input.value.trim();
  if (searchInputTxt.length === 0) {
    errorTxt.innerHTML = '';
    return;
  }
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
      if (data.meals) {
        let autocompleteList = data.meals.map(meal => meal.strMeal);
        showAutocompleteOptions(autocompleteList);
      } else {
        errorTxt.innerHTML = "No autocomplete options available.";
      }
    });
});

// Function to show autocomplete options
function showAutocompleteOptions(options) {
  let autocompleteDropdown = document.querySelector('#autocomplete-dropdown');
  let html = '';
  options.forEach(option => {
    html += `<li class="autocomplete-option">${option}</li>`;
  });
  autocompleteDropdown.innerHTML = html;

  // Add click event listener to autocomplete options
  let autocompleteOptions = document.querySelectorAll('.autocomplete-option');
  autocompleteOptions.forEach(option => {
    option.addEventListener('click', function() {
      input.value = option.innerText;
      autocompleteDropdown.innerHTML = '';
    });
  });
}

// Function to Search on click

submit.addEventListener('click', function () {
  if (input.value.length === 0) {
    errorTxt.innerHTML = "Input Can Not Be Empty";
    mealList.innerHTML = '';
    return;
  }
  getMealList();
});

// Function to Get meal list
function getMealList() {
  let searchInputTxt = input.value.trim();
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`)
    .then(response => response.json())
    .then(data => {
      let html = "";

      if (data.meals) {
        data.meals.forEach(meal => {
          html += `
            <div class="meal-item" data-id="${meal.idMeal}">
              <div class="meal-img">
                <img src="${meal.strMealThumb}" alt="food">
              </div>
              <div class="meal-name">
                <h3>${meal.strMeal}</h3>
                <button class="add" onclick="addToList('${meal.idMeal}')"><ion-icon id="like" name="heart-outline"></ion-icon></button>
                <p id="inst">${meal.strInstructions}</p>
              </div>
            </div>
          `;
        });

        errorTxt.innerHTML = "";
        mealList.classList.remove('notFound');

      } else {
        errorTxt.innerHTML = "Meal Not Found";
        html = "";
        mealList.classList.add('notFound');
      }
      mealList.innerHTML = html;
    });
}

// Function to Add meal to favorites list
function addToList(mealId) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(res => res.json())
    .then(data => {
      let meal = data.meals[0];
      
      // Check if meal already exists in the list
      if (document.getElementById(meal.idMeal) !== null) {
        return;
      }
      
      let html = `
        <li class="list-item" id="${meal.idMeal}">
          <div class="meal-item" data-id="${meal.idMeal}">
            <div class="meal-img">
              <img src="${meal.strMealThumb}" alt="food">
            </div>
            <div class="meal-name" id="back">
              <h3>${meal.strMeal}</h3>
              <button class="delete" onclick="removeItem('${meal.idMeal}')">
                <ion-icon id="like" name="trash-outline"></ion-icon> 
              </button>
              <p id="inst">${meal.strInstructions}</p>
            </div>
          </div>
        </li>
      `;
      
      favList.innerHTML += html;
    });
}



// Function to Remove meal from favorites list
function removeItem(mealId) {
  let delList = document.getElementById(`${mealId}`);
  favList.removeChild(delList);
}



