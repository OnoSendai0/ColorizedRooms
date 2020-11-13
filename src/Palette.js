module.exports = class Palette {

	colors = [ 41, 42, 43, 44, 45, 46 ];

	static DefaultColor = 40;

	GetColorByIndex(index) {
		if( isNaN(index) ) return Palette.DefaultColor;
		return this.colors[ index % this.colors.length];
	}

	static GetOutputStringForCell( character, color) {
		const colorCode = `\u001b[${color};1m`;
		const resetCode = '\u001b[0m';
		return `${colorCode}${character}${resetCode}`;
	}
}