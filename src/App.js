import React, { Component } from "react";
import './App.css';
import firebase from './firebase/firebase';
import PublicChat from './pages/PublicChat';
import LandingPage from './pages/LandingPage';
import RoomPage from './pages/RoomPage';

class App extends Component {
  constructor() {
    super();
    this.state = {
      clicked: false,
      messageList: [],
      userInput: '',
      userInput2: '',
      userName: 'guest',
      userPW: '',
      hideClass: true,
      hideClassName: '',
      currentTime: '',
      userFirebaseKey: '',
      publicJoin: false,
      privateJoin: false,
      privateCreate: false,
      switchSign: 'Sign up',
      stop: false,
      userSignedIn: false,
      roomName: 'publicRoom', 
      pastRoomNames: [`You haven't chatted in other rooms rooms`],
      rightText: 'rightText',
    }
  }

  componentDidMount = () => {
    // make sure that user stays signed in even on page reload. As soon as local storage sign in is updated, also update the userSignIn in state
    if (localStorage.userSignedIn === 'true') {
      this.setState({
        userSignedIn: true,
        userName: localStorage.userName,
        userPW: localStorage.userPW,
      })    
    }

    // run function on page load to track which rooms the user is in
    this.findRoomsUserIsIn();

    // }
  }

  // LANDING PAGE FUNCTIONALITY AND FUNCTIONS

  // function to allow on landing page button click the switch of text from sign up (user) to login (user)
  switchSign= () => {
    if (this.state.switchSign === 'Sign up') {
      this.setState({
        switchSign: 'Login',
      })
    } else {
      this.setState({
        switchSign: 'Sign up',
      })
    }
  }
  
  // depending on the login or sign up above, run a function to login user or sign up the user
  signUpOrLogin = (e) => {
    e.preventDefault();
    let name = this.state.userInput;
    let pw = this.state.userInput2;
    if (this.state.switchSign === 'Sign up') {
      
      this.signUp(name, pw)
    } else if (this.state.switchSign === 'Login') {
      this.login(name, pw)
    }      
  }

  // sign up funciton adds a user object with sign in details to firebase and runs various checks to stop (similar usernames being uploaded, no text input etc)
  signUp = (name, pw) => {  
    // pull users area of firebase
    const users = firebase.database().ref('users');
    // pull current time 
    const currentTime = Date(Date.now()).toString();

      // create object with details of sign up
    const userObject = {
        userID: name,
        userPW: pw,
        signUpTime: currentTime,
    }
      // check if someone already has this userID. This will stop people getting confused with who they are talking to
      users.on('value', (users) => {
        
        let usersCleaned = users.val();
        for (let user in usersCleaned) {
          
          if (usersCleaned[user].userID == name ) {
            this.setState({
              stop: true,
            })
          }  
        }
      })
      
      // make sure the state above has finished before running
      setTimeout(() => { 
        // only run if user has input both text fields
        if (!pw || !name) {
          alert('please fill both sign in fields')
        } 
        // only run it if the stop status set above is set to false.
        else if (this.state.stop === true) {
          alert('sorry someone already has that user name. Try again.')
          this.setState({
            stop: false,
          })
        } 
        // this error shouldn't need to run, but just in case the user is back on the landing page whilst signed in, make them sign up as another user 
        else if (this.state.userSignedIn === true) {
          alert('Already signed in I am afraid')
        } 
        
        // If none of the above are true, push user to database  and update the state as well as local storage
        else {
            const pushID = users.push(userObject);
            userObject.userFirebaseKey = pushID.key;
            users.child(pushID.key).update(userObject);
            this.setState({
              userName: name,
              userPW: pw,
              userSignedIn: true,
              userInput: '',
            })

            localStorage.setItem('userName', name);
            localStorage.setItem('userPW', pw);
            localStorage.setItem('userSignedIn', true)
        }
      }, 500);


   
    
  } 

  // similar to the sign up function above but instead checks database for user input. If input aligns, sign them in as that user in local storage and state
  login = (name, pw) => {
    // This shouldn't need to run but just in case, highlight to user that they are already signed in
    if (this.state.userSignedIn === true) {
      alert('Already signed in. sign out when you can')
      return
    }

    // check login details vs. database. If the same, then set 
    const users = firebase.database().ref('users');
    users.on('value', (users) => {

      let usersCleaned = users.val();
      let testArray = []
      for (let user in usersCleaned) {

        if (usersCleaned[user].userID === name && usersCleaned[user].userPW.toString() === pw) {
          this.setState({
            userName: name,
            userPW: pw,
            userSignedIn: true,
            userInput: '',
          })
          testArray.push('match')
          localStorage.setItem('userName', name);
          localStorage.setItem('userPW', pw);
          localStorage.setItem('userSignedIn', true)
        } 
      } 
      if (testArray.length === 0) {
        alert('sorry, no username and ID matches those. Try again')
      }

    })
    }

  adjustPublicJoinStatus = (e) => {
    e.preventDefault();
    // already stored their input in userInput for storage on the 'join as guest' landing page button
    let userName = this.state.userInput;

    // set state to true as they are public joining
    this.setState({
      publicJoin: true,
      userInput: '',
    })
    // run the group chat function but with details above set to public join so they don't join any private rooms
    this.groupChatStart(userName);
  }

  // a universal scroll down function. The site never has more than two sections per page so this always scrolls the user's viewport to the second section
  scrollDown = (e) => {
    e.preventDefault();
    window.scrollBy(0, 1000);
  }

  // MAIN CHAT FUNCTIONALITY 

  // The core funciton that creates the messaging page. This runs either for public guest chat, joining private rooms or creating private rooms
  groupChatStart = (name) => {
    // ask for user name and store in variable
    let userNameResponse = name;
    
    // Users who are signed in can be told apart as no user can have the same username. To stop clashes for guests though, add ('guest') to their name 
    if (this.state.userSignedIn === false) {
      userNameResponse = userNameResponse + ' (guest)';
    } 

    // pull firebase
    const chatrooms = firebase.database().ref('chatrooms');
    // always listen to firebase database chatroom messages. On changes to messages, update state. This state messageList is then appended to the page by various components in PublicChat.js
    chatrooms.on('value', (chatroom) => {
      const chatrooms = chatroom.val();
      const currentRoom = this.state.roomName;
      const chatroomPush = chatrooms[currentRoom];
      
      let messageArray = [];
      for (let message in chatroomPush) {
        messageArray.push(chatroomPush[message])
      }
      // when chatroom changes, push the entire chatroom message to state
      this.setState({
        messageList: messageArray,
        userName: userNameResponse,
      })
      
    })
  }

  // GENERAL TEXT INPUT FUNCTIONS 

  // Ensure that whenever any text input box is written in, the state of userINput is updated. We will use this data in handle submit below
  handleChange = (event) => {
    // when input text box changes, update state of the userInput dynamically

    // if its the signIn part, update userInput one for usage
    if (event.target.className === 'signInName') {
        this.setState({
        userInput: event.target.value
        })
    // if its the key part, update userInput one for usage

    } else if (event.target.className === 'signInRandomKey') {
        this.setState({
          userInput2: event.target.value
        })
    }   // if its anything else, update userInput one for usage
    else {
      this.setState({
        userInput: event.target.value
      })
    }
  }

  // On submit of any button (with text input), update firebase with the userInput written by the user in function above. 
  handleSubmit = (event) => {
    event.preventDefault();
    // set firebase object of chatroom
    const chatrooms = firebase.database().ref('chatrooms');
    // pull username and message 
    const enqueuedMessage = this.state.userInput;

    // find latest time / date
    const currentTime = Date(Date.now()).toString();
    // strip of wasted GMT stuff from the data
    const newCurrentTime = currentTime.slice(0, 25);
    
    // create message box ready to go to firebase
    const messageObject = {
      userID: this.state.userName,
      userMessage: enqueuedMessage,
      currentTime: newCurrentTime,
      userFirebaseKey: '',
    }
    // push message object to firebase in the 'current' room with publicRoom (guest room) as the default if message isn't empty
    if (enqueuedMessage) {
      // store the pushID given to us from firebase
      const pushID = chatrooms.child(this.state.roomName).push(messageObject);
      // update the firebase key with variable pushID
      messageObject.userFirebaseKey = pushID.key;
      chatrooms.child(this.state.roomName).child(pushID.key).update(messageObject);
      // empty state ready for the next user message
      this.setState({
        userInput: '',
        currentTime: '',
        userFirebaseKey: '',
      })
    }
    let element = document.querySelector('.lastMessage');
    setTimeout(function () {
      element.scrollIntoView();
    }, 100);
  }

  removeMessage = (event) => {
    // pull the firebase chatroom necessary
    const chatrooms = firebase.database().ref('chatrooms');
    // compare current username vs. username held in class on the event clicked on (see total messages span)
    if (this.state.userName === event.target.className)
    // if they are the same, then go into database and find the clicked on message's firebase key. In this firebase key area of your database, delete it
    {
      chatrooms.child(this.state.roomName).child(event.target.id).remove();
    }
    // else alert the user that they can't delete other people's messages
    else {
      alert(`You can only delete your own messages`)
    }
  }

  // the sign out button. If clicked, it resets all the state which returns users to the landing page
  goBackToStart = (e) => {
    e.preventDefault();
    this.setState({
      clicked: false,
      messageList: [],
      userInput: '',
      userInput2: '',
      userName: 'Tom',
      userPW: '',
      currentTime: '',
      userFirebaseKey: '',
      publicJoin: false,
      privateJoin: false,
      privateCreate: false,
      switchSign: 'Sign up',
      stop: false,
      userSignedIn: false,
      roomName: 'publicRoom', 
      pastRoomNames: [],
      rightText: 'rightText',
    })
    localStorage.clear()
  }

  // 2nd PAGE (USER SIGNED INTO THE HUB) FUNCTIONALITY

  // create a room functionality
  createRoom = (e) => {
    e.preventDefault();
    let roomName = this.state.userInput;

    // pull database
    const chatrooms = firebase.database().ref('chatrooms');
    chatrooms.on('value', (chatrooms) => {
      let chatroomsCleaned = chatrooms.val();
      
      for (let chatroom in chatroomsCleaned) {
        // create a barrier for running the function if the chatroom name already exists
        if (chatroom.toString() == roomName.toString()) {
          this.setState({
            stop: true,
          })
        }
      }

    })

    setTimeout(() => { 
    // only run if user has input both text fields 
    if (roomName === '') {
      alert('please fill a room name')
    } 
    // only run it if the stop status set above is set to false
      else if (this.state.stop === true) {
      alert('sorry someone already has that room name. Try again.')
      this.setState({
        stop: false,
      })
    }
    // create a room object ready to be pushed to database
    else {
      // remove push as not as clean a database
      let template = '0';
      const chatRoomObject = {
        [roomName]: {
          [template]: {
            userID: "Chattr Bot",
            userMessage: "Start chat below",
          }
        }
      }
      // push it to the database
      chatrooms.update(chatRoomObject);
      this.setState({
        roomName: roomName,
        userInput: '',
        privateCreate: true,
      })
      // run the group chat start function but with the details of created room above
      let name = this.state.userName;
      this.groupChatStart(name);
    }
    }, 300);
  }

  // if in an existing room, run a function before join room, to make sure we join the room clicked on in the side bar of the public chat page
  switchRoom = (e) => {
    this.setState({
      userInput: e.target.id,
    });
    setTimeout(() => {
      this.joinRoom()
    }, 300);
  }

  // similar to the create a room funciton. However, only allow the state to be updated to room details if the room input exists
  joinRoom = (e) => {
    if (e) {
      e.preventDefault();
    }
    let roomName = this.state.userInput;

    // pull database
    const chatrooms = firebase.database().ref('chatrooms');
    chatrooms.on('value', (chatrooms) => {
      let chatroomsCleaned = chatrooms.val();
      let matchOnce = [];
      // if room name input by user === chatroom in database then carry on, if not then stop
      for (let chatroom in chatroomsCleaned) {
        if (chatroom.toString() == roomName.toString()) {
          matchOnce.push('match')
        } else {
        }
      }
      // based on above conditional either set stop to true of false
      if (matchOnce.length > 0) {
        this.setState({
          stop: false,
        })
      } else {
        this.setState({
          stop: true,
        })
      }
    })
    // give the time for set state stop to run above
    setTimeout(() => {
      // only run if user has input both text fields
      if (roomName === '') {
        alert('please fill a room name')
      }
      // update the roomName to userInput if exists
      // only run it if the stop status set above is set to false
      else if (this.state.stop === false) {
        this.setState({
          roomName: roomName,
          userInput: '',
          privateJoin: true,
        })
        let name = this.state.userName
        this.groupChatStart(name);
      } // if no rooms matched, throw an alert
      else {
        alert('sorry there are no room names with that title. Try again.')
        
      }

    }, 500);

  }

  // a very tricky function> I had to check all the chatrooms for activity by the user. If the user had had past activity, these are appended to the page, and allow user to jump between rooms
  findRoomsUserIsIn = () => {
    const dbRef = firebase.database().ref();
    // pull and clean the firebase objects into array of objects that can be iterated through
    dbRef.on('value', (data) => {
      let chatroomsArray = [];
      let finalRoomsArray = [];
      let usersAndRooms = data.val();
      for (let rooms in usersAndRooms) {
        chatroomsArray.push(usersAndRooms[rooms])
      }
      // then next loops together. In short, we want to delve into every message in our database and compare the sender to the current user. 
      // For any message the current user has sent, store the room that it was sent in our state
      for (let roomName in chatroomsArray[0]) {

        for (let messages in chatroomsArray[0][roomName]) {
          
          if (chatroomsArray[0][roomName][messages].userID.includes(this.state.userName.toLowerCase())) {
            finalRoomsArray.push(roomName)
          }
        }
      }
      // filter duplicates from array so only unique rooms left
      let cleanedFinalArray = [...new Set(finalRoomsArray)]     

      // if array is short show that they haven't had activity
      if (cleanedFinalArray.length === 0) {
        this.setState({
          pastRoomNames: [`You haven't chatted in other rooms rooms yet`]
        })
      }
      // if only guest activity, show this
      else if (cleanedFinalArray[0] === 'publicRoom') {
        this.setState({
          pastRoomNames: [`Only chatted as a guest`]
        })
      } 
      // otherwise pass the rooms the user has had activity in
      else if (cleanedFinalArray.length > 0) {
        this.setState({
          pastRoomNames: cleanedFinalArray,
        })
      }
      
    })
  }
  
  // final render function
  // What page is shown to the user is based on conditionals. 
  
  render() {
    return (
      <div className="App">
          {
            // If public join is true, create a public chat room as a guest
            this.state.publicJoin 
            ? 
            <PublicChat rightText={this.state.rightText} switchRoom={this.switchRoom} pastRoomNames={this.state.pastRoomNames} userName={this.state.userName} statusChat={this.state.roomName} userInput={this.state.userInput} handleChange={this.handleChange} handleSubmit={this.handleSubmit} messageList={this.state.messageList} removeMessage={this.removeMessage} goBackToStart={this.goBackToStart}/>
            // If user not signed in or publicly joined, show the landing page
             : 
             (!this.state.userSignedIn 
              ? 
              <LandingPage publicJoin={this.adjustPublicJoinStatus} handleChange={this.handleChange} signUpOrLogin={this.signUpOrLogin} switchSign={this.switchSign} signOrLogin={this.state.switchSign} scrollDown={this.scrollDown}/>
              :
              // if private room created, create a private chat room

              (this.state.privateCreate
                ?
                <PublicChat rightText={this.state.rightText} switchRoom={this.switchRoom} pastRoomNames={this.state.pastRoomNames} userName={this.state.userName} statusChat={this.state.roomName} userInput={this.state.userInput} handleChange={this.handleChange} handleSubmit={this.handleSubmit} messageList={this.state.messageList} removeMessage={this.removeMessage}  goBackToStart={this.goBackToStart} />
                :
                // if private room joined, join a private chat room

                (this.state.privateJoin
                  ?
                  <PublicChat rightText={this.state.rightText} switchRoom={this.switchRoom} pastRoomNames={this.state.pastRoomNames} userName={this.state.userName} statusChat={this.state.roomName} userInput={this.state.userInput} handleChange={this.handleChange} handleSubmit={this.handleSubmit} messageList={this.state.messageList} removeMessage={this.removeMessage} goBackToStart={this.goBackToStart} />
                  :
                  <RoomPage pastRoomNames={this.state.pastRoomNames} goBackToStart={this.goBackToStart} scrollDown={this.scrollDown} handleChange={this.handleChange} createRoom={this.createRoom} joinRoom={this.joinRoom} userName={this.state.userName}/>
           
                )
              
              
              )
                )
          }      
      
      </div>

    )
  }
  }

export default App;
