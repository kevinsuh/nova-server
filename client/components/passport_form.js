import React, { Component } from 'react';
import { connect } from 'react-redux';

// country-specific form
class PassportForm extends Component {

	constructor(props) {
		super(props);
	}

	renderFormField(data, i) {

		const { label } = data;
		return (
			<div key={i}>{label}</div>
		)

	}

	render() {
		console.log(`\n ~~ passport-form fields ~~ \n`);
		console.log(this.props.passportForm);
		const formFields = this.props.passportForm.map(this.renderFormField);

		return (
			<form id="passport-form" className="form">
				{formFields}
			</form>
		);
	}
}

function mapStateToProps({ passportForm }) {
	return {
		passportForm
	}
}

export default connect(mapStateToProps)(PassportForm);