import React, { Component } from "react";

import { getDatabase } from "../firebase";
import Form from "./Form";
// import "./Alert.css";

class Alert extends Component {
  state = {
    isEditing: false
  };

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
    console.log(this.props.data);
    const { data } = this.props;

    if (!data) {
      return "Loading...";
    }

    return (
      <div className="Alert">
        {this.state.isEditing ? (
          <>
            <div onClick={this.closeForm}>Cancel</div>
            <Form
              initialValues={{
                data
              }}
              closeForm={this.closeForm}
            />
          </>
        ) : (
          <>
            <div onClick={this.closeAlert}>close</div>
            <div onClick={this.editAlert}>edit</div>
            {data.action} {data.amount} {data.asset}
          </>
        )}
      </div>
    );
  }
}

export default Alert;
