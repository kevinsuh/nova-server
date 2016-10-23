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

		// `this.props.passport` holds client's `pubilc_key`
		// and `country`. We use that on backend to
		// validate and handle data compilation
		let formData = {};
		this.props.passportForm.fields.map((passportField) => {
			const { input } = passportField;
			formData[input] = this.refs[input].value;
		});
		formData = {
			...formData,
			...this.props.passport
		}

		// note: further update would make sure data is valid (ex. email address format)
		this.props.submitPassport(formData);
	}

	// `data` holds the info we need to generically
	// generate form fields
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

		const formFields = this.props.passportForm.fields.map(this.renderFormField);

		return (
			<form onSubmit={this.handleSubmit} id="passport-form" className="form">
				{formFields}
				<div className="form-group" style={{textAlign: "center"}}>
					<input className="btn btn-primary" type="submit" />
				</div>
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