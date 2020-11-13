const Palette = require('./Palette');
const Coordinate = require('./Coordinate');

module.exports = class FloorPlan {

	constructor( source ) {
		this.source = source; // input
		this.rows = []; // internal grid

		this.initialized = false;
		this.inputError = null;
		}

	static WALL = 'W';
	static DOOR = 'D';
	static UNKNOWN = '.';
	static OUTOFBOUNDS = -1;

	ParseSourceAndInitializeInternals( ) {
		try {
			// create an empty copy with 'W' for walls and '.' for unprocessed cells
			let line, columns;
			let inputWidth = -1; // unspecified
			for( let iRow = 0; iRow < this.source.length; iRow++ ) {
				line = this.source[iRow];

				columns = [];
				for( let iCol = 0; iCol < line.length; iCol++ ) {
					switch( line.charAt(iCol)) {
						case '#':
							columns.push(FloorPlan.WALL); // wall
							break;
						case ' ':
							columns.push(FloorPlan.UNKNOWN); // door or floor
							break;
						case '\l':
							// ignore linefeed
							break;
						case '\r':
							// ignore carriage return
							break;
						default:
							throw `Invalid characater '${line.charAt(iCol)}' found at row ${iRow}, column ${iCol}`;
					}
				}

				// check that all lines are the same length
				if( inputWidth !== columns.length) {
					if( inputWidth === -1 ) {
						// this is our fist line; it defines the width
						inputWidth = columns.length;
					} else {
						// this is a mismatch so abort
						throw `line ${iRow}: length (${columns.length}) does not match length of first line (${inputWidth})`;
					}
				}

				this.rows.push(columns);
			}

			// parsing was successful
			this.initialized = true;

			// set the upper limit for valid rows and columns
			Coordinate.SetLimits( this.rows.length - 1, inputWidth );
		} catch (e) {
			this.inputError = e;
		}
	}

	GetTileValue( tile ) {
		return tile.IsValid() ? this.rows[tile.row][tile.col] : FloorPlan.OUTOFBOUNDS;
	}

	SetTileValue( tile, value) {
		if( tile.IsValid() ) {
			this.rows[tile.row][tile.col] = value;
		} else {
			throw `cell(${tile.row},${tile.col}) is out of bounds`;
		}
	}

	IsDoor ( cell ) {
		const valueHere = this.GetTileValue( cell );
		if( valueHere == FloorPlan.DOOR) return true;

		if( valueHere == FloorPlan.UNKNOWN) {
			const valueNorth = this.GetTileValue( cell.North() );
			const valueSouth = this.GetTileValue( cell.South() );
			const valueEast = this.GetTileValue( cell.East() );
			const valueWest = this.GetTileValue( cell.West() );

			if( ( valueNorth == FloorPlan.WALL && valueSouth == FloorPlan.WALL) || ( valueEast == FloorPlan.WALL && valueWest == FloorPlan.WALL) ) {
				this.SetTileValue( cell, FloorPlan.DOOR );
				return true;
			}
		}

		return false;
	}

	FindFirstUnknownTile( start ) {
		for( let iRow = start.row; iRow < this.rows.length; iRow++) {
			const colStart = (iRow === start.row) ? start.col : 0;
			let columns = this.rows[iRow];
			for( let iCol = colStart; iCol < columns.length; iCol++) {
				if( columns[iCol] == FloorPlan.UNKNOWN) {
					const here = new Coordinate( iRow, iCol );
					// the first unknonwn space might be a door so verify it isn't before considering this a room
					if( !this.IsDoor( here ) ) return here;
				}
			}
		}
		return Coordinate.Null();
	}

	DumpSource() {
		this.source.forEach( line => {
			console.log(line);
		});

		if (this.inputError !== null)
			console.log(this.inputError);
	}

	DumpInternal() {
		this.rows.forEach( columns => {
			let line = "";
			columns.forEach( col => {
				line += col;
			})
			console.log(line);
		});
	}

	RenderOutput( ) {
		const palette = new Palette();
		this.rows.forEach( columns => {
			let line = "";
			columns.forEach( col => {
				switch (col) {
					case FloorPlan.WALL:
						line += Palette.GetOutputStringForCell( '#', Palette.DefaultColor );
						break;

					case FloorPlan.DOOR:
						line += Palette.GetOutputStringForCell( ' ', Palette.DefaultColor );
						break;

					default:
						line += Palette.GetOutputStringForCell( ' ', palette.GetColorByIndex(col) );
				}
			});
			console.log(line);
		})
	}
}