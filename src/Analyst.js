const Coordinate = require('./Coordinate');
const FloorPlan = require ('./FloorPlan');
const Room = require('./Room');

module.exports = class Analyst {

	constructor( plan ) {
		this.plan = plan;

		this.lastRoomStart = new Coordinate( 0, 0 );
	}

	static Colorize = (source, filename, useMinColors, showDebug) => {
		// initialize from source
		let plan = new FloorPlan( source );
		plan.ParseSourceAndInitializeInternals( );

		// display input
		console.log(`\nSource (${filename}):`);
		plan.DumpSource( );

		if( !plan.initialized ) return;

		const analyst = new Analyst( plan );
		analyst.DoRoomAnalysis();

		if( useMinColors ) {
			analyst.DoEdgeAnalysis();
			analyst.DoMinimizedColorAnalysis();
		} else {
			analyst.DoRegularColorAnalysis();
		}

		// dump internal structure for debugging
		if( showDebug ) analyst.plan.DumpInternal();

		console.log("\nOutput:");
		plan.RenderOutput();
	}

	DoRoomAnalysis() {
		// apply room numbers
		let nextRoomNumber = 0;
		let startOfRoom = this.FindStartOfNextRoom();
		while( !startOfRoom.IsNull() ) {
			this.ApplyNumberToRoom( nextRoomNumber++, startOfRoom );
			startOfRoom = this.FindStartOfNextRoom();
		}
	}

	DoEdgeAnalysis() {
		this.plan.rooms.forEach( room => {
			// the room start is the upper left tile of the room
			// start checking neighbours on the north wall, moving clockwise until you reach the corner NW of the start
			const edge = room.start.North();
			const corner = edge.West();
			this.CheckBothSidesOfWall( edge, corner, corner, room );
		});
	}

	DoMinimizedColorAnalysis() {
		this.plan.rooms.forEach( thisRoom => {
			let excludedColors = [];

			for (let key of thisRoom.neighbours.keys()) {
				const neighbour = this.plan.rooms[ key ];
				if( neighbour.color != Room.NOCOLOR ) excludedColors.push( neighbour.color );
			}

			let color = 0;
			while( excludedColors.includes( color ) ) {
				color++;
			}
			thisRoom.color = color;
		});
	}

	DoRegularColorAnalysis() {
		this.plan.rooms.forEach( thisRoom => {
			thisRoom.color = thisRoom.roomNumber;
		});
	}

	TestSide( side, valueOfSide, wall, previous, last, room ) {
		// if we are out of bounds, we are done
		if( valueOfSide == FloorPlan.OUTOFBOUNDS ) return;

		// what is the room number (if any) on this side of the wall?
		if( valueOfSide == FloorPlan.WALL || valueOfSide == FloorPlan.DOOR ) {
			// it's a wall so follow it to {last} and don't come back {here}
			if( !Coordinate.Equal( previous, side ) ) this.CheckBothSidesOfWall( side, wall, last, room );
		} else if( valueOfSide !== room.roomNumber ) {
			room.AddNeighbour( valueOfSide );
		}
	}

	CheckBothSidesOfWall( here, previous, last, room ) {
		// edge is always the coordinate of a border (i.e. a wall or door)

		if( Coordinate.Equal( here, last ) ) return; // we have gone all the way around the room

		const north = here.North();
		const south = here.South();
		const east = here.East();
		const west = here.West();
		const valueNorth = this.plan.GetTileValue( north );
		const valueNorthEast = this.plan.GetTileValue( north.East());
		const valueEast = this.plan.GetTileValue( east );
		const valueSouthEast = this.plan.GetTileValue( south.East());
		const valueSouth = this.plan.GetTileValue( south );
		const valueSouthWest = this.plan.GetTileValue( south.West());
		const valueWest = this.plan.GetTileValue( west );
		const valueNorthWest = this.plan.GetTileValue( north.West());

		// if none of the 4 sides of the edge contain this room, we have strayed too far
		const values = [ valueNorth, valueNorthEast, valueEast, valueSouthEast, valueSouth, valueSouthWest, valueWest, valueNorthWest ];
		if( !values.includes( room.roomNumber) ) return;

		this.TestSide( north, valueNorth, here, previous, last, room );
		this.TestSide( south, valueSouth, here, previous, last, room );
		this.TestSide( east, valueEast, here, previous, last, room );
		this.TestSide( west, valueWest, here, previous, last, room );
	}

	FindStartOfNextRoom() {
		const startOfRoom = this.plan.FindFirstUnknownTile( this.lastRoomStart );
		if( !startOfRoom.IsNull() ) this.startOfRoom = startOfRoom;
		return startOfRoom;
	}

	ApplyNumberToRoom( roomNumber, startOfRoom ) {
		// paint the room by applying the room number to the first cell
		// painting a cell also (recursifly) paints the cells beside, above and below it
		this.plan.rooms.push( new Room( roomNumber, startOfRoom ) );
		this.ApplyRoomNumberToTile( roomNumber, startOfRoom );
	}

	ApplyRoomNumberToTile( roomNumber, here ) {
		if( !here.IsValid() ) return;

		switch (this.plan.GetTileValue( here )) {
			case FloorPlan.WALL:
				// a wall -- we're done
				break;

			case FloorPlan.DOOR:
				// a door -- we're done
				break;

			case roomNumber:
				// already painted -- we're done
				break;

			case FloorPlan.UNKNOWN:
				if( !this.plan.IsDoor( here )) {
					this.plan.SetTileValue( here, roomNumber);

					// recurse to the north, south, east and west
					this.ApplyRoomNumberToTile( roomNumber, here.North(), );
					this.ApplyRoomNumberToTile( roomNumber, here.South() );
					this.ApplyRoomNumberToTile( roomNumber, here.East() );
					this.ApplyRoomNumberToTile( roomNumber, here.West() );
				}
				break;
			}
	}

}