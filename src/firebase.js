/* eslint-disable */

const firebase = require('firebase');
require('dotenv').config();

const config = {
  apiKey: process.env.API_KEY,
  authDomain: 'cryptonotif-56a23.firebaseapp.com',
  databaseURL: 'https://cryptonotif-56a23.firebaseio.com',
  projectId: 'cryptonotif-56a23',
  storageBucket: 'cryptonotif-56a23.appspot.com',
  messagingSenderId: '1008924569797',
};

export const initializeFirebase = () => {
  firebase.initializeApp(config);
  return true;
};

export const getDatabase = () => {
  return firebase.database();
};
