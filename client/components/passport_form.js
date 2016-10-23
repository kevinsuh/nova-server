import React, { Component } from 'react';
import { connect } from 'react-redux';
import { submitPassport } from '../actions';

// country-specific form
class PassportForm extends Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);

	}

	handleSubmit(e) {
		e.preventDefault();

		let formData = {};
		this.props.passportForm.map((passportField) => {
			const { input } = passportField;
			formData[input] = this.refs[input].value;
		});
		formData = {
			...formData,
			...this.props.passport
		}

		this.props.submitPassport(formData);

	}

	renderFormField(data, i) {

		const { label, type, input } = data;

		return (
			<div key={i} className="form-group">
				<label className="label form-label" htmlFor={input}>{label}</label>
				<input className="input form-control" type={type} ref={input} id={input} name={input} />
			</div>
		);

	}

	render() {
		console.log(`\n ~~ passport-form fields ~~ \n`);
		console.log(this.props.passportForm);
		const formFields = this.props.passportForm.map(this.renderFormField);

		return (
			<form onSubmit={this.handleSubmit} id="passport-form" className="form">
				{formFields}
				<input type="submit" />
			</form>
		);
	}
}

function mapStateToProps({ passportForm, passport }) {
	return {
		passport,
		passportForm
	}
}

export default connect(mapStateToProps, { submitPassport })(PassportForm);