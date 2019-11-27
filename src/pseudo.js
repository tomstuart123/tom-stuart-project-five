// OVERVIEW
    // MVP - a react chat app with firebase. 
        // Features - users can go onto a website and write messages to each other on different computers. 

// HOW IT WORKS - 
    // PAGE LOAD
        // On page load, React pulls a component for a on a basic one page landing page describing the chat app
        // Two Buttons i) to sign up ii) to login
    // LOGIN
        // On sign up click
            // alert on the screen asking for email, name, password and confirm password
                // user email input to check its an email
                // check passwords match each other by using regex. If not, show an error
                // On submit, user details stored in firebase under a new user object
        // On login click
            // alert on the screen asking for email and password
            // on submit, we store the user input and check it against the details we have in firebase. 
            // if they are the same, accept the login as the user
            // if not, show error message

    // USER CHATROOMS
        // On login we go to the main app page with three sections i) current chat rooms ii) create a room iii) join a room
        // Browse Chatrooms
            // On click, check user's email against available chat rooms in firebase. 
            // If User's email appears in a chat room object, append that chat room to the page as a button (get started with 'Juno chatroom' or 'chat to sophie').
                // These chat rooms boxes will be components in React 
                // the header for each will change based on the chatroom name
        // Create Chatrooms
            // Next to chatrooms, a button to create a new room with text input
            // on create new room submit, an alert is run asking for new object is made in firebase. 
    //
        // User input into text box. On message send, the message text is stored in firebase using .update() as value whilst the key will be a unique user Id stored as a key. Text then pulled by any computer on the site. 