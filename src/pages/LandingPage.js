import React, { Component } from "react";
import TextInput from '../formComponents/TextInput';

class LandingPage extends Component {
    render() {
        return (
            <div className='landingPage'>    
                <h1>Hi!! Welcome to Chattr<span className='cubed'>3</span></h1>
                <h3>Lets get started!</h3>
                <p>Join the public channel as a guest?</p>
                    <form className='publicRoomInputForm' onSubmit={this.props.publicJoin}>
                    <p>Your Name</p>
                    <TextInput inputField='Name' className='publicJoin' handleChange={this.props.handleChange}/>
                        <button type='submit' className='submitPublic'>Go Public</button>
                    </form>
                <p>or {this.props.signOrLogin} to create your own channels</p> 
                    <button onClick={this.props.switchSign}>already have an account</button>
                    <form className='signInForm' onSubmit={this.props.signUpOrLogin}>
                        <p>Your Name</p>
                        <TextInput inputField='Name' className='signInName' handleChange={this.props.handleChange}/>
                        <p>Your Random Key</p>
                        <TextInput inputField='Random key' className='signInRandomKey'  handleChange={this.props.handleChange}/>
                        <button type='submit' className={this.props.signOrLogin}>{this.props.signOrLogin}</button>
                    </form>
                    
                    
            </div>
        )
    }
}

export default LandingPage;