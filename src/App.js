import React, { Component } from "react";
import './App.css';
import firebase from './firebase/firebase';
import MessageInput from './formComponents/MessageInput';
import TotalMessages from './formComponents/TotalMessages';

// import ThreeContainer from './three.js/ThreeContainer';

class App extends Component {
  constructor() {
    super();
    this.state = {
      clicked: false,
      messageList: [],
      userInput: '',
      userName: 'tom',
      hideClass: true,
      hideClassName: '',
      currentTime: '',
      userFirebaseKey: '',
    }

  
  }

  componentDidMount() {
    // ask for user name and store in variable
    let userNameResponse = prompt('What is your Name?')
    // if user doesn't give a name, make them
    if (userNameResponse === '') {
      userNameResponse = prompt('try again, what is your name?')
    }

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
      // when chatroom changes, push the entire chatroom message to state
      this.setState({
        messageList: messageArray,
        userName: userNameResponse,
      })

    })
  }

  handleChange = (event) => {
    // when input text box changes, update state of the userInput dynamically
    this.setState({
      userInput: event.target.value
    })
  }

  handleSubmit = (event) => {
    event.preventDefault();
    // set firebase object of chatroom
    const chatrooms = firebase.database().ref('chatrooms');
    const chatroom1 = chatrooms.child('chatroom1');
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
    var element = document.querySelector('.lastMessage');
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
          
          <h1>Chattr<span className='cubed'>3</span></h1>
          
          <MessageInput userInput={this.state.userInput} trackChanges={this.handleChange} submitStore={this.handleSubmit} />        
          <div className='messagesBox'>
            <div>
              {this.state.messageList.map((messageObject) => {
                return (
                  <TotalMessages userID={messageObject.userID} userMessage={messageObject.userMessage} hidden={this.state.hideClassName} sendDate={messageObject.currentTime} cancelMessage={this.removeMessage} firebaseKey={messageObject.userFirebaseKey}/>
                )
              }
              )}
            {/* empty div so we can scroll to the newest message on message send */}
            <div className='lastMessage'>..</div>

            </div>
          </div>
          <button className="clear" onClick={this.changeHideState}>Hide / UnHide chat </button>
          <button className="clear" onClick={this.removeChat}>Remove Chat Permanently for everyone </button>

        {/* </div> */}
        
        
        
        
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
