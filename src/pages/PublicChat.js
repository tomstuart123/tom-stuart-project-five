import React, { Component } from "react";
import MessageInput from '../formComponents/MessageInput';
import TotalMessages from '../formComponents/TotalMessages';

class PublicChat extends Component {

    render() {
        return (
            <div className='page2'>
                <div className='page2Side'>
                    <div className='page2SideTop'>
                    <h3>Your Existing Chatrooms</h3>
                    </div>
                    <div className='page2SideBottom'>
                    {this.props.pastRoomNames.map((room) => {

                        return (
                            <a className='pastRooms'>{`- ${room}`}</a>
                        )
                    })
                    }
                    </div>
                </div>
                <div className='page2Main'>
                <nav>
                    <section className='wrapper '>
                        <div>
                            <li className='logo logo-landing'> <a href="index.html">Chattr<span className='accent'>-3</span></a> </li>
                            <li onClick={this.props.goBackToStart}>{this.props.userName} sign out </li>
                        </div>
                    </section>
                </nav>
                <section className='wrapper'>
                <h2>Channel: {this.props.statusChat}</h2>
                <div className='messagesBox'>
                    <div>
                        {this.props.messageList.map((messageObject) => {
                            return (
                        <TotalMessages userID={messageObject.userID} userMessage={messageObject.userMessage} hidden={this.props.hideClassName} sendDate={messageObject.currentTime} cancelMessage={this.props.removeMessage} firebaseKey={messageObject.userFirebaseKey} />
                            )
                        }
                        )}
                        {/* empty div so we can scroll to the newest message on message send */}
                        <div className='lastMessage'></div>

                    </div>
                </div>
                <MessageInput userInput={this.props.userInput} trackChanges={this.props.handleChange} submitStore={this.props.handleSubmit} />
                {/* <button className="clear" onClick={this.props.changeHideState}>Be Private - Hide & UnHide chat just for me</button> */}
                <button className="clear" onClick={this.props.removeChat}>Remove Chat Permanently for everyone </button>
                <p class='tipText'>Tip - Each chat session you get a unique ID next to your Username </p>
                </section>
                </div>
            </div>
        )
    }
}

export default PublicChat;
