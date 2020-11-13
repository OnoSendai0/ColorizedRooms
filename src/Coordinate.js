const INVALID = -1;

module.exports = class Coordinate {
	static maxRow = INVALID;
	static maxCol = INVALID;

	constructor( row, col ) {
		this.row = row;
		this.col = col;
	}

	static SetLimits( maxRow, maxCol ) {
		Coordinate.maxRow = maxRow;
		Coordinate.maxCol = maxCol;
	}

	static Null() {
		return new Coordinate( INVALID, INVALID);
	}

	static Equal( a, b ) {
		return a.row === b.row && a.col === b.col;
	}

	IsNull() {
		return Coordinate.Equal( this, Coordinate.Null() );
	}

	IsValid() {
		// coordinates with negative values are invalid
		if( this.row < 0 ) return false;
		if( this.col < 0 ) return false;

		// if limits have been specified, then values greater than those are invalid
		if( Coordinate.maxRow >= 0 && this.row > Coordinate.maxRow ) return false;
		if( Coordinate.maxCol >= 0 && this.col > Coordinate.maxCol ) return false;

		return true;
	}

	AsString() {
		return `( ${this.row}, ${this.col} )`;
	}

	North() {
		return new Coordinate( this.row - 1, this.col );
	}

	South() {
		return new Coordinate( this.row + 1, this.col );
	}

	East() {
		return new Coordinate( this.row, this.col + 1 );
	}

	West() {
		return new Coordinate( this.row , this.col - 1 );
	}

}