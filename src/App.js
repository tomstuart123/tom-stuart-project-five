import React, { Component } from "react";
import './App.css';
import firebase from './firebase/firebase';
import PublicChat from './pages/PublicChat';
import LandingPage from './pages/LandingPage';
import RoomPage from './pages/RoomPage';



// TOD
  // WEB TO DO 
    // add signed in colour to the page
    // add sending of pics / gifs

  // VR TO DO
    // Add VR objects to VR and change the background
    // typing on mobile in vr


// PRESENTATION
  // Lots to show you so will take you through the parts of my app as I built them
  // Public Chat (message with Juan)
    // highlight that we are guest users
    // differentiated by numbers
    // delete your messages but not others
  
  // Sign in functionality (message with russell)
    // Create a room - 
    // Join a room - 
    // Notice we stay signed in throughout the process
    // and we can sign out at anytime
  
  // But the vision of this project isn't just a chat app. The reason I built the 3 at the end was that I eventually would like to work in Virtual reality and James' work inspired me 
    // Juan as messager of the public chat
    // This is react 360 - things are difficult here. 
    // <Text> elements are used and <View>
    // 



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
      priorRoomMessage: `You currently don't have any rooms set up`,
      pastRoomNames: [],
    }
  }

  componentDidMount = () => {
    // store sign in via local storage
    if (localStorage.userSignedIn === 'true') {
      this.setState({
        userSignedIn: true,
        userName: localStorage.userName,
        userPW: localStorage.userPW,
      })    
    }

    // if userID in firebase === 
    this.findRoomsUserIsIn();

    // }
  }

  // LANDING PAGE FUNCTIONALITY

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
      // check if someone already has both these userID / password
      users.on('value', (users) => {
        
        let usersCleaned = users.val();
        for (let user in usersCleaned) {
          
          if (usersCleaned[user].userID == name && usersCleaned[user].userPW.toString() == pw) {
            this.setState({
              stop: true,
            })
          }  
        }
      })
      
      setTimeout(() => { 
        // only run if user has input both text fields
        if (!pw || !name) {
          alert('please fill both sign in fields')
        } 
        // only run it if the stop status set above is set to false
        else if (this.state.stop === true) {
          alert('sorry someone already has that key with that user name. Try again.')
          this.setState({
            stop: false,
          })
        } 
        // error if already signed in 
        else if (this.state.userSignedIn === true) {
          alert('Already signed in I am afraid')
        } 
        
        // push user to database if the two conditionals above are false
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

  login = (name, pw) => {
    // if already signed in, highlight to user
    if (this.state.userSignedIn === true) {
      alert('Already signed in. sign out when you can')
      return
    }

    // check login details vs. database
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
    
    // if login match, run get started function below
  }

  adjustPublicJoinStatus = (e) => {
    e.preventDefault();
    // already stored their input in userInput for storage on this submit
    let userName = this.state.userInput;

    // set state to true
    this.setState({
      publicJoin: true,
      userInput: '',
    })
    // public app start
    this.groupChatStart(userName);
  }

  scrollDown = (e) => {
    e.preventDefault();
    window.scrollBy(0, 1000);
    console.log('hello')
  }


  // MAIN PUBLIC / PRIVATE CHAT FUNCTIONALITY & 

  groupChatStart = (name) => {
    // ask for user name and store in variable
    let userNameResponse = name;
    // if user doesn't give a name, make them
    // if (userNameResponse === '') {
    //   userNameResponse = prompt('try again, what is your name?')
    // }
    const randomUserId = Math.floor(Math.random() * 100);
    //add to the name given by a user a random generated number to ensure people are different
    if (this.state.userSignedIn === false) {
      userNameResponse = userNameResponse + randomUserId + ' (guest)';
    } else {
      userNameResponse = userNameResponse + randomUserId;
    }
    

    // if roomName = publiRoom (i.e. the public guest chat), add guest to their name, ID and 
   

    // pull firebase
    const chatrooms = firebase.database().ref('chatrooms');
    // always listen to firebase database chatrooms. On changes to database, update state
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

  handleSubmit = (event) => {
    event.preventDefault();
    // set firebase object of chatroom
    const chatrooms = firebase.database().ref('chatrooms');
    // pull username and message 
    const enqueuedMessage = this.state.userInput;

    // find latest time / date
    const currentTime = Date(Date.now()).toString();
    // strip of GMT stuff
    const newCurrentTime = currentTime.slice(0, 25);
    
    const messageObject = {
      userID: this.state.userName,
      userMessage: enqueuedMessage,
      currentTime: newCurrentTime,
      userFirebaseKey: '',
    }
    // push message object to firebase in the 'current' room with chatroom1 as the default if message isn't empty
    if (enqueuedMessage) {
      // store the pushID given to us from firebase
      const pushID = chatrooms.child(this.state.roomName).push(messageObject);
      // update the firebase key with variable pushID
      messageObject.userFirebaseKey = pushID.key;
      chatrooms.child(this.state.roomName).child(pushID.key).update(messageObject);

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

  changeHideState = (event) => {
    // if hide button clicked, change hideClass to true
    this.setState({
      hideClass: !this.state.hideClass,
    })
    //run hidechat
    this.hideChat();
  }

  hideChat = () => {
    // if user has clicked the button and hideClass state is true, then add the hideClassName to all the li messages 
    if (this.state.hideClass === true) {
      this.setState({
        hideClassName: 'hide',
      })
    } 
    // else, remove hideClass name from all li messages 
    else {
      this.setState({
        hideClassName: '',
      })
    }
  }

  removeChat = (event) => {
    const chatrooms = firebase.database().ref('chatrooms');
    const userCertain = window.confirm('Are you sure you want to delete the chat for all participants?')

    if (userCertain) {
      chatrooms.child(this.state.roomName).set({
        0: {
          userID: "Chattr Bot",
          userMessage: "Start chat below"
        }
      });
    } else {
      return
    }

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

  goBackToStart = (e) => {
    e.preventDefault();
    this.setState({
      clicked: false,
      messageList: [],
      userInput: '',
      userInput2: '',
      userName: 'Tom',
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
      pastRoomNames: [],
    })
    localStorage.clear()
  }

    // 3rd PAGE (PUBLIC CHAT) FUNCTIONALITY
  
  createRoom = (e) => {
    e.preventDefault();
    let roomName = this.state.userInput;

    const chatrooms = firebase.database().ref('chatrooms');
    chatrooms.on('value', (chatrooms) => {
      let chatroomsCleaned = chatrooms.val();
      
      for (let chatroom in chatroomsCleaned) {

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
    // update the roomName to userInput if exists
    // only run it if the stop status set above is set to false
      else if (this.state.stop === true) {
      alert('sorry someone already has that room name. Try again.')
      this.setState({
        stop: false,
      })
    }
    
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
      chatrooms.update(chatRoomObject);
      this.setState({
        roomName: roomName,
        userInput: '',
        privateCreate: true,
      })
      // run append to page function that takes name as the only parameter
      let name = this.state.userName;
      this.groupChatStart(name);
    }
    }, 300);
  }

  joinRoom = (e) => {
    e.preventDefault();

    let roomName = this.state.userInput;
    const chatrooms = firebase.database().ref('chatrooms');
    chatrooms.on('value', (chatrooms) => {
      let chatroomsCleaned = chatrooms.val();
      let matchOnce = [];
      for (let chatroom in chatroomsCleaned) {
        if (chatroom.toString() == roomName.toString()) {
          matchOnce.push('match')
        } else {
        }
      }
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
    setTimeout(() => {
      console.log(this.state.stop)
      // only run if user has input both text fields
      if (roomName === '') {
        alert('please fill a room name')
      }
      // update the roomName to userInput if exists
      // only run it if the stop status set above is set to false
      else if (this.state.stop === false) {
        // alert('sorry there are no room names with that title. Try again.')
        // this.setState({
        //   stop: false,
        // })
        this.setState({
          roomName: roomName,
          userInput: '',
          privateJoin: true,
        })
        let name = this.state.userName
        this.groupChatStart(name);
      } else {
        alert('sorry there are no room names with that title. Try again.')
        
      }

      // else {
      //   // remove push as not as clean a database
      // }
    }, 500);

  }


  // check if UserID in firebase === current signed in User in state.
  // if they are the same, pull the room name

  findRoomsUserIsIn = () => {
    // const chatrooms = firebase.database().ref('chatrooms');
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
      // filter duplicates from array
      let cleanedFinalArray = [...new Set(finalRoomsArray)]
      console.log(cleanedFinalArray)
      

      if (cleanedFinalArray.length > 0) {
        this.setState({
          pastRoomNames: cleanedFinalArray,
        })
      } else {
        this.setState({
          pastRoomNames: ['you have no past rooms so lets get started above!'],
        })
      }
      
    })
  }

  // appendRoomsToScreen = () => [
  //   setTimeout(() => { 
  //   console.log(this.state.pastRoomNames)
  //   }, 500)
  // ]
  
  render() {
    return (
      <div className="App">
          {
            this.state.publicJoin 
            ? 
            <PublicChat statusChat={this.state.roomName} userInput={this.state.userInput} handleChange={this.handleChange} handleSubmit={this.handleSubmit} messageList={this.state.messageList} hideClassName={this.state.hideClassName} removeMessage={this.removeMessage} changeHideState={this.changeHideState} removeChat={this.removeChat} goBackToStart={this.goBackToStart}/>
           
             : 
             (!this.state.userSignedIn 
              ? 
              <LandingPage publicJoin={this.adjustPublicJoinStatus} handleChange={this.handleChange} signUpOrLogin={this.signUpOrLogin} switchSign={this.switchSign} signOrLogin={this.state.switchSign} scrollDown={this.scrollDown}/>
              :
              (this.state.privateCreate
                ?
                <PublicChat userName={this.state.userName} statusChat={this.state.roomName} userInput={this.state.userInput} handleChange={this.handleChange} handleSubmit={this.handleSubmit} messageList={this.state.messageList} hideClassName={this.state.hideClassName} removeMessage={this.removeMessage} changeHideState={this.changeHideState} removeChat={this.removeChat} goBackToStart={this.goBackToStart} />
                :
                (this.state.privateJoin
                  ?
                  <PublicChat pastRoomNames={this.state.pastRoomNames} userName={this.state.userName} statusChat={this.state.roomName} userInput={this.state.userInput} handleChange={this.handleChange} handleSubmit={this.handleSubmit} messageList={this.state.messageList} hideClassName={this.state.hideClassName} removeMessage={this.removeMessage} changeHideState={this.changeHideState} removeChat={this.removeChat} goBackToStart={this.goBackToStart} />
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


// THREE JS STRETCH
// combined three js with react by following this guide - https://blog.bitsrc.io/starting-with-react-16-and-three-js-in-5-minutes-3079b8829817

// split three.js into multiple files with guide - https://medium.com/javascript-in-plain-english/javascript-in-3d-an-introduction-to-three-js-780f1e4a2e6d
