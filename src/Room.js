const Coordinate = require('./Coordinate');

module.exports = class Room {

	static NOCOLOR = -1;

	constructor( roomNumber, start ) {
		this.roomNumber = roomNumber;
		this.start = start;
		this.color = Room.NOCOLOR;
		this.neighbours = new Map();
	}

	AsString() {
		let neighbours = "[ ";
		for (let key of this.neighbours.keys()) {
			neighbours += `${key} `;
		}
		neighbours += "]";
		return `{ number: ${this.roomNumber}, start: ${this.start.AsString()}, color: ${this.color}, neighbours: ${neighbours} }`;
	}

	AddNeighbour( roomNumber ) {
		if( !this.neighbours.has( roomNumber ) ) {
			this.neighbours.set( roomNumber );
		}
	}

}