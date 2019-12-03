import React, { Component } from "react";
import MessageInput from '../formComponents/MessageInput';
import TotalMessages from '../formComponents/TotalMessages';

class PublicChat extends Component {

    render() {
        return (
            <div className='page2'>
                <div className='page2Side'>
                    <div className='page2SideTop'>
                        <h3><a href='index.html'>Chattr</a><a href={'https://tomstuart123.github.io/chat-test/'}><span className='accent2'>-3</span></a></h3> 
                        
                    </div>
                    <div className='page2SideBottom'>
                    <p>Past Channels </p>
                    {this.props.pastRoomNames.map((room) => {

                        return (
                            <a className='pastRooms' id={room} onClick={this.props.switchRoom}>{`- ${room}`}</a>
                        )
                    })
                    }
                    </div>
                </div>
                <div className='page2Main'>
                <nav>
                    <section className='wrapper '>
                        <div>
                            <h3 className='navAlt'>  Chattr Room: {this.props.statusChat}

                            </h3>
                            <li onClick={this.props.goBackToStart}>{this.props.userName} sign out </li>
                        </div>
                    </section>
                </nav>
                <section className='wrapper'>
                
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
