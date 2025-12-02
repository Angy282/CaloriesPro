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
  remainingBudget = budget;
  localStorage.setItem("caloriesRemained", remainingBudget);

  dailyCalories.textContent = `Remaining Calories: ${remainingBudget}`;
  budgetField.value = "";
}

function resetCalories() {
  localStorage.removeItem("caloriesRemained");
  localStorage.removeItem("dailyCaloriesBudget");

  remainingBudget = 0;
  counter = 0;

  dailyCalories.textContent = "Remaining Calories: 0";
  resultDiv.innerHTML = "";
  budgetField.value = "";
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

  // Decrease from budget
  remainingBudget -= rounded;
  localStorage.setItem("caloriesRemained", remainingBudget);
  dailyCalories.textContent = `Remaining calories: ${remainingBudget}`;

  // Create wrapper entry container
  const entry = document.createElement("div");
  entry.classList.add("entry");

  // Create result text
  const resultItem = document.createElement("span");
  counter++;
  resultItem.textContent = `${counter}. ${capitalize(
    food.description
  )}: ${rounded} kcal - `;

  // Create delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.classList.add("deleteBtn");

  // Delete function
  deleteBtn.addEventListener("click", () => {
    remainingBudget += rounded;
    localStorage.setItem("caloriesRemained", remainingBudget);
    dailyCalories.textContent = `Remaining calories: ${remainingBudget}`;

    entry.remove();
  });

  entry.appendChild(resultItem);
  entry.appendChild(deleteBtn);
  resultDiv.appendChild(entry);

  inputField.value = "";
}

// Localstorage
let savedBudget = localStorage.getItem("dailyCaloriesBudget");
let remainingBudget = localStorage.getItem("caloriesRemained");

if (savedBudget && !remainingBudget) {
  remainingBudget = Number(savedBudget);
  localStorage.setItem("caloriesRemained", remainingBudget);
}

dailyCalories.textContent = `Remaining Calories: ${remainingBudget || 0}`;
