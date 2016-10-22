import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initializePassport } from '../actions';
import PassportForm from './passport_form';

class App extends Component {

	constructor(props) {
		super(props);
		this.handleMessage = this.handleMessage.bind(this);
	}

	handleMessage(message) {
		const data = JSON.parse(message.data);
		this.props.initializePassport(data);
	}

	componentDidMount() {
		// this is what receives message from lender-server
		window.addEventListener("message", this.handleMessage);
	}

	render() {
		console.log(`\n ~~ passport data ~~ \n`);
		console.log(this.props.passport);
		return (
			<div className="app container">
				<h1 className="title">Nova Credit Passport</h1>
				<PassportForm />
			</div>
		);
	}
}

function mapStateToProps({ passport }) {
	return {
		passport
	}
}

export default connect(mapStateToProps, { initializePassport })(App);