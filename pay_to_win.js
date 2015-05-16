if (Meteor.isClient) {
  //score starts at 0
  Session.setDefault('score', 0);

  Template.button_tmpl.helpers({
    score: function () {
      var user = Meteor.user();
      if (user == null) {
        return Session.get('score');
      } else {
        return Score.all_time(user);
      }
    }
  });

  Template.button_tmpl.events({
    // increment the counter when button is clicked
    'click .button': function () {
      var user = Meteor.user();
      if (user == null) {
        Session.set('score', Session.get('score') + 1);
      } else {
        Meteor.call('increment_score', user);
      }
    }
  });

  Template.leaderboard.helpers({
    player: function(){
      return Score.top(25, null);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Accounts.onCreateUser(function(options, user) {
    return user;
  });
}
