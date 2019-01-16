import React, { Component } from "react";
import Autosuggest from "react-autosuggest";

import { getDatabase } from "../firebase";
import "./Form.css";

let suggestions;
const url = "https://rest.coinapi.io/v1/assets";
const apikey = "6F3ABC62-B928-4F74-8194-24EA076F89C8";

class Form extends Component {
  state = {
    suggestions: [],
    valueAction: "under",
    valueAmount: "",
    valueAsset: ""
  };

  componentDidMount() {
    if (this.props.initialValues) {
      this.setState({
        valueAction: this.props.initialValues.data.action,
        valueAmount: this.props.initialValues.data.amount,
        valueAsset: this.props.initialValues.data.asset
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

  addAlert = e => {
    const oldValues = this.props.initialValues.data;
    e.preventDefault();
    const db = getDatabase();

    const oldKey = `${oldValues.action}${oldValues.asset}${oldValues.amount}`;
    const key = `${this.state.valueAction}${this.state.valueAsset}${
      this.state.valueAmount
    }`;
    const data = {
      action: this.state.valueAction,
      asset: this.state.valueAsset,
      amount: this.state.valueAmount,
      key
    };

    if (this.props.initialValues) {
      db.ref(`/alert/${oldKey}`).remove();
      db.ref().update({
        [`/alert/${key}`]: data
      });
      return this.props.closeForm;
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

  onChangeAction = e => {
    this.setState({
      valueAction: e.target.value
    });
  };

  onChangeAmount = e => {
    this.setState({
      valueAmount: e.target.value
    });
  };

  onChangeAsset = (event, { newValue }) => {
    this.setState({
      valueAsset: newValue
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
    const { valueAction, valueAmount, valueAsset, suggestions } = this.state;

    const inputProps = {
      placeholder: "BTC, ETH, ...",
      value: valueAsset,
      onChange: this.onChangeAsset
    };

    return (
      <div
        className={`Form ${
          this.props.initialValues ? "Form-Edit" : "Form-Create"
        }`}
      >
        <div className="Content">
          Alert me when
          <form onSubmit={this.addAlert}>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={this.getSuggestionValue}
              renderSuggestion={this.renderSuggestion}
              inputProps={inputProps}
            />
            <select
              value={valueAction}
              onChange={this.onChangeAction}
              name="action"
              className="menu"
            >
              <option value="under">falls under</option>
              <option value="above">is above</option>
            </select>
            <input
              onChange={this.onChangeAmount}
              type="number"
              name="amount"
              value={valueAmount}
            />
            $
            <input type="submit" value="GO" />
          </form>
        </div>
      </div>
    );
  }
}

export default Form;
