

// OVERVIEW
    // MVP - a react group chat app with firebase. 
        // Features - users can go onto a website and write messages to each other on different computers
    // Stretch - we'll see... :)

// HOW IT WORKS - 
    // PAGE LOAD
        // On page load, React pulls a component for a on a basic one page landing page describing the chat app with a get started button and a text input for your name
        // MVP - create a user text input
        // STRETCH GOAL - create a room button
        // STRETCH GOAL
            // Two Buttons i) to sign up ii) to login

    // USER CHATROOMS
        // On click, your username is stored with a unique ID in firebase
        // Live group chatroom with everyone currently on the site
            // New page renders with textbox and message submit button.
            // also, function runs to go live listening to the setState for the site
            // this setState is linked to a 'chat room' object in firebase
            // each chat room contain past objects with two items i) userID ii) the message
        
        // constantly be listening for changes in firebase and render those changes to the text input
        
        // on text input, update the userCurrent Message to keyboard clicks (see toDoAppcodeAlong)
            // on submit, take the state and update firebase message chatroom object with the new message (userName / ID and the message)
        // this will then be render ot the page. 

    

    // STRETCH GOAL phase 1
        // Make everyone's username different by either 
            // i) adding their firebaseID (made up by firebase) added to the username they give us
            // ii) or giving a choice of colour at the beginning
        // Add hide or remove buttons from the chat
        // Add date / time to each message
        // Remove only your individual messages.


// NEXT /////////////////////////////////

 
     

    





        // Make a create chat room feature in firebase and join multiple rooms
            
        // Create room room
            // On landing page, offer create a room feature with text input for the name of the room
            // on button submit, object created in firebase with name stored as an object

        // Join Room
            // Show join room with click and asking for room name.
            // on submit, listen to the database using .once(). Then use a loop through to check if their room name is in thethe database look through firebase with for in loop 
            // if its not in their, then show an erro
            // if its in there, then pull ocmponent with textbox
            // render to the page with 

    // Stretch goal 3
        // add full login feature
            // STRETCH GOAL - Login
        // On sign up click
            // alert on the screen asking for email, name, password and confirm password
                // user email input to check its an email
                // check passwords match each other by using regex. If not, show an error
                // On submit, user details stored in firebase under a new user object
        // On login click
            // alert on the screen asking forgd email and password
            // on submit, we store the user input and check it against the details we have in firebase. 
            // if they are the same, accept the login as the user
            // if not, show error message
            
       

        // On click of join a current room, you enter the 'room' object with multiple users
        // Browse Chatrooms
            // On click, enter the chat room. Here 
            // If User's email appears in a chat room object, render that chat room to the page as a button (get started with 'Juno chatroom' or 'chat to sophie').
                // These chat rooms boxes will be components in React 
                // the header for each will change based on the chatroom name
        // Create Chatrooms
            // Next to chatrooms, a button to create a new room with text input
            // on create new room submit, an alert is run asking for new object is made in firebase. 
    //
        // User input into text box. On message send, the message text is stored in firebase using .update() as value whilst the key will be a unique user Id stored as a key. Text then pulled by any computer on the site. 

    // STRETCH GOALS
        