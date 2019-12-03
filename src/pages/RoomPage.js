import React, { Component } from "react";
import TextInput from '../formComponents/TextInput';


class RoomPage extends Component {
    render() {
        return (
            <div className='roomPage'>
                <div className='roomPageTop'> 
                <nav>
                    <section className='wrapper '>
                        <div>
                            <li className='logo logo-landing'> <a href="index.html">Chattr<span className='accent'>-3</span></a> </li>
                            <li onClick={this.props.goBackToStart}>Sign Out of {this.props.userName}</li>
                        </div>
                    </section>
                </nav>
                <div>
                    <section className='wrapper'>
                        <h1>Hi {this.props.userName}! Welcome to your Chattr Lobby!</h1>
                        <h3 className='introText'>This is your private space to help you get started </h3>
                        <div className='roomPageForms'> 
                            <form className='createRoomInputForm' onSubmit={this.props.createRoom}>
                                <h3>Create a new chat room</h3>
                                <TextInput inputField='Name for the new room' className='createRoom' handleChange={this.props.handleChange} />
                                <button type='submit' className='submitRoom'>Create</button>
                            </form>
                            <form className='joinRoomInputForm' onSubmit={this.props.joinRoom}>
                                <h3>Join an existing chat room</h3>
                                <TextInput inputField='Existing room name' className='joinRoom' handleChange={this.props.handleChange} />
                                <button type='submit' className='submitJoin'>Join</button>
                            </form>
                        </div>
                            <button onClick={this.props.scrollDown} className='existingRoomButton'> Tip: Your last chatrooms were called:  
                            {this.props.pastRoomNames.map((room) => {
                                    
                                    return (
                                        <span className='pastRooms'>{`- ${room}`}</span>
                                    )
                                })
                            }
                            </button>
                    </section>
                </div> 
                </div>
                
            </div>
            
        )
    }
}

export default RoomPage;