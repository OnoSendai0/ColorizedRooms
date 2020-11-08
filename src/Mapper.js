const FloorPlan = require ('./FloorPlan');

module.exports = class Mapper {

	constructor() {
		
	}

	Colorize = (file) => {
		console.log(`\ncolorizing ${file}`);
		let plan = new FloorPlan();
		plan.LoadFromFile(file);
		plan.DumpSource();
		plan.DumpInternal();
	}

}