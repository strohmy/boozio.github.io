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

var ingredientIncrement = 0;

$('#addIngredientButton').on('click', function() {
  ingredientIncrement += 1;
  $('#drinkIngredientSpan').append("<input id='drinkIngredientField" + ingredientIncrement + "' type='text' placeholder='Enter another ingredient'>");
});
