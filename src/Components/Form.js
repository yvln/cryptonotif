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

    const oldValues = this.props.initialValues && this.props.initialValues.data;
    const oldKey =
      oldValues && `${oldValues.action}${oldValues.amount}${oldValues.currency}${oldValues.asset}`;

    const db = getDatabase();
    const { action, amount, asset, currency, email } = this.state;
    const key = `${action}${amount}${currency}${asset}`;
    const data = {
      action,
      asset,
      amount,
      currency,
      email,
      emailSent: false,
      key
    };

    // if data change, key change, so I remove instead of editing the existing one.
    if (oldValues) {
      db.ref(`/alert/${oldKey}`).remove();
      this.props.closeForm();
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
            type="email"
            name="email"
            value={email}
          />
        </div>
        <input className="Button" type="submit" value="GO" />
      </form>
    );
  }
}

export default Form;
