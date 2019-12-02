import React, { Component } from "react";

class TotalMessages extends Component {

    render() {
        return (
            <div className="totalMessages" id={this.props.hidden}>
                <div>
                    <p><span className='date'>{this.props.sendDate}</span></p>
                    <p>
                    <span className='messageID'>{this.props.userID}</span>
                    :
                    <span className='messageText'>{this.props.userMessage}</span>
                    <span className='deleteYou' id={this.props.firebaseKey} onClick={this.props.cancelMessage}><span className={this.props.userID} id={this.props.firebaseKey}>x</span></span>
                    </p>
                </div>
                
            </div>
        )
    }
}

export default TotalMessages;

