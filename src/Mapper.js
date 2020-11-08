const FloorPlan = require ('./FloorPlan');

module.exports = class Mapper {
	Colorize = (file) => {
		console.log(`\ncolorizing ${file}`);
		let plan = new FloorPlan();
		plan.LoadFromFile(file);
		plan.DumpSource();

		let nextRoomNumber = 0;
		let startOfRoom = plan.FindStartOfNextRoom();
		while(startOfRoom != null) {
			plan.PaintRoom( startOfRoom, nextRoomNumber++);
			startOfRoom = plan.FindStartOfNextRoom();
		}
		plan.DumpInternal();
	}

}