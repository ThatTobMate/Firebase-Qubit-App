function init () {
  var myUser = {}
  var pre = document.getElementById('data')
  document.getElementById('logOut').addEventListener('click', logOut)

  // Get a reference to the database

  var database = firebase.database();

  // *** Authentication ***

  // STEP 1

    // Create a user and then add the user to a table in the database to act as a profile
    // as you don't have access to edit the auth objects.

    // firebase.auth().createUserWithEmailAndPassword('thale.android@gmail.com', 'password')
    // .then(function (user) {
    //   debugger
    //   database.ref('users/' + user.uid).set({
    //     email: user.email,
    //     name: 'Tobias'
    //   });
    // });


  // STEP 2 - comment line 51 then 53
    // Check for current user and add a pet and add a watcher on the users node for any changes

    // firebase.auth().onAuthStateChanged(function(currentUser) {
    //   if (currentUser) {
    //     console.log('Email: ' + currentUser.email, 'User ID: ' + currentUser.uid);

    //     getUserInformation(currentUser);

    //     document.getElementById('createPet').addEventListener('click', function () {
    //       createPet(currentUser);
    //     })

    //   } else {
    //     console.log('No user signed in');
    //   }
    // });


    // Get users information and set a watcher at this node to listen
    // for any changes to that user so we can update myUser variable.
    // Other watchers available, child_added, child_removed, child_updated

    function getUserInformation (user) {
      database.ref('users/' + user.uid).on('value', function(snapshot){
        debugger
        myUser = snapshot.val()

        var petId = myUser.petId

        appendHtml(myUser)
        
        // Delete created pet before commenting in below and comment in 94-95
        // if (petId) getUsersPets(petId)
      });
    }

  // STEP 3

    // Create a pet for the user and add the reference of the pet to the user

    function createPet (currentUser) {
      var pet = database.ref('pets/').push({
        name: 'Digby',
        species: 'Dog',
        owner: currentUser.uid
      }).key;
      debugger
      database.ref('users/' + currentUser.uid).update({
        petId: pet
      });

      // What's next?
    }

  function getUsersPets (petId) {
    database.ref('pets/' + petId).on('value', function(snapshot) {
      myUser.pet = snapshot.val()
      appendHtml(myUser)
    })
  }

  function appendHtml ( myUser ) {
    if (myUser) {
      pre.innerHTML = [
      '<pre>',
         'Name: ' + myUser.name + ', ',
         'Email: ' + myUser.email + ', ',
         'Pet ID: ' + myUser.petId + ', ',
         // 'Pet: ' + myUser.pet.name + ', ',
         // 'Species: ' + myUser.pet.species,
       '</pre>'
       ].join('');
     } else {
      pre.innerHTML = '<h3> Logged Out </h3>'
     }
    
  }

  function logOut () {
    firebase.auth().signOut().then(function() {
      appendHtml()
    }, function(error) {
      console.log('failed')
    });
  }
}
window.onload = init