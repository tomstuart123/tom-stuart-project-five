import React, { Component } from 'react';
import ThreeEntryPoint from './ThreeEntryPoint';

export default class ThreeContainer extends Component {
    constructor(){
        super();
        console.log('start')
    }
    componentDidMount() {
        ThreeEntryPoint(this.scene);
        console.log('mount')

    }

    componentWillUnmount() {
        console.log('unmount')

    }
    render() {
        return (
            <>
                <div ref={element => this.scene = element} />
            </>
        );
    }
}