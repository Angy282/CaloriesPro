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
    checkCalories();
  }
});

workoutField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    applyWorkout();
  }
});

gramsField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkCalories();
  }
});

budgetField.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addBudget();
  }
});

function updateRemainingCalories() {
  dailyCalories.textContent = `Remaining Calories: ${remainingBudget}`;

  if (remainingBudget < 0) {
    dailyCalories.style.color = "red";
  } else if (remainingBudget < 100) {
    dailyCalories.style.color = "orange";
  } else {
    dailyCalories.style.color = "rgb(216, 212, 212)"; // or whatever your normal color is
  }
}

// Budget function (I need to save it to localstorage)
function addBudget() {
  let budget = budgetField.value;
  if (!budget) return alert("Please enter your daily calories budget");

  localStorage.setItem("dailyCaloriesBudget", budget);
  remainingBudget = budget;
  localStorage.setItem("caloriesRemained", remainingBudget);

  updateRemainingCalories();
  budgetField.value = "";
}

function resetCalories() {
  localStorage.removeItem("caloriesRemained");
  localStorage.removeItem("dailyCaloriesBudget");
  localStorage.removeItem("workoutBonusApplied");

  remainingBudget = 0;
  counter = 0;

  dailyCalories.textContent = "Remaining Calories: 0";
  dailyCalories.style.color = "white";
  localStorage.removeItem("savedEntries");
  resultDiv.innerHTML = "";
  budgetField.value = "";
  workoutField.value = "";
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

  updateRemainingCalories();

  // creating new div for results
  const entry = document.createElement("div");
  entry.classList.add("entry");

  counter++;
  const resultItem = document.createElement("span");
  resultItem.textContent = `- ${capitalize(
    food.description
  )} (${grams}g): ${finalCalories} kcal`;

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.classList.add("deleteBtn");

  deleteBtn.addEventListener("click", () => {
    remainingBudget += finalCalories;
    localStorage.setItem("caloriesRemained", remainingBudget);
    updateRemainingCalories();
    entry.remove();
    localStorage.setItem("savedEntries", resultDiv.innerHTML);
  });

  entry.appendChild(resultItem);
  entry.appendChild(deleteBtn);
  resultDiv.appendChild(entry);

  localStorage.setItem("savedEntries", resultDiv.innerHTML);

  inputField.value = "";
  gramsField.value = "";
}

function applyWorkout() {
  const answer = workoutField.value;

  if (answer === "yes") {
    if (localStorage.getItem("workoutBonusApplied") === "true") {
      return alert("Workout bonus already applied today!");
    }
    remainingBudget = Number(remainingBudget) + 400;
    localStorage.setItem("caloriesRemained", remainingBudget);
    updateRemainingCalories();

    localStorage.setItem("workoutBonusApplied", "true");
    alert("Great job! +400 calories added 🎉");
  } else {
    alert("No workout bonus applied.");
  }

  workoutField.value = "";
}

// saving data to Local Storage and loading it when the page loads

// Budget
let savedBudget = localStorage.getItem("dailyCaloriesBudget");
let remainingBudget = localStorage.getItem("caloriesRemained");

if (savedBudget && !remainingBudget) {
  remainingBudget = Number(savedBudget);
  localStorage.setItem("caloriesRemained", remainingBudget);
}

dailyCalories.textContent = `Remaining Calories: ${remainingBudget || 0}`;
updateRemainingCalories();

// the food list
const savedHTML = localStorage.getItem("savedEntries");
if (savedHTML) {
  resultDiv.innerHTML = savedHTML;

  document.querySelectorAll(".entry").forEach((entry) => {
    const text = entry.querySelector("span").textContent;
    const calories = Number(text.split(": ")[1].split(" ")[0]);

    const deleteBtn = entry.querySelector(".deleteBtn");
    deleteBtn.addEventListener("click", () => {
      remainingBudget += calories;
      localStorage.setItem("caloriesRemained", remainingBudget);
      updateRemainingCalories();
      entry.remove();
      localStorage.setItem("savedEntries", resultDiv.innerHTML);
    });
  });

  counter = document.querySelectorAll(".entry").length;
}
