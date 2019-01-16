var nodemailer = require("nodemailer");

require("dotenv").config();

const renderSubject = alert => {
  return `🚀 Hurry up! The ${alert.asset} is ${alert.action} ${alert.amount}${
    alert.currency
  }!`;
};

const renderHTML = (alert, dataCoinApi) => {
  return (
    "<div><h2>Hey!</h2><br/><h3>This is an alert from Crypto " +
    'Notif.</h3><div>You suscribed to : "Send me an email ' +
    `when ${alert.asset} ${
      alert.action === "under" ? "falls under" : "is above"
    } ${alert.currency === "USD" ? "$" : ""}${alert.amount}${
      alert.currency === "EUR" ? "€" : ""
    }."</div><br/><br/><div>Report:<br/></div>` +
    `time_exchange: ${dataCoinApi.time_exchange},<br/>` +
    `time_coinapi: ${dataCoinApi.time_coinapi},<br/>` +
    `uuid: ${dataCoinApi.uuid},<br/>` +
    `price: ${dataCoinApi.price},<br/>` +
    `size: ${dataCoinApi.size},<br/>` +
    `taker_side: ${dataCoinApi.taker_side},<br/>` +
    `symbol_id: ${dataCoinApi.symbol_id},<br/>` +
    `sequence: ${dataCoinApi.sequence},<br/>` +
    `type: ${dataCoinApi.type}</div></div>`
  );
};

const handleAlert = (dataCoinApi, alerts, database) => {
  return alerts.forEach(alert => {
    if (
      dataCoinApi.symbol_id ===
        `COINBASE_SPOT_${alert.asset}_${alert.currency}` &&
      ((alert.action === "above" && dataCoinApi.price >= alert.amount) ||
        (alert.action === "under" && dataCoinApi.price <= alert.amount)) &&
      !alert.emailSent
    ) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_PASSWORD
        }
      });
      const mailOptions = {
        from: process.env.USER_EMAIL,
        to: alert.email,
        subject: renderSubject(alert),
        html: renderHTML(alert, dataCoinApi)
      };
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
          return database.ref(`/alert/${alert.key}`).update({
            emailSent: true
          });
        }
      });
    }
  });
};

module.exports = handleAlert;
