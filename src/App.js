import React, { Component } from "react";
import './App.css';
import firebase from './firebase/firebase';
import PageOne from './pages/PageOne'
import LandingPage from './pages/LandingPage'


/// CHECK THAT IT SCROLLS TO BOTTOM WHEN YOU SET LIVE SITE

// import ThreeContainer from './three.js/ThreeContainer';

class App extends Component {
  constructor() {
    super();
    this.state = {
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
      switchSign: 'Sign up',
      stop: false,
    }

  
  }

  componentDidMount() {
    // if (this.state.publicJoin === true) {
    //   this.groupChatStart();
    // } else {
    //   return
    // }
  }

  // PAGE 1 FUNCTIONALITY

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
      this.login()
    }      
  }

  signUp = (name, pw) => {
    // on sign up - set username and password of input in the state
    this.setState({
      userName: name,
      userPW: pw,
    })    
    // pull users area of firebase
    const users = firebase.database().ref('users');
    // pull current time 
    const currentTime = Date(Date.now()).toString();
    // hack needed a setTimeout to deliver the non-default states
    setTimeout( () => {
      // create object with details of sign up
      const userObject = {
        userID: this.state.userName,
        userPW: this.state.userPW,
        signUpTime: currentTime,
      }
      // check if someone already has both these userID / password
      users.on('value', (users) => {
        
        let usersCleaned = users.val();
        for (let user in usersCleaned) {
          
          if (usersCleaned[user].userID == this.state.userName && usersCleaned[user].userPW.toString() == this.state.userPW) {
            this.setState({
              stop: true,
            })
          }  
        }
      })
      
      // only run if user has input both text fields
      if (!this.state.userPW || !this.state.userName) {
        alert('please fill both sign in fields')
      } 
      // only run it if the stop status set above is set to false
      else if (this.state.stop === true) {
        alert('sorry someone already has that key with that user name. Try again.')
      } 
      // push user to database if the two conditionals above are false
      else {
        const pushID = users.push(userObject);
          userObject.userFirebaseKey = pushID.key;
          users.child(pushID.key).update(userObject);
          this.setState({
            userID: '',
            userPW: '',
          })
      }
    }, 50);
  } 

  login = () => {
    console.log('login')
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

  // PAGE 2 FUNCTIONALITY

  groupChatStart = (name) => {
    // ask for user name and store in variable
    let userNameResponse = name;
    // if user doesn't give a name, make them
    // if (userNameResponse === '') {
    //   userNameResponse = prompt('try again, what is your name?')
    // }

    //add to the name given by a user a random generated number to ensure people are different
    const randomUserId = Math.floor(Math.random() * 100);
    userNameResponse = userNameResponse + randomUserId;

    // pull firebase
    const chatrooms = firebase.database().ref('chatrooms');
    // always listen to firebase database chatrooms. On changes to database, update state
    chatrooms.on('value', (chatroom) => {
      const chatrooms = chatroom.val();
      const chatroom1 = chatrooms.chatroom1;
      let messageArray = [];
      for (let message in chatroom1) {
        messageArray.push(chatroom1[message])
      }
      console.log(messageArray)
      // when chatroom changes, push the entire chatroom message to state
      this.setState({
        messageList: messageArray,
        userName: userNameResponse,
      })
      let element = document.querySelector('.lastMessage');
      setTimeout(function () {
        element.scrollIntoView();
      }, 100);
    })
  }

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


    const messageObject = {
      userID: this.state.userName,
      userMessage: enqueuedMessage,
      currentTime: currentTime,
      userFirebaseKey: '',
    }
    // push message object to firebase if message isn't empty
    if (enqueuedMessage) {
      // store the pushID given to us from firebase
      const pushID = chatrooms.child('chatroom1').push(messageObject);
      // update the firebase key with variable pushID
      messageObject.userFirebaseKey = pushID.key;
      chatrooms.child('chatroom1').child(pushID.key).update(messageObject);

      this.setState({
        userInput: '',
        currentTime: '',
        userFirebaseKey: '',
      })
    }

    // on submit - scroll to the bottom of the page after a delay (allow message to be appended)
    // let element = document.querySelector('.lastMessage');
    // setTimeout(function () { 
    //   element.scrollIntoView(); 
    // }, 100);
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
    const chatroom1 = chatrooms.child('chatroom1')
    const userCertain = window.confirm('Are you sure you want to delete the chat for all participants?')

    if (userCertain) {
      chatrooms.child('chatroom1').set({
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
    // pull the firebase chatroom1 necessary
    const chatrooms = firebase.database().ref('chatrooms');
    // compare current username vs. username held in class on the event clicked on (see total messages span)
    if (this.state.userName === event.target.className) 
    // if they are the same, then go into database and find the clicked on message's firebase key. In this firebase key area of your database, delete it
    {
      chatrooms.child('chatroom1').child(event.target.id).remove();  
    } 
    // else alert the user that they can't delete other people's messages
    else {
      alert(`You can only delete your own messages`)
    }
  }

  


  // THREE.JS STRETCH
  // runThree = () => {
  //   this.setState({
  //     clicked: !this.state.clicked,
  //   });
  // }
  render() {
    return (
      <div className="App">
          
          {
             this.state.publicJoin 
             ? 
            <PageOne userInput={this.state.userInput} handleChange={this.handleChange} handleSubmit={this.handleSubmit} messageList={this.state.messageList} hideClassName={this.state.hideClassName} removeMessage={this.removeMessage} changeHideState={this.changeHideState} removeChat={this.removeChat}/>
             : 
            <LandingPage publicJoin={this.adjustPublicJoinStatus} handleChange={this.handleChange} signUpOrLogin={this.signUpOrLogin} switchSign={this.switchSign} signOrLogin={this.state.switchSign}/>

          }        
        {/* {
          // THREE.JS STRETCH
          this.state.clicked 
              ? <ThreeContainer />
              : null
        } */}
      </div>

    )
  }
  }

export default App;


// THREE JS STRETCH
// combined three js with react by following this guide - https://blog.bitsrc.io/starting-with-react-16-and-three-js-in-5-minutes-3079b8829817

// split three.js into multiple files with guide - https://medium.com/javascript-in-plain-english/javascript-in-3d-an-introduction-to-three-js-780f1e4a2e6d
