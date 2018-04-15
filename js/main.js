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

var userName = "anonymous";

$(window).on('load', function() {
  getDrinks();
});

$('#loginForm').on('submit', function(e) {
  e.preventDefault();
  userName = $('#userNameField').val();
  $('#loginFormDiv').addClass('d-none');
  $('#addDrinkButtonDiv').removeClass('d-none');
  $('#addDrinkButtonDiv').find('button').append(", " + userName);
});

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

$('#latestDrinksList').on('click', '.deleteDrinkButton', function() {
  var gotID = $(this).closest('.card').find('.likesP-liked').attr('id');
  $(this).closest('.card').remove();
  deleteDrink(gotID);
});

function deleteDrink(drinkID) {
  drinksDB.doc(drinkID).delete().then(function() {
    console.log(drinkID + " deleted");
  }).catch(function(error) {
    console.error("Error removing document: ", error);
  });
}

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
             <p class='userCredit'>Submitted by ${doc.data().userName}</p>
          </div>
        </div>
      `);
      heartIterator += 1;
    });
    $('#loadingDiv').remove();
  });
  drinksDB.orderBy('likes', 'desc').get().then((querySnapshot) => {
    popHeartIterator = -1;
    querySnapshot.forEach((doc) => {
      $('#popularDrinksList').append(`
        <div class="card">
          <p id='${doc.id}' class='likesP'>
            <i class='heart far fa-heart'></i>
            <span id='likeSpan-${popHeartIterator}' class='likeSpan'> ${doc.data().likes}</span>
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
             <p class='userCredit'>Submitted by ${doc.data().userName}</p>
          </div>
        </div>
      `);
      popHeartIterator -= 1;
    });
  });
}

//Increment likes by clicking the heart icons
$('.drinksList').on('click', '.likesP', function() {
  var currentLikeSpan = this;
  var gotID = $(this).attr('id');
  var latestLikeSpan = $('#latestDrinksList').find('#'+gotID).find('span').attr('id');
  var popLikeSpan = $('#popularDrinksList').find('#'+gotID).find('span').attr('id')
  var currentRecord = drinksDB.doc(gotID);
  currentRecord.get().then(function(doc) {
    currentLikes = doc.data().likes
    currentLikes += 1;
    currentRecord.update({
      likes: currentLikes
    });
    $('#'+latestLikeSpan).html(currentLikes);
    $('#'+popLikeSpan).html(currentLikes);
  })
  .catch(function(error) {
    console.log("Error getting document:", error);
  });
  $(this).removeClass('likesP').addClass('likesP-liked');
  $(this).find('.heart').remove();
  $(this).prepend('<i class="fas fa-heart"></i>');
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
      imageURL: imageURL,
      userName: userName
    })
    .then(function(docRef) {
      var latestRecipe = `
        <div class="card">
        <p id='${docRef.id}' class='likesP-liked'>
          <i class="fas fa-heart"></i>
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
             <p class='userCredit'>Submitted by ${userName}</p>
             <button class="btn btn-sm btn-outline-danger deleteDrinkButton">delete drink</button>
          </div>
        </div>
      `;
      $('#latestDrinksList').prepend(latestRecipe);
      $('#popularDrinksList').append(latestRecipe);
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
    $('#recipeFormModal').modal('toggle')
  }).catch((error) => {
    console.error(error);
  });
});

//when the modal loads, focus on the drink name field
$('#recipeFormModal').on('shown.bs.modal', function () {
  $('#drinkNameField').trigger('focus')
});
