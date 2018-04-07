// Initialize Firebase
firebase.initializeApp(
  {
    apiKey: "AIzaSyBXMV0buglzYK8O1sihii-MJNS3yVVgh-k",
    authDomain: "boozio-221e3.firebaseapp.com",
    databaseURL: "https://boozio-221e3.firebaseio.com",
    projectId: "boozio-221e3",
    storageBucket: "",
    messagingSenderId: "646890601299"
  }
);

// Get a reference to the database service
var db = firebase.firestore();

var drinks = [];

$(window).on('load', function() {
  getDrinks();
})

function getDrinks() {
  // Listen for changes in drinks data
  db.collection('drinks').orderBy('likes', 'desc').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      $('#drinksList').append(`
        <div class='drinkDiv'>
          <div>
            <div class='thumbAndLikeBox'>
              <img class='drinkThumbnail' src='img/martini.jpg'><br/>
              <p align='center'><i class='far fa-heart'></i> ${doc.data().likes}</p>
            </div>
            <h3>${doc.data().name}</h3>
            <p class='drinkDescription'>${doc.data().description}</p>
            <h4 class='ingredientsSubhed'>Ingredients</h4>
            <ul id='ingredientsList' class='ingredientsList'>
              ${doc.data().ingredients.join('<br />')}
            </ul>
            <p class='drinkInstructions'>${doc.data().instructions}</p>
          </div>
        </div>
      `);
    });
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
  var likes = 0;

  db.collection('drinks').add({
    name: name,
    description: description,
    ingredients: ingredients,
    instructions: instructions,
    likes: 0
  })
  .then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
});
