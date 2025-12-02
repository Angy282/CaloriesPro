// Selecting elements
const inputField = document.getElementById("inputField");
const resultDiv = document.querySelector(".results");
const budgetField = document.getElementById("budgetField");
const dailyCalories = document.querySelector(".dailyCalories");

const API_KEY = "yIhxJacfPG8DrS9EiLh3vOg0vBOkuIqhXv0cAjbQ";

// Making "Enter" also works
inputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    // checkCalories();
    checkCalories();
  }
});

budgetField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addBudget();
  }
});

// Budget function (I need to save it to localstorage)
function addBudget() {
  let budget = budgetField.value;
  if (!budget) return alert("Please enter your daily calories budget");

  localStorage.setItem("dailyCaloriesBudget", budget);
  dailyCalories.textContent = `Calories Budget: ${budget}`;
  budgetField.value = "";
}

function resetCalories() {
}

// a function to capitalize the results for better syntax.

function capitalize(str) {
  return str
  .toLowerCase()
  .split(" ")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");
}

// Fetching calories and other data via API CALL
counter = 0;
async function checkCalories() {
  const query = inputField.value;
  if (!query) return alert("Please enter a food item");

  const res = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}`
  );
  const data = await res.json();

  const fdcId = data.foods[0].fdcId;

  const response = await fetch(
    `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${API_KEY}`
  );

  const food = await response.json();
  console.log(food);

  // Show results here
  const calories = food.labelNutrients.calories.value;
  const per100 = (calories / food.servingSize) * 100;
  let rounded = Math.round(per100);

  const resultItem = document.createElement("p");

  remainingBudget -= rounded;
  localStorage.setItem("caloriesRemained", remainingBudget);
  dailyCalories.textContent = `Remaining Calories: ${remainingBudget}`

  if (!food) {
    resultItem.textContent = "No results found.";
  } else counter++;
  resultItem.textContent = `${counter}. ${capitalize(
    food.description
  )}: ${rounded} kcal`;
  resultDiv.appendChild(resultItem);
  inputField.value = "";
}



// Localstorage
let savedBudget = localStorage.getItem("dailyCaloriesBudget");
if (savedBudget) {
  dailyCalories.textContent = `Your Calories for today: ${savedBudget}`;
}

let remainingBudget = localStorage.getItem("caloriesRemained");
if (!remainingBudget) {
  remainingBudget = savedBudget ? Number(savedBudget) : 0;
  localStorage.setItem("caloriesRemained", remainingBudget);
}
dailyCalories.textContent = `Remaining Calories: ${remainingBudget}`;
