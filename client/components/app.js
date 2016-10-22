import React, { Component } from 'react';
import { connect } from 'react-redux';
import { initializePassport } from '../actions';

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
		console.log(this.props.passport);
		const { country } = this.props.passport.data;

		return (
			<div className="app container">
				Nova Credit Passport
				Welcome to the passport for {country}
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