if (Meteor.isClient) {
  //score starts at 0
  Session.setDefault('score', 0);

  Template.button_tmpl.helpers({
    score: function () {
      var user = Meteor.user();
      return user === null ? Session.get('score') : user.profile.score;
    }
  });

  Template.button_tmpl.events({
    // increment the counter when button is clicked
    'click .button': function () {
      var user = Meteor.user();
      if (user === null) {
        Session.set('score', Session.get('score') + 1);
      } else {
        Meteor.users.update({
          _id: Meteor.userId()
        }, {
          $set: {'profile.score': user.profile.score + 1 }
        });
      }
    }
  });

  Template.leaderboard.player = function(){
    return Meteor.users.find({}, {
      sort: {'profile.score': -1, name: 1}
    });
  }

  Accounts.ui.config({
    passwordSignupFields: 'USERNAME_AND_EMAIL'
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Accounts.onCreateUser(function(options, user) {
    user.profile = {};
    user.profile.score = 0;
    return user;
  });
}
