// Initialize Firebase
var config = {
  apiKey: "AIzaSyBXMV0buglzYK8O1sihii-MJNS3yVVgh-k",
  authDomain: "boozio-221e3.firebaseapp.com",
  databaseURL: "https://boozio-221e3.firebaseio.com",
  projectId: "boozio-221e3",
  storageBucket: "",
  messagingSenderId: "646890601299"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

var drinks = [];

$(window).on('load', function() {
  getDrinks();
})

function getDrinks() {
  // Listen for changes in drinks data
  database.ref('drinks').on('value', function (results) {
    var allDrinks = results.val();

    var ingredientListIncrement = 0;

    for (var item in allDrinks) {
      var context = {
        name: allDrinks[item].name,
        description: allDrinks[item].description,
        ingredients: allDrinks[item].ingredients,
        instructions: allDrinks[item].instructions,
        submitDate: allDrinks[item].submitDate,
        like: allDrinks[item].likes
      };
      ingredientListIncrement += 1;
      $('#drinksList').append(
        "<div class='drinkDiv'><div><h3>" + allDrinks[item].name + "</h3><i class='far fa-heart'></i> "
        + allDrinks[item].likes + "<img class='drinkThumbnail' src='img/martini.jpg'></h3><p class='drinkDescription'>"
        + allDrinks[item].description + "</p><h4 class='ingredientsSubhed'>Ingredients</h4><ul id='ingredientsList"
        + ingredientListIncrement + "' class='ingredientsList'>"
        + allDrinks[item].ingredients.join("<br/>") + "</ul><p class='drinkInstructions'>"
        + allDrinks[item].instructions + "</p><p class='submittedDate'><strong>Submitted </strong>"
        + allDrinks[item].submitDate + "</p></div></div><!--drinkDiv-->"
      )
      for (i = 0; i < allDrinks[item].ingredients.length; i++) {
        //$('#ingredientsList' + ingredientListIncrement).append("<li>" + [i] + "</li>");
      }
    }
  });
}

$('#addIngredientButton').on('click', function() {
  $('#drinkIngredientSpan').append("<input type='text' placeholder='Enter another ingredient'>");
});

$('#recipeForm').on('submit', function(e) {
  e.preventDefault();
  var name = $('#drinkNameField').val();
  var description = $('#drinkDescField').val();
  var ingredients = [];
  $('#drinkIngredientSpan').find(':input').map(function() {
    ingredients.push($(this).val());
  })
  var instructions = $('#drinkInstructionField').val();
  var submitDate = Date(Date.now());
  var likes = 0;
  var likesInverter; 999999;

  var newDrink = database.ref('drinks');

  newDrink.push({
    name: name,
    description: description,
    ingredients: ingredients,
    instructions: instructions,
    submitDate: submitDate,
    likes: likes,
    likesInverter: likesInverter
  });
  $('#recipeForm')[0].reset();
  $('#recipeDiv').prepend("<div id='submittedNotice' class='userNotice'><p>Bam! Your recipe has been saved.</p></div>");
  $('#submittedNotice').show().delay(6000).slideUp();
})
