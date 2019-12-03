import React, { Component } from "react";
import TextInput from '../formComponents/TextInput';
import landingImage from '../assets/nigel-tadyanehondo-pXf4OH65OhE-unsplash.jpg';


class LandingPage extends Component {
    render() {
        return (
            <div className='landingPage'>
                 <div className='landingPageTop'>      
                    <nav>
                        <section className='wrapper '>
                            <div>
                                <li className='logo logo-landing'> <a href="index.html">Chattr</a><a href={'https://tomstuart123.github.io/chat-test/'}><span className='accent'>-3</span></a> </li>
                                <li onClick={this.props.scrollDown}>{this.props.signOrLogin}</li>
                            </div>
                        </section>
                    </nav>
                    <section className='wrapper '>
                    <h1> Virtual Chat for work, chill or play</h1>
                        <form className='publicRoomInputForm' onSubmit={this.props.publicJoin}>
                            <label for='name'></label>
                            <TextInput name='name' inputField='Add name to trial as guest' className='publicJoin' handleChange={this.props.handleChange}/>
                            <button type='submit' className='submitPublic'>Go to the Public Room</button>
                        </form>
                        <div className='scrollDownHolder'>
                            <button className='scrollDown' onClick={this.props.scrollDown}>Sign up to Pro below</button>
                        </div>
                    </section>
                </div>
                <div className='landingPageBottom'> 
                    <section className='wrapper '>
                        <h2> {this.props.signOrLogin} to create and join your own private channels</h2> 
                        <form className='signInForm' onSubmit={this.props.signUpOrLogin}>
                            <label class='visuallyHidden' for='name'></label>
                            <p name='name'>Add a UserName</p>
                            <TextInput inputField='Name' className='signInName' handleChange={this.props.handleChange}/>
                            <label class='visuallyHidden' for='password'></label>
                            <p>Add a Random Key</p>
                            <TextInput name='password' inputField='Your Memorable key' className='signInRandomKey'  handleChange={this.props.handleChange}/>
                            <button type='submit' className={this.props.signOrLogin}>{this.props.signOrLogin}</button>
                        
                        </form>
                        <button className='switchSign'onClick={this.props.switchSign}>Already done this? Switch to Login page</button>
                        <div className='imageContainer'>
                            <img src={landingImage} alt='sign saying how the user will sign up eventually'></img>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}

export default LandingPage;