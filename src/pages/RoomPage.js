import React, { Component } from "react";
import TextInput from '../formComponents/TextInput';

class RoomPage extends Component {
    render() {
        return (
            <div>
                <h2>Your Signed in</h2>
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
                
                <button onClick={this.props.goBackToStart}>or Sign out</button>
            </div>
            
        )
    }
}

export default RoomPage;