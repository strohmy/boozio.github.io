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

var newRecipe = {
  name: "",
  description: "",
  ingredients: [],
  instructions: ""
};


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
  console.log(name);
  console.log(description);
  console.log(ingredients);
  console.log(instructions);
})
