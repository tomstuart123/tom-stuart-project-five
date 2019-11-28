import React, { Component } from "react";

class TotalMessages extends Component {

    render() {
        return (
            <div className="totalMessages" id={this.props.hidden}>
                  <li>
                    <span className='messageID'>{this.props.userID}</span>
                    --->
                    <span className='messageText'>{this.props.userMessage}</span>
                </li>
            </div>
        )
    }
}

export default TotalMessages;

