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
		// look for message from lender-server
		window.addEventListener("message", this.handleMessage);
	}

	// upon successful form submission
	renderStatusMessage(response) {
		const { message, status } = response;
		const { origin } = this.props.passport;
		window.parent.postMessage(JSON.stringify({message, status}), origin);
	}

	render() {

		const { response } = this.props.passportForm;
		if (response.status) {
			this.renderStatusMessage(response);
		}

		if (!this.props.passport.public_key) {
			// wait until key has been identified on our server
			return (<div></div>);
		}

		return (
			<div className="app container">
				<h1 className="main-title">Nova Credit Passport</h1>
				<PassportForm />
			</div>
		);
	}
}

function mapStateToProps({ passport, passportForm }) {
	return {
		passport,
		passportForm
	}
}

export default connect(mapStateToProps, { initializePassport })(App);