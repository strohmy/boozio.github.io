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
drinksDB = db.collection('drinks');

var drinks = [];
var heartIterator = 0;
var currentLikes = 0;


$(window).on('load', function() {
  getDrinks();
})

function getDrinks() {
  drinksDB.orderBy('likes', 'desc').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      $('#drinksList').append(`
        <div class='drinkDiv'>
            <div class='thumbAndLikeBox'>
              <img class='drinkThumbnail' src='img/martini.jpg'><br/>
              <p id='${doc.id}' class='likesP' align='center'><i class='heart far fa-heart'></i> <span id='likeSpan-${heartIterator}' class='likeSpan'>${doc.data().likes}</span></p>
            </div>
            <h3>${doc.data().name}</h3>
            <p class='drinkDescription'>${doc.data().description}</p>
            <h4 class='ingredientsSubhed'>Ingredients</h4>
            <ul id='ingredientsList' class='ingredientsList'>
              ${doc.data().ingredients.join('<br />')}
            </ul>
            <p class='drinkInstructions'>${doc.data().instructions}</p>
        </div>
      `);
      heartIterator += 1;
    });
  })
}

$('#drinksList').on('click', '.heart', function() {
  var gotID = $(this).closest('.likesP').attr('id');
  var currentLikeSpan = $('#'+gotID).find('span').attr('id');
  var currentRecord = drinksDB.doc(gotID);
  currentRecord.get().then(function(doc) {
    currentLikes = doc.data().likes;
    currentLikes += 1;
    currentRecord.update({
      likes: currentLikes
    });
    $('#'+currentLikeSpan).html(currentLikes);
  })
  .catch(function(error) {
      console.log("Error getting document:", error);
  });
});

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

  $('#recipeDiv').prepend("<div id='submittedNotice' class='userNotice'><p>Bam! Your recipe has been saved.</p></div>");
  $('#submittedNotice').show().delay(4000).slideUp();
});
