
// These collections are simple, but I wanted to keep them separate to make the case a bit less trivial
var Visitors = new Meteor.Collection('visitors');
var Positions = new Meteor.Collection('positions');

if (Meteor.isServer) {
  Meteor.startup(function () {
    // Clear the database before starting
    //Visitors.remove({});
    //Positions.remove({});
  });
}

if (Meteor.isClient) {
  var me = null;

  Template.visitors.isVisitor = function ( client ) {
    return client._id == me;
  };

  when(Positions.insert({ x: 100, y: 100 }))
    .then(function ( positionId ) {
      when(Visitors.insert({ position: positionId }))
        .then(function( visitorId ) {
          me = visitorId;
        });
    });

  when(Visitors.find({}))
    .then(function( allVisitorCursors ) {
      var allVisitors = allVisitorCursors.fetch();
      console.log( allVisitors );
      when(Positions.find({}))
        .then(function ( allPositionCursors ) {
          var allPositions = allPositionCursors.fetch();
          _.map( allVisitors, function( visitor, index ) {
            var visitorPosition = _.find( allPositions, function( position ) {
              return position._id == visitor.position;
            });
            visitor.position = visitorPosition;
          });
          Template.visitors.visitors = allVisitors;
        });
    });

  Template.visitors.events({
    'mousemove .playfield': function ( e ) {
      var newPosition = { x: e.x, y: e.y };
      when(Visitors.find({ _id: me }))
        .then(function ( visitorCursor ) {
          var visitor = visitorCursor.fetch()[0];
          Positions.update({ _id: visitor.position }, { $set: newPosition });
        });
    }
  });
}
