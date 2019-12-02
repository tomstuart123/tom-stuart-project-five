import React, { Component } from "react";
import MessageInput from '../formComponents/MessageInput';
import TotalMessages from '../formComponents/TotalMessages';

class PublicChat extends Component {

    render() {
        return (
            <div className='page2'>
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

                <MessageInput userInput={this.props.userInput} trackChanges={this.props.handleChange} submitStore={this.props.handleSubmit} />
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
                <button className="clear" onClick={this.props.changeHideState}>Be Private - Hide & UnHide chat just for me</button>
                {/* <button className="clear" onClick={this.props.removeChat}>Remove Chat Permanently for everyone </button> */}
                </section>
            </div>
        )
    }
}

export default PublicChat;
