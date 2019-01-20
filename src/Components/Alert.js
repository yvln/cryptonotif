import React, { Component } from "react";

import { getDatabase } from "../firebase";
import Form from "./Form";
import "./Alert.scss";

class Alert extends Component {
  state = {
    current: undefined,
    isEditing: false
  };

  componentDidMount() {
    getDatabase()
      .ref(`/current`)
      .on("value", snapshot => {
        this.setState({
          current: snapshot.val()[this.props.data.asset]
        });
      });
  }

  closeForm = () => {
    this.setState({
      isEditing: false
    });
  };

  closeAlert = () => {
    getDatabase()
      .ref(`/alert/${this.props.data.key}`)
      .remove();
  };

  editAlert = () => {
    this.setState({
      isEditing: true
    });
  };

  render() {
    const { data } = this.props;

    if (!data) {
      return "Loading...";
    }

    return (
      <div className="Alert">
        {this.state.isEditing ? (
          <div className={this.state.isEditing && "AlertForm"}>
            <button onClick={this.closeForm}>Cancel</button>
            <Form
              initialValues={{
                data
              }}
              closeForm={this.closeForm}
            />
          </div>
        ) : (
          <div className={!this.state.isEditing && "AlertText"}>
            <div className="buttons">
              <button onClick={this.editAlert}>
                <span role="img" aria-label="edit">
                  🖊️
                </span>
              </button>
              <button onClick={this.closeAlert}>
                <span role="img" aria-label="close">
                  ❌
                </span>
              </button>
            </div>
            <div>
              When {data.asset} is {data.action} {data.amount}
              {data.currency} to: {data.email}
              {this.state.current && <div>CURRENT: {this.state.current}</div>}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Alert;
