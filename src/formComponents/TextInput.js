import React, { Component } from "react";

class TextInput extends Component {
    render() {
        return (
            <div className='signInForm'>
                    <label htmlFor={this.props.className}> {this.props.inputField}---> </label>
                    <input id={this.props.className} type='text' placeholder={this.props.inputField} className={this.props.className} onChange={this.props.handleChange} />
            </div>
            )
    }
}

export default TextInput;


