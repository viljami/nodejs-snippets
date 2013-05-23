$(function() {
	$('#clearDatabaseButton').mouseout(function() {
		clearDatabase();
	});

	var me = new Visitor();
	var visitors = [ me ];

	$('body').mousemove(function ( e ) {
		if( me.isReady()) {
			me.move({ x: e.clientX, y: e.clientY });
		}
	});

	setInterval(function () {
		if( me.isReady() ) {
			dpd.visitors.get({}, function ( allVisitors ) {
				allVisitors.forEach( function ( visitor, index ) {
					var found = false;
					for(var i = 0; i < visitors.length; i++){
						if(visitors[i].getId() == visitor.id ) {
							visitors[i].update();
							found = true;
							break;
						}
					}
					if(!found) {
						visitors.push(  new Visitor( visitor ));
						visitors[ visitors.length - 1 ].update();
					}
				});
			});
		}
	}, 100 );
});

function Visitor( visitor ) {
	var me = visitor,
		className = 'visitor',
		element = document.createElement('div');

	if( !visitor ) {
		dpd.positions.post({ x: 25, y: 25 }, function ( position ) {
			dpd.visitors.post({ position: position.id }, function ( visitor ) {
				me = visitor;
				element.id = me.id;
			});
		});
		className = 'me';
	}

	element.id = me ? me.id : '';
	element.className = className;
	$('body').append( element );

	this.update = function() {
		dpd.positions.get( me.position, function ( position ) {
			$('#' + me.id ).css({ left: ( position.x - 25 ) + 'px', top: ( position.y - 25 )+ 'px'});
		});
	};

	this.move = function ( pos ) {
		dpd.positions.put( me.position, pos);
	};

	this.getId = function () {
		return me.id;
	};

	this.isReady = function () {
		return !!me;
	};
}

function clearDatabase () {
	clearCollection( 'visitors' );
	clearCollection( 'positions', function () {
		// Should make others reaload too =)
		// Some times too fast for the deletion operation to load
		location.reload();
	});
}

function clearCollection ( name, callback ) {
	dpd[ name ].get({}, function ( all ) {
			all.forEach(function( a, i ){
				dpd.visitors.del( a );
			});
			if( callback ) callback();
		});
}

