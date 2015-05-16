TimeStamp = (function () {
  return {
    to_year: function(ts) {
      new_ts = new Date(ts.getTime());
      new_ts.setUTCMonth(0,0);
      new_ts.setUTCHours(0,0,0,0);
      return new_ts;
    },

    to_month: function(ts) {
      new_ts = new Date(ts.getTime());
      new_ts.setUTCDate(0);
      new_ts.setUTCHours(0,0,0,0);
      return new_ts;
    },

    to_day: function(ts) {
      new_ts = new Date(ts.getTime());
      new_ts.setUTCHours(0,0,0,0);
      return new_ts;
    },

    to_hour: function(ts) {
      new_ts = new Date(ts.getTime());
      new_ts.setUTCMinutes(0,0,0);
      return new_ts;
    },
  };
})();
