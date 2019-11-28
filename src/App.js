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
    console.log(randomUserId)
    userNameResponse = userNameResponse + randomUserId;

    // pull firebase
    const dbRef = firebase.database().ref(); 
    // always listen to firebase database. On changes to database, update state
    dbRef.on('value', (chatroom) => {
      const chatrooms = chatroom.val();
      const chatroom1 = chatrooms.chatroom1;
      let messageArray = [];
      for (let message in chatroom1) {
        messageArray.push(chatroom1[message])
      }
      console.log(messageArray);
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
    const chatroom1 = firebase.database().ref('chatroom1');
    // pull username and message
    const enqueuedMessage = this.state.userInput;
    const messageObject = {
      userID: this.state.userName,
      userMessage: enqueuedMessage,
    }
    // push message object to firebase if message isn't empty
    if (enqueuedMessage) {
      chatroom1.push(messageObject);
      this.setState({
        userInput: '',
      })
    }
  }

  changeHideState = (event) => {
    // if hide button clicked, change hideClass to true
    this.setState({
      hideClass: !this.state.hideClass,
    })
    console.log('clicked', this.state.hideClass)
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
    const chatroom1 = firebase.database().ref('chatroom1');
    const userCertain = window.confirm('Are you sure you want to delete the chat for all participants?')

    if (userCertain) {
      chatroom1.set({
        0: {
          userID: "Chattr Bot",
          userMessage: "Start chat below"
        }
      });
    } else {
      return
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
        <div className='firstPage'>
          
          <h1>ChatCubed<span class='cubed'>3</span></h1>
          
          <MessageInput userInput={this.state.userInput} trackChanges={this.handleChange} submitStore={this.handleSubmit} />        
          <div className='messagesBox'>
            <ul>
              {this.state.messageList.map((messageObject) => {
                return (
                  <TotalMessages userID={messageObject.userID} userMessage={messageObject.userMessage} hidden={this.state.hideClassName}/>
                )
              }
              )}
            </ul>
            
          </div>
          <button className="clear" onClick={this.changeHideState}>Hide / UnHide chat </button>
          <button className="clear" onClick={this.removeChat}>Remove Chat Permanently for everyone </button>

        </div>
        
        
        
        
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
