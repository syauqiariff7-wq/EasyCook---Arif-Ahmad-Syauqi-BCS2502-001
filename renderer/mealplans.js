const fs = require("fs");
const path = require("path");

//Get the input fields from HTML
var mealName = document.getElementById("mealName");
var mealDate = document.getElementById("mealDate");
var mealServings = document.getElementById("mealServings");
var mealCost = document.getElementById("mealCost");

//Get selected recipe from Recipe Finder
var selectedRecipe = localStorage.getItem("selectedRecipe");

//Check whether a recipe was selected
if (selectedRecipe != null) {
    mealName.value = selectedRecipe;

    //Remove the saved recipe name after using it
    localStorage.removeItem("selectedRecipe");
}

//Get the buttons and results area from HTML
var addMealButton = document.getElementById("addMealButton");
var mealPlanList = document.getElementById("mealPlanList");
var message = document.getElementById("message");

//Get saved meal plans from JSON file
var filePath = path.join(__dirname, "..", "data", "mealplans.json");

//Create an empty array for meal plans
var mealPlans = [];

//Read saved meal plans from the JSON file
try {
    var data = fs.readFileSync(filePath, "utf8");
    mealPlans = JSON.parse(data);
} 
catch (error) {
    mealPlans = [];
}

//Save the same meal plans in Local Storage
localStorage.setItem("mealPlans", JSON.stringify(mealPlans));

//Display all meal plans
function displayMealPlans() {
    //Clear the previous display
    mealPlanList.innerHTML = "";

    //Check whether there are any saved meal plans
    if (mealPlans.length == 0) {
        mealPlanList.innerHTML = "<p>You have no saved meal plans yet.</p>";
    }

    //Loop through all saved meal plans
    for (var i = 0; i < mealPlans.length; i++) {
        //Get the current meal plan
        var meal = mealPlans[i];

        var mealCard = document.createElement("div");

        var name = document.createElement("h3");
        name.textContent = meal.name;

        var date = document.createElement("p");
        date.textContent = "Date: " + meal.date;

        var servings = document.createElement("p");
        servings.textContent = "Servings: " + meal.servings;

        var cost = document.createElement("p");
        cost.textContent = "Total Cost: RM " + meal.cost.toFixed(2);

        var costPerServing = document.createElement("p");
        costPerServing.textContent = "Cost Per Serving: RM " + meal.costPerServing.toFixed(2);

        var editButton = document.createElement("button");
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function(index) {
            return function() {
                editMeal(index);
            };
        }(i));

        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function(index){
            return function() {
                deleteMeal(index);
            };
        }(i));

        mealCard.appendChild(name);
        mealCard.appendChild(date);
        mealCard.appendChild(servings);
        mealCard.appendChild(cost);
        mealCard.appendChild(costPerServing);
        mealCard.appendChild(editButton);
        mealCard.appendChild(deleteButton);

        mealPlanList.appendChild(mealCard);
    }
}

//Add a new meal plan
addMealButton.addEventListener("click", function() {
    //Get the values entered by the user
    var name = mealName.value;
    var date = mealDate.value;
    var servings = Number(mealServings.value);
    var costPerServing = Number(mealCost.value);

    //Calculate the total cost
    var cost = servings * costPerServing;

    //Check whether the information is valid
    if (name == "" || date == "" || servings <= 0 || mealCost.value == "" || costPerServing < 0) {
        message.textContent = "Please enter valid information in all fields.";
    }
    else {
        //Create a new meal plan object
        var newMeal = {
            name: name,
            date: date,
            servings: servings,
            cost: cost,
            costPerServing: costPerServing
        };

        //Add the new meal plan to the array
        mealPlans.push(newMeal);

        //Save the meal plans in the JSON file
        fs.writeFileSync(filePath, JSON.stringify(mealPlans, null, 4));

        //Update Local Storage
        localStorage.setItem("mealPlans", JSON.stringify(mealPlans));

        message.textContent = "Meal plan added successfully!";

        //Clear the input fields
        mealName.value = "";
        mealDate.value = "";
        mealServings.value = 1;
        mealCost.value = "";

        //Refresh the meal plan display
        displayMealPlans();
    }
});

//Edit a meal plan
function editMeal(index) {
    //Refresh the meal plan display
    displayMealPlans();

    //Get the selected meal card
    var mealCard = mealPlanList.children[index];

    //Create the edit form
    var editForm = document.createElement("div");

    var editTitle = document.createElement("h3");
    editTitle.textContent = "Edit " + mealPlans[index].name + " Meal Plan";

    var editNameLabel = document.createElement("label");
    editNameLabel.textContent = "Recipe Name:";

    var editName = document.createElement("input");
    editName.value = mealPlans[index].name;

    var editDateLabel = document.createElement("label");
    editDateLabel.textContent = "Cooking Date:";

    var editDate = document.createElement("input");
    editDate.type = "date";
    editDate.value = mealPlans[index].date;

    var editServingsLabel = document.createElement("label");
    editServingsLabel.textContent = "Number of Servings:";

    var editServings = document.createElement("input");
    editServings.type = "number";
    editServings.value = mealPlans[index].servings;
    editServings.min = 1;

    var editCostLabel = document.createElement("label");
    editCostLabel.textContent = "Cost Per Serving (RM):";

    var editCost = document.createElement("input");
    editCost.type = "number";
    editCost.value = mealPlans[index].costPerServing;
    editCost.min = 0;
    editCost.step = "0.01";

    var saveButton = document.createElement("button");
    saveButton.textContent = "Save Changes";

    var cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";

    editForm.appendChild(editTitle);

    editForm.appendChild(editNameLabel);
    editForm.appendChild(document.createElement("br"));
    editForm.appendChild(editName);
    editForm.appendChild(document.createElement("br"));

    editForm.appendChild(editDateLabel);
    editForm.appendChild(document.createElement("br"));
    editForm.appendChild(editDate);
    editForm.appendChild(document.createElement("br"));

    editForm.appendChild(editServingsLabel);
    editForm.appendChild(document.createElement("br"));
    editForm.appendChild(editServings);
    editForm.appendChild(document.createElement("br"));

    editForm.appendChild(editCostLabel);
    editForm.appendChild(document.createElement("br"));
    editForm.appendChild(editCost);
    editForm.appendChild(document.createElement("br"));

    editForm.appendChild(saveButton);
    editForm.appendChild(cancelButton);

    mealCard.appendChild(editForm);

    //Run when Save Changes is clicked
    saveButton.addEventListener("click", function() {
        var newName = editName.value;
        var newDate = editDate.value;
        var newServings = Number(editServings.value);
        var newCostPerServing = Number(editCost.value);

        //Check whether the information is valid
        if (newName == "" || newDate == "" || newServings <= 0 || editCost.value == "" || newCostPerServing < 0) {
            message.textContent = "Please enter valid information in all fields.";
        } 
        else {
            //Calculate the updated total cost
            var newTotalCost = newServings * newCostPerServing;

            //Replace the old meal plan with the updated information
            mealPlans[index] = {
                name: newName,
                date: newDate,
                servings: newServings,
                costPerServing: newCostPerServing,
                cost: newTotalCost
            };

            //Save the updated meal plans in the JSON file
            fs.writeFileSync(filePath, JSON.stringify(mealPlans, null, 4));

            //Update Local Storage
            localStorage.setItem("mealPlans", JSON.stringify(mealPlans));

            message.textContent = "Meal plan updated successfully!";

            //Refresh the meal plan display
            displayMealPlans();
        }
    });

    //Cancel editing and return to the meal plan list
    cancelButton.addEventListener("click", function() {
        displayMealPlans();
        message.textContent = "Editing cancelled.";
    });
}

//Delete a meal plan
function deleteMeal(index) {
    var confirmDelete = confirm("Are you sure you want to delete this meal plan?");

    //Delete only if the user confirms
    if (confirmDelete) {
        mealPlans.splice(index, 1);

        fs.writeFileSync(filePath, JSON.stringify(mealPlans, null, 4));
        localStorage.setItem("mealPlans", JSON.stringify(mealPlans));

        displayMealPlans();
    }
}

//Return to Recipe Finder
document.getElementById("homeButton").addEventListener("click", function() {
    window.location.href = "index.html";
});

//Display saved plans when the page opens
displayMealPlans();