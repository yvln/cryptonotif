const currentPrice = (dataCoinApi, alerts, database) => {
  return alerts.forEach(alert => {
    if (
      dataCoinApi.symbol_id === `COINBASE_SPOT_${alert.asset}_${alert.currency}`
    ) {
      database.ref("/current").set({
        [alert.asset]: `${dataCoinApi.price}${alert.currency}`
      });
    }
  });
};

module.exports = currentPrice;
