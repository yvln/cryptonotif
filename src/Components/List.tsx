import React, { Component } from "react";

import { getDatabase } from "../firebase";
import Alert from "./Alert";
import "./List.scss";

type Data = {
  action: string;
  amount: string;
  asset: string;
  currency: string;
  email: string;
  key: string;
}

type ListState = {
  alerts: Data[];
}

class List extends Component<void, ListState> {
  state = {
    alerts: []
  };

  componentDidMount() {
    getDatabase()
      .ref("/alert")
      .on("value", snapshot => {
        if (!snapshot) {
          return;
        }

        const values = snapshot.val();

        if (!values) {
          return;
        }

        return this.setState({
          alerts: Object.values(values)
        });
      });
  }

  renderAlert = (alert: Data, i: number) => <Alert id={i} key={alert.key} data={alert} />;

  renderAlertsList = () => {
    return this.state.alerts.map(this.renderAlert);
  };

  render() {
    return <div className="List">{this.renderAlertsList()}</div>;
  }
}

export default List;
