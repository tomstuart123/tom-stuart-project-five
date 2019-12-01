import React, { Component } from "react";
import TextInput from '../formComponents/TextInput';

class LandingPage extends Component {
    render() {
        return (
            <div className='landingPage'>
                 <div className='landingPageTop'>      <nav>
                    <section class='wrapper '>
                        <div>
                            <li class='logo logo-landing'> <a href="index.html">Chattr3</a> </li>
                            <li>{this.props.signOrLogin}</li>
                        </div>
                    </section>
                </nav>
                <h1>Your Virtual Chat for work, chill or play</h1>
                    <form className='publicRoomInputForm' onSubmit={this.props.publicJoin}>
                        <TextInput inputField='Name' className='publicJoin' handleChange={this.props.handleChange}/>
                        <button type='submit' className='submitPublic'>Go Public</button>
                    </form>
                    <div className='scrollDownHolder'>
                        <button className='scrollDown' onClick={this.props.scrollDown}>Or sign up to Chattr Pro</button>
                    </div>
                    
            </div>
                <div className='landingPageBottom'> 
                    <h2>or {this.props.signOrLogin} to create your own channels</h2> 
                    <form className='signInForm' onSubmit={this.props.signUpOrLogin}>
                        <p>Your Name</p>
                        <TextInput inputField='Name' className='signInName' handleChange={this.props.handleChange}/>
                        <p>Your Random Key</p>
                        <TextInput inputField='Random key' className='signInRandomKey'  handleChange={this.props.handleChange}/>
                        <button type='submit' className={this.props.signOrLogin}>{this.props.signOrLogin}</button>
                    <button onClick={this.props.switchSign}>already have an account</button>
                    </form>
                    
                </div>
            </div>
        )
    }
}

export default LandingPage;