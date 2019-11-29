import React, { Component } from "react";
import MessageInput from '../formComponents/MessageInput';
import TotalMessages from '../formComponents/TotalMessages';

class PageOne extends Component {

    render() {
        return (
            <div className='page2'>
                <h1>Chattr<span className='cubed'>3</span></h1>

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
                        <div className='lastMessage'>..</div>

                    </div>
                </div>
                <button className="clear" onClick={this.props.changeHideState}>Hide / UnHide chat </button>
                <button className="clear" onClick={this.props.removeChat}>Remove Chat Permanently for everyone </button>
            </div>
        )
    }
}

export default PageOne;
