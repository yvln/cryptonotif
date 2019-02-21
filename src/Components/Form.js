import React, { Component } from "react";
import Autosuggest from "react-autosuggest";

import { getDatabase } from "../firebase";
import "./Form.scss";

let suggestions;
const url = "https://rest.coinapi.io/v1/assets";
const apikey = "6F3ABC62-B928-4F74-8194-24EA076F89C8";

class Form extends Component {
  state = {
    email: "",
    error: undefined,
    suggestions: [],
    action: "under",
    amount: "",
    asset: "",
    currency: "USD"
  };

  componentDidMount() {
    if (this.props.initialValues) {
      const {
        action,
        amount,
        asset,
        currency,
        email
      } = this.props.initialValues.data;

      this.setState({
        action,
        amount,
        asset,
        currency,
        email
      });
    }

    fetch(url, {
      headers: {
        "X-CoinAPI-Key": apikey
      }
    })
      .then(res =>
        res.json().then(response => {
          suggestions = response
            .filter(asset => asset.type_is_crypto === 1)
            .map(asset => {
              return {
                label: asset.asset_id
              };
            });
        })
      )
      .catch(err => console.log(err));
  }

  addOrEditAlert = e => {
    e.preventDefault();
    const db = getDatabase();
    const { action, amount, asset, currency, email } = this.state;
    const key = `${action}${amount}${currency}${asset}${email
      .split(".")
      .join("")}`;
    const data = {
      action,
      asset,
      amount,
      currency,
      email,
      emailSent: false,
      key,
    };

    db.ref(`/alert/${key}`)
      .once("value")
      .then(snapshot => {
        if (snapshot.val()) {
          return this.setState({
            error: "This alert has already been created."
          });
        }
      });

    this.setState({
      error: undefined
    });

    if (this.props.initialValues) {
      return db.ref().update({ [`/alert/${key}`]: data });
    }

    return db.ref(`/alert/${key}`).set(data);
  };

  getSuggestions = value => {
    const inputValue = value.trim().toUpperCase();
    return !inputValue.length
      ? []
      : suggestions.filter(suggestion => suggestion.label.includes(inputValue));
  };

  getSuggestionValue = value => value.label;

  onChangeInput = (e, key) => {
    this.setState({
      [key]: e.target.value
    });
  };

  onChangeAsset = (e, { newValue }) => {
    this.setState({
      asset: newValue
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  renderSuggestion = suggestion => <div>{suggestion.label}</div>;

  render() {
    const { email, action, amount, asset, currency, suggestions } = this.state;
    const inputProps = {
      placeholder: "BTC, ETH, ...",
      value: asset,
      onChange: this.onChangeAsset
    };

    return (
      <form
        className={`Form ${
          this.props.initialValues ? "FormEdit" : "FormCreate"
        }`}
        onSubmit={this.addOrEditAlert}
      >
        {!this.props.initialValues && this.state.error && (
          <div className="error">{this.state.error}</div>
        )}

        <div>Alert me when</div>
        <Autosuggest
          suggestions={suggestions.splice(0, 9)}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
        />
        <select
          value={action}
          onChange={e => this.onChangeInput(e, "action")}
          name="action"
          className="menuAction"
        >
          <option value="under">falls under</option>
          <option value="above">is above</option>
        </select>
        <div>
          <input
            onChange={e => this.onChangeInput(e, "amount")}
            type="number"
            name="amount"
            value={amount}
          />

          <select
            value={currency}
            onChange={e => this.onChangeInput(e, "currency")}
            name="currency"
            className="menuCurrency"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div>
          <span>to </span>
          <input
            onChange={e => this.onChangeInput(e, "email")}
            placeholder="your email"
            name="email"
            disabled={this.props.initialValues}
            type="email"
            value={email}
          />
          {this.props.initialValues &&
            "To update the email address, please create another alert."}
        </div>
        <input className="Button" type="submit" value="GO" />
      </form>
    );
  }
}

export default Form;
