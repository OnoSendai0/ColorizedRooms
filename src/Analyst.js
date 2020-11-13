const FloorPlan = require ('./FloorPlan');
const Coordinate = require('./Coordinate');

module.exports = class Analyst {

	constructor( plan ) {
		this.plan = plan;

		this.lastRoomStart = new Coordinate( 0, 0 );
		this.rooms = [];
		this.edges = [];

	}

	static Colorize = (source, filename, showDebug) => {
		// initialize from source
		let plan = new FloorPlan( source );
		plan.ParseSourceAndInitializeInternals( );

		// display input
		console.log(`\nSource (${filename}):`);
		plan.DumpSource( );

		if( !plan.initialized ) return;

		const analyst = new Analyst( plan );
		analyst.DoAnalysis();

		// dump internal structure for debugging
		if( showDebug ) analyst.DumpInternal();

		console.log("\nOutput:");
		plan.RenderOutput();
	}

	DoAnalysis() {
		// apply room numbers
		let nextRoomNumber = 0;
		let startOfRoom = this.FindStartOfNextRoom();
		while( !startOfRoom.IsNull() ) {
			this.ApplyNumberToRoom( nextRoomNumber++, startOfRoom );
			startOfRoom = this.FindStartOfNextRoom();
		}

	}

	FindStartOfNextRoom() {
		const startOfRoom = this.plan.FindFirstUnknownTile( this.lastRoomStart );
		if( !startOfRoom.IsNull() ) this.startOfRoom = startOfRoom;
		return startOfRoom;
	}

	ApplyNumberToRoom( roomNumber, startOfRoom ) {
		// paint the room by applying the room number to the first cell
		// painting a cell also (recursifly) paints the cells beside, above and below it
		this.rooms.push( { number: roomNumber, start: startOfRoom, color: '' } );
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
//					this.plan.SetTileValue( here, FloorPlan.DOOR);
//					// stop painting
//				} else {
					// apply the room number to this cell
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

	DumpInternal() {
		console.log("\nInternal map:");
		this.plan.DumpInternal();
		console.log(`rooms: ${this.rooms}`);
		console.log(`edges: ${this.edges}`);
	}

}