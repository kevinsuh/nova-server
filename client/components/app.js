import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initializePassport } from '../actions';
import PassportForm from './passport_form';

class App extends Component {

	constructor(props) {
		super(props);
		this.handleMessage = this.handleMessage.bind(this);
	}

	// initialize nova app on message receive
	handleMessage(message) {
		const data = JSON.parse(message.data);
		this.props.initializePassport(data);
	}

	// look for message from lender server
	componentDidMount() {
		window.addEventListener("message", this.handleMessage);
	}

	// send message back to lender on successful form submit
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

		// don't load react app until
		// we have received lender message with public_key
		if (!this.props.passport.public_key) {
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