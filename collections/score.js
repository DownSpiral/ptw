Score = (function () {
  // Score aggregate collections
  var ScoreAllTime  = new Mongo.Collection("score_all_time");
  var ScoreYear     = new Mongo.Collection("score_year");
  var ScoreMonth    = new Mongo.Collection("score_month");
  var ScoreDay      = new Mongo.Collection("score_day");
  var ScoreHour     = new Mongo.Collection("score_hour");

  return {
    // Setters
    increment : function (user) {
      this.increment_by(user, 1);
    },

    increment_by : function (user, amount) {
      var insertTime = new Date();
      var modifier = { $inc : { score: amount } }

      ScoreAllTime.upsert({ user_id: user._id }, modifier);
      ScoreYear.upsert({ user_id: user._id, time: TimeStamp.to_year(insertTime) }, modifier);
      ScoreMonth.upsert({ user_id: user._id, time: TimeStamp.to_month(insertTime) }, modifier);
      ScoreDay.upsert({ user_id: user._id, time: TimeStamp.to_day(insertTime) }, modifier);
      ScoreHour.upsert({ user_id: user._id, time: TimeStamp.to_hour(insertTime) }, modifier);
    },

    // Getters
    all_time : function(user) {
      return (ScoreAllTime.findOne({ user_id: user._id }) || { score: 0 }).score;
    },
    year : function(user, ts) {
      var time_key = TimeStamp.to_year(ts || (new Date()))
      return (ScoreYear.findOne({ user_id: user._id, time: time_key }) || { score: 0 }).score;
    },
    month : function(user, ts) {
      var time_key = TimeStamp.to_month(ts || (new Date()))
      return (ScoreAllTime.findOne({ user_id: user._id, time: time_key }) || { score: 0 }).score;
    },
    day : function(user, ts) {
      var time_key = TimeStamp.to_day(ts || (new Date()))
      return (ScoreAllTime.findOne({ user_id: user._id, time: time_key }) || { score: 0 }).score;
    },
    hour : function(user, ts) {
      var time_key = TimeStamp.to_hour(ts || (new Date()))
      return (ScoreAllTime.findOne({ user_id: user._id, time: time_key }) || { score: 0 }).score;
    },

    // Statistics
    top : function(length, basis) {
      switch (basis) {
        default:
          top_scores = ScoreAllTime.find({}, { sort: ["score", "desc"], limit: length }).fetch();
      }

      var top_user_ids = _.map(top_scores, function(s) { return s.user_id; })
      var top_users = _.indexBy(Meteor.users.find({ _id: { $in: top_user_ids } }).fetch(), "_id");
      var all_time_scores = _.indexBy(ScoreAllTime.find({ user_id: { $in: top_user_ids} }).fetch(), "user_id");
      var year_scores = _.indexBy(ScoreYear.find({ user_id: { $in: top_user_ids} }).fetch(), "user_id");
      var month_scores = _.indexBy(ScoreMonth.find({ user_id: { $in: top_user_ids} }).fetch(), "user_id");
      var day_scores = _.indexBy(ScoreDay.find({ user_id: { $in: top_user_ids} }).fetch(), "user_id");
      var hour_scores = _.indexBy(ScoreHour.find({ user_id: { $in: top_user_ids} }).fetch(), "user_id");

      return _.map(top_scores, function(s) { return {
          username: top_users[s.user_id].username,
          score_all_time: all_time_scores[s.user_id].score,
          score_year: year_scores[s.user_id].score,
          score_month: month_scores[s.user_id].score,
          score_day: day_scores[s.user_id].score,
          score_hour: hour_scores[s.user_id].score,
        };
      })
    },
  };
})();



Meteor.methods({
  increment_score: function(user) { return Score.increment(user); },
  increment_score_by: function(user, amount) { return Score.increment_by(user, amount); },
});
