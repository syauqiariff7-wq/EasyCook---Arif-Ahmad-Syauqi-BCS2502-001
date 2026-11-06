//Get the Search button, input field and results container from HTML
var searchButton = document.getElementById("searchButton");
var searchInput = document.getElementById("searchInput");
var recipeResults = document.getElementById("recipeResults");

//Search button function
searchButton.addEventListener("click", function() {
    var recipeName = searchInput.value;
    
    //Check whether the input is empty
    if (recipeName == "") { 
        recipeResults.innerHTML = "<p>Please enter a recipe name.</p>";
    } 
    else {
        //Loading message
        recipeResults.innerHTML = "<p>Searching...</p>";

        fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=" + encodeURIComponent(recipeName))

            //Check whether the API request was successful
            .then(function(response) {
                if (!response.ok) {
                    throw new Error("API request failed");
                }

                return response.json();
            })

            //Process the recipe data returned by the API
            .then(function(data) {
                //Clear the previous search results
                recipeResults.innerHTML = "";

                //Check whether any recipes were found
                if (data.meals == null) {
                    recipeResults.innerHTML = "<p>No recipes found.</p>";
                } 
                else {
                    //Loop through all recipes returned by the API
                    data.meals.forEach(function(meal) {
                        var recipeCard = document.createElement("div");

                        var recipeTitle = document.createElement("h3");
                        recipeTitle.textContent = meal.strMeal;

                        var recipeImage = document.createElement("img");
                        recipeImage.src = meal.strMealThumb;
                        recipeImage.width = 200;

                        var recipeCategory = document.createElement("p");
                        recipeCategory.textContent = "Category: " + meal.strCategory;

                        var recipeArea = document.createElement("p");

                        //Check whether the cuisine information is available
                        if (meal.strArea == null || meal.strArea == "") {
                            recipeArea.textContent = "Cuisine: Not specified";
                        } 
                        else {
                            recipeArea.textContent = "Cuisine: " + meal.strArea;
                        }

                        var viewButton = document.createElement("button");
                        viewButton.textContent = "View Recipe";

                        viewButton.addEventListener("click", function() {
                            showRecipeDetails(meal);
                        });

                        //Add all recipe information and the button to the recipe card
                        recipeCard.appendChild(recipeTitle);
                        recipeCard.appendChild(recipeImage);
                        recipeCard.appendChild(recipeCategory);
                        recipeCard.appendChild(recipeArea);
                        recipeCard.appendChild(viewButton);

                        //Display the recipe card on the page
                        recipeResults.appendChild(recipeCard);
                    });
                }
            })

            //Handle errors if the API request fails
            .catch(function(error) {
                recipeResults.innerHTML = "<p>Unable to connect to the recipe API. Please try again.</p>";
                console.log(error);
            });
    }
});


//Function to display the full details of a selected recipe
function showRecipeDetails(meal) {
    //Clear the previous recipe results
    recipeResults.innerHTML = "";
    //Scroll to the top of the page after View Recipe button clicked
    window.scrollTo(0, 0);

    var title = document.createElement("h2");
    title.textContent = meal.strMeal;

    recipeResults.appendChild(title);

    var ingredientsTitle = document.createElement("h3");
    ingredientsTitle.textContent = "Ingredients";

    recipeResults.appendChild(ingredientsTitle);

    //Loop through the 20 possible ingredient fields provided by the API
    for (var i = 1; i <= 20; i++) {
        var ingredient = meal["strIngredient" + i];
        var measurement = meal["strMeasure" + i];

        //Check whether the ingredient exists
        if (ingredient != null && ingredient != "") {
            var ingredientText = document.createElement("p");
            ingredientText.textContent = measurement + " " + ingredient;

            recipeResults.appendChild(ingredientText);
        }
    }

    var instructionTitle = document.createElement("h3");
    instructionTitle.textContent = "Cooking Instructions";

    var instructions = document.createElement("p");
    instructions.textContent = meal.strInstructions;

    //Display the cooking instructions
    recipeResults.appendChild(instructionTitle);
    recipeResults.appendChild(instructions);

    var saveButton = document.createElement("button");
    saveButton.textContent = "Save to Meal Plans";

    saveButton.addEventListener("click", function() {
        localStorage.setItem("selectedRecipe", meal.strMeal);

        //Navigate to the Meal Plans page
        window.location.href = "mealplans.html";
    });

    recipeResults.appendChild(saveButton);

    var backButton = document.createElement("button");
    backButton.textContent = "Back to Recipes";

    backButton.addEventListener("click", function() {
        searchButton.click();
    });

    recipeResults.appendChild(backButton);
}

//Navigate to the Meal Plans page when the button is clicked
document.getElementById("mealPlanButton").addEventListener("click", function() {
    window.location.href = "mealplans.html";
});


//Recipe Suggestion System
//Get the dropdown, button and results container from HTML
var categorySelect = document.getElementById("categorySelect");
var suggestButton = document.getElementById("suggestButton");
var suggestionResults = document.getElementById("suggestionResults");

//Run when the Get Suggestions button is clicked
suggestButton.addEventListener("click", function() {

    //Get the category selected by the user
    var category = categorySelect.value;

    //Check whether the user selected a category
    if (category == "") {
        suggestionResults.innerHTML = "<p>Please choose a category.</p>";
    } 
    else {
        //Display a loading message
        suggestionResults.innerHTML = "<p>Finding a recommendation...</p>";

        //Function to repeatedly request a random recipe from the API until the category matched with user input
        function findRandomRecipe() {

            fetch("https://www.themealdb.com/api/json/v1/1/random.php")

                //Check whether the API request was successful
                .then(function(response) {
                    if (!response.ok) {
                        throw new Error("API request failed");
                    }

                    return response.json();
                })

                //Process the random recipe returned by the API
                .then(function(data) {
                    //Check whether the API returned a recipe
                    if (data.meals != null) {
                        var meal = data.meals[0];

                        //Check whether the recipe matches the selected category
                        if (meal.strCategory == category) {

                            var title = document.createElement("h3");
                            title.textContent = "Recommended Recipe: " + meal.strMeal;

                            var image = document.createElement("img");
                            image.src = meal.strMealThumb;
                            image.width = 200;

                            var recipeArea = document.createElement("p");

                            //Check whether the cuisine is available
                            if (meal.strArea == null || meal.strArea == "") {
                                recipeArea.textContent = "Cuisine: Not specified";
                            } 
                            else {
                                recipeArea.textContent = "Cuisine: " + meal.strArea;
                            }

                            //Display the recipe name, image and cuisine
                            suggestionResults.innerHTML = "";
                            suggestionResults.appendChild(title);
                            suggestionResults.appendChild(image);
                            suggestionResults.appendChild(recipeArea);
                            suggestionResults.appendChild(document.createElement("br"));

                            var viewButton = document.createElement("button");
                            viewButton.textContent = "View Recipe";

                            viewButton.addEventListener("click", function() {
                                showRecipeDetails(meal);
                            });

                            suggestionResults.appendChild(viewButton);
                        } 
                        else {
                            //Try again if the category does not match
                            findRandomRecipe();
                        }
                    } 
                    else {
                        //Try again if the API returned no recipe
                        findRandomRecipe();
                    }
                })

                //Handle errors if the API request fails
                .catch(function(error) {
                    suggestionResults.innerHTML = "<p>Unable to get suggestions. Please try again.</p>";
                    console.log(error);
                });
        }
        //Start searching for a matching random recipe
        findRandomRecipe();
    }
});