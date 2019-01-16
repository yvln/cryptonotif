const handleAlert = require("./handleAlerts");

const currentPrice = require("./currentPrice"); // require packages and set up variables


const express = require("express"),
      app = express(),
      WebSocket = require("ws");

const firebase = require("firebase");

const port = 4001;
const config = {
  apiKey: "AIzaSyD_o-5KGf3rqYrgsf1efAzM6LGAb_XMIhw",
  authDomain: "cryptonotif-56a23.firebaseapp.com",
  databaseURL: "https://cryptonotif-56a23.firebaseio.com",
  projectId: "cryptonotif-56a23",
  storageBucket: "cryptonotif-56a23.appspot.com",
  messagingSenderId: "1008924569797"
}; // listen on port and run server

app.listen(port, () => console.log("SERVER LISTENING ON:", port));
const ws = new WebSocket("wss://ws.coinapi.io/v1/");
firebase.initializeApp(config);
ws.on("open", function open() {
  const hello = {
    type: "hello",
    apikey: "A40EDBE6-5D25-49FD-AA74-E0435AA1A143",
    heartbeat: false,
    subscribe_data_type: ["trade"],
    subscribe_filter_symbol_id: ["COINBASE_"]
  };
  ws.send(JSON.stringify(hello));
});
ws.on("message", function incoming(data) {
  const database = firebase.database();
  return database.ref("/alert").on("value", snapshot => {
    const values = snapshot.val();
    const mapData = Object.keys(values).map(value => values[value]);

    if (!values) {
      return;
    }

    handleAlert(JSON.parse(data), mapData, database);
    return currentPrice(JSON.parse(data), mapData, database);
  });
});