const fs = require('fs');

module.exports = class FloorPlan {
	source = [];
	cells = [];

	constructor() {
	}

	LoadFromFile( file ) {
		try {
			// store the original source as an array of lines
			var contents = fs.readFileSync(file, 'utf-8');
			this.source = contents.split("\n");

			// create an empty copy with 'W' for walls and '.' for unprocessed cells
			let srcLine, dstLine;
			for( let iRow = 0; iRow < this.source.length; iRow++ ) {
				srcLine = this.source[iRow];
				dstLine = "";
				for( let iCol = 0; iCol < srcLine.length; iCol++ ) {
					switch( srcLine.charAt(iCol)) {
						case '#':
							dstLine += 'W'; // wall
							break;
						case ' ':
							dstLine += '.'; // door or floor
							break;
						case '\l':
							// ignore linefeed
							break;
						case '\r':
							// ignore carriage return
							break;
						default:
							throw `Invalid characater '${srcLine.charAt(iCol)}' found at row ${iRow}, column ${iCol} in file ${file}`;
					}
				}
				this.cells.push(dstLine);
			}
		} catch (e) {
			console.log (e);
		}
	}

	DumpSource() {
		console.log("\nSource file:");
		this.source.forEach( line => {
			console.log(line);
		})
	}

	DumpInternal() {
		console.log("\nInternal map:");
		this.cells.forEach( line => {
			console.log(line);
		})
	}}