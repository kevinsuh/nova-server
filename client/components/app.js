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

	renderStatusMessage(response) {
		const { message, status } = response;
		const { origin } = this.props.passport;
		window.parent.postMessage(JSON.stringify({message, status}), origin);
	}

	render() {

		const { response } = this.props.passport;
		if (response.status) {
			this.renderStatusMessage(response);
		}

		return (
			<div className="app container">
				<h1 className="main-title">Nova Credit Passport</h1>
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