import React, { Component } from "react";

import { getDatabase } from "../firebase";
import Alert from "./Alert";
import "./List.scss";

class List extends Component {
  state = {
    alerts: []
  };

  componentDidMount() {
    getDatabase()
      .ref("/alert")
      .on("value", snapshot => {
        const values = snapshot.val();

        if (!values) {
          return;
        }

        return this.setState({
          alerts: Object.keys(values).map(value => values[value])
        });
      });
  }

  renderAlert = (alert, i) => <Alert id={i} key={alert.key} data={alert} />;

  renderAlertsList = () => {
    return this.state.alerts.map(this.renderAlert);
  };

  render() {
    return <div className="List">{this.renderAlertsList()}</div>;
  }
}

export default List;
