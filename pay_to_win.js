PlayersList = new Mongo.Collection('players');

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.button_tmpl.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.button_tmpl.events({
    'click .button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });

  Template.leaderboard.player = function(){
    return PlayersList.find();
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
