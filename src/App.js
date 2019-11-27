import React, { Component } from "react";
import './App.css';
import ThreeContainer from './three.js/ThreeContainer';
// combined three js with react by following this guide - https://blog.bitsrc.io/starting-with-react-16-and-three-js-in-5-minutes-3079b8829817

// split three.js into multiple files with guide - https://medium.com/javascript-in-plain-english/javascript-in-3d-an-introduction-to-three-js-780f1e4a2e6d

class App extends Component {
  constructor() {
    super();
    this.state = {
      clicked: false,
      buttonText: 'Add'
    } 
  
  }

  // or toggle with one button
  // runThree = () => {
  //     if (this.state.clicked) {
  //       this.setState({
  //         clicked: false
  //       })
  //     } else {
  //     this.setState({
  //       clicked: true
  //     })
  //   }
  // }
  // or toggle cleaner with one button
  runThree = () => {
    this.setState({
      clicked: !this.state.clicked,
      buttonText: 'Remove',
    });
  }

  }

  // runThree = () => {
  //   this.setState({
  //     clicked: true,
  //   })
  // }

  render() {
    return (
      <div className="App">
        <div className='site'> 
          <h1>VirtualCo: Chat</h1>
          <h3>Lets get chatting... click the button below</h3>
          <button onClick={this.runThree}>{this.state.buttonText} three.js</button>
          {/* <button onClick={this.cancelThree}>Cancel three.js</button> */}
        </div>
        {/* //We simply attach the Three.js renderer to the React Element utilizing a ref. */}
        
        {
          this.state.clicked 
              ? <ThreeContainer />
              : null
        }

        <div className='site'>
          <h3>contact us for more info</h3>
          
        </div>
      </div>

    )
  }
  }

export default App;
