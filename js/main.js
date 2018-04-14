// Initialize Firebase
firebase.initializeApp(
  {
    apiKey: "AIzaSyBXMV0buglzYK8O1sihii-MJNS3yVVgh-k",
    authDomain: "boozio-221e3.firebaseapp.com",
    databaseURL: "https://boozio-221e3.firebaseio.com",
    projectId: "boozio-221e3",
    storageBucket: "gs://boozio-221e3.appspot.com",
    messagingSenderId: "646890601299"
  }
);

// Get a reference to the database service
var db = firebase.firestore();
var storage = firebase.storage();
var storageRef = storage.ref();

var drinksDB = db.collection('drinks');

const timestamp = firebase.firestore.FieldValue.serverTimestamp();

var drinks = [];
var heartIterator = 0;
var currentLikes = 0;


$(window).on('load', function() {
  getDrinks();
})

$('#latestTab').on('click', function() {
  $('#latestTab').addClass('active');
  $('#popularTab').removeClass('active');
  $('#latestDrinksList').removeClass('d-none');
  $('#popularDrinksList').addClass('d-none');
});

$('#popularTab').on('click', function() {
  $('#popularTab').addClass('active');
  $('#latestTab').removeClass('active');
  $('#popularDrinksList').removeClass('d-none');
  $('#latestDrinksList').addClass('d-none');
});

function getDrinks() {
  drinksDB.orderBy('submitted', 'desc').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      $('#latestDrinksList').append(`
        <div class="card">
          <p id='${doc.id}' class='likesP'>
            <i class='heart far fa-heart'></i>
            <span id='likeSpan-${heartIterator}' class='likeSpan'> ${doc.data().likes}</span>
          </p>
          <img class="card-img-top" src="${doc.data().imageURL}">
          <div class="card-body">

            <h3 class="card-title">${doc.data().name}</h3>
            <p class="card-text">${doc.data().description}</p>
             <p class="ingredientsSubhed">
               <strong>Ingredients:</strong>
             </p>
             <ul class='ingredientsList'>
              ${doc.data().ingredients.join('<br />')}
             </ul>
             <p class='drinkInstructions'><strong>Instructions:</strong> ${doc.data().instructions}</p>
          </div>
        </div>
      `);
      heartIterator += 1;
    });
  });
  drinksDB.orderBy('likes', 'desc').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      $('#popularDrinksList').append(`
        <div class="card">
          <p id='${doc.id}' class='likesP'>
            <i class='heart far fa-heart'></i>
            <span id='likeSpan-${heartIterator}' class='likeSpan'> ${doc.data().likes}</span>
          </p>
          <img class="card-img-top" src="${doc.data().imageURL}">
          <div class="card-body">

            <h3 class="card-title">${doc.data().name}</h3>
            <p class="card-text">${doc.data().description}</p>
             <p class="ingredientsSubhed">
               <strong>Ingredients:</strong>
             </p>
             <ul class='ingredientsList'>
              ${doc.data().ingredients.join('<br />')}
             </ul>
             <p class='drinkInstructions'><strong>Instructions:</strong> ${doc.data().instructions}</p>
          </div>
        </div>
      `);
      heartIterator += 1;
    });
  });
}

$('#latestDrinksList').on('click', '.heart', function() {
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
  var imageURL = "";

  //handle image upload
  let imageFile = $('#customFile').get(0).files[0];
  let imageFileName = Date.now() + '-' + name.replace(/\s/g, '');
  let metadata = { contentType: imageFile.type };
  let task = storageRef.child(imageFileName).put(imageFile, metadata);
  task.then((snapshot) => {
    const url = snapshot.downloadURL;
    imageURL = url;
    //write to database
    db.collection('drinks').add({
      name: name,
      description: description,
      ingredients: ingredients,
      instructions: instructions,
      likes: 0,
      submitted: timestamp,
      imageURL: imageURL
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
    $('#recipeFormModal').modal('toggle')
    var latestRecipe = `
      <div class="card">
        <p class='likesP'>
          <i class='heart far fa-heart'></i>
          <span class='likeSpan'> ${likes}</span>
        </p>
        <img class="card-img-top" src="${imageURL}">
        <div class="card-body">

          <h3 class="card-title">${name}</h3>
          <p class="card-text">${description}</p>
           <p class="ingredientsSubhed">
             <strong>Ingredients:</strong>
           </p>
           <ul class='ingredientsList'>
            ${ingredients.join('<br />')}
           </ul>
           <p class='drinkInstructions'><strong>Instructions:</strong> ${instructions}</p>
        </div>
      </div>
    `
    $('#latestDrinksList').prepend(latestRecipe);
    $('#popularDrinksList').append(latestRecipe);
  }).catch((error) => {
    console.error(error);
  });
});

$('#recipeFormModal').on('shown.bs.modal', function () {
  $('#drinkNameField').trigger('focus')
});
