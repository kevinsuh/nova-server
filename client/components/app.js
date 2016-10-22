import React, { Component } from 'react';

export default class App extends Component {

	constructor(props) {
		super(props);
	}
	handleMessage(message) {
		console.log(`\n\n message handled! message from nova server...`);
		console.log(message);
		console.log(message.data);
	}

	componentDidMount() {
		console.log(`\n component mounted!`);
		window.addEventListener("message", this.handleMessage);

	}

	render() {

		return (
			<div className="app container">
				hello world from react
			</div>
		);
	}
}