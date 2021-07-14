import React, { Component } from 'react';

export default class Loader extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <Loader
                visible={true}
                // visible={true}
                type="Oval"
                color="#ff9900"
                height={200}
                width={200}
            // timeout={3000} //3 secs
            />
        )
    }
}