
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

  when(Positions.insert({ x: 100, y: 100 }))
    .then(function ( positionId ) {
      when(Visitors.insert({ position: positionId }))
        .then(function( visitorId ) {
          me = Visitors.find({ _id: visitorId}).fetch()[0];
          console.log(me);
        });
    });

  Template.visitors.events({
    'mousemove .playfield': function ( e ) {
      if(!me) return;
      var newPosition = { x: e.x, y: e.y };
      Positions.update({ _id: me.position }, { $set: newPosition });
    }
  });

  $(function () {
    var frags = Meteor.renderList( Positions.find({}), function( position ) {
      var className = position._id == me.position ? 'me' : 'visitor';
      return '<div class="' + className + '" style="left:' + position.x + 'px;top:' + position.y + 'px;"></div>';
    });
    document.body.appendChild(frags);
  });
}
