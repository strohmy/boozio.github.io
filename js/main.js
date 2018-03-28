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

var ingredientIncrement = 0;

var newRecipe = {};

var newIngredients = [];

$('#addIngredientButton').on('click', function() {
  ingredientIncrement += 1;
  $('#drinkIngredientSpan').append("<input id='drinkIngredientField' type='text' placeholder='Enter another ingredient'>");
});

$('#recipeForm').on('submit', function(e) {
  e.preventDefault();
  newIngredients.push($('#drinkIngredientField').val());
  newRecipe.name = $('drinkNameField').val();
  console.log(newRecipe.name);
})
