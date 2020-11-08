const fs = require('fs');
const Palette = require('./Palette');

const WALL = 'W';
const DOOR = 'D';
const UNKNOWN = '.';

module.exports = class FloorPlan {
	source = [];
	rows = [];
	filename = "";

	GetCell( row, col) {
		let value = -1; // out of bounds
		if( row >= 0 && row < this.rows.length) {
			let columns = this.rows[row];
			if( col >=0 && col < columns.length) {
				value = columns[col];
			}
		}
		return value;
	}

	SetCell( row, col, value) {
		if( row >= 0 && row < this.rows.length) {
			let columns = this.rows[row];
			if( col >=0 && col < columns.length) {
				columns[col] = value;
			} else {
				throw `column ${col} is out of bounds`;
			}
		} else {
			throw `row ${row} is out of bounds`;
		}
	}

	IsDoor (row, col ) {
		const here = this.GetCell(row, col);
		if( here == DOOR) return true;

		if( here == UNKNOWN) {
			const north = this.GetCell(row - 1, col);
			const south = this.GetCell(row + 1, col);
			const east = this.GetCell(row, col + 1);
			const west = this.GetCell(row , col - 1);

			if( north == WALL && south == WALL) return true;

			if( east == WALL && west == WALL) return true;
		}

		return false;
	}

	FindStartOfNextRoom() {
		let startOfRoom = null;
		for( let iRow = 0; startOfRoom == null && iRow < this.rows.length; iRow++) {
			let columns = this.rows[iRow];
			for( let iCol = 0; startOfRoom == null && iCol < columns.length; iCol++) {
				if( columns[iCol] == UNKNOWN) {
					startOfRoom = { row: iRow, col: iCol };
				}
			}
		}
		return startOfRoom;
	}

	PaintRoom( startOfRoom, roomNumber) {
		// paint the room by applying the room number to the first cell
		// painting a cell also (recursifly) paints the cells beside, above and below it
		this.PaintCell (startOfRoom.row, startOfRoom.col, roomNumber);
	}

	PaintCell( row, col, roomNumber) {
		switch (this.GetCell(row, col)) {
			case WALL:
				// a wall -- we're done
				break;

			case DOOR:
				// a door -- we're done
				break;

			case roomNumber:
				// already painted -- we're done
				break;

			case UNKNOWN:
				if( this.IsDoor(row, col)) {
					this.SetCell( row, col, DOOR);
					// stop painting
				} else {
					// apply the room number to this cell
					this.SetCell( row, col, roomNumber);

					// recurse to the north, south, east and west
					this.PaintCell( row - 1, col, roomNumber);
					this.PaintCell( row + 1, col, roomNumber);
					this.PaintCell( row, col + 1, roomNumber);
					this.PaintCell( row, col - 1, roomNumber);
				}
				break;
			}
	}

	LoadFromFile( file ) {
		try {
			// store the original source as an array of lines
			var contents = fs.readFileSync(file, 'utf-8');
			this.source = contents.split("\n");

			this.filename = file;

			// create an empty copy with 'W' for walls and '.' for unprocessed cells
			let line, columns;
			for( let iRow = 0; iRow < this.source.length; iRow++ ) {
				line = this.source[iRow];
				columns = [];
				for( let iCol = 0; iCol < line.length; iCol++ ) {
					switch( line.charAt(iCol)) {
						case '#':
							columns.push(WALL); // wall
							break;
						case ' ':
							columns.push(UNKNOWN); // door or floor
							break;
						case '\l':
							// ignore linefeed
							break;
						case '\r':
							// ignore carriage return
							break;
						default:
							throw `Invalid characater '${line.charAt(iCol)}' found at row ${iRow}, column ${iCol} in file ${file}`;
					}
				}
				this.rows.push(columns);
			}
		} catch (e) {
			console.log (e);
		}
	}

	DumpSource() {
		console.log(`\nSource (${this.filename}):`);
		this.source.forEach( line => {
			console.log(line);
		})
	}

	DumpInternal() {
		console.log("\nInternal map:");
		this.rows.forEach( columns => {
			let line = "";
			columns.forEach( cell => {
				line += cell;
			})
			console.log(line);
		})
	}

	RenderOutput( ) {
		console.log("\nOutput:");
		const palette = new Palette();
		this.rows.forEach( columns => {
			let line = "";
			columns.forEach( cell => {
				switch (cell) {
					case WALL:
						line += '#';
						break;

					case DOOR:
						line += ' ';
						break;

					default:
						line += palette.GetOutputStringForCell( ' ', palette.GetColorByIndex(cell) );
				}
			});
			console.log(line);
		})
	}
}