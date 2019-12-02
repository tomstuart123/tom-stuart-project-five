import React, { Component } from "react";

class MessageInput extends Component {
    
    render() {
        return (
            <div className="messageInput">
                <form onSubmit={this.props.submitStore} className='messageInputForm'>
                    <label htmlFor='userMessage'></label>
                    <input autocomplete="off"
                    id='userMessage' type='text' placeholder='Your Message' value={this.props.userInput} className='userMessage' onChange={this.props.trackChanges} />
                    {/* potentially remove onChange below as its above */}
                    <button onChange={this.props.trackChanges} type='submit'>Go</button>

                </form>
            </div>
        )
    }
}

export default MessageInput;

