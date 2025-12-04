// Selecting elements
const inputField = document.getElementById("inputField");
const resultDiv = document.querySelector(".results");
const budgetField = document.getElementById("budgetField");
const dailyCalories = document.querySelector(".dailyCalories");
const gramsField = document.getElementById("gramsField");
const workoutField = document.getElementById("workoutField");

const API_KEY = "yIhxJacfPG8DrS9EiLh3vOg0vBOkuIqhXv0cAjbQ";

// Making "Enter" also works
inputField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    // checkCalories();
    checkCalories();
  }
});
gramsField.addEventListener("keydown", (event) => {
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

  let grams = gramsField.value;
  if (!grams || grams <= 0) return alert("Please enter grams");
  grams = Number(grams);

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
  const calories = food.labelNutrients.calories.value;

  // per 100g
  const per100 = (calories / food.servingSize) * 100;

  // user amount
  const finalCalories = Math.round((per100 / 100) * grams);

  // decrease from budget
  remainingBudget -= finalCalories;
  localStorage.setItem("caloriesRemained", remainingBudget);

  dailyCalories.textContent = `Remaining calories: ${remainingBudget}`;

  // Create wrapper
  const entry = document.createElement("div");
  entry.classList.add("entry");

  // Create text
  counter++;
  const resultItem = document.createElement("span");
  resultItem.textContent = `${counter}. ${capitalize(
    food.description
  )} (${grams}g): ${finalCalories} kcal - `;

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.classList.add("deleteBtn");

  deleteBtn.addEventListener("click", () => {
    remainingBudget += finalCalories;
    localStorage.setItem("caloriesRemained", remainingBudget);
    dailyCalories.textContent = `Remaining calories: ${remainingBudget}`;
    entry.remove();
  });

  entry.appendChild(resultItem);
  entry.appendChild(deleteBtn);
  resultDiv.appendChild(entry);

  inputField.value = "";
  gramsField.value = "";
}

function applyWorkout() {
  const answer = workoutField.value;

  if (answer === "yes") {
    if (localStorage.getItem("workoutBonusApplied") === "true") {
      return alert("Workout bonus already applied today!");
    }
    remainingBudget = Number(remainingBudget) + 300;
    localStorage.setItem("caloriesRemained", remainingBudget);
    dailyCalories.textContent = `Remaining Calories: ${remainingBudget}`;

    localStorage.setItem("workoutBonusApplied", "true");
    alert("Great job! +300 calories added 🎉");
  } else {
    alert("No workout bonus applied.");
  }

  workoutField.value = ""
}
// Localstorage
let savedBudget = localStorage.getItem("dailyCaloriesBudget");
let remainingBudget = localStorage.getItem("caloriesRemained");

if (savedBudget && !remainingBudget) {
  remainingBudget = Number(savedBudget);
  localStorage.setItem("caloriesRemained", remainingBudget);
}

dailyCalories.textContent = `Remaining Calories: ${remainingBudget || 0}`;
